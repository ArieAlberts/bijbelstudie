import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'blockquote', 'em', 'strong', 'cite', 'br',
  'ul', 'ol', 'li', 'a', 'code', 'pre', 'span', 'div',
  'header', 'article', 'section', 'hr', 'mark', 'sub', 'sup'
];

const ALLOWED_ATTR = ['href', 'title', 'target', 'rel', 'class', 'id', 'dir', 'lang'];

/**
 * Sanitizes dirty HTML strings using DOMPurify with strict whitelist rules.
 * Preserves semantic tags (h2, p, blockquote, em, cite, etc.) while blocking
 * scripts, inline styles, event handlers, and unsafe URLs.
 * 
 * @param {string} dirtyHtml
 * @returns {string} Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export function sanitizeHtml(dirtyHtml) {
  if (!dirtyHtml) return '';
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'style'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style']
  });
}
