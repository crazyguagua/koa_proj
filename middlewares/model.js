const fs = require('fs');
const db = require('./db');
let files = fs.readdirSync('./models');


let js_files = files.filter((value,index)=>{
    return value.endsWith('.js')
})

console.log(js_files)

js_files.forEach(element => {
    let name = element.substring(0,element.length-3);
    let f = require(`../models/${name}`);
    console.log(f)
    module.exports[name,f];
});

module.exports.sync= async ()=>{
    await db.sync()
}