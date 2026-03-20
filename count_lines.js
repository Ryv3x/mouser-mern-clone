const fs = require('fs');
const path = require('path');
function walk(dir){
  let arr = [];
  try{
    fs.readdirSync(dir,{withFileTypes:true}).forEach(d=>{
      const p = path.join(dir,d.name);
      // skip node_modules and .git folders
      if (p.includes('node_modules') || p.includes('.git')) return;
      if(d.isFile()) arr.push(p);
      else if(d.isDirectory()) arr = arr.concat(walk(p));
    });
  }catch(e){}
  return arr;
}
const dirs = ['backend','frontend'];
let files = [];
dirs.forEach(d=>{ if(fs.existsSync(d)) files.push(...walk(d)); });
let total=0;
files.forEach(f=>{
  try{ const c = fs.readFileSync(f,'utf8').split(/\n/).length; total += c; }
  catch(e){}
});
console.log('TOTAL_FILES:'+files.length);
console.log('TOTAL_LINES:'+total);
