$(document).ready(function(){
	$('.scroll-icon').on('click', function(e){
		$('html, body').animate({
	        scrollTop: $(".page-02").offset().top
	    }, 800);
	});

	// $(window).scroll(function(){
	// 	var st = $(this).scrollTop();
	// 	if (st > lastScrollTop){
	// 	   console.log('// downscroll code')
	// 	} else {
	// 	   console.log('// upscroll code')
	// 	}
	// 	lastScrollTop = st;

 //  	});

	// 

	$('.twitter').on('click', function(e){
		share_on_twitter('', 'http://www.mitzo.sg','Mitzo','mitzo');
	});

	function share_on_twitter(caption, share_url, description, hashtag){
		var str = "https://www.twitter.com/intent/tweet?url=" + encodeURIComponent(share_url) + "&text=" + encodeURI(description) + "&hashtags=" + hashtag;
		console.log(str);
		
		var myPopup = window.open(str, 'tw', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=600,height=300,left=286.5,top=118.5');
		if(!myPopup)
		alert("A pop-up window was blocked! Please allow pop-up from browser's setting.");
	}

	// window.fbAsyncInit = function() {
	//     FB.init({
	//       appId      : '822482611149904',
	//       xfbml      : true,
	//       version    : 'v2.2'
	//     });
 //  	};

	//   (function(d, s, id){
	//      var js, fjs = d.getElementsByTagName(s)[0];
	//      if (d.getElementById(id)) {return;}
	//      js = d.createElement(s); js.id = id;
	//      js.src = "//connect.facebook.net/en_US/sdk.js";
	//      fjs.parentNode.insertBefore(js, fjs);
	//    }(document, 'script', 'facebook-jssdk'));

	// $('.facebook').on('click', function(e){
 //        e.preventDefault();
 //        FB.ui(
 //         {
 //            method: 'feed',
 //            name: 'MITZO',
 //            link: 'http://www.mitzo.sg',
 //            picture: 'http://clients.manic.com.sg/mitzo/html2/images/icons/logo_mitzo.png',
 //            caption: 'A BRAND NEW DINING EXPERIENCE.',
 //            description: '',
 //            message: ''
 //        }, function(response){});
 //    });

    $('#date').mask("99 / 99 / 9999",{placeholder:"   "}).val("");

 	$('#date').datepicker({
      	minDate: 0
    });

    var makeRequest = function(Data, URL, Method) {

        var request = $.ajax({
			url: URL,
			type: Method,
			data: Data,
			dataType: "JSON",
			// processData: false,
			success: function(response) {
			  // if success remove current item
			  // console.log(response);
			},
			error: function( error ){
			  // Log any error.
			  console.log( "ERROR:", error );
			}
      });

      return request;
    };

    $('#reservation').validate({
    	onkeyup: false,
		focusInvalid: false,
		rules : {
			first_name : 'required',
			last_name : 'required',
			mobile : 'required',
			email : 'required',
			date : 'required'
		},
		messages : {
			first_name : 'Missing first name',
			last_name : 'Missing last name',
			mobile : 'Missing mobile',
			email : 'Missing email',
			date : 'Missing reservation date',
		},
		showErrors: function(errorMap, errorList) {
			for(var error in errorMap){
				$("#message").html("");
				if(error=="message"){
					$("#message").append(errorMap[error]);
				}else {
					$(':text[name='+error+']').val(errorMap[error]).addClass('error');//append err msg in all text field and hightlight
				}
			}
		}
	});

	$('input,textarea').blur(function(){
		var error_array = [ "Missing first name", "Missing last name", "Missing mobile", "Missing email", "Missing reservation date" ];		
		var input_value = $(this).val();
		if(jQuery.inArray(input_value, error_array)==-1) { //-1 = not found in error array
			$(this).removeClass('error');//when focus out and field is not blank remove err highlight
			
		}
	});
	
	$('input:text,textarea').focus(function(){
		var error_array = [ "Missing first name", "Missing last name", "Missing mobile", "Missing email", "Missing reservation date" ];		
		var input_value = $(this).val();
		if(jQuery.inArray(input_value, error_array)!=-1){ //if there is error in text field remove
			$(this).val("");
			$(this).removeClass('error');
		}
	});

    var request;
    $('#reserve-now').on('click', function(e){
        // $('#reservation').submit();

        if($('#reservation').valid()) {

	        var reserveJSON = {};
		    	reserveJSON.first_name = $('#first_name').val();
		    	reserveJSON.last_name = $('#last_name').val();
		    	reserveJSON.phone = $('#phone').val();
		    	reserveJSON.mobile = $('#mobile').val();
		    	reserveJSON.email = $('#email').val();
		    	reserveJSON.subject = $('#subject').val();
		    	reserveJSON.message = $('#message').val();
		    	reserveJSON.date = $('#date').val();
		    	reserveJSON.time = $('#time').val();
		    	reserveJSON.party_size = $('#party_size').val();
		    	
		    	if($('#newsletter').prop('checked')==true) {
		    		var mailinglistJSON = {};
				    	mailinglistJSON.email = $('#email').val();

				    // console.log(mailinglistJSON); return false;

			    	// abort any pending request
					if (mailrequest) {
					  	mailrequest.abort();
					}

			        mailrequest = makeRequest(mailinglistJSON, "http://clients.manic.com.sg/mitzo/html2/mailinglist.php" , "POST");

					mailrequest.done(function(){
						var result = $.parseJSON(mailrequest.responseText);
						
						if(result) {
							console.log(result);   
						}
					});
		    	}

		    	// console.log(reserveJSON)
		    	// return false;

		    	// abort any pending request
				if (request) {
				  	request.abort();
				}	

		        request = makeRequest(reserveJSON, "http://clients.manic.com.sg/mitzo/html2/reservation.php" , "POST");

				request.done(function(){
					var result = $.parseJSON(request.responseText);
					
					if(result) {
						console.log(result);   
						$('#msg').html('<p style="color:red;">Thanks. Your reservation was successful! We will contact you as soon as possible.</p>');
						//.delay(5000).fadeOut()
						$('#reserve-now').attr("disabled", true);   	
					}else {
						$('#msg').html('<p style="color:red;">something went wrong!</p>').delay(5000).fadeOut();
					}
				});

		}

    });

	$('#footer-mailing-list').validate({
		onkeyup: false,
		focusInvalid: false,
		rules : {
			email : {
				'required' : true,
				'email' : true
			}
		},
		messages : {
			email : 'Missing email'
		},
		showErrors: function(errorMap, errorList) {
			for(var error in errorMap){
				$(':text[name='+error+']').val(errorMap[error]).addClass('error');//append err msg in all text field and hightlight
			}
		}
	});

	var mailrequest;
	$('#mailing-list-email-submit').on('click', function(e){
		e.preventDefault();
		if($('#footer-mailing-list').valid()) {

	        var mailinglistJSON = {};
		    	mailinglistJSON.email = $('#mailing-list-email-txt').val();
		    	console.log(mailinglistJSON)

		    	// abort any pending request
				if (mailrequest) {
				  	mailrequest.abort();
				}

	        mailrequest = makeRequest(mailinglistJSON, "http://clients.manic.com.sg/mitzo/html2/mailinglist.php" , "POST");

			mailrequest.done(function(){
				var result = $.parseJSON(mailrequest.responseText);
				
				if(result) {
					console.log(result);   
					$('#footer-msg').html('<p style="color:white;width:300px;">Thanks. Your email is added to our mailing list.</p>');
					$('#mailing-list-email-submit').attr("disabled", true);   	
				}else {
					$('#footer-msg').html('<p style="color:red;width:300px;">something went wrong!</p>').delay(5000).fadeOut();
				}
			});

		}
	});
});