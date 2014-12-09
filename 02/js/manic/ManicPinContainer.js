/**
 * ...
 * @author Jairus
 *
 */

Manic.PinContainer = Class.extend({

  options: {
    page_selector: ".pin-page",
    container_selector: ".pin-container-container",
    fake_scrollbar: null
  },
  
  init: function(options, elem) {
    this.options = $.extend({},this.options,options);
    this.element = $(elem);
    console.log("init");

    // VARIABLES
    this.window = $(window);
    this.document = $(document);
    this.container = this.element.find(this.options["container_selector"]);

    this.window_width = 0;
    this.window_height = 0;

    this.page_array = [];

    this.current_page = null;
    //this.current_page_index = -1;
    this.current_page_index = 0;
    this.current_page_id = "none";

    this.fake_scrollbar = this.options["fake_scrollbar"];

    this.timeline = new TimelineMax();

    this.position = {
      x: 0,
      y: 0
    };

    this.position_tween = new TimelineMax();
    this.position_tween_time = 0;
    this.position_tween_duration = 0;
    this.max_position_y = 0;

    this.scroll_position = 0;
    this.previous_scroll_position = 0;
    this.max_scroll_position = 0;
    this.scroll_percent = 0;

    this.is_animating = false;





    //    ___ _   _ ___ _____ 
    //   |_ _| \ | |_ _|_   _|
    //    | ||  \| || |  | |  
    //    | || |\  || |  | |  
    //   |___|_| \_|___| |_|  
    //                        




    this.create_page_array();
    this.create_position_tween();



    this.window.resize(this.on_window_resize.bind(this));
    this.on_window_resize();

    this.window.scroll(this.on_window_scroll.bind(this))

    // return this so we can chain/use the bridge with less code.
    return this;
  }, 
  

  //   ____  ____  _____     ___  _____ _____ 
  //  |  _ \|  _ \|_ _\ \   / / \|_   _| ____|
  //  | |_) | |_) || | \ \ / / _ \ | | |  _|  
  //  |  __/|  _ < | |  \ V / ___ \| | | |___ 
  //  |_|   |_| \_\___|  \_/_/   \_\_| |_____|
  //  

  create_page_array: function(){
    var arr = this.element.find(this.options["page_selector"]);
    var page_element = null;
    var page = null;

    var ind

    for (var i = 0; i < arr.length; i++) {
      page_element = $(arr[i]);
      page = new Manic.PinPage({
        i: i
      },page_element);

      page.addEventListener("on_animation_tween_stop",this.on_animation_tween_stop.bind(this) );
      //page.addEventListener("on_pause_tween_update",this.on_pause_tween_update.bind(this) );
      
      this.page_array[i] = page;
    }
  },

  create_position_tween: function(){

    var page = null;
    var inc = 1 / (this.page_array.length - 1);

    var animation_tween = null;
    var pause_tween = null;
    var target_y = 0;

    for (var i = 0; i < this.page_array.length ; i++) {

      page = this.page_array[i];
      target_y = i * inc;

      if( i == 0 ){
        page.time = 0;
      } else {
        page.create_tween( this.position, target_y );
        this.position_tween.add( page.animation_tween );
        page.time = this.position_tween.totalDuration();

        if(i != this.page_array.length - 1){
          page.create_pause( this.position, target_y );
          this.position_tween.add( page.pause_tween );
        }
      }
    }
    

    this.position_tween.pause();
    this.position_tween_duration = this.position_tween.totalDuration();

    // set other time variables
    for (var i = 0; i < this.page_array.length; i++) {
      page = this.page_array[i];
      page.time_percent = page.time / this.position_tween_duration;

      if(i == 0){
        page.time_end = 0.1;
      } else {
        if( i != this.page_array.length -1 ){
          page.time_end = page.time + 1.5;            // 1.5 = duration of pause.
        } else {
          page.time_end = this.position_tween_duration + 0.1;     // won't get there... 
        }
      }
      
    }
  },

  //   ____  _   _ ____  _     ___ ____ 
  //  |  _ \| | | | __ )| |   |_ _/ ___|
  //  | |_) | | | |  _ \| |    | | |    
  //  |  __/| |_| | |_) | |___ | | |___ 
  //  |_|    \___/|____/|_____|___\____|
  //  

  update_current_page: function(){
    console.log("update_current_page");
    this.position_tween_time = this.position_tween.time();
    
    var page = null;
    for (var i = 0; i < this.page_array.length; i++) {
      page = this.page_array[i];

      if( this.position_tween_time >= page.time && this.position_tween_time <= page.time_end){
        if(this.current_page_id != page.id){
          console.log('got inside' + page.id);

          // tell current page to leave.
          if( this.current_page != null && this.current_page != undefined ){
            this.current_page.trigger_page_leave();
          }


          this.current_page = page;
          this.current_page_id = page.id;
          this.current_page_index = i;

          this.current_page.trigger_page_enter();
    
          this.dispatchEvent({type:"on_current_page_update",id:this.current_page_id});
          return;
        }
      }
      
    }
  },

  next_page: function(){
    var target_index = this.current_page_index + 1;
    target_index = target_index > this.page_array.length-1 ? this.page_array.length-1 : target_index;
    this.goto_index(target_index);
  },
  prev_page: function(){
    var target_index = this.current_page_index - 1;
    target_index = target_index < 0 ? 0 : target_index;
    this.goto_index(target_index);
  },

  goto_index: function(index_param){
    console.log("goto_index: " + index_param);
    if(index_param >= 0 && index_param <= (this.page_array.length -1) ){
      var page = this.page_array[index_param];
      var scroll_position = page.scroll_position;
      var time = page.time;

      this.is_animating = true;
      this.set_page_animation_true();
      TweenMax.to(this.window,0,{ scrollTo:{x:0,y:scroll_position, autoKill:true } });

      TweenMax.to(this.position_tween, 0.5, { 
        time: time, ease: Sine.easeInOut, 
        onUpdate: this.on_goto_index_update, onUpdateScope: this, 
        onComplete: this.on_goto_index_complete, onCompleteScope: this, onCompleteParams: [scroll_position]
      });

    }
  },
  on_goto_index_update: function(){
    var target_y = -1 * this.position.y * this.max_position_y;
    TweenMax.to(this.container, 0, { y: target_y, z:-0.001 });
    this.update_current_page();
  },
  on_goto_index_complete: function(scroll_position_param){
    //console.log("scroll_position_param: " + scroll_position_param)
    //TweenMax.to(this.window,0,{ scrollTo:{x:0,y:scroll_position_param, autoKill:true } });
    this.is_animating = false;
    this.set_page_animation_false();
  },



  get_page_for_id: function(id_param){
    
    for(var i=0, l=this.page_array.length ; i<l ; i++){
      if(id_param == this.page_array[i].id ){
        return this.page_array[i];
        break;
      }
    }

    return null;
  },

  


  //   _______     _______ _   _ _____ 
  //  | ____\ \   / / ____| \ | |_   _|
  //  |  _|  \ \ / /|  _| |  \| | | |  
  //  | |___  \ V / | |___| |\  | | |  
  //  |_____|  \_/  |_____|_| \_| |_|  
  //  

  on_animation_tween_stop: function(event){
    if(this.is_animating == false){
      var index = event.index;
      var target_index = 0;

      console.log("on_animation_tween_stop");
      console.log(index);
      console.log(event)


      if(this.previous_scroll_position < this.scroll_position){
        target_index = index;
      } else {
        target_index = index - 1;
      }

      target_index = target_index < 0 ? 0 : target_index;
      target_index = target_index >= this.page_array.length - 1 ? this.page_array.length - 1 : target_index;
      this.goto_index(target_index);
    }
  },
  
  on_window_scroll: function(event){

    if(this.is_animating == false){
      
      this.previous_scroll_position = this.scroll_position;
      this.scroll_position = this.window.scrollTop();
      this.scroll_percent = this.scroll_position / this.max_scroll_position;

      var page = null;
      for (var i = 0; i < this.page_array.length ; i++) {
        page = this.page_array[i];
        page.user_is_active();
      }

      this.position_tween.progress(this.scroll_percent);

      var target_y = -1 * this.position.y * this.max_position_y
      TweenMax.to(this.container, 0.0, { y: target_y, z:-0.001 });

      this.update_current_page();

    }

    //this.update_page_array_percent();

      

    //TweenMax.killDelayedCallsTo(this.on_window_scroll_stop);
    //TweenMax.delayedCall(0.5, this.on_window_scroll_stop, [], this);
  },
  /*
  on_window_scroll_stop: function(){
    //TweenMax.

  },
  */
  on_window_resize: function(event){
    this.window_width = this.window.width();
    this.window_height = this.window.height();

    this.max_scroll_position = this.fake_scrollbar.height() - this.window_height;
    this.max_position_y = (this.page_array.length - 1) * this.window_height;
    
    var page = null;
    var target_x = 0;
    var target_y = 0;

    for (var i = 0; i < this.page_array.length; i++) {
      page = this.page_array[i];

      target_x = 0;
      target_y = i * this.window_height;


      page.scroll_position = page.time_percent * this.max_scroll_position;

      console.log("page.scroll_position: " + page.scroll_position);

      page.element.css({
        top: target_y + "px",
        left: target_x + "px",
        width: this.window_width + "px",
        height: this.window_height + "px"
      });

    }
  },

  //    _   _ _____ ___ _     
  //   | | | |_   _|_ _| |    
  //   | | | | | |  | || |    
  //   | |_| | | |  | || |___ 
  //    \___/  |_| |___|_____|
  //                          

  set_page_animation_true: function(){
    var page = null;
    for (var i = 0; i < this.page_array.length; i++) {
      page = this.page_array[i];
      page.is_animating = true;
    }
  },
  set_page_animation_false: function(){
    var page = null;
    for (var i = 0; i < this.page_array.length; i++) {
      page = this.page_array[i];
      page.is_animating = false;
    }
  }


});







