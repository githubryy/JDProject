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
const $quitchange = $('#quitchange')
const $quit = $('#quit')
const $navUserID = $('#navUserID')
const $username = $('#username')
const $btnSearch = $('#btnSearch')
const $textKeyword = $('#text-keyword')
const $goodscontent = $('.goods-content')
// 拼接接口 url
let url2 = '/api/user/access?'
let url = '/api/myorder/goodslist?'
const urlParams = getUrlParams(url)
if (urlParams.keyword) {
    url += '&keyword=' + urlParams.keyword
}
var goodsList = null
function initLoad(url){
    get(url).then((res) => {
        if (res.errno !== 0) {
            alert('数据错误')
            return
        }
        // 遍历博客列表，并显示
        const data = res.data || []
        $goodscontent.empty()
        // console.log('data11111111', data);
        goodsList = data
        loadGoods()
    })
}
function loadGoods() {
    $.each(goodsList, function (i, item) {
        var goodsHtml = '<div class="goods-item">' +
            '<div class="span1 car-goods-info">' +
            '<label><input data-id="' + item.id + '" type="checkbox" class="goods-list-item"/></label>' +
            '</div>' +
            '<div class="span3 car-goods-info goods-image-column">' +
            '<img class="goods-image" src="' + item.goodsimgUrl + '" style="width: 100px; height: 100px;" />' +
            '<span class="goods-info">' +
            item.goodsinfo +
            '</span>' +
            '</div>' +
            '<div class="span4 car-goods-info goods-params">' + item.goodsParams + '</div>' +
            '<div class="span2 car-goods-info goods-price"><span>￥</span><span class="single-price">' + item.price + '</span></div>' +
            '<div class="span2 car-goods-info goods-operate">' +
            '<a data-id="' + item.id + '" class="btn mini black delete item-delete"><i class="icon-trash"></i> 取消收藏</a>' +
            '</div>'
        '</div>'
        $('.goods-content').append(goodsHtml)
    })
}
get(url2).then((res) => {
    if (res.errno !== 0) {
        alert('数据错误')
        return
    }
    // 遍历博客列表，并显示
    const data = res.data || []
    // console.log('data11', data);
    $navUserID.attr('src', res.data[0].userImgurl ? res.data[0].userImgurl : "media/image/avitor.png")
    $username.text(res.data[0].username)
})
.then(()=>{
    
    var username = $('#username').text()
    // console.log('username',username);
    
    if (username || username === '') {
        url += 'username=' + username
        initLoad(url)
        url = '/api/myorder/goodslist?'
    }
    
})
var deleteGoods = null
// 搜索
$btnSearch.click(() => {
    // console.log('url',url);
    const keyword = $textKeyword.val()
    console.log('keyword', keyword);
    if (keyword || keyword === '') {
        url += 'keyword=' + keyword
        initLoad(url)
        url = '/api/myorder/goodslist?'
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

function ShoppingCarObserver(elInput, isAdd) {
    this.elInput = elInput
    this.parents = this.elInput.parents('.goods-item')
    this.count = parseInt(this.elInput.val())
    this.singlePrice = parseFloat(this.parents.find('.single-price').text())
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
var id = null
var flagf = 0
function del(id) {
    const data = {
        flagf,
        id,
    }
    const url = '/api/myorder/favorite'
    post(url,data).then(res => {
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
        id = $('.goods-list-item:checked').eq(i).attr('data-id')
        console.log('id', id);
        del(id)
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
    id = $target.attr('data-id')

}))

$('.deleteSure').on('click', function () {
    $('#deleteItemTip').modal('hide')
    console.log('targetVal2', id);
    del(id)
})
//提交订单
var goodsInfo = null
var price = null
var goodsParams = null
var username = null
var crtTime = null
var goodsimgUrl = null
var goodsCount = 1
var shopCarObj = []
var momentObj = { goodsInfo, price, goodsParams, username,goodsimgUrl,goodsCount, crtTime }
$('.bottom-menu-include').on('click', '.submitData', function () {
    if (!$('.submitData').hasClass('submitDis')) {
        // window.location.href = "shopCar.html"
    }
    let nowTime = Date.now();
    const url = '/api/myorder/addShopCar'
    const data = shopCarObj
    

    for (let i = 0; i < $('.goods-list-item:checked').length; i++) {
        //获取当前时间毫秒数
        shopCarObj.push({ ...momentObj })
        shopCarObj[i].goodsInfo = $('.goods-list-item:checked').eq(i).parent().parent().siblings().eq(0).text()
        shopCarObj[i].price = $('.goods-list-item:checked').eq(i).parent().parent().siblings().eq(2).find('.single-price').text()
        shopCarObj[i].goodsParams = $('.goods-list-item:checked').eq(i).parent().parent().siblings().eq(1).text()
        shopCarObj[i].goodsimgUrl = $('.goods-list-item:checked').eq(i).parent().parent().siblings().eq(0).find('img').attr('src')
        shopCarObj[i].username = $('#username').text()
        shopCarObj[i].crtTime = nowTime
        console.log('shopCarObj',shopCarObj);
    }
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
