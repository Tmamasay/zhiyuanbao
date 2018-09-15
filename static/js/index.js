// 左侧导航 栏

var integral = sessionStorage.getItem('integral');
var homeUrl = '';
setInit();
function setInit() {
	var dutyType = sessionStorage.getItem('dutyType');
	var offLine = sessionStorage.getItem('offLine');
	console.log(offLine)
	var letNavhtml = '';
	letNavhtml += '<ul>';
	//console.log(integral);
	if (offLine != "null") {
		if (integral != 0) {
			homeUrl = './supermarket/home/index.html';
			if (dutyType == 1) {
				letNavhtml += '<li  data-url=\'supermarket/cashierSystem/index.html\'>';
				letNavhtml += '<span class="icon01"></span>';
				letNavhtml += '<font class="title">收银</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li  data-url=\'supermarket/tradingRecord/index.html\'>';
				letNavhtml += '<span class="icon02"></span>';
				letNavhtml += '<font class="title">交易记录</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li  data-url=\'supermarket/orderSystem/index.html\'>';
				letNavhtml += '<span class="icon03"></span>';
				letNavhtml += '<font class="title">挂单</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li  data-url=\'supermarket/swopSystem/index.html\'>';
				letNavhtml += '<span class="icon04"></span>';
				letNavhtml += '<font class="title">退换货</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li  data-url=\'supermarket/alterationSystem/index.html\'>';
				letNavhtml += '<span class="icon05"></span>';
				letNavhtml += '<font class="title">交换班</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li   class=""  data-url="" id="changeSystem">';
				letNavhtml += '<span class="icon07"></span>';
				letNavhtml += '<font class="title">切换</font>';
				letNavhtml += '</li>';
			} else {
				letNavhtml += '<li  data-url=\'supermarket/tradingRecord/index.html\'>';
				letNavhtml += '<span class="icon02"></span>';
				letNavhtml += '<font class="title">交易记录</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li  data-url=\'supermarket/alterationSystem/index.html\'>';
				letNavhtml += '<span class="icon05"></span>';
				letNavhtml += '<font class="title">交换班</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li   class=""  data-url="" id="changeSystem">';
				letNavhtml += '<span class="icon07"></span>';
				letNavhtml += '<font class="title">切换</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li style="background: white"></li>';
				letNavhtml += '<li style="background: white"></li>';
				letNavhtml += '<li style="background: white"></li>';
			}

		} else {
			homeUrl = './integral/home/index.html';
			if (dutyType == 1) {
				letNavhtml += '<li class="integral"  data-url=\'integral/cashierSystem/index.html\'>';
				letNavhtml += '<span class="icon01"></span>';
				letNavhtml += '<font class="title">收银</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li class="integral" data-url=\'integral/tradingRecord/index.html\'>';
				letNavhtml += '<span class="icon02"></span>';
				letNavhtml += '<font class="title">交易记录</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li  class="integral" data-url=\'integral/orderSystem/index.html\'>';
				letNavhtml += '<span class="icon03"></span>';
				letNavhtml += '<font class="title">挂单</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li class="integral"  data-url=\'integral/swopSystem/index.html\'>';
				letNavhtml += '<span class="icon04"></span>';
				letNavhtml += '<font class="title">退换货</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li class="integral"  data-url=\'integral/alterationSystem/index.html\'>';
				letNavhtml += '<span class="icon05"></span>';
				letNavhtml += '<font class="title">交换班</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li   class="integral active"  data-url="" id="changeSystem">';
				letNavhtml += '<span class="icon07"></span>';
				letNavhtml += '<font class="title">切换</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li style="background: white"></li>';
			} else {
				letNavhtml += '<li class="integral" data-url=\'integral/tradingRecord/index.html\'>';
				letNavhtml += '<span class="icon02"></span>';
				letNavhtml += '<font class="title">交易记录</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li class="integral"  data-url=\'integral/alterationSystem/index.html\'>';
				letNavhtml += '<span class="icon05"></span>';
				letNavhtml += '<font class="title">交换班</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li   class="integral active"  data-url="" id="changeSystem">';
				letNavhtml += '<span class="icon07"></span>';
				letNavhtml += '<font class="title">切换</font>';
				letNavhtml += '</li>';
				letNavhtml += '<li style="background: white"></li>';
				letNavhtml += '<li style="background: white"></li>';
				letNavhtml += '<li style="background: white"></li>';

			}
		}
	} else {
		homeUrl = 'supermarket/home/index.html';
		if (dutyType == 1) {

			letNavhtml += '<li  data-url=\'supermarket/cashierSystem/index.html\'>';
			letNavhtml += '<span class="icon01"></span>';
			letNavhtml += '<font class="title">收银</font>';
			letNavhtml += '</li>';
			letNavhtml += '<li  data-url=\'supermarket/tradingRecord/index.html\'>';
			letNavhtml += '<span class="icon02"></span>';
			letNavhtml += '<font class="title">交易记录</font>';
			letNavhtml += '</li>';
			letNavhtml += '<li  data-url=\'supermarket/orderSystem/index.html\'>';
			letNavhtml += '<span class="icon03"></span>';
			letNavhtml += '<font class="title">挂单</font>';
			letNavhtml += '</li>';
			letNavhtml += '<li class="integral"  data-url=\'supermarket/swopSystem/index.html\'>';
			letNavhtml += '<span class="icon04"></span>';
			letNavhtml += '<font class="title">退换货</font>';
			letNavhtml += '</li>';
			letNavhtml += '<li  data-url=\'supermarket/alterationSystem/index.html\'>';
			letNavhtml += '<span class="icon05"></span>';
			letNavhtml += '<font class="title">交换班</font>';
			letNavhtml += '</li>';
			letNavhtml += '<li style="background: white"></li>';
			letNavhtml += '<li style="background: white"></li>';
		} else {
			letNavhtml += '<li  data-url=\'supermarket/tradingRecord/index.html\'>';
			letNavhtml += '<span class="icon02"></span>';
			letNavhtml += '<font class="title">交易记录</font>';
			letNavhtml += '</li>';
			letNavhtml += '<li  data-url=\'supermarket/alterationSystem/index.html\'>';
			letNavhtml += '<span class="icon05"></span>';
			letNavhtml += '<font class="title">交换班</font>';
			letNavhtml += '</li>';
			letNavhtml += '<li style="background: white"></li>';
			letNavhtml += '<li style="background: white"></li>';
			letNavhtml += '<li style="background: white"></li>';
			letNavhtml += '<li style="background: white"></li>';
		}
	}

	letNavhtml += '</ul>';
	$('#left-nav').html(letNavhtml);
}


