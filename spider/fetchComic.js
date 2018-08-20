
const request = require("superagent")
install = require('superagent-charset')
var superagent = install(request);
const cheerio = require('cheerio')
const log = console.log.bind()
const comicBaseUrl = 'http://comic.kukudm.com/comiclist/2491/index.htm';
const fetchChapter= async ()=>{
    let urls = []
    await superagent
    .get(comicBaseUrl)
    .charset('gbk')
    // .set(headers)
    .then(function (sres, err) {
        // 常规的错误处理
        if (err) {
            reject(err);
            return;
        }
        const $ = cheerio.load(sres.text);
       
        $('#comiclistn > dd').each(function (idx, element) {
            let $child = $(element).find('a:not(:first-child)');
            // log($child)
            $child.each((idx,el) => {
                let url = $(el).attr('href');
                urls.push(url)
            });
            // startChild(urls)
        });
        
    });
    // log(urls)
    startChild(urls)
}
const startChild = (urls)=>{
    urls.forEach(url => {
        superagent
        .get(comicBaseUrl)
        .charset('gbk')
        // .set(headers)
        .then(function (sres, err) {
            const $ = cheerio.load(sres.text);
            // log(sres.text)
            let $script = $('table[align=center]').find('script[language="javascript"]').eq(0);
            let text =$script.html()
            log(text)
        })
    });
}


fetchChapter()
module.exports.fetchChapter= fetchChapter;