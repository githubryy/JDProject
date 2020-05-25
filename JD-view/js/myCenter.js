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
    return moment(dt).format('YYYY-MM-DD HH:mm:ss')
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

// 获取 dom 元素
const $tabletr = $('#tabletr')
const $textKeyword = $('#text-keyword')
const $btnSearch = $('#btnSearch')
const $quitchange = $('#quitchange')
const $quit = $('#quit')
const $navUserID = $('#navUserID')
const $itemdel = $('#item-del')

// 拼接接口 url
let url = '/api/myorder/list?'

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
    // console.log('data', data);
    $navUserID.empty()
    $navUserID.append($(`
    <img alt="" src="${res.data[0].userImgurl}" />

    <span  class="username">${res.data[0].username} </span>

    <i class="icon-angle-down"></i>
    `))
})

// 封装订单加载数据
function orderLoad(url) {
    get(url).then((res) => {
        if (res.errno !== 0) {
            alert('数据错误')
            return
        }
        // 遍历博客列表，并显示
        const data = res.data || []
        $tabletr.empty()
        // console.log('data', data);
        data.forEach(item => {
            $tabletr.append($(`
            <tr class="odd gradeX">

                <td>${item.ordernum}</td>

                <td>${item.name}</td>

                <td>${item.count}</td>

                <td class="hidden-480"><a
                    href="mailto:shuxer@gmail.com">${getFormatDate(item.createtime)}</a></td>

                <td class="hidden-480">${item.username}</td>

                <td class="center hidden-480">${item.price}.00</td>

                <td><span class="label label-success">${item.status}</span></td>

                <td class="hidden-480 ">

                <button data-trigger="hover" data-placement="left" 

                data-content='${item.rcvaddress}' data-original-title="收货地址" 
                
                class="popovers btn mini blue item-seeAddress">

                <i class="icon-hand-up"></i> 查看收货地址</button> |

                <a data-id="${item.id}" class="btn mini black item-del"><i class="icon-trash"></i> 删除记录</a>
                
                </td>

            </tr>
            `))
        })
    })
}

//页面开始执行
window.onload = orderLoad(url)

// 搜索
$btnSearch.click(() => {
    // console.log('url',url);
    const keyword = $textKeyword.val()
    console.log('keyword',keyword);
    if (keyword || keyword === '') {
        url += 'keyword=' + keyword
        orderLoad(url)
        url = '/api/myorder/list?'
    }

})
// 删除
var targetVal = null
$tabletr.click((e => {
    const $target = $(e.target)
    if ($target.hasClass('item-del') === false) {
        return
    }

    $('#deleteItemTip').modal('show');
    targetVal = $target.attr('data-id')

}))

$('.deleteSure').on('click', function () {

    $('#deleteItemTip').modal('hide')
    const url = '/api/myorder/del?id=' + targetVal
    post(url).then(res => {
        if (res.errno !== 0) {
            alert('操作错误')
            return
        }
        location.href = location.href

    })
})
//退出登录
$quit.click(() => {
    url = '/api/user/logout'
    get(url)

})
//切换账号
$quitchange.click(() => {
    url = '/api/user/logout'
    get(url)

})