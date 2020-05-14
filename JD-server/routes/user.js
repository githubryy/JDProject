var express = require('express');
var router = express.Router();
const { access,login,register,editInfo} = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
router.post('/login', function(req, res, next) {
    const { username, password } = req.body
    const result = login(username, password)
    return result.then(data => {  
        if (data.username) {
            // 设置 session
            req.session.username = data.username
            req.session.email = data.email
            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('登录失败,账户或密码错误！')
        )
    })
});

router.get('/access', loginCheck,(req, res, next) => {
    let username = req.session.username || ''
     
    console.log('username', req.query.username || '');

    if (req.query.isadmin) {
        console.log('is admin')
        // 管理员界面
        if (req.session.username == null) {
            console.error('is admin, but no login')
            // 未登录
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        // 强制查询自己的博客
        username = req.session.username
    }
    const result = access(username)
    return result.then(listData => {
        res.json(
            new SuccessModel(listData)
        )
    })
});
// router.post('/quitlogin', function(req, res, next) {
//     const { username, password } = req.body
//     const result = login(username, password)
//     return result.then(data => {  
//         if (data.username) {
//             // 设置 session
//             req.session.username = data.username
//             req.session.email = data.email
//             res.json(
//                 new SuccessModel()
//             )
//             return
//         }
//         res.json(
//             new ErrorModel('登录失败')
//         )
//     })
// });

router.get('/logout', function(req, res) {

    req.session.destroy(function(err) {
        res.redirect('/');

    })

})

router.post('/register', function(req, res, next) {
    const { username, password,email } = req.body
    const result = register(username, password,email)
    return result.then(data => {
        // console.log('data',data.affectedRows);
        if (data.affectedRows) {
            res.json(
                new SuccessModel('注册成功!')
            )
            return
        } else if (data === false){
            res.json(
                new ErrorModel('已存在该用户名')
            )
        }
       
    })
});

router.post('/update', loginCheck, (req, res, next) => {
    // console.log(req.query.id);
    
    const result = editInfo(req.query.id, req.body)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('更新信息失败')
            )
        }
    })
})
// router.get('/login-test', (req, res, next) => {
//     if (req.session.username) {
//         res.json({
//             errno: 0,
//             msg: '已登录'
//         })
//         return
//     }
//     res.json({
//         errno: -1,
//         msg: '未登录'
//     })
// })

// router.get('/session-test', (req, res, next) => {
//     const session = req.session
//     if (session.viewNum == null) {
//         session.viewNum = 0
//     }
//     session.viewNum++

//     res.json({
//         viewNum: session.viewNum
//     })
// })

module.exports = router;