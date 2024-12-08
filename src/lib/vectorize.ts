import { openai } from './openai';

const cache = new Map<string, number[]>();

// Helper function to retry with exponential backoff
const retryWithExponentialBackoff = async (
    fn: () => Promise<number[]>,
    retries: number
): Promise<number[]> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            if (attempt === retries || error.response?.status !== 429) {
                throw error;
            }
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.warn(`Retrying... Attempt ${attempt} failed.`);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new Error('Retries failed.');
};

const vectorizeOnce = async (input: string): Promise<number[]> => {
    const embeddingResponse = await openai.embeddings.create({
        input,
        model: 'text-embedding-ada-002',
    });
    return embeddingResponse.data[0].embedding;
};

export const vectorize = async (input: string): Promise<number[]> => {
    // Check the cache first
    if (cache.has(input)) {
        return cache.get(input)!;
    }

    // Perform API call with retry logic
    try {
        const vector = await retryWithExponentialBackoff(
            () => vectorizeOnce(input),
            3
        );
        cache.set(input, vector); // Cache the result
        return vector;
    } catch (error: any) {
        console.error('Error in vectorize:', error.message || error);
        throw new Error(
            'Failed to vectorize input. Please try again later or check your API quota.'
        );
    }
};
