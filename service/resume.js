//简历 service
const model = require('../middlewares/model')
const resumeBaseInfo = model.resumeBaseInfo
module.exports={
    saveBaseInfo: async (baseInfo) => {
        
        if (baseInfo.id) {
            let whereObj = new Object()
            whereObj.id = baseInfo.id;
            let resume = await resumeBaseInfo.findOne({where: whereObj});
        }else{
            let resume = await resumeBaseInfo.create(baseInfo)
            return resume;
        }
    },
}