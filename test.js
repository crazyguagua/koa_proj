const resumeService = require('./service/resume')
const begin = new Date();
const quantity = 100000;
for(var i=0;i<quantity;i++){
    let obj={
        "name":`guage${i}`,
        "gender":1,
        "email":"xxx@xx.com",
        "mobile":"18094231131",
        "birth":"1989-12-27"
    }
    resumeService.saveBaseInfo(obj);
}
//不是同步的。。。。。。下面的没用
const end = new Date();
const cost = end.getTime()-begin.getTime();
console.log(`============================= save ${quantity} const ${cost}ms`)