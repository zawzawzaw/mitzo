/**
 * ...
 * @author Jairus
 *
 *
 * just a simple wrapper for videojs
 *   - also has fullscreen resizing
 *
 * https://github.com/videojs/video.js/blob/stable/docs/guides/options.md
 * https://github.com/videojs/video.js/blob/stable/docs/index.md
 * 
 * https://github.com/videojs/video.js/blob/stable/docs/api/vjs.Player.md#ended-event
 * 
 */

Manic.VideoJSPlayer = Class.extend({

  options: {
    width: 100,
    height: 100
  },
  
  init: function(options, elem) {
    this.options = $.extend({},this.options,options);
    this.element = $(elem);


    this.total_duration = 0;    // defaults to 5
    this.time_object = {
      t:0
    };
    

    // VARIABLES
    this.video_element = this.element.find("video");
    this.video_container = this.element.find(".video-container");
    this.id = this.video_element.attr("id");

    this.window_width = 100;
    this.window_height = 100;
    this.original_width = this.options["width"];
    this.original_height = this.options["height"];

    //LOG && console.log("this.id:" + this.id);

    //    ___ _   _ ___ _____ 
    //   |_ _| \ | |_ _|_   _|
    //    | ||  \| || |  | |  
    //    | || |\  || |  | |  
    //   |___|_| \_|___| |_|  
    //                        

    this.player = videojs(this.id);
    this.player.ready(this.on_video_ready.bind(this));
    this.player.on("ended",this.on_video_end.bind(this));
    this.player.on("play",this.on_video_play.bind(this));
    this.player.ready(this.on_video_player_ready.bind(this));

    
    
    //LOG && console.log(this);
    //LOG && console.log(this.original_width);
    //LOG && console.log(this.original_height);

    this.target_scale = 1;
    this.target_x = 0;
    this.target_y = 0;
    this.is_paused = false;

    this.window = $(window);
    this.window.resize(this.on_window_resize.bind(this));
    this.on_window_resize();


    //LOG && console.log("init");

    // return this so we can chain/use the bridge with less code.
    return this;
  }, 
  

  //   ____  ____  _____     ___  _____ _____ 
  //  |  _ \|  _ \|_ _\ \   / / \|_   _| ____|
  //  | |_) | |_) || | \ \ / / _ \ | | |  _|  
  //  |  __/|  _ < | |  \ V / ___ \| | | |___ 
  //  |_|   |_| \_\___|  \_/_/   \_\_| |_____|
  //  

  private_method_01: function(){

  },

  on_video_player_ready: function(){
    var spinner = this.element.find(".vjs-loading-spinner");

    var preloader_str = [
      '<div class="sga-preloader-container">',
        '<span class="circle circle-01"></span>',
        '<span class="circle circle-02"></span>',
        '<span class="circle circle-03"></span>',
        '<span class="circle circle-04"></span>',
        '<span class="circle circle-05"></span>',
      '</div>'
    ].join("");

    spinner.append($(preloader_str));
    
  },

  //   ____  _   _ ____  _     ___ ____ 
  //  |  _ \| | | | __ )| |   |_ _/ ___|
  //  | |_) | | | |  _ \| |    | | |    
  //  |  __/| |_| | |_) | |___ | | |___ 
  //  |_|    \___/|____/|_____|___\____|
  //  

  pause_at_first_frame: function(){
    // todo.   (not needed yet.)
  }, 



  play_video: function(){
    this.player.play();
    this.is_paused = false;
  },
  pause_video: function(){
    this.player.pause();
    this.is_paused = true;
  }, 
  seek: function(percent_param){
    if(this.total_duration == 0){
      this.total_duration = this.player.duration();
    }
    
    var time = percent_param * this.total_duration;

    //console.log("time:" + time);
    //this.player.currentTime( time );

    TweenMax.to(this.time_object,0.3,{t:time,ease:Linear.easeNone,onUpdate:this.on_seek_update,onUpdateScope:this});


  }, 
  on_seek_update: function(){
    console.log("time:" + this.time_object.t);
    this.player.currentTime( this.time_object.t );
  },

  udpate_layout: function(){
    var temp_height = 0,
        temp_width = 0;

    this.target_x = 0;
    this.target_y = 0;

    if(this.window_width/this.window_height > this.original_width/this.original_height){

      this.target_scale = this.window_width / this.original_width;
      temp_height = this.original_height * this.target_scale;
      this.target_y = (this.window_height - temp_height) / 2;

    } else {

      this.target_scale = this.window_height / this.original_height;
      temp_width = this.original_width * this.target_scale;
      this.target_x = (this.window_width - temp_width) / 2;

    }

    //this.target_scale = Math.ceil(this.target_scale * 100) / 100;
    this.target_scale = Math.ceil(this.target_scale * 100) / 100;     
    this.target_x = Math.floor(this.target_x);
    this.target_y = Math.floor(this.target_y);

    //TweenMax.set(this.video_container, { scaleX:this.target_scale, scaleY:this.target_scale, transformOrigin:"left top", x:this.target_x, y:this.target_y, z:-0.1 });
    TweenMax.set(this.video_container, { scaleX:this.target_scale, scaleY:this.target_scale, transformOrigin:"left top", x:this.target_x, y:this.target_y});
    //TweenMax.set(this.video_container, { transformOrigin:"left top", x:this.target_x, y:this.target_y });

    //this.player.width( this.original_width * this.target_scale);
    //this.player.height( this.original_height * this.target_scale);


  },

  //   _______     _______ _   _ _____ 
  //  | ____\ \   / / ____| \ | |_   _|
  //  |  _|  \ \ / /|  _| |  \| | | |  
  //  | |___  \ V / | |___| |\  | | |  
  //  |_____|  \_/  |_____|_| \_| |_|  
  //  

  on_window_resize: function(event){
    //this.window_width = this.window.width();
    //this.window_height = this.window.height();
    this.window_width = this.element.width();
    this.window_height = this.element.height();
    this.udpate_layout();
  },

  on_video_ready: function(event){
    //LOG && console.log("on_video_ready");
    this.player.play();
    //this.player.currentTime(0);
    this.player.pause();
    //this.player.playbackRate(50);      // not sure here..

    //this.total_duration = this.player.duration();
    //console.log("this.total_duration: " + this.total_duration); 
    this.is_paused = false;
  },
  on_video_end: function(event){

    /*
    //LOG && 
    this.player.currentTime(0);             // this is for auto replay
    //this.player.play();
    */
    console.log("on_video_end");
    if(this.total_duration == 0){
      this.total_duration = this.player.duration();
    }

    console.log(this.total_duration - 0.1)

    this.player.play(); 
    this.player.currentTime(this.total_duration - 0.1); 
    this.player.pause(); 

    this.dispatchEvent({type:"on_video_end"});

    this.is_paused = false;

  },
  on_video_play: function(event){
    //LOG && console.log("on_video_play");

    this.dispatchEvent({type:"on_video_play"});
  }

});

EventDispatcher.prototype.apply( Manic.VideoJSPlayer.prototype );

(function($){
  // Start a plugin
  $.fn.manic_videojs_player = function(options) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        if (!$.data(this, 'manic_videojs_player')) {
          $.data(this, 'manic_videojs_player', new Manic.VideoJSPlayer(options, this));
        }
      });
    }
  };
})(jQuery);