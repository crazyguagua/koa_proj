const resumeService = require('../service/resume')
const validator = require('../utils/validator')
const APIError = require('../middlewares/rest').APIError
const CONST = require('../utils/constant')
module.exports={
    //登录
    'POST /api/login': async (ctx, next) => {

    },
    //添加
    'POST /api/user/add': async(ctx,next)=>{
        let user = ctx.request.body
        let rules={
            account:[{required:true,message:'帐号必填'}],
            pwd:[{required:true,message:'密码必填'}],
            email:[{required:true,message:'邮箱必填'}]
        }
        let ret = validator(user,rules)
        if(ret){
            throw new APIError(CONST.RET_ERROR_PARAM_ERR,ret)
        }

    }
}