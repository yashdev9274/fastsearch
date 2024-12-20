import { db } from '@/db';
import { Characters, charactersTable } from '@/db/schema';
import { vectorize } from '@/lib/vectorize';
import { Index } from '@upstash/vector';
import { sql } from 'drizzle-orm';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export type CoreProduct = Omit<Characters, 'createdAt' | 'updatedAt'>;

const index = new Index<CoreProduct>();

const Page = async ({ searchParams }: PageProps) => {
  const query = searchParams.query;

  if (Array.isArray(query) || !query) {
    return redirect('/');
  }

  let characters: CoreProduct[] = await db
    .select()
    .from(charactersTable)
    .where(
      sql`to_tsvector('simple', lower(${charactersTable.name} || ' ' || ${charactersTable.description
        })) @@ to_tsquery('simple', lower(${query
          .trim()
          .split(' ')
          .join(' & ')}))`
    )
    .limit(3);

  if (characters.length < 3) {
    try {
      // Perform semantic search with vectorization
      const vector = await vectorize(query);

      const res = await index.query({
        topK: 5,
        vector,
        includeMetadata: true,
      });

      const vectorcharacters = res
        .filter((existingProduct) => {
          if (
            characters.some((product) => product.id === existingProduct.id) ||
            existingProduct.score < 0.9
          ) {
            return false;
          } else {
            return true;
          }
        })
        .map(({ metadata }) => metadata!);

      characters.push(...vectorcharacters);
    } catch (error: any) {
      console.error('Error in semantic search:', error.message || error);
    }
  }

  if (characters.length === 0) {
    return (
      <div className='text-center py-4 bg-white shadow-md rounded-b-md'>
        <X className='mx-auto h-8 w-8 text-gray-400' />
        <h3 className='mt-2 text-sm font-semibold text-gray-900'>No results</h3>
        <p className='mt-1 text-sm mx-auto max-w-prose text-gray-500'>
          Sorry, we couldn't find any matches for{' '}
          <span className='text-green-600 font-medium'>{query}</span>.
        </p>
      </div>
    );
  }

  return (
    <ul className='py-4 divide-y divide-zinc-100 bg-white shadow-md rounded-b-md'>
      {characters.slice(0, 3).map((product) => (
        <Link key={product.id} href={`/characters/${product.id}`}>
          <li className='mx-auto py-4 px-8 flex space-x-4'>
            <div className='relative flex items-center bg-zinc-100 rounded-lg h-40 w-40'>
              <Image
                loading='eager'
                fill
                alt='product-image'
                src={`/${product.imageId}`}
              />
            </div>

            <div className='w-full flex-1 space-y-2 py-1'>
              <h1 className='text-lg font-medium text-gray-900'>
                {product.name}
              </h1>

              <p className='prose prose-sm text-gray-500 line-clamp-3'>
                {product.description}
              </p>

              {/* <p className='text-base font-medium text-gray-900'>
                ${product.price.toFixed(2)}
              </p> */}
            </div>
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default Page;
