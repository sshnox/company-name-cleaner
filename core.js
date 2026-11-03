/* Company Name Cleaner. MIT license; see LICENSE. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CompanyNameCleaner = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const suffix = /,?\s*\b(L\.?L\.?C\.?|Incorporated|Inc\.?|Ltd\.?|Limited|L\.?L\.?P\.?|L\.?P\.?|Co\.|Corp\.?|Corporation|PLC|GmbH|Kft\.?)\.?\s*$/i;
  const emoji = /\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\p{Emoji_Modifier})?)*/gu;
  function clean(name, options = {}) {
    if (typeof name !== 'string') throw new TypeError('Company name must be a string');
    let s = name.normalize('NFC').trim();
    // Conservative mode keeps brand descriptors and parenthetical text.
    if (options.removeDescriptors === true) {
      s = s.replace(/\s*\([^)]*\)/g, '');
      s = s.split(/\||:\s+|\s+-\s*/)[0];
    }
    s = s.replace(emoji, '').replace(/[™®]/g, '').trim();
    let prev;
    do {
      prev = s;
      if (!/&\s*Co\.?\s*$/i.test(s)) s = s.replace(suffix, '').trim();
    } while (s !== prev);
    return s.replace(/\s+/g, ' ').trim();
  }
  function parseCSV(text) {
    if (typeof text !== 'string') throw new TypeError('CSV must be a string');
    text = text.replace(/^\uFEFF/, '');
    if (!text) return [];
    const rows = []; let row = [], cell = '', quoted = false, closed = false;
    const pushCell = () => { row.push(cell); cell = ''; closed = false; };
    const pushRow = () => { pushCell(); rows.push(row); row = []; };
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"') {
          if (text[i + 1] === '"') { cell += '"'; i++; }
          else { quoted = false; closed = true; }
        } else cell += c;
      } else if (c === ',') pushCell();
      else if (c === '\r' || c === '\n') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        pushRow();
      } else if (closed) throw new Error('Unexpected character after a closing CSV quote');
      else if (c === '"') {
        if (cell) throw new Error('A CSV quote must start at the beginning of a field');
        quoted = true;
      } else cell += c;
    }
    if (quoted) throw new Error('CSV contains an unclosed quoted field');
    if (cell || row.length || closed) pushRow();
    return rows;
  }
  function csvCell(value, options = {}) {
    let s = String(value ?? '');
    // Spreadsheet applications can execute formula-like cells, even when quoted.
    if (options.protectFormulas !== false && /^\s*[=+\-@]/u.test(s)) s = "'" + s;
    return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function toCSV(rows, options = {}) {
    return rows.map(row => row.map(value => csvCell(value, options)).join(',')).join('\r\n');
  }
  return { clean, parseCSV, csvCell, toCSV };
});
