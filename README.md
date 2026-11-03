# Company Name Cleaner

Clean company names in outreach lists without sending the list to a server. The browser app and reusable JavaScript core preserve international text and brand casing. No runtime dependencies.

## Browser app

Download or clone this repository and open `index.html` in a modern browser. Keep `core.js` in the same folder.

1. Paste one company name per line, or import a CSV file.
2. For CSV, choose the company column and explicitly select whether the first row is a header.
3. Leave conservative cleaning enabled by keeping the descriptor-removal checkbox unchecked. Enable it only when you want to remove taglines and parenthetical text.
4. Click **Clean names**, review the original/cleaned comparison, and download the CSV.

Try `examples/companies.csv` with **Company column 2** and **First row is a header** selected. All names and contacts in that sample are illustrative.

## Cleaning behavior

| Input | Default output |
| --- | --- |
| `Acme LLC` | `Acme` |
| `Müller GmbH` | `Müller` |
| `شاہ ٹیکنالوجیز` | `شاہ ٹیکنالوجیز` |
| `Smith & Co.` | `Smith & Co.` |
| `AGRI-SEARCH` | `AGRI-SEARCH` |
| `Acme (UK) \| Research` | Unchanged |

The default removes supported trailing legal suffixes and emoji/trademark marks, normalizes Unicode to NFC and collapses whitespace. It preserves capitalization, commas, accents and non-Latin scripts. Descriptor removal is opt in because these words can be part of the actual brand. Review every export before using it.

## Reusable JavaScript API

This repository includes a CommonJS module and a browser global. It is prepared for packaging but has **not been published to npm**. Use a local checkout:

```js
const { clean, parseCSV, toCSV } = require('./core.js');

clean('Müller GmbH'); // 'Müller'
clean('Acme (UK) | Research', { removeDescriptors: true }); // 'Acme'

const rows = parseCSV('Contact,Company\r\nAlex,"Acme, Inc."');
const output = rows.slice(1).map(row => [row[1], clean(row[1])]);
console.log(toCSV([['Original', 'Cleaned'], ...output]));
```

For browser use, load `core.js`; the same functions are available as `CompanyNameCleaner.clean`, `.parseCSV`, `.csvCell` and `.toCSV`.

### CSV handling

The parser supports quoted commas, escaped double quotes, multiline fields, LF/CRLF/CR line endings, and a UTF-8 byte-order mark. Malformed quoting produces an error rather than silently corrupting data. It expects comma-separated CSV, with no whitespace between a closing quote and a delimiter.

Exports prefix formula-like values with an apostrophe to reduce spreadsheet formula execution risk. This deliberately changes those values. For a machine-only round trip, `toCSV(rows, { protectFormulas: false })` disables that protection. Do not disable it when opening untrusted values in spreadsheet software.

## Development

Use Node.js 18 or later:

```sh
npm test
npm pack --dry-run
```

No `npm install` is needed. Tests cover international text, conservative cleaning, malformed CSV, quoted/multiline fields, round trips and spreadsheet export escaping. CI runs the suite on Node.js 18, 20, 22 and 24.

## Limitations

- Legal suffixes can also be legitimate brand words. Review results.
- No semantic understanding, company verification or automatic deduplication.
- Imports and results are held in browser memory; large files can slow the interface.
- CSV column selection extracts company names; export contains original and cleaned names, not all source columns.
- Font assets load from Google Fonts when online; input data is processed locally. System font fallbacks work offline.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Reproducible bugs and useful tests are welcome. Use synthetic examples instead of private lead data.

## License

MIT. You may use and modify the software, including commercially, subject to the license. Include the copyright and permission notice in copies or substantial portions. See [LICENSE](LICENSE).

Built by [Shoaib Shah](https://github.com/sshnox).
