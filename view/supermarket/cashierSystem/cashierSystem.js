/**
 *
 */

var num = 0,
	_curnum;
var curk = 0;

var price, unitPrice, _unitPrice, realPrice, couponPrice = $('#couponPrice').text(),
	integralPrice = $('#integralPrice').text();
var _realPrice, _payPrice, money;



// 档区价格


var token;
var nick;
var goodsList = [];

var gNo = [],
	isgNo = false,
	isgNos = true;

var ListData = {
	goodsListData: []
};
var hangOrderDtata;
var key;
var keyId;
var isMemberVal = false;
var hangOrderNum = [];
var ischeckOut = false;
init();

function init() {
	gNo = [];
	hangOrderDtata = null;
	var offLine = sessionStorage.getItem('offLine');
	console.log(offLine);
	if (offLine == "null") {
		$('.settlementMethod li').addClass('disabled');
	} else {
		$('.settlementMethod li').removeClass('disabled');
	}
	keyId = ''
	if (sessionStorage.getItem("hangOrderData") != null) {
		hangOrderDtata = JSON.parse(sessionStorage.getItem("hangOrderData"));
		keyId = sessionStorage.getItem("clearingId");
	};

	//console.log(hangOrderDtata)
	if (hangOrderDtata != null) {
		isMemberVal = true;
		$("#memberInfo").show();
		getMemberInfo(hangOrderDtata[keyId].token);

		//console.log(hangOrderDtata[0].goodsList);
		$.each(hangOrderDtata[keyId].goodsList, function (index, val) {
			//console.log(val.num);
			getGoodsList(val.gno, curk);
			hangOrderNum.push(val.num);
			curk++;

		});

	}
}

$('#ScanCodeinput').bind('keypress', function (event) {
	var inputkey = $('#ScanCodeinput').val();
	hangOrderNum = [];
	if (!isMemberVal) {
		layer.msg('请先添加会员信息');
		return false;
	}
	if (event.keyCode == "13") {
		if (inputkey == "") {
			return false;
		}
		getGoodsList(inputkey, curk);
		curk++;
		//alert('你输入的内容为：' + $('#ScanCodeinput').val());
	}
});

$('#ScanCodeMember').bind('keypress', function (event) {
	var inputkey = $('#ScanCodeMember').val();
	if (inputkey != "") {
		isMemberVal = true;
	}
	if (event.keyCode == "13") {
		getMemberInfo(inputkey);
	}
});

function getMemberInfo(inputkey) {
	//console.log(inputkey);
	var phone = inputkey;
	$.ajax({
		type: "POST",
		url: getUser,
		data: {
			phone: phone
		},
		// xhrFields: {
		// 	withCredentials: false
		// },
		crossDomain: true,
		success: function (rs) {
			if (rs.status == 200) {
				$('#ScanCodeMemberInput').hide();
				$('#ScanCodeMember').val('');
				$("#memberInfo").show();
				$("#ScanCodeinput").focus();
				renderMenberInfo(rs);
				token = rs.data.token;
				nick = rs.data.nick;
			} else if (rs.status == 301) {
				layer.msg(rs.message, function () {
					$('#ScanCodeMemberInput').hide();
					$('#ScanCodeMember').val('');
					$("#memberInfo").show();
					$("#ScanCodeinput").focus();
					renderMenberInfo(rs);
					token = rs.data.token;
					nick = rs.data.nick;
				});
			} else {
				layer.msg(rs.message);
			}
		}
	});
}

function renderMenberInfo(rs) {
	var html = template('memberInfoList', {
		value: rs.data
	});
	$("#memberInfo").html(html);
}


