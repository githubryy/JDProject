
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

get(url).then((res) => {
    if (res.errno !== 0) {
        alert('数据错误')
        return
    }
    // 遍历博客列表，并显示
    const data = res.data || []
    // console.log('data', data);
    $navUserID.attr('src', res.data[0].userImgurl)
    $username.text(res.data[0].realname)

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
