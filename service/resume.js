//简历 service
const model = require('../middlewares/model')
const resumeBaseInfo = model.resumeBaseInfo
const APIError = require('../middlewares/rest').APIError
const CONST = require('../utils/constant')
const sequelize = model.sequelize
const fs = require('fs')
const moment = require('moment')
const updateBaseInfo=async (baseInfo,files)=>{
    let updateObj={
        id:baseInfo.id
    }
    let resume = await resumeBaseInfo.findOne({where: {id:baseInfo.id}});
    if(!resume){
        throw new APIError(CONST.RET_DATA_NOT_EXSIST,`${id}简历不存在`)
    }
    let transaction = await sequelize.transaction()
    try{
        if(files){
            const reader = fs.createReadStream(files.path);
            let fileName = files.name
            let fArr = fileName.split('.')
            let extName = fArr.pop()
            let fName = fArr.pop()
            let dir =  `upload/${moment(new Date()).format('YYYY-MM-DD')}`
            if (!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            let filePath = `${dir}/${fName}-${Math.random().toString()}.${extName}`;
            const upStream = fs.createWriteStream(filePath);        // 创建可写流
            reader.pipe(upStream);
            // 删除原来的图片
            let oldPicPath = resume.avatar
            if(oldPicPath && fs.existsSync(oldPicPath)){
                fs.unlinkSync(oldPicPath)
            }

            baseInfo.avatar = filePath
        }else{
            baseInfo.avatar = resume.avatar //没修改头像的情况
        }
        //版本加1 
        baseInfo.version = resume.version+1
        baseInfo.updatedAt =  moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        resumeBaseInfo.update(baseInfo,{where:{id:baseInfo.id}},{transaction: transaction} )
        transaction.commit();
    }catch(e){
        syslog(e.stack);
        if (transaction) transaction.rollback();
        throw new APIError(CONST.RET_SAVE_ERR,`保存简历失败`)
    }
    
}
module.exports={
    saveBaseInfo: async (baseInfo,files) => {
        
        if (baseInfo.id&&baseInfo.id!=='undefined') {
            await updateBaseInfo(baseInfo,files)
        }else{
            
            let resume = await resumeBaseInfo.findOne({where:{name: baseInfo.name}});
            if(resume){
                throw new APIError(CONST.RET_ERROR_UNIQUE,`${baseInfo.name}的简历已存在`)
            }
            let transaction;
            try {   
                transaction = await sequelize.transaction();

                const reader = fs.createReadStream(files.path);
                let fileName = files.name
                let fArr = fileName.split('.')
                let extName = fArr.pop()
                let fName = fArr.pop()
                let dir =  `upload/${moment(new Date()).format('YYYY-MM-DD')}`
                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                let filePath = `${dir}/${fName}-${Math.random().toString()}.${extName}`;
                const upStream = fs.createWriteStream(filePath);        // 创建可写流
                reader.pipe(upStream);
                baseInfo.avatar = filePath    
                resume = await resumeBaseInfo.create(baseInfo,{ transaction: transaction });
                transaction.commit();
            } catch (e) {
                syslog(e.stack);
                if (transaction) transaction.rollback();
                throw new APIError(CONST.RET_SAVE_ERR,`保存简历失败`)
            }
            return resume;
        }
    },
   
    findBaseInfoPage: async ({offset,limit,q})=>{
        var orderArr = [['updatedAt','Desc']];
        let where ={};
        if(q&&Object.keys(q).length>0){
            let $or =[];
            $or.push({
                name:{$like: '%' + q.name + '%'}
            })
            where.$or = $or;
        }
        
        var list = await resumeBaseInfo.findAndCountAll({
            where: where,
            limit: limit,
            offset: parseInt(offset),
            order: orderArr
        });
        //console.log(JSON.stringify(products));
        return list;

    },
    delete: async (resumeId)=>{
        await resumeBaseInfo.destroy({
            where:{'id':resumeId}
        })
    },
    findById: async(resumeId)=>{
        let resume = await resumeBaseInfo.findOne({where: {'id':resumeId}});
        return resume
    }

}