function getGoodsList(key, status) {

	if (key != '') {
		if (status <= 0) {
			gNo.push(key);
		} else {
			if (gNo[returnSAIndexof(gNo, key)] == key) {
				//num++;
				isgNo = true;
			} else {
				gNo.push(key);
				isgNo = false;
				num = 0;
			}
		}

		//console.log(gNo,isgNo,status)
		//return;
		$.ajax({
			type: "POST",
			url: getGoods,
			data: {
				gno: key
			},
			xhrFields: {
				withCredentials: false
			},
			crossDomain: true,
			success: function (rs) {
				if (rs.status == 200) {
					//console.log(rs.data);
					$("#ScanCodeinput").focus();
					$('#ScanCodeinput').val('');
					if (isgNo) {
						var index = returnIndexof(ListData.goodsListData, rs.data.goodsId);
						//console.log(index)
						console.log(ListData.goodsListData[0].num)
						rs.data.num = ListData.goodsListData[index].num + 1;
						rs.data.price = priceCount(rs.data.price, rs.data.num);
						ListData.goodsListData[index] = rs.data;
					} else {
						if (hangOrderNum.length > 0) {
							rs.data.num = hangOrderNum[returnSAIndexof(gNo, key)];
						} else {
							rs.data.num = 1;
						}
						rs.data.price = priceCount(rs.data.price, rs.data.num);
						ListData.goodsListData.push(rs.data);
					}

					renderGoodsList(ListData, isgNo);
				} else {
					layer.msg(rs.message)
				}
			}
		})
	}


}


function renderGoodsList(data, isgNo) {

	if (!isgNos) {
		console.log(data.goodsListData.reverse());
	}
	if (!isgNo) {
		console.log(data.goodsListData.reverse());
	}

	isgNos = true;
	var html = template('GoodsList', {
		list: data
	});
	$("#Goods").html(html);
	getAllotPrice(data.goodsListData);
	getPrice(data.goodsListData);


}

function getAllotPrice(rs) {
	//console.log(rs)
	var _allotOnePrice = '',
		_allotTowPrice = '';

	for (i in rs) {
		if (rs[i].allotTitle == '一档区') {
			_allotOnePrice += rs[i].price;
			_allotOnePrice += '+';
		} else {
			_allotTowPrice += rs[i].price;
			_allotTowPrice += '+';
		}
	}
	// var _allotOnePrice,_allotTowPrice;
	$('#allotOnePrice').text(priceAcount(_allotOnePrice));
	$('#allotTowPrice').text(priceAcount(_allotTowPrice));

}

function priceAcount(rs) {
	//console.log(rs)
	var Price;
	if (rs != '') {
		var str = '';
		str = rs.substring(0, rs.length - 1);
		Price = eval(str).toFixed(2);
	}
	return Price;
}

// 数量计算
function addCount(el, num) {
	_curnum = parseInt(num) + 1;
	var id = el.attr('data-goodsId');
	var index = returnIndexof(ListData.goodsListData, id);
	//console.log(index);
	ListData.goodsListData[index].num = _curnum;

	//console.log(_curnum,num);
	return _curnum;
}

function minusCount(el, _num) {
	_curnum = parseInt(_num) - 1;
	var id = el.attr('data-goodsId');
	var index = returnIndexof(ListData.goodsListData, id);

	if (_curnum <= 0) {
		// console.log(el);
		el.addClass('disabled');
		el.parent().parent().parent().remove();
		$('#realPrice').text('0.00');
		$('.payPrice').text('0.00');
		ListData.goodsListData[index].num = 0;
		isgNos = false;
	} else {
		ListData.goodsListData[index].num = _curnum;
	}
	//console.log(ListData.goodsListData);
	//console.log(num);
	return _curnum;
}

// 价格计算

function priceCount(unitPrice, _curnum, el) {

	//console.log(unitPrice,_curnum)
	_unitPrice = parseFloat(unitPrice) * _curnum;
	if (el != undefined) {
		var id = el.attr('data-goodsId');
		var index = returnIndexof(ListData.goodsListData, id);
		console.log(index, ListData.goodsListData[index]);
		ListData.goodsListData[index].price = _unitPrice.toFixed(2);
	}
	//console.log(key);
	return _unitPrice.toFixed(2);
}

function realPriceCount(type, realPrice, unitPrice) {
	//console.log(realPrice, unitPrice)
	if (unitPrice <= 0) {
		return false;
	}

	if (type == "add") {
		_realPrice = (parseFloat(realPrice) + unitPrice).toFixed(2);
	} else if (type == "minus") {
		_realPrice = (parseFloat(realPrice) - unitPrice).toFixed(2);
		if (_realPrice <= 0) {
			_realPrice = '0.00';
		}
	}
	if (_realPrice == 0) {
		_payPrice = '0.00';
	} else {
		_payPrice = (_realPrice - couponPrice - integralPrice).toFixed(2);
	}
	//console.log(_payPrice);
	$('#realPrice').text(_realPrice);
	$('.payPrice').text(_payPrice);
}

