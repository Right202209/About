import { personalInfo, links } from './info'

const getTime = () => {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    return `${hours}${minutes < 10 ? ':0' : ':'}${minutes}${seconds < 10 ? ':0' : ':'}${seconds}`
  }

  const introduction = [
    `Welcome to ${personalInfo.name}.`,
    {
      type: 'system',
      label: 'System',
      content: `cd ${personalInfo.name}`
    },
    {
      type: 'system',
      label: 'System',
      content: 'Thanks for your visit, let me introduce myself.'
    },
    {
      time: getTime(),
      type: 'info',
      label: 'Name:',
      content: personalInfo.name
    },
    {
      time: getTime(),
      type: 'info',
      label: 'Sex:',
      content: personalInfo.sex
    },
    {
      time: getTime(),
      type: 'info',
      label: 'Age:',
      content: personalInfo.age
    },
    {
      time: getTime(),
      type: 'info',
      label: 'Email:',
      content: personalInfo.email
    },
    {
      time: getTime(),
      type: 'info',
      label: 'Aim:',
      content: `${personalInfo.aims.length} goals as follows:`
    },
    ...personalInfo.aims.map((aim, index) => ({
      type: 'black',
      label: `=> ${index + 1}.`,
      content: aim
    }))
  ]

  const dynamicCommands = {
    intro: {
      description: 'Introducting myself again.',
      run(print) {
        let i = 0
        return new Promise(resolve => {
          const interval = setInterval(() => {
            print(introduction[i])
            i++
            if (!introduction[i]) {
              clearInterval(interval)
              resolve({ type: 'success', label: 'Done', content: 'Myself introduction is over!' })
            }
          }, 500)
        })
      }
    },
    echo: {
      description: 'Echoes input.',
      run(print, input) {
        return new Promise(resolve => {
          print({
            time: getTime(),
            label: 'Echo',
            type: 'success',
            content: input
          })
          resolve({ type: 'success', label: '', content: '' })
        })
      }
    },
    open: {
      description: 'Open a specified url in a new tab.',
      run(print, input) {
        return new Promise((resolve) => {
          if (!input) {
            resolve({ type: 'error', label: 'Error', content: 'a url is required!' })
            return
          }
          if (!input.startsWith('http')) {
            resolve({ type: 'error', label: 'Error', content: 'Please add `http` prefix!' })
            return
          }
          print({ type: 'success', label: 'Success', content: 'Opening' })

          window.open(input, '_blank')
          resolve({ type: 'success', label: 'Done', content: 'Page Opened!' })
        })
      }
    },
    menu: {
      description: 'Open my menu in a new tab.',
      run(print) {
        return new Promise((resolve) => {
          print({ type: 'success', label: 'Success', content: 'Opening' })

          window.open(links.menu, '_blank')
          resolve({ type: 'success', label: 'Done', content: ':)' })
        })
      }
    },
    resume: {
      description: 'Open my resume in a new tab.',
      run(print) {
        return new Promise((resolve) => {
          print({ type: 'success', label: 'Success', content: 'Opening' })

          window.open(links.resume, '_blank')
          resolve({ type: 'success', label: 'Done', content: ':)' })
        })
      }
    },
    2048: {
      description: 'Open a 2048 Game in a new tab.',
      run(print) {
        return new Promise((resolve) => {
          print({ type: 'success', label: 'Success', content: 'Opening' })

          window.open(links.game2048, '_blank')
          resolve({ type: 'success', label: 'Done', content: 'Game Start!' })
        })
      }
    }
  }

  export default dynamicCommands
