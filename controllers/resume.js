const resumeService = require('../service/resume')
const validator = require('../utils/validator')
const APIError = require('../middlewares/rest').APIError
const CONST = require('../utils/constant')
module.exports={
    //保存简历基本信息
    'POST /api/resume/baseInfo/save': async (ctx, next) => {
        let resume = ctx.request.body
        let rules={
            name:[{required:true,message:'姓名必填'}],
            gender:[{required:true,message:'性别必填'}],
            email:[{required:true,message:'邮箱必填'}],
            mobile:[{required:true,message:'手机号必填'}],
            birth:[{type:'date',message:'必填'}],
        }
        let ret = validator(resume,rules)
        if(ret){
            throw new APIError(CONST.RET_ERROR_PARAM_ERR,ret)
        }
        let saved = resumeService.saveBaseInfo(resume)
        ctx.restOK(saved,'保存简历基本信息成功')
    },
    //查询简历列表
    'GET /api/resume/list': async (ctx, next) => {
        ctx.restList(list)
    }
}