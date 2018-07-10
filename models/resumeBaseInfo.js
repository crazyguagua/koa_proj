
const db = require('../middlewares/db')
module.exports=db.defineModel('resumeBaseInfo',{
    'name':{
        type:db.STRING(100),
        unique:true,
        allowNull:false
    },
    'gender':{
        type:db.INTEGER,
        allowNull:false
    },
    'email':{
        type:db.STRING(100),
        allowNull:false
    },
    'mobile':{
        type:db.STRING(20),
        allowNull:false
    },
    'avatar': {type:db.STRING(100),allowNull:true} //头像
})