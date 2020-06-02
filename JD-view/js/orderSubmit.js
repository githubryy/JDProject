
//server
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


let url = '/api/user/access?'
const urlParams = getUrlParams(url)
const $quitchange = $('#quitchange')
const $quit = $('#quit')
const $navUserID = $('#navUserID')
const $username = $('#username')
const $tabletr = $('.tabletr')
const $rcvname = $('.rcvname')
const $payWay = $('.payWay')
const $rcvaddress = $('.rcvaddress')
const $orderPay = $('#orderPay')

function orderUp() {
    const payway = $payWay.val()
    const username = $username.text()
    const rcvperson = $rcvname.val()
    const rcvaddress = $rcvaddress.val()
    const status = '已支付'

    let url3 = '/api/myorder/orderPay?'

    const data = {
        payway,
        username,
        rcvperson,
        rcvaddress,
        status
    }
    post(url3, data).then(res => {
        if (res.errno !== 0) {
            alert('操作错误')
            return
        }
        alert('更新成功')

    })
}
$orderPay.click(() => {


    if (confirm('确定支付？')) {
        this.orderUp()
        location.href = 'paySuccess.html'
        console.log('$payWay.val()', $payWay.val(), $rcvaddress.val(), $rcvname.val());
    }

   
})


get(url).then((res) => {
    if (res.errno !== 0) {
        alert('数据错误')
        return
    }
    // 遍历博客列表，并显示
    const data = res.data || []
    console.log('data', data);
    $navUserID.attr('src', res.data[0].userImgurl?res.data[0].userImgurl:"media/image/avitor.png")
    $username.text(res.data[0].username)

})
const url2 = '/api/myorder/getOrderSessionList?'
// 封装订单加载数据
function orderLoad(url2) {

    get(url2).then((res) => {
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

				<td class="hidden-480">

					<a href="mailto:shuxer@gmail.com">${getFormatDate(item.createtime)}</a>
				
				</td>
                <td class="center hidden-480">${item.price}.00</td>

                <td><span class="label label-success">${item.status}</span></td>

            </tr>
            `))
        })
    })
}

//页面开始执行
window.onload = orderLoad(url2)
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
