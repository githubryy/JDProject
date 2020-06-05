var express = require('express');
var router = express.Router();
const {
    getGoodsList,
    getList,
    getShopCarList,
    getOrderSessionList,
    submitOrder,
    orderPay,
    addShopCar,
    getDetail,
    editFavorite,
    delShopCar,
    delFavorite
} = require('../controller/myorder')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.get('/goodslist', (req, res, next) => {
    const username = req.query.username || ''
    const keyword = req.query.keyword || ''
    const goodsinfo = req.query.goodsinfo || ''
     console.log('keyword', goodsinfo);
    const result = getGoodsList(username,keyword,goodsinfo)
    return result.then(listData => {
        // console.log('getGoodsList', listData);
        res.json(
            new SuccessModel(listData)
        )
    })
});

router.get('/list', loginCheck, (req, res, next) => {
    let username = req.session.username || ''
    const keyword = req.query.keyword || ''
    // console.log('username', req.query.username || '');
    // console.log('keyword', keyword);

    if (req.query.isadmin) {
        // console.log('is admin')
        // 管理员界面
        if (req.session.username == null) {
            // console.error('is admin, but no login')
            // 未登录
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        // 强制查询自己的订单
        username = req.session.username
    }
    const result = getList(username, keyword)
    return result.then(listData => {
        res.json(
            new SuccessModel(listData)
        )
    })
});

router.get('/shopCarlist', loginCheck, (req, res, next) => {
    let username = req.session.username || ''
    const keyword = req.query.keyword || ''
    if (req.query.isadmin) {
        // console.log('is admin')
        // 管理员界面
        if (req.session.username == null) {
            // console.error('is admin, but no login')
            // 未登录
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        // 强制查询自己的订单
        username = req.session.username
    }
    const result = getShopCarList(username, keyword)
    return result.then(listData => {
        // console.log('listData', listData);

        res.json(
            new SuccessModel(listData)
        )
    })
});

router.get('/getOrderSessionList', loginCheck, (req, res, next) => {
    
    const result = getOrderSessionList()
    return result.then(listData => {
        // console.log('listData', listData);
        res.json(
            new SuccessModel(listData)
        )
    })
});

router.post('/submitOrder', loginCheck, (req, res, next) => {

    const result = submitOrder(req.body)
    return result
});
router.post('/orderPay', loginCheck, (req, res, next) => {
    const result = orderPay(req.body)
    return result
});
router.post('/addShopCar', loginCheck, (req, res, next) => {
     return addShopCar(req.body)
       
});
router.get('/detail', (req, res, next) => {
    const result = getDetail(req.query.id)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
});
router.post('/favorite', loginCheck, (req, res, next) => {
    const username = req.session.username
    const result = editFavorite(req.body,username)
})
router.post('/delShopCar', loginCheck, (req, res, next) => {
    const username = req.session.username
    const result = delShopCar(req.query.id, username)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('删除购物车失败')
            )
        }
    })
})
router.post('/delFavorite', loginCheck, (req, res, next) => {
    const username = req.session.username
    const result = delFavorite(req.query.id, username)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('取消收藏商品失败')
            )
        }
    })
})

module.exports = router;
