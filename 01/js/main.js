$(document).ready(function(){
	$("#jquery_jplayer_1").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				title: "Mitzo",
				m4v: "http://clients.manic.com.sg/mitzo/html/videos/mitzo.mp4", //http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v
				poster: "images/content/cover-video-img.png"
			});
		},
		swfPath: "jplayer",
		supplied: "webmv, ogv, m4v",
		size: {
			width: "960px",
			height: "540px",
			cssClass: "jp-video-270p"
		},
		useStateClassSkin: true,
		autoBlur: false,
		smoothPlayBar: true,
		keyEnabled: true,
		remainingDuration: true,
		toggleDuration: true
	});

	$('a.watch').fancybox({
        padding: 10,
        autoDimensions: false,
        closeBtn : false,
        scrolling : 'no',
        afterShow: function () {
        	$("#jquery_jplayer_1").jPlayer("stop");
        	$("#jquery_jplayer_1").jPlayer("play");
        }
    });
});