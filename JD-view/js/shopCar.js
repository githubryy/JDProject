// 发送 get 请求
function get(url) {
    return $.get(url)
}

// 发送 post 请求
function post(url, data = {}) {
    return $.ajax({
        type: 'post',
        url,
        data: JSON.stringify(data),
        contentType: "application/json",
    })
}

// 显示格式化的时间
function getFormatDate(dt) {
    return moment(dt).format('LL')
}

// 获取 url 参数
function getUrlParams() {
    let paramStr = location.href.split('?')[1] || ''
    paramStr = paramStr.split('#')[0]
    const result = {}
    paramStr.split('&').forEach(itemStr => {
        const arr = itemStr.split('=')
        const key = arr[0]
        const val = arr[1]
        result[key] = val
    })
    return result
}

const $btnSearch = $('#btnSearch')
const $textKeyword = $('#text-keyword')
const $goodscontent = $('.goods-content')

const $quitchange = $('#quitchange')
const $quit = $('#quit')
const $navUserID = $('#navUserID')


// 拼接接口 url
let url = '/api/myorder/shopCarlist?'

const urlParams = getUrlParams(url)

if (urlParams.keyword) {
    url += '&keyword=' + urlParams.keyword
}

get(url).then((res) => {
    if (res.errno !== 0) {
        alert('数据错误')
        return
    }
    // 遍历博客列表，并显示
    const data = res.data || []
    // console.log('data11', data);
    $navUserID.empty()
    $navUserID.append($(`
    <img alt="" src="${res.data[0].userImgurl}" />

    <span  class="username">${res.data[0].username} </span>

    <i class="icon-angle-down"></i>
    `))
})

var goodsList = null
var deleteGoods = null

function loadGoods() {
    $.each(goodsList, function (i, item) {
        var goodsHtml = '<div class="goods-item">' +
            '<div class="span1 car-goods-info">' +
            '<label><input data-id="' + item.id + '" type="checkbox" class="goods-list-item"/></label>' +
            '</div>' +
            '<div class="span3 car-goods-info goods-image-column">' +
            '<img class="goods-image" src="' + item.goodsimgUrl + '" style="width: 100px; height: 100px;" />' +
            '<span class="goods-info">' +
            item.goodsInfo +
            '</span>' +
            '</div>' +
            '<div class="span2 car-goods-info goods-params">' + item.goodsParams + '</div>' +
            '<div class="span1 car-goods-info goods-price"><span>￥</span><span class="single-price">' + item.price + '</span></div>' +
            '<div class="span2 car-goods-info goods-counts">' +
            '<div class="input-group">' +
            '<div class="input-group-btn">' +
            '<button type="button" class="btn btn-default car-decrease">-</button>' +
            '</div>' +
            '<input type="text" class="form-control goods-count" value="' + item.goodsCount + '">' +
            '<div class="input-group-btn">' +
            '<button type="button" class="btn btn-default car-add">+</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="span1 car-goods-info goods-money-count"><span>￥</span><span class="single-total">' + (item.price * item.goodsCount) + '</span></div>' +
            '<div class="span2 car-goods-info goods-operate">' +
            // '<button type="button" class="btn btn-danger item-delete">删除</button>'
            '<a data-id="' + item.id + '" class="btn mini black delete item-delete"><i class="icon-trash"></i> 移出购物车</a>' +
            '</div>'
        '</div>'
        $('.goods-content').append(goodsHtml)
    })
}

// 封装订单加载数据
function blogLoad(url) {
    get(url).then((res) => {
        if (res.errno !== 0) {
            alert('数据错误')
            return
        }
        // 遍历博客列表，并显示
        const data = res.data || []
        $goodscontent.empty()
        console.log('data11111111', data);
        goodsList = data

        loadGoods()

    })
}
// 搜索

$btnSearch.click(() => {
    // console.log('url',url);
    const keyword = $textKeyword.val()
    console.log('keyword', keyword);
    if (keyword || keyword === '') {
        url += 'keyword=' + keyword
        blogLoad(url)
        url = '/api/myorder/shopCarlist?'
    }

})
//退出登录
$quit.click(() => {

    url = '/api/user/logout'
    get(url)

})
$quitchange.click(() => {
    url = '/api/user/logout'
    get(url)

})

//页面开始执行
window.onload = blogLoad(url)

