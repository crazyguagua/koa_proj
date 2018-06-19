const model = require('./middlewares/model');

(async ()=>{
    await model.sync();
    
})();