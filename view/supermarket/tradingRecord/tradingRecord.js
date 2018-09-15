//  初始化
var payWay, beginTime, endTime, _curr;

init();

function init() {
	
	laydate.render({
		elem: '#startDate',
		theme: 'molv',
		value: new Date(),
		max: 0,
		done: function (value) {
			beginTime = value;
			getOrderList(_curr, payWay, beginTime, endTime);
		}
		
	});
	laydate.render({
		elem: '#endDate',
		theme: 'molv',
		value: new Date(),
		max: 0,
		done: function (value) {
			endTime = value;
			getOrderList(_curr, payWay, beginTime, endTime);
		}
	});
	
	payWay = $('#cateone').val();
	beginTime = $('#startDate').val();
	endTime = $('#endDate').val();
	_curr = 1;
	
	getOrderList(_curr, payWay, beginTime, endTime);
}

$('#cateone').change(function () {
	payWay = $(this).val();
	getOrderList(_curr, payWay, beginTime, endTime);
})


// 查看详情

$('body').off('click').on('click', '#orderListDemo .check_btn', function (e) {
	e.preventDefault();
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
			$('.print_btn').attr({'data-id':orderId});
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
				var payWayText = ['无', '现金', '支付宝', '微信'];
				var html = template('orderDetailList', {
					list: rs.data.orderOptionList
				});
				
				$("#orderDetailListDemo").html(html);
				$('.nick').text(rs.data.nick)
				$('#realPrice').text(rs.data.receipt);
				$('#payPrice').text(rs.data.totalMoney);
				queryMenberIFFnfo(rs.data.token, function (val) {
					console.log(val);
					$('#nick').text(val.nick);
					$('#phone').text(val.phone);
					$('#orderCode').text(data.orderId);
					$('#payWay').text(payWayText[data.payWay]);
					$('#payTime').text(data.payTime);
					$('#employeeName').text(data.employeeName);
					
				})
			}
		}
	})
}


//  获取 所有订单数据
function getOrderList(_curr, payWay, beginTime, endTime) {
	//layer.load(2);
	
	var data = {
		"pageNum": _curr,
		"pageSize": 10,
		"payWay": payWay,
		"beginTime": beginTime,
		"endTime": endTime
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
					// html = ''
					$("#orderListDemo").hide();
					$("#noeList").show();
					$('#page').hide();
					//layer.closeAll('loading');
				} else {
					$("#orderListDemo").show();
					$('#page').show();
					$("#noeList").hide();
					template.defaults.imports.getPayWay = function (key) {
						var payWayText = ['无', '现金', '支付宝', '微信'];
						return payWayText[key]
					};
					html = template('orderList', {
						list: rs.data.rows
					});
				}
				setTimeout(function () {
					// layer.closeAll('loading');
					$("#orderListDemo").html(html);
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
					getOrderList(curr, payWay, beginTime, endTime);
				}
			}
		})
	}
}


// 打印下票

$('body').on('click', '.print_btn', function (e) {
	e.preventDefault();
	var orderId = $(this).attr('data-id');
	$.ajax({
		type: "get",
		url: printWc,
		data: {
			orderId: orderId
		},
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (rs) {
			if (rs.status == 200) {
				layer.msg('打印成功！')
			} else {
				layer.msg(rs.message)
			}
		}
	})
	
});



