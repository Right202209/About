// Neutral desktop content: Finder files, Safari favorites, and sample documents.
// Nothing here identifies a person; edit freely to furnish the desktop.

export const finderItems = [
  { name: 'Projects', type: 'folder', place: 'Projects', locations: ['Home', 'Desktop'] },
  { name: 'Notes', type: 'folder', place: 'Documents', locations: ['Home', 'Desktop'] },
  { name: 'Pictures', type: 'folder', place: 'Pictures', locations: ['Home', 'Desktop'] },
  { name: 'Welcome.txt', type: 'document', app: 'about', payload: { help: true }, locations: ['Home', 'Documents', 'Desktop'] },
  { name: 'hello.js', type: 'code', app: 'code', payload: { file: 'hello.js' }, locations: ['Home', 'Projects'] },
  { name: 'index.html', type: 'code', app: 'code', payload: { file: 'index.html' }, locations: ['Projects'] },
  { name: 'macOS wallpaper.jpg', type: 'image', url: `${process.env.PUBLIC_URL}/macos26-desktop.jpg`, locations: ['Pictures', 'Downloads'] }
];

export const safariHome = 'start://favorites';
export const safariSearch = 'https://www.google.com/search?igu=1&q=';

// Sites that allow being shown inside another page (no X-Frame-Options / frame-ancestors).
export const safariFavorites = [
  { name: 'Wikipedia', url: 'https://en.m.wikipedia.org/wiki/MacOS', color: '#1f1f1f', letter: 'W' },
  { name: 'Google', url: 'https://www.google.com/webhp?igu=1', color: '#4285f4', letter: 'G' },
  { name: 'Hacker News', url: 'https://news.ycombinator.com', color: '#ff6600', letter: 'Y' },
  { name: 'Dockbar', url: 'https://dock.oooo.so/?style=macos', color: '#7a5af8', letter: 'D' },
  { name: 'Excalidraw', url: 'https://excalidraw.com', color: '#6965db', letter: 'E' },
  { name: 'Desmos', url: 'https://www.desmos.com/calculator', color: '#2f8d46', letter: 'd' },
  { name: 'three.js', url: 'https://threejs.org/examples/', color: '#111', letter: '3' },
  { name: 'First Website', url: 'https://info.cern.ch', color: '#5a6b7b', letter: 'C' }
];

// Hosts known to refuse framing; Safari offers to open them in a real tab instead.
export const safariBlockedHosts = ['apple.com', 'github.com', 'developer.mozilla.org', 'bing.com', 'duckduckgo.com', 'youtube.com', 'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'openai.com', 'lit.dev', 'codepen.io', 'neal.fun', 'vuejs.org', 'play2048.co', 'baidu.com', 'bilibili.com', 'zhihu.com', 'taobao.com'];

const helix = number => `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${number}.mp3`;
const song = (number, duration, album) => ({ id: `helix-${number}`, title: `SoundHelix Song ${number}`, artist: 'T. Schürger', album, duration, src: helix(number) });

// Royalty-free generated tracks from soundhelix.com, grouped into three albums.
export const musicAlbums = [
  { id: 'aurora', title: 'Aurora', artist: 'T. Schürger', year: 2009, colors: ['#ff7a8a', '#7b2ff7'] },
  { id: 'meridian', title: 'Meridian', artist: 'T. Schürger', year: 2010, colors: ['#36d1dc', '#2b4fbd'] },
  { id: 'lumen', title: 'Lumen', artist: 'T. Schürger', year: 2011, colors: ['#f7b733', '#fc4a1a'] }
];

export const musicSongs = [
  song(1, 373, 'aurora'), song(2, 426, 'aurora'), song(3, 344, 'aurora'), song(4, 303, 'aurora'),
  song(5, 354, 'meridian'), song(6, 280, 'meridian'), song(7, 421, 'meridian'), song(8, 325, 'meridian'),
  song(9, 389, 'lumen'), song(10, 527, 'lumen'), song(11, 551, 'lumen'), song(12, 514, 'lumen')
];

export const musicPlaylists = [
  { id: 'focus', title: 'Focus', songs: ['helix-6', 'helix-4', 'helix-8', 'helix-3'] },
  { id: 'long', title: 'Long Drives', songs: ['helix-11', 'helix-10', 'helix-12', 'helix-2'] }
];

export const codeWorkspace = 'playground';

export const codeFiles = [
  // eslint-disable-next-line no-template-curly-in-string
  { name: 'hello.js', content: "const greeting = 'Hello, world!';\n\nfunction greet(name = 'friend') {\n  return `${greeting} Nice to meet you, ${name}.`;\n}\n\nconsole.log(greet());\nconsole.log([1, 2, 3].map(n => n * n));\n" },
  { name: 'index.html', content: '<!doctype html>\n<html>\n  <head>\n    <link rel="stylesheet" href="styles.css">\n  </head>\n  <body>\n    <h1>Hello from the playground</h1>\n    <p>Edit this file, then press Run to preview it.</p>\n    <button onclick="this.textContent = \'Clicked!\'">Click me</button>\n  </body>\n</html>\n' },
  { name: 'styles.css', content: 'body {\n  font-family: -apple-system, sans-serif;\n  padding: 32px;\n  color: #1d1d1f;\n}\n\nh1 {\n  color: #0a84ff;\n}\n' },
  { name: 'README.md', content: '# playground\n\n- Click a file in the Explorer to open it.\n- Press Run (or Ctrl/Cmd + Enter) to run JavaScript or preview HTML.\n- Ctrl/Cmd + S saves your changes in this browser.\n' }
];

export const defaultNotes = [
  { id: 'welcome', text: 'Welcome to Notes\n\nType anything here. Notes are saved in this browser.', updated: 0 },
  { id: 'ideas', text: 'Ideas\n\n- Try Mission Control (F3 or Ctrl + ↑)\n- Open Launchpad from the Dock\n- Play something in Music', updated: 0 }
];

export const macSpecs = [
  { label: 'Chip', value: 'Apple M-series' },
  { label: 'Memory', value: '16 GB' },
  { label: 'Startup disk', value: 'Macintosh HD' },
  { label: 'macOS', value: 'Tahoe 26' }
];
