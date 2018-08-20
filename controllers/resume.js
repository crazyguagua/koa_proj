const resumeService = require('../service/resume')
const validator = require('../utils/validator')
const APIError = require('../middlewares/rest').APIError
const CONST = require('../utils/constant')
module.exports={
    //保存简历基本信息
    'POST /api/resume/baseInfo/save': async (ctx, next) => {
        let resume = ctx.request.body
        let files = ctx.request.files.file;
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
        let saved = await resumeService.saveBaseInfo(resume,files) //如果不写 await 就直接返回操作成功了
        ctx.restOK(saved,'保存简历基本信息成功')
    },
    //查询简历列表
    'POST /api/resume/list': async (ctx, next) => {
        let params = ctx.request.body
        let offset = params.startRow
        let limit = params.maxSize
        let q=params.q;
        if(isNaN(offset)||isNaN(limit)){
            throw new APIError(CONST.RET_ERROR_NO_PAGE_PARAM,'分页接口需指定offset和limit')
        }
        let list = await resumeService.findBaseInfoPage({offset,limit,q})
        list.rows.forEach(element => {
            let avatar = element.avatar
            element.avatar = avatar?`http://localhost:3002/${avatar}`:null
        });
        ctx.restList(list.rows,list.count);
    },

    //删除简历
    'GET /api/resume/delete/:resumeId': async (ctx,next)=>{
        let resumeId = ctx.params.resumeId
        if(!resumeId||resumeId=='undefined'){
            throw new APIError(CONST.RET_PARAM_ERR,"简历id未指定")
        }
        await resumeService.delete(resumeId)
       
        ctx.restOK(null,'删除简历成功')

    },

    //根据id查询
    'GET /api/resume/:resumeId': async (ctx,next)=>{
        let resumeId = ctx.params.resumeId
        if(!resumeId||resumeId=='undefined'){
            throw new APIError(CONST.RET_PARAM_ERR,"简历id未指定")
        }
        let resume = await resumeService.findById(resumeId)
        resume.avatar=resume.avatar?`http://localhost:3002/${resume.avatar}`:null
        ctx.restObj(resume)
    },

    //保存个人简介
    'POST /api/resume/saveDescription': async(ctx,next)=>{
        let description = ctx.request.body
        let resumeId = description.id
        if(!resumeId){
            throw new APIError(CONST.RET_PARAM_ERR,"简历id未指定")
        }
        let rules={
            'welcomeMsg':[{required:true,message:'欢迎语必填'}],
            'jobDesc':[{required:true,message:'职业描述必填'}],
            'description':[{required:true,message:'描述必填'}]
        }
        let ret = validator(description,rules)
        if(ret){
            throw new APIError(CONST.RET_ERROR_PARAM_ERR,ret)
        }
        await resumeService.saveDescription(description)
        ctx.restOK(null,"修改个人简介成功");
    }
}