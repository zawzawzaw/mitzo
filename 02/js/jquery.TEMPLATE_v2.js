/**
 * ...
 * @author Jairus
 * https://alexsexton.com/blog/2010/02/using-inheritance-patterns-to-organize-large-jquery-applications/
 *
 * possible improvements:
 *   set $.data inside the class so when using the class, the dom still has reference to the class
 *   switch 'options & elem' in init function
 *   init function should be seperate from declaration of variables (currently happening in the same init function, cannot place in prototype since all classes share prototype variables.... )
 *   on_event: function needs 'event' in parameter by default.
 *   
 *
 *
 *   some problems with inheritance/nope T__T ? want to use require.js to solve, but minimizing js would be a bitch.
 *   nope, not inheritance! class requirements
 *
 *
 *
 *   experiment with:
 *   a. //EventDispatcher.prototype.apply( Sga.AboutClientGraph.prototype );    // super class has this ? <-- maybe if 'Class' has this all other 'classes' will be event dispatchers :D

     b. new event handling: (used in pixi.js)
         https://github.com/mrdoob/eventtarget.js/
         * THankS mr DOob!


 * need a place to declare static variables/constants.


 * place default // //LOG && console.log everywhere

 *
 *
 * I want to change this pattern into something more readable:
 * 
 *     $('#sga-mouse-link').sga_mouse_link({});
 *     var mouse_link = $('#sga-mouse-link').data("sga_mouse_link");
 *
 * ------------------
 *
 */

NAMESPACE.NAME_OF_CLASS = Class.extend({

  
  // actually this is problematic, as seen in about_client_graph, 
  // if object is child class of super, do we create our own options or overwrite the parent's options
  options: {

  },
  
  init: function(options, elem) {
    this.options = $.extend({},this.options,options);
    this.element = $(elem);
    //LOG && console.log("init");

    // VARIABLES
    this.variable_01 = null;
    this.variable_02 = null;

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

  on_event: function(){

  }

});

EventDispatcher.prototype.apply( NAMESPACE.NAME_OF_CLASS.prototype );

(function($){
  // Start a plugin
  $.fn.NAME_OF_PLUGIN = function(options) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        if (!$.data(this, 'NAME_OF_PLUGIN')) {
          $.data(this, 'NAME_OF_PLUGIN', new NAMESPACE.NAME_OF_CLASS(options, this));
        }
      });
    }
  };
})(jQuery);