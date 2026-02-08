
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
  prompt: '?  ~ ',
  version: '1.0.0',
  initialDirectory: 'Droit',
  bootCmd: 'intro'
}

function App() {
   return <Terminal cmd={cmd} config={config} />
}

export default App;
