const {test}=require('node:test');
const assert=require('node:assert/strict');
const {clean,parseCSV,csvCell,toCSV}=require('../core.js');
for(const [input,expected] of [
 ['  Acme LLC  ','Acme'],['Müller GmbH','Müller'],['École SAS','École SAS'],
 ['شاہ ٹیکنالوجیز','شاہ ٹیکنالوجیز'],['株式会社サンプル','株式会社サンプル'],
 ['Acme LLC Ltd','Acme'],['Smith & Co.','Smith & Co.'],['AGRI-SEARCH','AGRI-SEARCH'],
 ['NASA Research','NASA Research'],['eBay Inc.','eBay'],['Acme (UK) | Research','Acme (UK) | Research'],
 ['Acme 🚀™ LLC','Acme'],['toString','toString'],['',''],
 ['COLLIER LEGAL SEARCH','COLLIER LEGAL SEARCH'],['Acme, Research','Acme, Research']
])test(`clean preserves or normalizes ${JSON.stringify(input)}`,()=>assert.equal(clean(input),expected));
test('descriptors are explicitly opt in',()=>assert.equal(clean('Acme (UK) | Research',{removeDescriptors:true}),'Acme'));
test('normalizes combining accents',()=>assert.equal(clean('Cafe\u0301 LLC'),'Café'));
test('rejects non-string input',()=>assert.throws(()=>clean(null),TypeError));
test('quoted comma, escaped quote, CRLF and multiline field',()=>assert.deepEqual(parseCSV('Name,Company\r\nA,"Acme, Inc."\r\nB,"A ""Good""\nCompany"\r\n'),[['Name','Company'],['A','Acme, Inc.'],['B','A "Good"\nCompany']]));
test('UTF-8 BOM and empty final fields',()=>assert.deepEqual(parseCSV('\uFEFFa,b,\n'),[['a','b','']]));
test('empty input has no records',()=>assert.deepEqual(parseCSV(''),[]));
test('quoted empty input is one field',()=>assert.deepEqual(parseCSV('""'),[['']]));
for(const input of ['"unclosed','abc"def','"abc"oops'])test(`reject malformed CSV ${input}`,()=>assert.throws(()=>parseCSV(input)));
test('CSV round trip preserves international text and CRs',()=>{
 const rows=[['Company','Note'],['Müller','a\rb'],['شاہ','"quotes", and\nlines'],['','']];
 assert.deepEqual(parseCSV(toCSV(rows)),rows);
});
test('spreadsheet formulas are escaped by default',()=>{
 for(const value of ['=1+1','+SUM(A1)','-1+2','@SUM(A1)','  =HYPERLINK("x")'])assert.ok(csvCell(value).includes("'"));
});
test('formula escaping can be disabled for programmatic round trips',()=>assert.deepEqual(parseCSV(toCSV([['=raw']],{protectFormulas:false})),[['=raw']]));
test('CSV serializer quotes carriage returns',()=>assert.equal(csvCell('a\rb'),'"a\rb"'));
