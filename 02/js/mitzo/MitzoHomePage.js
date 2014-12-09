/**
 * ...
 * @author Jairus
 * 
 * 
 * 
 */

Mitzo.HomePage = Class.extend({

  options: {

  },
  
  init: function(options, elem) {
    this.options = $.extend({},this.options,options);
    this.element = $(elem);
    console.log("init");

    // VARIABLES

    //this.pin_container = null;
    this.fullscreen_image = null;
    this.home_videojs = null;
    this.home_videojs_play_btn = null;

    this.window = $(window);
    this.window.resize(this.on_window_resize.bind(this));
    this.window.scroll(this.on_window_scroll.bind(this));
    this.on_window_resize();

    this.header_element = $("#mitzo-header");
    this.menu_element = $("#main-menu");

    this.pin_page_01 = null;
    this.pin_page_02 = null;
    this.pin_page_02_timeline = new TimelineMax();

    //this.create_pin_container();
    this.create_fullscreen_image();
    this.create_videojs();



    // return this so we can chain/use the bridge with less code.
    return this;
  }, 
  

  //   ____  ____  _____     ___  _____ _____ 
  //  |  _ \|  _ \|_ _\ \   / / \|_   _| ____|
  //  | |_) | |_) || | \ \ / / _ \ | | |  _|  
  //  |  __/|  _ < | |  \ V / ___ \| | | |___ 
  //  |_|   |_| \_\___|  \_/_/   \_\_| |_____|
  //  

  create_pin_container: function(){

    /*
    this.pin_container = new Manic.PinContainer({
      fake_scrollbar: this.element.find(".fake-scrollbar")
    },this.element.find("#mitzo-pin-container"));

    this.pin_container.addEventListener("on_current_page_update", this.on_page_update.bind(this));

    this.pin_page_01 = this.pin_container.get_page_for_id("home-page-01");
    this.pin_page_02 = this.pin_container.get_page_for_id("home-page-02");
    this.pin_page_02.addEventListener("on_animation_tween_update", this.on_pin_page_02_animation_update.bind(this));


    this.pin_page_02_timeline.add( TweenMax.to( this.element.find("#home-page-01 .home-page-01-text h2"), 0.3, {autoAlpha:0} ), 0 );
    this.pin_page_02_timeline.add( TweenMax.to( this.element.find("#home-page-01 .home-page-01-text hr"), 0.5, {width:0} ), 0 );
    this.pin_page_02_timeline.add( TweenMax.to( this.element.find("#home-page-01 .home-page-01-text"), 0.8, {top:130} ), 0 );
    this.pin_page_02_timeline.pause();
    */
  },
  create_fullscreen_image: function(){
    this.fullscreen_image = new Manic.FullscreenImage({
    },this.element.find(".manic-fullscreen-image"));
    
  },
  create_videojs: function(){
    this.home_videojs = new Manic.VideoJSPlayer({
      width: 960,
      height: 540
    },this.element.find("#home-videojs"));

    this.home_videojs.addEventListener("on_video_play", this.on_video_play.bind(this));
    this.home_videojs.addEventListener("on_video_end", this.on_video_end.bind(this));

    this.home_videojs_play_btn = this.element.find("#home-videojs .play-button")
    this.home_videojs_play_btn.click(this.on_home_video_play_click.bind(this));

    

    
    //this.element.find("#equipment-videojs").manic_videojs_player({width: 1920, height: 1080});
    //this.equipment_video = this.element.find("#equipment-videojs").data("manic_videojs_player");
    //this.equipment_video.addEventListener("on_video_end", this.on_equipment_video_end.bind(this));
  },

  //   ____  _   _ ____  _     ___ ____ 
  //  |  _ \| | | | __ )| |   |_ _/ ___|
  //  | |_) | | | |  _ \| |    | | |    
  //  |  __/| |_| | |_) | |___ | | |___ 
  //  |_|    \___/|____/|_____|___\____|
  //  

  public_method_01: function(){

  },

  //   _______     _______ _   _ _____ 
  //  | ____\ \   / / ____| \ | |_   _|
  //  |  _|  \ \ / /|  _| |  \| | | |  
  //  | |___  \ V / | |___| |\  | | |  
  //  |_____|  \_/  |_____|_| \_| |_|  
  //  

  on_page_update: function(event){
    console.log("event.id: " + event.id);
    switch(event.id) {
      case "home-page-01":
        this.menu_element.removeClass("grey-version");
        this.header_element.removeClass("white-bg-version");
        break;
      case "home-page-02":
        this.menu_element.addClass("grey-version");
        this.header_element.addClass("white-bg-version");
        break;
    }
  },
  on_pin_page_02_animation_update: function(event){
    //var target_y = event.percent * 300;
    var target_y = event.percent * 500;
    this.pin_page_02_timeline.progress(event.percent);
    TweenMax.to(this.fullscreen_image.image, 0, {marginTop: target_y});
    
  },
  on_window_scroll: function(event){
    var p = this.window.scrollTop();

    if(p < 100){
      this.menu_element.removeClass("grey-version");
      this.header_element.removeClass("white-bg-version");
    } else {
      this.menu_element.addClass("grey-version");
      this.header_element.addClass("white-bg-version");
    }
  },
  on_window_resize: function(event){
    var window_height = this.window.height();
    var target_height = window_height - 393;      // trial and error
    console.log("target_height: " + target_height);

    $("#home-videojs").height(target_height);
    console.log("target_height: " + target_height);
    $("#home-video-sidebar").outerHeight(target_height);
    
  },


  //   __     _____ ____  _____ ___    _______     _______ _   _ _____ 
  //   \ \   / /_ _|  _ \| ____/ _ \  | ____\ \   / / ____| \ | |_   _|
  //    \ \ / / | || | | |  _|| | | | |  _|  \ \ / /|  _| |  \| | | |  
  //     \ V /  | || |_| | |__| |_| | | |___  \ V / | |___| |\  | | |  
  //      \_/  |___|____/|_____\___/  |_____|  \_/  |_____|_| \_| |_|  
  //                                                                   

  on_video_play: function(){
    //
  },
  on_video_end: function(){
    TweenMax.to(this.home_videojs_play_btn, 0.4, {autoAlpha:1});
  },

  on_home_video_play_click: function(event){
    event.preventDefault();
    this.home_videojs.player.currentTime( 0 );        // for replay as well.
    this.home_videojs.play_video();
    TweenMax.to(this.home_videojs_play_btn, 0.4, {autoAlpha:0});
  }

});

EventDispatcher.prototype.apply( Mitzo.HomePage.prototype );

(function($){
  // Start a plugin
  $.fn.mitzo_home_page = function(options) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        if (!$.data(this, 'mitzo_home_page')) {
          $.data(this, 'mitzo_home_page', new Mitzo.HomePage(options, this));
        }
      });
    }
  };
})(jQuery);