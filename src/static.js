import { contacts, skills, cartoons, books } from './info'

export default {
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
    }
  }
