const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const xss = require('xss')
const access = (username,commentUser) => {

    let sql = `select * from users where 1=1 `
    if (username) {
        sql += `and username='${username}' `
    }
    if (commentUser) {

        sql = `select * from users where username ='${commentUser}' `
    }
    // 返回 promise
    console.log('sql',sql);
    return exec(sql)
}
const login = (username, password) => {

    username = escape(username)

    // 生成加密密码
    password = genPassword(password)
    password = escape(password)
    const sql = `
        select username, email from users where username=${username} and password=${password}
    `
    // console.log('sql is', sql)
    return exec(sql).then(rows => {
        console.log(rows[0], 'loginRows');
        return rows[0] || {}
    })
}

const register = (username, password, email) => {
    username = escape(username)
    email = escape(email)
    // 生成加密密码
    password = genPassword(password)
    password = escape(password)
    const sql = `
        select username, email from users where username=${username}
    `
    const sql2 = `
        insert into users (username,password,email)
        values (${username},${password},${email})
    `
    return exec(sql).then(rows => {
        // console.log('rows',)
        if (rows[0]) {
            const message = false
            return message
        } else {
            return exec(sql2).then(insertData => {
                return insertData || {}
            })
        }
    })
}
const editInfo = (id, editData = {}) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象，包含 title content 属性

    const realname = xss(editData.realname)
    const birthday = xss(editData.birthday)
    const sex = xss(editData.sex)
    const email = xss(editData.email)
    const selfIntroduce = xss(editData.selfIntroduce)
    const addressDetail = xss(editData.addressDetail)
    const street = xss(editData.street)
    const province = xss(editData.province)
    const emailCode = xss(editData.emailCode)
    const country_list = xss(editData.country_list)
    const img1Edit = xss(editData.img1Edit)

    const sql = `
        update users set 
        realname='${realname}', 
        birthday='${birthday}', 
        sex='${sex}',
        email='${email}',
        self_introduce='${selfIntroduce}',
        address_detail='${addressDetail}',
        self_street='${street}',
        province='${province}',
        email_code='${emailCode}',
        country='${country_list}',
        userImgurl='${img1Edit}' 
        where id=${id}
    `
    // console.log(1111,sql);
    
    return exec(sql).then(updateData => {
        // console.log('updateData is ', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}
module.exports = {
    access,
    login,
    register,
    editInfo
}