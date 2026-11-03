const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const core=require('../core.js');
function app(){
 class Element{
  constructor(){this.value='';this.checked=false;this.textContent='';this.innerHTML='';this.style={};this.children=[];this.listeners={};this.options=this.children;this.files=[];this.classList={add(){},remove(){}};}
  get innerHTML(){return this._html || this.textContent.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  set innerHTML(value){this._html=value;if(this.children)this.children.length=0;}
  addEventListener(name,fn){this.listeners[name]=fn;}
  appendChild(child){this.children.push(child);}
  replaceChildren(){this.children.length=0;}
  click(){this.listeners.click?.();}
 }
 const elements=new Map();
 const document={getElementById(id){if(!elements.has(id))elements.set(id,new Element());return elements.get(id)},createElement(){return new Element()}};
 document.getElementById('inputMode').value='names';
 document.getElementById('companyColumn').value='0';
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 const script=html.split('<script>')[1].split('</script>')[0];
 vm.runInNewContext(script,{CompanyNameCleaner:core,document,Blob,URL,FileReader:class{}});
 return {elements,document};
}
test('interface processes pasted international names and preserves commas',()=>{
 const {document:d}=app();
 d.getElementById('input').value='Müller GmbH\nشاہ ٹیکنالوجیز\nAcme, Research';
 d.getElementById('processBtn').click();
 assert.equal(d.getElementById('statTotal').textContent,3);
 assert.match(d.getElementById('tbody').children[0].innerHTML,/Müller/);
 assert.match(d.getElementById('tbody').children[1].innerHTML,/شاہ/);
 assert.equal(d.getElementById('statChanged').textContent,1);
});
test('interface selects the company column after an explicit CSV header',()=>{
 const {document:d}=app();
 d.getElementById('inputMode').value='csv';
 d.getElementById('hasHeader').checked=true;
 d.getElementById('companyColumn').value='1';
 d.getElementById('input').value='Person,Company\r\nAlex,"Acme, Inc."\r\nSam,"Müller\nGmbH"';
 d.getElementById('processBtn').click();
 assert.equal(d.getElementById('statTotal').textContent,2);
 assert.equal(d.getElementById('statChanged').textContent,2);
 assert.match(d.getElementById('tbody').children[1].innerHTML,/Müller/);
});
test('malformed CSV hides previous results and clear resets the error',()=>{
 const {document:d}=app();
 d.getElementById('inputMode').value='csv';
 d.getElementById('input').value='"unclosed';
 d.getElementById('processBtn').click();
 assert.match(d.getElementById('error').textContent,/unclosed/);
 assert.equal(d.getElementById('results').style.display,'none');
 d.getElementById('clearBtn').click();
 assert.equal(d.getElementById('error').textContent,'');
 assert.equal(d.getElementById('input').value,'');
});
