/**
 * ...
 * @author Jairus
 * 
 * 
 * 
 */

Mitzo.ReservationPage = Mitzo.RegularPage.extend({

  options: {

  },
  
  init: function(options, elem) {
    
    this._super(options,elem);


    var position = $("#our-food-page-03").position().top;
    position -= this.header_element.outerHeight();
    console.log(position);
    TweenMax.to( this.window,1.5,{ scrollTo:{y:position,autoKill:true},ease:Sine.easeInOut});

    //this.create_map();
    
    // return this so we can chain/use the bridge with less code.
    return this;
  }, 
  

  //   ____  ____  _____     ___  _____ _____ 
  //  |  _ \|  _ \|_ _\ \   / / \|_   _| ____|
  //  | |_) | |_) || | \ \ / / _ \ | | |  _|  
  //  |  __/|  _ < | |  \ V / ___ \| | | |___ 
  //  |_|   |_| \_\___|  \_/_/   \_\_| |_____|
  //  

  create_map: function(){
    
  },

  //   ____  _   _ ____  _     ___ ____ 
  //  |  _ \| | | | __ )| |   |_ _/ ___|
  //  | |_) | | | |  _ \| |    | | |    
  //  |  __/| |_| | |_) | |___ | | |___ 
  //  |_|    \___/|____/|_____|___\____|
  //  

  public_method_01: function(){

  }

  //   _______     _______ _   _ _____ 
  //  | ____\ \   / / ____| \ | |_   _|
  //  |  _|  \ \ / /|  _| |  \| | | |  
  //  | |___  \ V / | |___| |\  | | |  
  //  |_____|  \_/  |_____|_| \_| |_|  
  //  

  

});

EventDispatcher.prototype.apply( Mitzo.ReservationPage.prototype );

(function($){
  // Start a plugin
  $.fn.mitzo_regular_page = function(options) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        if (!$.data(this, 'mitzo_regular_page')) {
          $.data(this, 'mitzo_regular_page', new Mitzo.ReservationPage(options, this));
        }
      });
    }
  };
})(jQuery);