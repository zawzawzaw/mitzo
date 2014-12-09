/**
 * Fullscreen Image
 * 
 * I dunno how un-efficient this code will be, but i need it.
 * 
 * requires:
 *   TweenMax (lazy)
 * 
 * @author Jairus
 */

Manic.FullscreenImage = Class.extend({
  
  options: {
    resize: "fullscreen"            // bestfit,fullscreen
  },
  
  init: function(options, elem) {
    this.options = $.extend({},this.options,options);
    this.element = $(elem);
    
    this.is_image_loaded = false;
    this.image = this.element.find("img");

    this.window = $(window);

    // VARIABLES
    this.window_width = 100;
    this.window_height = 100;

    this.original_width = 100;
    this.original_height = 100;

    this.target_scale = 1;

    this.has_plus200 = this.element.hasClass('plus200');
    this.has_plus400 = this.element.hasClass('plus400');



    this.window.resize(this.on_window_resize.bind(this));
    this.on_window_resize();

    // http://stackoverflow.com/questions/3877027/jquery-callback-on-image-load-even-when-the-image-is-cached
    this.image
      .one("load", this.on_image_load.bind(this))
      .each(function() {
        if(this.complete) $(this).load();
      }
    );


    //    ___ _   _ ___ _____ 
    //   |_ _| \ | |_ _|_   _|
    //    | ||  \| || |  | |  
    //    | || |\  || |  | |  
    //   |___|_| \_|___| |_|  
    //                        

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

  resize_fullscreen: function(){
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

  },
  resize_best_fit: function(){
    var temp_height = 0,
        temp_width = 0;

    this.target_x = 0;
    this.target_y = 0;

    if(this.window_width/this.window_height > this.original_width/this.original_height){

      this.target_scale = this.window_height / this.original_height;
      temp_width = this.original_width * this.target_scale;
      this.target_x = (this.window_width - temp_width) / 2;

    } else {

      this.target_scale = this.window_width / this.original_width;
      temp_height = this.original_height * this.target_scale;
      this.target_y = (this.window_height - temp_height) / 2;

    }
  },

  //   ____  _   _ ____  _     ___ ____ 
  //  |  _ \| | | | __ )| |   |_ _/ ___|
  //  | |_) | | | |  _ \| |    | | |    
  //  |  __/| |_| | |_) | |___ | | |___ 
  //  |_|    \___/|____/|_____|___\____|
  //  

  udpate_layout: function(){
    if( this.is_image_loaded == true ){

      switch(this.options["resize"]) {
        case "bestfit":
          this.resize_best_fit();
          break;
        case "fullscreen":
        default:
          this.resize_fullscreen();
          break;
      }

      //TweenMax.killTweensOf(this.image);
      //LOG && console.log(this.target_scale)
      //TweenMax.set(this.image, { scaleX:1, scaleY:1, transformOrigin:"left top", x:0, y:0, z:0.1 });
      TweenMax.set(this.image, { scaleX:this.target_scale, scaleY:this.target_scale, transformOrigin:"left top", x:this.target_x, y:this.target_y, z:-0.1 });

      //TweenMax.set(this.image, { scaleX:this.target_scale, scaleY:this.target_scale, transformOrigin:"left top", marginLeft:this.target_x, marginTop:this.target_y });

    }
  },

  //   _______     _______ _   _ _____ 
  //  | ____\ \   / / ____| \ | |_   _|
  //  |  _|  \ \ / /|  _| |  \| | | |  
  //  | |___  \ V / | |___| |\  | | |  
  //  |_____|  \_/  |_____|_| \_| |_|  
  //  

  on_window_resize: function(event){
    this.window_width = this.window.width();

    if(this.has_plus400 == true){
      this.window_height = this.window.height() + 400;

    } else if (this.has_plus200 == true){
      this.window_height = this.window.height() + 200;

    } else {
      this.window_height = this.window.height();

    }
    
    
    this.udpate_layout();
  },
  on_image_load: function(event){
    this.is_image_loaded = true;

    this.original_width = this.image[0].width;
    this.original_height = this.image[0].height;

    //console.log("this.original_width: " + this.original_width);
    //console.log("this.original_height: " + this.original_height);

    this.udpate_layout();
  }

});

EventDispatcher.prototype.apply( Manic.FullscreenImage.prototype );

(function($){
  // Start a plugin
  $.fn.manic_fullscreen_image = function(options) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        if (!$.data(this, 'manic_fullscreen_image')) {
          $.data(this, 'manic_fullscreen_image', new Manic.FullscreenImage(options, this));
        }
      });
    }
  };
})(jQuery);