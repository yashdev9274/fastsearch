import { faker } from '@faker-js/faker'
import { neon } from '@neondatabase/serverless'
import { Index } from '@upstash/vector'
import * as dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/neon-http'
import { vectorize } from '../lib/vectorize'
import { charactersTable } from './schema'

dotenv.config()

const index = new Index()

async function main() {
  const connector = neon(process.env.DATABASE_URL!)
  // @ts-expect-error neon-drizzle
  const db = drizzle(connector)

  const characters: (typeof charactersTable.$inferInsert)[] = []

  const characterImageIDs = [

    {
      imageId: 'boruto_uzumaki.png',
      description:
        'Boruto Uzumaki (Uzumaki Boruto) is a missing-ninja from Konohagakures Uzumaki clan and a direct descendant of the Hyūga clan through his mother. While initially resentful of his father and his absence since becoming Hokage, Boruto eventually comes to respect his father and duties.',
    },
    {
      imageId: 'naruto_uzumaki.png',
      description:
        'Naruto Uzumaki ( Uzumaki Naruto) is a shinobi of Konohagakures Uzumaki clan. He became the jinchūriki of the Nine-Tails on the day of his birth — a fate that caused him to be shunned by most of Konoha throughout his childhood.',
    },
    {
      imageId: 'akamaru.png',
      description:
        'Akamaru is a nin-dog ( ninken) from Konohagakures Inuzuka clan. He is Kiba Inuzukas partner, as well as his best friend and constant companion. He is also a member of Team Kurenai.',
    },
    {
      imageId: 'choji_akimichi.png',
      description:
        'Chōji Akimichi ( Akimichi Chōji) is a member of Konohagakures Akimichi Clan. Though sensitive about his weight, Chōji is nevertheless dedicated to his friends, especially in Team Asuma.',
    },
    {
      imageId: 'sasuke_uchiha.png',
      description:
        'Sasuke Uchiha ( Uchiha Sasuke) is one of the last surviving members of Konohagakures Uchiha clan. After his older brother, Itachi, slaughtered their clan, Sasuke made it his mission in life to avenge them by killing Itachi. He is added to Team 7 upon becoming a Shinobi, and, through competition with his rival and best friend, Naruto Uzumaki, ',
    },
    {
      imageId: 'kakashi_hatake.png',
      description:
        'Kakashi Hatake ( Hatake Kakashi) is a shinobi of Konohagakures Hatake clan. Famed as Kakashi of the Sharingan ( Sharingan no Kakashi) and the Copy Ninja ( Kopī Ninja), he is one of Konohas most talented ninja, regularly looked to for advice and leadership despite his personal dislike of responsibility.',
    },
    {
      imageId: 'gaara.png',
      description:
        'Gaara (Gaara) is the Fifth Kazekage of Sunagakure, known for his mastery of sand-based ninjutsu. Once feared as a ruthless jinchuriki, he became a symbol of peace and unity among the ninja villages.',
    },
    {
      imageId: 'hinata_hyuga.png',
      description:
        'Hinata Hyuga (Hyūga Hinata) is a kunoichi of Konohagakure\'s Hyuga clan and a member of Team 8. Known for her Byakugan and gentle nature, she becomes a strong and confident ninja.',
    },
    {
      imageId: 'itachi_uchiha.png',
      description:
        'Itachi Uchiha (Uchiha Itachi) was a prodigy of Konohagakure\'s Uchiha clan. A member of the Akatsuki, he sacrificed his reputation and life to protect his village and younger brother, Sasuke.',
    },
    {
      imageId: 'jiraiya.png',
      description:
        'Jiraiya (Jiraiya) was one of the Legendary Sannin of Konohagakure and a renowned author. He trained several powerful ninjas, including Naruto Uzumaki, and was known for his mastery of sage mode.',
    },
    {
      imageId: 'neji_hyuga.png',
      description:
        'Neji Hyuga (Hyūga Neji) was a prodigious shinobi of Konohagakure\'s Hyuga clan. Known for his exceptional Byakugan skills, he overcame his clan\'s internal struggles and became a symbol of change.',
    },
    {
      imageId: 'orochimaru.png',
      description:
        'Orochimaru (Orochimaru) is one of the Legendary Sannin and a former rogue ninja of Konohagakure. He is known for his quest for immortality and mastery of forbidden techniques.',
    },
    {
      imageId: 'sakura_haruno.png',
      description:
        'Sakura Haruno (Haruno Sakura) is a kunoichi of Konohagakure and a member of Team 7. She is known for her medical ninjutsu and immense strength under Tsunade\'s tutelage.',
    },
    {
      imageId: 'shikamaru_nara.png',
      description:
        'Shikamaru Nara (Nara Shikamaru) is a shinobi of Konohagakure\'s Nara clan and a member of Team 10. Known for his strategic brilliance, he becomes a key figure in Konoha\'s leadership.',
    },
    {
      imageId: 'tsunade.png',
      description:
        'Tsunade (Tsunade) is one of the Legendary Sannin and the Fifth Hokage of Konohagakure. Known for her incredible strength and medical expertise, she played a vital role in Konoha\'s recovery after the Fourth Shinobi World War.',
    },
    {
      imageId: 'zabuza_momochi.png',
      description:
        'Zabuza Momochi (Momochi Zabuza) was a rogue ninja from Kirigakure, known as the Demon of the Hidden Mist. He wielded the Kubikiribocho and was one of the Seven Ninja Swordsmen of the Mist.',
    },

  ]

  characterImageIDs.forEach(({ description, imageId }, i) => {
    characters.push({
      id: (i + 1).toString(),
      name: formatFileName(imageId),
      description,
      imageId,
    })
  })

  characters.forEach(async (character) => {
    await db.insert(charactersTable).values(character).
      onConflictDoNothing()

  })

  // characters.forEach(async (character) => {
  //   await db.insert(charactersTable).values(character).onConflictDoNothing()

  //   await index.upsert({
  //     id: character.id!,
  //     vector: await vectorize(`${character.name}: ${character.description}`),
  //     metadata: {
  //       id: character.id,
  //       name: character.name,
  //       description: character.description,
  //       imageId: character.imageId,
  //     },
  //   })
  // })
}


// 'dark_down_jacket_1.png' -> 'Dark Down Jacket 1'
function formatFileName(fileName: string): string {
  const nameWithoutExtension = fileName.replace(/\.\w+$/, '')
  const words = nameWithoutExtension.split('_')

  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  )
  return capitalizedWords.join(' ')
}

main()