// 返回数组下标
function returnSAIndexof(arr, value) {
	var _curIndex;

	var a = arr; //为了增加方法扩展适应性。我这稍微修改了下
	for (var i = 0; i < a.length; i++) {
		if (a[i] == value) {
			_curIndex = i;
		}
	}

	//console.log(_curIndex);
	return _curIndex;
}

// 返回数组下标
function returnIndexof(arr, value) {
	//console.log(arr,value)
	var _curIndex;

	var a = arr; //为了增加方法扩展适应性。我这稍微修改了下
	for (var i = 0; i < a.length; i++) {
		if (a[i].goodsId == value) {
			_curIndex = i;
		}

	}

	return _curIndex;
}


function getPrice(realPrice) {
	var _realPrice, _payPrice;
	var str = '';
	for (i in realPrice) {
		str += realPrice[i].price;
		str += '+';
	}
	str = str.substring(0, str.length - 1);
	_realPrice = eval(str).toFixed(2);
	_payPrice = (_realPrice - couponPrice - integralPrice).toFixed(2);
	//console.log(_realPrice);
	$('#realPrice').text(_realPrice);
	$('.payPrice').text(_payPrice);
}


// 清空重置

function reset() {
	$("#Goods").html('');
	$('#realPrice').text('0.00');
	$('.payPrice').text('0.00');
	$('#ScanCodeMemberInput').show();
	$('#ScanCodeMember').val('');
	$('#ScanCodeinput').val('');
	$('#relTakePrice').val('');
	$('#changePrice').val('');
	$('#memberInfo').hide();
	gNo = [];
	curk = 0;
	isgNo = false;
	num = 0;
	ListData.goodsListData = [];
	ischeckOut = false;
	sessionStorage.setItem("hangOrderData", null);
	$('#allotOnePrice').text('0.00');
	$('#allotTowPrice').text('0.00');
}




// 挂账

function uplodOrder() {
	var goodsList = [];
	var _payPrice = $('#payPrice').text();
	if (parseFloat(_payPrice) <= 0) {
		layer.msg('请先添加商品');
		return false;
	}

	$('#Goods li').each(function (index, el) {
		var goodsInfo = {
			"gno": '0',
			"goodsId": 0,
			"fromSkuId": 0,
			"money": 0,
			"num": 0,
			"specValueId": 0
		};
		goodsInfo.gno = $(el).attr('data-gNo');
		goodsInfo.goodsId = $(el).attr('data-goodsId');
		goodsInfo.fromSkuId = $(el).attr('data-fromSkuId');
		goodsInfo.specValueId = $(el).attr('data-specValueId');
		goodsInfo.num = $(el).find('.number').text();
		goodsInfo.money = $(el).find('.price').text().substring(1);
		goodsList.push(goodsInfo);
	})
	//console.log(goodsList)

	var data = {
		"wcBillOptionList": goodsList,
		// "sumMoney": _payPrice,
		"token": token,
		// "nick": nick
	}
	//console.log(data)
	$.ajax({
		type: "post",
		url: saveHangOrder,
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		xhrFields: {
			withCredentials: false
		},
		crossDomain: true,
		success: function (rs) {
			if (rs.status == 200) {
				layer.msg('挂账成功');
				reset();
				resetKeyboard();
			} else {
				layer.msg(rs.message)
			}
		}
	});
}

// 结账

