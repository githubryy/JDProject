
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
// 个人信息id
const $realname = $('#realname')
const $sex = $('#sex')
const $birthday = $('#birthday')
const $email = $('#email')
const $selfIntroduce = $('#selfIntroduce')
const $imgBoxEdit = $('.imgBoxEdit')
const $img1Edit = $('#img1Edit')
const $img2Edit = $('#img2Edit')
const $img3Edit = $('#img3Edit')
const $addressDetail = $('#addressDetail')
const $street = $('#street')
const $province = $('#province')
const $emailCode = $('#emailCode')
const $country_list = $('#country_list')
const $dataId = $('#dataId')
const $saveAll = $('#saveAll')
// 拼接接口 url
let url = '/api/user/access?'

const urlParams = getUrlParams(url)

get(url).then((res) => {
    if (res.errno !== 0) {
        alert('数据错误')
        return
    }
    // 遍历博客列表，并显示
    const data = res.data || []
    // console.log('data', data);
    $dataId.attr('data-id', res.data[0].id)
    $navUserID.attr('src', res.data[0].userImgurl)
    $username.text(res.data[0].username)
    $realname.val(res.data[0].realname)
    $birthday.val(res.data[0].birthday)
    $sex.val(res.data[0].sex)
    $email.val(res.data[0].email)
    $selfIntroduce.val(res.data[0].self_introduce)
    $img1Edit.attr('src', res.data[0].userImgurl)
    $img2Edit.attr('src', res.data[0].userImgurl)
    $img3Edit.attr('src', res.data[0].userImgurl)
    $addressDetail.val(res.data[0].address_detail)
    $street.val(res.data[0].self_street)
    $province.val(res.data[0].province)
    $emailCode.val(res.data[0].email_code)
    $country_list.val(res.data[0].country)
})
//修改数据
function edit() {
    //获取表单数据
    const realname = $realname.val()
    const birthday = $birthday.val()
    const sex = $sex.val()
    const email = $email.val()
    const selfIntroduce = $selfIntroduce.val()
    const addressDetail = $addressDetail.val()
    const street = $street.val()
    const province = $province.val()
    const emailCode = $emailCode.val()
    const country_list = $country_list.val()
    const img1Edit = $img1Edit.attr('src')
    const $username = $('#username')
    // console.log(111111111);
    const id = $dataId.attr('data-id')
    //请求地址
    let url = '/api/user/update?id=' + id
    const data = {
        realname,
        birthday,
        sex,
        email,
        selfIntroduce,
        addressDetail,
        street,
        province,
        emailCode,
        country_list,
        img1Edit
    }
    post(url, data).then(res => {
        if (res.errno !== 0) {
            alert('操作错误')
            return
        }
        alert('更新成功')
        location.href = 'personInfo.html'
    })

}
$saveAll.click(() => {
    this.edit()

})



//页面Dom操作

var editHeadBtn = document.querySelector('#editHeadBtn')
var imgListEdit = $('.imgListEdit ')
var mainEdit = $('.mainEdit')
var cancelBtn = document.querySelector('.cancelBtn')
var confirmEdit = document.querySelector('.confirmEdit')
var fileInput = document.querySelector('#fileEdit ')
var imgBoxEdit = $('.imgBoxEdit')
var boxEdit = document.querySelector('.boxEdit')
var smallEdit = document.querySelector('#smallEdit')
var bigEdit = document.querySelector('#bigEdit')

var img1Edit = $('#img1Edit')
var img2Edit = $('#img2Edit')
var img3Edit = $('#img3Edit')
var backgroundEdit = $('.backgroundEdit')
var grayEdit = $('.grayEdit')
var fileEdit = null;

var dx, dy, mx, my, scale = 1, positionX, positionY, scaleWidth, scaleHeight


/** @type {HTMLCanvasElement} */
var canvasNode = document.createElement('canvas')
canvasNode.width = 300;
canvasNode.height = 300;
var cvs = canvasNode.getContext('2d')
/** @type {HTMLCanvasElement} */
var mycanvas = document.createElement('canvas')
mycanvas.width = parseInt(imgBoxEdit.css('width'))
mycanvas.height = parseInt(imgBoxEdit.css('height'))
var ctx = mycanvas.getContext('2d')


