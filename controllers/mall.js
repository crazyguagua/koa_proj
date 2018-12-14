module.exports={
    'POST /api/mall/lunbotulist': async (ctx, next) => {
        const list =[{
            url:'https://gw.alicdn.com/tfs/TB12YnxvzDpK1RjSZFrXXa78VXa-1035-390.png_790x10000.jpg_.webp',title:'曼城是冠军'
        },{
            url:'https://gw.alicdn.com/imgextra/i1/47/O1CN01VOQiuX1CDZ69YVN9l_!!47-0-lubanu.jpg_790x10000Q75.jpg_.webp',title:'阿森纳是冠军'
        },{
            url:'https://gw.alicdn.com/imgextra/i1/21/O1CN01vacEoQ1C1enewnT0M_!!21-0-lubanu.jpg_790x10000Q75.jpg_.webp',title:'曼联是冠军'
        },{
            url:'https://gw.alicdn.com/imgextra/i2/44/O1CN015PVvil1CCBuUUR4jr_!!44-0-lubanu.jpg_790x10000Q75.jpg_.webp',title:'热刺是冠军'
        },{
            url:'https://gw.alicdn.com/imgextra/i4/35/O1CN01Ws7oXJ1C84LWzJ2lP_!!35-0-lubanu.jpg_790x10000Q75.jpg_.webp',title:'利物浦'
        }]
        ctx.restList(list,list.count);
    }
    
}