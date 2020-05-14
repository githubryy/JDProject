
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

// 拼接接口 url
let url = '/api/user/access?isadmin=1'  // 增加一个 isadmin=1 参数，使用登录者的用户名，后端也需要修改 ！！！
const urlParams = getUrlParams()
if (urlParams.keyword) {
	url += '&keyword=' + urlParams.keyword
}
const $loginStatus = $('#loginStatus')
const $loginStatus2 = $('#loginStatus2')
const $myOrder = $('#myOrder')
const $gwc = $('.gwc')


$('.addShopCar').on('click', function () {

	var goodsimgUrl = $(this).parent().prev().attr('src')
	var nade = $(this).prev().find('p').text().trim().split(',')
	var goodsInfo = nade[0]
	var goodsParams = nade[1]
	var price = $(this).prev().find('span').text().trim()
	var reg = /[0-9a-z]+/gi;
	var goodsCount = 1
	var username = $('#loginStatus2').find('span').text()
	price=price.match(reg).toString()
	 
	 
	let url2 = '/api/myorder/addShopCar?'

    const data = {
        goodsimgUrl,
        goodsInfo,
        goodsParams,
		price,
		goodsCount,
		username
    }
    post(url2, data).then(res => {
        if (res.errno !== 0) {
            alert('操作错误')
            return
        }
        alert('加入购物车成功！')

    })
});
// 加载数据
get(url).then(res => {
	console.log('res', res.data);
	if (res.errno !== 0) {
		$loginStatus.append($(`
		<a href="/login.html">您好，请登录</a>
		`))
		$loginStatus2.append($(`
		<a href="/login.html">您好，请登录</a>
		`))
		$myOrder.append($(`
		<a href="/login.html">我的订单</a>
		`
			,
			alert('为了您的使用体验,请登录!!!')
		))
		return
	} else {
		$loginStatus.append($(`    
		<span>您好,</span>
		<a class="myCenterHref" href="/myCenter.html?username=${res.data[0].username}">
			${res.data[0].username}
			<div class="divCircle">
                <img class="circleImg"
                src="${res.data[0].userImgurl}" />
        	</div>
		</a>
		`))
		$loginStatus2.append($(`    
		<span>${res.data[0].username}</span>
		`))
		$myOrder.append($(`
		<a href="/myCenter.html?username=${res.data[0].username}">我的订单</a>
		`
		))
		$gwc.empty()
		$gwc.append($(`<a href="/shopCar.html"><p class="mydiv"><span></span>我的购物车</p></a>`))

	}
})