function checkOut() {
	console.log(ischeckOut);

	if (ischeckOut) {
		return false;
	}

	var goodsList = [];
	var _payPrice = $('#payPrice').text();
	var _relTakePrice = $('#relTakePrice').val();

	if (parseFloat(_payPrice) <= 0) {
		layer.msg('请先添加商品');
		ischeckOut = false;
		return false;
	}

	if (_relTakePrice == '') {
		layer.msg('实收金额不能为空');
		ischeckOut = false;
		return false;
	} else if (parseFloat(_relTakePrice) < parseFloat(_payPrice)) {
		layer.msg('实收金额不能小于应收金额');
		ischeckOut = false;
		return false;
	}
	var index = layer.load(3, {
		shade: [0.8, '#000'],
	});
	$('#Goods li').each(function (index, el) {
		var goodsInfo = {
			"gno": '0',
			"goodsId": 0,
			"fromSkuId": 0,
			"money": 0,
			"num": 0,
			"specValueId": 0,
			"allotTitle": 0
		};
		goodsInfo.gno = $(el).attr('data-gNo');
		goodsInfo.goodsId = $(el).attr('data-goodsId');
		goodsInfo.fromSkuId = $(el).attr('data-fromSkuId');
		goodsInfo.specValueId = $(el).attr('data-specValueId');
		goodsInfo.allotTitle = $(el).attr('data-allotType');
		goodsInfo.num = $(el).find('.number').text();
		goodsInfo.money = parseFloat($(el).find('.price').text().substring(1) / goodsInfo.num);
		goodsList.push(goodsInfo);
	})
	//console.log(goodsList)

	var data = {
		"wcBillOptionList": goodsList,
		// "sumMoney": _payPrice,
		"token": token,
		// "nick": nick
	}
	console.log(goodsList);
	//现金支付
	ischeckOut = true;
	$.ajax({
		type: "POST",
		url: payByCash,
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		xhrFields: {
			withCredentials: false
		},
		crossDomain: true,
		success: function (rs) {
			if (rs.status == 200) {
				layer.close(index);
				layer.msg('结账成功');
				reset();
				resetKeyboard();
			} else {
				layer.close(index);
				ischeckOut = false;
				layer.msg(rs.message)
			}
		}
	});
}


$("#barCode").startListen({
	barcodeLen: 18,
	letter: true,
	number: true,
	check: true,
	show: function (code) {
		getBarCode(code);
	}
});

function getBarCode(code) {
	if (ischeckOut) {
		return false;
	}
	var goodsList = [];
	var _payPrice = $('#payPrice').text();
	if (parseFloat(_payPrice) <= 0) {
		layer.msg('请先添加商品');
		return false;
	}

	$('#Goods li').each(function (index, el) {
		var goodsInfo = {
			"gno": '0',
			"goodsId": 0,
			"fromSkuId": 0,
			"money": 0,
			"num": 0,
			"specValueId": 0,
			"allotTitle": 0
		};
		goodsInfo.gno = $(el).attr('data-gNo');
		goodsInfo.goodsId = $(el).attr('data-goodsId');
		goodsInfo.fromSkuId = $(el).attr('data-fromSkuId');
		goodsInfo.specValueId = $(el).attr('data-specValueId');
		goodsInfo.allotTitle = $(el).attr('data-allotType');
		goodsInfo.num = $(el).find('.number').text();
		goodsInfo.money = parseFloat($(el).find('.price').text().substring(1) / goodsInfo.num);
		goodsList.push(goodsInfo);
	})
	//console.log(goodsList)

	var data = {
		"goodsList": goodsList,
		"sumMoney": _payPrice,
		"token": token,
		"nick": nick
	}

	//扫码支付
	$.ajax({
		type: "post",
		url: payByScan + "?barcode=" + code,
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		xhrFields: {
			withCredentials: false
		},
		crossDomain: true,
		success: function (rs) {
			if (rs.status == 200) {
				layer.msg('结账成功');
				ischeckOut = true;
				$('.cashList').show();
				$('.scanCodeList').hide();
				$('#barCode').blur();
				$('.settlementMethod li:eq(0)').addClass('active');
				$('.settlementMethod li:eq(1)').removeClass('active');
				reset();
				resetKeyboard();
			} else {
				reset();
				ischeckOut = true;
				layer.msg(rs.message)
			}
		}
	});
}

//获得优惠券
function getCoupons() {
	if (!isMemberVal) {
		layer.msg('请先添加会员信息');
		return false;
	}
	var index = layer.load();
	//查询用户优惠券
	$.ajax({
		type: "POST",
		url: userCoupons,
		data: {
			page: "1",
			pageSize: 10,
			token: token
		},
		// contentType: "application/json",
		// dataType: 'json',
		xhrFields: {
			withCredentials: false
		},
		crossDomain: true,
		success: function (rs) {
			if (rs.status == 200) {
				if (rs.data.total == 0) {
					layer.msg('当前用户暂无可使用优惠券', {
						time: 3000
					});
					layer.close(index);
					return false
				};
				//初始化优惠券表格
				drawing()
				layer.close(index);
				layer.open({
					type: 1,
					title: '使用优惠券',
					content: $('#layui_table'),
					area: ['500px', '300px']
				});
			} else {
				layer.close(index);
				layer.msg(rs.message)
			}
		}
	});
}


