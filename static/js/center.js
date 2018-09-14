/*接口*/
// var turl = "http://192.168.0.133:8080";
//var turl = "http://120.79.90.220:8080";
// var turl = "http://127.0.0.1:8080";
//http://192.168.0.51:8888
var turl = "http://192.168.0.51:8888";

/*接口api*/


var getUser = turl + "/cashier/cashier/getUser"; // 获取会员信息
var getGoods = turl + "/cashier/cashier/getGoods"; // 获取商品信息
var payByCash = turl + "/cashier/cashier/payByCash"; // 现金支付
var payByScan = turl + "/cashier/cashier/payByScan"; // 扫码支付

var saveHangOrder = turl + "/cashier/hangOrder/saveHangOrder"; // 保存挂单
var getLoginEmployee = turl + "/cashier/login/getLoginEmployee"; //获取当前登录员工
var updateStatus = turl + "/cashier/login/updateStatus"; //上传员工 当班状态
var getCheckOut = turl + "/cashier/login/getCheckOut"; //下班时获取收银详情
var logout = turl + "/cashier/login/logout"; // 下班
var authorize = turl + "/cashier/login/authorize"; // 下班授权

var findOrderDetail = turl + "/cashier/order/findOrderDetail"; // 查询订单详情
var findPage = turl + "/cashier/order/findPage"; // 查询订单详情
var deleteOrder = turl + "/cashier/order/delete"; //删除订单
var getHangOrderList = turl + "/cashier/hangOrder/getHangOrderList"; //获取挂单数据
var removeHangOrder = turl + "/cashier/hangOrder/removeHangOrder"; //删除挂单数据


var getIntegralGoods = turl + "/cashier/integralCashier/getIntegralGoods"; // 积分获取商品信息

var payIntegralOrder = turl + "/cashier/integralCashier/payIntegralOrder"; // 积分支付
var checkPassword = turl + "/cashier/integralCashier/checkPassword"; // 校验账户密码

var findIntegralOrderPage = turl + "/cashier/integralOrder/findPage"; // 获取积分订单列表
var findIntegralOrderDetail = turl + "/cashier/integralOrder/findOrderDetail"; // 获取积分订单详情

// 超市
var findReturnOrder = turl + "/cashier/return/findOrder"; // 获取退货订单
var batchReturn = turl + "/cashier/return/batchReturn"; // 批量退货

// 积分
var findIntegralOrder = turl + "/cashier/integralReturn/findIntegralOrder"; // 获取积分退货订单
var integralReturn = turl + "/cashier/integralReturn/batchReturn"; // 积分批量退货


var saveHangIntegralOrder = turl + "/cashier/hangIntegralOrder/saveHangIntegralOrder"; // 积分保存挂单
var getHangIntegralOrderList = turl + "/cashier/hangIntegralOrder/getHangIntegralOrderList"; //获取积分挂单数据
var removeHangIntegralOrder = turl + "/cashier/hangIntegralOrder/removeHangIntegralOrder"; //删除积分挂单数据


var printWc = turl + "/cashier/print/wc"; //打印网超小票
var printIntegral = turl + "/cashier/print/integral"; //打印积分小票


//获取当前登录的 门店账号‘
var getLoginStore = turl + "/cashier/login/getLoginStore"; //打印积分小票


function queryMenberIFFnfo(token, callback) {
    $.ajax({
        type: "get",
        url: getUser,
        data: {
            phone: token
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (rs) {
            if (rs.status == 200) {
                callback(rs.data);
            }
        }
    });
}


function removeHTML(str) {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白
    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
    str = str.replace(/&nbsp;/ig, ''); //去掉&nbsp;
    str = str.replace(/\s/g, ''); //将空格去掉
    return str;
}


/*时间渲染*/
function add0(m) {
    return m < 10 ? '0' + m : m
}

function format(times) {
    var time = new Date(times);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    /*  return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm);*/
    return y + '-' + add0(m) + '-' + add0(d);
}

function formats(times) {
    var time = new Date(times);

    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
    /*return y + '-' + add0(m) + '-' + add0(d);*/
}


//判断比例  %
function typebl(val) {
    if (val == null) {
        return val;
    } else {
        return parseFloat((val * 100).toPrecision(12)) + "%";
    }
}

/*判断为空*/
function nulls(s) {
    if (s == null) {
        s = ""
    }
    return 1;
}

function remove(arr, item) {

    if (arr.length) {
        //	console.log(item)
        if (item > -1) {

            return arr.splice(item, 1)
        }
    }
}