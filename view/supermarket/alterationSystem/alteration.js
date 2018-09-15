init()

function init() {
	getOrderList(1);
	getStore();
}

//  获取 所有订单数据
function getOrderList(_curr) {
	//layer.load(2);
	var data = {
		"pageNum": _curr,
		"pageSize": 10,
		"payWay": 0,
		"beginTime": format(new Date()),
		"endTime": format(new Date())
	}
	$.ajax({
		type: "POST",
		url: findPage,
		xhrFields: {
			withCredentials: false
		},
		data: data,
		crossDomain: true,
		success: function (rs) {
			if (rs.status == 200) {
				var html
				if (rs.data.total == 0) {
					$("#alterationList").hide();
					$("#noeList").show();
					$('#page').hide();
					//layer.closeAll('loading');
				} else {
					$("#alterationList").show();
					$('#page').show();
					$("#noeList").hide();
					template.defaults.imports.getPayWay = function (key) {
						var payWayText = ['无', '现金', '支付宝', '微信'];
						return payWayText[key]
					};
					
					html = template('alterationList', {
						list: rs.data.rows
					});
				}
				setTimeout(function () {
					// layer.closeAll();
					$("#alterationListDemo").html(html);
					gainpage(Math.ceil(rs.data.total / 10), _curr, 0);
				}, 0)
			}
		}
	})
}

function gainpage(pages, curr, alltotal) {
	console.log(alltotal)
	if (alltotal < 0) {
		return false;
	} else {
		laypage({
			cont: 'page',
			skip: true, //是否开启跳页
			skin: '#1E9FFF',
			pages: pages,
			curr: curr || 1,
			jump: function (obj, first) {
				var curr = obj.curr;
				if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
					getOrderList(curr);
				}
			}
		})
	}
}

// 下班

function getLogout() {
	var index = layer.load(3,{
		shade: [0.8,'#000'],
	});
    $.ajax({
        type: "get",
        url: logout,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (rs) {
            if (rs.status == 201 || rs.status == 200) {
	            layer.close(index);
                layer.msg('下班成功', {
                    time: 2000
                },function () {
                	window.location.href = "login.html";
                });
               
            }
        }
    })
}

// 获取店铺信息
function getStore(){
	$.ajax({
		type: "POST",
		url: getLoginStore,
		xhrFields: {
			withCredentials: false
		},
		crossDomain: true,
		success: function(rs) {
			if (rs.status == 200 ) {
				// 存储 店铺名称
				sessionStorage.setItem("StoreName", rs.data.storeName);
			} else {
				layer.msg(rs.message);
			}
			
		}
	})
}

$('body').off('click').on('click', '#alterationListDemo .check_btn', function (e) {
	var html = $('#refundPanel');
	var orderId = $(this).attr('data-id');
	
	layer.open({
		title: '订单详情',
		type: 1,
		closeBtn: 2,
		shadeClose: true, //开启遮罩关闭
		area: ['1054px', '650px'], //宽高
		content: html,
		success: function () {
			getOrderDetail(orderId);
		}
	});
})

function getOrderDetail(orderId) {

	$.ajax({
		type: "get",
		url: findOrderDetail,
		data: {
			orderId: orderId
		},
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (rs) {
			if (rs.status == 200) {
				var data = rs.data;
				var payWayText = ['无', '现金', '扫码', '余额'];
				var html = template('orderDetailList', {
					list: rs.data.orderOptionList
				});
				$("#orderDetailListDemo").html(html);
				$('.nick').text(rs.data.nick);
				$('#realPrice').text(rs.data.receipt);
				$('#payPrice').text(rs.data.totalMoney);
				queryMenberIFFnfo(rs.data.token, function (val) {
					console.log(val);
					$('#nick').text(val.nick)
					$('#phone').text(val.phone)
					$('#orderCode').text(data.orderId)
					$('#payWay').text(payWayText[data.payWay])
					$('#payTime').text(data.payTime)
					$('#employeeName').text(data.employeeName)

				})
			}
		}
	})
}


function openPanel() {
	var html = $('#logoutPanel');
    layer.prompt({
        title: '获取下班授权',
        closeBtn: 2,
	    shade: 0.8,
        formType: 0
    }, function (pass, index) {

        $.ajax({
            type: "get",
            url: authorize,
            data: {
                username: pass
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (rs) {
                if (rs.status == 200) {
                    layer.msg('授权成功', {'time': 1000}, function () {
                        layer.open({
                            title: '今日统计',
                            type: 1,
                            closeBtn: 2,
                            shadeClose: true, //开启遮罩关闭
                            area: ['1054px', '650px'], //宽高
                            content: html,
                            success: function (index, layero) {
                                $.ajax({
                                    type: "get",
                                    url: getCheckOut,
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    crossDomain: true,
                                    success: function (rs) {
                                        if (rs.status == 201 || rs.status == 200) {
                                            console.log(rs);
                                            if (rs.data != null) {
                                                var html1 = template('templateList', {
                                                    value: rs.data
                                                });
                                                var html2 = template('memberList', {
                                                    value: rs.data
                                                });
                                                $("#gatheringList").html(html1);
                                                $("#memberlinfoList").html(html2);
                                                $('#imprestCashLogout').text(rs.data.imprestCashLogout);
                                                $('#storeName').text(sessionStorage.getItem('StoreName'));
                                                $('#LogoutTime').text(rs.data.logoutTime.slice(10, rs.data.logoutTime.length));
                                            }

                                        }
                                    }
                                })
                            }
                        });
                    });
                    //getReturnOrderList(orderId)
                } else {
                    layer.msg(rs.message, {'time': 1000});
                }
            }
        })
        //layer.close(index);
    });

}

