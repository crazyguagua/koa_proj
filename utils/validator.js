const validatorMap = {
    required: function ({ val, key, obj, message = `${key}不能为空` }) {
        return val ? false : message
    },
    pattern: function ({ val, key, obj, message = `${key}格式错误` }) {
        if (!val) {
            return false
        }
        return val.toString().test(pattern) ? false : message
    },
    date: function ({ val, key, obj, message = `${key}格式错误` }) {
        if (!val) {
            return false
        }
        var result = val.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

        if (result == null)
            return false;
        var d = new Date(result[1], result[3] - 1, result[4]);
        return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4])?false:message
    }
}

const getStrLength = function(str){
    let strB = new Buffer(str)
    return strB.length
}
const multiValidate = function ({val,key,obj,message,required,min,max,type}) {
    if(required){
        return val?false:message
    }else if(min){
        return getStrLength(val)<min?message||`最小长度为${min}`:message
    }else if(max){
        return getStrLength(val)<min?message||`最大长度为${min}`:message
    }else{
        let validator = validatorMap[type]
        return validator(val,key,obj,message)
    }   
}
const validate = function (obj, rules) {
    if (!obj || !rules) {
        return
    }
    let keys = Object.keys(rules)
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let val = obj[key]
        let validators = rules[key] || []
        for (let j = 0; j < validators.length; j++) {
            let validator = validators[j]
            let ret = null
            if (validator.validator) {
                ret = validator.validator({ val, key, obj,message:validator.message })
            } else {
                ret = multiValidate({val,key,obj,...validator})
            }
            if (ret) return ret
        }
    }
    return false
};

module.exports = validate

