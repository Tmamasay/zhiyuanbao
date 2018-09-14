/**
 *
 */


var num = 0,
	_curnum;
var curk = 0;

var price,
	unitPrice,
	_unitPrice,
	unitIntegral,
	unitIntegral,
	unitFubi,
	realPrice,
	_payPrice;

var token;
var nick;

var gNo = [],
	isgNo = false,
	isgNos = true;

var ListData = {
	goodsListData: []
};

var userName = '';
var hangOrderData;
var PaymentKey = '';
var isMemberVal = false;
var key;
var ischeckOut = false;
var keyId;
var hangOrderNum = [];

init();

function init() {
	
	var offLine = sessionStorage.getItem('offLine');
	//console.log(offLine);
	if (offLine == "null") {
		$('.settlementMethod li').addClass('disabled');
	} else {
		$('.settlementMethod li').removeClass('disabled');
	}
	
	gNo = [];
	hangOrderDtata = null;
	keyId = '';
	if (sessionStorage.getItem("hangIntegralOrderData") != null) {
		hangOrderData = JSON.parse(sessionStorage.getItem("hangIntegralOrderData"));
		keyId = sessionStorage.getItem("clearingId");
	}
	;
	
	//console.log(hangOrderData)
	if (hangOrderData != null) {
		isMemberVal = true;
		$("#memberInfo").show();
		getMemberInfo(hangOrderData[keyId].token);
		
		//console.log(hangOrderDtata[0].goodsList);
		$.each(hangOrderData[keyId].integralBillOptions, function (index, val) {
			//console.log(val.num);
			getGoodsList(val.goodsNo, curk, val.sellType);
			hangOrderNum.push(val.num);
			curk++;
			
		});
		
	}
	
	
	$('#ScanCodeMember').bind('keypress', function (event) {
		var inputkey = $('#ScanCodeMember').val();
		userName = $('#ScanCodeMember').val();
		if (inputkey != "") {
			isMemberVal = true;
		}
		if (event.keyCode == "13") {
			
			getMemberInfo(inputkey);
		}
	});
	
	$('#ScanCodeinput').bind('keypress', function (event) {
		
		var inputkey = $('#ScanCodeinput').val();
		
		
		if (!isMemberVal) {
			layer.msg('请先添加会员信息');
			return false;
		}
		
		if (event.keyCode == "13") {
			if (inputkey == "") {
				layer.msg('商品编码不能为空');
				return false;
			}
			//console.log(curk)
			$.each($("input[type=radio]"), function () {
				$(this).attr({"disabled": "disabled"});
			})
			getGoodsList(inputkey, curk);
			curk++;
			//alert('你输入的内容为：' + $('#ScanCodeinput').val());
		}
	});
	
	
	$('body').on('click', '.add', function (e) {
		e.preventDefault();
		var _slef = $(this);
		
		num = $(this).siblings('.number').text();
		if (num == 0) {
			unitPrice = $(this).parent().siblings().find('.price').text();
			unitIntegral = $(this).parent().siblings().find('.integral').text();
			unitFubi = $(this).parent().siblings().find('.coupon').text();
		} else {
			unitPrice = $(this).parent().siblings().find('.price').text() / num;
			unitIntegral = $(this).parent().siblings().find('.integral').text() / num;
			unitFubi = $(this).parent().siblings().find('.coupon').text() / num;
			
		}
		$(this).siblings(".number").text(addCount(_slef, num));
		$(this).parent().siblings().find('.price').text(priceCount(unitPrice, _curnum, _slef, 1));
		$(this).parent().siblings().find('.integral').text(priceCount(unitIntegral, _curnum, _slef, 2));
		$(this).parent().siblings().find('.coupon').text(priceCount(unitFubi, _curnum, _slef, 3));
		
		realPriceCount('add', unitPrice, unitIntegral, unitFubi);
	})
	
	$('body').on('click', '.minus', function (e) {
		e.preventDefault();
		var _slef = $(this);
		num = $(this).siblings('.number').text();
		if (num == 0) {
			unitPrice = $(this).parent().siblings().find('.price').text();
			unitIntegral = $(this).parent().siblings().find('.integral').text();
			unitFubi = $(this).parent().siblings().find('.coupon').text();
		} else {
			unitPrice = $(this).parent().siblings().find('.price').text() / num;
			unitIntegral = $(this).parent().siblings().find('.integral').text() / num;
			unitFubi = $(this).parent().siblings().find('.coupon').text() / num;
		}
		$(this).siblings(".number").text(minusCount(_slef, num));
		$(this).parent().siblings().find('.price').text(priceCount(unitPrice, _curnum, _slef, 1));
		$(this).parent().siblings().find('.integral').text(priceCount(unitIntegral, _curnum, _slef, 2));
		$(this).parent().siblings().find('.coupon').text(priceCount(unitFubi, _curnum, _slef, 3));
		
		realPriceCount('minus', unitPrice, unitIntegral, unitFubi);
	})
}


