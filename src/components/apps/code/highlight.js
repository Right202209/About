const JS_KEYWORDS = 'const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|from|export|default|async|await|try|catch|finally|throw|typeof|instanceof|of|in|this|null|undefined|true|false';

const RULES = {
  javascript: [
    ['comment', /\/\/[^\n]*|\/\*[\s\S]*?\*\//],
    ['string', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/],
    ['keyword', new RegExp(`\\b(?:${JS_KEYWORDS})\\b`)],
    ['number', /\b\d+(?:\.\d+)?\b/],
    ['function', /\b[A-Za-z_$][\w$]*(?=\s*\()/],
    ['property', /(?<=\.)[A-Za-z_$][\w$]*/]
  ],
  html: [
    ['comment', /<!--[\s\S]*?-->/],
    ['tag', /<\/?[A-Za-z][\w-]*|\/?>|<!doctype/i],
    ['string', /"[^"\n]*"|'[^'\n]*'/],
    ['attribute', /\b[a-z-]+(?==)/]
  ],
  css: [
    ['comment', /\/\*[\s\S]*?\*\//],
    ['property', /[a-z-]+(?=\s*:)/],
    ['number', /#[\da-f]{3,8}\b|\b\d+(?:\.\d+)?(?:px|em|rem|%|s|ms|vh|vw)?\b/i],
    ['tag', /[.#]?[A-Za-z][\w-]*(?=[^{}]*\{)/],
    ['string', /"[^"\n]*"|'[^'\n]*'/]
  ],
  markdown: [
    ['keyword', /^#{1,6} [^\n]*/m],
    ['string', /`[^`\n]+`/],
    ['tag', /^\s*[-*+] |^\s*\d+\. /m],
    ['property', /\*\*[^*\n]+\*\*/]
  ],
  plaintext: []
};

const EXTENSIONS = { js: 'javascript', mjs: 'javascript', jsx: 'javascript', html: 'html', htm: 'html', css: 'css', md: 'markdown' };
export const LANGUAGE_LABELS = { javascript: 'JavaScript', html: 'HTML', css: 'CSS', markdown: 'Markdown', plaintext: 'Plain Text' };
export const languageOf = name => EXTENSIONS[name.split('.').pop().toLowerCase()] || 'plaintext';

/* Split source into [className, text] tokens with one combined regex per language. */
export function tokenize(source, language) {
  const rules = RULES[language] || [];
  if (!rules.length) return [[null, source]];
  const pattern = new RegExp(rules.map(([, rule]) => `(${rule.source})`).join('|'), 'gim'.replace(language === 'javascript' ? 'i' : '', ''));
  const tokens = [];
  let last = 0;
  for (const match of source.matchAll(pattern)) {
    if (!match[0]) continue;
    if (match.index > last) tokens.push([null, source.slice(last, match.index)]);
    const group = match.slice(1).findIndex(value => value !== undefined);
    tokens.push([rules[group][0], match[0]]);
    last = match.index + match[0].length;
  }
  if (last < source.length) tokens.push([null, source.slice(last)]);
  return tokens;
}