$('.left-nav ul li').on('click', function (e) {
	e.preventDefault();
	$(this).addClass('active');
	$(this).siblings().removeClass('active');
	var _url = $(this).data('url');
	router(_url);
})
$('#changeSystem').on('click', function (e) {
	e.preventDefault();
	var _self = $(this);
	var url;

	if (_self.hasClass("integral")) {
		sessionStorage.setItem('integral', '1');
		url = '../view/index.html';
	} else {
		sessionStorage.setItem('integral', '0');
		url = '../view/integralSystem.html';
	}
	window.location.href = url;
})

$('#mali').load(homeUrl);

function getTouch(Y) {
	console.log(parseInt(Y))
	if (Math.abs(Y) > 240) {
		return false;
	} else {
		$("#left-nav").animate({
			top: Y + "px"
		}, 0)
	}

}




//  自定义 路由

function router(url) {
	if (url) {
		var index = layer.load(3);
		$('.loading').show();
		$.ajaxSetup({
			cache: false //close AJAX cache
		});
		$('#mali').load(url, function (result) {
			setTimeout(function () {
				layer.close(index);
				$('.loading').hide();
			}, 500)
			$result = $(result);
			$result.find("script").appendTo('#mali');
		});
	}
}


function baoremove(dx) { // www.jb51.net
	if (isNaN(dx) || dx > this.length) {
		return false;
	}
	this.splice(dx, 1);
}