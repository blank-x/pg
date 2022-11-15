const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

function generateTpl(data = []){
  const str = data.map(item=>{
    return `<li><a href="${item}">${item}</a></li>`
  }).join('<br />')
  const tpl = `
<style>
    ul li{
        list-style: none;
    }
    a{
        text-decoration: none;
    }
</style>
<ul>${str}</ul>
`
  return tpl;
}

function read(dir=''){
  const _result = []

  function _read(_dir){
    const files = fs.readdirSync(path.resolve(cwd, _dir) )
    files.filter((file)=>{
      return !['node_modules', '.git', '.idea'].includes(file)
    }).forEach((file)=>{
      const isDirectory = fs.statSync(path.resolve(cwd, _dir, file)).isDirectory();
      if(isDirectory){
        _read(path.join(_dir, file))
        return;
      }
      const isFile = fs.statSync(path.resolve(cwd, _dir, file)).isFile();
      if(isFile && file.endsWith('.html')){
        _result.push(path.join(_dir, file));
      }
    })
  }
  _read(dir)
  return _result;
}
try{
  fs.unlinkSync(path.resolve(cwd, 'README.md'))
}catch (e) {}
const result = read();
const tpl = generateTpl(result);

fs.writeFileSync(path.resolve(cwd, 'README.md'),tpl,{encoding:'utf8'})
