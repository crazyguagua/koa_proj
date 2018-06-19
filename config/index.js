let configTest = './config-test'
let configDev = './config-dev'
let configProd = './config-prod'
let config
if(process.env.NODE_ENV === 'production'){
    config = require(configProd)
}else if(process.env.NODE_ENV === 'test'){
    config = require(configDev)
}else{
    config = require(configTest)
}
module.exports = config