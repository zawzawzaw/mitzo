/**
 * ...
 * @author Jairus
 * 
 * 
 * 
 */

Mitzo.RegularPage = Class.extend({

  options: {

  },
  
  init: function(options, elem) {
    this.options = $.extend({},this.options,options);
    this.element = $(elem);
    console.log("init");

    // VARIABLES

    //this.pin_container = null;
    this.fullscreen_image = null;
    
    this.window = $(window);
    this.window.resize(this.on_window_resize.bind(this));
    this.window.scroll(this.on_window_scroll.bind(this));
    this.on_window_resize();

    this.header_element = $("#mitzo-header");
    this.menu_element = $("#main-menu");

    this.create_fullscreen_image();
    
    // return this so we can chain/use the bridge with less code.
    return this;
  }, 
  

  //   ____  ____  _____     ___  _____ _____ 
  //  |  _ \|  _ \|_ _\ \   / / \|_   _| ____|
  //  | |_) | |_) || | \ \ / / _ \ | | |  _|  
  //  |  __/|  _ < | |  \ V / ___ \| | | |___ 
  //  |_|   |_| \_\___|  \_/_/   \_\_| |_____|
  //  

  create_fullscreen_image: function(){
    this.fullscreen_image = new Manic.FullscreenImage({
    },this.element.find(".manic-fullscreen-image"));
    
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
    // var window_height = this.window.height();
  }

});

EventDispatcher.prototype.apply( Mitzo.RegularPage.prototype );

(function($){
  // Start a plugin
  $.fn.mitzo_regular_page = function(options) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        if (!$.data(this, 'mitzo_regular_page')) {
          $.data(this, 'mitzo_regular_page', new Mitzo.RegularPage(options, this));
        }
      });
    }
  };
})(jQuery);