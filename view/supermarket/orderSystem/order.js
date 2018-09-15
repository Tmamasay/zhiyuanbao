//  初始化
var hangOrderData;
init();

function init() {
	laydate.render({
		elem: '#startDate',
		theme: 'molv'
	});
	laydate.render({
		elem: '#endDate',
		theme: 'molv'
	});
	getOrderList();
}
//  获取 所有订单数据

function getOrderList() {
	//layer.load(2);
	$.ajax({
		type: "POST",
		url: getHangOrderList,
		xhrFields: {
			withCredentials: false
		},
		crossDomain: true,
		success: function(rs) {
			//console.log(rs.data);
			var html = '';
			if(rs.status == 200) {

				if(rs.data == null) {
					html = ''
					$("#noeList").show();
					//layer.closeAll();
				} else {
					$("#noeList").hide()
					html = template('HangOrderList', {
						list: rs.data
					});
				}
				setTimeout(function() {
					//layer.closeAll();
					$("#HangOrderListDemo").html(html);
					$('#cashierName').text(sessionStorage.getItem("name"));
					hangOrderData = rs.data;

				}, 500)
			}else {
				setTimeout(function(){
					$("#HangOrderListDemo").html('');
					$("#noeList").show();
				},500)
				
			}

		}
	})
}

// 结账

$('body').off('click').on('click', '.clear_btn', function(e) {
	e.preventDefault();
	var _self = $(this);
    console.log(11)
	var clearingId = $(this).attr('data-id');
    var hangOrderId = $(this).attr('data-hangOrderId');

	$.ajax({
		type: "get",
		url: removeHangOrder,
		data: {
			hangOrderId: hangOrderId
		},
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
		success: function(rs) {
			if(rs.status == 200) {
                sessionStorage.setItem("hangOrderData",JSON.stringify(hangOrderData));
                sessionStorage.setItem("clearingId",clearingId);
                router('./supermarket/cashierSystem/index.html')
                $('.left-nav ul li:eq(0)').addClass('active');
                $('.left-nav ul li:eq(2)').removeClass('active');

			}
		}
	})
})

// 删除挂单

$('body').on('click', '.del_btn', function(e) {
	e.preventDefault();
	var hangOrderId = $(this).attr('data-id');
    layer.confirm('是否删除挂单？', {
        btn: ['确定','取消'] //按钮
    }, function(){
        $.ajax({
            type: "get",
            url: removeHangOrder,
            data: {
                hangOrderId: hangOrderId
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function(rs) {
                if(rs.status == 200) {
                    layer.msg(rs.message, {
                        time: 1000
                    }, function() {
                        init();
                    });

                }
            }
        })
    });

})