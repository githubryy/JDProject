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
// 拼接接口 url
let urlUser = '/api/user/access?'
let urlgoodsList = '/api/myorder/goodslist?'
let urlComment = '/api/myorder/comment?'
let params = window.location.search.split('?')[1] || ''
let paramsId = window.location.search.split('?')[2] || ''


const urlParams = getUrlParams(urlgoodsList)
if (urlParams.keyword) {
    urlComment += '&keyword=' + urlParams.keyword
}
var goodsList = null
function initLoad() {
    get(urlgoodsList).then((res) => {
        if (res.errno !== 0) {
            alert('数据错误')
            return
        }
        // 遍历博客列表，并显示
        const data = res.data || []
        $('.top-news').empty()

        goodsList = data
        loadGoods()
    })
}
function loadGoods() {
    $.each(goodsList, function (i, item) {
        var classColor = 'red'
        var classColorArr = ['red', 'green', 'blue', 'yellow', 'purple']
        if (i <= 4) {
            classColor = classColorArr[i]
            var goodsHtml =
                '<a href="#" class="btn ' + classColor + '" style="display: flex">' +
                '<div style="display: flex;flex-direction: column;justify-content: space-around;">' +
                '<span style=" width:300px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"">' + item.goodsinfo + '</span>' +
                '<em style="width: 280px;height:40px;overflow: hidden;text-overflow:ellipsis;">' + item.goodsParams + '</em>' +
                '<em>' +
                '<i class="icon-tags"></i>'
                + ' ' + item.categories +
                '</em>' +
                '</div >' +
                '<div class="span4" >' +
                '<img style="width: 105px;height: 105px;" src="' + item.goodsimgUrl + '">' +
                ' </div>' +
                '</a>'
            $('.top-news').append(goodsHtml)
        }

    })


}
function loadCommentGoodsinfo() {

    var releaseDate = getFormatDate(goodsList[0].crtTime) || ''

    $('#goodsinfo').text(goodsList[0].goodsinfo)
    $('#goodsimg').attr('src', goodsList[0].goodsimgUrl)


    //商品类别
    var goodsCategories = goodsList[0].categories.split(',')
    goodsCategories.forEach(item => {

        $('#categories').append($(`
         <a href="#">${item}</a>`))
    })
    //评论过该商品的人
    var commentPerson = goodsList[0].commentPerson.split(',')
    $('#commentPerson').empty()
    // console.log('commentPerson',commentPerson);
    commentPerson.forEach(item => {
        var urlCommentUser = '/api/user/access?commentUser=' + item
        get(urlCommentUser).then(res => {
            // console.log('res.data[0]',res.data[0]);
            $('#commentPerson').append($(`
            <li><a href="#"><img alt="" src="${res.data[0].userImgurl ? res.data[0].userImgurl : ''}"></a></li>`))
        })

    })
    $('#releaseDate').append(releaseDate)
    $('#commentsCount').append(goodsList[0].commentCount + '条评论')
    $('#goodsParams').append(goodsList[0].goodsParams)
    //获取评论
    var urlCommentsList = '/api/myorder/getGoodsCommentsList?pGoodsinfo=' + params
    $('#comments').empty()
    get(urlCommentsList).then(res => {
        if (res.data.length < 1) {
            // console.log(1);
            $('#comments').append('<h1>暂无该商品的评论信息,快来评论吧!</h1>')
        }
        console.log('res', res.data);
        res.data.forEach(item => {
            $('#comments').append($(`
            <div class="media">	
            <a href="#" class="pull-left">
                <img alt="" src="${item.userImgurl}" class="media-object">
            </a>
            <div class="media-body">
                <h4 class="media-heading">${item.username}<span>${getFormatDate(item.crtTime) || ''}</span></h4>
                <p> ${item.comment}. </p>
            </div>
        </div>
        <hr>
            `))
        })
    })

}
get(urlUser).then((res) => {
    if (res.errno !== 0) {
        alert('数据错误')
        return
    }
    $navUserID.attr('src', res.data[0].userImgurl ? res.data[0].userImgurl : "media/image/avitor.png")
    $username.text(res.data[0].username)
})
    .then(() => {
        initLoad()
    })
    .then(() => {
        if (params || params === '') {
            urlgoodsList += 'goodsinfo=' + params


            get(urlgoodsList).then(res => {
                if (res.errno !== 0) {
                    alert('数据错误')
                    return
                }
                // $('#goodsinfo').empty()
                const data = res.data || []
                goodsList = data
                loadCommentGoodsinfo()
                urlgoodsList = '/api/myorder/goodslist?'
            })

        }
    })

// 发表评论
$('#handleComment').click(() => {
    var crtTime = new Date().getTime()
    var content = $('#pushDetail').val()
    var goodsinfo = $('#goodsinfo').text()
    var username = $('#username').text()
    let urlHandleComment = '/api/myorder/handleComment'
    const data = {
        content,
        goodsinfo,
        username,
        crtTime
    }
    if(content===''){
         alert('发表评论不能为空！')
        return
    }
    console.log(1);
     post(urlHandleComment,data) 
     
        location.href = location.href
      
})




//退出登录
$quit.click(() => {

    urlgoodsList = '/api/user/logout'
    get(urlgoodsList)

})
$quitchange.click(() => {
    urlgoodsList = '/api/user/logout'
    get(urlgoodsList)

})

