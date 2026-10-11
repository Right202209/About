import { safariBlockedHosts, safariFavorites, safariHome, safariSearch } from '../../../content';

export const START_PAGE = safariHome;

/* Turn whatever was typed into a URL: a web address, or a search. */
export function resolveInput(input) {
  const text = input.trim();
  if (!text) return START_PAGE;
  if (text === START_PAGE) return text;
  const looksLikeUrl = /^[a-z]+:\/\//i.test(text) || (/^[^\s]+\.[^\s]{2,}$/.test(text) && !text.includes(' ')) || /^localhost(:\d+)?/.test(text);
  if (!looksLikeUrl) return safariSearch + encodeURIComponent(text);
  try {
    const url = new URL(/^[a-z]+:\/\//i.test(text) ? text : `https://${text}`);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : safariSearch + encodeURIComponent(text);
  } catch {
    return safariSearch + encodeURIComponent(text);
  }
}

export function hostOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

export function isBlocked(url) {
  const host = hostOf(url);
  return safariBlockedHosts.some(blocked => host === blocked || host.endsWith(`.${blocked}`));
}

export function titleFor(url) {
  if (url === START_PAGE) return 'Start Page';
  const favorite = safariFavorites.find(item => item.url === url);
  if (favorite) return favorite.name;
  try {
    const parsed = new URL(url);
    if (parsed.searchParams.get('q') && parsed.hostname.includes('google')) return `${parsed.searchParams.get('q')} - Google Search`;
    return hostOf(url);
  } catch { return url; }
}

export function displayAddress(url) {
  return url === START_PAGE ? '' : hostOf(url);
}