function drawing() {
	var data = [{
		id: 1,
		name: '一张抵用券',
		money: '100',
		time: '2019/10/25'
	}, {
		id: 2,
		name: '又一张抵用券',
		money: '200',
		time: '2019/10/25'
	}, {
		id: 3,
		name: '又又一张抵用券',
		money: '300',
		time: '2019/10/25'
	}];
	var html = template('couponsList', {
		list: data
	});
	$("#lay_tbody").html(html);
}
//使用优惠券
function selectCoupons(id) {
	//关闭页面层
	layer.closeAll('page');
	//获取选中优惠券信息
	console.log(id);
};

$('body').on('click', '.add', function (e) {
	e.preventDefault();
	var _slef = $(this);
	var allotType = _slef.attr('data-allotType');
	var allotOnePrice = $('#allotOnePrice').text();
	var allotTowPrice = $('#allotTowPrice').text()
	num = $(this).siblings('.number').text();
	realPrice = $('#realPrice').text();
	if (num <= 0) {
		unitPrice = 5;
		$(this).siblings('.minus').removeClass('disabled');
	} else {
		unitPrice = $(this).parent().siblings().text().substring(1) / num;

	}

	if (allotType == '一档区') {
		$('#allotOnePrice').text((parseFloat(unitPrice) + parseFloat(allotOnePrice)).toFixed(2));
	} else {
		$('#allotTowPrice').text((parseFloat(unitPrice) + parseFloat(allotTowPrice)).toFixed(2));
	};

	$(this).siblings(".number").text(addCount(_slef, num))
	$(this).parent().siblings().text("¥ " + priceCount(unitPrice, _curnum, _slef));
	realPriceCount("add", realPrice, unitPrice);
})

$('body').on('click', '.minus', function (e) {
	e.preventDefault();
	var _slef = $(this);
	num = $(this).siblings('.number').text();
	realPrice = $('#realPrice').text();
	var allotType = _slef.attr('data-allotType');
	var allotOnePrice = $('#allotOnePrice').text();
	var allotTowPrice = $('#allotTowPrice').text();
	if (num == 0) {
		unitPrice = $(this).parent().siblings().text().substring(1)
	} else {
		unitPrice = $(this).parent().siblings().text().substring(1) / num;
	}
	$(this).siblings(".number").text(minusCount(_slef, num))
	$(this).parent().siblings().text("¥ " + priceCount(unitPrice, _curnum, _slef));

	if (allotType == '一档区') {
		$('#allotOnePrice').text((parseFloat(allotOnePrice) - parseFloat(unitPrice)).toFixed(2));
	} else {
		$('#allotTowPrice').text((parseFloat(allotTowPrice) - parseFloat(unitPrice)).toFixed(2));
	};
	realPriceCount("minus", realPrice, unitPrice);
});


$('.settlementMethod li').on('click', function (e) {
	e.preventDefault();
	if (!isMemberVal) {
		layer.msg('请先添加会员信息');
		return false;
	}
	var type = $(this).index();
	$(this).addClass('active');
	$(this).siblings().removeClass('active');
	if (type == 0) {

		$('.cashList').show();
		$('.scanCodeList').hide();
		$('#barCode').blur();
	}
	if (type == 1) {
		ischeckOut = false;
		$('.cashList').hide();
		$('.scanCodeList').show();
		$('#barCode').focus();
	}
})


$('body').keyup(function () {
	// 先判断焦点是不是在文本框中或者下拉框
	if (document.activeElement.localName != "input" && document.activeElement.localName != "select") {
		//判断按键是不是R
		if (event.ctrlKey && event.keyCode == 112) {
			uplodOrder();
		}

		if (event.ctrlKey && event.keyCode == 113) {
			uplodOrder();
		}

	}
});