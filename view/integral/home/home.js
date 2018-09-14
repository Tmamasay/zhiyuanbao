getDate();
function getDate() {
	var time = new Date();
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	$('.h-mm-s').text(add0(h) + ':' + add0(mm) +':' + add0(s));
	$('.y-m').text(add0(y) + '年' + add0(m ) + '月');
	$('.day').text(add0(d));
	//return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) +':' + add0(s);
	setTimeout(function(){
		getDate()
	},1000)
}