const Koa = require('koa')

// const model = require('./middlewares/model') //在controller加载完之前 先加载model
const controller = require('./middlewares/controller')

const mylog4js = require('./middlewares/log4js')
const session = require("koa-session2");
const templating = require('./middlewares/templating')
// const db = require('./middlewares/db')


const staticFile = require('./middlewares/static-file')


const sysLogger = mylog4js.getLogger('system');

const syslog = sysLogger.info.bind(sysLogger)

const bodyParser = require('koa-bodyparser');
const koaBody = require('koa-body');
const uuid = require('node-uuid');

syslog(`process.env.NODE_ENV=[${process.env.NODE_ENV}]`)
const isProduction = process.env.NODE_ENV ==='production'
syslog(`current env:${isProduction?'生产环境':'开发环境'}`)

const rest = require('./middlewares/rest')

const app = new Koa()
const port = 3002

app.use(async (ctx, next) => {
    
    let logid = uuid.v4().replace(/-/g, "");
    sysLogger.addContext('logid', logid);
    syslog(`处理请求【 ${ctx.request.method} ${ctx.request.url}】...`);
    var
        start = new Date().getTime(),
        execTime;
        
    await next();

    syslog("ctx.response.status=" + ctx.response.status);
    // if (ctx.response.status == 404) {
    //     ctx.response.redirect('/static/html/404.html');
    // }

    ctx.response.set('logid', logid);
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`); 
})

app.use(session({
    key:'SESSIONID',
    maxAge:30*60*1000
}))

app.use(staticFile('/static/', __dirname + '/static'));

app.use(koaBody({ 
    multipart: true,
    formidable: {
        maxFileSize: 200 * 1024 * 1024 //设置上传文件大小最大限制，默认2M
    } 
}));
// parse request body:
app.use(bodyParser());
const saveParams = async (ctx,next)=>{
    let paraStr = JSON.stringify(ctx.request.body)

    syslog(`【 ${ctx.request.method} ${ctx.request.url}】请求参数【${paraStr}】...`)
    await next()
}
app.use(saveParams)

app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}))

app.use(rest.restify())

//路由放到后面
app.use(controller())

app.listen(port)
console.log(`server start on port ${port}`)