// Neutral desktop content: Finder files, Safari favorites, and sample documents.
// Nothing here identifies a person; edit freely to furnish the desktop.

export const finderItems = [
  { name: 'Projects', type: 'folder', place: 'Projects', locations: ['Home', 'Desktop'] },
  { name: 'Notes', type: 'folder', place: 'Documents', locations: ['Home', 'Desktop'] },
  { name: 'Pictures', type: 'folder', place: 'Pictures', locations: ['Home', 'Desktop'] },
  { name: 'Welcome.txt', type: 'document', app: 'about', payload: { help: true }, locations: ['Home', 'Documents', 'Desktop'] },
  { name: 'hello.js', type: 'code', app: 'code', locations: ['Home', 'Projects'] },
  { name: 'macOS wallpaper.jpg', type: 'image', url: `${process.env.PUBLIC_URL}/macos26-desktop.jpg`, locations: ['Pictures', 'Downloads'] }
];

export const safariHome = 'https://www.apple.com';

export const safariFavorites = [
  { icon: 'globe', name: 'Apple', url: 'https://www.apple.com' },
  { icon: 'document', name: 'Wikipedia', url: 'https://www.wikipedia.org' },
  { icon: 'code', name: 'MDN', url: 'https://developer.mozilla.org' },
  { icon: 'github', name: 'GitHub', url: 'https://github.com' },
  { icon: 'game', name: '2048', url: 'https://play2048.co' }
];

export const sampleCode = {
  folder: 'playground',
  file: 'hello.js',
  language: 'JavaScript',
  lines: [
    "const greeting = 'Hello, world!';",
    '',
    "function greet(name = 'friend') {",
    "  return greeting + ' Nice to meet you, ' + name + '.';",
    '}',
    '',
    'console.log(greet());'
  ]
};

export const macSpecs = [
  { label: 'Chip', value: 'Apple M-series' },
  { label: 'Memory', value: '16 GB' },
  { label: 'Startup disk', value: 'Macintosh HD' },
  { label: 'macOS', value: 'Tahoe 26' }
];
