// Avoid `console` errors in browsers that lack a console.
if (!(window.console && console.log)) {
    (function() {
        var noop = function() {};
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = window.console = {};
        while (length--) {
            console[methods[length]] = noop;
        }
    }());
}


//http://www.smashingmagazine.com/2011/10/11/essential-jquery-plugin-patterns/
// Object.create support test, and fallback for browsers without it
if ( typeof Object.create !== 'function' ) {
  Object.create = function (o) {
    function F() {}
    F.prototype = o;
    return new F();
  };
}


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();


//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

//https://github.com/mrdoob/eventdispatcher.js
/**
 * @author mrdoob / http://mrdoob.com/
 */

var EventDispatcher = function () {}

EventDispatcher.prototype = {

  constructor: EventDispatcher,

  apply: function ( object ) {
    object.addEventListener = EventDispatcher.prototype.addEventListener;
    object.hasEventListener = EventDispatcher.prototype.hasEventListener;
    object.removeEventListener = EventDispatcher.prototype.removeEventListener;
    object.dispatchEvent = EventDispatcher.prototype.dispatchEvent;
  },

  addEventListener: function ( type, listener ) {
    if ( this._listeners === undefined ) this._listeners = {};
    var listeners = this._listeners;
    if ( listeners[ type ] === undefined ) {
      listeners[ type ] = [];
    }
    if ( listeners[ type ].indexOf( listener ) === - 1 ) {
      listeners[ type ].push( listener );
    }
  },

  hasEventListener: function ( type, listener ) {
    if ( this._listeners === undefined ) return false;
    var listeners = this._listeners;
    if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {
      return true;
    }
    return false;
  },

  removeEventListener: function ( type, listener ) {

    if ( this._listeners === undefined ) return;
    var listeners = this._listeners;
    var listenerArray = listeners[ type ];
    if ( listenerArray !== undefined ) {
      var index = listenerArray.indexOf( listener );
      if ( index !== - 1 ) {
        listenerArray.splice( index, 1 );
      }
    }
  },

  dispatchEvent: function ( event ) {
    if ( this._listeners === undefined ) return;
    var listeners = this._listeners;
    var listenerArray = listeners[ event.type ];
    if ( listenerArray !== undefined ) {
      event.target = this;
      var array = [];
      var length = listenerArray.length;
      for ( var i = 0; i < length; i ++ ) {
        array[ i ] = listenerArray[ i ];
      }
      for ( var i = 0; i < length; i ++ ) {
        array[ i ].call( this, event );
      }
    }
  }
};


/*
how to use:
this.dispatchEvent( { type: 'start', message: 'vroom vroom!' } );
EventDispatcher.prototype.apply( Car.prototype );

car.addEventListener( 'start', function ( event ) {
        alert( event.message );
} );
*/


if ( !String.prototype.contains ) {
    String.prototype.contains = function() {
        return String.prototype.indexOf.apply( this, arguments ) !== -1;
    };
}

///////////////////
//http://stackoverflow.com/questions/476679/preloading-images-with-jquery
// Helper function, used below.
// Usage: ['img1.jpg','img2.jpg'].remove('img1.jpg');
Array.prototype.remove = function(element) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == element) { this.splice(i,1); }
  }
};
$.fn.preloadImages = function(callback) {
  checklist = this.toArray();
  this.each(function() {
    $('<img>').attr({ src: this }).load(function() {
      checklist.remove($(this).attr('src'));
      if (checklist.length == 0) { callback(); }
    });
  });
};
///////////////////

/* Nano Templates (Tomasz Mazur, Jacek Becela) */

function nano(template, data) {
  return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
    var keys = key.split("."), v = data[keys.shift()];
    for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
    return (typeof v !== "undefined" && v !== null) ? v : "";
  });
}
