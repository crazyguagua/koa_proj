//简历 service
const model = require('../middlewares/model')
const resumeBaseInfo = model.resumeBaseInfo
const APIError = require('../middlewares/rest').APIError
const CONST = require('../utils/constant')
module.exports={
    saveBaseInfo: async (baseInfo) => {
        
        if (baseInfo.id) {
            let whereObj = new Object()
            whereObj.id = baseInfo.id;
            let resume = await resumeBaseInfo.findOne({where: whereObj});
        }else{
        
            let resume = await resumeBaseInfo.findOne({name: baseInfo.name});
            if(resume){
                throw new APIError(CONST.RET_ERROR_UNIQUE,`${baseInfo.name}的简历已存在`)
            }
            resume = await resumeBaseInfo.create(baseInfo)
            return resume;
        }
    },
}