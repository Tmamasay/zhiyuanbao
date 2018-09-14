// 输入键盘 
var _relTakePrice = 0;
var _inputkey = '';
var _specialKey = 0;
var decimal = '';
var isSpecialKey = false;
var isdecimalKey = false;

$('body').on('click', '.input-key', function(e) {

	e.preventDefault();
	if(!isSpecialKey && !isdecimalKey) {
		_relTakePrice = 0;
	}
	var _curval = $(this).text();
	var key;

	_inputkey += _curval;
	_relTakePrice = _relTakePrice + _inputkey;

	if(isdecimalKey) {
		_inputkey = '';

		if(_relTakePrice.split('.')[1].length > 2) {
			layer.msg('小数位数不能超过两位');
			return;
		}
		key = parseFloat(_relTakePrice);
	} else {
		key = parseFloat(_specialKey + _inputkey);
	}

	keyCount(key)
})

$('body').on('click', '.specialKey', function(e) {
	e.preventDefault();
	_inputkey = '';
	var _curval = $(this).text().substring(1);
	_specialKey = parseFloat(_relTakePrice) + parseFloat(_curval)
	//console.log(_specialKey, _relTakePrice, _curval)
	_relTakePrice = _specialKey;
	isSpecialKey = true;

	keyCount(_relTakePrice)
})

$('body').on('click', '.decimal', function() {
	$(this).addClass('disabled');
	if($('#relTakePrice').val() == '') {
		return false;
	}
	decimal = $(this).text();

	var key = parseFloat(_relTakePrice) + decimal;
	_relTakePrice = parseFloat(_relTakePrice) + decimal;
	isdecimalKey = true;

	_inputkey = '';
	keyCount(key);
})

function keyCount(val) {
	var price = _payPrice || $('#payPrice').text();
	console.log(price)
	$('#relTakePrice').val(val);
	if(parseFloat(val) <= parseFloat(price)) {
		//layer.msg('输入的价格不能小于应收金额');
		$('#changePrice').val('0.00');
	}else{
        var changePrice = (parseFloat(val) - parseFloat(price)).toFixed(2);
        $('#changePrice').val(changePrice)
	}
}

// 重置键盘
function resetKeyboard() {
	$('.decimal').removeClass('disabled');
	$('#relTakePrice').val('');
	$('#changePrice').val('')
	_relTakePrice = 0;
	_inputkey = '';
	_specialKey = 0;
	isdecimalKey = false;
	isSpecialKey = false;
}