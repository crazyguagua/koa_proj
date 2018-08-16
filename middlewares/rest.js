var timeoutFunMap = new Map();
// const mylog4js = require('./log4js')
// const sysLogger = mylog4js.getLogger('system')
// const syslog = sysLogger.info.bind(sysLogger)

module.exports = {
    timeoutFunMap: timeoutFunMap,
    APIError: function (code, message) {
        this.code = code || -999;
        this.message = message || '内部:未知错误';
    },
    restify: (pathPrefix) => {
        var loginPathPrefix = pathPrefix || '/userapi/';
        pathPrefix = pathPrefix || '/api/';

        return async (ctx, next) => {
            var isRest = false;
            if (ctx.request.path.startsWith(pathPrefix) || ctx.request.path.startsWith(loginPathPrefix)) {
                syslog(`Process API ${ctx.request.method} ${ctx.request.url}...`);
                isRest = true;
                const rest = (data, httpCode) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                    if (httpCode) {
                        ctx.response.status = httpCode;
                    }
                }
                ctx.restOK = (data,msg,code, httpCode) => {
                    let ret = {}
                    if(data) ret.data = data
                    if(msg) ret.retMsg = msg
                    ret.retCode = code||1
                    rest(ret,200)
                }
                ctx.restObj = (data=null,msg="操作成功",code, httpCode) => {
                    let ret = {}
                    if(data) ret.obj = data
                    if(msg) ret.retMsg = msg
                    ret.retCode = code||1
                    rest(ret,200)
                }
                ctx.restError = (msg,code, httpCode) => {
                    rest({
                        retMsg:msg,
                        retCode:code
                    },200)
                }
                ctx.restList = (list,total,msg,code)=>{
                    rest({
                        list:list,
                        total:total,
                        retMsg:msg||'操作成功',
                        retCode:1
                    })
                }
                if (ctx.request.path.startsWith(loginPathPrefix) && !ctx.session.user) {
                    ctx.rest({code: 'login:must_login', message: '请先登录'}, 400);
                    return;
                }
            } else if (ctx.request.path.startsWith('/my/user/')) {
                if ( !ctx.session.user ) {
                    let loginSuccUrl = ctx.query.loginSuccUrl || ctx.request.path || '/my/';
                    ctx.response.redirect('/my/login?loginSuccUrl=' + loginSuccUrl);
                    //ctx.render('login.html');
                    return;
                }
            } 

            try {
                await next();
                if (ctx.transaction) ctx.transaction.commit();
                if (ctx.timeoutFun) {
                    let taskTimeOutId = setTimeout(ctx.timeoutFun, ctx.timeoutFunTime);
                    timeoutFunMap.set(ctx.timeoutFunKey, taskTimeOutId);
                }
            } catch (e) {
                syslog('Process error: ' + JSON.stringify(e));
                if (e.stack) console.log(e.stack);
                if (ctx.transaction) ctx.transaction.rollback();
                if (isRest) {
                    ctx.restError(e.message,e.code);
                } else {
                    //throw e;
                    //let msg = "系统出现错误";
                    //if (typeof e == "string") msg = e;
                    //ctx.response.redirect('/static/html/500.html?msg=' + encodeURI(msg));
                    // ctx.response.redirect('/static/html/500.html');
                    ctx.restError('系统出现错误',500)
                }
            }
        };
    }
};