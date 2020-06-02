const xss = require('xss')
const { exec } = require('../db/mysql')

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
    const sql2 =`insert into myorder select * from ordersession`
        return exec(sql2)

}
const addShopCar = (addShopCar = {}) => {  
    const sql =` insert into shopCar (goodsInfo, goodsParams, price, goodsimgUrl,goodsCount,username)
    values ('${addShopCar.goodsInfo}', '${addShopCar.goodsParams}', ${addShopCar.price}, '${addShopCar.goodsimgUrl}','${addShopCar.goodsCount}','${addShopCar.username}')`
    return exec(sql).then(updateData => {
        // console.log('updateData is ', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}
const getDetail = (id) => {
    const sql = `select * from myorder where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}
const delShopCar = (id, username) => {
    // id 就是要删除博客的 id
    const sql = `delete from shopCar where id='${id}' and username='${username}';`
    return exec(sql).then(delData => {
        // console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getShopCarList,
    getOrderSessionList,
    submitOrder,
    orderPay,
    addShopCar,
    getDetail,
    delShopCar
}