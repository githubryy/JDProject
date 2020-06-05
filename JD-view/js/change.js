
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
let url2 = '/api/myorder/addShopCar?'
let urlgoods = '/api/myorder/goodslist'
let urlfavorite = '/api/myorder/favorite'
let urlquit = '/api/user/logout'

const urlParams = getUrlParams()
if (urlParams.keyword) {
	url += '&keyword=' + urlParams.keyword
}
const $loginStatus = $('#loginStatus')
const $loginStatus2 = $('#loginStatus2')
const $myOrder = $('#myOrder')
const $gwc = $('.gwc')
const $addUl = $('#addUl')
const $quit = $('#quit')
var goodsList = null
var username = $('#loginStatus2').find('span').text()

// 加载用户信息
get(url).then(res => {
	// console.log('res', res.data);
	if (res.errno !== 0) {
		$loginStatus.append($(`
		<a href="/login.html">您好，请登录</a>
		`))
		$loginStatus2.append($(`
		<a href="/login.html">您好，请登录</a>
		`))
		$myOrder.append($(`
		<a href="/login.html">个人中心</a>
		`))
		alert('为了您的使用体验,请登录!!!')
		return
	} else {
		$loginStatus.append($(`    
		<span>您好,</span>
		<a class="myCenterHref" href="/myCenter.html?username=${res.data[0].username}">
			<a href="personinfo.html" id="usernameId">${res.data[0].username}</a>
			<div class="divCircle">
                <img class="circleImg"
                src="${res.data[0].userImgurl ? res.data[0].userImgurl : "media/image/avitor.png"}" />
        	</div>
		</a>
		`))
		$loginStatus2.append($(`    
		<span>${res.data[0].username}</span>
		`))
		$myOrder.append($(`
		<a href="/myCenter.html?username=${res.data[0].username}">个人中心</a>
		`
		))
		$gwc.empty()
		$gwc.append($(`<a href="/shopCar.html"><p class="mydiv"><span></span>我的购物车</p></a>`))
		$quit.text('退出登录')
		// console.log("$quit.text('退出登录')",$quit.text());
	}
})


// 加载商品信息
function loadGoods() {
	
	var username = $('#loginStatus2').find('span').text()
	if(!username){
		username = '无'
	}
	$.each(goodsList, function (i, item) {
		// console.log('item',item);
		var flag = item.favoriteperson.indexOf(username)
		if(flag>=0){
			falg = 'cs'
		}else{
			falg = null
		}
		var goodsHtml =
			'<ul class="fl flli goodslist">' +
				'<li>' +
				'<img src="' + item.goodsimgUrl + '">' +
				'<div data-id="'+item.id+'" class="favorite '+falg+'">&#10084;</div>' +
				'<div class="si">' +
				'<div class="napr">' +
				'<p>' +
				'<a href="#">' + item.goodsinfo+','+item.goodsParams+ '</a>' +
				'</p>' +
				'<span>￥' + item.price + '</span>' +
				'</div>' +
				'<div class="addShopCar">加入购物车</div>' +
				'</div>' +
				'</li>' +
			'</ul>'

		$('#addUl').append(goodsHtml)

	})
	$('#addUl').append('<div class="cb"></div>')
 
}
var _this = this
get(urlgoods).then((res) => {
	if (res.errno !== 0) {
		alert('商品加载数据错误')
		return
	}
	
	const data = res.data || []

	$addUl.empty()

	goodsList = data
	
	loadGoods()
	 
})
 

//点击收藏
var flagf = 0
$('#addUl').on('click','.favorite',function(){
	var username = $('#loginStatus2').find('span').text()
	if(username){
		if($(this).hasClass('cs')){
			flagf = 0
			$(this).toggleClass('cs',false);	
		}else{
			flagf = 1
			$(this).toggleClass('cs',true); 
		}
	}
	var id = $(this).attr('data-id')
	const data = {
		flagf,
		id
	}
	post(urlfavorite,data).then(res => {
		if (res.errno !== 0) {
			alert('请登录后收藏该商品！')
			return
		}
	})
})
//点击加入购物车
$('#addUl').on('click','.addShopCar',function () {
	var goodsimgUrl = $(this).parent().parent().find('img').attr('src')
	var nade = $(this).prev().find('p').text().trim().split(',')
	var goodsInfo = nade[0]
	var goodsParams = nade[1]
	var price = $(this).prev().find('span').text().trim()
	var reg = /[0-9a-z]+/gi;
	var goodsCount = 1
	var username = $('#loginStatus2').find('span').text()
	let crtTime = Date.now();

	// console.log('username',username);
	
	price = price.match(reg).toString()
	const data = [{
		goodsimgUrl,
		goodsInfo,
		goodsParams,
		price,
		goodsCount,
		username,
		crtTime
	}]
	console.log('data',data);
	post(url2, data)
	alert('加入购物车成功！')
});
//退出登录
$quit.click(() => {
	get(urlquit)
	window.location='index.html'
})

//搜索

$('.submit').on('click',function(){
	var params = $('.text').val()
	window.location='searchGoods.html?'+ params
})
var length = 0
var num = 0
setTimeout(()=>{
	length=$('#addUl').children('ul').length
},500)
//换一批
$('#changeGoods').on('click',function(){
	console.log('length',length);
	if(length-1>=6){
		for(var i=num;i<num+6;i++){
			$('#addUl').children('ul').eq(i).css("display","none")
		}
		length = length - 6
		num+=6
		
		console.log('length',length);
	}else if(length-1<=6){
		num = 0
		console.log('从头');
		
		$('#addUl').children('ul').css("display","block")
		//没有商品了就会从一批开始
		length=$('#addUl').children('ul').length
	}
})