fileInput.onchange = function (e) {
    grayEdit.css('display', 'none')
    fileEdit = fileInput.files[0];
    var url = window.webkitURL.createObjectURL(fileEdit)
    var img = new Image()
    img.src = url

    function changeScale() {
        /* 初始化和改变缩放倍数时执行的函数 */
        scaleWidth = img.width * scale
        scaleHeight = img.height * scale
        imgBoxEdit.css({
            'backgroundImage': `url(${img.src})`,
            'backgroundSize': `${scaleWidth}px ${scaleHeight}px`,
            'backgroundPositionX': `${-(scaleWidth / 2 - parseInt(imgBoxEdit.css('width')) / 2)}px`,
            'backgroundPositionY': `${-(scaleHeight / 2 - parseInt(imgBoxEdit.css('height')) / 2)}px`
        })
    }
    function drewCanvas() {
        /* 通过一个和imgBox一样大的canvas去获取当前显示区域的img信息，显示在与显示区域一样大的另一个canvas中 */
        ctx.clearRect(0, 0, 600, 550)
        ctx.drawImage(img, positionX, positionY, scaleWidth, scaleHeight)
        var date = ctx.getImageData(150, 125, 300, 300)
        cvs.putImageData(date, 0, 0);
    }
    function otherImgChange() {
        positionX = parseInt(imgBoxEdit.css('backgroundPositionX'))
        positionY = parseInt(imgBoxEdit.css('backgroundPositionY'))
        drewCanvas()
        img1Edit.attr('src', canvasNode.toDataURL())
        img2Edit.attr('src', canvasNode.toDataURL())
        img3Edit.attr('src', canvasNode.toDataURL())
    }
    boxEdit.onmousewheel = function (e) {
        /* 滚轮缩放 */
        if (e.deltaY > 0 && scale > 0.05) {
            scale -= 0.05
        } else if (e.deltaY < 0) {
            scale += 0.05
        }
        changeScale()
        otherImgChange()
    }
    smallEdit.onclick = function () {
        /* 点击放大 */
        if (scale > 0.05) {
            scale -= 0.05
        }
        changeScale()
        otherImgChange()
    }
    bigEdit.onclick = function () {
        /* 点击缩小 */
        scale += 0.05
        changeScale()
        otherImgChange()
    }
    img.onload = function () {
        changeScale()
        otherImgChange()
        boxEdit.onmousedown = function (de) {
            dx = de.clientX;
            dy = de.clientY;
            positionX = parseInt(imgBoxEdit.css('backgroundPositionX'))
            positionY = parseInt(imgBoxEdit.css('backgroundPositionY'))
            boxEdit.onmousemove = function (me) {
                me.preventDefault()
                mx = me.clientX
                my = me.clientY
                /* 只改变我们能够看到的imgBox的位置，在下面通过函数调用去改变画布中的位置 */
                imgBoxEdit.css({ 'backgroundPositionX': `${positionX + (mx - dx)}px`, 'backgroundPositionY': `${positionY + (my - dy)}px` })
                // otherImgChange()
                drewCanvas()
            }
            boxEdit.onmouseup = function () {
                otherImgChange()
                boxEdit.onmousemove = null;
            }
        }
    }

}
editHeadBtn.onclick = function () {
    console.log(11);
    mainEdit.css({ 'opacity': '1' })
    mainEdit.css('left', '25%')
}
cancelBtn.onclick = function () {
    console.log(11);
    mainEdit.css({ 'opacity': '0' })
    mainEdit.css('left', '200%')
}
confirmEdit.onclick = function () {
    console.log(11);
    mainEdit.css({ 'opacity': '0' })
    mainEdit.css('left', '200%')
}
//退出登录
$quit.click(() => {

    url = '/api/user/logout'
    get(url)

})
$quitchange.click(() => {
    url = '/api/user/logout'
    get(url)

})