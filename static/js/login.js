var loginType = 2;
var storePwd = '';
//console.log(sessionStorage.getItem("storeId"))
//判断门店是否登陆过-session storage
if (sessionStorage.getItem("storeId") != null) {
    $('.lo_store').hide();
    $('.lo_employee').show();
    $('.lo_title').find('font').text('员工登录')
    $('.lo_title').find('span').show();
}
//判断是密码还是验证码
$('.lo_way span').on('click', function () {
    $(this).addClass('bg-blue').siblings().removeClass('bg-blue');
    $('.lo_pwd1').removeClass('active');
    var _slef = $(this).data('tab');
    if (_slef == 'panel1') {
        loginType = 2

    } else {
        loginType = 1
    }
    $('#' + _slef).addClass('active');
})

//门店注销 
$('.back_btn').on('click', function (e) {
    e.preventDefault()
    $.ajax({
        type: "get",
        url: turl + "/cashier/login/storeLogout",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: false,
        success: function (rs) {
            if (rs.status == 200) {
                layer.msg('注销成功', {
                    time: 1000
                })
                $('#signlogStore').removeAttr('disabled');
                $("#phone").val('')
                $("#storePwd1").val('')
                $("#storePwd2").val('')
                $('.lo_store').show();
                $('.lo_employee').hide();
                $('.lo_title').find('span').hide();
                $('.lo_title').find('font').text('门店登录');
                sessionStorage.removeItem('storeId');
                window.onunload = function () {
                    sessionStorage.clear();
                }
            }
        }
    });
})

// 门店登录 
function signlogStore() {

    var phone = $("#phone").val();
    var data;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;

    if (loginType == 1) {
        storePwd = $("#storePwd2").val();
        data = {
            "phone": phone,
            "code": storePwd,
            "loginType": loginType,
        };
    } else {
        storePwd = $("#storePwd1").val();
        data = {
            "phone": phone,
            "password": storePwd,
            "loginType": loginType,
        };
    }

    if (phone == "" || storePwd == "") {
        layer.msg("请填写信息");
        return;
    }

    if (!myreg.test(phone)) {
        layer.msg("请输入有效的手机号！");
        return false;
    }
    $.ajax({
        type: "POST",
        url: turl + "/auth/store/login",
        data: data,
        // xhrFields: {
        //     withCredentials: true
        // },
        crossDomain: false,
        success: function (rs) {
            if (rs.status == 200) {
                console.log(rs.data);
                sessionStorage.setItem("offLine", rs.data);
                $('#signlogStore').attr({
                    'disabled': "disabled"
                });
                layer.confirm('门店登录成功，是否同步数据', {
                    btn: ['同步', '否'],
                    closeBtn: 0
                }, function () {
                    inStepData(phone);
                }, function () {
                    layer.closeAll();
                    sessionStorage.setItem("storeId", phone);
                    $('.lo_title').find('font').text('员工登录')
                    $('.lo_store').hide();
                    $('.lo_employee').show();
                    $('.lo_title').find('span').show();
                })

            } else if (rs.status == 201) {
                sessionStorage.setItem("offLine", "null");
                layer.msg(rs.message, {
                    time: 1000
                });
                $('.lo_title').find('font').text('员工登录')
                $('.lo_store').hide();
                $('.lo_employee').show();
                $('.lo_title').find('span').show();
            } else if (rs.status == 301) {
                $('.updateSystem').show();
                layer.msg('请点击更新系统按钮，更新系统', {
                    time: 2000
                });
            } else {
                layer.msg(rs.message, {
                    time: 1000
                });
            }

        }
    });
}
//同步数据
function inStepData(phone) {
    layer.config({
        offset: ['50%', '50%']
    })
    var index = layer.load(2)
    $.ajax({
        type: "get",
        url: turl + "/cashier/synchronize/data",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (rs) {
            if (rs.status == "200") {
                layer.close(index);
                sessionStorage.setItem("storeId", phone);
                layer.msg(rs.message, {
                    time: 1000
                }, function () {
                    $('.lo_title').find('font').text('员工登录')
                    $('.lo_store').hide();
                    $('.lo_employee').show();
                    $('.lo_title').find('span').show();
                });

            } else {
                layer.msg(rs.message, {
                    time: 1000
                });
                $('#signlogStore').removeAttr('disabled');
                layer.close(index);
            }
        }
    })
}

// 修复员工 /注销员工
$('.repair_btn').on('click', function (e) {
    e.preventDefault()
    var username = $("#names").val();
    if (username == "") {
        layer.msg("请填写信息");
        return;
    }

    $.ajax({
        type: "get",
        url: turl + "/cashier/login/logout",
        data: {
            "username": username
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (rs) {
            if (rs.status == "200") {
                layer.msg(rs.message, {
                    time: 1000
                });
            } else {
                layer.msg(rs.message, {
                    time: 1000
                });
            }
            console.log(rs.data);
        }
    })

})

//员工登录
function signlog() {
    var username = $("#names").val();
    var pwd = $("#pwds").val();
    if (username == "" || pwd == "") {
        layer.msg("请填写信息");
        return;
    }
    layer.config({
        offset: ['50%', '60%']
    })
    $.ajax({
        type: "get",
        url: turl + "/cashier/login/login",
        data: {
            "username": username,
            "password": pwd
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (rs) {
            if (rs.status == "200") {
                layer.msg('登录成功');
                sessionStorage.setItem("name", rs.data.name);
                setTimeout(function () {
                    window.location.href = "longinState.html";
                }, 2000);
            } else if (rs.status == 302) {
                layer.msg(rs.message, {
                    time: 1000
                });
            } else {
                layer.msg(rs.message, {
                    time: 1000
                });
            }
            //console.log(rs.message);
            //layer.msg(rs.msg);
        }
    })
}

// 更新系统
$('.update_btn').on('click', function () {
    var index = layer.load(3);
    $('.loading').show();
    $.ajax({
        type: "get",
        url: "http://127.0.0.1:8080/cashier-reboot/reboot.do",
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (rs) {
            if (rs.status == 200) {
                setTimeout(function () {
                    layer.close(index);
                    $('.loading').hide();
                    layer.msg('更新成功');
                    $('.updateSystem').hide();
                    $("#phone").val('')
                    $("#storePwd1").val('')
                    $("#storePwd2").val('')
                }, 60000)
            }

        }
    })


    //window.open(turl + '/cashier-reboot/reboot.do')
})