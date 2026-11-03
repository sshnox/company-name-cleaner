# Contributing

Bug reports, tests, accessibility improvements and documented cleaning patterns are welcome.

## Report a cleaning problem

Use a fictional or public company name. Include the original text, expected result, selected options and why that change is appropriate. Never attach private lead lists or personal contact details. A rule should not damage other legitimate names.

## Run locally

Clone the repository, then open index.html in a modern browser. Keep core.js beside it. For regression tests, use Node.js 18 or later and run `npm test`; no dependency installation is required.

## Submit a change

1. Fork the repository and create a branch.
2. Add a regression test in tests/core.test.js showing the problem.
3. Make the smallest relevant fix in core.js or the browser interface.
4. Run `npm test` and `npm pack --dry-run`.
5. Open a pull request describing the problem, behavior change and verification.

Conservative behavior is the default. Destructive transformations need an explicit option and examples of the tradeoff. Preserve international text and brand casing. Avoid adding one-off company overrides to the default rules.

Useful areas for contributions: CSV error reporting with row numbers, keyboard and screen-reader testing, documented legal suffixes from additional jurisdictions, and performance with large synthetic CSV files.
