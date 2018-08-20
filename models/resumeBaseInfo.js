
const db = require('../middlewares/db')
const moment = require('moment')
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
    'welcomeMsg':{
        type:db.STRING(300),
        allowNull:false
    },
    'jobDesc':{
        type:db.STRING(300),
        allowNull:false
    },
    'description':{
        type:db.STRING(1000),
        allowNull:false
    },
    'mobile':{
        type:db.STRING(20),
        allowNull:false
    },
    'birth':{
        type:db.DATE,
        allowNull:true,
        get(){
            return moment(this.getDataValue('birth')).format('YYYY-MM-DD');
        }
    },
    'avatar': {type:db.STRING(100),allowNull:true} //头像
})