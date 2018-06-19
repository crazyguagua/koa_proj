const Koa = require('koa')
const controller = require('./middlewares/controller')
const mylog4js = require('./middlewares/log4js')
const session = require("koa-session2");
const templating = require('./middlewares/templating')
// const db = require('./middlewares/db')
const model = require('./middlewares/model')

const staticFile = require('./middlewares/static-file')


const sysLogger = mylog4js.getLogger('system');

const syslog = sysLogger.info.bind(sysLogger)
syslog(`process.env.NODE_ENV=[${process.env.NODE_ENV}]`)
const isProduction = process.env.NODE_ENV ==='production'
syslog(`current env:${isProduction?'生产环境':'开发环境'}`)

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
    
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}))

//路由放到后面
app.use(controller())

app.listen(port)
console.log(`server start on port ${port}`)