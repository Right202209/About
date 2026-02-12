import { contacts, skills, cartoons, books } from './info'

const nameAsciiArt = [
  'DDDD   RRRR   OOO    III  TTTTT',
  'D   D  R   R O   O    I     T  ',
  'D   D  RRRR  O   O    I     T  ',
  'D   D  R R   O   O    I     T  ',
  'DDDD   R  RR  OOO    III    T  '
]

const staticCommands = {
  contact: {
    description: 'Return a list of my contact information.',
    list: contacts.map(c => ({
      type: 'info',
      label: c.label,
      content: c.content
    }))
  },
  skill: {
    description: 'Return a list of my skills and my rating of them.',
    list: skills
  },
  cartoon: {
    description: 'Return a list of cartoons that I have watched.',
    list: cartoons
  },
  book: {
    description: 'Return a list of books that I have not read, may I need read some of these.',
    list: books
  },
  ascii: {
    description: 'Display large ASCII art of my name.',
    list: nameAsciiArt
  },
  name: {
    description: 'Display large ASCII art of my name.',
    list: nameAsciiArt
  }
}

export default staticCommands
