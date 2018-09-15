function back() {
	history.go(-1);
}

// 上班 状态

function getUpdateStatus(stat) {
	sessionStorage.setItem('dutyType',stat);
	if(stat == 0){
		setTimeout(function() {
			window.location.href = "index.html";
		}, 100)
		
	}else{
		getUpdateImprestCash()
	}
	
}

function getUpdateImprestCash() {
	layer.prompt({
		title: '更新备用现金',
        closeBtn:0,
        shade:0,
        formType: 0
	}, function(pass, index) {
		$.ajax({
				type: "post",
				url: updateStatus,
				data: {
					imprestCash: pass
				},
				// xhrFields: {
				// 	withCredentials: true
				// },
				crossDomain: true,
				success: function(rs) {
					if (rs.status == 200 || rs.message == '打印小票异常') {
						layer.msg(rs.message);
						setTimeout(function() {
							window.location.href = "index.html";
						}, 1000)

					} else {
						layer.msg(rs.message);
					}

				}
			})
			//layer.close(index);
	});
}