function ShoppingCarObserver(elInput, isAdd) {
    this.elInput = elInput
    this.parents = this.elInput.parents('.goods-item')
    this.count = parseInt(this.elInput.val())
    this.isAdd = isAdd
    this.singlePrice = parseFloat(this.parents.find('.single-price').text())
    this.computeGoodsMoney = function () {
        var moneyCount = this.count * this.singlePrice
        var singleTotalEl = this.parents.find('.single-total')
        console.log(moneyCount)
        singleTotalEl.empty().append(moneyCount)
    }
    this.showCount = function () {
        var isChecked = this.parents.find('.goods-list-item')[0].checked
        var GoodsTotalMoney = parseFloat($('#selectGoodsMoney').text())
        var goodsTotalCount = parseInt($('#selectGoodsCount').text())
        if (this.elInput) {
            if (this.isAdd) {
                ++this.count
                if (isChecked) {
                    $('#selectGoodsMoney').empty().append((GoodsTotalMoney + this.singlePrice) + '.00')
                    $('#selectGoodsCount').empty().append(goodsTotalCount + 1)
                }
            } else {
                if (parseInt(this.count) <= 1) {
                    return
                } else {
                    --this.count
                    if (isChecked) {
                        $('#selectGoodsMoney').empty().append((GoodsTotalMoney - this.singlePrice) + '.00')
                        $('#selectGoodsCount').empty().append(goodsTotalCount - 1)
                    }
                }
            }
            this.elInput.val(this.count)
        }
    }
    this.checkIsAll = function () {
        var checkLen = $('.goods-list-item:checked').length
        if (checkLen > 0) {
            $('.submitData').removeClass('submitDis')
        } else {
            $('.submitData').addClass('submitDis')
        }
        if ($('.goods-item').length === checkLen) {
            $('#checked-all-bottom, #check-goods-all').prop('checked', true)
        } else {
            $('#checked-all-bottom, #check-goods-all').prop('checked', false)
        }
    }
    this.checkedChange = function (isChecked) {
        if (isChecked === undefined) {
            var isChecked = this.parents.find('.goods-list-item')[0].checked
        }
        var itemTotalMoney = parseFloat(this.parents.find('.single-total').text())
        var GoodsTotalMoney = parseFloat($('#selectGoodsMoney').text())
        var itemCount = parseInt(this.parents.find('.goods-count').val())
        var goodsTotalCount = parseInt($('#selectGoodsCount').text())
        if (isChecked) {
            $('#selectGoodsMoney').empty().append(itemTotalMoney + GoodsTotalMoney)
            $('#selectGoodsCount').empty().append(itemCount + goodsTotalCount)
        } else {
            if (GoodsTotalMoney - itemTotalMoney === 0) {
                $('#selectGoodsMoney').empty().append('0.00')
                if (!$('.submitData').hasClass('submitDis')) {
                    $('.submitData').addClass('submitDis')
                }
            } else {
                $('#selectGoodsMoney').empty().append(GoodsTotalMoney - itemTotalMoney)
            }
            $('#selectGoodsCount').empty().append(goodsTotalCount - itemCount)
        }
    }
    this.deleteGoods = function () {
        var isChecked = this.parents.find('.goods-list-item')[0].checked
        if (isChecked) {
            this.checkedChange(false)
        }
        // console.log('this.parent',this.parents);

        this.parents.remove()
        this.checkOptions()
    }
    this.checkOptions = function () {
        if ($('#check-goods-all')[0].checked) {
            if ($('.goods-list-item').length <= 0) {
                $('#checked-all-bottom, #check-goods-all').prop('checked', false)
            }
        }
    }
}
function checkedAll(_this) {
    if ($('.goods-item').length <= 0) {
        $('.submitData').addClass('submitDis')
    } else {
        $('.submitData').removeClass('submitDis')
    }
    for (var i = 0; i < $('.goods-item').length; i++) {
        var elInput = $('.goods-item').eq(i).find('.goods-list-item')
        var isChecked = $('.goods-item').eq(i).find('.goods-list-item')[0].checked
        var checkAllEvent = new ShoppingCarObserver(elInput, null)
        if (_this.checked) {
            if (!isChecked) {
                elInput.prop('checked', true)
                checkAllEvent.checkedChange(true)
            }
        } else {
            if (!$('.submitData').hasClass('submitDis')) {
                $('.submitData').addClass('submitDis')
            }
            if (isChecked) {
                elInput.prop('checked', false)
                checkAllEvent.checkedChange(false)
            }
        }
    }
}
$('#check-goods-all').on('change', function () {
    if (this.checked) {
        $('#checked-all-bottom').prop('checked', true)
    } else {
        $('#checked-all-bottom').prop('checked', false)
    }
    checkedAll(this)
})
$('#checked-all-bottom').on('change', function () {

    if (this.checked) {
        $('#check-goods-all').prop('checked', true)
    } else {
        $('#check-goods-all').prop('checked', false)
    }
    checkedAll(this)
})
$('.goods-content').on('change', '.goods-list-item', function () {
    var tmpCheckEl = $(this)
    var checkEvent = new ShoppingCarObserver(tmpCheckEl, null)
    checkEvent.checkedChange()
    checkEvent.checkIsAll()
})
$('.goods-content').on('click', '.car-decrease', function () {
    var goodsInput = $(this).parents('.input-group').find('.goods-count')
    var decreaseCount = new ShoppingCarObserver(goodsInput, false)
    decreaseCount.showCount()
    decreaseCount.computeGoodsMoney()
})
$('.goods-content').on('click', '.car-add', function () {
    var goodsInput = $(this).parents('.input-group').find('.goods-count')
    var addCount = new ShoppingCarObserver(goodsInput, true)
    addCount.showCount()
    addCount.computeGoodsMoney()
})
$('.goods-content').on('click', '.item-delete', function () {
    var goodsInput = $(this).parents('.goods-item').find('.goods-list-item')
    deleteGoods = new ShoppingCarObserver(goodsInput, null)
    // $('#deleteItemTip').modal('show')
})
$('.deleteSure').on('click', function () {
    if (deleteGoods !== null) {
        deleteGoods.deleteGoods()
    }
    $('#deleteItemTip').modal('hide')
})
$('#deleteMulty').on('click', function () {
    if ($('.goods-list-item:checked').length <= 0) {
        $('#selectItemTip').modal('show')
    } else {
        $('#deleteMultyTip').modal('show')
    }
})
var targetVal = null
function del(targetVal) {
    const url = '/api/myorder/delShopCar?id=' + targetVal
    post(url).then(res => {
        if (res.errno !== 0) {
            alert('操作错误')
            return
        }
        location.href = location.href

    })
}
$('.deleteMultySure').on('click', function () {
    for (var i = 0; i < $('.goods-list-item:checked').length; i++) {
        var multyDelete = new ShoppingCarObserver($('.goods-list-item:checked').eq(i), null)
        targetVal = $('.goods-list-item:checked').eq(i).attr('data-id')
        console.log('targetVal', targetVal);
        del(targetVal)
        multyDelete.deleteGoods()
        i--
    }
    // console.log('multyDelete',multyDelete);

    multyDelete.checkOptions()
    $('#deleteMultyTip').modal('hide')
})