////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//    __  __    _    _   _ ___ ____   ____ ___ _   _   ____   _    ____ _____ 
//   |  \/  |  / \  | \ | |_ _/ ___| |  _ \_ _| \ | | |  _ \ / \  / ___| ____|
//   | |\/| | / _ \ |  \| || | |     | |_) | ||  \| | | |_) / _ \| |  _|  _|  
//   | |  | |/ ___ \| |\  || | |___  |  __/| || |\  | |  __/ ___ \ |_| | |___ 
//   |_|  |_/_/   \_\_| \_|___\____| |_|  |___|_| \_| |_| /_/   \_\____|_____|
//                                                                            
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
/*
 *
 * on_animation_tween_update
 * on_animation_tween_stop
 * on_pause_tween_update
 * on_pin_page_enter
 * on_pin_page_leave
 * 
 */




Manic.PinPage = Class.extend({

  options: {
    i: 0
  },
  
  init: function(options, elem) {
    this.options = $.extend({},this.options,options);
    this.element = $(elem);
    //console.log("init");

    this.i = this.options["i"];
    this.id = this.element.attr("id");
    this.time = 0;
    this.time_end = 0;
    this.time_percent = 0;
    this.scroll_position = 0;

    this.animation_tween = null;
    this.pause_tween = null;

    this.animation_percent = 0;
    this.pause_percent = 0;
    
    this.percent_animate_out = 0;
    this.is_animating = false;


    //pin_page.addEventListener("on_animate_update", on_animate_in_update.bind(this));
    //pin_page.addEventListener("on_animate_in_update", on_animate_in_update.bind(this));
    //pin_page.addEventListener("on_animate_out_update", on_animate_in_update.bind(this));

    // return this so we can chain/use the bridge with less code.
    return this;
  }, 
  

  //   ____  ____  _____     ___  _____ _____ 
  //  |  _ \|  _ \|_ _\ \   / / \|_   _| ____|
  //  | |_) | |_) || | \ \ / / _ \ | | |  _|  
  //  |  __/|  _ < | |  \ V / ___ \| | | |___ 
  //  |_|   |_| \_\___|  \_/_/   \_\_| |_____|
  //  

  

  //   ____  _   _ ____  _     ___ ____ 
  //  |  _ \| | | | __ )| |   |_ _/ ___|
  //  | |_) | | | |  _ \| |    | | |    
  //  |  __/| |_| | |_) | |___ | | |___ 
  //  |_|    \___/|____/|_____|___\____|
  //  

  create_pause: function(position_param, y_param){
    this.pause_tween = TweenMax.to( position_param, 1.5, {
      y: y_param, ease: Linear.easeNone,
      onUpdate: this.on_pause_tween_update, onUpdateScope: this
    });
  },
  create_tween: function(position_param, y_param){

    this.animation_tween = TweenMax.to( position_param, 0.5, {
      y: y_param, ease: Linear.easeNone, 
      onUpdate: this.on_animation_tween_update, onUpdateScope: this
    });
    
  },

  user_is_active: function(){
    TweenMax.killDelayedCallsTo(this.delayed_on_animation_tween_update);
  },

  trigger_page_enter: function(){
    this.dispatchEvent({type:"on_pin_page_enter", id: this.id});
  },
  trigger_page_leave: function(){
    this.dispatchEvent({type:"on_pin_page_leave", id: this.id});
  },

  //   _______     _______ _   _ _____ 
  //  | ____\ \   / / ____| \ | |_   _|
  //  |  _|  \ \ / /|  _| |  \| | | |  
  //  | |___  \ V / | |___| |\  | | |  
  //  |_____|  \_/  |_____|_| \_| |_|  
  //  

  on_animation_tween_update: function(){
    this.animation_percent = this.animation_tween.progress();

    if(this.is_animating == false){
      TweenMax.killDelayedCallsTo(this.delayed_on_animation_tween_update);
      TweenMax.delayedCall(0.5, this.delayed_on_animation_tween_update, [], this);
    }

    this.dispatchEvent({type:"on_animation_tween_update", percent: this.animation_percent});
    
  },
  delayed_on_animation_tween_update: function(){
    this.dispatchEvent({type:"on_animation_tween_stop", index: this.i});
  },

  on_pause_tween_update: function(){
    this.pause_percent = this.pause_tween.progress();
    this.dispatchEvent({type:"on_pause_tween_update", percent: this.pause_percent});
  },


  on_position_pause_tween_update: function(){

  },
  on_position_tween_update: function(index){
    if(this.is_animating == false){
      console.log("on_position_tween_update: " + index);
      TweenMax.killDelayedCallsTo(this.delayed_on_position_tween_update);
      TweenMax.delayedCall(0.5, this.delayed_on_position_tween_update, [index], this);

      //this.page_array[index].
    }
  },



});





EventDispatcher.prototype.apply( Manic.PinPage.prototype );
EventDispatcher.prototype.apply( Manic.PinContainer.prototype );

(function($){
  // Start a plugin
  $.fn.manic_pin_container = function(options) {
    // Don't act on absent elements -via Paul Irish's advice
    if ( this.length ) {
      return this.each(function(){
        if (!$.data(this, 'manic_pin_container')) {
          $.data(this, 'manic_pin_container', new Manic.PinContainer(options, this));
        }
      });
    }
  };
})(jQuery);