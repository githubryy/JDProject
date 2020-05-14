var Login = function () {

	return {
		//main function to initiate the module
		init: function () {
			// 发送 post 请求
			function post(url, data = {}) {
				return $.ajax({
					type: 'post',
					url,
					data: JSON.stringify(data),
					contentType: "application/json",
				})
			}
			$('.login-form').validate({
				errorElement: 'label', //default input error message container
				errorClass: 'help-inline', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				rules: {
					username: {
						minlength: 4,
						maxlength: 12,
						required: true
					},
					password: {
						minlength: 6,
						maxlength: 20,
						required: true
					},
					remember: {
						required: false
					}
				},
				messages: {
					username: {
						required: "用户名为空."
					},
					password: {
						required: "密码为空."
					}
				},

				invalidHandler: function (event, validator) { //display error alert on form submit   
					$('.alert-error', $('.login-form')).show();
				},

				highlight: function (element) { // hightlight error inputs
					$(element)
						.closest('.control-group').addClass('error'); // set error class to the control group
				},

				success: function (label) {
					label.closest('.control-group').removeClass('error');
					label.remove();
				},

				errorPlacement: function (error, element) {
					error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
				},

				submitHandler: function (form) {
					console.log('login',11111111);
					
					const username = $('#textUsername').val()
						const password = $('#textPassword').val()
						const url = '/api/user/login'
						const data = {
							username,
							password
						}
						post(url, data).then(res => {
							if (res.errno === 0) {
								// 登录成功
								location.href = './index.html'
							} else {
								// 登录失败
								alert(res.message)
							}
						})
					// window.location.href = "index.html";
				}
			});

			$('.login-form input').keypress(function (e) {
				if (e.which == 13) {
					if ($('.login-form').validate().form()) {
						const username = $('#textUsername').val()
						const password = $('#textPassword').val()
						const url = '/api/user/login'
						const data = {
							username,
							password
						}
						post(url, data).then(res => {
							if (res.errno === 0) {
								// 登录成功
								location.href = './index.html'
							} else {
								// 登录失败
								alert(res.message)
							}
						})
					}
					return false;
				}
			});

			$('.forget-form').validate({
				errorElement: 'label', //default input error message container
				errorClass: 'help-inline', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				ignore: "",
				rules: {
					email: {
						required: true,
						email: true
					}
				},

				messages: {

					email: {
						required: "邮箱为空."
					}
				},

				invalidHandler: function (event, validator) { //display error alert on form submit   

				},

				highlight: function (element) { // hightlight error inputs
					$(element)
						.closest('.control-group').addClass('error'); // set error class to the control group
				},

				success: function (label) {
					label.closest('.control-group').removeClass('error');
					label.remove();
				},

				errorPlacement: function (error, element) {
					error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
				},

				submitHandler: function (form) {
					window.location.href = "index.html";
				}
			});

			$('.forget-form input').keypress(function (e) {
				if (e.which == 13) {
					if ($('.forget-form').validate().form()) {
						window.location.href = "index.html";
					}
					return false;
				}
			});

			jQuery('#forget-password').click(function () {
				jQuery('.login-form').hide();
				jQuery('.forget-form').show();
			});

			jQuery('#back-btn').click(function () {
				jQuery('.login-form').show();
				jQuery('.forget-form').hide();
			});

			$('.register-form').validate({
				errorElement: 'label', //default input error message container
				errorClass: 'help-inline', // default input error message class
				focusInvalid: false, // do not focus the last invalid input
				ignore: "",
				rules: {
					username: {
						minlength: 4,
						maxlength: 12,
						required: true
					},
					password: {
						minlength: 6,
						maxlength: 20,
						required: true
					},
					rpassword: {
						equalTo: "#register_password"
					},
					email: {
						required: true,
						email: true
					},
					tnc: {
						required: true
					}
				},

				messages: { // custom messages for radio buttons and checkboxes
					username: {
						required: "用户名为空."
					},
					password: {
						required: "密码为空."
					},
					email: {
						required: "邮箱为空"
					},
					tnc: {
						required: "请先接受协议."
					}
				},

				invalidHandler: function (event, validator) { //display error alert on form submit   

				},

				highlight: function (element) { // hightlight error inputs
					$(element)
						.closest('.control-group').addClass('error'); // set error class to the control group
				},

				success: function (label) {
					label.closest('.control-group').removeClass('error');
					label.remove();
				},

				errorPlacement: function (error, element) {
					if (element.attr("name") == "tnc") { // insert checkbox errors after the container                  
						error.addClass('help-small no-left-padding').insertAfter($('#register_tnc_error'));
					} else {
						error.addClass('help-small no-left-padding').insertAfter(element.closest('.input-icon'));
					}
				},

				submitHandler: function (form) {
					const username = $('#textUsernameR').val()
					const password = $('#textPasswordR').val()
					const email = $('#textEmailR').val()
					const url = '/api/user/register'
					const data = {
						username,
						email,
						password
					}
					post(url, data).then(res => {
						if (res.errno === 0) {
							// 注册成功
							alert(res.message)
							location.href = './login.html'
						} else {
							// 注册失败
							alert(res.message)
						}
					})
					// window.location.href = "index.html";

				}
			});

			jQuery('#register-btn').click(function () {
				jQuery('.login-form').hide();
				jQuery('.register-form').show();
			});

			jQuery('#register-back-btn').click(function () {
				jQuery('.login-form').show();
				jQuery('.register-form').hide();
			});

		}

	};

}();