/**
 *  渲染数据列表
 * @param inputkey
 */



function getMemberInfo(inputkey) {
	
	var phone = inputkey;
	$.ajax({
		type: "get",
		url: getUser,
		data: {
			phone: phone
		},
		xhrFields: {
			withCredentials: true
		},
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
			}
			else {
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


function getGoodsList(key, status, _sellType) {
	console.log(ListData)
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
	console.log(gNo,status);
	
	$.ajax({
		type: "get",
		url: getIntegralGoods,
		data: {
			goodsNo: key
		},
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (rs) {
			
			if (rs.status == 200) {
				$("#ScanCodeinput").focus();
				$('#ScanCodeinput').val('');
				
				var paymentList = template('paymentList', {
					list: rs.data
				});
				$("#infor_con_item_select").html(paymentList);
				var html = $('#infor_con_item_select');
				if (isgNo) {
					var index = returnIndexof(ListData.goodsListData, rs.data.goodsId);
					var integralIndex = returnIntegralIndex(rs.data.integralSellTypeList, PaymentKey);
					rs.data.num = ListData.goodsListData[index].num + 1;
					rs.data.price = priceCount(rs.data.integralSellTypeList[integralIndex].cash, rs.data.num);
					unitPrice = priceCount(rs.data.integralSellTypeList[integralIndex].cash, rs.data.num);
					rs.data.integral = priceCount(rs.data.integralSellTypeList[integralIndex].integral, rs.data.num);
					unitIntegral = priceCount(rs.data.integralSellTypeList[integralIndex].integral, rs.data.num);
					rs.data.fubi = priceCount(rs.data.integralSellTypeList[integralIndex].fubi, rs.data.num);
					unitFubi = priceCount(rs.data.integralSellTypeList[integralIndex].integral, rs.data.num);
					ListData.goodsListData[index] = rs.data;
					renderGoodsList(ListData, isgNo);
				} else {
					if (_sellType != null) {
						PaymentKey = _sellType
						var integralIndex = returnIntegralIndex(rs.data.integralSellTypeList, PaymentKey);
						rs.data.num = hangOrderNum[returnSAIndexof(gNo, key)];
						rs.data.sellType = rs.data.integralSellTypeList[integralIndex].sellType;
						rs.data.price = priceCount(rs.data.price, rs.data.num);
						rs.data.price = priceCount(rs.data.integralSellTypeList[integralIndex].cash, rs.data.num);
						unitPrice = priceCount(rs.data.integralSellTypeList[integralIndex].cash, rs.data.num);
						rs.data.integral = priceCount(rs.data.integralSellTypeList[integralIndex].integral, rs.data.num);
						unitIntegral = priceCount(rs.data.integralSellTypeList[integralIndex].integral, rs.data.num);
						rs.data.fubi = priceCount(rs.data.integralSellTypeList[integralIndex].fubi, rs.data.num);
						unitFubi = priceCount(rs.data.integralSellTypeList[integralIndex].integral, rs.data.num);
						ListData.goodsListData.push(rs.data);
						renderGoodsList(ListData, isgNo);
					} else {
						layer.open({
							title: '请选择支付方式',
							type: 1,
							closeBtn: 0,
							shadeClose: false, //开启遮罩关闭
							area: ['400px', 'auto'], //宽高
							content: html,
							success: function () {
								
								$("input[type=radio]").click(function () {
									
									PaymentKey = $(this).val();
									var integralIndex = returnIntegralIndex(rs.data.integralSellTypeList, PaymentKey);
									rs.data.num = 1;
									rs.data.sellType = rs.data.integralSellTypeList[integralIndex].sellType;
									rs.data.price = priceCount(rs.data.price, rs.data.num);
									rs.data.price = priceCount(rs.data.integralSellTypeList[integralIndex].cash, rs.data.num);
									unitPrice = priceCount(rs.data.integralSellTypeList[integralIndex].cash, rs.data.num);
									rs.data.integral = priceCount(rs.data.integralSellTypeList[integralIndex].integral, rs.data.num);
									unitIntegral = priceCount(rs.data.integralSellTypeList[integralIndex].integral, rs.data.num);
									rs.data.fubi = priceCount(rs.data.integralSellTypeList[integralIndex].fubi, rs.data.num);
									unitFubi = priceCount(rs.data.integralSellTypeList[integralIndex].integral, rs.data.num);
									ListData.goodsListData.push(rs.data);
									renderGoodsList(ListData, isgNo);
									layer.closeAll();
								})
							}
						});
					}
					
				}
				
				
				
			} else {
				layer.msg(rs.message)
			}
		}
	})
	
}


function renderGoodsList(data,isgNo) {
	//console.log(data);
	if (!isgNos) {
		data.goodsListData.reverse();
	}
	if (!isgNo) {
		data.goodsListData.reverse();
	}
	
	isgNos = true;
	var html = template('GoodsList', {
		list: data
	});
	$("#Goods").html(html);
	getPrice(data.goodsListData);
}

/**
 *  数量计算
 * @param el
 * @param num
 * @returns {number|*}
 */


function addCount(el, num) {
	_curnum = parseInt(num) + 1;
	var id = el.attr('data-goodsId');
	var index = returnIndexof(ListData.goodsListData, id);
	ListData.goodsListData[index].num = _curnum;
	if (_curnum > (ListData.goodsListData[index].stock)) {
		layer.msg('库存不足', {time: '1000'});
		el.addClass('disabled');
		return;
	}
	
	return _curnum;
}

function minusCount(el, _num) {
	_curnum = parseInt(_num) - 1;
	var id = el.attr('data-goodsId');
	var gno = el.attr('data-goodsNo');
	var index = returnIndexof(ListData.goodsListData, id);
	var index2 = returnSAIndexof(gNo, gno);
	//console.log(index2)
	
	
	if (_curnum <= 0) {
		// console.log(el);
		el.addClass('disabled');
		el.parent().parent().parent().remove();
		$('#realPrice').text('0.00');
		$('.payPrice').text('0.00');
		$('#payPrice').text('0.00');
		curk = 0;
		isgNos = true;
		isgNo = false;
		remove(ListData.goodsListData,index);
		remove(gNo,index2);
	} else {
		ListData.goodsListData[index].num = _curnum;
	}
	return _curnum;
}


/**
 * 计算价格
 * @param realPrice
 */



function priceCount(val, _num, el, type) {
	
	_unitPrice = parseFloat(val) * _num;
	
	if (el != undefined) {
		var id = el.attr('data-goodsId');
		var index = returnIndexof(ListData.goodsListData, id);
		//console.log(index);
		
	}
	return _unitPrice.toFixed(2);
}


function realPriceCount(type, unitPrice, uniIntegral, unitFubi) {
	
	var cash, integralPrice, fubi;
	if (type == 'add') {
		cash = parseFloat(unitPrice) + parseFloat($('#payPrice').text());
		integralPrice = parseFloat(uniIntegral) + parseFloat($('#integralPrice').text());
		fubi = parseFloat(unitFubi) + parseFloat($('#couponPrice').text());
	} else {
		cash = parseFloat($('#payPrice').text()) - parseFloat(unitPrice);
		integralPrice = parseFloat($('#integralPrice').text()) - parseFloat(uniIntegral);
		fubi = parseFloat($('#couponPrice').text()) - parseFloat(unitFubi);
	}
	if (cash < 0) {
		cash = 0
	}
	if (integralPrice < 0) {
		integralPrice = 0
	}
	if (fubi < 0) {
		integralPrice = 0
	}
	
	$('#integralPrice').text(integralPrice.toFixed(2));
	$('#payPrice').text(cash.toFixed(2));
	$('.payPrice').text(cash.toFixed(2));
	$('#couponPrice').text(fubi.toFixed(2));
}


function getPrice(realPrice) {
	//console.log(realPrice);
	var payPrice, couponPrice, integralPrice;
	
	var str = '';
	var str2 = '';
	var str3 = '';
	
	for (i in realPrice) {
		str += realPrice[i].price;
		str += '+';
		str2 += realPrice[i].integral;
		str2 += '+';
		str3 += realPrice[i].fubi;
		str3 += '+';
		
	}
	
	str = str.substring(0, str.length - 1);
	str2 = str2.substring(0, str2.length - 1);
	str3 = str3.substring(0, str3.length - 1);
	//console.log(str3);
	payPrice = eval(str).toFixed(2);
	integralPrice = eval(str2).toFixed(2);
	couponPrice = eval(str3).toFixed(2);
	
	
	//$('#couponPrice').text();
	$('#integralPrice').text(integralPrice);
	$('#payPrice').text(payPrice);
	$('.payPrice').text(payPrice);
	$('#couponPrice').text(couponPrice);
}

/**
 *  结账
 */



function checkOut() {
	//console.log(PaymentKey);
	if (ischeckOut) {
		return false;
	}
	
	//console.log(gNo)
	if (gNo.length <= 0) {
		layer.msg('请先添加商品');
		ischeckOut = false;
		return false;
	}
	var _payPrice = $('#payPrice').text();
	var _relTakePrice = $('#relTakePrice').val();
	
	if (_relTakePrice == '' && parseFloat(_payPrice) > 0) {
		layer.msg('实收金额不能为空');
		ischeckOut = false;
		return false;
	} else if (parseFloat(_relTakePrice) < parseFloat(_payPrice)) {
		layer.msg('实收金额不能小于应收金额');
		ischeckOut = false;
		return false;
	}
	
	
	layer.prompt({
		title: '会员密码',
		closeBtn: 2,
		shade: 0,
		formType: 1,
		btn: ['确定']
	}, function (pass, index) {
		getCheckOut(pass)
		//checkPassword
	})
	
	
}


function getCheckOut(pass) {
	var goodsList = [];
	_payPrice = $('#payPrice').text();
	var _integralPrice = $('#integralPrice').text();
	var _fubi = $('#couponPrice').text();
	var index = layer.load(3, {shade: [0.8, '#000'],});
	$('#Goods li').each(function (index, el) {
		var integralBillOptions = {
			"balance": 0,
			"goodsId": 0,
			"goodsNo": 0,
			"integral": 0,
			"fromSkuId": 0,
			"cash": 0,
			"num": 0,
			"fromSkuId": "string",
			"sellType": 0
		};
		integralBillOptions.goodsNo = $(el).attr('data-gNo');
		integralBillOptions.goodsId = $(el).attr('data-goodsId');
		integralBillOptions.fromSkuId = $(el).attr('data-fromSkuId');
		integralBillOptions.num = $(el).find('.number').text();
		integralBillOptions.integral = parseFloat($(el).find('.integral').text() / integralBillOptions.num);
		//integralBillOptions.balance =  parseFloat($(el).find('.price').text() / integralBillOptions.num);
		integralBillOptions.cash = parseFloat($(el).find('.price').text() / integralBillOptions.num);
		integralBillOptions.fubi = parseFloat($(el).find('.coupon').text() / integralBillOptions.num);
		console.log(integralBillOptions.fubi);
		integralBillOptions.sellType = $(el).attr('data-sellType');
		goodsList.push(integralBillOptions);
	})
	//console.log(goodsList)
	
	var data = {
		"integralBillOptions": goodsList,
		"sumCash": _payPrice,
		"sumIntegral": _integralPrice,
		"sumFubi": _fubi,
		"token": token,
		"nick": nick,
	};
	ischeckOut = true;
	$.ajax({
		type: "post",
		url: payIntegralOrder + "?password=" + pass,
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function (rs) {
			if (rs.status == 200) {
				layer.msg('结账成功');
				layer.close(index);
				reset();
			} else {
				ischeckOut = false;
				layer.close(index);
				layer.msg(rs.message)
			}
		}
	});
}

/**
 *  挂单
 */



function uplodOrder() {
	var goodsList = [];
	//console.log(gNo)
	if (gNo.length <= 0) {
		layer.msg('请先添加商品');
		return false;
	}
	_payPrice = $('#payPrice').text();
	var _integralPrice = $('#integralPrice').text();
	var _fubi = $('#couponPrice').text();
	
	$('#Goods li').each(function (index, el) {
		var integralBillOptions = {
			"balance": 0,
			"goodsId": 0,
			"goodsNo": 0,
			"integral": 0,
			"fromSkuId": 0,
			"cash": 0,
			"num": 0,
			"fromSkuId": "string",
			"sellType": 0
		};
		integralBillOptions.goodsNo = $(el).attr('data-gNo');
		integralBillOptions.goodsId = $(el).attr('data-goodsId');
		integralBillOptions.fromSkuId = $(el).attr('data-fromSkuId');
		integralBillOptions.num = $(el).find('.number').text();
		integralBillOptions.integral = parseFloat($(el).find('.integral').text() / integralBillOptions.num);
		//integralBillOptions.balance =  parseFloat($(el).find('.price').text() / integralBillOptions.num);
		integralBillOptions.cash = parseFloat($(el).find('.price').text() / integralBillOptions.num);
		integralBillOptions.fubi = parseFloat($(el).find('.coupon').text() / integralBillOptions.num);
		console.log(integralBillOptions.fubi);
		integralBillOptions.sellType = $(el).attr('data-sellType');
		goodsList.push(integralBillOptions);
	})
	//console.log(goodsList)
	
	var data = {
		"integralBillOptions": goodsList,
		"sumCash": _payPrice,
		"sumIntegral": _integralPrice,
		"sumFubi": _fubi,
		"token": token,
		"nick": nick,
	};
	//console.log(data)
	$.ajax({
		type: "post",
		url: saveHangIntegralOrder,
		data: JSON.stringify(data),
		contentType: "application/json",
		dataType: 'json',
		xhrFields: {
			withCredentials: true
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


/**
 * 清空重置
 */

function reset() {
	$("#Goods").html('');
	$('#integralPrice').text('0.00');
	$('#payPrice').text('0.00');
	$('#couponPrice').text('0.00');
	$('#ScanCodeMemberInput').show();
	$('#ScanCodeMember').val('');
	$('#ScanCodeinput').val('');
	$('#relTakePrice').val('');
	$('#changePrice').val('');
	$('#memberInfo').hide();
	gNo = [];
	curk = 0;
	isgNo = false;
	ischeckOut = false;
	isMemberVal = false;
	num = 0;
	ListData.goodsListData = [];
	sessionStorage.setItem("hangIntegralOrderData", null);
	resetKeyboard()
}


/**
 * 定义获取数组下标
 * @param arr
 * @param value
 * @returns {*}
 */


function returnIntegralIndex(arr, value) {
	var _curIndex;
	var a = arr;
	for (var i = 0; i < a.length; i++) {
		if (a[i].sellType == value) {
			_curIndex = i;
		}
	}
	//console.log(_curIndex);
	return _curIndex;
}

function returnSAIndexof(arr, value) {
	var _curIndex;
	
	var a = arr;
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
	var _curIndex;
	var a = arr;
	for (var i = 0; i < a.length; i++) {
		if (a[i].goodsId == value) {
			_curIndex = i;
		}
	}
	//console.log(_curIndex);
	return _curIndex;
}

	
