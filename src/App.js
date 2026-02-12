
// function App() {
//   return (
//     <div className="App">
      
//     </div>
//   );
// }

import Terminal from 'react-terminal-app'

// 可参考: https://github.com/Tomotoes/react-terminal/blob/master/demo/src/commands
import staticList from './static'
import dynamicList from './dynamic'

const cmd = {
  dynamicList,
  staticList
}

const config = {
  prompt: '➜  ~ ',
  version: '1.0.0',
  initialDirectory: 'Droit',
  bootCmd: 'intro'
}

function App() {
  const desktopUrl = `${process.env.PUBLIC_URL}/macos26-desktop.jpg`
  return (
    <div className="desktop">
      <div
        className="desktop__bg"
        style={{ backgroundImage: `url('${desktopUrl}'), var(--desktop-fallback)` }}
        aria-hidden="true"
      />
      <div className="desktop__glow" aria-hidden="true" />
      <div className="desktop__content">
        <Terminal className="terminal terminal--robbyrussell" cmd={cmd} config={config} />
      </div>
    </div>
  )
}

export default App;
