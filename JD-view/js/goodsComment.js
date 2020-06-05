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
        console.log('data11111111', data);
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
        // console.log('i',i);

    })
  
    
}
function loadCommentGoodsinfo() {
    
    var releaseDate = getFormatDate(goodsList[0].crtTime) || ''
    console.log('releaseDate', releaseDate);
    console.log('goodsList', goodsList);
    $('#goodsinfo').text(goodsList[0].goodsinfo)
    $('#goodsimg').attr('src',goodsList[0].goodsimgUrl)
    
    console.log('goodsList[0].categories',goodsList[0].categories);
    //商品类别
    var goodsCategories=goodsList[0].categories.split(',')
    goodsCategories.forEach(item=>{
            
         $('#categories').append($(`
         <a href="#">${item}</a>`))
    })
    //评论过该商品的人
    var commentPerson=goodsList[0].commentPerson.split(',')
    $('#commentPerson').empty()
    console.log('commentPerson',commentPerson);
    
    commentPerson.forEach(item=>{
        var urlCommentUser = '/api/user/access?commentUser='+item
        get(urlCommentUser).then(res=>{
            console.log('res.data[0]',res.data[0]);
            $('#commentPerson').append($(`
            <li><a href="#"><img alt="" src="${res.data[0].userImgurl?res.data[0].userImgurl:''}"></a></li>`))
        })
       
   })
    $('#releaseDate').append(releaseDate)
    $('#commentsCount').append(goodsList[0].commentCount+'条评论')
    $('#goodsParams').append(goodsList[0].goodsParams)
    
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
            console.log('urlgoodsList',urlgoodsList);
            
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




// 搜索
// $btnSearch.click(() => {
//     // console.log('urlgoodsList',urlgoodsList);
//     const keyword = $textKeyword.val()
//     console.log('keyword', keyword);
//     if (keyword || keyword === '') {
//         urlgoodsList += 'keyword=' + keyword
//         initLoad(urlgoodsList)
//         urlgoodsList = '/api/myorder/goodslist?'
//     }
// })




//退出登录
$quit.click(() => {

    urlgoodsList = '/api/user/logout'
    get(urlgoodsList)

})
$quitchange.click(() => {
    urlgoodsList = '/api/user/logout'
    get(urlgoodsList)

})

