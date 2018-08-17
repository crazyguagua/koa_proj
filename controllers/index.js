let models = require('../middlewares/model')
const resumeId = '1f5d7dcb-aad0-4c60-a9b6-136594b8fabb'
const resumeService = require('../service/resume')
module.exports = {
    //首页
    'GET /': async (ctx, next) => {
        //查询出个人简历
        let resume = await resumeService.findById(resumeId)
        ctx.render('index.html', { 
            resume:resume
        })
    }
}