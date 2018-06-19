
const db = require('../middlewares/db')
module.exports=db.defineModel('user',{
    'account':{
        type:db.STRING(100),
        unique:true,
        allowNull:true
    },
    'pwd':{
        type:db.STRING(100),
        allowNull:true
    },
    'email':{
        type:db.STRING(100),
        allowNull:true
    },
    'gender':{
        type:db.INTEGER,
        allowNull:true
    },
    'mobile':{
        type:db.STRING(20),
        allowNull:true
    }
    
})