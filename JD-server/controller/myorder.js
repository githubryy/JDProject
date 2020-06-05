const xss = require('xss')
const { exec } = require('../db/mysql')

const getGoodsList = (username, keyword, goodsinfo) => {
    let sql = `select * from goods where 1=1  `
    if (username) {
        sql += `and goods.favoriteperson like '%${username}%' `
    }
    if (keyword) {
        sql += `and goodsinfo like '%${keyword}%' `
    }
    if (goodsinfo) {
        sql += `and goodsinfo = '${goodsinfo}' `
    }
    sql += `order by storageNum desc;`
    // 返回 promise




    return exec(sql)
}
const getList = (username, keyword) => {
    let sql = `select myorder.id,myorder.username,myorder.rcvperson,myorder.rcvaddress,myorder.count,myorder.createtime,myorder.ordernum,myorder.name,myorder.price,myorder.status,users.userImgurl from myorder left join users on myorder.username = users.username where 1=1  `
    if (username) {
        sql += `and myorder.username='${username}' `
    }
    if (keyword) {
        sql += `and name like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回 promise

    return exec(sql)
}
const getShopCarList = (username, keyword) => {
    let sql = `select shopcar.id,shopcar.username,shopcar.goodsCount,shopcar.goodsInfo,shopcar.goodsParams,shopcar.goodsimgUrl,shopcar.price,users.userImgurl from shopCar left join users on shopCar.username = users.username where 1=1 `
    if (username) {
        sql += `and shopcar.username = '${username}' `
    }
    // let sql = `select *,myorder.userimgurl from shopCar left join myorder where 1=1 `
    // if (username) {
    //     sql += `on shopCar.username = myorder.username and username='${username}' `
    // }
    if (keyword) {
        sql += `and goodsInfo like '%${keyword}%' `
    }
    sql += `order by id desc;`


    // 返回 promise
    return exec(sql)
}
const getOrderSessionList = () => {
    let sql = `select * from ordersession `
    // 返回 promise
    return exec(sql)
}
const getGoodsCommentsList = (pGoodsinfo) => {
    let sql = `SELECT
            c.crtTime,
            c.comment,
            u.username,
            u.userImgurl
        FROM
            comments c
            JOIN users u ON c.person_id = u.id
            JOIN goods g ON c.goods_id = g.id 
        WHERE
            g.goodsinfo = '${pGoodsinfo}'`

    sql += ` order by crtTime desc;`
    // 返回 promise

    // console.log('sql',sql);

    return exec(sql)
}
const submitOrder = (sessionObj = {}) => {
    //在插入数据前删除表里面所有数据避免重复
    const sql2 = `delete from ordersession`
    exec(sql2)
    sessionObj.forEach(item => {
        const sql = `
        insert into ordersession (count,createtime,username,ordernum,name,price,status)
        values ('${item.count}','${item.createtime}','${item.username}','${item.ordernum}','${item.name}','${item.price}','${item.status}')
    `
        const delSql = `delete from shopCar where id = '${item.dataId}'`
        exec(delSql)
        return exec(sql)
    });
}
const orderPay = (orderdata = {}) => {

    const payway = xss(orderdata.payway)
    const username = xss(orderdata.username)
    const rcvperson = xss(orderdata.rcvperson)
    const rcvaddress = xss(orderdata.rcvaddress)
    const status = xss(orderdata.status)

    const sql = `
        update ordersession set 
        payway='${payway}', 
        username='${username}', 
        rcvperson='${rcvperson}', 
        rcvaddress='${rcvaddress}',
        status='${status}'
    `
    exec(sql)
    const sql2 = `insert into myorder select * from ordersession`
    return exec(sql2)

}
const addShopCar = (addShopCar = {}) => {

    return addShopCar.forEach(item => {
        const sql = ` insert into shopCar (goodsInfo, goodsParams, price, goodsimgUrl,goodsCount,username,crtTime)
        values ('${item.goodsInfo}', '${item.goodsParams}', ${item.price},'${item.goodsimgUrl}', '${item.goodsCount}','${item.username}','${item.crtTime}')`

        return exec(sql).then(delData => {

            if (delData.affectedRows > 0) {
                return true
            }
            return false
        })
    })
}
const getDetail = (id) => {
    const sql = `select * from myorder where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}
const editFavorite = (editFObj = {}, username) => {
    const sql = `select favoriteperson from goods where id ='${editFObj.id}'`
    var favoriteperson = null
    exec(sql).then(people => {
        var usernamef = people[0].favoriteperson
        if (editFObj.flagf === 0) {
            favoriteperson = usernamef.replace(username, '')
        } else if (editFObj.flagf === 1) {
            favoriteperson = usernamef.concat(username)
        }
    }).then(() => {
        const sqlchange = `update goods set favoriteperson = '${favoriteperson}'  where id ='${editFObj.id}' `
        return exec(sqlchange)
    })
}
const delShopCar = (id, username) => {
    // id 就是要删除收藏商品的id
    const sql = `delete from shopCar where id='${id}' and username='${username}';`
    return exec(sql).then(delData => {

        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}
const handleComment = (pushObj = {}) => {
    // console.log('pushObj', pushObj);

    const comment = xss(pushObj.content)
    const sql = `select id from users where username = '${pushObj.username}'`
    const sql2 = `select id from goods where goodsinfo = '${pushObj.goodsinfo}'`
    var person_id = null
    var goods_id = null
    exec(sql).then(res => {
        // console.log('1111111', res[0].id);
        person_id = res[0].id
    })
        .then(() => {
            exec(sql2).then(res => {
                goods_id = res[0].id
            }).then(() => {
                const sql3 = `insert into comments (crtTime,comment,person_id,goods_id)
                values ('${pushObj.crtTime}','${comment}',${person_id},${goods_id})`
                // console.log('sql3',sql3);
                return exec(sql3).then(delData => {
                    if (delData.affectedRows > 0) {
                        return true
                    }
                    return false
                }).then(()=>{
                    const sql4 = `select commentPerson from goods where goodsinfo = '${pushObj.goodsinfo}'`
                    exec(sql4).then(res=>{
                       var username =  res[0].commentPerson
                       console.log('username',username);
                        var arr =  username.split(',')
                        console.log('1111',arr.indexOf(pushObj.username));
                        if(arr.indexOf(pushObj.username)<0){
                            var arrlength = arr.length + 1
                            arr.push(pushObj.username)
                            var arrString =arr.toString()
                            console.log('arrString',arrString);
                            console.log('arrlength',arrlength);
                            const sql5 = `update goods set commentCount = ${arrlength},commentPerson ='${arrString}' where goodsinfo = '${pushObj.goodsinfo}'`
                            console.log('sql5',sql5);
                            
                               return exec(sql5)
                        }
                
                    })

                })
            })
        })
}

module.exports = {
    getGoodsList,
    getList,
    getShopCarList,
    getOrderSessionList,
    getGoodsCommentsList,
    submitOrder,
    orderPay,
    addShopCar,
    getDetail,
    editFavorite,
    delShopCar,
    handleComment
}