// 删除
$('.goods-content').click((e => {

    const $target = $(e.target)
    // console.log('$target',$target);

    if ($target.hasClass('item-delete') === false) {
        return
    }
    $('#deleteItemTip').modal('show');
    targetVal = $target.attr('data-id')

}))

$('.deleteSure').on('click', function () {
    $('#deleteItemTip').modal('hide')
    console.log('targetVal2', targetVal);
    del(targetVal)
})
//提交订单
var name = null
var price = null
var count = null
var ordernum = null
var status = null
var username = null
var createtime = null
var sessionObj = []
var momentObj = { name, price, count, ordernum, status, username, createtime }
$('.bottom-menu-include').on('click', '.submitData', function () {
    if (!$('.submitData').hasClass('submitDis')) {
        window.location.href = "orderSubmit.html"
    }
    let nowTime = Date.now();
    for (let i = 0; i < $('.goods-list-item:checked').length; i++) {
        //订单号默认为随机数
        var rand = "";
        for (let i = 0; i < 12; i++) {
            let r = Math.floor(Math.random() * 10);
            rand += r;
        }
        //获取当前时间毫秒数
        sessionObj.push({ ...momentObj })
        sessionObj[i].name = $('.goods-list-item:checked').eq(i).parent().parent().siblings().eq(0).text()
        sessionObj[i].price = $('.goods-list-item:checked').eq(i).parent().parent().siblings().eq(4).children('.single-total').text()
        sessionObj[i].count = $('.goods-list-item:checked').eq(i).parent().parent().siblings().eq(3).find('input').val()
        sessionObj[i].ordernum = rand
        sessionObj[i].status = '待支付'
        sessionObj[i].username = $('.username').text()
        sessionObj[i].createtime = nowTime
    }
    console.log('sessionObj', sessionObj);
    const url = '/api/myorder/submitOrder'
    const data = sessionObj
    post(url, data).then(res => {
        if (res.errno === 0) {
            // 插入成功
            alert(res.message)
        } else {
            // 插入失败
            alert(res.message)
        }
    })


})
