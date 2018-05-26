module.exports = {
    //首页
    'GET /': async (ctx, next) => {
        ctx.render('index.html', { })
    }
}