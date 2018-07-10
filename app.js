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

syslog(`process.env.NODE_ENV=[${process.env.NODE_ENV}]`)
const isProduction = process.env.NODE_ENV ==='production'
syslog(`current env:${isProduction?'生产环境':'开发环境'}`)

const rest = require('./middlewares/rest')

const app = new Koa()
const port = 3002
app.use(async(ctx,next)=>{
    console.log(`method:${ctx.request.method},url${ctx.request.url}`)
    await next()
})
app.use(async (ctx,next)=>{
    let now = new Date()
    await next()
    console.log(`time cost ${new Date()-now}`)
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


app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}))

app.use(rest.restify())

//路由放到后面
app.use(controller())

app.listen(port)
console.log(`server start on port ${port}`)