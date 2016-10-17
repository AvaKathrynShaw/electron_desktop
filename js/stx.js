// -------------------------------------------------------------------------------------------
// Copyright 2012-2015 by ChartIQ LLC
// -------------------------------------------------------------------------------------------
// Be sure your webserver is set to deliver UTF-8 charset
// For apache add "AddDefaultCharset UTF-8" to httpd.conf
// otherwise use \u unicode escapes for non-ascii characters

(function(){

	function _stx_js(_exports, _stxThirdParty) {

		var iScroll=_stxThirdParty.iScroll;
		var iScroll5=_stxThirdParty.IScroll5;
		var timezoneJS=_stxThirdParty.timezoneJS;
		var equationParser=_stxThirdParty.EquationParser;

		var debugDoc=null;

		/**
		 * The following is a list of ADVANCED injectable methods.
		 *
		 * **These methods should not be normally called by your code, but rather injections should be used to modify their behavior within the library Kernel.**
		 *
		 * The "Injection API" provides prepend and append functionality to any built-in method.
		 * Essentially what this means is that a developer can write code that will be run either before (prepend) or after (append) any internal {@link STXChart} function (such as draw() or mouseMove()).
		 * This gives developers the ability to supplement, override or ignore any of the built in functionality.
		 *
		 * Note that you may prepend or append multiple functions. Each injected function is stacked "outward" (daisy-chained) from the core function.
		 *
		 * _prepend >> prepend >> prepend >> function << append << append << append_
		 *
		 * You may prepend/append either to STXChart.prototype or directly to a STXChart instance.
		 *
		 * See the {@tutorial Popular API injections} and [Customization Basics](tutorial-Customization%20Basics.html#injections) tutorials for additional guidance and examples.
		 * @namespace STXChart.AdvancedInjectable
		 * @example
		 * STXChart.prototype.append("method_name_goes_here", function(){
		 * 	// do something here
		 * });
		 * @example
		 * STXChart.prototype.prepend("method_name_goes_here", function(){
		 * 	// do something here
		 * 	// return true; // if you want to exit the method after your injection
		 * 	// return false; // if you want the standard code to follow the prepend
		 * });
		 */


		/**
		 * Base namespace for STX library
		 * @name STX
		 * @namespace
		 */
		function STX(){
		}

		_exports.STX=STX;

		if(!window.console){	// Simple polyfill for IE9 which doesn't support console
			window.console=function(){};
		}

		Date.now = Date.now || function() { return new Date(); }; // polyfill for IE8

		STX.ipad = navigator.userAgent.indexOf("iPad") != -1;
		STX.iphone = navigator.userAgent.indexOf("iPhone") != -1;
		STX.isSurface = navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1;
		STX.touchDevice = typeof(document.ontouchstart)!="undefined" || STX.isSurface;
		STX.is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
		STX.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1;
		STX.isIE = (navigator.userAgent.toLowerCase().indexOf("msie")>-1) || (navigator.userAgent.indexOf("Trident") > -1);
		STX.isIE9 = (navigator.userAgent.indexOf("Trident/5") > -1) || (navigator.userAgent.indexOf("MSIE 9.0")>-1);
		STX.isIE8 = window.isIE8 || (navigator.userAgent.indexOf("MSIE 8.0")>-1);
		STX.isIOS7 = navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i);
		STX.isIOS8 = navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 8_\d/i);
		STX.isIOS9 = navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 9_\d/i);
		STX.isIOS10 = navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 10_\d/i);
		STX.isIOS7or8 = STX.isIOS7 || STX.isIOS8 || STX.isIOS9 || STX.isIOS10;
		STX.isSurfaceApp = window.MSApp;
		STX.noKeyboard = STX.ipad || STX.iphone || STX.isAndroid || STX.isSurfaceApp;

		/**
		 * Use openDebugger when you don't have access to a console window such as on a touch device. This will pop
		 * up a new window for output. @see STX.debug
		 * @memberOf  STX
		 */
		STX.openDebugger=function(){
			var w=window.open("", "Debug", "width=500, height=400, scrollbars=1");
			debugDoc=w.document;
		};

		/**
		 * Sends debug output to debugger window when a console is not available. @see STX.openDebugger
		 * @param  {string} str Data to print to debug window
		 * @memberOf  STX
		 */
		STX.debug=function(str){
			if(!debugDoc){
				return;
			}
			debugDoc.writeln(str);
		};

		/**
		 * Prints all the properties of an object to the debug window. Similar to console.log(obj)
		 * @param  {object} theObject The object to inspect
		 * @memberOf  STX
		 */
		STX.inspectProperties=function(theObject){
		   var theProperties = "";
		   for (var i in theObject){
			if(i!="outerText" && i!="innerText" && i!="outerHTML" && i!="innerHTML"){
				if(typeof(theObject[i])=="function"){
					theProperties +=  i + "" + "()" + "<br>";
					console.log(i+"()");
				}else{
					try{
						console.log(i+"="+theObject[i]);
						theProperties +=  i + " = " + theObject[i] + "<br>";
					}catch(e){
					}
				}
			}
		   }
		   theProperties+="<P>";
		   STX.debug(theProperties);
		};

		/**
		 * Converts an rgb or rgba color to a hex color. It does not handle color names such as 'green'
		 * @param  {string} color The rgb or rgba color, such as in CSS format
		 * @return {string}       The hex color. If "transparent" or no color is sent in, #000000 will be assumed
		 * @example
		 * var hexColor=STX.colorToHex("rgba (255,255,255,0.3)");
		 * @memberOf  STX
		 */
		STX.colorToHex=function(color) {
			if(!color || color=="transparent") color="#000000";
		    if (color.substr(0, 1) === '#') {
		        return color;
		    }
		    var digits = /(.*?)rgb\((\d+), ?(\d+), ?(\d+)\)/.exec(color);
		    if(!digits) digits=/(.*?)rgba\((\d+), ?(\d+), ?(\d+),.*\)/.exec(color);
	    	function toHex(color) {
	    	  var ta=$$("color_converter");
    		  if(!ta){
    		  	ta=document.createElement("textarea");
    		  	ta.id="color_converter";
    		    ta.style.display="none";
    		  	document.body.appendChild(ta);
    		  }
    		  ta.style.color = "#000000";//reset;
    		  ta.style.color = color;
    		  var value;
    		  if(!STX.isIE8){
    		  	value = getComputedStyle(ta).getPropertyValue("color");
    		  	digits = /(.*?)rgb\((\d+), ?(\d+), ?(\d+)\)/.exec(value);
    		  	if(digits) return STX.colorToHex(value);
	    		else if (value.substr(0, 1) === '#') return value;
    		  	else return color;
    		  }
    		  value = ta.createTextRange().queryCommandValue("ForeColor");
    		  value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
    		  value = value.toString(16);
    		  return "#000000".slice(0, 7 - value.length) + value;
    		}
		    if(!digits) return toHex(color);

		    var red = parseFloat(digits[2]);
		    var green = parseFloat(digits[3]);
		    var blue = parseFloat(digits[4]);

		    var rgb = blue | (green << 8) | (red << 16);
		    var hexString = rgb.toString(16);
			// fill with leading 0 if not 6 digits.
			for(var i=hexString.length;i<6;i++){
				hexString="0"+hexString;
			}
		    var s=digits[1] + '#' + hexString;
		    return s.toUpperCase();
		};

		/**
		 * Converts hex to rgba color
		 * @param  {string} color The hex color, such as in CSS format
		 * @return {string}       The rgba color, or null if invalid color. If "transparent" or no color is sent in, rgba(0,0,0,0) will be assumed
		 * @example
		 * @memberOf  STX
		 */
		STX.hexToRgba=function(hex,opacity){
			if(!hex || hex=="transparent") hex="rgba(0,0,0,0)";
		    if (hex.substr(0, 4) === 'rgba') {
				var digits=/(.*?)rgba\((\d+), ?(\d+), ?(\d+), ?(\d*\.?\d*)\)/.exec(hex);
				var a=digits[5];
				if(opacity || opacity===0) a=opacity;
				if(a>1) a=a/100;
				return "rgba(" + digits[2] + "," + digits[3] + "," + digits[4] + "," + a + ")";
		    }
		    else if (hex.substr(0, 3) === 'rgb') {
		    	hex=STX.colorToHex(hex);
		    }
		    if(!opacity && opacity!==0) opacity=100; // default to full opacity
		    if(opacity<=1) opacity=opacity*100; // handle decimal opacity (css style)

		    hex = hex.replace('#','');
		    r = parseInt(hex.substring(0,2), 16);
		    g = parseInt(hex.substring(2,4), 16);
		    b = parseInt(hex.substring(4,6), 16);
		    
		    if ( isNaN(r) || isNaN(g) || isNaN(b)) {
		    	console.log('STX.hexToRgba: invalid hex :',hex);
		    	return null;
		    }

		    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
		    return result;
		};

		/**
		 * Converts a color to the internal format used by the browser. This allows
		 * interchange of hex, rgb, rgba colors
		 * @param  {String} color A CSS color
		 * @return {String}       The native formatted color
		 */
		STX.convertToNativeColor=function(color){
			var a=document.createElement("DIV");
			a.style.color=color;
			a.style.display="none";
			document.body.appendChild(a);
			var c=getComputedStyle(a).color;
			document.body.removeChild(a);
			return c;
		};
		/**
		 * Returns true if the color is transparent. In particular it checks rgba status. Note that the charting engine
		 * often interprets transparent colors to mean that a color should be automatically determined based on the brightness
		 * of the background.
		 * @param  {string}  color The color (from CSS)
		 * @return {Boolean}       True if transparent
		 * @memberOf  STX
		 */
		STX.isTransparent=function(color){
			if(!color) return false;
			if(color=="transparent") return true;
			var digits=/(.*?)rgba\((\d+), ?(\d+), ?(\d+), ?(\d*\.?\d*)\)/.exec(color);
			if(digits===null) return false;
			if(parseFloat(digits[5])===0) return true;
			return false;
		};

		/**
		 * Converts a color from hex or rgb format to Hue, Saturation, Value. This does not accept literal color names such as "black"
		 * @param  {string} color The color (from CSS)
		 * @return {array}       [Hue, Saturation, Value], or null of invalid color.
		 * @memberOf  STX
		 */
		STX.hsv=function(color) {
			var hex=STX.colorToHex(color);
			if(hex.substr(0,1)==="#") hex=hex.slice(1);
			// fill with leading 0 if not 6 digits.
			for(var i=hex.length;i<6;i++){
				hex="0"+hex;
			}
			var r=parseInt(hex.slice(0,2),16);
			var g=parseInt(hex.slice(2,4),16);
			var b=parseInt(hex.slice(4,6),16);
			 var computedH = 0;
			 var computedS = 0;
			 var computedV = 0;

			 //remove spaces from input RGB values, convert to int
			 r = parseInt( (''+r).replace(/\s/g,''),10 );
			 g = parseInt( (''+g).replace(/\s/g,''),10 );
			 b = parseInt( (''+b).replace(/\s/g,''),10 );

			 if ( r===null || g===null || b===null ||
			     isNaN(r) || isNaN(g)|| isNaN(b) ) {
			    console.log('STX.hsv: invalid color :',color);
			    return null;
			 }
			 if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
			   return null;
			 }
			 r=r/255; g=g/255; b=b/255;
			 var minRGB = Math.min(r,Math.min(g,b));
			 var maxRGB = Math.max(r,Math.max(g,b));

			 // Black-gray-white
			 if (minRGB==maxRGB) {
			  computedV = minRGB;
			  return [0,0,computedV];
			 }

			 // Colors other than black-gray-white:
			 var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
			 var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
			 computedH = 60*(h - d/(maxRGB - minRGB));
			 computedS = (maxRGB - minRGB)/maxRGB;
			 computedV = maxRGB;
			 return [computedH,computedS,computedV];
		};

		STX.hsl=function(color){
			var hex=STX.colorToHex(color);
			if(hex.substr(0,1)==="#") hex=hex.slice(1);
			// fill with leading 0 if not 6 digits.
			for(var i=hex.length;i<6;i++){
				hex="0"+hex;
			}
			var r=parseInt(hex.slice(0,2),16);
			var g=parseInt(hex.slice(2,4),16);
			var b=parseInt(hex.slice(4,6),16);

			r /= 255; g /= 255; b /= 255;
			var max = Math.max(r, g, b), min = Math.min(r, g, b);
			var h, s, l = (max + min) / 2;

			if(max == min){
				h = s = 0; // achromatic
			}else{
				var d = max - min;
				s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
				switch(max){
					case r: h = (g - b) / d + (g < b ? 6 : 0); break;
					case g: h = (b - r) / d + 2; break;
					case b: h = (r - g) / d + 4; break;
				}
				h /= 6;
			}

			return [h, s, l];
		};

		STX.dayOfYear= function(dt){
		    var j1=new Date(dt);
		    j1.setMonth(0, 0);
		    return Math.round((dt-j1)/8.64e7);
		};

		/**
		 * Chooses either a white or black foreground color depending on the "value" of the background color. Note that this simply
		 * checks if the value is above .85 which works well but not ideally for red colors which the human eye interprets differently.
		 * More complex algorithms are available but chartists rarely use red as a background color.
		 * @param  {string} backgroundColor The background color (CSS format)
		 * @return {string}                 Either #000000 (black) or #FFFFFF (white) depending on will look best on the given background color
		 * @memberOf  STX
		 */
		STX.chooseForegroundColor=function(backgroundColor){
			var hsv=STX.hsv(backgroundColor);
			var v=hsv[2];
			if(v>0.85) return "#000000";
			else return "#FFFFFF";
		};

		/**
		 * Gets the background color of an element by traversing up the parent stack.
		 * @param  {HTMLElement} el The element to examine
		 * @return {String}    The background color
		 */
		STX.getBackgroundColor=function(el){
			var bgColor=null;
			while(!bgColor || STX.isTransparent(bgColor)){
				var cStyle=getComputedStyle(el);
				if(!cStyle) return;
				bgColor=cStyle.backgroundColor;
				if(STX.isTransparent(bgColor)) bgColor="transparent";
				el=el.parentNode;
				if(!el || !el.tagName) break;
			}
			if(!bgColor || bgColor=="transparent") bgColor="#FFFFFF";
			return bgColor;
		};
		/**
		 * Shorthand for getElementById(). Equivalent to prototype style $() which is faster but less powerful than jquery style $()
		 * @param  {string} id     An ID tag for a valid DOM object
		 * @param  {object} [source] - An optional valid DOM node to search within. If not provided then the entire document will be searched.
		 * @return {object}        The DOM node associated with the id or null if it is not found
		 * @name  $$
		 */
		function $$(id, source){
			if(!source) return document.getElementById(id);
			if(source.id==id) return source;	// Found it!
			if(!source.hasChildNodes) return null;
			for(var i=0;i<source.childNodes.length; i++){
				var element=$$(id, source.childNodes[i]);
				if(element) return element;
			}
			return null;
		}
		_exports.$$=$$;

		/**
		 * Functional equivalent of querySelector(). Functionally equivalent to jquery $().
		 * This uses querySelectorAll in order to maintain compatibility with IE 9.
		 * Note that if multiple objects match the selector then only the first will be returned.
		 * @param  {string} selector - CSS style selector
		 * @param  {object} [source]   Optional node to select within. If not provided then entire document will be searched.
		 * @return {object}          The first object to match the selector
		 * @name  $$$
		 */
		function $$$(selector, source){
			if(!source) source=document;
			return source.querySelectorAll(selector)[0];	// We use querySelectorAll for backward compatibility with IE
		}
		_exports.$$$=$$$;

		/**
		 * Get the source element for a DOM event depending on browser type
		 * @param  {object} [e] Event if available from browser
		 * @return {object}   The DOM node that registered the event
		 * @memberOf  STX
		 */
		STX.getEventDOM=function(e){
			if(!e){
				return window.event.srcElement;
			}else{
				return e.target;
			}
		};

		/**
		 * Returns the host portion of a url
		 * @param  {string} url The url, such as document.location.href
		 * @return {string}     The host portion, including port, if the url is a valid URI
		 * @memberOf  STX
		 */
		STX.getHostName=function(url) {
			try{
				return url.match(/:\/\/(.[^/]+)/)[1];
			}catch(e){
				return "";
			}
		};

		/**
		 * Capitalizes the first letter of a string
		 * @return {string} Capitalized version of the string
		 */
		String.prototype.capitalize = function() {
		    return this.charAt(0).toUpperCase() + this.slice(1);
		};


		/**
		 * Extends an object, similar to jquuery.extend() with a deep copy
		 * @param {Object} target Target object
		 * @param  {Object} source Original object
		 * @param {Boolean} [shallow] If true then extend will not recurse through objects
		 * @return {Object} Target object after extension
		 */
		STX.extend=function(target, source, shallow){
			for(var field in source){
				var datum=source[field];
				if(!datum) target[field]=datum;
				else if(datum.constructor==Object){
					if(!target[field]) target[field]={};
					if(shallow){
						target[field]=source[field];
					}else{
						STX.extend(target[field], source[field]);
					}
				}else if(datum.constructor==Array){
					target[field]=datum.slice();
				}else{
					target[field]=datum;
				}
			}
			return target;
		};

		/**
		 * Deletes the map entries for which the right hand side is the object in question.
		 * @param  {Object} map    JavaScript map object
		 * @param  {Object} object The actual object to be deleted from the map
		 * @return {Boolean}        Returns true if any object actually deleted
		 */
		STX.deleteRHS=function(map, object){
			var deletedOne=false;
			for(var i in map){
				if(map[i]==object){
					delete map[i];
					deletedOne=true;
				}
			}
			return deletedOne;
		};

		/**
		 * This is method changes the target object's contents to match the contents of the source object. This is functionality equivalent
		 * to `target=source` except that it preserves the existence of the target object. This is vitally important if there are data bindings
		 * to the target object otherwise those databindings would remain attached to a phantom object! The logic here is orchestrated so that you
		 * will receive update, add and delete notifications for each field that changes.
		 * @param  {Object} target The target object
		 * @param  {Object} source The source object
		 * @since 2015-11-1
		 */
		STX.dataBindSafeAssignment=function(target, source){
			for(var prop in source) {
				target[prop]=source[prop];
			}
			for(prop in target) {
				if (typeof(source[prop])=="undefined") {
					delete target[prop];
				}
			}
		};

		/**
		 * Clones an object. This function creates a deep (recursive) clone of an object. The object can be a primitive or an object or an array.
		 * Note that cloning objects that reference DOM nodes can result in stack overflows. Use with caution.
		 * @param  {object} from The source object
		 * @param  {object} [to]   Optional existing object of same type. Can improve performance when objects are reusable.
		 * @return {object}      A deep clone of the "from" object
		 * @memberOf  STX
		 */
		STX.clone=function(from, to)
		{
		    if (from === null || typeof from != "object") return from;
		    // if (from.constructor != Object && from.constructor != Array) return from;
		    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
		        from.constructor == String || from.constructor == Number || from.constructor == Boolean)
		        return new from.constructor(from);

		    to = to || new from.constructor();

		    for (var n in from)
		    {
		        to[n] = typeof to[n] == "undefined" ? STX.clone(from[n], null) : to[n];
		    }

		    return to;
		};

		/**
		 * Non recursive clone. This will only clone the top layer and is safe to use when objects contain DOM nodes.
		 * @param  {object} from - Object to be cloned
		 * @return {object}      A shallow clone of the "from" object
		 * @memberOf  STX
		 */
		STX.shallowClone=function(from){
			if(!from) return from;
			var to;
			if(from.constructor==Array){
				to=new Array(from.length);
				for(var i=0;i<from.length;i++){
					to[i]=from[i];
				}
				return to;
			}else{
				to={};
				for(var field in from){
					to[field]=from[field];
				}
				return to;
			}
		};

		/**
		 * Returns a short, pseudo unique ID based on the current time. Radix 36 is used resulting in a compact string consisting only of letters and numerals.
		 * While not guaranteed to be unique, this function has a high probability of uniqueness when it is triggered by human activity even in a large user base.
		 * @return {string} A unique string consisting of letters and numerals
		 * @memberOf  STX
		 */
		STX.uniqueID=function(){
			var epoch=new Date();
			var id=epoch.getTime().toString(36);
			id+=Math.floor(Math.random()*Math.pow(36,2)).toString(36);
			return id.toUpperCase();
		};

		/**
		 * Removes all DOM elements in a given node. This is extremely useful when dynamically generating content.
		 * @param  {object} node - The node to clear
		 * @memberOf  STX
		 */
		STX.clearNode=function(node){
			if ( node.hasChildNodes() ){
				while ( node.childNodes.length >= 1 ){
		    		node.removeChild( node.firstChild );
				}
			}
		};

		STX.monthLetters=["J","F","M","A","M","J","J","A","S","O","N","D"];
		STX.monthAbv=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

		/**
		 * Convenience function for creating a displayable month name using STX.monthLetters and STX.monthAbv.
		 * Please note that those arrays may not be utilized if the library is used in conjuction with Internationalization.
		 * This method is used primarily to create the x-axis of a chart
		 * @param  {number} i              The numerical month (0-11)
		 * @param  {boolean} displayLetters - True if just the first letter should be displayed (such as a tight display)
		 * @param  {object} [stx]            The chart object, only necessary if Internationalization is in use
		 * @return {string}                String representation of the month
		 * @memberOf  STX
		 */
		STX.monthAsDisplay=function(i, displayLetters,stx){
			if(displayLetters){
				if(stx && stx.monthLetters) return stx.monthLetters[i];
				return STX.monthLetters[i];
			}else{
				if(stx && stx.monthAbv) return stx.monthAbv[i];
				return STX.monthAbv[i];
			}
		};

		/**
		 * Displays a time in readable form. If Internationalization is in use then the time will be in 24 hour Intl numeric format
		 * @param  {date} dt  JavaScript Date object
		 * @param  {object} [stx] Optional chart object if Internationalization is in use
		 * @param {number} [precision] Optional precision to use. If `null` then `hh:mm`. `STX.SECOND` then `hh:mm:ss`. If `STX.MILLISECOND` then `hh:mm:ss.mmmmm`
		 * @return {string}     Human friendly time, usually hh:mm
		 * @memberOf  STX
		 */
		STX.timeAsDisplay=function(dt, stx, precision){
			if(stx && stx.internationalizer){
				if(precision==STX.SECOND)
					return stx.internationalizer.hourMinuteSecond.format(dt);
				else if(precision==STX.MILLISECOND)
					return stx.internationalizer.hourMinuteSecond.format(dt) + "." + dt.getMilliseconds();
				else
					return stx.internationalizer.hourMinute.format(dt);
			}else{
				var min=dt.getMinutes();
				if(min<10) min="0" + min;
				var str=dt.getHours() + ":" + min;
				var sec="";
				if(precision<=STX.SECOND){
					sec=dt.getSeconds();
					if(sec<10) sec="0" + sec;
					str+=":" + sec;
				}
				if(precision==STX.MILLISECOND){
					var msec=dt.getMilliseconds();
					if(msec<10) msec="00" + msec;
					else if(msec<100) msec="0" + msec;
					str+="." + msec;
				}
				return str;
			}
		};

		// Extract the name of the month from the locale. We do this by creating a
		// localized date for the first
		// date of each month. Then we extract the alphabetic characters. MonthLetters
		// then becomes the first
		// letter of the month. Note that in the current Intl.js locale, chinese and
		// japanese months are implemented
		// as 1月 through 12月 which causes this algorithm to fail. Hopefully real months
		// will be available when Intl
		// becomes a browser standard, otherwise this method or the locale will need to
		// be modified for those or other special cases
		//
		/**
		 * Extract the name of the month from the locale. We do this by creating a
		 * localized date for the first date of each month. Then we extract the alphabetic characters.
		 * MonthLetters then becomes the first letter of the month. Note that in the current Intl.js locale, chinese and
		 * japanese months are implemented as 1月 through 12月 which causes this algorithm to fail. Hopefully real months
		 * will be available when Intl becomes a browser standard, otherwise this method or the locale will need to
		 * be modified for those or other special cases. The arrays are stored in stx.monthAbv and stx.monthLetters which
		 * will then override the global arrays STX.monthAbv and STX.monthLetters.
		 * @param  {object} stx       Chart object
		 * @param  {object} formatter An Intl compatible date formatter
		 * @param  {string} locale    A valid Intl locale, such as en-IN
		 * @memberOf  STX
		 */
		STX.createMonthArrays=function(stx, formatter, locale){
			stx.monthAbv=[];
			stx.monthLetters=[];
			var dt=new Date();
			var shortenMonth=true;
			if(STX.I18N.longMonths && STX.I18N.longMonths[locale]) shortenMonth=false;
			for(var i=0;i<12;i++){
				dt.setDate(1);
				dt.setMonth(i);
				var str=formatter.format(dt);
				if(shortenMonth){
					var month="";
					for(var j=0;j<str.length;j++){
						var c=str.charAt(j);
						var cc=c.charCodeAt(0);
						if(cc<65) continue;
						month+=c;
					}
					stx.monthAbv[i]=month;
					stx.monthLetters[i]=month[0];
				}else{
					stx.monthAbv[i]=str;
					stx.monthLetters[i]=str;
				}
			}
		};

		/**
		 * Given a numeric price that may be a float with rounding errors, this will trim off the trailing zeroes
		 * @param  {Float} price The price
		 * @return {Float}       The price trimmed of trailing zeroes
		 * @memberOf  STX
		 */
		STX.fixPrice=function(price){
			if(!price && price!==0) return null;
			var p=price.toFixed(10);
			for(var i=p.length-1;i>1;i--){
				if(p.charAt(i)!="0")
					break;
			}
			p=p.substring(0,i+1);
			return parseFloat(p);
		};

		/**
		 * Condenses an integer into abbreviated form by adding "k","m","b" or "t". This method is used in the y-axis for example with volume studies.
		 * @param  {number} txt - A numerical value
		 * @return {string}     Condensed version of the number
		 * @example
		 * // This will return 12m
		 * condentInt(12000000);
		 * @memberOf  STX
		 */
		STX.condenseInt=function(txt){
			if(txt===null || typeof txt=="undefined") return "";
			if(txt===Infinity || txt===-Infinity) return "n/a";
			if(txt>0){
				if(txt>1000000000000) txt=Math.round(txt/100000000000)/10 + "t";
				else if(txt>100000000000) txt=Math.round(txt/1000000000) + "b"; //100b
				else if(txt>10000000000) txt=(Math.round(txt/100000000)/10).toFixed(1) + "b"; //10.1b
				else if(txt>1000000000) txt=(Math.round(txt/10000000)/100).toFixed(2) + "b"; //1.11b

				else if(txt>100000000) txt=Math.round(txt/1000000) + "m"; //100m
				else if(txt>10000000) txt=(Math.round(txt/100000)/10).toFixed(1) + "m"; //10.1m
				else if(txt>1000000) txt=(Math.round(txt/10000)/100).toFixed(2) + "m"; //1.11m

				else if(txt>100000) txt=Math.round(txt/1000) + "k"; //100k
				else if(txt>10000) txt=(Math.round(txt/100)/10).toFixed(1) + "k"; //10.1k
				else if(txt>1000) txt=(Math.round(txt/10)/100).toFixed(2) + "k"; //1.11k
				else txt=txt.toFixed(0);
			}else{
				if(txt<-1000000000000) txt=Math.round(txt/100000000000)/10 + "t";
				else if(txt<-1000000000) txt=Math.round(txt/100000000)/10 + "b";
				else if(txt<-1000000) txt=Math.round(txt/100000)/10 + "m";
				else if(txt<-1000) txt=Math.round(txt/100)/10 + "k";
				else txt=txt.toFixed(0);
			}
			return txt;
		};

		/**
		 * Determines whether a line intersects a box. This is used within the charting engine to determine whether the cursor
		 * has intersected a drawing.
		 * @param  {number} bx1
		 * @param  {number} by1
		 * @param  {number} bx2
		 * @param  {number} by2
		 * @param  {number} x0
		 * @param  {number} y0
		 * @param  {number} x1
		 * @param  {number} y1
		 * @param  {string} vtype - Either "segment", "ray" or "line"
		 * @return {boolean}       Returns true if the line intersects the box
		 * @memberOf  STX
		 */
		STX.boxIntersects=function(bx1, by1, bx2, by2, x0, y0, x1, y1, vtype){
			if     (STX.linesIntersect(bx1, bx2, by1, by1, x0, x1, y0, y1, vtype)) return true;
			else if(STX.linesIntersect(bx1, bx2, by2, by2, x0, x1, y0, y1, vtype)) return true;
			else if(STX.linesIntersect(bx1, bx1, by1, by2, x0, x1, y0, y1, vtype)) return true;
			else if(STX.linesIntersect(bx2, bx2, by1, by2, x0, x1, y0, y1, vtype)) return true;
			return false;
		};

		/**
		 * Determines whether two lines intersect
		 * @param  {number} x1
		 * @param  {number} x2
		 * @param  {number} y1
		 * @param  {number} y2
		 * @param  {number} x3
		 * @param  {number} x4
		 * @param  {number} y3
		 * @param  {number} y4
		 * @param  {string} type - Either "segment", "ray" or "line"
		 * @return {boolean}      Returns true if the two lines intersect
		 * @memberOf  STX
		 */
		STX.linesIntersect=function(x1, x2, y1, y2, x3, x4, y3, y4, type){
			var denom  = (y4-y3) * (x2-x1) - (x4-x3) * (y2-y1);
			var numera = (x4-x3) * (y1-y3) - (y4-y3) * (x1-x3);
			var numerb = (x2-x1) * (y1-y3) - (y2-y1) * (x1-x3);
			//var EPS = .000001;

			if(denom===0){
				if(numera===0 && numerb===0) return true; // coincident
				return false; // parallel
			}

			var mua = numera / denom;
			var mub = numerb / denom;
			if(type=="segment" || type=="zig zag"){
				if (mua>=0 && mua<=1 && mub>=0 && mub<=1) return true;
			}else if(type=="line" || type=="horizontal" || type=="vertical"){
				if (mua>=0 && mua<=1) return true;
			}else if(type=="ray"){
				if (mua>=0 && mua<=1 && mub>=0) return true;
			}
			return false;

		};

		/**
		 * Determines the Y value at which point X intersects a line (vector)
		 * @param  {object} vector - Object of type {x0,x1,y0,y1}
		 * @param  {number} x      - X value
		 * @return {number}        - Y intersection point
		 * @memberOf  STX
		 */
		STX.yIntersection=function(vector, x){
			var x1=vector.x0, x2=vector.x1, x3=x, x4=x;
			var y1=vector.y0, y2=vector.y1, y3=0, y4=10000;
			var denom  = (y4-y3) * (x2-x1) - (x4-x3) * (y2-y1);
			var numera = (x4-x3) * (y1-y3) - (y4-y3) * (x1-x3);
			//var numerb = (x2-x1) * (y1-y3) - (y2-y1) * (x1-x3);
			//var EPS = .000001;

			if(denom===0) return null;

			var mua=numera/denom;
			var y=y1 + (mua * (y2-y1));
			return y;
		};

		/**
		 * Determines the X value at which point Y intersects a line (vector)
		 * @param  {object} vector - Object of type {x0,x1,y0,y1}
		 * @param  {number} y      - Y value
		 * @return {number}        - X intersection point
		 * @memberOf  STX
		 */
		STX.xIntersection=function(vector, y){
			var x1=vector.x0, x2=vector.x1, x3=0, x4=10000;
			var y1=vector.y0, y2=vector.y1, y3=y, y4=y;
			var denom  = (y4-y3) * (x2-x1) - (x4-x3) * (y2-y1);
			var numera = (x4-x3) * (y1-y3) - (y4-y3) * (x1-x3);
			//var numerb = (x2-x1) * (y1-y3) - (y2-y1) * (x1-x3);
			//var EPS = .000001;

			if(denom===0) return null;
			var mua=numera/denom;
			var x=x1 + (mua * (x2-x1));
			return x;
		};

		/**
		 * Strips the letters "px" from a string. This is useful for converting styles into absolutes.
		 * @param  {string} text - String value with "px"
		 * @return {number}      The numeric value
		 * @example
		 * var leftPosition=STX.stripPX(node2.style.left)
		 * @memberOf  STX
		 */
		STX.stripPX=function(text){
			return parseInt(text.substr(0, text.indexOf("p")));
		};

		/**
		 * Returns the height of the page. It is aware of iframes and so will never return a value that is greater
		 * than the value of the parent
		 * @return {number} Height of page in pixels
		 * @memberOf  STX
		 */
		STX.pageHeight=function() {
			var h=window.innerHeight;
			if(top!=self){
				try{
					if(h>parent.innerHeight) h=parent.innerHeight;
				}catch(e){}
			}
			return h;
		};

		/**
		 * Returns the width of the page. It is aware of iframes and so will never return a value that is greater
		 * than the value of the parent
		 * @return {number} Width of page in pixels
		 * @memberOf  STX
		 */
		STX.pageWidth=function() {
			var w=window.innerWidth;
			if(top!=self){
				try{
					if(w>parent.innerWidth) w=parent.innerWidth;
				}catch(e){}
			}
			return w;
		};

		/**
		 * Deletes (removes) nulls or undefined fields (names) from an object. This is useful when marshalling (saving) an object where you don't wish
		 * null or undefined values to show up in the marshalled object (such as when converting to JSON)
		 * @param  {object} obj         The object to scrub
		 * @param  {boolean} [removeNulls] Whether or not to remove null values
		 * @memberOf  STX
		 */
		STX.scrub=function(obj, removeNulls){
			for(var i in obj){
				if(typeof(obj[i])=="undefined")
					delete obj[i];
				if(removeNulls && obj[i]===null)
					delete obj[i];
			}
		};

		STX.yyyymmddhhmmssmmmrx=new RegExp("\\d{17}");

		/**
		 * Converts a string form date into a JavaScript Date object with time. Supports various standard date formats
		 * @param  {string} dt String form of a date (such as yyyymmddhhmm, yyyy-mm-dd hh:mm, etc)
		 * @return {date}    A JavaScript Date object
		 * @memberOf  STX
		 */
		STX.strToDateTime=function(dt){
			if(!dt || dt.getFullYear) return dt;  //if passing in a JS date, return it.
			var myDateArray=[];
			var y,m,d,h,mn,sc,ms;
			if(dt.length==12){	// yyyymmddhhmm
				y=parseFloat(dt.substring(0,4));
				m=parseFloat(dt.substring(4,6)) - 1;
				d=parseFloat(dt.substring(6,8));
				h=parseFloat(dt.substring(8,10));
				mn=parseFloat(dt.substring(10,12));
				return new Date(y, m, d, h, mn, 0, 0);
			}else if(STX.yyyymmddhhmmssmmmrx.test(dt)){
				y=parseFloat(dt.substring(0,4));
				m=parseFloat(dt.substring(4,6)) - 1;
				d=parseFloat(dt.substring(6,8));
				h=parseFloat(dt.substring(8,10));
				mn=parseFloat(dt.substring(10,12));
				sc=parseFloat(dt.substring(12,14));
				ms=parseFloat(dt.substring(14,17));
				return new Date(y, m, d, h, mn, sc, ms);
			}else{
				var lr=[dt];
				var t=dt.indexOf("T");
				if(t!=-1){
					var afterT=dt.substring(t);
					if(!STX.isIE8 && (afterT.indexOf("Z")!=-1 || afterT.indexOf("-")!=-1 || afterT.indexOf("+")!=-1)){
						return new Date(dt); // utc time if it contains actual timezone information
					}
					lr=dt.split("T");
				}else if(dt.indexOf(" ")!=-1) lr=dt.split(" ");

				if(lr[0].indexOf('/')!=-1) myDateArray=lr[0].split("/");
				else if(lr[0].indexOf('-')!=-1) myDateArray=lr[0].split("-");
				else return STX.strToDate(dt); //give up, maybe it's just a date

				var year=parseFloat(myDateArray[2],10);
				if(myDateArray[0] && myDateArray[0].length==4){	// YYYY-MM-DD
					year=parseFloat(myDateArray[0],10);
					myDateArray[0]=myDateArray[1];
					myDateArray[1]=myDateArray[2];
				}

				if(lr.length>1){
					var ampm=lr[2];
					lr=lr[1].split(':');
					if(ampm){
						if(lr[0]=="12" && ampm.toUpperCase()=="AM") lr[0]=0;
						else if(lr[0]!="12" && ampm.toUpperCase()=="PM") lr[0]=parseInt(lr[0],10)+12;
					}
					var sec=0,msec=0;
					if(lr.length==3){
						if(lr[2].indexOf(".")==-1){
							sec=parseInt(lr[2],10);
						}else{
							sec=lr[2].split(".");
							if(sec[1].length==3){
								msec=sec[1];
								sec=sec[0];
							}else{  //only IE8 should get here
								msec=sec[1].substr(0,3);
								var tz=parseInt(sec[1].substr(3),10);
								sec=sec[0];
								var rDt=new Date(year, myDateArray[0]-1, myDateArray[1], lr[0], lr[1], sec, msec);
								rDt.setMinutes(rDt.getMinutes()-rDt.getTimezoneOffset()-tz%100-Math.round(tz/100)*60);
								return rDt;
							}
						}
					}
					return new Date(year,myDateArray[0]-1,myDateArray[1], lr[0], lr[1], sec, msec);
				}else{
					return new Date(year,myDateArray[0]-1,myDateArray[1], 0, 0, 0, 0);
				}
			}
		};

		/**
		 * Converts a string form date into a JavaScript object. Only use if you know that the string will not include a time, otherwise use @see STX.strToDateTime
		 * @param  {string} dt - Date in string format such as MM/DD/YY or YYYYMMDD or 2014-10-25T00:00:00+00:00 or 201506170635
		 * @return {Date}    JavaScript date object -new Date()-
		 * @memberOf  STX
		 */
		STX.strToDate=function(dt){
			var myDateArray;
			if(dt.indexOf('/')!=-1) myDateArray=dt.split("/");
			else if(dt.indexOf('-')!=-1) myDateArray=dt.split("-");
			else if(dt.length>=8){
				return new Date(parseFloat(dt.substring(0,4)), parseFloat(dt.substring(4,6))-1, parseFloat(dt.substring(6,8)));
			}else{
				return new Date();
			}
			if(myDateArray.length< 3){  // didn't find enough data for month, day and year.
				return new Date();
			}
			if(myDateArray[2].indexOf(' ')!=-1){
				myDateArray[2]=myDateArray[2].substring(0, myDateArray[2].indexOf(' '));
			} else if(myDateArray[2].indexOf('T')!=-1){
				myDateArray[2]=myDateArray[2].substring(0, myDateArray[2].indexOf('T'));
			}
			var year=parseFloat(myDateArray[2],10);
			if(year<20) year+=2000;
			if(myDateArray[0].length==4){	// YYYY-MM-DD
				year=parseFloat(myDateArray[0],10);
				myDateArray[0]=myDateArray[1];
				myDateArray[1]=myDateArray[2];
			}
			return new Date(year,myDateArray[0]-1,myDateArray[1]);
		};

		/**
		 * Converts a JavaScript Date or string form date to mm/dd/yyyy format
		 * @param  {string} d Date in JavaScript Date or string format such as YYYY-MM-DD
		 * @return {string}   Date in mm/dd/yyyy format
		 * @memberOf  STX
		 * @since TBD
		 */
		STX.mmddyyyy=function(dt){
			if(typeof(dt) === 'string'){
				dt = STX.strToDate(dt);
			}
			
			var m=dt.getMonth()+1;
			if(m<10) m="0" + m;
			d=dt.getDate();
			if(d<10) d="0" + d;
			return m + "/" + d + "/" + dt.getFullYear();
		};

		/**
		 * Converts a JavaScript Date to yyyy-mm-dd format
		 * @param  {date} dt JavaScript Date object
		 * @return {string}    Date in yyyy-mm-dd format
		 * @memberOf  STX
		 */
		STX.yyyymmdd=function(dt){
			var m=dt.getMonth()+1;
			if(m<10) m="0" + m;
			var d=dt.getDate();
			if(d<10) d="0" + d;
			return dt.getFullYear() + "-" + m + "-" + d;
		};

		/**
		 * Converts a date into yyyymmddhhmm format
		 * @param  {date} dt A JavaScript Date object
		 * @return {string}    Date in yyyymmddhhmm format
		 * @memberOf  STX
		 */
		STX.yyyymmddhhmm=function(dt){
			var m=dt.getMonth()+1;
			if(m<10) m="0" + m;
			var d=dt.getDate();
			if(d<10) d="0" + d;
			var h=dt.getHours();
			if(h<10) h="0" + h;
			var mn=dt.getMinutes();
			if(mn<10) mn="0" + mn;
			return '' + dt.getFullYear() + m + d + h + mn;
		};

		/**
		 * Converts a date into yyyymmddhhmmssmmm format
		 * @param  {date} dt A JavaScript Date object
		 * @return {string}    Date in yyyymmddhhmmssmmm format
		 * @memberOf  STX
		 */
		STX.yyyymmddhhmmssmmm=function(dt){
			var m=dt.getMonth()+1;
			if(m<10) m="0" + m;
			var d=dt.getDate();
			if(d<10) d="0" + d;
			var h=dt.getHours();
			if(h<10) h="0" + h;
			var mn=dt.getMinutes();
			if(mn<10) mn="0" + mn;
			var s=dt.getSeconds();
			if(s<10) s="0" + s;
			var ms=dt.getMilliseconds();
			if(ms<10) ms="00" + ms;
			else if(ms<100) ms="0" + ms;
			return '' + dt.getFullYear() + m + d + h + mn + s + ms;
		};

		/**
		 * Converts a date into yyyy/mm/dd hh:mm format
		 * @param  {date} dt A JavaScript Date object
		 * @return {string}    Date in yyyy/mm/dd hh:mm format
		 * @memberOf  STX
		 */
		STX.friendlyDate=function(dt){
			var m=dt.getMonth()+1;
			if(m<10) m="0" + m;
			var d=dt.getDate();
			if(d<10) d="0" + d;
			var h=dt.getHours();
			if(h<10) h="0" + h;
			var mn=dt.getMinutes();
			if(mn<10) mn="0" + mn;
			return '' + dt.getFullYear() + "/" + m + "/" + d + " " + h + ":" + mn;
		};

		/**
		 * Converts a date into YYYY-MM-DDTHH:MM:SSZ format (UTC)
		 * @param  {date} dt A JavaScript Date object
		 * @return {string}    Date in YYYY-MM-DDTHH:MM:SSZ format
		 * @memberOf  STX
		 */
		STX.standardUTCDate=function(dt){
			var m=dt.getUTCMonth()+1;
			if(m<10) m="0" + m;
			var d=dt.getUTCDate();
			if(d<10) d="0" + d;
			var h=dt.getUTCHours();
			if(h<10) h="0" + h;
			var mn=dt.getUTCMinutes();
			if(mn<10) mn="0" + mn;
			var s=dt.getUTCSeconds();
			if(s<10) s="0" + s;
			return '' + dt.getUTCFullYear() + "-" + m + "-" + d + "T" + h + ":" + mn + ":" + s + "Z";
		};

		/**
		 * Converts a string form date into mm-dd hh:mm format
		 * @param  {string} strdt Date in string format (such as yyyymmddhhmm, yyyy-mm-dd hh:mm, etc)
		 * @return {string}       Date in mm-dd hh:mm format
		 * @memberOf  STX
		 */
		STX.mmddhhmm=function(strdt){
			var dt=STX.strToDateTime(strdt);
			var m=dt.getMonth()+1;
			if(m<10) m="0" + m;
			var d=dt.getDate();
			if(d<10) d="0" + d;
			var h=dt.getHours();
			if(h<10) h="0" + h;
			var mn=dt.getMinutes();
			if(mn<10) mn="0" + mn;
			if(h=="00" && mn=="00") return m + "-" + d + "-" + dt.getFullYear();
			return m + "-" + d + " " + h + ":" + mn;
		};

		/**
		 * Gets the current time in Eastern Time Zone. This can be used as a convenience for determining open and closing times of US markets.
		 * @return {date} JavaScript Date representing the time in Eastern Time Zone
		 * @memberOf  STX
		 */
		STX.getETDateTime=function(){
			var d=new Date();
			return STX.convertTimeZone(new Date(d.getTime()+d.getTimezoneOffset()*60000),"UTC","America/New_York");
		};

		/**
		 * Converts a JavaScript date from Eastern Time Zone to the browser's local time zone. Daylight Savings Time is hard coded. @see STX.getETDateTime
		 * @param  {date} est JavaScript Date object representing a date/time in eastern time zone
		 * @return {date}     JavaScript Date object converted to browser's local time zone
		 * @memberOf  STX
		 */
		STX.fromET=function(est){
			var d=new Date();
			//var localTime = d.getTime();
			//var localOffset = d.getTimezoneOffset() * 60000;
			//var utc = localTime + localOffset;
			var offset = 4;
			if((d.getMonth()<2 || (d.getMonth()==2 && d.getDate()<11)) || (d.getMonth()>10 || (d.getMonth()==10 && d.getDate()>=4)))
					offset = 5;
			var localTime = est.getTime() + (3600000*offset);
			var nd = new Date(localTime);
			return nd;
		};

		/**
		 * Converts a future month to the month index or vice versa.  Month indexes begin with 1 for January
		 * @param  {char} x 	The value to convert.  If numeric, will convert to Future month letter.  If Alpha, will convert to month index.
		 * @return {char} 		Converted value
		 * @memberOf  STX
		 */
		STX.convertFutureMonth=function(x){
			var y=x.toString();
			if(y.length!=1) return "";
			switch(y){
			case '1': return "F";
			case '2': return "G";
			case '3': return "H";
			case '4': return "J";
			case '5': return "K";
			case '6': return "M";
			case '7': return "N";
			case '8': return "Q";
			case '9': return "U";
			case '10': return "V";
			case '11': return "X";
			case '12': return "Z";
			case 'F': return "1";
			case 'G': return "2";
			case 'H': return "3";
			case 'J': return "4";
			case 'K': return "5";
			case 'M': return "6";
			case 'N': return "7";
			case 'Q': return "8";
			case 'U': return "9";
			case 'V': return "10";
			case 'X': return "11";
			case 'Z': return "12";
			}
			return y;
		};

		/**
		 * Gets the day of the year
		 * @param  {Date} [dt] optional	The date to check.  If omitted, will use the current date.
		 * @return {number} 			Day of year
		 * @memberOf  STX
		 */
		STX.getYearDay=function(dt){
			var now = dt;
			if(!now) now = new Date();
			now.setHours(0,0,0,0);
			var start = new Date(now.getFullYear(), 0, 0);
			var diff = now - start;
			var oneDay = 1000 * 60 * 60 * 24;
			var day = Math.round(diff / oneDay);
			return day;
		};

		/**
		 * DST checker.  Returns whether input date is in DST
		 * @param  {Date} [dt] optional	The date to check.  If omitted, will use the current date.
		 * @return {boolean} True for DST, false for not.
		 * @memberOf  STX
		 */
		STX.isDST=function(dt){
			if(!dt) dt=new Date();
			var jan = new Date(dt.getFullYear(), 0, 1);
			var jul = new Date(dt.getFullYear(), 6, 1);
			var stdOffset=Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
			return dt.getTimezoneOffset() != stdOffset;
		};

		/**
		 * Prints out a number in US Dollar monetary representation
		 * @param  {number} val      The amount
		 * @param  {number} [decimals=2] Optional number of decimal places.
		 * @param  {string} [currency] Optional currency designation.  If omitted, will use $.
		 * @return {string}          US Dollar monetary representation
		 * // Returns $100.00
		 * STX.money(100, 2);
		 * @memberOf  STX
		 */
		STX.money=function(val, decimals, currency){
			if(!currency) currency="$";
			if(currency.length==3) currency+=" ";
			if(!decimals && decimals!==0) decimals=2;
			return currency + STX.commas((Math.round(val*10000)/10000).toFixed(decimals));
		};

		/**
		 * Converts a currency code from ISO to char
		 * @param  {string} code      The string to convert, e.g. USD
		 * @return {string}          The converted string, e.g. $
		 * @memberOf  STX
		 */
		STX.convertCurrencyCode=function(code){
			var codes={JPY:"¥",USD:"$",AUD:"A$",BRL:"R$",CAD:"CA$",CNY:"CN¥",CZK:"Kč",DKK:"kr",EUR:"€",GBP:"£",HKD:"HK$",HUF:"Ft",ILS:"₪",INR:"₹",KRW:"₩",MXN:"MX$",NOK:"kr",NZD:"NZ$",PLN:"zł",RUB:"руб",SAR:"﷼",SEK:"kr",SGD:"S$",THB:"฿",TRY:"₺",TWD:"NT$",VND:"₫",XAF:"FCFA",XCD:"EC$",XOF:"CFA",XPF:"CFPF",ZAR:"R"};
			var rt=codes[code];
			if(rt) return rt;
			else return code;
		};

		/**
		 * Returns true if the interval is based off of a daily interval ("day","week" or "month")
		 * @param  {string}  interval The interval
		 * @return {Boolean}          True if it's a daily interval
		 * @memberOf STXChart
		 */
		STXChart.isDailyInterval=function(interval){
			if(interval=="day") return true;
			if(interval=="week") return true;
			if(interval=="month") return true;
			return false;
		};


		/**
		 * Returns true if the chartType is not a line type and therefore displays highs and lows.
		 * @param  {String}  chartType The chart type (layout.chartType)
		 * @return {Boolean}           True if the chart type only displays close values
		 * @memberOf  STXChart
		 * @since 05-2016-10.1 "baseline_delta_mountain" and  "colored_mountain" are also available
		 */
		STXChart.chartShowsHighs=function(chartType){
			if(chartType=="line") return false;
			if(chartType=="colored_line") return false;
			if(chartType=="mountain") return false;
			if(chartType=="colored_mountain") return false;
			if(chartType=="baseline_delta") return false;
			if(chartType=="baseline_delta_mountain") return false;
			return true;
		};
		/**
		 * Returns a string representation of a number with commas in thousands, millions or billions places. Note that this function does
		 * not handle values with more than 3 decimal places!!!
		 * @param  {number} val The value
		 * @return {string}     The result with commas
		 * @example
		 * // Returns 1,000,000
		 * STX.commas(1000000);
		 * @memberOf  STX
		 */
		STX.commas=function(val){
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		};

		/**
		 * Gets an Ajax server dependent on browser method. If IE9 and a cross domain request then XDomainRequest() will be used
		 * rather than XMLHttpRequest.
		 * @param  {string} url The url to connect with
		 * @return {object}     An ajax server
		 * @memberOf  STX
		 */
		STX.getAjaxServer=function(url){
			var server=false;
			var crossDomain=true;
			if((STX.isIE9 || STX.isIE8) && url){
				if(STX.getHostName(url)==="") crossDomain=false;
				if(STX.getHostName(url)==STX.getHostName(window.location.href)) crossDomain=false;
			}
			if((STX.isIE9 || STX.isIE8) && crossDomain){
				server = new XDomainRequest();
				return server;
			}
			try{
				//All modern browsers (IE7+, Firefox, Chrome, Safari, and Opera) have a built-in XMLHttpRequest object.
				server = new XMLHttpRequest();
			}catch(e){
				alert("ajax not supported in browser");
			}
			return server;
		};

		/**
		 * A parsed query string object
		 * Does not support using multi-value keys (i.e. "a=1&a=2")
		 * @param  {string} [query] Query string. If not provided then the browser location's query string will be used
		 * @return {object}       An object containing the parsed values of the query string
		 * @memberOf  STX
		 */
		STX.qs=function(query) {
			var qsParm = {};
			if(!query) query = window.location.search.substring(1);
			var parms = query.split('&');
			for (var i=0; i<parms.length; i++) {
				var pos = parms[i].indexOf('=');
				var key;
				if (pos > 0) {
					key = parms[i].substring(0,pos);
					qsParm[key] = parms[i].substring(pos+1);
				}else{
					key = parms[i];
					qsParm[key] = null;
				}
			}
			return qsParm;
		};

		/**
		 * Converts an onClick event to an ontouchend event. If the device is known to be a touch device then this can be used
		 * to change onclick events that are set as attributes (in HTML). ontouchend events are more responsive than onclick events
		 * and can improve the user experience. When coding for cross-device implementations it is recommended to use @see STX.safeClickTouch
		 * programatically rather than using hardcoded attributes
		 * @param  {string} id The id of a node containing an onClick attribute
		 * @memberOf  STX
		 */
		STX.convertClickToTouchEnd=function(id){
			var node=$$(id);
			var s=node.getAttribute("onClick");
			if(s){
				node.removeAttribute("onClick");
				node.setAttribute("onTouchEnd", s);
			}
		};

		/**
		 * Gets the absolute screen position of a nested DOM element. This is useful if you need to position additional elements or canvas
		 * elements relative to a nested DOM element.
		 * @param  {object} el A valid DOM element
		 * @return {object}    {x,y} absolute screen position of the nested element
		 * @memberOf  STX
		 */
		STX.getPos=function(el) {
		    for (var lx=0, ly=0;
		         el;
		         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
		    return {x: lx,y: ly};
		};

		/**
		 * Returns true if a point, in absolute screen position, is within an element
		 * @param  {object} node A valid DOM element to check whether the point overlaps
		 * @param  {number} x    Absolute screen X position of point
		 * @param  {number} y    Absolute screen Y position of pointer
		 * @return {boolean}      True if the point lies inside of the DOM element
		 * @memberOf  STX
		 */
		STX.withinElement=function(node, x, y){
			var xy=STX.getPos(node);
			if(x<=xy.x) return false;
			if(y<=xy.y) return false;
			if(x>=xy.x+node.offsetWidth) return false;
			if(y>=xy.y+node.offsetHeight) return false;
			return true;
		};

		/**
		 * Used in conjuction, safeMouseOut and safeMouseOver ensure just a single event when the mouse moves
		 * in or out of an element. This is important because simple mouseout events will fire when the mouse
		 * crosses boundaries *within* an element. Note that this function will do nothing on a touch device where
		 * mouseout is not a valid operation.
		 * @param  {object} node A valid DOM element
		 * @param  {function} fc   Function to call when the mouse has moved out
		 * @memberOf  STX
		 */
		STX.safeMouseOut=function(node, fc){
			function closure(node, fc){
				return function(e){
					if(typeof e.pageX=="undefined"){
						e.pageX=e.clientX;
						e.pageY=e.clientY;
					}
					if(STX.withinElement(node, e.pageX, e.pageY)){
						return;
					}
					node.stxMouseOver=false;
					fc(e);
				};
			}
			node.addEventListener("mouseout", closure(node, fc));
		};

		/**
		 * This method is guaranteed to only be called once when a user mouses over an object. @see STX#safeMouseOut
		 * @param  {object} node A valid DOM element
		 * @param  {function} fc   Function to call when mouse moves over the object
		 * @memberOf  STX
		 */
		STX.safeMouseOver=function(node, fc){
			function closure(node, fc){
				return function(e){
					if(typeof e.pageX=="undefined"){
						e.pageX=e.clientX;
						e.pageY=e.clientY;
					}
					if(STX.withinElement(node, e.pageX, e.pageY)){
						if(node.stxMouseOver) return;
						node.stxMouseOver=true;
						fc(e);
					}
				};
			}
			node.addEventListener("mouseover", closure(node, fc));
		};

		/**
		 * Fixes screen scroll. This can occur when the keyboard opens on an ipad or iphone.
		 * @memberOf  STX
		 */
		STX.fixScreen=function(){
			window.scrollTo(0,0);
		};


		/**
		 * Sets the position of the cursor within a textarea box. This is used for instance to position the cursor at the
		 * end of the text that is in a textarea.
		 * @param {object} ctrl A valid textarea DOM element
		 * @param {number} pos  The position in the text area to position
		 * @memberOf  STX
		 */
		STX.setCaretPosition=function(ctrl, pos){
			ctrl.style.zIndex=5000;
			if(ctrl.setSelectionRange){
				STX.focus(ctrl);
				try{
					ctrl.setSelectionRange(pos,pos);
				}catch(e){}
			}else if (ctrl.createTextRange) {
				var range = ctrl.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		};

		/**
		 * Sets the value of an input box only if it is not active. This prevents an input box from changing underneath
		 * a user, which can be extremely frustrating on touch devices.
		 * @param {HTMLElement} el    The input element
		 * @param {string} value The value to set
		 */
		STX.setValueIfNotActive=function(el, value){
			if(document.activeElement==el) return;
			el.value=value;
		};
		/**
		 * Appends a class name to a node if it isn't already there. This is frequently used to control dynamic behavior via CSS.
		 * @example
		 * // Apply an "active" css look to an object
		 * STX.appendClassName(myNode, "active");
		 * @param  {object} node      A valid DOM element
		 * @param  {string} className Name of class to add to the DOM element
		 * @memberOf  STX
		 */
		STX.appendClassName=function(node, className){
			if(node.className==className) return; // already a class
			var s=node.className.split(" ");
			for(var i=0;i<s.length;i++){
				if(s[i]==className) return;	// already a class
			}
			if(!node.className) node.className=className;
			else node.className+=" " + className;
		};

		/**
		 * Removes a class name from a node if it is set
		 * @param  {object} node      A valid DOM element
		 * @param  {string} className The class name to remove
		 * @memberOf  STX
		 */
		STX.unappendClassName=function(node, className){
			if(!node) return;
			if(node.className.indexOf(className)==-1) return;
			if(node.className==className){
				node.className="";
			}else{
				var s=node.className.split(" ");
				var newClassName="";
				for(var i=0;i<s.length;i++){
					if(s[i]==className) continue;
					if(newClassName!=="") newClassName+=" ";
					newClassName+=s[i];
				}
				node.className=newClassName;
			}
		};

		/**
		 * Convenience method for swapping two class names within a node. Such as for changing state.
		 * @param  {object} node         A valid DOM element
		 * @param  {string} newClassName The class name to swap in
		 * @param  {string} oldClassName The class name to swap out
		 * @memberOf  STX
		 */
		STX.swapClassName=function(node, newClassName, oldClassName){
			STX.unappendClassName(node, oldClassName);
			STX.appendClassName(node, newClassName);
		};

		/**
		 * Returns true if a class name is currently assigned to the DOM node
		 * @param  {object}  node      A valid DOM element
		 * @param  {string}  className The class name to search for
		 * @return {Boolean}           True if the class name is currently assigned to the DOM node
		 * @memberOf  STX
		 */
		STX.hasClassName=function(node, className){
			if((" "+node.className+" ").indexOf(" "+className+" ")>-1) return true;
			else return false;
		};

		/**
		 * Toggles the className on or off
		 * @param  {HtmlElement} node      The node to toggle
		 * @param  {String} className The class name to toggle
		 */
		STX.toggleClassName=function(node, className){
			if(STX.hasClassName(node, className))
				STX.unappendClassName(node, className);
			else
				STX.appendClassName(node, className);
		};

		// Don't use, just for crosshairs
		var blocks=[];

		/**
		 * @deprecated
		 */
		STX.createDIVBlock=function(left, width, top, height){
			var block=document.createElement("div");
			block.style.position="fixed";
			block.style.left=left + "px";
			block.style.width=width + "px";
			block.style.top=top + "px";
			block.style.height=height + "px";
			document.body.appendChild(block);
			blocks[blocks.length]=block;
			return block;
		};

		/**
		 * Draws a ticked rectangle on the canvas. For use in the y-axis label.
		 * @param  {object} ctx    A valid HTML Canvas Context
		 * @param  {number} x      Left position of drawing on canvas
		 * @param  {number} y      Top position of drawing on canvas
		 * @param  {number} width  Width of rectangle
		 * @param  {number} height Height of rectangle
		 * @param  {number} radius Radius of rounding
		 * @param  {Boolean} [fill]   Whether to fill the background
		 * @param  {Boolean} [stroke] Whether to fill the outline
		 * @memberOf  STX
		 */
		STX.tickedRect=function(ctx, x, y, width, height, radius, fill, stroke) {
			  if (typeof stroke == "undefined" ) {
			    stroke = true;
			  }
			  if (typeof radius === "undefined") {
			    radius = 5;
			  }
			  ctx.beginPath();
			  ctx.moveTo(x, y);
			  ctx.lineTo(x + width, y);
			  ctx.lineTo(x + width, y + height);
			  // subtract 2 from x to make the rectangle flush with the axis
			  ctx.lineTo(x-2, y + height);
			  ctx.lineTo(x-2, y);
			  ctx.closePath();
			  if (stroke) {
			    ctx.stroke();
			  }
			  if (fill) {
			    ctx.fill();
			  }
			  var tickY=Math.round(y+height/2)+0.5;
			  ctx.beginPath();
			  ctx.moveTo(x-2, tickY);
			  ctx.lineTo(x, tickY);
			  ctx.strokeStyle="#FFFFFF";
			  ctx.stroke();
		};

		/**
		 * Draws a rounded rectangle on the canvas.
		 * @param  {object} ctx    A valid HTML Canvas Context
		 * @param  {number} x      Left position of drawing on canvas
		 * @param  {number} y      Top position of drawing on canvas
		 * @param  {number} width  Width of rectangle
		 * @param  {number} height Height of rectangle
		 * @param  {number} radius Radius of rounding
		 * @param  {Boolean} [fill]   Whether to fill the background
		 * @param  {Boolean} [stroke] Whether to fill the outline
		 * @memberOf  STX
		 */
		STX.roundRect=function(ctx, x, y, width, height, radius, fill, stroke) {
			  if (typeof stroke == "undefined" ) {
			    stroke = true;
			  }
			  if (typeof radius === "undefined") {
			    radius = 5;
			    if(width<0) radius=-5;
			  }
			  var yradius=width<0?radius*-1:radius;
			  x=x-1; // Just a smidge more
			  ctx.beginPath();
			  ctx.moveTo(x + radius, y);
			  ctx.lineTo(x + width - radius, y);
			  ctx.quadraticCurveTo(x + width, y, x + width, y + yradius);
			  ctx.lineTo(x + width, y + height - yradius);
			  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			  ctx.lineTo(x + radius, y + height);
			  ctx.quadraticCurveTo(x, y + height, x, y + height - yradius);
			  ctx.lineTo(x, y + yradius);
			  ctx.quadraticCurveTo(x, y, x + radius, y);
			  ctx.closePath();
			  if (stroke) {
			    ctx.stroke();
			  }
			  if (fill) {
			    ctx.fill();
			  }
		};

		/**
		 * Draws a rounded rectangle with an arrowhead on the screen.
		 * @param  {object}  ctx    A valid HTML Canvas Context
		 * @param  {number}  x      Left position of drawing on canvas
		 * @param  {number}  y      Top position of drawing on canvas
		 * @param  {number}  width  Width of rectangle
		 * @param  {number}  height Height of rectangle
		 * @param  {number}  radius Radius of rounding
		 * @param  {Boolean} [fill]   Whether to fill the background
		 * @param  {Boolean} [stroke] Whether to fill the outline
		 * @memberOf  STX
		 */
		STX.roundRectArrow = function(ctx, x, y, width, height, radius, fill, stroke) {
			if (typeof stroke == "undefined") {
		    	stroke = true;
		  	}
		  	if (typeof radius === "undefined") {
		    	radius = 5;
		    	if(width<0) radius=-5;
		  	}
		  	var yradius=width<0?radius*-1:radius;
			ctx.beginPath();
			ctx.moveTo(x + radius, y);
			ctx.lineTo(x + width - radius, y); // nw -> ne

			ctx.quadraticCurveTo(x + width, y, x + width, y + yradius); // ne corner
			ctx.lineTo(x + width, y + height - yradius); // ne -> se
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height); // se corner

			ctx.lineTo(x + radius, y + height); // se -> sw

			ctx.quadraticCurveTo(x, y + height, x - radius, y + height - yradius);
			if(width<0){
				ctx.lineTo(x + (height / 2), y + (height /2)); // right arrow tip
			}else{
				ctx.lineTo(x - (height / 2), y + (height /2)); // leftarrow tip
			}
			ctx.lineTo(x - radius, y + yradius);
			ctx.quadraticCurveTo(x, y, x + radius, y);

			ctx.closePath();
			if (stroke) {
				ctx.stroke();
			}
			if (fill) {
				ctx.fill();
			}
		};

		/**
		 * Draws a rectangle on the canvas with just the right side curved corners
		 * see {@link STX.roundRect}
		 * @memberOf  STX
		 */
		STX.semiRoundRect=function(ctx, x, y, width, height, radius, fill, stroke) {
			  if (typeof stroke == "undefined" ) {
			    stroke = true;
			  }
			  if (typeof radius === "undefined") {
			    radius = 5;
			    if(width<0) radius=-5;
			  }
			  var yRadius=width<0?radius*-1:radius;
			  ctx.beginPath();
			  ctx.moveTo(x, y);
			  ctx.lineTo(x + width - radius, y);
			  ctx.quadraticCurveTo(x + width, y, x + width, y + yRadius);
			  ctx.lineTo(x + width, y + height - yRadius);
			  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
			  ctx.lineTo(x, y + height);
			  ctx.lineTo(x, y);
			  ctx.closePath();
			  if (stroke) {
			    ctx.stroke();
			  }
			  if (fill) {
			    ctx.fill();
			  }
		};

		/**
		 * Draws a rectangle on the canvas
		 * see {@link STX.roundRect}
		 * @memberOf  STX
		 */
		STX.rect=function(ctx, x, y, width, height, radius, fill, stroke) {
			  ctx.beginPath();
			  ctx.moveTo(x, y);
			  ctx.lineTo(x + width, y);
			  ctx.lineTo(x + width, y + height);
			  ctx.lineTo(x, y + height);
			  ctx.lineTo(x, y);
			  ctx.closePath();
			  if (stroke) {
			    ctx.stroke();
			  }
			  if (fill) {
			    ctx.fill();
			  }
		};
		/**
		 * No operation will be performed. As a result there will be no label drawn around the value.
		 * see {@link STX.roundRect}
		 * @memberOf  STX
		 */
		STX.noop=function(ctx, x, y, width, height, radius, fill, stroke) {
		};


		/**
		 * Turns a portion of raw text into multi-line text that fits in a given width. This is used for autoformatting of annotations
		 * @param  {object} ctx    A valid HTML Canvas Context
		 * @param  {string} phrase The text
		 * @param  {number} l      The width in pixels to fit the text within on the canvas
		 * @return {array}        An array of individual lines that should fit within the specified width
		 * @memberOf  STX
		 */
		STX.getLines=function(ctx,phrase,l) {
			var wa=phrase.split(" "), phraseArray=[], lastPhrase="", measure=0;
			var fw=false;
			for (var i=0;i<wa.length;i++) {
				var w=wa[i];
				measure=ctx.measureText(lastPhrase+w).width;
				if (measure<l) {
					if(fw) lastPhrase+=" ";
					fw=true;
					lastPhrase+=w;
				}else {
					phraseArray.push(lastPhrase);
					lastPhrase=w;
				}
				if (i===wa.length-1) {
					phraseArray.push(lastPhrase);
					break;
				}
			}
			return phraseArray;
		};

		/**
		 * <span class="animation">Animation Loop</span>
		 * Clears the canvas. Uses the fastest known method except on the legacy Android browser which had many problems!
		 * @param  {object} canvas A valid HTML canvas object
		 * @param  {object} [stx]    A chart object, only necessary for old Android browsers on problematic devices
		 * @memberOf  STX
		 */
		STX.clearCanvas=function(canvas, stx){
			canvas.isDirty=false;
			canvas.context.clearRect(0, 0, canvas.width, canvas.height);
			if(STX.isAndroid && !STX.is_chrome){	// Android browser last remaining
													// one to need this clearing method
				if(STXChart.useOldAndroidClear && stx){
					canvas.context.fillStyle=stx.containerColor;
					canvas.context.fillRect(0, 0, canvas.width, canvas.height);
					canvas.context.clearRect(0, 0, canvas.width, canvas.height);
				}
				var w=canvas.width;
		    	canvas.width=1;
		    	canvas.width=w;
			}
		};

		/**
		 * User friendly alerts. The charting engine always uses this instead of alert() for warning or error messages. This
		 * method can be overriden as required by your user interface.
		 * @param  {string} text Alert message
		 * @example
		 * // Override with a friendlier alert mechanism!
		 * STX.alert=function(text){
		 * 	doSomethingElse(text);
		 * }
		 * @memberOf  STX
		 */
		STX.alert=function(text){
			alert(text);
		};

		/**
		 * @deprecated
		 */
		STX.horizontalIntersect=function(vector, x, y){
			if(x<Math.max(vector.x0, vector.x1) && x>Math.min(vector.x0, vector.x1)) return true;
			return false;
		};

		/**
		 * @deprecated
		 */
		STX.twoPointIntersect=function(vector, x, y, radius){
			return STX.boxIntersects(x-radius, y-radius, x+radius, y+radius, vector.x0, vector.y0, vector.x1, vector.y1, "segment");
		};

		/**
		 * @deprecated
		 */
		STX.boxedIntersect=function(vector, x, y){
			if(x>Math.max(vector.x0, vector.x1) || x<Math.min(vector.x0, vector.x1)) return false;
			if(y>Math.max(vector.y0, vector.y1) || y<Math.min(vector.y0, vector.y1)) return false;
			return true;
		};

		/**
		 * Returns true if a point, in relative screen position, is withing an element @see STX.withinElement
		 * @param  {object}  div A valid DOM element
		 * @param  {number}  x   X point relative to DOM element nesting
		 * @param  {number}  y   Y point relative to DOM element nesting
		 * @return {Boolean}     True if the point is in the element
		 * @memberOf  STX
		 */
		STX.isInElement=function(div, x, y){
			if(x<div.offsetLeft) return false;
			if(x>div.offsetLeft+div.clientWidth) return false;
			if(y<div.offsetTop) return false;
			if(y>div.offsetTop+div.clientHeight) return false;
			return true;
		};

		/**
		 * Set once after user is alerted that private browsing is enabled
		 * @memberOf  STX
		 */
		STX.privateBrowsingAlert=false;

		// Some browsers don't support localStorage, worse won't let you polyfill (JDK7 webview). So we will create
		// this so that we can add a polyfill.
		try{
			STX.localStorage=localStorage;
		}catch(e){
			STX.alert("Your browser is not set to accept cookies.  This site will not operate properly unless cookies are accepted from "+location.protocol+"//"+location.host+".");
		}

		/**
		 * Convenience function for storing a name value pair in local storage. This will detect if private browsing is enabled
		 * because localStorage is inoperable under private browsing
		 * @param  {string} name  Name to store
		 * @param  {string} value Value to store
		 * @memberOf  STX
		 */
		STX.localStorageSetItem=function(name, value){
			try{
				STX.localStorage.setItem(name, value);
			}catch(e){
				if(!STX.privateBrowsingAlert){
					STX.alert("No storage space available.  Possible causes include browser being in Private Browsing mode, or maximum storage space has been reached.");
					STX.privateBrowsingAlert=true;
				}
			}
		};

		// The most complicated function ever written
		//
		// colorClick = the div that the user clicks on to pull up the color picker. The color picker will set the
		//              background of this to the selected color
		//
		// cpHolder = A global object that is used to contain the color picker and handle closures of the containing dialog.
		//
		// cb = Callback function for when the color is picked fc(color)

		/**
		 * Attaches a color picker to a DOM object.
		 * @param  {object}   colorClick The DOM element that the user clicks on to pull up the color picker. The color picker will set the background color of this node to the selected color.
		 * @param  {object}   cpHolder   A global object that is necessary to contain the color picker and handle closures. Usually the parent of colorClick.
		 * @param  {Function} cb         A callback function to call when the color is picked of format fc(color) where color is the selected color
		 * @memberOf  STX
		 */
		STX.attachColorPicker = function(colorClick, cpHolder, cb){
			var closure=function(colorClick, cpHolder, cb){
				return function(color){
					if(cpHolder.colorPickerDiv) cpHolder.colorPickerDiv.style.display="none";
					colorClick.style.backgroundColor="#"+color;
					if(cb) cb(color);
				};
			};
			colorClick.onclick=(function(fc, cpHolder){ return function(){
				if(!cpHolder.colorPickerDiv){
					cpHolder.colorPickerDiv=document.createElement("DIV");
					cpHolder.colorPickerDiv.className="ciqColorPicker";
					document.body.appendChild(cpHolder.colorPickerDiv);
				}
				STX.createColorPicker(cpHolder.colorPickerDiv, fc);
				cpHolder.colorPickerDiv.style.display="block";
				var xy=STX.getPos(this);
				var x=xy.x+this.clientWidth;
				if((x+cpHolder.colorPickerDiv.offsetWidth)>STX.pageWidth())
					x-=(x+cpHolder.colorPickerDiv.offsetWidth)-STX.pageWidth()+20;
				cpHolder.colorPickerDiv.style.left=x+"px";

				var y=(xy.y);
				if(y+cpHolder.colorPickerDiv.clientHeight>STX.pageHeight())
					y-=(y+cpHolder.colorPickerDiv.clientHeight)-STX.pageHeight();
				cpHolder.colorPickerDiv.style.top=y+"px";
			};})(closure(colorClick, cpHolder, cb), cpHolder);
		};

		/**
		 * Predefined colors for the color picker that have been tested across multiple devices.
		 * These color values may be changed if desired by assigning STX.colorPickerColors to a different array of colors.
		 * @memberOf  STX
		 * @example
		 * STX.colorPickerColors = ["ffffff","ffd0cf","ffd9bb","fff56c","eaeba3","d3e8ae","adf3ec","ccdcfa","d9c3eb"];
		 */
		STX.colorPickerColors = [
		    "ffffff","ffd0cf","ffd9bb","fff56c","eaeba3","d3e8ae","adf3ec","ccdcfa","d9c3eb",
			"efefef","eb8b87","ffb679","ffe252","e2e485","c5e093","9de3df","b1c9f8","c5a6e1",
			"cccccc","e36460","ff9250","ffcd2b","dcdf67","b3d987","66cac4","97b8f7","b387d7",
			"9b9b9b","dd3e39","ff6a23","faaf3a","c9d641","8bc176","33b9b0","7da6f5","9f6ace",
			"656565","b82c0b","be501b","e99b54","97a030","699158","00a99d","5f7cb8","784f9a",
			"343434","892008","803512","ab611f","646c20","46603a","007e76","3e527a","503567",
			"000000","5c1506","401a08","714114","333610","222f1d","00544f","1f2a3c","281a33"
		];

		/**
		 * Creates the color picker node. Uses colors specified in {@link STX.colorPickerColors}
		 * @private
		 * @memberOf  STX
		 */
		STX.createColorPicker = function (div, fc) {
			var colors=STX.colorPickerColors;
			STX.clearNode(div);
			var ul=document.createElement("ul");
			div.appendChild(ul);
			function clkFn(c){ return function(){ fc(c); return false;};}
			for(var i=0;i<colors.length;i++){
				var c=colors[i];
				var li=document.createElement("li");
				var a=document.createElement("a");
				li.appendChild(a);
				a.href="#";
				a.title=c;
				a.style.background="#"+c;
				a.innerHTML=c;
				ul.appendChild(li);
				a.onclick=clkFn(c);
			}
		};

		/**
		 * Returns true if an object has no members
		 * @param  {object}  o A JavaScript object
		 * @return {Boolean}   True if there are no members in the object
		 * @memberOf  STX
		 */
		STX.isEmpty = function( o ) {
		    for ( var p in o ) {
		        if ( o.hasOwnProperty( p ) ) { return false; }
		    }
		    return true;
		};

		/**
		 * Convenience function returns the first property in an object. Note that while this works in all known browsers
		 * the EMCA spec does not guarantee that the order of members in an object remain static. This method should therefore
		 * be avoided. When ordering is important use an Array!
		 * @param  {object} o A JavaSCript object
		 * @return {object}   The first element in the object or null if it is empty
		 * @memberOf  STX
		 */
		STX.first = function( o ) {
		    for ( var p in o ) {
		        return p;
		    }
		    return null;
		};

		/**
		 * Convenience function for returning the last property in an object. Note that while this works in all known browsers
		 * the EMCA spec does not guarantee that the order of members in an object remain static. This method should therefore
		 * be avoiding. When ordering is important use an Array!
		 * @param  {object} o A JavaScript object
		 * @return {object}   The final member of the object or null if the object is empty
		 * @memberOf  STX
		*/
		STX.last = function( o ) {
			var l=null;
		    for ( var p in o ) {
		        l=p;
		    }
		    return l;
		};

		/**
		 * Returns the number of members in an object
		 * @param  {object} o A valid JavaScript object
		 * @return {number}   The number of members in the object
		 * @memberOf  STX
		 */
		STX.objLength = function( o ) {
			var i=0;
		    for ( var p in o ) {
		        i++;
		    }
		    return i;
		};

		/**
		 * Returns true if the objects are an exact match
		 * @param  {Object} a First object
		 * @param  {Object} b Second object
		 * @param  {Object} [exclude] Exclude these fields
		 * @return {Boolean}   True if they are an exact match
		 */
		STX.equals = function(a, b, exclude){
			if(!a && b) return false;
			if(a && !b) return false;
			if(typeof(a) !== typeof(b)) return false;
			for(var field in a){
				if(exclude && exclude[field]) continue;
				if(typeof(a[field])==="object"){
					var result=STX.equals(a[field], b[field]);
					if(!result) return false;
					continue;
				}
				if(b[field]!=a[field]) return false;
			}
			return true;
		};
		/**
		 * Given a dot notation string, we want to navigate to the location
		 * in a base object, creating the path along the way
		 * @param  {Object} base      Base object.
		 * @param  {String} extension String in dot notation
		 * @return {Object}           A tuple containing obj and member
		 * @memberOf  STX
		 * @since  2015-11-1
		 * @example
		 * var tuple=STX.deriveFromObjectChain(stx.layout, "pandf.box");
		 * tuple.obj===stx.layout.pandf
		 * tuble.member==="box"
		 * tuple.obj[tuple.member]="square";  // stx.layout.pandf.box="square"
		 */
		STX.deriveFromObjectChain=function(base, extension){
			var objectString=extension.split(".");
			if(objectString.length===1)
				return {obj:base,member:extension};
			for(var i=0;i<objectString.length-1;i++){
				if(!base[objectString[i]]) base[objectString[i]]={};
				base=base[objectString[i]];
			}
			return {obj:base, member: objectString[i]};
		};

		/**
		 * The Plotter is a device for managing complex drawing operations on the canvas. The HTML 5 canvas performs better when drawing
		 * operations of the same color are batched (reducing the number of calls to the GPU). The plotter allows a developer to store those
		 * operations in a normal control flow, and then have the Plotter deliver the primitives to the canvas. The plotter can also be used
		 * as a caching mechanism for performing the same operations repeatedly. The y-axis of the chart uses this mechanism to boost performance.
		 * @constructor
		 * @name  STX.Plotter
		 */
		STX.Plotter=function(){
			this.seriesArray=[];
			this.seriesMap={};
		};

		STX.Plotter.prototype={
			/**
			 * Define a series to plot. A series is a specific color and referenced by name
			 * @param {string} name         Name of series
			 * @param {boolean} strokeOrFill If true then a stroke operation, otherwise a fill operation
			 * @param {string} color        A valid canvas color
			 * @param {number} [opacity=1]      A valid opacity from 0-1
			 * @param {number} [width=1]      A valid lineWidth from 1
			 * @memberOf  STX.Plotter
			 */
				Series: function(name, strokeOrFill, color, opacity, width){
					this.name=name;
					this.strokeOrFill=strokeOrFill;
					this.color=color;
					this.opacity=opacity;
					this.width=width;
					this.moves=[];
					this.text=[];
					if(!opacity || opacity>1 || opacity<0) this.opacity=1;
					if(!width || width>25 || width<1) this.width=1;
				},
				/**
				 * Create a series. This supports either a text color or STXChart.Style object
				 * @see  STX.Plotter.Series
				 * @memberOf  STX.Plotter
				 */
				newSeries: function(name, strokeOrFill, colorOrStyle, opacity, width){
					var series;
					if(colorOrStyle.constructor == String) series=new this.Series(name, strokeOrFill, colorOrStyle, opacity, width);
					else series=new this.Series(name, strokeOrFill, colorOrStyle.color, colorOrStyle.opacity, width);
					this.seriesArray.push(series);
					this.seriesMap[name]=series;
				},
				/**
				 * @memberOf  STX.Plotter
				 */
				moveTo: function(name, x, y){
					var series=this.seriesMap[name];
					series.moves.push({"action":"moveTo","x":x,"y":y});
				},
				/**
				 * @memberOf  STX.Plotter
				 */
				lineTo: function(name, x, y){
					var series=this.seriesMap[name];
					series.moves.push({"action":"lineTo","x":x,"y":y});
				},
				/**
				 * @memberOf  STX.Plotter
				 */
				dashedLineTo: function(name, x, y, pattern){
					var series=this.seriesMap[name];
					series.moves.push({"action":"dashedLineTo","x":x,"y":y, "pattern":pattern});
				},
				/**
				 * @memberOf  STX.Plotter
				 */
				quadraticCurveTo: function(name, x0, y0, x1, y1){
					var series=this.seriesMap[name];
					series.moves.push({"action":"quadraticCurveTo","x0":x0, "y0":y0, "x":x1, "y":y1});
				},
				/**
				 * Add text to be rendered with the drawing. Primarily used when the Plotter is used for caching since there is no
				 * performance benefit from batching text operations to the GPU. If specifying a bounding box, textBaseline="middle" is assumed
				 * @param {string} name Name of series
				 * @param {string} text The raw text to render
				 * @param {number} x    X position on canvas for text
				 * @param {number} y    Y position on canvas for text
				 * @param {string} [backgroundColor] Optional, will put a box underneath the text
				 * @param {number} [width] Optional width of bounding box
				 * @param {number} [height] Optional height of bounding box
				 * @memberOf  STX.Plotter
				 */
				addText: function(name, text, x, y, backgroundColor, width, height){
					var series=this.seriesMap[name];
					series.text.push({"text":text,"x":x,"y":y, "bg":backgroundColor});
				},
				/**
				 * Renders the text objects. This is done after drawing primitives for each series.
				 * @private
				 * @memberOf  STX.Plotter
				 */
				drawText: function(context, series){
					for(var i=0;i<series.text.length;i++){
						var textObj=series.text[i];
						if(textObj.bg){
							var w=textObj.width?textObj.width:context.measureText(textObj.text).width;
							var h=textObj.height?textObj.height:12;
							var prev=context.fillStyle;
							context.fillStyle=textObj.bg;
							if(context.textAlign=="right"){
								context.fillRect(textObj.x, textObj.y+(h/2), -w, -h);
							}else{
								context.fillRect(textObj.x, textObj.y+(h/2), w, h);
							}
							context.fillStyle=prev;
						}
						context.fillText(textObj.text, textObj.x, textObj.y);
					}
				},
				/**
				 * Render the plotter. All of the stored operations are sent to the canvas. This operation stores and restores
				 * global canvas parameters such as fillStyle, strokeStyle and globalAlpha.
				 * @param  {object} context A valid HTML canvas context
				 * @param  {string} [name]    Optionally render only a specific series. If null or not provided then all series will be rendered.
				 * @memberOf  STX.Plotter
				 */
				draw: function(context, name){
					var prevWidth=context.lineWidth;
					var prevFillStyle=context.fillStyle;
					var prevStrokeStyle=context.strokeStyle;
					var prevGlobalAlpha=context.globalAlpha;
					for(var i=0;i<this.seriesArray.length;i++){
						var series=this.seriesArray[i];
						if(name && series.name!=name) continue;
						context.beginPath();
						context.lineWidth=series.width;
						context.globalAlpha=series.opacity;
						context.fillStyle=series.color;
						context.strokeStyle=series.color;
						for(var j=0;j<series.moves.length;j++){
							var move=series.moves[j];
							if(move.action=="quadraticCurveTo"){
								(context[move.action])(move.x0, move.y0, move.x, move.y);
							}else if(move.action=="dashedLineTo"){
								(context[move.action])(series.moves[j-1].x, series.moves[j-1].y, move.x, move.y, move.pattern);
							}else{
								(context[move.action])(move.x, move.y);
							}
						}
						if(series.strokeOrFill=="fill"){
							context.fill();
						}else{
							context.stroke();
						}
						context.closePath();
						this.drawText(context, series);
						context.lineWidth=1;
					}
					context.lineWidth=prevWidth;
					context.fillStyle=prevFillStyle;
					context.strokeStyle=prevStrokeStyle;
					context.globalAlpha=prevGlobalAlpha;
				}
		};

		/**
		 * Microsoft RT disallows innerHTML that contains DOM elements. Use this method to override when necessary.
		 * @param  {object} node A valid DOM element to change innerHTML
		 * @param  {string} html The html text to change
		 * @example
		 * STX.innerHTML(node, "My innerHTML contains <span>a span</span> and MS RT doesn't like that");
		 * @memberOf  STX
		 */
		STX.innerHTML=function(node, html){
			if(window.MSApp){
				MSApp.execUnsafeLocalFunction(function (){
					node.innerHTML=html;
				});
			}else{
				node.innerHTML=html;
			}
		};

		/**
		 * Dynamically load UI elements from an external HTML file. This is accomplished by rendering raw HTML in an iframe
		 * and then cloning all of the newly created DOM elements into our main document. The iframe is then removed.
		 *
		 * The title of the iframe is checked. External content should *not* have a title. By convention, 404 or 500 errors
		 * have a title and so we use this to determine whether the iframe contains valid content or not.
		 *
		 * @param  {string}   url The external url to fetch new UI content
		 * @param  {Function} cb  A callback function to call when the new UI is available
		 * @memberOf  STX
		 */
		STX.loadUI=function(url, cb){
			var i=document.createElement("iframe");
			i.src=url+"?" + STX.uniqueID();
			i.hidden=true;
			i.addEventListener("load",(function(i){
				return function(){
					var iframeDocument=null;
					try{
						iframeDocument = i.contentDocument || i.contentWindow.document;
					}catch(error){
						console.log(error);
						cb(error);
					}
					if(iframeDocument && !iframeDocument.title){
						var html=iframeDocument.body.innerHTML;
						document.body.removeChild(i);
						var div=document.createElement("div");
						STX.innerHTML(div, html);
						for(var j=0;j<div.children.length;j++){
							var ch=div.children[j].cloneNode(true);
							document.body.appendChild(ch);
						}
						cb();
					}
				};
			})(i),false);
			document.body.appendChild(i);
		};


		/**
		 * The built-in 2D rendering context for the drawing surface of a {@link external:canvas}.
		 * @external CanvasRenderingContext2D
		 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D CanvasRenderingContext2D at the Mozilla Developer Network}
		 */

		/**
		 * Dashed line polyfill for the canvas. Note that dashed lines are expensive operations when not supported natively! @see CanvasRenderingContext2D.stxLine
		 * @memberOf external:CanvasRenderingContext2D
		 */
		CanvasRenderingContext2D.prototype.dashedLineTo = function (fromX, fromY, toX, toY, pattern) {
			  // Our growth rate for our line can be one of the following:
			  // (+,+), (+,-), (-,+), (-,-)
			  // Because of this, our algorithm needs to understand if the x-coord and
			  // y-coord should be getting smaller or larger and properly cap the
				// values
			  // based on (x,y).
			  var lt = function (a, b) { return a-b <= 0.00000001; };
			  var gt = function (a, b) { return a-b >= -0.00000001; };
			  var capmin = function (a, b) { return Math.min(a, b); };
			  var capmax = function (a, b) { return Math.max(a, b); };

			  var checkX = { thereYet: gt, cap: capmin };
			  var checkY = { thereYet: gt, cap: capmin };

			  if (fromY - toY > 0) {
			    checkY.thereYet = lt;
			    checkY.cap = capmax;
			  }
			  if (fromX - toX > 0) {
			    checkX.thereYet = lt;
			    checkX.cap = capmax;
			  }

			  this.moveTo(fromX, fromY);
			  if(isNaN(fromX) || isNaN(fromY)) return;
			  var offsetX = fromX;
			  var offsetY = fromY;
			  var idx = 0, dash = true;
			  while (!(checkX.thereYet(offsetX, toX) && checkY.thereYet(offsetY, toY))) {
			    var ang = Math.atan2(toY - fromY, toX - fromX);
			    var len = pattern[idx];

			    offsetX = checkX.cap(toX, offsetX + (Math.cos(ang) * len));
			    offsetY = checkY.cap(toY, offsetY + (Math.sin(ang) * len));

			    if (dash) this.lineTo(offsetX, offsetY);
			    else this.moveTo(offsetX, offsetY);

			    idx = (idx + 1) % pattern.length;
			    dash = !dash;
			  }
			};

		/**
		 * Convenience function for rendering lines of various types on the canvas. Pattern should be an array that contains
		 * the number of pixels on and then the number of pixels off. For instance [1,1] would create a dotted pattern by turning
		 * one pixel on and then one pixel off repeatedly.
		 * @memberOf external:CanvasRenderingContext2D
		 */
		CanvasRenderingContext2D.prototype.stxLine = function (fromX, fromY, toX, toY, color, opacity, lineWidth, pattern) {
			this.beginPath();
			this.lineWidth=lineWidth;
			this.strokeStyle=color;
			this.globalAlpha=opacity;
			if(pattern){
				this.dashedLineTo(fromX, fromY, toX, toY, pattern);
			}else{
				this.moveTo(fromX, fromY);
				this.lineTo(toX, toY);
			}
			this.stroke();
			this.closePath();
			this.lineWidth=1;
		};

		/**
		 * Add native circle drawing to the canvas
		 * @param  {number} x      X position of center of circle
		 * @param  {number} y      Y position of center of circle
		 * @param  {number} radius Radius of circle
		 * @param  {boolean} filled If true then circle will be filled
		 * @memberOf external:CanvasRenderingContext2D
		 */
		CanvasRenderingContext2D.prototype.stxCircle = function(x, y,radius, filled){
			this.beginPath();
			this.arc(x, y, radius, 0, 2* Math.PI, false);
			if(filled) this.fill();
			this.stroke();
			this.closePath();
		};

		/**
		 * Creates a box on the canvas with containing text (a label)
		 * @param  {number} x     Left position of label
		 * @param  {number} y     Top position of label
		 * @param  {string} text  Text to print in the label
		 * @param  {object} stx   Chart object
		 * @param  {string} style Class name from which style should be applied
		 * @memberOf  STX
		 */
		STX.textLabel = function (x, y, text, stx, style) {
			stx.canvasFont(style);
			//var m=stx.chart.context.measureText(text);
			var fontHeight=stx.getCanvasFontSize(style);
			var s=stx.canvasStyle(style);
			var context=stx.chart.context;
			var arr=text.split("\n");
			var maxWidth=0;
			var i;
			for(i=0;i<arr.length;i++){
				var m=stx.chart.context.measureText(arr[i]);
				if(m.width>maxWidth) maxWidth=m.width;
			}
			var height=arr.length*fontHeight;
			context.textBaseline="alphabetic";
			context.strokeStyle=s["border-left-color"];
			context.fillStyle=s["background-color"];
			context.beginPath();
			context.moveTo(x, y);
			context.lineTo(x+maxWidth+10, y);
			context.lineTo(x+maxWidth+10, y+height+2);
			context.lineTo(x, y+height+2);
			context.lineTo(x, y);
			context.stroke();
			context.fill();
			context.closePath();
			context.strokeStyle=s.color;
			context.fillStyle=s.color;
			context.textBaseline="top";
			var y1=0;
			for(i in arr){
				context.fillText(arr[i], x+5, y+y1+1);
				y1+=fontHeight;
			}
		};

		/**
		 * Microsoft surface bug requires a timeout in oreder for the cursor to show up in a focused
		 * text box. iPad also, sometimes, when embedded in an iframe, so set useTimeout if in an iframe!
		 * @param  {object} node       A DOM element to focus
		 * @param  {number} useTimeout Whether to apply a timeout or not. If number then the number of milliseconds.
		 * @memberOf  STX
		 */
		STX.focus = function (node, useTimeout){
			if(STX.isSurface || useTimeout){
				var timeout=0;
				if(!isNaN(parseInt(useTimeout,10))) timeout=useTimeout;
				setTimeout(function(){node.focus();}, timeout);
			}else{
				node.focus();
			}
		};

		/**
		 * Reliable, cross-device blur method
		 * @param  {HTMLElement} [node] The element to blur. If not supplied then document.activeElement will be blurred
		 */
		STX.blur = function(node){
			if(!node) node=document.activeElement;
			if(node) node.blur();
			window.focus();
		};
		/**
		 * Find all nodes that match the given text. This is a recursive function so be careful not to start too high in the DOM tree.
		 * @param  {object} startNode A valid DOM element from which to start looking
		 * @param  {string} text      The text to search for
		 * @return {array}           An array of nodes that match the text
		 * @memberOf  STX
		 */
		STX.findNodesByText = function(startNode, text){
			if(startNode.innerHTML==text) return [startNode];
			var nodes=[];
			for(var i=0;i<startNode.childNodes.length;i++){
				var pushNodes=STX.findNodesByText(startNode.childNodes[i], text);
				if(pushNodes){
					nodes=nodes.concat(pushNodes);
				}
			}
			if(nodes.length) return nodes;
			return null;
		};

		/**
		 * Hide nodes that match a certain text string.
		 * @param  {object} startNode A valid DOM element from which to start looking
		 * @param  {string} text      The text to match against
		 * {@link  STX.findNodesByText}
		 * @memberOf  STX
		 */
		STX.hideByText = function(startNode, text){
			var nodes=STX.findNodesByText(startNode, text);
			for(var i=0;i<nodes.length;i++){
				nodes[i].style.display="none";
			}
		};

		/**
		 * Get the X intersection point between two lines
		 * @memberOf  STX
		 */
		STX.intersectLineLineX = function(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2) {

		    var ua_t = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
		    var u_b  = (by2 - by1) * (ax2 - ax1) - (bx2 - bx1) * (ay2 - ay1);

		    var ua = ua_t / u_b;

		    return ax1 + ua * (ax2 - ax1);
		};

		/**
		 * Get the Y intersection point between two lines
		 * @memberOf  STX
		 */
		STX.intersectLineLineY = function(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2) {

		    var ua_t = (bx2 - bx1) * (ay1 - by1) - (by2 - by1) * (ax1 - bx1);
		    var u_b  = (by2 - by1) * (ax2 - ax1) - (bx2 - bx1) * (ay2 - ay1);

		    var ua = ua_t / u_b;

		    return ay1 + ua * (ay2 - ay1);
		};

		/**
		 * Returns the width of a DOM element including left and right margins.
		 * @param  {HTMLElement} node The DOM element to measure
		 * @return {number}      The width including margins
		 */
		STX.outerWidth=function(node){
			var width=node.offsetWidth;
			width+=STX.stripPX(getComputedStyle(node).marginLeft);
			width+=STX.stripPX(getComputedStyle(node).marginRight);
			return width;
		};

		/**
		 * Sets the transparent parts of the canvas to the specified background color. Used to ensure a background when turning charts into images
		 * because normally the background is the background of the DIV container and not the canvas itself.
		 * @param  {object} context An HTML canvas context
		 * @param  {string} color   The color to set the background. Any valid HTML canvas color.
		 * @param  {number} width   Width to apply color (Could be less than size of canvas)
		 * @param  {number} height  Height to apply color (Could be less than size of canvas if applying branding for instance)
		 * @memberOf  STX
		 */
		STX.fillTransparentCanvas = function(context, color, width, height){
			var compositeOperation = context.globalCompositeOperation;
			context.globalCompositeOperation = "destination-over";
			context.fillStyle = color;
			context.fillRect(0,0,width,height);
			context.globalCompositeOperation = compositeOperation;
		};

		/**
		 * Creates a string with a periodicity that is easy to read given a chart
		 * @param  {object} stx A chart object
		 * @return {string}     A periodicity value that can be displayed to an end user
		 * @memberOf  STX
		 */
		STX.readablePeriodicity=function(stx){
			var displayPeriodicity=stx.layout.periodicity;
			var displayInterval=stx.layout.interval;
			if(!stx.isDailyInterval(displayInterval)){
				if(stx.layout.interval!="minute"){
					displayPeriodicity=stx.layout.interval*stx.layout.periodicity;
				}
				displayInterval="min";
			}
			if(displayPeriodicity%60===0){
				displayPeriodicity/=60;
				displayInterval="hour";
			}
			return displayPeriodicity + " " + stx.translateIf(displayInterval.capitalize());
		};

		/**
		 * @callback STX.postAjax~requestCallback
		 * @param {number} status HTTP status
		 * @param {string} response HTTP response
		 */
		/**
		 * Convenience function for making an ajax post. If payload is non-null then the method will be set to POST, otherwise GET. Cross origin
		 * ajax is support on IE9.
		 * @param {object} params Parameters for the post
		 * @param  {string}   params.url         The url to send the ajax query to
		 * @param  {string}   [params.payload]     An optional payload to send
		 * @param  {STX.postAjax~requestCallback} params.cb          Callback function when complete
		 * @param  {string}   [params.contentType] Optionally override the content type
		 * @param  {boolean}   [params.noEpoch]     By default the epoch is appended as a query string to bust caching. Set this to false to not append the epoch.
		 * @param {array} [params.headers] Optional additional HTTP headers to send
		 * @memberOf  STX
		 */
		STX.postAjax=function(params, payload, cb, contentType, noEpoch, asynchronous){
			if(typeof params=="string"){
				params={
					url: params,
					payload: payload,
					cb: cb,
					contentType: contentType,
					noEpoch: noEpoch,
					asynchronous: asynchronous,
					method: null,
					responseHeaders: false
				};
			}
			function parseHeaders(server){
				//Optional code for processing headers. Doesn't work for IE9
				var headers={};
				if(!params.responseHeaders) return;
				var headerString=server.getAllResponseHeaders();
				var headerArray=headerString.split("\n");
				for(var i=0;i<headerArray.length;i++){
					var split=headerArray[i].split(":");
					while(split[1] && split[1].charAt(0)==' ') split[1]=split[1].substring(1);
					if(split[0]!=="") {
						headers[split.shift()]=split.join(":");
					}
				}
				return headers;
			}
			if(params.asynchronous===null || typeof(params.asynchronous)=="undefined") params.asynchronous=true;
			var server=STX.getAjaxServer(params.url);
			if(!server) return false;
			var epoch=new Date();
			if(!params.noEpoch){
				if(params.url.indexOf('?')==-1) params.url+="?" + epoch.getTime();
				else params.url+="&" + epoch.getTime();
			}
			var method=params.method;
			if(!method) method=params.payload?"POST":"GET";
			if((!STX.isIE9 && !STX.isIE8) || server.constructor==XMLHttpRequest){
				server.open(method, params.url, params.asynchronous);
				if(!params.contentType) params.contentType='application/x-www-form-urlencoded';
				if(params.payload) server.setRequestHeader('Content-Type', params.contentType);
				if(params.headers){
					for(var header in params.headers){
						server.setRequestHeader(header, params.headers[header]);
					}
				}
			}else{
				params.url=params.url.replace("https:",window.location.protocol);
				server.open(method, params.url, params.asynchronous);
				server.onload=function(){
					params.cb(200, server.responseText, parseHeaders(server));
				};
				server.onerror=function(){
					params.cb(0, null, {});
				};
				server.onprogress=function(){};
			}
			server.onreadystatechange=function(){
				if(server.readyState==4){
					/*if(server.status==404){
						params.cb(server.status, null, parseHeaders(server));
					}else */if(server.status!=200){
						params.cb(server.status, server.responseText, parseHeaders(server));
					}else{
						params.cb(200, server.responseText, parseHeaders(server));
					}
				}
			};
			try{
				server.send(params.payload);
			}catch(e){
				params.cb(0, e, {});
			}
			return true;
		};

		/**
		 * Returns the log base 10 of a value
		 * @param  {number} y The value
		 * @return {number}   log10 value
		 * @memberOf  STX
		 */
		STX.log10=function(y){
			return Math.log(y)/Math.LN10;
		};

		// getComputedStyle polyfill for older browsers such as IE8
		if (!window.getComputedStyle) {
			window.getComputedStyle = function(el, pseudo) {
				var style = {};
				for(var prop in el.currentStyle){
					if(typeof el.currentStyle[prop] =="undefined") {
						continue;
					}
					if(prop =="outline" || prop =="outlineWidth") {
						// in ie8 these are not undefined but rather contain 'unspecified error' as their values. So we wil skip them.
						continue;
					}
					style[prop]=el.currentStyle[prop];
				}
				style.getPropertyValue = function(prop) {
					var re = /(\-([a-z]){1})/g;
					if (prop == 'float') prop = 'styleFloat';
					if (re.test(prop)) {
						prop = prop.replace(re, function () {
							return arguments[2].toUpperCase();
						});
					}
					return this[prop] ? this[prop] : null;
				};
				return style;
			};
		}

		// Array.indexOf polyfill
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(obj, start) {
			    for (var i = (start || 0), j = this.length; i < j; i++) {
			        if (this[i] === obj) { return i; }
			    }
			    return -1;
			};
		}

		/**
		 * Convenience function for dynamically creating a new node and appending it into the DOM.
		 * @param  {object} div       The targeted parent node
		 * @param  {string} tagName   The type of node to be created
		 * @param  {string} [className] Optional class name to set the new node
		 * @param {string} [txt] Optional text to insert
		 * @return {object}           The new node
		 * @memberOf  STX
		 */
		STX.newChild=function(div, tagName, className, txt){
			var div2=document.createElement(tagName);
			if(className) div2.className=className;
			div.appendChild(div2);
			if(txt) div2.innerHTML=txt;
			return div2;
		};

		STX.androidDoubleTouch=null;

		/**
		 * Sets click or touch events depending on the device
		 * @deprecated  Use STX.safeClickTouch instead
		 */
		STX.clickTouch=function(div, fc){
			// Annoyingly, Android default browser sometimes registers onClick events twice, so we ignore any that occur
			// within a half second
			function closure(div, fc){
				return function(e){
					if(!STX.androidDoubleTouch){
						STX.androidDoubleTouch=new Date().getTime();
					}else{
						if(new Date().getTime()-STX.androidDoubleTouch<500) return;
						STX.androidDoubleTouch=new Date().getTime();
					}
					(fc)(e);
				};
			}
			if(STX.ipad || STX.iphone){
				div.ontouchend=fc;
			}else{
				if(STX.isAndroid){
					div.onclick=closure(div, fc);
				}else{
					div.onclick=fc;
				}
			}
		};

		/**
		 * Converts an object to emit "stxtap" events. This uses {@link STX#safeClickTouch}. You should use addEventListener("tap") to receive the events.
		 * @param {HTMLElement} div The element to convert
		 * @param {Object} [params] Optional parameters to pass to {@link STX#safeClickTouch}
		 * @param {Boolean} [params.stopPropagation=false] If set to true then propagation will be stopped
		 * @since  04-2015
		 */
		STX.installTapEvent=function(div, params){
			var fc=function(e){
				var ev = document.createEvent('Event');
				ev.initEvent("stxtap", true, true);
				if(typeof e.pageX=="undefined"){
					e.pageX=e.clientX;
					e.pageY=e.clientY;
				}
				ev.pageX = e.pageX;
				ev.pageY = e.pageY;
				e.target.dispatchEvent(ev);
				if(params && params.stopPropagation) e.stopPropagation();
			};
			STX.safeClickTouch(div, fc, params);
		};
		/**
		 * Use this instead of onclick or ontouch events. This function will automatically use the quickest available
		 * but also protect against being called twice.
		 * By default any previous safeClickTouch listeners will be cleared (to allow re-use of the element).
		 * @param {object} div The DOM element to attach an event
		 * @param {Function} fc The function to call when the object is pressed
		 * @param {object} params Parameters to drive behavior.
		 * @param {object} [params.safety] An optional object, generated from a STX.safeDrag association to prevent the click from being triggered when a drag operation is released
		 * @param {boolean} [params.allowMultiple=false] If set then multiple click events can be associated with the node
		 * @param {boolean} [params.preventUnderlayClick=true] By default prevents an underlaying element from being "clicked" on a touch device 400ms after the overlay was tapped. Set to false for input fields, or any div containing input fields (body)
		 * @param {boolean} [params.absorbDownEvent=true] Ensures that a mousedown, pointerdown, touchstart event doesn't get passed to the parent.
		 * @memberOf  STX
		 * @since 11/01/2015 Removed timers in favor of a new algorithm. This algorithm allows only the first event to fire from a UI interaction to execute the fc function.
		 */
		STX.safeClickTouch=function(div, fc, params){
			if(!params) params={};

			if(!params.allowMultiple) STX.clearSafeClickTouches(div);
			if(params.preventUnderlayClick!==false) params.preventUnderlayClick=true;
			if(params.absorbDownEvent!==false) params.absorbDownEvent=true;
			params.allowAnotherDevice=0;
			params.registeredClick=false;
			function closure(which, params){
				return function(e){
					if(!STX.safeClickTouchEvent){
						if(!e.target.stxPressed) return;  // is this up/end event related to a down/start event?
						else if(e.target.stxPressed.time+1000<new Date().getTime())  //allow no more than 1 second for click
							return;
						e.target.stxPressed=null;
					}
					if(params.safety && params.safety.recentlyDragged) return;
					if(!e) e=event;
					if((e.which && e.which>=2) || (e.button && e.button>=2)) return; // ignore right clicks
					if(params.preventUnderlayClick){
						e.preventDefault();
					}else{ // prevent touch and mouse from being clicked when we can't use preventDefault
						if(params.lastType!=which && Date.now()<params.allowAnotherDevice) return;
						params.lastType=which;
						params.allowAnotherDevice=Date.now()+1000; // 1 Second then not a coat tail mouse click
					}
					(fc)(e);
				};
			}
			function isClick(down){
				return function(e){
					if(down) e.target.stxPressed={
							time:new Date().getTime(),
							x:e.clientX,
							y:e.clientY
					};
					else if(e.target.stxPressed){
						//allow no more than 4 pixel distance movement
						if((Math.pow(e.target.stxPressed.x-e.clientX,2)+Math.pow(e.target.stxPressed.y-e.clientY,2))>16)
							e.target.stxPressed=null;
					}
				};
			}
			if(!div.safeClickTouchEvents) div.safeClickTouchEvents=[];
			var fc1=closure("mouseup", params);
			var fc2=closure("touchend", params);
			var fc3=closure("pointerup", params);
			var f=function(e){ e.stopPropagation(); };
			var eventHolder={};
			if(STX.safeClickTouchEvent){ // global override for which event to use, for instance if you want to force use of "click" or "tap"
				var fc4=closure(STX.safeClickTouchEvent, params);
				div.addEventListener(STX.safeClickTouchEvent, fc4);
				eventHolder[STX.safeClickTouchEvent]=fc4;
				div.safeClickTouchEvents.push(eventHolder);
			}else if("onpointerup" in document){
				// Internet Explorer can always use pointerup safely
				div.addEventListener("pointerdown", isClick(true));
				div.addEventListener("pointermove", isClick());
				div.addEventListener("pointerup", fc3);
				eventHolder.pointerup=fc3;
				if(params.absorbDownEvent){
					div.addEventListener("pointerdown", f);
					eventHolder.pointerdown=f;
				}
				div.safeClickTouchEvents.push(eventHolder);
			}else{
				// all in one computers can support both of these under Chrome/FF!
				div.addEventListener("mousedown", isClick(true));
				div.addEventListener("mousemove", isClick());
				div.addEventListener("touchstart", isClick(true));
				div.addEventListener("touchmove", isClick());
				div.addEventListener("mouseup", fc1);
				div.addEventListener("touchend", fc2);
				eventHolder.mouseup=fc1;
				eventHolder.touchend=fc2;
				if(params.absorbDownEvent){
					div.addEventListener("mousedown", f);
					eventHolder.mousedown=f;
					div.addEventListener("touchstart", f);
					eventHolder.touchstart=f;
				}
				div.safeClickTouchEvents.push(eventHolder);
			}
		};

		/**
		 * Clears all safeClickTouch events from a DOM element.
		 * @param  {object} div The DOM element to clear events
		 * @memberOf  STX
		 */
		STX.clearSafeClickTouches=function(div){
			if(!div.safeClickTouchEvents) return;
			for(var i=0;i<div.safeClickTouchEvents.length;i++){
				var fc=div.safeClickTouchEvents[i];
				for(var e in fc){
					var f=fc[e];
					div.removeEventListener(e, f);
				}
			}
			div.safeClickTouchEvents=null;
		};

		/**
		 * Safe function to handle dragging of objects on the screen. This method is cross-device aware and can handle mouse or touch drags.
		 * This method does not actually move the objects but provides callbacks that explain when drag operations
		 * begin and cease, and what movements are made during the drag. Callbacks should be used to move the actual objects
		 * (if it is desired to move objects during a drag operation). For convenience, displacementX and displacementY are added to callback events
		 * to indicate the distance from the original starting point of the drag.
		 * A "safety" object is returned which can optionally be passed into STX.safeClickTouch to prevent errant click events
		 * from being triggered when a user lets go of a drag
		 * @param  {object} div    The draggable DOM element
		 * @param  {function} [fcDown] Callback function when a drag operation begins. Receives an event object.
		 * @param  {function} [fcMove] Callback function when a drag move occurs. Receives an event object.
		 * @param  {function} [fcUp]   Callback function when the drag operation ends. Receives an event object.
		 * @return {object}        Safety object which can be passed to STX.safeClickTouch
		 * @memberOf  STX
		 */
		STX.safeDrag=function(div, fcDown, fcMove, fcUp){
			var resetMS=100;	// To avoid multiple down events only one can occur per 100ms
			var registeredClick=false;
			var startX=0, startY=0;
			var safety={
				recentlyDragged: false
			};
			function closure(moveEvent){
				var fmap={
					"mousedown": {"move":"mousemove", "up": "mouseup"},
					"pointerdown": {"move":"pointermove", "up": "pointerup"},
					"touchstart": {"move":"touchmove", "up": "touchend"}
				};
				function pageX(e){
					if(e.touches){
						if(e.touches.length>=1){
							return e.touches[0].pageX;
						}else if(e.changedTouches && e.changedTouches.length>=1){
							return e.changedTouches[0].pageX;
						}
					}
					if(typeof e.pageX=="undefined"){
						return e.clientX;
					}
					return e.pageX;
				}
				function pageY(e){
					if(e.touches){
						if(e.touches.length>=1){
							return e.touches[0].pageY;
						}else if(e.changedTouches && e.changedTouches.length>=1){
							return e.changedTouches[0].pageY;
						}
					}
					if(typeof e.pageY=="undefined"){
						return e.clientY;
					}
					return e.pageY;
				}
				return function(e){
					if(registeredClick) return;
					registeredClick=true;
					STXChart.ignoreTouch=true;
					var moveFC=function(e){
						if(e && e.preventDefault) e.preventDefault();
						safety.recentlyDragged=true;
						e.displacementX=pageX(e)-startX;
						e.displacementY=pageY(e)-startY;
						(fcMove)(e); // Call the move event
					};
					if(fcMove) document.body.addEventListener(fmap[moveEvent].move, moveFC);
					document.body.addEventListener(fmap[moveEvent].up, function(e){	// Create an up listener on the body
						STXChart.ignoreTouch=false;
						if(fcMove) document.body.removeEventListener(fmap[moveEvent].move, moveFC);	// Remove the move listener since our move is now complete
						document.body.removeEventListener(fmap[moveEvent].up, arguments.callee);	// Remove the up listener since our move is now complete
						e.displacementX=pageX(e)-startX;
						e.displacementY=pageY(e)-startY;
						if(fcUp) (fcUp)(e); // Call the up event
						setTimeout(function(safety){ return function(){safety.recentlyDragged=false;};}(safety), 50);	// Prevent errant clicks from touch letting go
					});
					setTimeout(function(){
						registeredClick=false;
					}, resetMS);
					startX=pageX(e); startY=pageY(e);
					if(fcDown) (fcDown)(e);
				};
			}
			div.addEventListener("mousedown", closure("mousedown"));
			div.addEventListener("pointerdown", closure("pointerdown"));
			div.addEventListener("touchstart", closure("touchstart"));
			return safety;
		};

		/**
		 * Closes the keyboard on a touch device by blurring any active input elements.
		 * @param {HTMLElement} newFocus optional element to change focus to
		 * @memberOf  STX
		 */
		STX.hideKeyboard=function(newFocus){
			var element=document.activeElement;
			if(element.tagName=="INPUT" || element.tagName=="TEXTAREA"){
				element.blur();
				window.focus();
				if(newFocus){
					if(newFocus===document.body || document.body.contains(newFocus)) newFocus.focus();
				}
			}
		};

		/**
		 * Loads JavaScript dynamically. This method keeps a static memory of scripts that have been loaded
		 * to prevent them from being loaded twice. The callback function however is always called, even if
		 * the script has already been loaded.
		 * @param  {string}   scriptName The url of the script to load
		 * @param  {Function} cb         Callback function to call when the script is loaded
		 * @memberOf  STX
		 */
		STX.loadScript=function(scriptName, cb){
			if(!STX.loadedScripts) STX.loadedScripts={};
			if(STX.loadedScripts[scriptName]){
				if(cb) cb();
				return;
			}
			var script=document.createElement("SCRIPT");
			script.async = true;
			script.onload=function(){
				STX.loadedScripts[scriptName]=true;
				if(cb) cb();
			};
			if(typeof isIE8!="undefined"){
				script.onreadystatechange=function(){
					if(script.readyState=="loaded"){
						STX.loadedScripts[scriptName]=true;
						if(cb){
							setTimeout(cb, 0);
						}
					}
				};
			}
			var uniqueName=scriptName;
			// Use the epoch to create a unique query string, which will force the browser to reload
			if(uniqueName.indexOf("?")==-1){
				uniqueName=uniqueName+"?" + Date.now();
			}else{
				uniqueName=uniqueName+"&" + Date.now();
			}
			script.src = uniqueName;
		    var s = document.getElementsByTagName('script')[0];
		    s.parentNode.insertBefore(script, s.nextSibling);
		};

		/**
		 * Loads a stylesheet.
		 * @param  {string}   stylesheet Name of stylesheet file.
		 * @param  {Function} cb     Function to call when the stylesheet is fully loaded
		 * @since 2016-03-11
		 * @memberOf  STX
		 */
		STX.loadStylesheet=function(widget, cb){
			var lnk=document.createElement("link");
			lnk.rel="stylesheet";
			lnk.type="text/css";
			lnk.media="screen";
			lnk.href=widget + "?" + Date.now();
			lnk.onload=function(){
				if(cb) cb();
			};
			var links=document.getElementsByTagName("link");
			var lastLink=links[links.length-1];
			lastLink.parentNode.insertBefore(lnk, lastLink.nextSibling);
		};

		/**
		 * Loads a feature function widget. Feature function widgets consist of a css file, a JS file and an HTML file. This can
		 * be used to dynamically load content and functionality.
		 * @param  {string}   widget Name of widget. The js, css and html files should be this name.
		 * @param  {Function} cb     Function to call when the widget is fully loaded
		 * @memberOf  STX
		 */
		STX.loadWidget=function(widget, cb){
			STX.loadStylesheet(widget+".css",function(){
				STX.loadUI(widget + ".html", function(err){
					if(err) cb(err);
					else STX.loadScript(widget+".js", cb);
				});
			});
		};
		/**
		 * This method will return an tuple [min,max] that contains the minimum
		 * and maximum values in the series where values are series[field]
		 * @param {Array} series The series
		 * @param {string} field The name of the field to look at
		 * @return {Array} Tuple containing min and max values in the series
		 * @memberOf  STX
		 */
		STX.minMax=function(series, field){
		    var min=Number.MAX_VALUE;
		    var max=Number.MAX_VALUE*-1;
		    for(var i=0;i<series.length;i++){
		    	var entry=series[i];
		    	if(!entry) continue;
		        var val=entry[field];
		        if(!val && val!==0) continue;
		        if(isNaN(val)) continue;
		        min=Math.min(min, val);
		        max=Math.max(max, val);
		    }
		    return [min,max];
		};

		/**
		 * This method will iterate through the object and replace all of the fields
		 * using the mapping object. This would generally be used to compress an object
		 * for serialization. so that for instance "lineWidth" becomes "lw". This method
		 * is called recursively.
		 * @param {object} obj Object to compress
		 * @param {object} mapping Object containing name value pairs. Each name will be replaced with its corresponding value in the object.
		 * @return {object} The newly compressed object
		 * @memberOf  STX
		 */
		STX.replaceFields=function(obj, mapping){
			if(!obj) return obj;
			var newObj={};
			for(var field in obj){
				var value=obj[field];
				var replaced=mapping[field];
				if(!replaced) replaced=field;
				if(value && typeof value=="object"){
					if(value.constructor==Array){
						var arr=newObj[replaced]=new Array(value.length);
						for(var i=0;i<arr.length;i++){
							var val=value[i];
							if(typeof val=="object"){
								arr[i]=STX.replaceFields(val, mapping);
							}else{
								arr[i]=val;
							}
						}
					}else{
						newObj[replaced]=STX.replaceFields(value, mapping);
					}
				}else{
					newObj[replaced]=value;
				}
			}
			return newObj;
		};

		/**
		 * Returns an object copy with any null values removed
		 * @param  {object} obj Object to remove nulls
		 * @return {object}     Object with nulls removed
		 */
		STX.removeNullValues=function(obj){
			var n=STX.clone(obj);
			for(var f in n){
				if(!n[f]) delete n[f];
			}
			return n;
		};

		/**
		 * This method reverses the fields and values in an object
		 * @memberOf  STX
		 */
		STX.reverseObject=function(obj){
			var newObj={};
			for(var field in obj){
				newObj[obj[field]]=field;
			}
			return newObj;
		};

		/**
		 * Captures enter key events. Also clears the input box on escape key.
		 * @param {object} node The DOM element to attach the event to. Should be a text input box.
		 * @param {Function} cb Callback function when enter key is pressed.
		 * @memberOf  STX
		 */

		STX.inputKeyEvents=function(node, cb){
		    node.addEventListener("keyup", function(e){
			    var key = (window.event) ? event.keyCode : e.keyCode;
			    switch(key){
				    case 13:
					    cb();
					    break;
		            case 27:
		                node.value="";
		                break;
				    default:
					    break;
			    }
		    }, false);
		};

		/**
		 * Draws an item in the legend and returns the position for the next item
		 * @param {STXChart} stx The chart object
		 * @param  {array} xy    An X,Y tuple (from chart.legend)
		 * @param  {string} label The text to print in the item
		 * @param  {string} color The color for the background of the item
		 * @return {array}       A tuple containing the X,Y position for the next the item
		 * @memberOf STX
		 */
		STX.drawLegendItem=function(stx, xy, label, color, opacity){
			if(!opacity) opacity=1;
			var x=xy[0], y=xy[1], w=10, h=10;
			var context=stx.chart.context;
			context.globalAlpha=opacity;
			context.fillStyle=color;
			context.fillRect(x, y, w, h);
			context.globalAlpha=1;
			x+=w+2;	// 2 px spacing between box and text
			context.fillStyle=stx.defaultColor;
			context.fillText(label, x, y);
			x+=context.measureText(label).width + 6; // 6 px spacing between labels
			return [x, y];
		};


		/**
		 * Draws a legend for the series that are displayed on the chart.
		 * @param {STXChart} stx The chart object to draw
		 * @param  {object} params parameters for drawing the legend
		 * @param  {STXChart.Chart} [params.chart] The chart object
		 * @param  {object} [params.legendColorMap] A map of series names to colors and display symbols ( example  IBM:{color:'red', display:'Int B M'} )
		 * @param  {object} [params.coordinates] Coordinates upon which to draw the items, in pixels relative to top left of panel ( example  {x:50, y:0} ).  If null, uses chart.legend
		 * @param  {boolean} [params.noBase] Set to true to not draw the base (the chart symbol's color) in the legend
		 * @memberOf STX
		 */
		STX.drawLegend=function(stx, params){
			var coordinates=params.coordinates;
			var context=stx.chart.context;
			context.textBaseline="top";
			var rememberFont=context.font;
			stx.canvasFont("stx-legend",context);

			if(!coordinates) coordinates=params.chart.legend;
			var xy=[coordinates.x, coordinates.y];
			var lineColor=stx.defaultColor;

			var chartType=stx.layout.chartType;
			if(stx.chart.customChart && stx.chart.customChart.chartType){
				chartType=stx.chart.customChart.chartType;
			}

			if(!params.noBase){
				// baseLegendColors will contain the colors used in the chart itself. For instance the color of the line
				// chart, or red,green for a candle. We'll print a little rainbow as such.
				var c;
				if(stx.chart.baseLegendColors instanceof Array){
					var colors=stx.chart.baseLegendColors;
					if(colors.length>1){
						var grd=context.createLinearGradient(xy[0],xy[1],xy[0]+10,xy[1]);
						for(c=0;c<colors.length;c++){
							grd.addColorStop(c/(colors.length-1),colors[c]);
						}
						lineColor=grd;
					}else if(colors.length>0){
						lineColor=colors[0];
					}else{
						lineColor=stx.getCanvasColor("stx_line_chart");
					}
				}else if(chartType=="mountain"){
					c=stx.canvasStyle("stx_mountain_chart");
					var strokeStyle=c.borderTopColor;
					if(strokeStyle && strokeStyle!="transparent")
						lineColor=strokeStyle;
				}else{
					lineColor=null;
				}
				if(lineColor) {
					if(params.chart.symbolDisplay){
						symbol = params.chart.symbolDisplay;
					}else{
						symbol=params.chart.symbol;
					}
					xy=STX.drawLegendItem(stx, xy, symbol, lineColor);
				}
			}
			for(var field in params.legendColorMap){
				var display = field;
				if (params.legendColorMap[field].display) display = params.legendColorMap[field].display;
				xy=STX.drawLegendItem(stx, xy, display, params.legendColorMap[field].color, params.legendColorMap[field].opacity);
			}
			context.font=rememberFont;
		};


		/**
		 * Namespace for Internationalization API
		 * @namespace
		 * @name STX.I18N
		 */
		STX.I18N=function(){};

		// Hack code to make a multi line string easy cut & paste from a spreadsheet
		STX.I18N.hereDoc=function(f){
			return f.toString().replace(/^[^\/]+\/\*!?/,'').replace(/\*\/[^\/]+$/,'');
		};

		/**
		 * Must be set to the desired lanuage. Defaults to english "en"
		 * @memberOf  STX.I18N
		 * @type {string}
		 */
		STX.I18N.language="en";

		/**
		 * Sets the languages that that don't support shortening
		 * Translation will print entire month from locale for these languages
		 * @memberOf  STX.I18N
		 * @type {Object}
		 */
		STX.I18N.longMonths={"zh":true,"ja":true};

		/** Returns a word list containing unique words. Each word references an array of DOM
		 *  nodes that contain that word. This can then be used for translation.
		 *  Text nodes and placeholders which are found in the document tree will be wrapped by this function
		 *  within a <translate> tag for easy translation back and forth.
		 * @param  {HTMLElement} [root] Optional root for the TreeWalker.  If omitted, document.body assumed.
		 * @return {object}      A word list containing unique words.
		 *  @memberOf  STX.I18N
		 */
		STX.I18N.findAllTextNodes=function(root){
			if(!root) root=document.body;
		    // Get all the words from the placeholders
		    // We'll create text nodes for them and stash them in a hidden div so we can access them in the future
			if(root==document.body){
				if(!$$("stashedTextNodes")){
					stashedTextNodes=document.createElement("div");
					stashedTextNodes.id="stashedTextNodes";
					stashedTextNodes.style.display="none";
					document.body.appendChild(stashedTextNodes);
	
					var fields=document.querySelectorAll("input,textarea,.editable_content");
					for(var f=0;f<fields.length;f++){
						var placeHolder=fields[f].getAttribute("placeholder");
						if(placeHolder){
		        			var wrapper=stashedTextNodes.appendChild(document.createElement("translate"));
		        			wrapper.setAttribute("original",placeHolder);
		        			wrapper.placeholderFor=fields[f];
		        			wrapper.appendChild(document.createTextNode(placeHolder));
						}
					}
				}
			}

			var walker = document.createTreeWalker(
		        root,
		        NodeFilter.SHOW_TEXT,
		        null,
		        false
		    );

		    var node = walker.nextNode();
			var ws=new RegExp("^\\s*$");
			var wordList={};

		    while(node) {
		        if(!ws.test(node.nodeValue)){
		        	if(node.parentNode.tagName!="SCRIPT"){
			        	var key=node.nodeValue;
		        		if(node.parentNode.tagName!="TRANSLATE"){
		        			var wrapper2=node.parentNode.insertBefore(document.createElement("translate"),node);
		        			wrapper2.setAttribute("original",key);  //must do getAttribute so it will clone
		        			wrapper2.appendChild(node);
		        		}else{
		        			key=node.parentNode.getAttribute("original");
		        		}
			        	if(!wordList[key]) wordList[key]=[];
						wordList[key].push(node);
		        	}
				}
		        node = walker.nextNode();
		    }
		    if(root==document.body){
			    // For missing word list collation only:
			    // Get all the words from the study library that are used to populate the study dialogs.
			    // These will have an empty array since they aren't associated with any nodes
			    if(STX.Studies.studyLibrary){
			    	for(var study in STX.Studies.studyLibrary){
			        	if(wordList[study]===null) wordList[study]=[];
			        	var s=STX.Studies.studyLibrary[study];
			        	if(s.inputs){
			        		for(var input in s.inputs){
			                	if(!wordList[input]) wordList[input]=[];
			        		}
			        	}
			        	if(s.outputs){
			        		for(var output in s.outputs){
			                	if(!wordList[output]) wordList[output]=[];
			        		}
			        	}
			    	}
			    }
		    }
			return wordList;
		};

		/**
		 * STX.I18N.missingWordList will scan the UI by walking all the text elements. It will determine which
		 * text elements have not been translated for the given language and return those as a JSON object.
		 * @param {string} [language] The language to search for missing words. Defaults to whatever language STX.I18N.language has set.
		 * @memberOf  STX.I18N
		 */
		STX.I18N.missingWordList=function(language){
			if(!language) language=STX.I18N.language;
			var wordsInUI=STX.I18N.findAllTextNodes();
			var missingWords={};
			var languageWordList=STX.I18N.wordLists[language];
			if(!languageWordList) languageWordList={};
			for(var word in wordsInUI){
				if(typeof languageWordList[word]=="undefined"){
					missingWords[word]="";
				}
			}
			return missingWords;
		};

		/**
		 * A convenient function for creating a human readable JSON object suitable for delivery to a translator.
		 * @param {string} [language] Optional language. Defaults to STX.I18N.language.
		 * @memberOf  STX.I18N
		 */
		STX.I18N.printableMissingWordList=function(language){
			var missingWords=JSON.stringify(STX.I18N.missingWordList(language));
			missingWords=missingWords.replace(/\",\"/g, '",\n"');
			return missingWords;
		};

		/**
		 * Passes through the UI (DOM elements) and translates all of the text for the given language.
		 * @param {string} [language] Optional language. Defaults to STX.I18N.language.
		 * @param  {HTMLElement} [root] Optional root for the TreeWalker.  If omitted, document.body assumed.
		 * @memberOf  STX.I18N
		 */
		STX.I18N.translateUI=function(language, root){
			if(!STX.I18N.wordLists) return;
			if(!language) language=STX.I18N.language;
			var wordsInUI=STX.I18N.findAllTextNodes(root);
			var languageWordList=STX.I18N.wordLists[language];
			if(!languageWordList) return;
			for(var word in wordsInUI){
				var translation=languageWordList[word];
				var nodes=wordsInUI[word];
				for(var i=0;i<nodes.length;i++){
					var elemWithPlaceholder=nodes[i].parentNode.placeholderFor;
					if(elemWithPlaceholder){
						if(!translation) elemWithPlaceholder.placeholder=nodes[i].parentNode.getAttribute("original");
						else elemWithPlaceholder.placeholder=translation;
					}else{
						if(!translation) nodes[i].data=nodes[i].parentNode.getAttribute("original");
						else nodes[i].data=translation;
					}
				}
			}
		};

		/**
		 * Translates an individual word for a given language. Set stxx.translationCallback to this function
		 * in order to automatically translate all textual elements on the chart itself.
		 * @param {string} word The word to translate
		 * @param {string} [language] Optional language. Defaults to STX.I18N.language.
		 * @memberOf  STX.I18N
		 */
		STX.I18N.translate=function(word, language){
			if(!language) language=STX.I18N.language;
			var languageWordList=STX.I18N.wordLists[language];
			var translation=null;
			if(languageWordList) translation=languageWordList[word];
			return translation ? translation : word;
		};

		/**
		 * Converts a CSV array of translations into the required JSON format. You can output this to the console and paste back in if desired.
		 * Assumes that the header row of the CSV is the language codes and that the first column is the key language (English). Assumes non-quoted words.
		 * @param {array} [csv] Optional Translation spreadsheet in csv format. Make sure no leading tabs, trailing commas or spaces. Default is STX.I18N.csv
		 * @memberOf STX.I18N
		 */
		STX.I18N.convertCSV=function(csv){
			if(!csv) csv=STX.I18N.csv;
			var lines=csv.split("\n");
			var headerRow=lines[0];
			var languages=headerRow.split(",");
			for(var j=0;j<languages.length;j++){
				var lang=languages[j];
				if(!STX.I18N.wordLists[lang]){
					STX.I18N.wordLists[lang]={};
				}
			}
			for(var i=1;i<lines.length;i++){
				var words=lines[i].split(",");
				var key=words[0];
				for(var k=1;k<words.length;k++){
					STX.I18N.wordLists[languages[k]][key]=words[k];
				}
			}
		};

		/**
		 * Convenience function to set up translation services for a chart and its surrounding GUI.
		 * It automatically sets STX.I18N.language, loads all translations and translates the chart.
		 * @param {object} stx A chart object
		 * @param {string} language  For instance 'en'
		 * @param {string} [translationCallback]  Function to perform Canvas Built-in word translations . Default is STX.I18N.translate
		 * @param {array} [csv] Translation spreadsheet in csv format. Make sure no leading tabs, trailing commas or spaces. Default is STX.I18N.csv
		 * @memberOf STX.I18N
		 * @since 04-2015
		 */
		STX.I18N.setLanguage=function(stx, language, translationCallback, csv){
			 STX.I18N.convertCSV(csv);
			 STX.I18N.language=language;
			 STX.I18N.translateUI();
			 if (!translationCallback) translationCallback = STX.I18N.translate;
			 stx.translationCallback=translationCallback;
		};

		/**
		 * This method will set the chart locale using Intl natively or for unsupported browsers dynamically loads the locale using JSONP.
		 * Once the locale is loaded then the chart widget itself is updated for that locale. Use this function when a user can select a locale dynamically so as to avoid
		 * having to include specific locale entries as `script` tags. The optional callback will be called when the locale
		 * has been set. The Intl library includes JSONP for each locale. A zip of these locales can be requested and should
		 * be placed in the locale-data directory of your server.
		 * @param {object} stx A chart object
		 * @param {string} locale A valid locale, for instance en-IN
		 * @param {Function} [cb] Callback when locale has been loaded. This function will be passed an error message if it cannot be loaded.
		 * @memberOf  STX.I18N
		 */
		STX.I18N.setLocale=function(stx, locale, cb){
			if(window.OldIntl){	// Intl built into browser
		    	stx.setLocale(locale);
		    	if(cb) cb(null);
				return;
			}
			var localeFileURL="locale-data/jsonp/" + locale + ".js";
			var script=document.createElement("SCRIPT");
			script.async = true;
			script.src = localeFileURL;
		    var s = document.getElementsByTagName('script')[0];
		    s.parentNode.insertBefore(script, s.nextSibling);
		    script.onload=function(){
		    	stx.setLocale(locale);
		    	if(cb) cb(null);
		    };
		    script.onerror=function(){
		    	if(cb) cb("cannot load script");
		    };
		};

		/**
		 * Creates a document node which facilitates translation to other languages, if stx.translationCallback callback function is set.
		 * If there is no translationCallback, a standard text node is returned.
		 * @param  {STXChart} stx The chart object
		 * @param  {string} english The word to translate
		 * @param {string} [language] Optional language. Defaults to STX.I18N.language.
		 * @return {Node}	A node in the following form if translationCallback exists:
		 * 					<language original="english">translation</language>
		 * 							If it does not exist, a text node is returned.
		 * @memberof STX
		 */
		STX.translatableTextNode=function(stx, english, language){
			if(stx.translationCallback) {
				var translation=stx.translationCallback(english);
				var translationNode=document.createElement("translate");
				translationNode.setAttribute("original",english);
				translationNode.innerHTML=stx.translationCallback(english,language);
				return translationNode;
			}else{
				return document.createTextNode(english);
			}
		};


		/**
		 * Determines how many decimal places the security trades. This is a callback from STXChart.calculateTradingDecimalPlaces and you
		 * can override this with your own functionality. The default algorithm is to check the most recent 50 quotes and find the maximum number
		 * of decimal places that the stock has traded. This will work for most securities but if yourmarket data feed has rounding errors
		 * or bad data then you may want to supplement this algorithm that checks the maximum value by security type.
		 * @param {Object} params Parameters
		 * @param  {STXChart} params.stx    The chart object
		 * @param {STXChart.Chart} params.chart The chart in question
		 * @param  {Object} params.symbol The symbol object. If you create charts with just stock symbol then symbolObject.symbol will contain that symbol
		 * @return {Number}        The number of decimal places
		 * @memberof STX
		 */
		STX.calculateTradingDecimalPlaces=function(params){
			var chart=params.chart;
			var decimalPlaces=2;
			var quotesToCheck = 50; // Check up to 50 recent quotes
			if(chart.masterData && chart.masterData.length > quotesToCheck){
				for(var i=1;i<quotesToCheck;i++){
					var position=chart.masterData.length-i;
					if(position<0) break;
					var quotes=chart.masterData[position];
					if(quotes.Close && typeof quotes.Close == 'number'){
						var cs=quotes.Close.toString();
						var point=cs.indexOf('.');
						if(point!=-1){
							var dp = cs.length-point-1;
							if(dp>decimalPlaces){
								decimalPlaces=dp;
							}
						}
					}
				}
			}
			if(decimalPlaces>chart.yAxis.maxDecimalPlaces) decimalPlaces=chart.yAxis.maxDecimalPlaces;
			return decimalPlaces;
		};

		/**
		 * The market class is what the chart uses to to manage market hours for the different exchanges.
		 * It uses `Market Definitions` to decide when the market is open or closed.
		 * Although you can construct many market classes with different definitions to be used in your functions, only one market definition can be attached to the chat at any given time. 
		 * Once a market is defined, an [iterator]{@link STX.Market#newIterator} can be created to traverse trough time, taking into account the market hours. 
		 * Additionally a variety of convenience functions can be used to check the market status, such as {@link STX.Market#isOpen} or {@link STX.Market#isMarketDay}.
		 *
		 * A chart will operate 24x7, unless a market definition is assigned to it. 
		 * See {@link STXChart#setMarket} and {@link STXChart#setMarketFactory} for instructions on how to assign a market definition to a chart.
		 * The chart also provides convenience functions that allows you to traverse trough time at the current chart periodicity without having to explicitly create a new iterator. 
		 * See {@link STXChart#getNextInterval} and {@link STXChart#standardMarketIterator} for details.
		 *
		 * `Market Definitions` are JavaScript objects which must contain the following elements:
		 * - `name` : A string. Name of the market for which the rules are for. 
		 * - `rules` : An array. The rules indicating the times the market is open or closed.
		 * - `market_tz` : A string. Time zone in which the market operates. A valid timezone from the stxTimeZoneData.js library.
		 * - `hour_aligned`: A boolean. If set to true, market opening and closing times will be set to the exact start of the hour of time, ignoring any minutes, seconds or millisecond offsets.
		 * - `convertOnDaily` : A boolean. By default, daily charts are not converted for timezone. Set this to true to convert for daily charts.
		 *
		 * Example:
		 * ```
		 * 	{
		 * 		name: "SAMPLE-MARKET",
		 * 		market_tz: "America/Chicago",
		 * 		hour_aligned: true,
		 * 		rules: [
		 * 				{"dayofweek": 1, "open": "09:00", "close": "17:00"}
		 * 		]
		 *	};
		 * ```
		 *
		 * Instructions for creating `Market Definitions`:
		 *
		 * - By default a market assumes that it is always open unless otherwise defined.
		 * - Seconds are not considered for open or close times, but are okay for intra day data.
		 * - Rules are processed top to bottom.
		 * - All non-default market rules are disabled by default.  Non-default market rules will have a `name` parameter included.
		 *  
		 * 		This is a rule for a 'pre' market session: 
		 * 			`{"dayofweek": 1, "open": "08:00", "close": "09:30", name: "pre"}`
		 *  
		 * - First the `dayofweek` wild card rules are processed. As soon as a rule is matched processing breaks.
		 *
		 * 		This rule says the market is open every Monday from 9:30 to 16:00:
		 * 			`{"dayofweek": 1, "open": "09:30", "close": "16:00"}`
		 *
		 * - After the `dayofweek` rules are processed all of the extra rules are processed.
		 * - Wildcard rules should be placed first and more specific rules should be placed later.
		 *
		 * 		This rule is a wildcard rule for Christmas. If Christmas is on Mon the
		 * 		first set of rules will evaluate to true because the dayofweek rule for day
		 * 		one will match. Then this rule will match if the date is the 25th of
		 * 		December in any year and because open is 00:00 and close is 00:00 it will evaluate to false:
		 * 			`{"date": "*-12-25", "open": "00:00", "close": "00:00"}`
		 *
		 * - After wildcard exceptions any specific day and time can be matched.
		 *
		 * 		This rule says closed on this day only. Note that open and closed attributes
		 * 		can be omitted to save typing if the market is closed the entire day:
		 * 			`{"date": "2016-01-18"} //Martin Luther King day.`
		 *
		 * 		This rules says closed on 12-26:
		 * 			`{"date": "2016-12-26"}, //Observed Christmas in 2016`
		 *
		 * 		This rule says partial session
		 * 			`{"date": "2015-12-24", "open": "9:30", "close": "13:00"} //Christmas eve`
		 *
		 * See example section for a compete NYSE definition.
		 * 
		 * Once defined, it can be used to create a new market instnce.
		 * 
		 * Example:
		 * 
		 * ```
		 *	var thisMarket = new STX.Market(marketDefinition);
		 * ```
		 *
		 * If no definition is provded, the market will operate 24x7.
		 * 
		 * Example:
		 * ```
		 * new STX.Market();
		 * ```
		 * 
		 * @param {Object} [market_definition] A json object that contains the rules for some market. If not defined default market is always open.
		 *
		 * @constructor
		 * @name  STX.Market
		 * @since 
		 * <br>04-2016-08
		 * <br>06-2016-02 - You can now specify times for different market sessions ('pre',post', etc) to be used with the sessions visualization tools. See {@link STX.ExtendedHours}
		 * 
		 * @example
		 * STX.Market.NYSE = {
				"name": "NYSE",
				"market_tz": "America/New_York",
				"hour_aligned": false,
				"rules": [
					//First open up the regular trading times
					//Note that sat and sun (in this example) are always closed because
					//everything is closed by default and we didn't explicitly open
					//them.
					{"dayofweek": 1, "open": "09:30", "close": "16:00"}, //mon
					{"dayofweek": 2, "open": "09:30", "close": "16:00"},
					{"dayofweek": 3, "open": "09:30", "close": "16:00"},
					{"dayofweek": 4, "open": "09:30", "close": "16:00"},
					{"dayofweek": 5, "open": "09:30", "close": "16:00"}, //fri
		
					//After Hours premarket
					{"dayofweek": 1, "open": "08:00", "close": "09:30", name: "pre"}, //mon
					{"dayofweek": 2, "open": "08:00", "close": "09:30", name: "pre"},
					{"dayofweek": 3, "open": "08:00", "close": "09:30", name: "pre"},
					{"dayofweek": 4, "open": "08:00", "close": "09:30", name: "pre"},
					{"dayofweek": 5, "open": "08:00", "close": "09:30", name: "pre"}, //fri

					//After Hours post
					{"dayofweek": 1, "open": "16:00", "close": "20:00", name: "post"}, //mon
					{"dayofweek": 2, "open": "16:00", "close": "20:00", name: "post"},
					{"dayofweek": 3, "open": "16:00", "close": "20:00", name: "post"},
					{"dayofweek": 4, "open": "16:00", "close": "20:00", name: "post"},
					{"dayofweek": 5, "open": "16:00", "close": "20:00", name: "post"}, //fri

					//Now mon thru friday is open. Close any exceptions
		
					//always closed on Christmas
					{"date": "*-12-25", "open": "00:00", "close": "00:00"},
		
					//always closed on 4th of July
					{"date": "*-07-04", "open": "00:00", "close": "00:00"},
		
					//always close on new years day
					{"date": "*-01-01", "open": "00:00", "close": "00:00"},
		
					//Some holidays are observed on different days each year or if
					//the day falls on a weekend. Each of those rules must be specified.
					{"date": "2012-01-02", "open": "00:00", "close": "00:00"},
		
					//As a special case if no open and close attributes are set they
					//will be assumed "00:00" and "00:00" respectively
					{"date": "2017-01-02"},
		
					{"date": "2016-01-18"},
					{"date": "2016-02-15"},
					{"date": "2016-03-25"},
					{"date": "2016-05-30"},
					{"date": "2016-09-05"},
					{"date": "2016-11-24"},
					{"date": "2016-11-25", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2016-11-25", "open": "9:30", "close": "13:00"},
					{"date": "2016-12-26"},
		
					{"date": "2015-01-19"},
					{"date": "2015-02-16"},
					{"date": "2015-04-03"},
					{"date": "2015-05-25"},
					{"date": "2015-07-03"},
					{"date": "2015-09-07"},
					{"date": "2015-11-26"},
					{"date": "2015-11-27", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2015-11-27", "open": "9:30", "close": "13:00"},
					{"date": "2015-12-24", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2015-12-24", "open": "9:30", "close": "13:00"},
		
					{"date": "2014-01-20"},
					{"date": "2014-02-17"},
					{"date": "2014-04-18"},
					{"date": "2014-05-26"},
					{"date": "2014-09-01"},
					{"date": "2014-11-27"},
					{"date": "2014-07-03", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2014-07-03", "open": "9:30", "close": "13:00"},
					{"date": "2014-11-28", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2014-11-28", "open": "9:30", "close": "13:00"},
					{"date": "2014-12-24", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2014-12-24", "open": "9:30", "close": "13:00"},
		
					{"date": "2013-01-21"},
					{"date": "2013-02-18"},
					{"date": "2013-03-29"},
					{"date": "2013-05-27"},
					{"date": "2013-09-02"},
					{"date": "2013-11-28"},
					{"date": "2013-07-03", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2013-07-03", "open": "9:30", "close": "13:00"},
					{"date": "2013-11-29", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2013-11-29", "open": "9:30", "close": "13:00"},
					{"date": "2013-12-24", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2013-12-24", "open": "9:30", "close": "13:00"},
		
					{"date": "2012-01-16"},
					{"date": "2012-02-20"},
					{"date": "2012-04-06"},
					{"date": "2012-05-28"},
					{"date": "2012-09-03"},
					{"date": "2012-10-29"},
					{"date": "2012-10-30"},
					{"date": "2012-11-22"},
					{"date": "2012-07-03", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2012-07-03", "open": "9:30", "close": "13:00"},
					{"date": "2012-11-23", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2012-11-23", "open": "9:30", "close": "13:00"},
					{"date": "2012-12-24", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2012-12-24", "open": "9:30", "close": "13:00"}
				]
			};
		 */
		STX.Market = function(market_definition) {
		    this.market_def = false;
		    this.rules = false;
		    this.normalHours = [];
		    this.extraHours = [];
		    this.class_name = 'Market';
			if (typeof timezoneJS === 'undefined') {
				this.tz_lib = Date; //needed to run unit tests
			} else {
			    this.tz_lib = timezoneJS.Date;
			}
		    this.market_tz = '';
		    this.hour_aligned = false;
		    this.convertOnDaily=false;
		    this.enabled_by_default = false;
		    
		    //needed to run unit tests otherwise should do nothing
		    if ( typeof market_definition != 'undefined' && market_definition && market_definition != {}) {
		    	if (market_definition.market_definition) {
			    	market_definition = market_definition.market_definition;
		    	}
		        if (market_definition.rules) {
		            this.rules = market_definition.rules;
		        }
		        if (market_definition.market_tz) {
		            this.market_tz = market_definition.market_tz;
		        }
		        if (market_definition.convertOnDaily) {
		            this.convertOnDaily = market_definition.convertOnDaily;
		        }
		        if (typeof market_definition.hour_aligned) {
		            this.hour_aligned = market_definition.hour_aligned;
		        }
		        if (typeof market_definition.enabled_by_default !== 'undefined') {
		        	if (market_definition.enabled_by_default instanceof Array) {
			        	this.enabled_by_default = market_definition.enabled_by_default;
		        	}
		        }
		        
		        this.market_def = market_definition;
		        if (this.market_def.name === undefined) {
		            this.market_def.name = "no market name specified";
		        }
		    } else {
		        return;
		    }
		
		    STX.Market._createTimeSegments(this);
		};
		
		//String constants used with market iterators
		STX.Market.MILLISECOND = 'millisecond';
		STX.Market.SECOND = 'second';
		STX.Market.MINUTE = 'minute';
		STX.Market.HOUR = 'hour';
		STX.Market.DAY = 'day';
		STX.Market.WEEK = 'week';
		STX.Market.MONTH = 'month';
		
		// TODO, holidays for futures,forex,metals
		STX.Market.GLOBEX = {
			name: "GLOBEX",
			market_tz: "America/Chicago",
			hour_aligned: true,
			rules: [
					{"dayofweek": 0, "open": "15:00", "close": "24:00"}, //sun
					{"dayofweek": 1, "open": "00:00", "close": "24:00"},
					{"dayofweek": 2, "open": "00:00", "close": "24:00"},
					{"dayofweek": 3, "open": "00:00", "close": "24:00"},
					{"dayofweek": 4, "open": "00:00", "close": "24:00"},
					{"dayofweek": 5, "open": "00:00", "close": "18:00"},
			]
		};
		
		STX.Market.FOREX = {
			name: "FOREX",
			market_tz: "America/New_York",
			hour_aligned: true,
			rules: [
					{"dayofweek": 0, "open": "15:00", "close": "24:00"}, //  9AM NZ time in the winter and 7AM NZ time in the summer.
					{"dayofweek": 1, "open": "00:00", "close": "17:00"},
					{"dayofweek": 1, "open": "17:00", "close": "24:00"},
					{"dayofweek": 2, "open": "00:00", "close": "17:00"},
					{"dayofweek": 2, "open": "17:00", "close": "24:00"},
					{"dayofweek": 3, "open": "00:00", "close": "17:00"},
					{"dayofweek": 3, "open": "17:00", "close": "24:00"},
					{"dayofweek": 4, "open": "00:00", "close": "17:00"},
					{"dayofweek": 4, "open": "17:00", "close": "24:00"},
					{"dayofweek": 5, "open": "00:00", "close": "17:00"}
			]
		};
		
		STX.Market.METALS = {
			name: "METALS",
			market_tz: "America/New_York",
			hour_aligned: true,
			rules: [
					{"dayofweek": 0, "open": "18:00", "close": "24:00"},
					{"dayofweek": 1, "open": "00:00", "close": "17:15"},
					{"dayofweek": 1, "open": "18:00", "close": "24:00"},
					{"dayofweek": 2, "open": "00:00", "close": "17:15"},
					{"dayofweek": 2, "open": "18:00", "close": "24:00"},
					{"dayofweek": 3, "open": "00:00", "close": "17:15"},
					{"dayofweek": 3, "open": "18:00", "close": "24:00"},
					{"dayofweek": 4, "open": "00:00", "close": "17:15"},
					{"dayofweek": 4, "open": "18:00", "close": "24:00"},
					{"dayofweek": 5, "open": "00:00", "close": "17:15"}
			]
		};
		
		STX.Market.NYSE = {
				"name": "NYSE",
				"market_tz": "America/New_York",
				"hour_aligned": false,
				"rules": [
					//First open up the regular trading times
					//Note that sat and sun (in this example) are always closed because
					//everything is closed by default and we didn't explicitly open
					//them.
					{"dayofweek": 1, "open": "09:30", "close": "16:00"}, //mon
					{"dayofweek": 2, "open": "09:30", "close": "16:00"},
					{"dayofweek": 3, "open": "09:30", "close": "16:00"},
					{"dayofweek": 4, "open": "09:30", "close": "16:00"},
					{"dayofweek": 5, "open": "09:30", "close": "16:00"}, //fri
		
					//After Hours premarket
					{"dayofweek": 1, "open": "04:00", "close": "09:30", name: "pre"}, //mon
					{"dayofweek": 2, "open": "04:00", "close": "09:30", name: "pre"},
					{"dayofweek": 3, "open": "04:00", "close": "09:30", name: "pre"},
					{"dayofweek": 4, "open": "04:00", "close": "09:30", name: "pre"},
					{"dayofweek": 5, "open": "04:00", "close": "09:30", name: "pre"}, //fri

					//After Hours post
					{"dayofweek": 1, "open": "16:00", "close": "20:00", name: "post"}, //mon
					{"dayofweek": 2, "open": "16:00", "close": "20:00", name: "post"},
					{"dayofweek": 3, "open": "16:00", "close": "20:00", name: "post"},
					{"dayofweek": 4, "open": "16:00", "close": "20:00", name: "post"},
					{"dayofweek": 5, "open": "16:00", "close": "20:00", name: "post"}, //fri

					//Now mon thru friday is open. Close any exceptions
		
					//always closed on Christmas
					{"date": "*-12-25", "open": "00:00", "close": "00:00"},
		
					//always closed on 4th of July
					{"date": "*-07-04", "open": "00:00", "close": "00:00"},
		
					//always close on new years day
					{"date": "*-01-01", "open": "00:00", "close": "00:00"},
		
					//Some holidays are observed on different days each year or if
					//the day falls on a weekend. Each of those rules must be specified.
					{"date": "2012-01-02", "open": "00:00", "close": "00:00"},
		
					//As a special case if no open and close attributes are set they
					//will be assumed "00:00" and "00:00" respectively
					{"date": "2017-01-02"},
		
					{"date": "2016-01-18"},
					{"date": "2016-02-15"},
					{"date": "2016-03-25"},
					{"date": "2016-05-30"},
					{"date": "2016-09-05"},
					{"date": "2016-11-24"},
					{"date": "2016-11-25", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2016-11-25", "open": "9:30", "close": "13:00"},
					{"date": "2016-12-26"},
		
					{"date": "2015-01-19"},
					{"date": "2015-02-16"},
					{"date": "2015-04-03"},
					{"date": "2015-05-25"},
					{"date": "2015-07-03"},
					{"date": "2015-09-07"},
					{"date": "2015-11-26"},
					{"date": "2015-11-27", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2015-11-27", "open": "9:30", "close": "13:00"},
					{"date": "2015-12-24", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2015-12-24", "open": "9:30", "close": "13:00"},
		
					{"date": "2014-01-20"},
					{"date": "2014-02-17"},
					{"date": "2014-04-18"},
					{"date": "2014-05-26"},
					{"date": "2014-09-01"},
					{"date": "2014-11-27"},
					{"date": "2014-07-03", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2014-07-03", "open": "9:30", "close": "13:00"},
					{"date": "2014-11-28", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2014-11-28", "open": "9:30", "close": "13:00"},
					{"date": "2014-12-24", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2014-12-24", "open": "9:30", "close": "13:00"},
		
					{"date": "2013-01-21"},
					{"date": "2013-02-18"},
					{"date": "2013-03-29"},
					{"date": "2013-05-27"},
					{"date": "2013-09-02"},
					{"date": "2013-11-28"},
					{"date": "2013-07-03", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2013-07-03", "open": "9:30", "close": "13:00"},
					{"date": "2013-11-29", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2013-11-29", "open": "9:30", "close": "13:00"},
					{"date": "2013-12-24", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2013-12-24", "open": "9:30", "close": "13:00"},
		
					{"date": "2012-01-16"},
					{"date": "2012-02-20"},
					{"date": "2012-04-06"},
					{"date": "2012-05-28"},
					{"date": "2012-09-03"},
					{"date": "2012-10-29"},
					{"date": "2012-10-30"},
					{"date": "2012-11-22"},
					{"date": "2012-07-03", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2012-07-03", "open": "9:30", "close": "13:00"},
					{"date": "2012-11-23", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2012-11-23", "open": "9:30", "close": "13:00"},
					{"date": "2012-12-24", "open": "8:00", "close": "9:30", name: "pre"},
					{"date": "2012-12-24", "open": "9:30", "close": "13:00"}
				]
			};
		
		/**
		 * Set of rules for identifying instrument's exchange and deriving a market definition from a symbol.
		 * This is only required if your chart will need to know the operating hours for the different exchanges. 
		 * If using a 24x7 chart, this class is not needed.
		 * 
		 * By default these rules are assigned to functions using ChartIQ symbology to identify the exchange.
		 * 
		 * **Before using, they must be reviewed and if necessary assigned to functions containing logic to match symbology rules for your quote data.**
		 * @namespace
		 * @name  STX.Market.Symbology
		 * @since 04-2016-08
		 */
		STX.Market.Symbology=function(){};
		
		/**
		 * Returns true if the instrument is foreign. 
		 * This is dependent on the market data feed and should be overridden accordingly.
		 * Currently if the instrument contains a period (.) it will be considered foreign (non US). (e.g. .XXXX)
		 * @param  {string}  symbol The symbol
		 * @return {Boolean}        True if it's a foreign symbol
		 * @memberOf STX.Market.Symbology
		 * @since 04-2016-08
		 */
		STX.Market.Symbology.isForeignSymbol=function(symbol){
			if(!symbol) return false;
			return symbol.indexOf(".")!=-1;
		};
		
		/**
		 * Returns true if the instrument is a futures. 
		 * This is dependent on the market data feed and should be overridden accordingly.
		 * Currently if the symbol begins with `/` it will be considered a future. (e.g. /C)
		 * @param  {string}  symbol The symbol
		 * @return {Boolean}        True if it's a futures symbol
		 * @memberOf STX.Market.Symbology
		 * @since 04-2016-08
		 */
		STX.Market.Symbology.isFuturesSymbol=function(symbol){
			if(!symbol) return false;
			if(symbol.indexOf("/")!==0 || symbol=="/") return false;
			return true;
		};
		
		/**
		 * Returns true if the instrument is a forex symbol. 
		 * This is dependent on the market data feed and should be overridden accordingly.
		 * Currently if the symbol begins with `^` and is followed by 6 alpha caracters, or just 6 alpha characters long without a '^', it will be considered forex.(e.g. ^EURUSD)
		 * @param  {string}  symbol The symbol
		 * @return {Boolean}        True if it's a forex symbol
		 * @memberOf STX.Market.Symbology
		 * @since 04-2016-08
		 */
		STX.Market.Symbology.isForexSymbol=function(symbol){
			if(!symbol) return false;
		    if(STX.Market.Symbology.isForeignSymbol(symbol)) return false;
		    if(STX.Market.Symbology.isFuturesSymbol(symbol)) return false;
			if(symbol.length<6 || symbol.length>7) return false;
			if(symbol.length==6 && symbol[5]=="X") return false;
			if(/\^?[A-Za-z]{6}/.test(symbol)) return true;
			return false;
		};
		
		/**
		 * Returns true if the symbol is a metal/currency or currency/metal pair 
		 * This is dependent on the market data feed and should be overridden accordingly.
		 * Currently it must be a [forex]{@link STX.Market.Symbology.isForexSymbol} for a precious metal. (e.g. ^XAUUSD - looks for XAU,XPD,XPT,XAG only) 
		 * @param  {string}   symbol The symbol
		 * @param  {boolean}  inverse Set to true to test specifically for a currency/metal pair.
		 * @return {Boolean}        True if it's a metal symbol
		 * @memberOf STX.Market.Symbology
		 * @since 04-2016-08
		 */
		STX.Market.Symbology.isForexMetal=function(symbol,inverse){
			if(!symbol) return false;
		    if(!STX.Market.Symbology.isForexSymbol(symbol)) return false;
			if(symbol.charAt(0)!="^") symbol="^"+symbol;
			if(",XAU,XPD,XPT,XAG,".indexOf(","+symbol.substr(4,3)+",")!=-1) return true;
			else if(!inverse && ",XAU,XPD,XPT,XAG,".indexOf(","+symbol.substr(1,3)+",")!=-1) return true;
			return false;
		};
		
		/**
		 * Returns true if the symbol is a forex or a future
		 * This is dependent on the market data feed and should be overridden accordingly.
		 * @param  {string}   symbol The symbol
		 * @return {Boolean}        True if the symbol is a forex or a future
		 * @memberOf STX.Market.Symbology
		 * @since 04-2016-08
		 */
		STX.Market.Symbology.isForexFuturesSymbol=function(symbol){
		    if(STX.Market.Symbology.isForexSymbol(symbol)) return true;
		    if(STX.Market.Symbology.isFuturesSymbol(symbol)) return true;
			return false;
		};
		
		/**
		 * This is a function that takes a symbolObject of form accepted by {@link STXChart#newChart}, and returns a market definition. 
		 * When loading it with {@link STXChart#setMarketFactory}, it will be used by the chart to dynamically change market definitions when a new instrument is activated.
		 * See {@link STX.Market} for instruction on how to create a market definition. 
		 * @param  {Object} symbolObject Symbol object of form accepted by {@link STXChart#newChart}
		 * @return {Object} A market definition. See {@link STX.Market} for instructions.
		 * @memberOf STX.Market.Symbology
		 * @since 04-2016-08
		 */
		STX.Market.Symbology.factory=function(symbolObject){
			var symbol=symbolObject.symbol;
		    if(STX.Market.Symbology.isForeignSymbol(symbol)) return null; // 24 hour market definition
		    if(STX.Market.Symbology.isFuturesSymbol(symbol)) return STX.Market.GLOBEX;
		    if(STX.Market.Symbology.isForexMetal(symbol)) return STX.Market.METALS;
		    if(STX.Market.Symbology.isForexSymbol(symbol)) return STX.Market.FOREX;
			return STX.Market.NYSE;
		};
		
		/**
		 * Primitive to find the next matching time segement taking into account
		 * rules for adjacent sessions.
		 * @param {Date} date A start date time.
		 * @param {Boolean} open True if looking for an open time
		 * @return A date that falls somewhere in a matching time segment. Probably 1 before close. Or null if no rules are defined
		 * @memberOf  STX.Market
		 * @since  05-2016-10
		 * @private
		 */
		STX.Market.prototype._find_next_segment = function(date, open) {
			if (! this.market_def) return null; // special case
			if (! this.rules) return null; //special case
			var d = new Date(date);
			var iter = this.newIterator({
				'begin': d,
				'interval': 1,
			});
			if (this._wasOpenIntraDay(d)) {
				var hours = this.zseg_match.close_parts.hours;
				var minutes = this.zseg_match.close_parts.minutes;
				d.setHours(hours);
				d.setMinutes(minutes);
				iter = this.newIterator({
					'begin': d,
					'interval': 1,
				});
			}
			return iter.next();
		};
		
		/**
		 * Primitive to find the previous matching time segement taking into account
		 * rules for adjacent sessions.
		 * @param {Date} date A start date time.
		 * @param {Boolean} open True if looking for an open time
		 * @return A date that falls somewhere in a matching time segment. Probably 1 before close. Or null of no rules are defined.
		 * @memberOf  STX.Market
		 * @since  05-2016-10
		 * @private
		 */
		STX.Market.prototype._find_prev_segment = function(date, open) {
			if (! this.market_def) return null; // special case
			if (! this.rules) return null; //special case
			var d = new Date(date);
			var iter = this.newIterator({
				'begin': d,
				'interval': 1,
			});
			if (this._wasOpenIntraDay(d)) {
				var hours = this.zseg_match.open_parts.hours;
				var minutes = this.zseg_match.open_parts.minutes;
				d.setHours(hours);
				d.setMinutes(minutes);
				iter = this.newIterator({
					'begin': d,
					'interval': 1,
				});
				d = iter.previous();
				
				if (this.zseg_match.close_parts.hours === hours) {
					if (this.zseg_match.close_parts.minutes === minutes) {
						// segments are adjacent use the previous
						if (open) {
							return iter.next();
						}
						return d;
					}
				}
				if (this.zseg_match.adjacent_child) {
					// segments are adjacent use the previous
					return d;
				}
				if (open) {
					// segments are not adjacent go back
					return iter.next();
				}
				return d;
			}
			return iter.previous();
		};
		
		/**
		 * Toggle on/off a market session by name.
		 * @param {String} session_name A session name matching a valid name present in the market definition.
		 * @param {Object} [inverted] Any true value (`true`, non-zero value or string) passed here will enable the session, otherwise the session will be disabled.
		 * @memberOf  STX.Market
		 * @since  06-2016-02
		 */
		STX.Market.prototype.disableSession = function(session_name, inverted) {
			var inverted_ = false;
			if (typeof inverted !== 'undefined' && inverted) {
				inverted_ = true;
			}
			if (session_name) {
				for (var i = 0;i < this.normalHours.length; i++) {
					if (this.normalHours[i].name === session_name) {
						this.normalHours[i].enabled = inverted_;
					}
				}
				for (i = 0;i < this.extraHours.length; i++) {
					if (this.extraHours[i].name === session_name) {
						this.extraHours[i].enabled = inverted_;
					}
				}
			}
		};
		
		/**
		 * Enable a market session by name. See {@link STX.Market#disableSession}
		 * @param {String} session_name A session name
		 * @memberOf  STX.Market
		 * @since  06-2016-02
		 */
		STX.Market.prototype.enableSession = function(session_name) {
			this.disableSession(session_name, 'enable_instead');
		};
		
		/**
		 * Get the close date/time for the trading session.
		 * @param [Date=now] date The date on which to check.
		 * @param {String} [session_name] Specific market session. If a session name is passed in, then not only does the market
		 * need to be open on the day in question but also within the time specified, otherwise null will be returned.
		 * @param [inZone] Optional datazone to translate from - If no market zone is present it will not be converted.
		 * @param [outZone] Optional datazone to translate to - If no market zone is present it will not be converted.
		 * @return {Date} Close date/time for the trading session or null if the market is
		 * closed for the given date.
		 * @memberOf  STX.Market
		 * @since  05-2016-10
		 */
		STX.Market.prototype.getClose = function(date, session_name, inZone, outZone) {
			var d = date?date:new Date();
			d = this._convertToMarketTZ(d, inZone);

			if (typeof session_name !== 'undefined') {
				if (this._wasOpenIntraDay(d)) {
					if (this.zseg_match.name === session_name) {
						d.setHours(this.zseg_match.close_parts.hours);
						d.setMinutes(this.zseg_match.close_parts.minutes);
						d.setSeconds(0);
						d.setMilliseconds(0);
						d=this._convertFromMarketTZ(d, outZone);
						return d;
					}
				}
			} else {
				if (this._wasOpenDaily(d)) {
					var zseg_match = this.zseg_match;
					
					//find the last session of the day
					while (zseg_match.child_) {
						zseg_match = zseg_match.child_;
					}
					
					//find the last enabled session ... maybe back where we started
					while (! zseg_match.enabled) {
						zseg_match = zseg_match.parent_;
					}
					
					d.setHours(zseg_match.close_parts.hours);
					d.setMinutes(zseg_match.close_parts.minutes);
					d.setSeconds(0);
					d.setMilliseconds(0);
					d=this._convertFromMarketTZ(d, outZone);
					return d;
				}
			}
			return null;
		};
		
		/**
		 * Get the close time for the current market session, or if the market is closed, the close time for the next market session.
		 * @param [Date=now] date The date on which to check.
		 * @param [inZone] Optional datazone to translate from - If no market zone is present it will not be converted.
		 * @param [outZone] Optional datazone to translate to - If no market zone is present it will not be converted.
		 * @return {Date} A date set to the close time of the next open market session.
		 * @memberOf  STX.Market
		 * @since  05-2016-10
		 */
		STX.Market.prototype.getNextClose = function(date, inZone, outZone) {
			var d = date?date:new Date();
			d = this._convertToMarketTZ(d, inZone);
			if (! this._wasOpenIntraDay(d)) {
				var iter = this.newIterator({
					'begin': d,
					'interval': 1
				});
				d = iter.next();
			}
			var date_ = d.getDate();
			var zseg_match = this.zseg_match;
			while (zseg_match.adjacent_child) {
				zseg_match = zseg_match.adjacent_child;
				date_ += 1;
			}
			d.setDate(date_);
			d.setHours(zseg_match.close_parts.hours);
			d.setMinutes(zseg_match.close_parts.minutes);
			d.setSeconds(0);
			d.setMilliseconds(0);
			d=this._convertFromMarketTZ(d, outZone);
			return d;
			
		};
		
		/**
		 * Get the next market session open time. If the requested date is the opening time for the session, then
		 * it will iterate to opening time for the next market session.
		 * @param [Date=now] date An The date on which to check.
		 * @param [inZone] Optional datazone to translate from - If no market zone is present it will not be converted.
		 * @param [outZone] Optional datazone to translate to - If no market zone is present it will not be converted.
		 * @return {Date} A date aligned to the open time of the next open session. If no rules are defined, it will return null.
		 * @memberOf  STX.Market
		 * @since  05-2016-10
		 */
		STX.Market.prototype.getNextOpen = function(date, inZone, outZone) {
			if (! this.market_def) return null; // special case
			if (! this.rules) return null; //special case
			var d = date?date:new Date();
			d = this._convertToMarketTZ(d, inZone);
			d = this._find_next_segment(d);
			if (this.zseg_match.adjacent_parent) {
				d=this.getNextOpen(d);
				d=this._convertFromMarketTZ(d, outZone);
				return d;
			}
			d.setHours(this.zseg_match.open_parts.hours);
			d.setMinutes(this.zseg_match.open_parts.minutes);
			d=this._convertFromMarketTZ(d, outZone);
			return d;
		};
		
		/**
		 * Get the open date/time for a market session. The market session must be
		 * enabled.
		 * @param [Date=now] date The date on which to check.
		 * @param [inZone] Optional datazone to translate from - If no market zone is present it will not be converted.
		 * @param [outZone] Optional datazone to translate to - If no market zone is present it will not be converted.
		 * @param {String} [session_name] Specific market session. If a session name is passed in, then not only does the market
		 * need to be open on the day in question but also within the time specified, otherwise null will be returned.
		 * @return {Date} A date time for the open of a session or null if the market is
		 * closed for the given date or there are no rules to check.
		 * @memberOf  STX.Market
		 * @since  05-2016-10
		 */
		STX.Market.prototype.getOpen = function(date, session_name, inZone, outZone) {
			if (! this.market_def) return null; // special case
			if (! this.rules) return null; //special case
			var d = date?date:new Date();
			d = this._convertToMarketTZ(d, inZone);
			if (typeof session_name !== 'undefined') {
				if (this._wasOpenIntraDay(d)) {
					if (this.zseg_match.name == session_name) {
						d.setHours(this.zseg_match.open_parts.hours);
						d.setMinutes(this.zseg_match.open_parts.minutes);
						d.setSeconds(0);
						d.setMilliseconds(0);
						d=this._convertFromMarketTZ(d, outZone);
						return d;
					}
				}
			} else {
				if (this._wasOpenDaily(d)) {
					var zseg_match = this.zseg_match;
					
					//find all of the parents if any
					while (zseg_match.parent_) {
						zseg_match = zseg_match.parent_;
					}
					
					//find the first enabled child ... might end up back where we started
					while (! zseg_match.enabled) {
						zseg_match = zseg_match.child_;
					}
					
					d.setHours(zseg_match.open_parts.hours);
					d.setMinutes(zseg_match.open_parts.minutes);
					d.setSeconds(0);
					d.setMilliseconds(0);
					d=this._convertFromMarketTZ(d, outZone);
					return d;
				}
			}
			return null;
		};
		
		/**
		 * Get the previous session close time. If the date lands exactly on the close time for a session then
		 * it will still seek to the previous market session's close.
		 * @param [Date=now] date The date on which to check.
		 * @param [inZone] Optional datazone to translate from - If no market zone is present it will not be converted.
		 * @param [outZone] Optional datazone to translate to - If no market zone is present it will not be converted.
		 * @return {Date} A date aligned to the previous close date/time of a session. If no rules are defined, it will return null.
		 * @memberOf  STX.Market
		 * @since  05-2016-10
		 */
		STX.Market.prototype.getPreviousClose = function(date, inZone, outZone) {
			if (! this.market_def) return null; // special case
			if (! this.rules) return null; //special case
			var d = date?date:new Date();
			d = this._convertToMarketTZ(d, inZone);
			d = this._find_prev_segment(d, false);
			if (this.zseg_match.adjacent_child) {
				return this.getPreviousClose(d);
			}
			d.setHours(this.zseg_match.close_parts.hours);
			d.setMinutes(this.zseg_match.close_parts.minutes);
			d=this._convertFromMarketTZ(d, outZone);
			return d;
		};
		
		/**
		 * Get the previous session open time. If the date lands exactly on the open time for a session then
		 * it will still seek to the previous market session's open.
		 * @param [Date=now] date An The date on which to check.
		 * @param [inZone] Optional datazone to translate from - If no market zone is present it will not be converted.
		 * @param [outZone] Optional datazone to translate to - If no market zone is present it will not be converted.
		 * @return {Date} A date aligned to previous open date/time of a session. If no rules are defined, it will return null.
		 * @memberOf  STX.Market
		 * @since  05-2016-10
		 */
		STX.Market.prototype.getPreviousOpen = function(date, inZone, outZone) {
			if (! this.market_def) return null; // special case
			if (! this.rules) return null; //special case
			var d = date?date:new Date();
			d = this._convertToMarketTZ(d, inZone);
			d = this._find_prev_segment(d, true);
			if (this.zseg_match.adjacent_parent) {
				return this.getPreviousOpen(d);
			}
			d.setHours(this.zseg_match.open_parts.hours);
			d.setMinutes(this.zseg_match.open_parts.minutes);
			d=this._convertFromMarketTZ(d, outZone);
			return d;
		};
		
		/**
		 * Return the session name for a date. If the name is defined and if the date
		 * lands in a session that is open. Otherwise return null.
		 * @param {Date} date A date object
		 * @param {String} [inZone] Timezone of incoming date - If no market zone is present it will not be converted.
		 * @return {Object} String or null
		 */
		STX.Market.prototype.getSession = function(date, inZone) {
			date = this._convertToMarketTZ(date, inZone);
			if (this._wasOpenIntraDay(date) && this.zseg_match) {
				return this.zseg_match.name;
			}
			return null;
		};
		
		/**
		 * @return {Date} Current time in the market zone
		 * @memberOf  STX.Market
		 * @since 04-2016-08
		 */
		STX.Market.prototype.marketZoneNow = function() {
			return this._convertToMarketTZ(new Date());
		};
		
		/**
		 * @return {Boolean} `true` if this market is hour aligned.
		 * @memberOf  STX.Market
		 * @since 04-2016-08
		 */
		STX.Market.prototype.isHourAligned = function() {
			return this.hour_aligned;
		};
		
		/**
		 * Checks if the market is currently open.
		 * @return {Boolean} `true` if the market is open right now.
		 * @memberOf  STX.Market
		 * @since 04-2016-08
		 */
		STX.Market.prototype.isOpen = function() {
			var now = new Date();
			if (this.market_tz) {
				now = new this.tz_lib(now.getTime(), this.market_tz);
			}
			return this._wasOpenIntraDay(now);
		};
		
		/**
		 * Checks if today it is a market day.
		 * @return {Boolean} `true` if it is a market day.
		 * @memberOf  STX.Market
		 * @since 04-2016-08
		 */
		STX.Market.prototype.isMarketDay = function() {
		    var now = new Date();
		    if (this.market_tz) {
		        now = new this.tz_lib(now.getTime(), this.market_tz);
		    }
		    return this._wasOpenDaily(now);
		};		
		
		/**
		 * Creates iterators for the associated Market to traverse trough time taking into account market hours. 
		 * An iterator instance can go forward or backward in time any arbitrary amount.
		 * However, the internal state cannot be changed once it is constructed. A new iterator should be
		 * constructed whenever one of the parameters changes. For example if the
		 * `interval` changes a new iterator will need to be built. If the `displayZone`
		 * or `dataZone` changes on the market new iterators will also need to be
		 * constructed.
		 * 
		 * See {@link STX.Market.Iterator} for all available methods.
		 * 
		 * See the following convenience functions: {@link STXChart#getNextInterval} and  {@link STXChart#standardMarketIterator}
		 *
		 * @param {Object} parms Parameters used to initialize the Market object.
		 * @param {string} [parms.interval] A valid interval as required by {@link STXChart#setPeriodicityV2}. Default is 1 (minute).
		 * @param {Integer} [parms.periodicity] A valid periodicity as required by {@link STXChart#setPeriodicityV2}. Default is 1.
		 * @param {String} [parms.timeUnit] A valid timeUnit as required by {@link STXChart#setPeriodicityV2}. Default is "minute"
		 * @param {Date} [parms.begin] The date to set as the start date for this iterator instance. Default is `now`. Will be assumed to be `inZone` if one set.
		 * @param {String} [parms.inZone] A valid timezone from the stxTimeZoneData.js library. This should represent the time zone for any input dates such as `parms.begin` in this function or `parms.end` in {@link STX.Market.Iterator#futureTick}. Defaults to browser timezone if none set.  - If no market zone is present it will not be converted.
		 * @param {String} [parms.outZone] A valid timezone from the stxTimeZoneData.js library. This should represent the time zone for the returned dates. Defaults to browser timezone if none set.  - If no market zone is present it will not be converted.
		 * @return {Object} A new iterator.
		 * @memberOf  STX.Market
		 * @since 04-2016-08
		 * @example
		    var iter = stxx.market.newIterator(
					{
						'begin': now,
		                'interval': stxx.layout.interval,
		                'periodicity': stxx.layout.periodicity,
		                'timeUnit': stxx.layout.timeUnit,
		                'inZone': stxx.dataZone,
		                'outZone': stxx.displayZone
					}
			);
		 */
		STX.Market.prototype.newIterator = function(parms) {
			var _multiple = false;
			if (parms.periodicity) {
				_multiple = parms.periodicity;
			} else if (parms.multiple) {
				_multiple = parms.multiple;
			}
			var _interval = parms.interval;
			if (!_interval) {
				_interval = STX.Market.MINUTE;
			}
			if (!_multiple) {
				_multiple = 1;
			}
			if (!parms.begin) {
				parms.begin = new Date();
			}
		    if (_interval === parseInt(_interval, 10)) {
				_multiple = _multiple * _interval;
				_interval = 'minute';
		    }
		    if (parms.timeUnit) {
		    	if (parms.timeUnit === STX.Market.MILLISECOND) {
		    		_interval = parms.timeUnit;
		    	} else if (parms.timeUnit === STX.Market.SECOND) {
		    		_interval = parms.timeUnit;
		    	}
		    }
			parms.interval = _interval;
			parms.multiple = _multiple;
			parms.market = this;
			return new STX.Market.Iterator(parms);
		};
		
		/**
		 * Calculate whether this market was open on some date. This will depend on
		 * the data used when creating this market. This function does not take into
		 * account intra day data. It simply checks the date to see if the market was
		 * open at all on that day. Hours, minutes, seconds are ignored.
		 * @param {Date} historical_date Javascript date object with timezone in the market time zone.
		 * @return {Boolean} true if the market was open.
		 * @memberOf  STX.Market
		 * @since 04-2016-08
		 * @private
		 */
		STX.Market.prototype._wasOpenDaily = function(historical_date) {
			return this._was_open(historical_date, false);
		};
		
		/**
		 * Calculate whether this market was open on some date. This will depend on
		 * The data used when creating this market. This function will take into
		 * account intra day date that is minutes and seconds. Not only does a market
		 * need to be open on the day in question but also within the time specified.
		 * @param {Date} historical_date Javascript date object with timezone in the market time zone.
		 * @return {Boolean} true if the market was open.
		 * @memberOf  STX.Market
		 * @since 04-2016-08
		 * @private
		 */
		STX.Market.prototype._wasOpenIntraDay = function(historical_date) {
			return this._was_open(historical_date, true);
		};
		
		/**
		 * Given some javascript date object calculate whether this market was open.
		 * Use _wasOpenDaily or _wasOpenIntraDay instead. As a special case if
		 * no market json has been defined this function will always return true.
		 * @param {Date} historical a valid Javascript date object with timezone in the market time zone.
		 * @param {Boolean}
		 * @return {Boolean} true if open else false
		 * @private
		 */
		STX.Market.prototype._was_open = function(historical, intra_day) {
			this.zopen_hour = 0;
			this.zopen_minute = 0;
			this.zclose_hour = 0;
			this.zclose_minute = 0;
			this.zmatch_open = false;
			if (! this.market_def) return true; // special case
			if (! this.rules) return true; //special case
			var normally_open = false;
			var extra_open = false;
			var year = historical.getFullYear();
			var month = historical.getMonth() + 1;
			var day = historical.getDay();
			var date = historical.getDate();
			var hour = historical.getHours();
			var minutes = historical.getMinutes();
			var seconds = historical.getSeconds();
			var segment;
			var midnight_secs = (hour * 60 * 60) + (minutes * 60) + seconds;
		
			if (typeof intra_day === 'undefined') {
				intra_day = true;
			}
		
			var i;
			for (i = 0; i < this.normalHours.length; i++) {
				segment = this.normalHours[i];
				if (! segment.enabled) {
					continue;
				}
				normally_open = (segment.dayofweek === day);
				if (normally_open && intra_day) {
					normally_open = midnight_secs >= segment.open &&
						midnight_secs < segment.close;
				}
				if (normally_open) {
					this.zopen_hour = segment.open_parts.hours;
					this.zopen_minute = segment.open_parts.minutes;
					this.zclose_hour = segment.close_parts.hours;
					this.zclose_minute = segment.close_parts.minutes;
					this.zmatch_open = (midnight_secs === segment.open);
					this.zseg_match = segment;
					break;
				}
			}
		
			for (i = 0; i < this.extraHours.length; i++) {
				segment = this.extraHours[i];
				if (! segment.enabled) {
					continue;
				}
				if ('*' === segment.year || year === segment.year) {
					if (month === segment.month && date === segment.day) {
						extra_open =
							(midnight_secs >= segment.open) &&
								(midnight_secs < segment.close);
						if (! extra_open && normally_open) {
							normally_open = false;
						}
						if (extra_open) {
							this.zopen_hour = segment.open_parts.hours;
							this.zopen_minute = segment.open_parts.minutes;
							this.zclose_hour = segment.close_parts.hours;
							this.zclose_minute = segment.close_parts.minutes;
							this.zmatch_open = (midnight_secs === segment.open);
							this.zseg_match = segment;
							break;
						}
					}
				}
			}
		
			return normally_open || extra_open;
		};

		/**
		 * Convenience function for unit testing.
		 */
		STX.Market.prototype._wasClosed = function(test_date) {
			return !this._was_open(test_date, true);
		};
		
		/**
		 * Convenience function for unit testing.
		 */
		STX.Market.prototype._wasOpen = function(test_date) {
			return this._was_open(test_date, true);
		};
		
		/**
		 * Get the difference in millis between two time zones. May be positive or
		 * negative depending on the time zones. The purpose is to shift the source
		 * time zone some number of millis to the target timezone. For example shifting
		 * a data feed from UTC to Eastern time. Or shifting Eastern time to Mountain
		 * time for display purposes. Note that it is important to pass the source
		 * and the target in the correct order. The algorithm does source - target. This
		 * will calculate the correct offset positive or negative.
		 * @param {Date} A date object. Could be any date object the javascript one
		 * or for example the timezone.js one. Must implement getTime() and
		 * getTimezoneOffset()
		 * @param {String} src_tz_str The source time zone. For example the data feed
		 * @param {String} target_tz_str The target time zone for example the market.
		 * @return {Integer} The number of milliseconds difference between the time
		 * zones.
		 */
		STX.Market.prototype._tzDifferenceMillis = function(
			date, src_tz_str, target_tz_str) {
			var millis = 0;
			var src_date = date;
			var target_date = date;
			var minutes =
				src_date.getTimezoneOffset() - target_date.getTimezoneOffset();
			millis = minutes * 60 * 1000;
			return millis;
		};
		
		/**
		 * Static function that reads the json rules in the market definition and
		 * creates in memory time segments that are used later to match market dates.
		 * @param {Object} market An instance of a market.
		 */
		STX.Market._createTimeSegments = function(market) {
			var link_adjacent = function(r0_, r1_) {
				if (r0_.close_parts.hours === 24 && r1_.open_parts.hours === 0) {
					if (r1_.open_parts.minutes === 0) {
						if (p_rule.dayofweek === rd.dayofweek - 1) {
							return true;
						}
						if (p_rule.dayofweek === 6 && rd.dayofweek === 0) {
							return true;
						}
					}
				}
				return false;
			};
			var p_rule;
			for (var i = 0; i < market.rules.length; i++) {
				var rule = JSON.parse(JSON.stringify(market.rules[i]));
				if (typeof rule.open === 'undefined' &&
					typeof rule.close === 'undefined') {
					rule.open = '00:00';
					rule.close = '00:00';
				}
				if (! rule.hasOwnProperty('name')) {
					rule.name = null;
				}
				try {
					var rd;
					if (typeof rule.dayofweek !== 'undefined') {
						rule.year = "*";
						rd = _TimeSegmentS._createDayOfWeekSegment(market, rule);
						if (p_rule) {
							if (p_rule.dayofweek === rd.dayofweek) {
								//These links are used for finding open and close times
								//On the same day in multiple sessions
								p_rule.child_ = rd;
								rd.parent_ = p_rule;
							} else {
								if (link_adjacent(p_rule, rd)) {
									//These links are used for finding open and close
									//times for sessions that span days
									p_rule.adjacent_child = rd;
									rd.adjacent_parent = p_rule;
								}
							}
						}
						p_rule = rd;
					} else if (typeof rule.date !== 'undefined') {
						rule.isDayOfWeek = false;
						rule.dayofweek = -1;
						rd = _TimeSegmentS._createDateTimeSegement(market, rule);
					} else {
						console.log('Error, unknown rule type ' + rule);
					}
					if (market.enabled_by_default) {
						for (var x = 0; x < market.enabled_by_default.length; x++) {
							var n = market.enabled_by_default[x];
							if (rd.name === n) {
								rd.enabled = true;
								break;
							}
						}
					} else {
						//always enabled if no defaults are defined
						//rd.enabled = true;
					}
				} catch (err) {
					console.log('Error, creating market rules ' + err);
				}
			}
		};

		/**
		 * Internal static utility methods used to create market time segments.
		 */
		STX.Market._timeSegment = {};
		var _TimeSegmentS = STX.Market._timeSegment;
		
		_TimeSegmentS.re_wild_card_iso = /^(\*)-(\d\d)-(\d\d)$/;
		_TimeSegmentS.re_regular_iso = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
		_TimeSegmentS.re_split_hours_minutes = /^(\d\d):(\d\d)$/;
		_TimeSegmentS.re_split_hour_minutes = /^(\d):(\d\d)$/;
		
		/**
		 * Create a hash code for a string. We may move this to 3rd party later if
		 * we find a wider need for it. This came from Stackoverflow and claims to be
		 * the same implementation used by Java.
		 * @param {String} str A string.
		 * @return {Integer} A number suitable for
		 */
		_TimeSegmentS._hashCode = function(str) {
			var hash = 0, i, chr, len;
			if (str.length === 0) return hash;
			for (i = 0, len = str.length; i < len; i++) {
				chr   = str.charCodeAt(i);
				hash  = ((hash << 5) - hash) + chr;
				hash |= 0; // Convert to 32bit integer
			}
			return hash;
		};
		
		/**
		 * Split the hours and minutes from a json time segment rule.
		 * @param {String} str \d\d:\d\d or \d:\d\d
		 * @return {Object} {minutes:int, hours:int}
		 */
		_TimeSegmentS._splitHoursMinutes = function(str) {
			var parts = _TimeSegmentS.re_split_hour_minutes.exec(str);
			var ret_val = {'hours': NaN, 'minutes': NaN};
			if (parts === null) {
				parts = _TimeSegmentS.re_split_hours_minutes.exec(str);
				if (parts === null) {
					return ret_val;
				}
			}
			ret_val.hours = parseInt(parts[1], 10);
			ret_val.minutes = parseInt(parts[2], 10);
			return ret_val;
		};
		
		/**
		 * Create a time segment for some day of the week. This creates a wildcard
		 * segment that matches the same weekday in any month and any year.
		 * @param {object} market The instance of this market
		 * @param {object} rule Represents the data from one rule in the JSON
		 * configuration.
		 */
		_TimeSegmentS._createDayOfWeekSegment = function(market, rule) {
			var data = {
				'name': rule.name,
				'isDayOfWeek': true,
				'dayofweek': rule.dayofweek,
				'date_str': '*',
				'open_parts': _TimeSegmentS._splitHoursMinutes(rule.open),
				'close_parts': _TimeSegmentS._splitHoursMinutes(rule.close),
				'open': _TimeSegmentS._secSinceMidnight(market, rule.open, true),
				'close': _TimeSegmentS._secSinceMidnight(market, rule.close, false),
				'child_': false,
				'parent_': false,
				'adjacent_child': false,
				'adjacent_parent': false,
				'enabled': false
			};
			if (data.name === null) {
				data.enabled = true;
			}
			data.hash_code = this._hashCode((data.open + data.close).toString());
			market.normalHours.push(data);
			return data;
		};
		
		/**
		 * Create a time segement for a specific date and time. This can also create
		 * a wild card segement that matches any year with a specific day and specific
		 * month. For example *-12-25 to match all Christmas days. It can also build
		 * any specific year month day open close time that will only match that
		 * specific range.
		 * @param {Object} market an instance of a market
		 * @param {Object} rule a single rule from a market definition
		 * @return Nothing this function works on the market object.
		 */
		_TimeSegmentS._createDateTimeSegement = function(market, rule) {
			var pieces = this.re_regular_iso.exec(rule.date);
			var year;
			if (pieces === null) {
				pieces = this.re_wild_card_iso.exec(rule.date);
				if (pieces === null) {
					console.log('Warning: invalid date format on rule -> ' + rule.date);
					return;
				}
				year = '*'; //all years
			} else {
				year = parseInt(pieces[1], 10);
			}
			var data = {
				'name': rule.name,
				'isDayOfWeek': false,
				'dayofweek': -1,
				'year': year,
				'month': parseInt(pieces[2], 10),
				'day': parseInt(pieces[3], 10),
				'date_str': rule.date,
				'open_parts': _TimeSegmentS._splitHoursMinutes(rule.open),
				'close_parts': _TimeSegmentS._splitHoursMinutes(rule.close),
				'open': _TimeSegmentS._secSinceMidnight(market, rule.open, true),
				'close': _TimeSegmentS._secSinceMidnight(market, rule.close, false),
				'enabled': false
			};
			if (data.name === null) {
				data.enabled = true;
			}
			data.hash_key = this._hashCode(data.date_str + data.open + data.close);
			market.extraHours.push(data);
			return data;
		};
		
		/**
		 * Calculate the seconds since midnight for some time string. These time strings
		 * come from the market definition. These are intended to be open and close
		 * times.
		 * @param {Object} market An instance of a market
		 * @param {string} time_str A time string like this "\d\d:\d\d"
		 * @param {Boolean} open_time If true the time is used for opening a market
		 * otherwise the time is used for closing a market. This is so that we can
		 * handle 00:00 and 24:00.
		 */
		_TimeSegmentS._secSinceMidnight = function(market, time_str, open_time) {
			var parts = time_str.split(':');
			var hours = parseInt(parts[0], 10);
			var minutes = parseInt(parts[1], 10);
			var seconds = (hours * 60 * 60) + (minutes * 60);
			
			if (! open_time) {
				if (hours === 24) {
					seconds = (hours * 60 * 60) + 1;
				}
			}
			return seconds;
		};
		
		/**
		 * Converts from the given timezone into the market's native time zone
		 * If no market zone is present, the date will be returned un changed.
		 * @param  {Date} dt JavaScript Date
		 * @param  {String} [tz] timezoneJS timezone, or null to indicate browser localtime/UTC (dataZone)
		 * @return {Date}    A JavaScript Date offset by the timezone change
		 */
		STX.Market.prototype._convertToMarketTZ = function(dt, tz){
			if(!this.market_tz) return dt;
			var tzdt;
			if(tz){
				tzdt=new this.tz_lib(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds(), tz);
			}else{
				tzdt=new this.tz_lib(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
			}
			if(tzdt.setTimezone) tzdt.setTimezone(this.market_tz);
			return new Date(tzdt.getFullYear(), tzdt.getMonth(), tzdt.getDate(), tzdt.getHours(), tzdt.getMinutes(), tzdt.getSeconds(), tzdt.getMilliseconds());
		};
		
		/**
		 * Converts to the given timezone from the market's native time zone.
		 * If no market zone is present, the date will be returned un changed.
		 * @param  {Date} dt JavaScript Date
		 * @param  {String} [tz] timezoneJS timezone, or null to indicate browser localtime/UTC (displayZone)
		 * @return {Date}    A JavaScript Date offset by the timezone change
		 */
		STX.Market.prototype._convertFromMarketTZ = function(dt, tz){
			if(!this.market_tz) return dt;
			var tzdt=new this.tz_lib(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds(), this.market_tz);
			if(tz){
				if(tzdt.setTimezone) tzdt.setTimezone(tz);
			}else{
				return new Date(tzdt.getTime());
			}
			return new Date(tzdt.getFullYear(), tzdt.getMonth(), tzdt.getDate(), tzdt.getHours(), tzdt.getMinutes(), tzdt.getSeconds(), tzdt.getMilliseconds());
		};
		
		/**
		 * Builds an iterator instance and returns it to the requesting market when {@link STX.Market#newIterator} is called. Do not call this constructor directly.
		 * 
		 * @name STX.Market.Iterator
		 * @constructor
		 * @since 04-2016-08
		 * @example
		    var market24=new STX.Market();
		    var iter_parms = {
		        'begin': stxx.chart.dataSet[stxx.chart.dataSet.length-1],	// last item on the dataset
		        'interval': stxx.layout.interval,
		        'periodicity': stxx.layout.periodicity,
		        'timeUnit': stxx.layout.timeUnit,
		        'inZone': stxx.dataZone,
		        'outZone': stxx.dataZone
		    };
		    var iter = market24.newIterator(iter_parms);
		    var next = iter.next();
		 * 
		 */
		STX.Market.Iterator = function(parms) {
			this.market = parms.market;
			this.begin = parms.begin;
			this.interval = parms.interval;
			this.multiple = parms.multiple;
			this.inZone = parms.inZone;
			this.outZone = parms.outZone;
			this.clock = new STX.Market.Iterator._Clock(
				parms.market, parms.interval, parms.multiple);
		    this.intraDay = this.clock.intra_day;
			this.begin=this.market._convertToMarketTZ(this.begin, parms.inZone);
			this.clock._setStart(this.begin);
			this.clock.minutes_aligned = false;
		};
		
		/**
		 * Returns the current date of the iterator without moving forwards or backwards.
		 * Takes into account display zone settings.
		 * @return {Date} The current date of the iterator.
		 * @memberOf STX.Market.Iterator
		 * @since 04-2016-08
		 * @example
		 * iteratorDate = iter.date();
		 */
		STX.Market.Iterator.prototype.date = function() {
			return this.clock._date();
		};
		
		/**
		 * Calculate the number of ticks from begin date to end date taking into account
		 * market open, close, and holidays. 
		 * If the end date is older than the begin date,it will work backward into the past. 
		 * If the end date is newer than the begin date,it will work forward into the future. 
		 * Note that the begin date is set when this
		 * instance of the iterator is created and one should NOT call `previous` or `next`
		 * before calling this function, or the 'begin' pointer will change.
		 * @param {Date} parms.end An end date. Will be assumed to be `inZone` if one set.
		 * @param {Integer} [parms.sample_size] Default is 25. Maximum amount of time 
		 * (in milliseconds) taken to count ticks. If sample size is
		 * reached before the number of ticks is found the number of ticks will be
		 * estimated mathematically. The bigger the sample size couple with the
		 * distance between begin date and end date affect how precise the return value
		 * is.
		 * @param {Integer} [parms.sample_rate] Default is 1000. Maximum number of ticks to evaluate before checking `parms.sample_size`.
		 * @return {Integer} The number of ticks between begin and end.
		 * @memberOf STX.Market.Iterator
		 * @since 04-2016-08
		 * @example
		 * // find out how many ticks in the past a date is from the beginning of the dataSet 
		 * // (assumes the target date is older than the first dataSet item)
		 *	var iter = this.standardMarketIterator(chart.dataSet[0].DT);
		 *	var ticks=iter.futureTick({someRandomDate});
		 */
		STX.Market.Iterator.prototype.futureTick = function(parms) {
			this.clock.skip = 1;
			var ticks = 0;
			var end = this.market._convertToMarketTZ(parms.end, this.inZone).getTime();
			var begin = this.clock.ctime;
			if (end === begin) {
				return ticks;
			}
			var sample_size = 2; //milliseconds // May not be necessary at all. Looks accurate whenever past 1,000 ticks into future
			var sample_rate = 1000; //iterations
			var sample_ctr = 0;
			if (parms.sample_size) {
				sample_size = parms.sample_size;
			}
			var start = new Date().getTime();
			var now;
			var ave;
			if (end > begin) {
				this.clock.forward = true;
				while (this.clock.ctime < end) {
					ticks += 1;
					sample_ctr += 1;
					this.clock._findNext();
					if (sample_ctr === sample_rate) {
						sample_ctr = 0;
						now = new Date().getTime();
						if ((now - start) >= sample_size) {
							ave = (this.clock.ctime - begin) / ticks;
							ticks = Math.floor((end - begin) / ave);
							break;
						}
					}
				}
			} else {
				this.clock.forward = false;
				while (this.clock.ctime > end) {
					ticks += 1;
					sample_ctr += 1;
					this.clock._findPrevious();
					if (sample_ctr === sample_rate) {
						sample_ctr = 0;
						now = new Date().getTime();
						if ((now - start) >= sample_size) {
							ave = (begin - this.clock.ctime) / ticks;
							ticks = Math.floor((begin - end) / ave);
							break;
						}
					}
				}
			}
			return ticks;
		};
		
		/**
		 * As a convenience exposed on an instance of an iterator.
		 * @return {Boolean} true if this market is hour aligned.
		 * @memberOf STX.Market.Iterator
		 * @since 04-2016-08
		 */
		STX.Market.Iterator.prototype.isHourAligned = function() {
			return this.market.isHourAligned();
		};
		
		/**
		 * Check and see if this Market is open now.
		 * @return {Boolean} true or false
		 * @memberOf STX.Market.Iterator
		 * @since 04-2016-08
		 */
		STX.Market.Iterator.prototype.isOpen = function() {
			return this.market.isOpen();
		};
		
		/**
		 * Move the iterator one interval forward
		 * @param {Integer} [skip] Default 1. Jump forward skip * periodicity at once.
		 * @return {Date} Next date in iterator `outZone`.
		 * @alias next
		 * @memberOf STX.Market.Iterator
		 * @since 04-2016-08
		 * @example
		 * now = iter.next();
		 */
		STX.Market.Iterator.prototype.next = function(skip) {
			this.clock.skip = 1;
			if (skip) {
				this.clock.skip = skip;
			}
			this.clock.forward = true;
			for(var i=0;i<this.clock.skip;i++)
				this.begin = this.clock._findNext();
		    if(this.intraDay || this.market.convertOnDaily){
				return this.market._convertFromMarketTZ(
					this.clock.display_date, this.outZone);
			}else{
				return this.clock.display_date;
			}
		};
		
		/**
		 * Does not move the iterator. Takes into account display zone settings.
		 * Note. This is a convenience function for debugging or whatever else, but
		 * should not be called in the draw loop in production.
		 * @return {String} The current date of the iterator as a string.
		 * @memberOf STX.Market.Iterator
		 * @since 04-2016-08
		 * @private
		 */
		STX.Market.Iterator.prototype.peek = function() {
			return this.clock._peek();
		};
		
		/**
		 * Move the iterator one interval backward
		 * @param {Integer} skip Default is one. Move this many multiples of interval.
		 * @return {Date} Previous date in iterator `outZone`.
		 * @alias previous
		 * @memberOf STX.Market.Iterator
		 * @since 04-2016-08
		 * @example
		 * now = iter.previous();
		 */
		STX.Market.Iterator.prototype.previous = function(skip) {
			this.clock.skip = 1;
			if (skip) {
				this.clock.skip = skip;
			}
			this.clock.forward = false;
			for(var i=0;i<this.clock.skip;i++)
				this.begin = this.clock._findPrevious();
		    if (this.intraDay || this.market.convertOnDaily) {
				return this.market._convertFromMarketTZ(
					this.clock.display_date, this.outZone);
			} else {
				return this.clock.display_date;
			}
		};
		
		/**
		 * Internal object that simulates a clock that ticks forward and backwards
		 * at different intervals. Used internally by the iterator and not intended
		 * to be used outside of the context of a Market.
		 * @param {Object} market An instance of market.
		 * @param {string} interval minute, hour, day, week or month
		 * @param {Integer} multiple Move in mulitple of intervals.
		 */
		STX.Market.Iterator._Clock = function(market, interval, multiple) {
			this.market = market;
			this.interval = interval;
			this.multiple = multiple;
			this.intra_day = false;
			this.intervals = [];
			this.max_iters = 10080; //max minutes to check for rules. (one week);
			this.MINUTE_MILLIS = 1000 * 60;
			this.HOUR_MILLIS = this.MINUTE_MILLIS * 60;
			this.DAY_MILLIS = this.HOUR_MILLIS * 24;
			if (interval === 'today') {
				interval = STX.Market.DAY;
			}
			if (interval === STX.Market.MILLISECOND || interval === 'milliseconds') {
				this._findNext = this._millisImpl;
				this._findPrevious = this._millisImpl;
				this.intra_day = true;
				this.tick_time = 1 * this.multiple; //small as we can go
			} else if (interval === STX.Market.SECOND || interval === 'seconds') {
				this._findNext = this._secondImpl;
				this._findPrevious = this._secondImpl;
				this.intra_day = true;
				this.tick_time = 1000 * this.multiple;
			} else if (interval === STX.Market.MINUTE || interval === 'minutes') {
				this._findNext = this._minuteImpl;
				this._findPrevious = this._minuteImpl;
				this.intra_day = true;
				this.tick_time = this.MINUTE_MILLIS * this.multiple;
			} else if (interval === STX.Market.HOUR || interval === 'hours') {
				this._findNext = this._hourImpl;
				this._findPrevious = this._hourImpl;
				this.intra_day = true;
				this.tick_time = this.HOUR_MILLIS * this.multiple;
			} else if (interval === STX.Market.DAY || interval === 'days') {
				this._findNext = this._dayImpl;
				this._findPrevious = this._dayImpl;
				this.tick_time = this.DAY_MILLIS * this.multiple;
			} else if (interval === STX.Market.WEEK || interval === 'weeks') {
				this._findNext = this._weekImpl;
				this._findPrevious = this._weekImpl;
				this.tick_time = (this.DAY_MILLIS * 7) * this.multiple;
			} else if (interval === STX.Market.MONTH || interval === 'months') {
				this._findNext = this._monthImpl;
				this._findPrevious = this._monthImpl;
				this.tick_time = (this.DAY_MILLIS * 30) * this.multiple;
			} else {
				console.log('Periodicity ERROR: "'+interval+'" is not a valid interval. Please see setperiodcityV2() for details.' );
			}
		};
		
		//Save me some carpal tunnel please.
		var _ClockP = STX.Market.Iterator._Clock.prototype;
		
		/**
		 * Calculate how many minutes in some time span. Assumes hours are 24 hour
		 * format.
		 * 
		 * NOTE! Does not know how to jump a 24 hour period, assumes that
		 * o_hour is always less then c_hour on the same day.
		 * 
		 * This could be done with two dates instead and remove the limitations. Not
		 * sure if that is necessary at this point. We don't actually have two date
		 * objects at the point that we need this number. It would take some doin to
		 * figure out the date objects that would be needed.
		 */
		_ClockP._total_minutes = function(o_hour, o_min, c_hour, c_min) {
			//the parens are important in this case
			return (((c_hour - o_hour) * 60) - o_min) + c_min;
		};
		
		
		/**
		 * Create an array of minutes from the open minute to the close minute at
		 * some periodictiy. This array will run the entire time of the last segment
		 * time segment matched.
		 */
		_ClockP._alignMinutes = function() {
			//TODO maybe need some caching here.
			if (this.market.zopen_minute === undefined) {
				return [];
			}
			var o_min = this.market.zopen_minute;
			var total_minutes = this._total_minutes(this.market.zopen_hour, o_min,
				this.market.zclose_hour, this.market.zclose_minute);
			var periods = [];
			var next_minute = 0;
			while (next_minute < total_minutes) {
				periods.push(o_min + next_minute);
				next_minute += this.multiple;
			}
			return periods;
		};
		
		/**
		 * Create an array of second boundaries. This only needs to be done once
		 * per clock instance.
		 * @param {Integer} The high end of the range before wrapping back to zero.
		 * Example for seconds this would be 60.
		 */
		_ClockP._alignBaseZero = function(max) {
			var base = 0;
			var periods = [base];
			while (true) {
				base += this.multiple;
				if (base >= max) {
					break;
				}
				periods.push(base);
			}
			return periods;
		};
		
		/**
		 * Turn this instance of the clock into a date object at the current
		 * date time.
		 * @return {Date} A new Date object.
		 */
		_ClockP._date = function() {
			var current_date = new Date(this.ctime);
		
			if (this.intra_day) {
				this.display_date = new Date(this.ctime + this.shift_millis);
			} else {
				this.display_date = current_date;
			}
		
			return current_date;
		};
		
		/**
		 * Find the boundary for minutes, seconds or milliseconds.
		 * @param {Array} periods A pre calculated list of boundaries.
		 * @param {Integer} search_for Any number to align.
		 * @return {Integer} one of the boundaries in the array.
		 */
		_ClockP._alignToBoundary = function(periods, search_for) {
			var low = 0;
			var high = 0;
			var result = search_for;
		
			for (var ctr = 0; ctr < periods.length - 1; ctr++) {
				low = periods[ctr];
				high = periods[ctr + 1];
				if (search_for === low || search_for === high) {
					break; //already aligned;
				}
				if (search_for > low && search_for < high) {
					result = low;
					break;
				} else if (ctr + 1 === periods.length - 1) { //wrap around gap
					result = high;
				}
			}
			return result;
		};
		
		/**
		 * Convenience for debugging.
		 */
		_ClockP._peek = function() {
			return this._date().toString();
		};
		
		/**
		 * When searching for open days look in hour increments.
		 * Inverted.
		 */
		_ClockP._seekHr = function() {
			if (this.forward) {
				this.ctime -= this.HOUR_MILLIS;
			} else {
				this.ctime += this.HOUR_MILLIS;
			}
		};
		
		/**
		 * Set this instance of the iterator clock to some date. Calls to next or
		 * previous will move the clock some interval from this point in time.
		 * @param {Date} date Any javascript date.
		 */
		_ClockP._setStart = function(date) {
			var millis = this.market._tzDifferenceMillis(
		        date);
			var shift_date = new Date(date.getTime() + millis);
			this.shift_millis = millis;
			this.ctime = shift_date.getTime();
			// Terry override timezone shift
			this.shift_millis = 0;
			this.ctime = date.getTime();
		};
		
		/**
		 * Regular clock move
		 */
		_ClockP._tickTock = function() {
			if (this.forward) {
				//this.ctime += (this.tick_time * this.skip);
				this.ctime += this.tick_time;
			} else {
				//this.ctime -= (this.tick_time * this.skip);
				this.ctime -= this.tick_time;
			}
		};
		
		/**
		 * Inverted clock move
		 */
		_ClockP._tockTick = function() {
			if (this.forward) {
				//this.ctime -= (this.tick_time * this.skip);
				this.ctime -= this.tick_time;
			} else {
				//this.ctime += (this.tick_time * this.skip);
				this.ctime += this.tick_time;
			}
		};
		
		/**
		 * Move a day at a time. Useful for finding the first open day
		 * of a week or month. Always moves forward.
		 */
		_ClockP._tickTock24 = function() {
			this.ctime += this.DAY_MILLIS;
		};
		
		/**
		 * Move a day at a time inverted. Useful for finding Sunday when
		 * moving by weeks. Always moves backwards.
		 */
		_ClockP._tockTick24 = function() {
			this.ctime -= this.DAY_MILLIS;
		};
		
		/**
		 * Wind the clock to the next open market time. If the market is already open
		 * then don't move. Break out of the loop after max_iters regardless.
		 * @param was_open Function. Intraday or daily function to see if the market
		 * was open.
		 * @param wind Function. _tockTick (inverted) or _tickTock (regular)
		 */
		_ClockP._windMaybe = function(was_open, wind) {
			var max = 0;
			var working_date = new Date(this.ctime);
			var moved = false;
			while (!was_open.call(this.market, working_date)) {
				wind.call(this);
				moved = true;
				working_date = new Date(this.ctime);
				max += 1;
				if (max > this.max_iters) {
					var m = 'Warning! max iterations (' + this.max_iters;
					m += ') reached with no rule match.';
					console.log(m);
					break;
				}
			}
			return moved;
		};
		
		/**
		 * Move the clock some number of milliseconds
		 */
		_ClockP._millisImpl = function() {
			if (!this.mperiods_aligned) {
				var periods = this._alignBaseZero(1000);
				var current_date = new Date(this.ctime);
				var current_millis = current_date.getMilliseconds();
				current_millis = this._alignToBoundary(periods, current_millis);
				current_date.setMilliseconds(current_millis);
				this.ctime = current_date.getTime();
				this.mperiods_aligned = true;
			}
			this._tickTock();
			return this._date();
		};
		
		/**
		 * Move the clock some number of seconds
		 */
		_ClockP._secondImpl = function() {
			if (!this.speriod_aligned) {
				var periods = this._alignBaseZero(60);
				var current_date = new Date(this.ctime);
				var current_second = current_date.getSeconds();
				current_second = this._alignToBoundary(periods, current_second);
				current_date.setSeconds(current_second);
				current_date.setMilliseconds(0);
				this.ctime = current_date.getTime();
				this.speriod_aligned = true;
			}
			this._tickTock();
			return this._date();
		};
		
		/**
		 * Move the clock some number of minutes. Takes into account market start time
		 * and could change alignment each time it is called.
		 * @return {Date}
		 */
		_ClockP._minuteImpl = function() {
			var closed = this._windMaybe(this.market._wasOpenIntraDay, this._tockTick);
			var current_date = new Date(this.ctime);
			var current_minute = current_date.getMinutes();
			var current_hour = current_date.getHours();
			var periods = this._alignMinutes(); //takes into account market start time
			var boundary_min = this._total_minutes(
				this.market.zopen_hour, this.market.zopen_minute,
				current_hour, current_minute) + this.market.zopen_minute;
			if (closed) {
				if (this.forward) {
					boundary_min = periods[periods.length - 1];
				} else {
					boundary_min = periods[0];
				}
			} else {
				boundary_min = this._alignToBoundary(periods, boundary_min);
			}
			current_hour = Math.floor(boundary_min / 60) + this.market.zopen_hour;
			current_date.setHours(current_hour);
			current_date.setMinutes(boundary_min % 60);
			current_date.setSeconds(0);
			current_date.setMilliseconds(0);
			this.ctime = current_date.getTime(); //boundary aligned
			this._tickTock(); //move once
			if (this._windMaybe(this.market._wasOpenIntraDay, this._tickTock)) {
				if (this.forward) {
					current_date = new Date(this.ctime);
					current_date.setMinutes(this.market.zopen_minute);
					current_date.setHours(this.market.zopen_hour);
					this.ctime = current_date.getTime();
				} else {
					current_date = new Date(this.ctime);
					periods = this._alignMinutes();
					var last_boundary = periods[periods.length - 1];
					current_date.setMinutes(last_boundary % 60);
					current_date.setHours(
						Math.floor(last_boundary / 60) + this.market.zopen_hour);
					this.ctime = current_date.getTime();
				}
			}
			return this._date();
		};
		
		/**
		 * Move the clock some number of hours.
		 * @return {Date}
		 */
		_ClockP._hourImpl = function() {
			this._windMaybe(this.market._wasOpenIntraDay, this._tockTick);
			var current_time = new Date(this.ctime);
			if (this.market.isHourAligned()) {
				current_time.setMinutes(0);
			} else {
				current_time.setMinutes(this.market.zopen_minute);
			}
			current_time.setSeconds(0);
			current_time.setMilliseconds(0);
			this.ctime = current_time.getTime(); //boundary aligned
			this._tickTock(); //move once
			this._windMaybe(this.market._wasOpenIntraDay, this._tickTock);
			return this._date();
		};
		
		/**
		 * Move the clock some number of days.
		 * @return {Date}
		 */
		_ClockP._dayImpl = function() {
			this._windMaybe(this.market._wasOpenDaily, this._seekHr);
			var current_date = new Date(this.ctime); //closest open day
		    current_date.setHours(current_date.getHours()+1); //DST adjust
			current_date.setHours(0);
			current_date.setMinutes(0);
			current_date.setSeconds(0);
			current_date.setMilliseconds(0);
			this.ctime = current_date.getTime(); //boundary aligned
			var ctr = 0;
			while (ctr < this.multiple) {
				if (this.forward) {
					this._tickTock24();
				} else {
					this._tockTick24();
				}
				if (!this.market._wasOpenDaily(this._date())) {
					continue;
				}
				ctr += 1;
			}
			return this._date();
		};
		
		/**
		 * Move the clock some number of weeks.
		 * @return {Date}
		 */
		_ClockP._weekImpl = function() {
			this._tickTock(); // move once
		
			//Move to Sunday
			var current_date = new Date(this.ctime);
			while (current_date.getDay() !== 0) {
				this._tockTick24();
				current_date = new Date(this.ctime);
			}
		
			//now align to first open day of week.
			this._windMaybe(this.market._wasOpenDaily, this._tickTock24);
			current_date = new Date(this.ctime);
			current_date.setHours(0);
			current_date.setMinutes(0);
			current_date.setSeconds(0);
			current_date.setMilliseconds(0);
			this.ctime = current_date.getTime(); //boundary aligned;
			return this._date();
		};
		
		/**
		 * Move the clock some number of months
		 * @return {Date}
		 */
		_ClockP._monthImpl = function() {
		
			//Allow some room to account for different lengths of months.
			var current_date = new Date(this.ctime);
			current_date.setDate(15);
			this.ctime = current_date.getTime();
		
			this._tickTock(); // move once
			current_date = new Date(this.ctime);
		
			//Now re align back to the first day of the month
			current_date.setDate(1);
			this.ctime = current_date.getTime();
		
			//Now find the first open day of month
			this._windMaybe(this.market._wasOpenDaily, this._tickTock24);
			current_date = new Date(this.ctime);
			current_date.setHours(0);
			current_date.setMinutes(0);
			current_date.setSeconds(0);
			current_date.setMilliseconds(0);
			this.ctime = current_date.getTime(); //boundary aligned;
			return this._date();
		};
		
		/**
		 * Search forward for the next market open
		 * @param {Date} date Some begin date.
		 * @param {Integer} skip The number of intervals to move. Defaults
		 * to one.
		 * @return {Date} A new date that has been set to the previous open of the
		 * market.
		 */
		_ClockP._findNext = null;
		
		/**
		 * Search backward for the next market open
		 * @param {Date} date Some begin date.
		 * @param {Integer} skip The number of intervals to move. Defaults
		 * to one.
		 * @return {Date} A new date that has been set to the previous open of the
		 * market.
		 */
		_ClockP._findPrevious = null;
		//end market Please leave comment

		/**
		 * Converts a Date object from one time zone to another using the timezoneJS.Date library
		 * @param  {Date} dt                    Original JavaScript Date object, from the original time zone
		 * @param  {string} originalTimeZone    The original time zone
		 * @param  {string} targetTimeZone      The target time zone
		 * @return {timezoneJS.Date}            The date in the target timezone. This behaves the same as a native Date.
		 * @memberOf STX
		 */
		STX.convertTimeZone=function(dt, originalTimeZone, targetTimeZone){
			// Convert from original timezone to local time
			var newDT=new timezoneJS.Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds(), originalTimeZone);

			// Convert from local time to new timezone
			newDT.setTimezone(targetTimeZone);
			return newDT;
		};

		/**
		 * This method converts a time from another timezone to local time on the browser
		 * @param  {Date} dt               The original time
		 * @param  {string} originalTimeZone A valid timezone
		 * @return {Date}                  The date converted to local time
		 * @memberOf STX
		 */
		STX.convertToLocalTime=function(dt, originalTimeZone){
			var seconds=dt.getSeconds();
			var milliseconds=dt.getMilliseconds();
			var newDT=new timezoneJS.Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes(), originalTimeZone);
			return new Date(newDT.getTime() + seconds*1000 + milliseconds);
		};


		/**
		 * Namespace for functionality related to studies (aka indicators)
		 * @namespace
		 * @name  STX.Studies
		 */
		STX.Studies=function(){};

		/**
		 * Array of study outputs which should be considered valid fields in the study dialog "Field" dropdown".
		 * This is autopopulated from {@link STX.Studies.displayStudies}.
		 * @type {Array}
		 * @memberOf STX.Studies
		 */
		STX.Studies.actualOutputs=[];

		/**
		 * Maps the names of studies to the panel that they are drawn on. For instance, a moving average may be drawn on an RSI panel
		 * @type {Object}
		 * @memberOf STX.Studies
		 */
		STX.Studies.studyPanelMap={};
		STX.Studies.colorPickerDiv=null;

		/**
		 * A study descriptor contains all of the information necessary to instantiate a study.
		 * @param {string} name       The name of the study. This should be unique to the chart. For instance if there are two RSI panels then they should be of different periods and named accordingly. Usually this is determined automatically by the library.
		 * @param {string} type       The type of study, which can be used as a look up in the StudyLibrary
		 * @param {string} panel      The name of the panel that contains the study
		 * @param {object} inputs     Names and values of input fields
		 * @param {object} outputs    Names and values (colors) of outputs
		 * @param {object} parameters Additional parameters that are unique to the particular study
		 * @memberOf STX.Studies
		 */
		STX.Studies.StudyDescriptor=function(name, type, panel, inputs, outputs, parameters){
			this.name=name;
			this.type=type;
			this.panel=panel;
			this.inputs=inputs;
			this.outputs=outputs;
			this.libraryEntry=STX.Studies.studyLibrary[type];
			if(this.libraryEntry){
				if(typeof(this.libraryEntry.inputs)=="undefined") this.libraryEntry.inputs={"Period":14};
				if(typeof(this.libraryEntry.outputs)=="undefined") this.libraryEntry.outputs={"Result":"auto"};
			}else{
				this.libraryEntry={};
				if(panel=="chart" || (parameters && parameters.chartName=="chart")) this.libraryEntry.overlay=true;
			}
			this.outputMap={};	// Maps dataSet label to outputs label "RSI (14)" : "RSI", for the purpose of figuring color
			this.min=null;
			this.max=null;
			this.parameters=parameters;	// Optional parameters, i.e. zones
		};

		/**
		 * Automatically generates a unique name for the study instance. If a translation callback has been associated with the chart
		 * object then the name of the study will be translated.
		 * @param  {object} stx       A chart object
		 * @param  {string} studyName Type of study
		 * @param  {object} inputs    The inputs for this study instance
		 * @param {string} [replaceID] If it matches then return the same id
		 * @return {string}           A unique name for the study
		 * @memberOf STX.Studies
		 */
		STX.Studies.generateID=function(stx, studyName, inputs, replaceID){
			var translatedStudy=studyName;
			if(stx) translatedStudy=stx.translateIf(translatedStudy);
			if(STX.isEmpty(inputs)) return translatedStudy;
			if(STX.Studies.studyLibrary[studyName].customRemoval) return studyName;  //therefore only one instance can exist at a time
			id=translatedStudy + " (";
			var first=false;
			for(var field in inputs){
				if(field=="Shading") continue;  //this does not merit being in the studyname
				var val=inputs[field];
				if(val=="field") continue; // skip default, usually means "Close"
				if(!first){
					first=true;
				}else{
					id+=",";
				}
				id+=val;
			}
			id+=")";

			//this tests if replaceID is just a warted version of id, int that case keep the old id
			if(replaceID && replaceID.indexOf(id)===0) return replaceID;

			// If the id already exists then we'll wart it by adding -N
			if(stx.layout.studies && stx.layout.studies[id]){
				for(var i=2;i<50;i++){
					var warted=id+"-"+i;
					if(warted==replaceID) return warted;
					if(!stx.layout.studies[warted]){
						id=warted;
						break;
					}
				}
			}
			return id;
		};

		/**
		 * Generates an object that can be used to create a theme dialog. The initial
		 * values contain the existing values in the current chart.
		 * Simply have your dialog modify these values and then call the method update();
		 *
		 * Note that the chart has many granular customizations beyond what this theme
		 * helper produces. These can be manipulated in the CSS. This helper simplifies
		 * and consolidates into a manageable dialog.
		 * 
		 * @param {Object} params Parameters
		 * @param {STX.STXChart} params.stx A chart object
		 * @example
		 * var helper=new STX.ThemeHelper({stx:stx});
		 * console.log(helper.settings);
		 * helper.settings.chart["Grid Lines"].color="rgba(255,0,0,.5)";
		 * helper.update();
		 */
		STX.ThemeHelper=function(params){
			this.params=params;
			var stx=params.stx;
			var backgroundColor="#FFFFFF";
			if(stx.chart.container){
				backgroundColor=getComputedStyle(stx.chart.container)["backgroundColor"];
				if(STX.isTransparent(backgroundColor)) backgroundColor=stx.containerColor;
			}
			this.settings.chart.Background.color=STX.hexToRgba(backgroundColor);
			this.settings.chart["Grid Lines"].color=STX.hexToRgba(stx.canvasStyle("stx_grid").color);
			this.settings.chart["Grid Dividers"].color=STX.hexToRgba(stx.canvasStyle("stx_grid_dark").color);
			this.settings.chart["Axis Text"].color=STX.hexToRgba(stx.canvasStyle("stx_xaxis").color);

			this.settings.chartTypes["Candle/Bar"].up.color=STX.hexToRgba(stx.canvasStyle("stx_candle_up").color);
			
			this.settings.chartTypes["Candle/Bar"].down.color=STX.hexToRgba(stx.canvasStyle("stx_candle_down").color);
			this.settings.chartTypes["Candle/Bar"].up.wick=STX.hexToRgba(stx.canvasStyle("stx_candle_shadow_up").color);
			this.settings.chartTypes["Candle/Bar"].down.wick=STX.hexToRgba(stx.canvasStyle("stx_candle_shadow_down").color);
			this.settings.chartTypes["Candle/Bar"].up.border=STX.hexToRgba(stx.canvasStyle("stx_candle_up").borderLeftColor);
			this.settings.chartTypes["Candle/Bar"].down.border=STX.hexToRgba(stx.canvasStyle("stx_candle_down").borderLeftColor);
			if(STX.isTransparent(stx.canvasStyle("stx_candle_up").borderLeftColor)) this.settings.chartTypes["Candle/Bar"].up.border=null;
			if(STX.isTransparent(stx.canvasStyle("stx_candle_down").borderLeftColor)) this.settings.chartTypes["Candle/Bar"].down.border=null;

			this.settings.chartTypes["Line"].color=STX.hexToRgba(stx.canvasStyle("stx_line_chart").color);

			this.settings.chartTypes["Mountain"].color=STX.hexToRgba(stx.canvasStyle("stx_mountain_chart").backgroundColor);
		};

		STX.ThemeHelper.prototype.settings={
			"chart":{
				"Background":{
					"color":null
				},
				"Grid Lines":{
					"color":null
				},
				"Grid Dividers":{
					"color":null
				},
				"Axis Text":{
					"color":null
				}
			},
			"chartTypes":{
				"Candle/Bar":{
					"up":{
						"color":null,
						"wick":null,
						"border":null
					},
					"down":{
						"color":null,
						"wick":null,
						"border":null
					}
				},
				"Line":{
					"color":null
				},
				"Mountain":{
					"color":null
				}
			}
		};

		/**
		 * Update the current theme
		 */
		STX.ThemeHelper.prototype.update=function(){
			var stx=this.params.stx;
			var classMapping={
				stx_candle_up: {stx_candle_up:true, stx_bar_up:true, stx_hollow_candle_up:true, stx_line_up:true, stx_baseline_up:true},
				stx_candle_down: {stx_candle_down:true, stx_bar_down:true, stx_hollow_candle_down:true ,stx_line_down:true, stx_baseline_down:true},
				stx_shadow_up: {stx_candle_shadow_up:true},
				stx_shadow_down: {stx_candle_shadow_down:true},
				stx_line_chart: {stx_bar_chart:true, stx_line_chart:true},
				stx_grid: {stx_grid:true, stx_grid_border: true},
				stx_grid_dark: {stx_grid_dark:true},
				stx_xaxis: {stx_xaxis_dark:true, stx_xaxis:true, stx_yaxis:true, stx_yaxis_dark:true},
				stx_mountain_chart: {stx_mountain_chart:true},
				stx_market_session: {stx_market_session:true}
			};

			stx.chart.container.style.backgroundColor=this.settings.chart.Background.color;

			function setStyle(style, field, value){
				var styles=classMapping[style];
				for(var s in styles){
					stxx.setStyle(s, field, value);
				}
			}
			setStyle("stx_grid","color", this.settings.chart["Grid Lines"].color);
			setStyle("stx_grid_dark","color", this.settings.chart["Grid Dividers"].color);
			setStyle("stx_xaxis","color",this.settings.chart["Axis Text"].color);

			setStyle("stx_candle_up","color",this.settings.chartTypes["Candle/Bar"].up.color);
			setStyle("stx_candle_down","color",this.settings.chartTypes["Candle/Bar"].down.color);
			setStyle("stx_shadow_up","color",this.settings.chartTypes["Candle/Bar"].up.wick);
			setStyle("stx_shadow_down","color",this.settings.chartTypes["Candle/Bar"].down.wick);

			// Only apply borders to candle, not the other types
			stxx.setStyle("stx_candle_up", "borderLeftColor", this.settings.chartTypes["Candle/Bar"].up.border);
			stxx.setStyle("stx_candle_down", "borderLeftColor", this.settings.chartTypes["Candle/Bar"].down.border);

			setStyle("stx_line_chart","color",this.settings.chartTypes["Line"].color);

			stxx.setStyle("stx_mountain_chart","borderTopColor",this.settings.chartTypes["Mountain"].color);
			stxx.setStyle("stx_mountain_chart","backgroundColor",STX.hexToRgba(this.settings.chartTypes["Mountain"].color,.8));
			stxx.setStyle("stx_mountain_chart","color",STX.hexToRgba(this.settings.chartTypes["Mountain"].color,.1));
			stx.draw();
		};

		/**
		 * Generates an object that can be used to create a dialog for creating or modifying a study.
		 * The object will then contain arrays for inputs, outputs and parameters. Each
		 * input will describe a form field that should be generated. Each output will describe a color
		 * swatch that should be generated. The results of the dialog would then be passed to {@link STX.Studies.addStudy}
		 * @param  {STX.Studies.StudyDescriptor} params.name Name of study to add
		 * @param  {STX.Studies.StudyDescriptor} params.sd A study descriptor when modifying an existing study
		 * @param  {STX.STXChart} params.stx A chart object
		 * @param  {Object} [params.inputs] Existing input parameters for the study (if modifying)
		 * @param  {Object} [params.outputs] Existing output parameters for the study (if modifying)
		 * @param  {Object} [params.parameters] Existing additional parameters for the study (if modifying)
		 * @example
		 * var helper=new STX.Studies.DialogHelper({sd:sd,stx:stx});
		 * console.log(helper.inputs);
		 * console.log(helper.outputs);
		 * console.log(helper.parameters);
		 */
		STX.Studies.DialogHelper=function(params){
			var stx=this.stx=params.stx;
			var sd=this.sd=params.sd;
			this.name=sd?sd.type:params.name;
			this.inputs=[];
			this.outputs=[];
			this.parameters=[];
			var libraryEntry=this.libraryEntry=sd?sd.libraryEntry:STX.Studies.studyLibrary[params.name];
			var panel=(sd && stx.panels[sd.panel]) ? stx.panels[sd.panel] : {chart:stx.chart};
			var chart=panel.chart;

			this.title=stx.translateIf(libraryEntry.name);

			/*
			This code loops through the acceptable inputs for the study in question. The format of the input default in the studyLibrary determines what type of input
			is required. For instance a number requires an input field. A string will produce a select box, of moving averages for instance if the string is "ma".
			If the string is "field" then a select box of acceptable fields is displayed. Likewise, an array will show up as a select box.
			 */
			for(var i in libraryEntry.inputs){
				var input={};
				this.inputs.push(input);
				input.name=i;
				input.heading=stx.translateIf(i);
				var acceptedData=libraryEntry.inputs[i];
				if(sd && sd.inputs && typeof(sd.inputs[i])!="undefined" && sd.inputs[i]!==null)
					input.value=sd.inputs[i];
				else
					input.value=libraryEntry.inputs[i];
				input.default=libraryEntry.inputs[i];

				if(acceptedData.constructor==Number){
					input.type="number";
				}else if(acceptedData.constructor==String){
					if(acceptedData=="ma" || acceptedData=="ema" || acceptedData=="tma" || acceptedData=="vma" || acceptedData=="wma" || acceptedData=="tsma" || acceptedData=="smma" || acceptedData=="vdma"){
						input.type="select";
						var conversions={
							"ma":"simple",
							"ema":"exponential",
							"tsma":"time series",
							"tma":"triangular",
							"vma":"variable",
							"vdma":"vidya",
							"wma":"weighted",
							"smma":"welles wilder",
						};
						var converted=conversions[input.value];
						if(!converted) converted=input.value;
						input.value=converted;

						converted=conversions[input.default];
						if(!converted) converted=input.default;
						input.default=converted;

						input.options={
							"simple":stx.translateIf("Simple"),
							"exponential":stx.translateIf("Exponential"),
							"time series":stx.translateIf("Time Series"),
							"triangular":stx.translateIf("Triangular"),
							"variable":stx.translateIf("Variable"),
							"vidya":stx.translateIf("VIDYA"),
							"weighted":stx.translateIf("Weighted"),
							"welles wilder":stx.translateIf("Welles Wilder"),
						};

					}else if(acceptedData=="field"){
						input.type="select";
						input.options={};
						nextField:
						for(var field in chart.dataSet[chart.dataSet.length-1]){
							if(["Open","High","Low","Close","Adj_Close","hl/2","hlc/3","hlcc/4", "ohlc/4"].indexOf(field) == -1){
								// field not an actual output but rather is just an intermediate value, so skip
								if(STX.Studies.actualOutputs.indexOf(field)==-1) continue;
								// can't modify study basing it on its own output data, which is changing due to the same modify (infinite loop)
								// can't modify study A basing it on another study B which uses study A data, this causes infinite loop as well
								for(output in params.sd.outputMap){
									// here we make sure that the output, and not a warted version of it, is in the field before skipping it.
									if(field.indexOf(output)!=-1 && field.indexOf(output+"-")==-1) continue nextField;
								}
							}
							input.options[field]=stx.translateIf(field);
						}
						if(input.value=="field"){
							input.value="Close";
						}
						if(input.default=="field"){
							input.default="Close";
						}
					}else{
						input.type="text";
					}
				}else if(acceptedData.constructor==Boolean){
					input.type="checkbox";
					if(input.value===true || input.value=="true" || input.value=="on") input.value=true;
				}else if(acceptedData.constructor==Array){
					input.type="select";
					input.options={};
					for(var ii=0;ii<acceptedData.length;ii++){
						input.options[acceptedData[ii]]=stx.translateIf(acceptedData[ii]);
					}
					if(input.value.constructor==Array){
						input.value=input.value[0];
					}
					input.default=acceptedData[0];
				}
			}

			/*
			Outputs are much simpler than inputs. Outputs are simply a list of available outputs and the selected color for that output. So here
			we print a line item in the dialog for each output and attach a color picker to it. The color picker is obtained from the Context.
			 */

			for(i in libraryEntry.outputs){
				var output={
					name:i,
					heading: stx.translateIf(i)
				};
				this.outputs.push(output);

				output.color=output.default=libraryEntry.outputs[i];
				if(sd && sd.outputs && sd.outputs[i]) output.color=sd.outputs[i];
				if(output.color=="auto") output.color=stx.defaultColor;
			}

			/* And now the parameters */
			
			if(libraryEntry.parameters && libraryEntry.parameters.template=="studyOverZones"){
					var init=libraryEntry.parameters.init;
				if(init){
					var obj;
					obj={name:"studyOverZones", heading:stx.translateIf("Show Zones"),
						defaultValue:init.studyOverZonesEnabled, value:init.studyOverZonesEnabled};
					if(sd && sd.parameters && (sd.parameters.studyOverZonesEnabled || sd.parameters.studyOverZonesEnabled===false)) {
						obj.value=sd.parameters.studyOverZonesEnabled;
					}
					this.parameters.push(obj);

					obj={name:"studyOverBought", heading:stx.translateIf("OverBought"),
						defaultValue:init.studyOverBoughtValue, value:init.studyOverBoughtValue,
						defaultColor:init.studyOverBoughtColor, color:init.studyOverBoughtColor};
					if(sd && sd.parameters && sd.parameters.studyOverBoughtValue) obj.value=sd.parameters.studyOverBoughtValue;
					if(sd && sd.parameters && sd.parameters.studyOverBoughtColor) obj.color=sd.parameters.studyOverBoughtColor;					
					if(obj.color=="auto") obj.color=stx.defaultColor;
					this.parameters.push(obj);

					obj={name:"studyOverSold", heading:stx.translateIf("OverSold"),
						defaultValue:init.studyOverSoldValue, value:init.studyOverSoldValue,
						defaultColor:init.studyOverSoldColor, color:init.studyOverSoldColor};
					if(sd && sd.parameters && sd.parameters.studyOverSoldValue) obj.value=sd.parameters.studyOverSoldValue;
					if(sd && sd.parameters && sd.parameters.studyOverSoldColor) obj.color=sd.parameters.studyOverSoldColor;					
					if(obj.color=="auto") obj.color=stx.defaultColor;
					this.parameters.push(obj);
				}
			}
		};

		/**
		 * Update (or add) the study attached to the DialogHelper.
		 * @param  {Object} updates Should contain updates
		 * @example
		 * var helper=new STX.Studies.DialogHelper({sd:sd, stx:stx});
		 * helper.updateStudy({inputs:{Period:60}});
		 */
		STX.Studies.DialogHelper.prototype.updateStudy=function(updates){
			var newParams={};
			var sd=this.sd;
			var libraryEntry=this.libraryEntry;
			newParams.inputs=STX.shallowClone(sd?sd.inputs:libraryEntry.inputs);
			newParams.outputs=STX.shallowClone(sd?sd.outputs:libraryEntry.outputs);
			newParams.parameters=STX.shallowClone(sd?sd.parameters:libraryEntry.parameters);
			STX.extend(newParams, updates);
			if(!newParams.parameters) newParams.parameters={};
			if(newParams.inputs && newParams.inputs.id){
				newParams.parameters.replaceID=newParams.inputs.id;
				delete newParams.inputs.id;
				delete newParams.inputs.display;
			}
			this.sd=STX.Studies.addStudy(this.stx, this.name, newParams.inputs, newParams.outputs, newParams.parameters);
		};

		/**
		 * Extracts the user input data from a study dialog. Study Dialogs must follow a specific UI format (@see STX.Studies.studyDialog) in order
		 * for this function to operate correctly. Typically it will be called from the go() function (@see STX.Studies.go).
		 * @param  {object} div The DOM element that is the study dialog
		 * @param  {object} stx A chart object
		 * @return {object}     A pseudo-study descriptor is returned. It contains only the input, output, and parameters objects.
		 * @since 04-2015
		 * @memberOf STX.Studies
		 */
		STX.Studies.parseDialog=function(div, stx){
			var inputs={}; var outputs={};
			//var translatedStudy=div.study;
			//if(stx) translatedStudy=stx.translateIf(translatedStudy);
			var inputItems=div.querySelectorAll(".inputTemplate");
			var i,field;
			for(i=0;i<inputItems.length;i++){
				if(inputItems[i].style.display!="none"){
					field=inputItems[i].querySelectorAll(".stx-heading")[0].fieldName;
					var inputDOM=inputItems[i].querySelectorAll(".stx-data")[0].childNodes[0];
					var value=inputDOM.value;
					if(inputDOM.getAttribute("type")=="checkbox"){
						inputs[field]=inputDOM.checked;
					}else{
						inputs[field]=value;
					}
				}
			}

			var outputItems=div.querySelectorAll(".outputTemplate");
			for(i=0;i<outputItems.length;i++){
				if(outputItems[i].style.display!="none"){
					field=outputItems[i].querySelectorAll(".stx-heading")[0].fieldName;
					if(typeof field!=="undefined"){
						var color=outputItems[i].querySelectorAll(".stx-color")[0].style.backgroundColor;
						if(!color) color="auto";
						outputs[field]=color;
					}
				}
			}

			var parameters={};
			STX.Studies.getCustomParameters(div, parameters);
			parameters.replaceID=div.replaceID;

			return {
				inputs: inputs,
				outputs: outputs,
				parameters: parameters
			};
		};

		/**
		 * Converts a study dialog into an actual study. Study Dialogs must follow a specific UI format (@see STX.Studies.studyDialog) in order
		 * for this function to operate correctly. Typically it will be called when a user clicks the "submit" button on an HTML study dialog window.
		 * @param  {object} div The DOM element that is the study dialog
		 * @param  {object} stx A chart object
		 * @return {object}     The study descriptor is returned. This can be used in the future for deleting the study programatically.
		 * @memberOf STX.Studies
		 */
		STX.Studies.go=function(div, stx){
			var sd=STX.Studies.parseDialog(div, stx);
			sd=STX.Studies.addStudy(div.stx, div.study, sd.inputs, sd.outputs, sd.parameters);
			return sd;
		};

		/**
		 * This method parses out custom parameters from the study dialog. For this to work, the studyLibrary entry
		 * must contain a value "parameters". This object should then include a "template" which is the id of the html
		 * element that is appended to the studyDialog. Then another object "init" should contain all of the id's
		 * within that template which contain data. It is currently used to create "zones" in study panels.
		 * @param {object} div The study dialog window
		 * @param {object} parameters An object containing the parameters to set in the study dialog window. These parameters would typicaly come from the study descriptor (library entry).
		 * @memberOf STX.Studies
		 */
		STX.Studies.getCustomParameters=function(div, parameters){
			var sd=STX.Studies.studyLibrary[div.study];
			if(!sd) return;
			if(!sd.parameters) return;
			if(!sd.parameters.template) return;
			if(!sd.parameters.init) return;
			var template=div.querySelectorAll("#" + sd.parameters.template)[0];
			if(!template) return;
			for(var field in sd.parameters.init){
				var el=template.querySelectorAll("#" + field)[0];
				if(!el) continue;
				if(el.tagName=="INPUT"){
					if(el.type=="checkbox"){
						parameters[field]=el.checked;
					}else{
						parameters[field]=el.value;
					}
				}else{
					parameters[field]=el.style.backgroundColor;
				}
			}
		};

		/**
		 * Prepares a study descriptor for use by assigning default calculation or display functions if required and configuring the outputMap
		 * which is used internally to determine the color for each output. This method also places any overlays into the stx.overlays array for
		 * future reference. Finally it is responsible for rebuilding any derived studies when replacing an underlying study.
		 * @private
		 * @param  {object} stx   A chart object
		 * @param  {object} study The study library entry
		 * @param  {object} sd    The study descriptor for this instance
		 * @memberOf STX.Studies
		 */
		STX.Studies.prepareStudy=function(stx, study, sd, parameters){
			if(typeof(study.calculateFN)=="undefined") study.useRawValues=true;
			if(typeof(study.seriesFN)=="undefined") study.seriesFN=STX.Studies.displaySeriesAsLine;

			if(parameters && parameters.replaceID){
				// Remove any overlays that relied on the old panel ID name, for instance a moving average on RSI(14) is no
				STX.Studies.rejiggerDerivedStudies(stx, parameters.replaceID, sd.inputs.id, sd.panel);
				delete parameters.replaceID;
			}

			// Unless overridden by the calculation function we assume the convention that the dataSet entries
			// will begin with the output name such as "RSI rsi (14)"
			if(STX.isEmpty(sd.outputMap)){
				for(var i in sd.outputs){
					if(study.useRawValues){
						sd.outputMap[i]=i;
					}else{
						sd.outputMap[i + " " + sd.name]=i;
					}
				}
			}
			if(sd.overlay){
				stx.overlays[sd.name]=sd;
			}
			if(sd.underlay){
				stx.overlays[sd.name]=sd;
			}
			if(parameters && parameters.replaceID){
				// Remove any overlays that relied on the old panel ID name, for instance a moving average on RSI(14) is no
				STX.Studies.rejiggerDerivedStudies(stx, parameters.replaceID, sd.inputs.id, sd.panel);
				delete parameters.replaceID;
			}
			if(study.feed ){
				stx.attachTagAlongQuoteFeed(study.feed);
			}else{
				if(sd.chart.dataSet) stx.createDataSet();
				stx.draw();
			}
		};

		/**
		 * Fixes any derived studies that were based off of a study that has just changed.
		 * For instance a moving average on another overlay, or a moving average on an RSI.
		 * The panel name needs to change and the input "Field".
		 * @param  {STXChart} stx       The stx instance
		 * @param  {String} replaceID The old ID for the underlying study e.g. RSI (14)
		 * @param  {String} newID     The new ID for the underlying study
		 */
		STX.Studies.rejiggerDerivedStudies=function(stx, replaceID, newID, panelID){
			for(var s in stx.layout.studies){
				var st=stx.layout.studies[s];
				var derivedID=st.inputs.id;
				if(st.inputs.id.indexOf(replaceID)!=-1 && st.inputs.id.indexOf(replaceID+"-")==-1){  //check if exact field (and not warted one) exists in input
					var newDerivedID=st.inputs.id.replace(replaceID, newID); // The new ID, naively accomplished with string replace
					if(st.inputs.Field && st.inputs.Field.indexOf(replaceID)!=-1){ // Yuck, we should implement actual parent
						var oldName=st.name;
						st.inputs.Field=st.inputs.Field.replace(replaceID, newID); // Adjust the field name, tricky because the field name is "output (id)" and we don't really know the outputs
						st.inputs.id=st.inputs.id.replace(replaceID, newID);
						st.inputs.display=st.inputs.display.replace(replaceID, newID);
						st.name=st.name.replace(replaceID, newID);
						st.outputMap={};
						for(var i in st.outputs){
							if(st.libraryEntry && st.libraryEntry.useRawValues){
								st.outputMap[i]=i;
							}else{
								st.outputMap[i + " " + st.name]=i;
							}
						}
	
						if(stx.overlays[oldName]){
							delete stx.overlays[oldName];
							stx.overlays[st.name]=st;
						}
						if(st.panel!="chart") st.panel=panelID;
						delete stx.layout.studies[derivedID]; // Take this study out of the study
						stx.layout.studies[newDerivedID]=st;	// Add it back in, now it will be at the end of the object, preserving the ordering
						STX.Studies.rejiggerDerivedStudies(stx, derivedID, newDerivedID, panelID); // Recursively check for underlying of underlying
					}
				}
			}
		};

		/**
		 * Replaces an existing study with new inputs, outputs and parameters. When using this method
		 * a study's position in the stack will remain the same. Derived (child) studies will shift to
		 * use the new study as well
		 * @param {object} stx        The chart object
		 * @param {string} type       The name of the study (out of the studyLibrary)
		 * @param {String} id 		The id of the current study. If set, then the old study will be replaced
		 * @param {object} [inputs]     Inputs for the study instance. Default is those defined in the studyLibrary.
		 * @param {object} [outputs]    Outputs for the study instance. Default is those defined in the studyLibrary.
		 * @param {object} [parameters] Optional additional custom parameters for this study if supported or required by that study
		 * @param {string} [panelName] Optionally specify the panel. If not specified then an attempt will be made to locate a panel based on the input id or otherwise created if required.
		 * @return {object} A study descriptor which can be used to remove or modify the study.
		 */
		STX.Studies.replaceStudy=function(stx, id, type, inputs, outputs, parameters, panelName){
			if(!inputs) inputs={};
			inputs.id=id;
			return STX.Studies.addStudy(stx, type, inputs, outputs, parameters, panelName);
		};

		/**
		 * Adds a study to the chart. A layout change event is triggered when this occurs.
		 * <P>Example: <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="http://jsfiddle.net/chartiq/5y4a0kry/embedded/result,js,html,css/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
		 *
		 * Optionally you can assign the edit callback to a function that can handle initialization of a dialog box for editing studies.
		 * If the callback is not assigned a function, the edit study buttons/functionality will not appear.
		 * The 'Study Edit' feature is standard functionality in the advanced package.
		 *
		 * Prior to version 2015-07-01, all edit functionality was handled by `stx.editCallback` and was limited to panel studies.
		 * Starting on version 2015-07-01, edit functionality is handled by `stxx.callbacks.studyPanelEdit` and `stxx.callbacks.studyOverlayEdit`; and it is available on both panel studies and overly studies.
		 * See Examples for exact function parameters and return value requirements.
		 * Please note that these callbacks must be set **before** you call importLayout. Otherwise your imported studies will not have an edit capability.
		 *
		 * @param {object} stx        The chart object
		 * @param {string} type       The name of the study (object key on the {@link STX.Studies.studyLibrary})
		 * @param {object} [inputs]     Inputs for the study instance. Default is those defined in the studyLibrary. Note that if you specify this objct it will not be combined with the library defaults. So even if you only want to define or override one single element (`display`, for example); you them must also send all of the additional inputs required to render the study. 
		 * @param {String} [inputs.id] The id of the current study. If set, then the old study will be replaced
		 * @param {String} [inputs.display] The display name of the current study. If not set, a name generated by {@link STX.Studies.prettyDisplay} will be used. Note that if the study descriptor defines a `display` name, the study descriptor name will allays override this parameter.
		 * @param {object} [outputs]    Outputs for the study instance. Default is those defined in the studyLibrary. Note that if you specify this objct it will not be combined with the library defaults. So even if you only want to override one single element; you them must also send all of the additional outputs required to render the study.
		 * @param {object} [parameters] Optional additional custom parameters for this study if supported or required by that study
		 * @param {string} [panelName] Optionally specify the panel. The relationship between studies and their panels is kept in {@link STX.Studies.studyPanelMap}. If not specified then an attempt will be made to locate a panel based on the input id or otherwise created if required. 
		 * @return {object} A study descriptor which can be used to remove or modify the study.
		 * @memberOf STX.Studies
		 * @example
		 * STX.Studies.addStudy(stxx, "vol undr", {}, {"Up Volume":"#8cc176","Down Volume":"#b82c0c"});
		 * @example
		 * // this is an example of  the expected stxx.editCallback function for version prior to version 2015-07-01
		 * stxx.editCallback=function(stx, sd){
		 *	// your code here
		 *	return $$("studyDialog"); // This is a reference to the actual HTML dialog container that can be filled by studyDialog.
		 * };
		 * @example
		 * var params={stx:stx,sd:sd,inputs:inputs,outputs:outputs, parameters:parameters};
		 * stxx.callbacks.studyPanelEdit=function(params){
		 *		// your code here
		 * };
		 * @example
		 * var params={stx:stx,sd:sd,inputs:inputs,outputs:outputs, parameters:parameters};
		 * stxx.callbacks.studyOverlayEdit=function(params){
		 *		// your code here
		 * };
		*/
		STX.Studies.addStudy=function(stx, type, inputs, outputs, parameters, panelName){
			var study=STX.Studies.studyLibrary[type];
			if(!parameters) parameters={};
			if(study && study.parameters && study.parameters.init) {
				for(var param in study.parameters.init){
					if(typeof(parameters[param])=="undefined" || parameters[param]===null){
						parameters[param]=study.parameters.init[param];
					}
				}
			}
			if(!parameters.chartName) parameters.chartName="chart";
			if(!inputs && study && study.inputs) {
				inputs=STX.shallowClone(study.inputs);
				for(var i in inputs){
					if(inputs[i] instanceof Array) inputs[i]=inputs[i][0];
				}
			}
			if(!inputs) inputs={"Period":14};
			if(!outputs && study && study.outputs) outputs=STX.shallowClone(study.outputs);
			if(!outputs) outputs={"Result":"auto"};

			if(!study) {
				study={};
				if(panelName=="chart") study.overlay=true;
			}
			if( inputs.Period < 1 ) inputs.Period = 1; // periods can't be less than one candle. This is a general safety check. Each study should have a check or add input validation.

			if(!inputs.id){
				var replace=null;
				if(parameters && parameters.replaceID) replace=parameters.replaceID;
				inputs.id=STX.Studies.generateID(stx, type, inputs, replace);
			}
			var sd=null;
			if(study.initializeFN){
				sd=study.initializeFN(stx, type, inputs, outputs, parameters, panelName);
			}else{
				sd=STX.Studies.initializeFN(stx, type, inputs, outputs, parameters, panelName);
			}
			if(!sd){
				console.log("STX.Studies.addStudy: initializeFN() returned null for " + type);
				return;
			}
			sd.chart=stx.charts[parameters.chartName];
			if(!stx.layout.studies) stx.layout.studies={};
			// removed following line because it causes modified studies to be re-added out of sequence causing issues if there are dependencies
			// so instead of deleting and adding to the end of the array, we just replace the data with the new sd
			//delete stx.layout.studies[sd.inputs.id]; // for good measure, in case of orphaned studies
			stx.layout.studies[sd.inputs.id]=sd;
			sd.study=study;
			sd.type=type;
			var panel=stx.panels[sd.panel];
			STX.Studies.prepareStudy(stx, study, sd, parameters);
			stx.changeOccurred("layout");
			var hasEditCallback=false;
			var isPanelStudy=!(sd.overlay || sd.underlay);

			if (isPanelStudy && study.horizontalCrosshairFieldFN) {
				panel.horizontalCrosshairField = study.horizontalCrosshairFieldFN(stx, sd);
			}

			if(stx.editCallback) hasEditCallback=true;
			if(stx.callbacks.studyOverlayEdit && !isPanelStudy) hasEditCallback=true;
			if(stx.callbacks.studyPanelEdit && isPanelStudy) hasEditCallback=true;


			if(hasEditCallback){
				parameters.editMode=true;
				var hasInput=false;
				for(var input in sd.inputs){
					if(input=="id") continue;
					if(input=="display") continue;
					hasInput=true;
				}
				if(!hasInput){
					for(var output in sd.outputs){
						hasInput=true;
					}
				}
				if(hasInput){
					var editFunction;
					if(sd.libraryEntry && typeof sd.libraryEntry.edit!="undefined"){
						if(sd.libraryEntry.edit){
							editFunction=(function(stx, sd, inputs, outputs){return function(){
								sd.library.edit(sd, {inputs:inputs, outputs:outputs, parameters:parameters});
							};})(stx, sd, inputs, outputs, parameters);
							stx.setPanelEdit(panel, editFunction);
							sd.editFunction=editFunction;
						}
					}else if(!isPanelStudy && stx.callbacks.studyOverlayEdit){
						editFunction=(function(stx, sd, inputs, outputs, parameters){return function(forceEdit){
							stx.dispatch("studyOverlayEdit", {stx:stx,sd:sd,inputs:inputs,outputs:outputs, parameters:parameters, forceEdit: forceEdit});
						};})(stx, sd, inputs, outputs, parameters);
						sd.editFunction=editFunction;
					}else{
						if(stx.editCallback){ // deprecated legacy support
							editFunction=(function(stx, sd, inputs, outputs){return function(){
								var dialogDiv=stx.editCallback(stx, sd);
								STX.Studies.studyDialog(stx, type, dialogDiv, {inputs:inputs, outputs:outputs, parameters:parameters});
							};})(stx, sd, inputs, outputs, parameters);
							if(panel.name!="chart"){
								stx.setPanelEdit(panel, editFunction);
							}
						}else{
							editFunction=(function(stx, sd, inputs, outputs, parameters){return function(){
								stx.dispatch("studyPanelEdit", {stx:stx,sd:sd,inputs:inputs,outputs:outputs, parameters:parameters});
							};})(stx, sd, inputs, outputs, parameters);
							if(panel.name!="chart"){
								stx.setPanelEdit(panel, editFunction);
								sd.editFunction=editFunction;
							}
						}
					}
				}
			}
			return sd;
		};

		/**
		 * A convenience function for programatically adding a study.
		 * <P>Example: <iframe width="800" height="500" scrolling="no" seamless="seamless" align="top" style="float:top" src="http://jsfiddle.net/chartiq/5y4a0kry/embedded/result,js,html,css/" allowfullscreen="allowfullscreen" frameborder="1"></iframe>
		 * @param  {object} stx        The chart object
		 * @param  {string} studyName  The name of the study (out of the studyLibrary)
		 * @param  {object} inputs     The input values for this study instance ( for exact values used in each study, see STX.Studies.studyLibrary)
		 * @param  {object} [outputs]    Optional output colors ( for exact values used in each study, see STX.Studies.studyLibrary)
		 * @param  {object} [parameters] Optional custom parameters if the study requires/supports them
		 * @return {object}            Returns a study descriptor which can be used to delete or modify the study.
		 * @memberOf STX.Studies
		 * @deprecated Use STX.Studies.addStudy
		 */
		STX.Studies.quickAddStudy=function(stx, studyName, inputs, outputs, parameters){
			return STX.Studies.addStudy(stx, studyName, inputs, outputs, parameters);
		};

		/**
		 * Removes a study from the chart (and panel if applicable)
		 * @param  {object} stx A chart object
		 * @param  {object} sd  A study descriptor returned from {@link STX.Studies.quickAddStudy} or {@link STX.Studies.go}
		 * @memberOf STX.Studies
		 */
		STX.Studies.removeStudy=function(stx, sd){
			if(sd.overlay || sd.underlay ){
				stx.removeOverlay(sd.name);
				stx.draw();
			}else{
				var panel=stx.panels[sd.panel];
				if(panel)
					stx.panelClose(panel);
			}
		};

		/**
		 * Renders a study dialog in standard form. The study dialog must be of specific format as provided in sample html files.
		 * @param  {object} stx   Chart object
		 * @param  {string} study Study type (as in studyLibrary)
		 * @param  {object} div   The study dialog DOM element which should already exist in the HTML
		 * @param {object} [override] Optional input and output map to override the defaults (used when editing existing study)
		 * @param {object} [override.inputs] Override inputs
		 * @param {object} [override.outputs] Override outputs
		 * @param {object} [override.parameters] Override additional parameters
		 * @memberOf STX.Studies
		 */
		STX.Studies.studyDialog=function(stx, study, div, override){
			div.study=study;
			div.stx=stx;
			if(override && override.inputs && override.inputs.id)
				div.replaceID=override.inputs.id;
			else if(div.replaceID)
				delete div.replaceID;
			var chart=stx.chart;	// Currently the dialog only supports adding studies to the primary chart

			var divInputs=div.querySelectorAll("#inputs")[0];
			var inputItems=divInputs.querySelectorAll(".inputTemplate");
			var i;
			for(i=0;i<inputItems.length;i++){
				if(inputItems[i].style.display!="none"){
					divInputs.removeChild(inputItems[i]);
				}
			}
			var divOutputs=div.querySelectorAll("#outputs")[0];
			var outputItems=divOutputs.querySelectorAll(".outputTemplate");
			for(i=0;i<outputItems.length;i++){
				if(outputItems[i].style.display!="none"){
					divOutputs.removeChild(outputItems[i]);
				}
			}

			var sd=STX.Studies.studyLibrary[study];
			if(!sd) sd={};
			if(typeof(sd.inputs)=="undefined") sd.inputs={"Period":14};
			if(typeof(sd.outputs)=="undefined") sd.outputs={"Result":"auto"};

			var addOption = function addOption(value, text, formField) {
				var option = document.createElement("OPTION");
				option.value = value;
				option.text = stx.translateIf(text);
				formField.add(option, null);
			};

			for(i in sd.inputs){
				var newInput=inputItems[0].cloneNode(true);
				divInputs.appendChild(newInput);
				newInput.style.display="block";
				newInput.querySelectorAll(".stx-heading")[0].appendChild(STX.translatableTextNode(stx,i));
				newInput.querySelectorAll(".stx-heading")[0].fieldName=i;
				var formField=null;
				var acceptedData=sd.inputs[i];
				var defaultValue=(override && override.inputs && override.inputs[i]!==null && typeof override.inputs[i]!="undefined")?override.inputs[i]:acceptedData;
				if(acceptedData.constructor==Number){
					formField=document.createElement("input");
					formField.setAttribute("type", "number");
					formField.value=defaultValue;
				}else if(acceptedData.constructor==String){
					if(acceptedData=="ma" || acceptedData=="ema" || acceptedData=="tma" || acceptedData=="vma" || acceptedData=="wma" || acceptedData=="tsma" || acceptedData=="smma" || acceptedData=="vdma"){
						formField=document.createElement("select");
						addOption("simple", "Simple", formField);
						addOption("exponential", "Exponential", formField);
						addOption("time series", "Time Series", formField);
						addOption("triangular", "Triangular", formField);
						addOption("variable", "Variable", formField);
						addOption("vidya", "VIDYA", formField);
						addOption("weighted", "Weighted", formField);
						addOption("welles wilder", "Welles Wilder", formField);
						formField.value=defaultValue;
						if(defaultValue=="ma") formField.selectedIndex=0;
						if(defaultValue=="ema") formField.selectedIndex=1;
						if(defaultValue=="tsma") formField.selectedIndex=2;
						if(defaultValue=="tma") formField.selectedIndex=3;
						if(defaultValue=="vma") formField.selectedIndex=4;
						if(defaultValue=="vdma") formField.selectedIndex=5;
						if(defaultValue=="wma") formField.selectedIndex=6;
						if(defaultValue=="smma") formField.selectedIndex=7;
					}else if(acceptedData=="field"){
						formField=document.createElement("select");
						var count=0;
						for(var field in chart.dataSet[chart.dataSet.length-1]){
							if(["Open","High","Low","Close","Adj_Close","hl/2","hlc/3","hlcc/4", "ohlc/4"].indexOf(field) == -1){
								//if(["Date","DT","projection","split","distribution", "atr", "stch_14", "ratio","transform","cache"].indexOf(field) >= 0) continue;
								//if(field=="Volume") {if(!stx.panels["vchart"]) continue;}
								//else if(STX.Studies.actualOutputs.indexOf(field)==-1) continue;
								if(STX.Studies.actualOutputs.indexOf(field)==-1) continue;
								var found=false;
								if(override){
									for(output in override.sd.outputMap){
										// here we make sure that the output, and not a warted version of it, is in the field before skipping it.
										if(field.indexOf(output)!=-1 && field.indexOf(output+"-")==-1) found=true;
									}
								}
								if (found) continue;
							}
							addOption(field, field, formField);
							if(field=="Close") formField.selectedIndex=count;
							count++;
						}
						if(defaultValue!="field"){
							formField.value=defaultValue;
						}
					}else{
						formField=document.createElement("input");
						formField.type="text";
						formField.value=defaultValue;
					}
				}else if(acceptedData.constructor==Boolean){
					formField=document.createElement("input");
					formField.setAttribute("type","checkbox");
					if(defaultValue===true || defaultValue=="true") formField.checked=true;
					if( (i == "Overlay")  && override && override.parameters.editMode ) {
						if(formField.checked) formField.disabled = true;
						else newInput.style.display="none";
					}
				}else if(acceptedData.constructor==Array){
					formField=document.createElement("select");
					for(var ii=0;ii<acceptedData.length;ii++){
						addOption(acceptedData[ii], acceptedData[ii], formField);
					}
					if(defaultValue.constructor!=Array){
						formField.value=defaultValue;
					}
				}
				if(formField) newInput.querySelectorAll(".stx-data")[0].appendChild(formField);
			}
			for(i in sd.outputs){
				var newOutput=outputItems[0].cloneNode(true);
				divOutputs.appendChild(newOutput);
				newOutput.style.display="block";
				newOutput.querySelectorAll(".stx-heading")[0].appendChild(STX.translatableTextNode(stx,i));
				newOutput.querySelectorAll(".stx-heading")[0].fieldName=i;
				var colorClick=newOutput.querySelectorAll(".stx-color")[0];
				var value=sd.outputs[i];
				if(override && override.outputs && override.outputs[i]) value=override.outputs[i];
				if(value!="auto"){
					colorClick.style.backgroundColor=value;
					STX.unappendClassName(colorClick, "stxColorDarkChart");
				}else{
					if(stx.defaultColor=="#FFFFFF") STX.appendClassName(colorClick, "stxColorDarkChart");
				}

				STX.attachColorPicker(colorClick, div);
			}

			// Optional parameters for studies. This is driven by a UI template that must be created by the developer, and which
			// is referenced from the study description (studyLibrary entry).
			var parametersEL=div.querySelectorAll("#parameters")[0];
			if(parametersEL){
				STX.clearNode(parametersEL);
				if(sd.parameters && sd.parameters.template && sd.parameters.init){
					if(sd.parameters.condition && !sd.parameters.condition(stx)) return;
					var template=document.querySelectorAll("#" + sd.parameters.template)[0];
					if(template){
						template=template.cloneNode(true);
						template.style.display="block";
						parametersEL.appendChild(template);
						for(var f in sd.parameters.init){
							var pvalue=sd.parameters.init[f];
							if(override && override.parameters && typeof(override.parameters[f])!="undefined" && override.parameters[f]!==null)
								pvalue=override.parameters[f];
							var el=template.querySelectorAll("#" + f)[0];
							if(!el) continue;
							if(el.tagName=="INPUT"){
								if(el.type=="checkbox"){
									el.checked=(pvalue===true || pvalue=="true");
								}else{
									el.value=pvalue;
								}
							}else{
								if(pvalue=="auto"){
									pvalue="";
									if(stx.defaultColor=="#FFFFFF") STX.appendClassName(el, "stxColorDarkChart");
								}else{
									STX.unappendClassName(el, "stxColorDarkChart");
								}
								el.style.backgroundColor=pvalue;
								STX.attachColorPicker(el, div);
							}
						}
					}
				}
			}
		};

		/**
		 * <span class="animation">Animation Loop</span>
		 * This method displays all of the studies for a chart. It is called from within the chart draw() loop.
		 * @param  {STXChart} stx The charting object
		 * @param {STXChart.Chart} chart Which chart to display studies for
		 * @param {Boolean} [underlays=false] If set to true then underlays only will be displayed, otherwise underlays will be skipped
		 * @memberOf STX.Studies
		 */
		STX.Studies.displayStudies=function(stx, chart, underlays){
			var s=stx.layout.studies;
			if(!s) return;
			if(underlays) STX.Studies.actualOutputs=[];

			for(var n in s){
				var sd=s[n];
				var libraryEntry=sd.libraryEntry;
				if(!libraryEntry) continue;
				if(underlays){
					if(!sd.underlay && !libraryEntry.underlay) continue;
				}else{
					if(sd.underlay || libraryEntry.underlay) continue;
				}
				var panel=stx.panels[sd.panel];
				if(panel){
					if(panel.chart!=chart) continue;
					if (sd.libraryEntry.range!="bypass") panel.min=null;	// force determineminmax to calculate values, except if we are bypassing the automatic range setting
					//TODO: get rid of orphaned overlay study?
					if(panel.hidden) continue;
					if(sd.permanent){
						if(panel.closeX){
							panel.closeX.style.display="none";
						}else{
							panel.close.style.display="none";
						}
					}
				}else{
					//orphaned panel study, kill it
					delete s[n];
					continue;
				}

				var quotes=sd.chart.dataSegment;	// Find the appropriate data to drive this study

				for(var i in sd.outputMap){
					STX.Studies.actualOutputs.push(i);
				}

				if(!libraryEntry || typeof(libraryEntry.seriesFN)=="undefined"){	// null means don't display, undefined means display by default as a series
					STX.Studies.displaySeriesAsLine(stx, sd, quotes);
				}else{
					if(libraryEntry.seriesFN){
						if(panel) libraryEntry.seriesFN(stx, sd, quotes);
					}
				}
			}
		};

		/**
		 * Convenience function for determining the min and max for a given data point
		 * @param {object} stx The chart
		 * @param {string} name The field to evaluate
		 * @param {array} quotes The array of quotes to evaluate (typically dataSet, scrubbed or dataSegment)
		 * @memberOf STX.Studies
		 */
		STX.Studies.calculateMinMaxForDataPoint=function(stx, name, quotes){
			var min=Number.MAX_VALUE;
			var max=Number.MAX_VALUE*-1;
			for(var i=0;i<quotes.length;i++){
				var m=quotes[i][name];
				if(m===null || typeof m=="undefined") continue;
				if(isNaN(m)) continue;
				min=Math.min(m,min);
				max=Math.max(m,max);
			}
			return {"min":min,"max":max};
		};

		/**
		 * Method to determine the minimum and maximum points in a study panel. The studyLibrary is checked for the type of range. If the range
		 * is dynamic then the output values for the study are checked for minimum and maximum values. If a histogram is being printed then
		 * the values for the histogram (represented by sd.name+"_hist") are also checked. This method does not draw the yAxis but it does compute
		 * the high, low and shadow that the yAxis utilizes when drawn.
		 * @param  {object} stx    The chart object
		 * @param  {object} sd     The study descriptor
		 * @param  {array} quotes The set of quotes to evaluate
		 * @memberOf STX.Studies
		 */
		STX.Studies.determineMinMax=function(stx, sd, quotes){
			var panel=stx.panels[sd.panel];
			if(!panel) return;
			if(!panel.min && panel.min!==0){
				if(!sd.min && sd.min!==0){
					if(sd.libraryEntry && sd.libraryEntry.range=="0 to 100"){
						panel.min=0; panel.max=100;
					}else if(sd.libraryEntry && sd.libraryEntry.range=="-1 to 1"){
						panel.min=-1; panel.max=1;
					}else if(!sd.libraryEntry || sd.libraryEntry.range!="bypass"){
						panel.min=Number.MAX_VALUE;
						panel.max=Number.MAX_VALUE*-1;
						for(var i=0;i<quotes.length;i++){
							var quote=quotes[i];
							if(!quote) continue;

							var m;
							for(var j in sd.outputMap){
								m=quote[j];
								if(m===null || typeof m=="undefined") continue;
								if(isNaN(m)) continue;
								panel.min=Math.min(m,panel.min);
								panel.max=Math.max(m,panel.max);
							}

							for(var h=0;h<=5;h++){
								m=quote[sd.name+"_hist"+(h?h:"")];
								if(m===null || typeof m=="undefined") continue;
								if(isNaN(m)) continue;
								panel.min=Math.min(m,panel.min);
								panel.max=Math.max(m,panel.max);
							}
						}
					}
					if(sd.libraryEntry && sd.libraryEntry.range=="0 to max"){
						panel.min=Math.min(0,panel.min);
					}
				}else{
					panel.min=sd.min; panel.max=sd.max;
				}
			}
			// use the panel high/low values if they were set previously, like by a renderer
			if((panel.highValue || panel.highValue===0) && panel.highValue>panel.max) panel.max=panel.highValue;
			if((panel.lowValue || panel.lowValue===0) && panel.lowValue<panel.min) panel.min=panel.lowValue;
			// If a developer hard codes the max or min for yAxis then that supercedes everything
			if(panel.yAxis.max || panel.yAxis.max===0) panel.max=panel.yAxis.max;
			if(panel.yAxis.min || panel.yAxis.min===0) panel.min=panel.yAxis.min;
			if(panel.max==panel.min){ // All the same values, force a straight line
				panel.max=panel.max*2;
				panel.min=0;
			}
			panel.shadow=panel.max-panel.min;
			if(panel.max>0 && panel.min<0) panel.shadow=panel.max + panel.min*-1;
			panel.yAxis.high=panel.max;
			panel.yAxis.low=panel.min;
			panel.yAxis.shadow=panel.yAxis.high-panel.yAxis.low;
		};

		/**
		 * Creates the yAxis for a study panel. Utilizes STXChart.createYAxis internally. This method is not re-entrant. panel.axisDrawn will be set
		 * to true in order to prevent the yAxis from being drawn multiple times if there are multiple studies on a panel. The first study on the panel
		 * will therefore determine the minimum and maximum bounds of the panel. If the library entry defines a yAxisFN function then it will be used
		 * to render the yaxis instead of STXChart.createYAxis. If zones are enabled then STXChart.createYAxis again will not be the renderer.
		 * @param  {object} stx    The chart object
		 * @param  {object} sd     The study descriptor
		 * @param  {array} quotes The set of quotes (representing dataSegment)
		 * @param  {object} panel  A reference to the panel
		 * @memberOf STX.Studies
		 */
		STX.Studies.createYAxis=function(stx, sd, quotes, panel){
			if(!panel.axisDrawn){
				panel.height=panel.bottom-panel.top;
				STX.Studies.determineMinMax(stx, sd, quotes);
				// panel.yAxis.displayGridLines=false;	// Moved to initializeFN
				var parameters;
				if(sd.libraryEntry && (sd.libraryEntry.yaxis || sd.libraryEntry.yAxisFN)){
					parameters={"dontDraw":true};
					stx.createYAxis(panel, parameters);
					stx.drawYAxis(panel, parameters);
					if(sd.libraryEntry.yaxis) sd.libraryEntry.yaxis(stx, sd); // backward compatibility
					if(sd.libraryEntry.yAxisFN) sd.libraryEntry.yAxisFN(stx, sd); // Use yAxisFN for forward compatibility
				}else{
					// If zones are enabled then we don't want to draw the yAxis
					parameters={
							"noDraw": (sd.parameters && sd.parameters.studyOverZonesEnabled)
					};
					if(sd.libraryEntry){
						if(sd.libraryEntry.range=="0 to 100") parameters.range=[0,100];
						else if(sd.libraryEntry.range=="-1 to 1") parameters.range=[-1,1];
						if(sd.libraryEntry.yAxis && sd.libraryEntry.yAxis.ground) parameters.ground=true;
					}
					stx.createYAxis(panel, parameters);
					stx.drawYAxis(panel, parameters);
				}
				if(sd.libraryEntry && sd.libraryEntry.centerline){
					STX.Studies.drawHorizontal(stx, sd, quotes, sd.libraryEntry.centerline);
				}else if(panel.min<0 && panel.max>0){
					STX.Studies.drawHorizontal(stx, sd, quotes, 0);
				}
				panel.axisDrawn=true;
			}
		};

		/**
		 * Displays a single or group of series as lines in the study panel.
		 * One series per output field declared in the study library will be displayed.
		 * It expects the 'quotes' array to have data fields for each series with keys in the outputMap format: 'output name from study library'+ " " + sd.name.
		 * Y-axis will be rendered if studyOverZones are not set and panel is not “hidden”.
		 * studyOverZones will be displayed and Peaks & Valleys will be filled if corresponding thresholds are set in the study library as follows:
		 *
		 * <code>init:{studyOverZonesEnabled:true, studyOverBoughtValue:70, studyOverBoughtColor:"auto", studyOverSoldValue:30, studyOverSoldColor:"auto"}</code>
		 *
		 * For most custom studies this function will do the work for you.
		 * @param  {object} stx    The chart object
		 * @param  {object} sd     The study descriptor
		 * @param  {array} quotes The set of quotes (dataSegment)
		 * @memberOf STX.Studies
		 */
		STX.Studies.displaySeriesAsLine=function(stx, sd, quotes){
			if(!quotes.length) return;
			var panel=stx.panels[sd.panel];
			if(!panel) return;
			if(panel.hidden) return;
			if(panel.name!=sd.chart.name){
				STX.Studies.createYAxis(stx, sd, quotes, panel);
			}
			STX.Studies.drawZones(stx, sd, quotes);

			for(var i in sd.outputMap){
				STX.Studies.displayIndividualSeriesAsLine(stx, sd, panel, i, quotes);
			}
		};

		/**
		 * Displays a single or group of series as histogram in the study panel.
		 * It expects the 'quotes' array to have data fields for each series with keys in the outputMap format: 'output name from study library'+ " " + sd.name.
		 *
		 * It takes into account the following study input fields (see {@link STXChart#drawHistogram} for details ) :
		 * - sd.inputs.HistogramType ("overlaid", "clustered", "stacked") - Default "overlaid"
		 * - sd.inputs.HeightPercentage - Default ".25"
		 * - sd.inputs.WidthFactor - Default ".5"
		 * @param  {object} stx    The chart object
		 * @param  {object} sd     The study descriptor
		 * @param  {array} quotes The set of quotes (dataSegment)
		 * @memberOf STX.Studies
		 * @example
		 *
			// this adds a study panel that will display the High and Low values from the masterData as a stacked histogram study
			STX.Studies.studyLibrary["Plot High Low"]={
			 	"seriesFN": STX.Studies.displaySeriesAsHistogram,
			 	inputs:{"HistogramType":"stacked"},
			    outputs:{"High":"blue","Low":"red"}
			};
			STX.Studies.quickAddStudy(stxx, "Plot High Low");
		 */
		STX.Studies.displaySeriesAsHistogram=function(stx, sd, quotes){
			if(!quotes.length) return;
			var panel=stx.panels[sd.panel];
			if(!panel) return;
			if(panel.hidden) return;

			var seriesParam=[];
			for(var i in sd.outputMap){
				 var series={
					    field: i,
					    fill_color_up: sd.outputs[sd.outputMap[i]],
					    border_color_up: sd.outputs[sd.outputMap[i]],
					    //opacity_up:   sd.outputs[sd.outputMap[i]]],
					    fill_color_down: sd.outputs[sd.outputMap[i]],
					    border_color_down: sd.outputs[sd.outputMap[i]],
					    //opacity_down:  sd.outputs[sd.outputMap[i]],
				 };
				 seriesParam.push(series);
			}

			var params={
				    name:	sd.name,
				    type:	sd.inputs.HistogramType?sd.inputs.HistogramType:"overlaid",
				    panel:	sd.panel,
				    heightPercentage: sd.inputs.HeightPercentage?sd.inputs.HeightPercentage:0.25,
				    widthFactor: sd.inputs.WidthFactor?sd.inputs.WidthFactor:0.5,
			};

			if(!sd.study.parameters || (sd.study.parameters && !sd.study.parameters.excludeYAxis)) {
				STX.Studies.createYAxis(stx, sd, sd.chart.dataSegment, stx.panels[sd.panel]);
			}
			stx.drawHistogram(params,seriesParam);
		};

		/**
		 * Fills an area on the chart, usually created by a study.
		 * @param  {object} stx    The chart object
		 * @param  {array} points  The set of points, this is an array of chart coordinates in array form
		 * 							e.g. [[x1,y1],[x2,y2]].  The points should be arranged to form a loop;
		 * 							the loop need not be closed.
		 * @param  {string} color  color to fill the area
		 * @param  {number} opacity opacity of fill, 0 to 1.  Defaults to 0.1
		 * @param  {string} [panelName] optional Name of panel to draw on.  If omitted or invalid, area may fill over top or bottom of plot area
		 * @since panelName parameter added 01-20-2015
		 * @memberOf STX.Studies
		 */
		STX.Studies.fillArea=function(stx, points, color, opacity, panelName){
	        if(!points.length) return;
	        stx.chart.context.lineWidth=0;
	        var globalAlpha=stx.chart.context.globalAlpha;
	        if(!opacity && opacity!==0) opacity=0.2;
	        stx.chart.context.globalAlpha=opacity;
	        if(color=="auto") color=stx.defaultColor;
	        stx.chart.context.fillStyle=color;

	        var t=Number.MAX_VALUE*-1;
			var b=Number.MAX_VALUE;
			var panel=stx.panels[panelName];
	        if(panel){
	        	t=panel.yAxis.top;
				b=panel.yAxis.bottom;
				stx.chart.context.save();
				stx.chart.context.beginPath();
				stx.chart.context.rect(panel.left, t, panel.width, b-t);
				stx.chart.context.clip();
	        }
	        stx.chart.context.beginPath();
            stx.chart.context.moveTo(points[0][0],points[0][1]);
		    for(var i=1;i<points.length;i++){
	            stx.chart.context.lineTo(points[i][0],points[i][1]);
		    }
	        stx.chart.context.closePath();
	        stx.chart.context.fill();
			if(panel) stx.chart.context.restore();

	        stx.chart.context.lineWidth=1;
	        stx.chart.context.globalAlpha=globalAlpha;
		};

		/**
		 * Displays multiple data-points as series on a panel. This is the default display function for an indicator and will
		 * work for 90% of custom indicators.
		 * It also inserts the study results into the studyPanelMap to be selected as the basis for another study.
		 * @param  {object} stx    The chart object
		 * @param  {object} sd     The study descriptor
		 * @param  {object} panel  A reference to the study panel
		 * @param  {string} name   The name of this study instance (should match field from 'quotes' needed to render this line)
		 * @param  {array} quotes The array of quotes (dataSegment)
		 * @memberOf STX.Studies
		 */
		STX.Studies.displayIndividualSeriesAsLine=function(stx, sd, panel, name, quotes){
			if(!panel.height) panel.height=panel.bottom-panel.top;
			//var chart=panel.chart;
			STX.Studies.studyPanelMap[name]=sd; //TODO, this will need to take into consideration ...?
		    var context=stx.chart.context;
			context.lineWidth=1;
			if(sd.highlight) context.lineWidth=3;
			var color=sd.outputs[sd.outputMap[name]];
			if(color=="auto") color=stx.defaultColor;	// This is calculated and set by the kernel before draw operation.
			context.strokeStyle=color;
			var labelDecimalPlaces=0;
			if(panel.yAxis.shadow<1000) labelDecimalPlaces=2;
			if(panel.yAxis.shadow<5) labelDecimalPlaces=4;
			if(!sd.libraryEntry || sd.overlay || sd.underlay) labelDecimalPlaces=null; // will end up using the same as the chart itself
			if(panel.yAxis.decimalPlaces || panel.yAxis.decimalPlaces===0) labelDecimalPlaces=panel.yAxis.decimalPlaces;

		    stx.plotLineChart(panel, quotes, name, {skipTransform:stx.panels[sd.panel].name!=sd.chart.name, label:stx.preferences.labels, labelDecimalPlaces: labelDecimalPlaces, noSlopes: sd.libraryEntry && sd.libraryEntry.parameters && sd.libraryEntry.parameters.noSlopes});

			if(sd.libraryEntry && sd.libraryEntry.appendDisplaySeriesAsLine) sd.libraryEntry.appendDisplaySeriesAsLine(stx, sd, quotes, name, panel);
			context.lineWidth=1;
		};

		/**
		 * Draws a horizontal line on the study.
		 * @param  {object} stx    The chart object
		 * @param  {object} sd     The study descriptor
		 * @param  {array} quotes The array of quotes (unused)
		 * @param  {number} price  The price (value) to draw the horizontal line
		 * @memberOf STX.Studies
		 */
		STX.Studies.drawHorizontal=function(stx, sd, quotes, price){
			var panel = stx.panels[sd.panel];
			if(!panel) return;

			var y=stx.pixelFromPrice(price, panel);
			stx.plotLine(panel.left, panel.right, y, y, "#DDDDDD", "segment", stx.chart.context, false, {});
		};

		/**
		 * A sample of a custom display function. This function creates the yAxis, draws **a single** histogram and then plots the series.
		 * Note that to differentiate between a regular series and the histogram series there is a convention to use sd.name+"_hist" for histogram values on a study</b> See {@link STX.Studies.createHistogram} for details</p>
		 * @param  {object} stx      The chart object
		 * @param  {object} sd       The study descriptor
		 * @param  {array} quotes   The quotes (dataSegment)
		 * @memberOf STX.Studies
		 */
		STX.Studies.displayHistogramWithSeries=function(stx, sd, quotes) {
			var panel=stx.panels[sd.panel];
			STX.Studies.createYAxis(stx, sd, quotes, panel);
			STX.Studies.createHistogram(stx, sd, quotes, false, 0.4);
			STX.Studies.displaySeriesAsLine(stx, sd, quotes);
		};

		STX.Studies.drawZones=function(stx,sd,quotes){
			if(!sd.parameters || !sd.parameters.studyOverZonesEnabled) return;

			var low=parseFloat(sd.parameters.studyOverSoldValue);
			var high=parseFloat(sd.parameters.studyOverBoughtValue);
			var lowColor=sd.parameters.studyOverSoldColor;
			var highColor=sd.parameters.studyOverBoughtColor;
			var output=sd.zoneOutput;
			if(!output) output="Result";
			var zoneColor=sd.outputs[output];
			if(!zoneColor || zoneColor=="auto" || STX.isTransparent(zoneColor)) zoneColor=stx.defaultColor;
			if(!lowColor) lowColor=zoneColor;
			if(!highColor) highColor=zoneColor;
			var panel=stx.panels[sd.panel];
			var drawBorders=panel.yAxis.displayBorder;
			if(stx.axisBorders===false) drawBorders=false;
			if(stx.axisBorders===true) drawBorders=true;
			var borderEdge=Math.round(panel.right)+0.5;
			var w=drawBorders?borderEdge-0.5:panel.right;
			var tickWidth=drawBorders?3:0; // pixel width of tick off edge of border

			var color=stx.chart.context.fillStyle;

			stx.chart.context.globalAlpha=0.2;

			stx.startClip(panel.name, true);
			panel.yAxis.yAxisPlotter=new STX.Plotter();
			panel.yAxis.yAxisPlotter.newSeries("border", "stroke", stx.canvasStyle("stx_grid_border"));

			stx.chart.context.beginPath();
			var ph=Math.round(stx.pixelFromPrice(high,panel))+0.5;
			stx.chart.context.strokeStyle=highColor;
			stx.chart.context.moveTo(panel.left,ph);
			stx.chart.context.lineTo(w,ph);
			stx.chart.context.stroke();
			stx.chart.context.closePath();

			stx.chart.context.beginPath();
			var pl=Math.round(stx.pixelFromPrice(low,panel))+0.5;
			stx.chart.context.strokeStyle=lowColor;
			stx.chart.context.moveTo(panel.left,pl);
			stx.chart.context.lineTo(w,pl);
			stx.chart.context.stroke();
			stx.chart.context.closePath();

			if(drawBorders){
				panel.yAxis.yAxisPlotter.moveTo("border", borderEdge-0.5, ph);
				panel.yAxis.yAxisPlotter.lineTo("border", borderEdge+tickWidth, ph);
				panel.yAxis.yAxisPlotter.moveTo("border", borderEdge-0.5, pl);
				panel.yAxis.yAxisPlotter.lineTo("border", borderEdge+tickWidth, pl);
			}

			stx.chart.context.fillStyle=color;

			STX.Studies.preparePeakValleyFill(stx,quotes,{panelName:sd.panel, band:output + " " + sd.name, threshold:high, direction:1, color:highColor});
			STX.Studies.preparePeakValleyFill(stx,quotes,{panelName:sd.panel, band:output + " " + sd.name, threshold:low, direction:-1, color:lowColor});

			stx.chart.context.globalAlpha=1;

			if(!sd.libraryEntry.yaxis){
				var yAxis=panel.yAxis;
				if(drawBorders){
					var b=Math.round(yAxis.bottom)+0.5;
					panel.yAxis.yAxisPlotter.moveTo("border", borderEdge, yAxis.top);
					panel.yAxis.yAxisPlotter.lineTo("border", borderEdge, b);
					panel.yAxis.yAxisPlotter.draw(stx.chart.context, "border");
				}

				// Draw the y-axis with high/low
				stx.canvasFont("stx_yaxis");
				stx.canvasColor("stx_yaxis");
				var ypx=panel.height/panel.shadow;
				var textX=yAxis.left + tickWidth + 3;
				stx.chart.context.fillText(high, textX, ph);
				stx.chart.context.fillText(low, textX, pl);
				panel.axisDrawn=true;
			}
			stx.endClip();
			stx.chart.context.globalAlpha=1;
		};

		STX.Studies.prepareChannelFill=function(stx, quotes, parameters){
			//We use the quote cache for our y values since we already plotted the series.
			var panel=stx.panels[parameters.panelName];
	        var t=panel.yAxis.top;
			var b=panel.yAxis.bottom;
			var noSlopes=parameters.noSlopes;
			var candleWidth=stx.layout.candleWidth;
			var x0=panel.left - (noSlopes?1:0.5)*candleWidth + stx.micropixels - 1;
			var x1=x0;
			//if(!noSlopes && quotes[0] && quotes[0].candleWidth){
            //	candleWidth=(candleWidth+quotes[0].candleWidth)/2;
            //}

          	function getLeftmost(band, y){
        		var leftTick=stx.chart.dataSet.length-stx.chart.scroll;
				if(noSlopes || leftTick<=0){
					return [0,y];
				}else if(leftTick>0){
					var baseline=stx.chart.dataSet[leftTick];
					if(panel.name==stx.chart.panel.name && baseline.transform) baseline=baseline.transform;
					var y0=baseline[band];
					y0=panel.yAxis.semiLog?stx.pixelFromPrice(y0,panel):(panel.yAxis.high-y0)*panel.yAxis.multiplier+t;
					if(!isNaN(y0)) return [x0,y0];
				}
				return null;
			}

			var highs=[],lows=[];
		    for(var i=1;i<=quotes.length;i++){
 		    	var quote_1=quotes[i-1];
				if(!noSlopes && !highs.length && quote_1 && quote_1.candleWidth){
	            	candleWidth=(candleWidth+quote_1.candleWidth)/2;
	            }
	           	x1+=candleWidth;
		    	if(!quote_1 || !quote_1.cache) continue;
	            if(quote_1.candleWidth) candleWidth=quote_1.candleWidth/2;
	            else candleWidth=stx.layout.candleWidth/2;
				if(i==quotes.length){
					if(noSlopes){
	            		highs.push([x1+2*candleWidth,highs[highs.length-1][1]]);
	            		lows.push([x1+2*candleWidth,lows[lows.length-1][1]]);
					}
					break;
				}

	            var quote=quotes[i];
            	if(noSlopes) candleWidth+=candleWidth;
            	else if(quote.candleWidth) candleWidth+=quote.candleWidth/2;
	            else candleWidth+=stx.layout.candleWidth/2;
				var x2=x1+candleWidth;

            	if(panel.name==stx.chart.name && quote_1.transform) quote_1=quote_1.transform;
		        if(!highs.length){
		            var hy1=quote_1.cache[parameters.topBand];
		            if(!isNaN(hy1)){
		            	if(i==1) {
		            		var lh=getLeftmost(parameters.topBand, hy1);
		            		if(lh!==null) highs.push(lh);
			            	if(noSlopes) highs.push([x1,lh[1]]);
		            	}
		            	highs.push([x1,hy1]);
		            }
		        }

	            if(!lows.length){
		            var ly1=quote_1.cache[parameters.bottomBand];
		            if(!isNaN(ly1)){
		            	if(i==1) {
		            		var ll=getLeftmost(parameters.bottomBand, ly1);
		            		if(ll!==null) lows.push(ll);
			            	if(noSlopes) lows.push([x1,ll[1]]);
		            	}
		            	lows.push([x1,ly1]);
		            }
	            }

				if(panel.name==stx.chart.name && quote.transform) quote=quote.transform;
	            if(highs.length || lows.length){
	            	if(highs.length){
		            	if(noSlopes){
		            		highs.push([x2,highs[highs.length-1][1]]);
		            	}
		            	var hy2=quote.cache[parameters.topBand];
		            	highs.push([x2,hy2]);
	            	}
	            	if(lows.length){
		            	if(noSlopes){
		            		lows.push([x2,lows[lows.length-1][1]]);
		            	}
		            	var ly2=quote.cache[parameters.bottomBand];
		            	lows.push([x2,ly2]);
	            	}
	            }
		    }
		    var points=highs.concat(lows.reverse());
		    var opacity=parameters.opacity;
		    STX.Studies.fillArea(stx, points, parameters.color, opacity, parameters.panelName);
		};

		STX.Studies.prepareIntersectingFill=function(stx, sd, quotes, parameters){
		    var offset=0;//stx.offset;
		    var intersections = [];
		    var panel=stx.panels[sd.panel];

		    var i,ax1,ax2,bx1,bx2,ay1,ay2,by1,by2,interX,interY;
			stx.startClip(sd.panel);
			var copyQuotes=[];
		    for(i=0;i<quotes.length;i++){ //creates array of local quote values
		    	if(!quotes[i]){
		    		copyQuotes.push(null);
		    	}else{
			    	copyQuotes.push(quotes[i].transform?quotes[i].transform:quotes[i]);
			    }
		    }
		    for(i=0;i<copyQuotes.length-1;i++){ //creates array of intersection points
		    	if(!copyQuotes[i]) continue;
		    	if(!copyQuotes[i+1]) continue;
				if(panel.name==stx.chart.name){
					if(copyQuotes[i].transform) copyQuotes[i]=copyQuotes[i].transform;
					if(copyQuotes[i+1].transform) copyQuotes[i+1]=copyQuotes[i+1].transform;
		        }
		        if(copyQuotes[i][parameters.topBand]===null || isNaN(copyQuotes[i][parameters.topBand])) continue;
		        else if((copyQuotes[i][parameters.topBand]>=copyQuotes[i][parameters.bottomBand] && copyQuotes[i+1][parameters.topBand]<=copyQuotes[i+1][parameters.bottomBand]) || (copyQuotes[i][parameters.topBand]<=copyQuotes[i][parameters.bottomBand] && copyQuotes[i+1][parameters.topBand]>=copyQuotes[i+1][parameters.bottomBand])){
		            ax1=stx.pixelFromBar(i)+offset;
		            ax2=stx.pixelFromBar(i+1)+offset;
		            bx1=ax1;
		            bx2=ax2;
		            ay1=stx.pixelFromPrice(copyQuotes[i][parameters.topBand], panel);
		            ay2=stx.pixelFromPrice(copyQuotes[i+1][parameters.topBand], panel);
		            by1=stx.pixelFromPrice(copyQuotes[i][parameters.bottomBand], panel);
		            by2=stx.pixelFromPrice(copyQuotes[i+1][parameters.bottomBand], panel);

		            interX=STX.intersectLineLineX(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2);
		            interY=STX.intersectLineLineY(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2);
		            var intersection={};
		            intersection.x=interX;
		            intersection.y=interY;
		            intersection.tick=i+1;
		            intersections.push(intersection);
		        }
		    }

		    var futureIntersections = [];
		    for(i=0;parameters.fillFuture && sd.futureA && i<sd.futureA.length-1;i++){ //creates array of future intersection points so clouds project into the future
		        if(sd.futureA[i]===null || isNaN(sd.futureA[i]));
		        else if((sd.futureA[i]>sd.futureB[i] && sd.futureA[i+1]<sd.futureB[i+1]) || (sd.futureA[i]<sd.futureB[i] && sd.futureA[i+1]>sd.futureB[i+1])){
		            ax1=stx.pixelFromBar(copyQuotes.length+i)+offset;
		            ax2=stx.pixelFromBar(copyQuotes.length+i+1)+offset;
		            bx1=ax1;
		            bx2=ax2;
		            ay1=stx.pixelFromPrice(sd.futureA[i], panel);
		            ay2=stx.pixelFromPrice(sd.futureA[i+1], panel);
		            by1=stx.pixelFromPrice(sd.futureB[i], panel);
		            by2=stx.pixelFromPrice(sd.futureB[i+1], panel);

		            interX=STX.intersectLineLineX(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2);
		            interY=STX.intersectLineLineY(ax1, ax2, ay1, ay2, bx1, bx2, by1, by2);
		            var fIntersection={};
		            fIntersection.x=interX;
		            fIntersection.y=interY;
		            fIntersection.tick=copyQuotes.length+i+1;
		            futureIntersections.push(fIntersection);
		        }
		    }
		    var k,m,n;
	        stx.chart.context.globalAlpha=0.3;
	        stx.chart.context.beginPath();
        	//first cloud, which is open on the left of the chart, possibly on the right as well
        	var start=0;
        	var end=copyQuotes.length;
        	if(intersections.length) end=intersections[0].tick;
        	while(start<=end && !copyQuotes[start]) start++;
        	if(start<=end){
		        if(copyQuotes[start][parameters.topBand]>copyQuotes[start][parameters.bottomBand]){
		            stx.chart.context.fillStyle=sd.outputs[sd.outputMap[parameters.topBand]];
		        }
		        else{
		            stx.chart.context.fillStyle=sd.outputs[sd.outputMap[parameters.bottomBand]];
		        }
			    stx.chart.context.moveTo(stx.chart.left+offset,stx.pixelFromPrice(copyQuotes[start][parameters.topBand], panel));
	            for(n = start;n<end;n++){
	                stx.chart.context.lineTo(stx.pixelFromBar(n)+offset,stx.pixelFromPrice(copyQuotes[n][parameters.topBand], panel));
	            }
	            if(intersections[0]){
	            	stx.chart.context.lineTo(intersections[0].x,intersections[0].y);
	            }
	            for(m = end-1;m>=start;m--){
	                stx.chart.context.lineTo(stx.pixelFromBar(m)+offset,stx.pixelFromPrice(copyQuotes[m][parameters.bottomBand], panel));
	            }
	            stx.chart.context.lineTo(stx.chart.left+offset,stx.pixelFromPrice(copyQuotes[start][parameters.bottomBand], panel));
	            stx.chart.context.lineTo(stx.chart.left+offset,stx.pixelFromPrice(copyQuotes[start][parameters.topBand], panel));
		        stx.chart.context.fill();
            }
		    for(k = 0;k<intersections.length;k++){
		        stx.chart.context.beginPath();
		        stx.chart.context.moveTo(intersections[k].x,intersections[k].y);
		        if(copyQuotes[intersections[k].tick][parameters.topBand]>copyQuotes[intersections[k].tick][parameters.bottomBand]){
		            stx.chart.context.fillStyle=sd.outputs[sd.outputMap[parameters.topBand]];
		        }
		        else{
		            stx.chart.context.fillStyle=sd.outputs[sd.outputMap[parameters.bottomBand]];
		        }
		        if(k+1==intersections.length){ //last cloud in the present
		            for(n = intersections[k].tick;n<copyQuotes.length;n++){
		                stx.chart.context.lineTo(stx.pixelFromBar(n)+offset,stx.pixelFromPrice(copyQuotes[n][parameters.topBand], panel));
		            }
		            for(m = copyQuotes.length-1;m>=intersections[k].tick;m--){
		                stx.chart.context.lineTo(stx.pixelFromBar(m)+offset,stx.pixelFromPrice(copyQuotes[m][parameters.bottomBand], panel));
		            }
		        }
		        else{ //draw past clouds
		            for(n = intersections[k].tick;n<intersections[k+1].tick;n++){
		                stx.chart.context.lineTo(stx.pixelFromBar(n)+offset,stx.pixelFromPrice(copyQuotes[n][parameters.topBand], panel));
		            }
		            stx.chart.context.lineTo(intersections[k+1].x,intersections[k+1].y);
		            for(m = intersections[k+1].tick-1;m>=intersections[k].tick;m--){
		                stx.chart.context.lineTo(stx.pixelFromBar(m)+offset,stx.pixelFromPrice(copyQuotes[m][parameters.bottomBand], panel));
		            }
		        }
		        stx.chart.context.fill();
		    }

		    if(parameters.fillFuture){
		    	stx.chart.context.beginPath();
			    if(k>=0 && copyQuotes[copyQuotes.length-1]){
			        stx.chart.context.moveTo(stx.pixelFromBar(copyQuotes.length-1)+offset,stx.pixelFromPrice(copyQuotes[copyQuotes.length-1][parameters.topBand], panel));
			        var ql;
			        if(!futureIntersections.length){ //no future intersections, just continue present cloud
			            ql=copyQuotes.length;
			            for(n = 0;n<sd.futureA.length;n++){
			                stx.chart.context.lineTo(stx.pixelFromBar(ql)+offset,stx.pixelFromPrice(sd.futureA[n], panel));
			                ql++;
			            }
			            ql--;
			            for(n = sd.futureB.length-1;n>=0;n--){
			                stx.chart.context.lineTo(stx.pixelFromBar(ql)+offset,stx.pixelFromPrice(sd.futureB[n], panel));
			                ql--;
			            }
			            stx.chart.context.lineTo(stx.pixelFromBar(copyQuotes.length-1)+offset,stx.pixelFromPrice(copyQuotes[copyQuotes.length-1][parameters.bottomBand], panel));
			            stx.chart.context.fill();
			        }
			        else{ //finish present cloud so we can start on the future clouds
			            ql=copyQuotes.length;

			            for(n = 0;n<futureIntersections[0].tick-copyQuotes.length;n++){
			                stx.chart.context.lineTo(stx.pixelFromBar(ql)+offset,stx.pixelFromPrice(sd.futureA[n], panel));
			                ql++;
			            }
			            ql--;
			            stx.chart.context.lineTo(futureIntersections[0].x,futureIntersections[0].y);
			            for(n = futureIntersections[0].tick-1-copyQuotes.length;n>=0;n--){
			                stx.chart.context.lineTo(stx.pixelFromBar(ql)+offset,stx.pixelFromPrice(sd.futureB[n], panel));
			                ql--;
			            }
			            stx.chart.context.lineTo(stx.pixelFromBar(copyQuotes.length-1)+offset,stx.pixelFromPrice(copyQuotes[copyQuotes.length-1][parameters.bottomBand], panel));
			            stx.chart.context.fill();
			        }
			    }

			    for(k = 0;k<futureIntersections.length;k++){
			        stx.chart.context.lineWidth=0;
			        stx.chart.context.globalAlpha=0.3;
			        stx.chart.context.beginPath();
			        stx.chart.context.moveTo(futureIntersections[k].x,futureIntersections[k].y);
			        if(sd.futureA[futureIntersections[k].tick-copyQuotes.length]>sd.futureB[futureIntersections[k].tick-copyQuotes.length]){
			            stx.chart.context.fillStyle=sd.outputs[sd.outputMap[parameters.topBand]];
			        }
			        else{
			            stx.chart.context.fillStyle=sd.outputs[sd.outputMap[parameters.bottomBand]];
			        }
			        if(k+2>futureIntersections.length){ //last cloud
			            for(n = futureIntersections[k].tick;n<sd.futureA.length+copyQuotes.length;n++){
			                stx.chart.context.lineTo(stx.pixelFromBar(n)+offset,stx.pixelFromPrice(sd.futureA[n-copyQuotes.length], panel));
			            }
			            for(m = sd.futureA.length-1;m>=futureIntersections[k].tick-copyQuotes.length;m--){
			                stx.chart.context.lineTo(stx.pixelFromBar(m+copyQuotes.length)+offset,stx.pixelFromPrice(sd.futureB[m], panel));
			            }
			        }
			        else{ //draw future clouds
			            for(n = futureIntersections[k].tick;n<futureIntersections[k+1].tick;n++){
			                stx.chart.context.lineTo(stx.pixelFromBar(n)+offset,stx.pixelFromPrice(sd.futureA[n-copyQuotes.length], panel));
			            }
			            stx.chart.context.lineTo(futureIntersections[k+1].x,futureIntersections[k+1].y);
			            for(m = futureIntersections[k+1].tick-1;m>=futureIntersections[k].tick;m--){
			                stx.chart.context.lineTo(stx.pixelFromBar(m)+offset,stx.pixelFromPrice(sd.futureB[m-copyQuotes.length], panel));
			            }
			        }
			        stx.chart.context.fill();
			    }
		    }
		    stx.endClip();
	        stx.chart.context.globalAlpha=1;
		};

		STX.Studies.preparePeakValleyFill=function(stx, quotes, parameters){
			//We use the quote cache for our y values since we already plotted the series.
			var panel=stx.panels[parameters.panelName];
	        var t=panel.yAxis.top;
			var b=panel.yAxis.bottom;
			if(!parameters.threshold && parameters.threshold!==0) return;
			var yThresh;  //where threshold hits yaxis
			if(parameters.panelName==stx.chart.panel.name){
				yThresh=stx.pixelFromPriceTransform(parameters.threshold, panel);
			}else{
				yThresh=stx.pixelFromPrice(parameters.threshold, panel);
			}
			var candleWidth=stx.layout.candleWidth;
        	var x1=panel.left - 0.5*candleWidth + stx.micropixels - 1;
			var x0=x1;
        	var points=[];
		    for(var i=1;i<quotes.length;i++){
		    	var quote=quotes[i];
		    	var quote_1=quotes[i-1];
				//if(!points.length){
					if(quote_1 && quote_1.candleWidth){
						candleWidth=(candleWidth+quote_1.candleWidth)/2;
					}else{
						candleWidth=(candleWidth+stx.layout.candleWidth)/2;
					}
	            //}
	           	x1+=candleWidth;
		    	if(!quote_1) continue;
	            if(quote_1.candleWidth) candleWidth=quote_1.candleWidth/2;
	            else candleWidth=stx.layout.candleWidth/2;

		    	var qItem,qItem_1;
		    	if(parameters.panelName==stx.chart.panel.name){
		    		// Case 1, on the chart (such as a baseline_delta)
		    		qItem=quote.cache[parameters.band];
		    		qItem_1=quote_1.cache[parameters.band];
					if(quote.transform) qItem=stx.pixelFromPrice(quote.transform[parameters.band],panel);
					if(quote_1.transform) qItem_1=stx.pixelFromPrice(quote_1.transform[parameters.band],panel);
				}else if(quote.cache && quote_1.cache){
					// Case 2, we already have a cache going. This will be faster than computing.
			    	qItem=quote.cache[parameters.band];
			    	qItem_1=quote_1.cache[parameters.band];
			    	// If the cache hasn't gotten the bands yet then we need to compute
			    	if(typeof qItem=="undefined" || typeof qItem_1=="undefined"){
			    		qItem=stx.pixelFromPrice(quote[parameters.band], panel);
			    		qItem_1=stx.pixelFromPrice(quote_1[parameters.band],panel);
			    	}
			    }else{
			    	// Case 3, no cache established yet then we need to compute
			    	qItem=stx.pixelFromPrice(quote[parameters.band], panel);
			    	qItem_1=stx.pixelFromPrice(quote_1[parameters.band],panel);
			    }
		        if(!points.length){
	            	if(i==1){
	            		var leftTick=stx.chart.dataSet.length-stx.chart.scroll;
						if(leftTick>0){
							var baseline=stx.chart.dataSet[leftTick];
							if(panel.name==stx.chart.panel.name && baseline.transform) baseline=baseline.transform;
							var y0=baseline[parameters.band];
							y0=panel.yAxis.semiLog?stx.pixelFromPrice(y0,panel):(panel.yAxis.high-y0)*panel.yAxis.multiplier+t;
							var y0Clipped=y0;//Math.max(t,Math.min(b,y0));
				            if(!isNaN(y0Clipped)){
				            	if(y0>=yThresh && qItem_1>=yThresh){
					            	points.push([x0, parameters.direction==1?yThresh:y0Clipped]);
				            	}else if(y0<=yThresh && qItem_1<=yThresh){
						            points.push([x0, parameters.direction==-1?yThresh:y0Clipped]);
				            	}else{
				            		points.push([x1-(x1-x0)*(yThresh-qItem_1)/(y0-qItem_1),yThresh]);
				            	}
				            }
						}
					}

	            	var y1=qItem_1;//Math.max(t,Math.min(b,qItem_1));
		            if(y1 && !isNaN(y1)){
		            	if((quote_1[parameters.band]>=parameters.threshold && parameters.direction==1) || (quote_1[parameters.band]<=parameters.threshold && parameters.direction==-1)){
		            		points.push([x1,y1]);
		            	}else{
		            		points.push([x1,yThresh]);
		            	}
		            }
		        }

	            if(quote.candleWidth) candleWidth+=quote.candleWidth/2;
	            else candleWidth+=stx.layout.candleWidth/2;
            	if(points.length){
	            	var x2=x1+candleWidth;
	            	if(stx.extendLastTick && i==quotes.length-1) x2+=candleWidth/2;
		           	var y2=qItem;//Math.max(t,Math.min(b,qItem));
		           	if((quote[parameters.band]>parameters.threshold && parameters.direction==1) || (quote[parameters.band]<parameters.threshold && parameters.direction==-1)){
		           		if(points[points.length-1][1]==yThresh){
		           			points.push([points[points.length-1][0]+(x2-points[points.length-1][0])*(yThresh-qItem_1)/(y2-qItem_1),yThresh]);
		          		}
		           		points.push([x2,y2]);
		           	}else{
		           		if(points[points.length-1][1]!=yThresh){
		           			points.push([points[points.length-1][0]+(x2-points[points.length-1][0])*(yThresh-qItem_1)/(y2-qItem_1),yThresh]);
		           		}
		            	points.push([x2,yThresh]);
		            }
	            }
		    }
		    if(!points.length) return;
		    if(parameters.edgeHighlight){
		    	if(parameters.edgeParameters.lineWidth>100) parameters.edgeParameters.lineWidth=1; // trap case where no width is specified in the css
		    	for(var p=0;p<points.length-1;p++){
		    		if(points[p][1]!=yThresh || points[p+1][1]!=yThresh)
		    			stx.plotLine(points[p][0],points[p+1][0],points[p][1],points[p+1][1],parameters.edgeHighlight,"segment",stx.chart.context,true,parameters.edgeParameters);
		    	}
		    }
		    points.push([points[points.length-1][0],yThresh],[points[0][0],yThresh]);
		    var opacity=parameters.opacity;
		    if(!opacity && opacity!==0) opacity=0.3;
		    STX.Studies.fillArea(stx, points, parameters.color, opacity, parameters.panelName);
		};


		/**
		 * Draws a histogram on the study.
		 * Initial bar color is defined in stx-chart.css under '.stx_histogram'. If using the default UI, refer to stx-standard.css under '.Light .stx_histogram' and '.Dark .stx_histogram' style sections.
		 * If sd.outputs["Decreasing Bar"] and sd.outputs["Increasing Bar"] are present, their corresponding colors will be used instead.
		 * <p><b>Note the convention to use sd.name+"_hist" for histogram values on a study</b></p>
		 *
		 * @param  {object} stx      The chart object
		 * @param  {object} sd       The study descriptor
		 * @param  {array} quotes   The quotes (dataSegment)
		 * @param  {boolean} centered If true then the histogram will be physically centered on the yAxis, otherwise it will be centered at the zero value on the yAxis
		 * @param  {number} [opacity=1] Optionally set the opacity
		 * @memberOf STX.Studies
		 */

		STX.Studies.createHistogram=function(stx, sd, quotes, centered, opacity){
			var panel = stx.panels[sd.panel];
			stx.startClip(panel.name);

			var myWidth=stx.layout.candleWidth-2;
			if(myWidth<2) myWidth=1;

			var y=stx.pixelFromPrice(0, panel);
			if(panel.min>0) y=stx.pixelFromPrice(panel.min, panel); // Don't draw below the bottom of the chart. If zero isn't on the chart then make it behave like a bar graph.
			if(centered){
				y=Math.floor(panel.top + panel.height/2);
			}

			var context=stx.chart.context;
			var field=sd.name+"_hist";
			if(!sd.outputs["Decreasing Bar"] && !sd.outputs["Negative Bar"])
				stx.canvasColor("stx_histogram");
			else
				context.globalAlpha=opacity?opacity:1;
			var y0,y1;
			for(var i=0;i<quotes.length;i++){
				var quote=quotes[i];
				if(!quote) continue;
				if(quote.candleWidth) myWidth=Math.floor(Math.max(1,quote.candleWidth-2));
				var x0=Math.floor(stx.pixelFromBar(i, panel.chart)-myWidth/2);
				var x1=Math.floor(myWidth);
				y0=y1;
				y1=stx.pixelFromPrice(quote[field], panel)-y;
				if(sd.outputs["Decreasing Bar"] && y1>y0) context.fillStyle=sd.outputs["Decreasing Bar"];
				else if(sd.outputs["Increasing Bar"] && y1<y0) context.fillStyle=sd.outputs["Increasing Bar"];
				else if(sd.outputs["Positive Bar"] && y1<0) context.fillStyle=sd.outputs["Positive Bar"];
				else if(sd.outputs["Negative Bar"] && y1>0) context.fillStyle=sd.outputs["Negative Bar"];
				context.fillRect(x0, y, x1, Math.floor(y1));
			}

			context.globalAlpha=1;
			stx.endClip();
		};

		/**
		 * Convenience function for creating a volume style chart that supports multiple colors
		 * of volume bars. If borderMap (border colors) is passed in then the chart will display in a format where bars are flush against
		 * one another so that there is no white space between bars. If however a borderMap is not specified then white space will be left
		 * between the bars.
		 * @param  {STXChart} stx      The chart object
		 * @param  {object} sd       The study descriptor
		 * @param  {object} colorMap Map of colors to arrays. Each array should contain entries for each dataSegment bar mapped to that color.
		 * It should contain null values for any bar that shouldn't be drawn
		 * @param {object} borderMap Map of border colors for each color. If null then no borders will be drawn.
		 * @example
		 * var colorMap={};
		 * colorMap["#FF0000"]=[56,123,null,null,45];
		 * colorMap["#00FF00"]=[null,null,12,13,null];
		 *
		 * var borderMap={
		 *    "#FF0000": "#FFFFFF",
		 *    "#00FF00": "#FFFFDD"
		 * };
		 * STX.Studies.volumeChart(stx, sd, colorMap, borderMap);
		 * @memberOf STX.Studies
		 */
		STX.Studies.volumeChart=function(stx, sd, colorMap, borderMap){
			// Determine min max
			var maximum=Number.MAX_VALUE*-1;
			var color,value;
			for(color in colorMap){
				for(var c=0;c<colorMap[color].length;c++){
					value=colorMap[color][c];
					if(!value) continue;
					if(value>maximum) maximum=value;
				}
			}

			// determine calculation ratios
			var panel = stx.panels[sd.panel];
			var b=Math.floor(panel.yAxis.bottom)+0.5;
			var t=Math.floor(panel.yAxis.top)+0.5;
			var h=(b-t);
			var candleWidth=stx.layout.candleWidth;
			var multiplier=panel.height/maximum;
			var borderColor=null;
			if(!sd.libraryEntry.parameters.displayBorder) borderMap = null;
			var offset=0;
			if(!borderMap) offset=(candleWidth-stx.chart.tmpWidth)/2;
			var context=stx.chart.context;
			context.lineWidth=1;
			stx.startClip(sd.panel);
			for(color in colorMap){
				if(borderMap) borderColor=borderMap[color];
				context.fillStyle=color;
				if(borderColor) context.strokeStyle=borderColor;
				context.beginPath();
				var prevTop=b+0.5;
				var farLeft=Math.floor(stx.pixelFromBar(0, panel.chart));
				var prevRight;
				for(var i=0;i<colorMap[color].length;i++){
					if(stx.chart.dataSegment[i] && stx.chart.dataSegment[i].candleWidth) {
						candleWidth=stx.chart.dataSegment[i].candleWidth;
						if(!borderMap) offset=candleWidth/4;
					}
					else{
						candleWidth=stx.layout.candleWidth;
						if(!borderMap) offset=(candleWidth-stx.chart.tmpWidth)/2;
					}
					if(i===0) {
						farLeft-=candleWidth/2;
						prevRight=farLeft;
					}
					value=colorMap[color][i];
					if(!value){
						prevTop=b;
						prevRight+=candleWidth;
						//if(borderMap) prevRight-=0.5;
						continue;
					}
					var y=value*(h/maximum);
					var top=Math.min(Math.floor((b - h) + (h - y))+0.5,b);
					var x0,x1;
					x0=Math.floor(prevRight+offset);
					x1=Math.floor(prevRight+candleWidth-offset);
					x0=Math.max(x0, farLeft);

					context.moveTo(x0, b);
					context.lineTo(x1, b);
					context.lineTo(x1, top);
					context.lineTo(x0, top);
					if(borderMap){
						if(prevTop>top || i===0) context.lineTo(x0, prevTop); // draw down to the top of the previous bar, so that we don't overlap strokes
					}else{
						context.lineTo(x0, b);
					}
					prevTop=top;
					prevRight+=candleWidth;
					//if(borderMap) prevRight-=0.5;
				}
				context.fill();
				context.strokeStyle = borderColor;
				if(borderMap && stx.layout.candleWidth>=2) context.stroke();
				context.closePath();
			}
			stx.endClip();
		};

		/**
		 * Used to reduce certain common fields to abbreviated form for display in study panel labels
		 * @type {Object}
		 * @memberOf STX.Studies
		 */
		STX.Studies.prettify={
				"Close":"C",
				"Open":"O",
				"High":"H",
				"Low":"L",
				",simple":"",
				"simple":"",
				"exponential":"ema",
				"time series":"ts",
				"triangular":"tri",
				"variable":"var",
				"VIDYA":"vidya",
				"weighted":"wa",
				"welles wilder":"ww"
		};

		STX.Studies.prettyRE=/^.*\((.*?)\).*$/;

		/**
		 * Convert a study ID into a displayable format
		 * @param  {string} id The ID
		 * @return {string}    A pretty (shortened) ID
		 * @memberOf STX.Studies
		 */
		STX.Studies.prettyDisplay=function(id){
			var match = STX.Studies.prettyRE.exec(id);
			if(!match) return id;
			var guts=match[1];
			if(guts){
				for(var i in STX.Studies.prettify){
					guts=guts.replace(i, STX.Studies.prettify[i]);
				}
				id=id.replace(match[1], guts);
			}
			return id;
		};

		/**
		 * The default initialize function for a study. It creates the study descriptor. It creates the panel if one is required.
		 *
		 * @param  {object} stx        The chart object
		 * @param  {string} type       The type of study (from studyLibrary)
		 * @param  {object} inputs     The inputs for the study instance
		 * @param  {object} outputs    The outputs for the study instance
		 * @param  {object} [parameters] Optional parameters if required or supported by this study
		 * @param {string} [panelName] Optional panel. If not provided then the panel will be determined dynamically.
		 * @return {object}            The newly initialized study descriptor
		 * @memberOf STX.Studies
		 */
		STX.Studies.initializeFN=function(stx, type, inputs, outputs, parameters, panelName){
			function determinePanelForOverlay(inputs, parameters, panels){
				var panel=null;
				if(inputs.Field){
					var st=STX.Studies.studyPanelMap[inputs.Field];
					if(st) panel=st.panel;
					if(inputs.Field=="Volume") {
						if(panels.vchart) panel="vchart";
						else panel="volume";
					}
				}
				if(!panel) panel=parameters.chartName;	// If a panel isn't specified then this is an overlay on the chart itself
				return panel;
			}
			if(!inputs) inputs={
					id: type
			};
			if(!parameters) parameters={};
			if(!inputs.display) inputs.display=STX.Studies.prettyDisplay(inputs.id);
			var sd=new STX.Studies.StudyDescriptor(inputs.id, type, inputs.id, inputs, outputs, parameters);
			if(inputs.Period) sd.days=parseInt(sd.inputs.Period); // you can't have fractional day periods so convert to int
			var study=STX.Studies.studyLibrary[type];
			if(study && study.display) inputs.display=study.display; // override what is displayed in the label
			if(!panelName) panelName=inputs.id;
			var isOverlay=!study || study.overlay || inputs.Overlay;
			var isUnderlay=(study && study.underlay) || inputs.Underlay;
			if(isUnderlay) sd.underlay=true;
			if(isOverlay) sd.overlay=true;

			if(parameters.replaceID && (stx.panelExists(parameters.replaceID) || isOverlay || isUnderlay)){
				if(isOverlay || isUnderlay){
					var oldStudy=stx.layout.studies[parameters.replaceID];
					//sd.panel=oldStudy.panel;
					sd.panel=determinePanelForOverlay(inputs, parameters, stx.panels);
					if ( parameters.replaceID != sd.inputs.id) {	// delete the old study if using a different id (not modifying the same study )
						delete stx.layout.studies[parameters.replaceID];
						delete stx.overlays[parameters.replaceID];
						STX.deleteRHS(STX.Studies.studyPanelMap, oldStudy);
					}
				}else{
					sd.panel=panelName;
					var newPanels={};
					for(var p in stx.panels){
						if(p!=parameters.replaceID){
							newPanels[p]=stx.panels[p];
						}else{
							// swap the name/id of the old panel
							var tmp=stx.panels[p];
							tmp.name=panelName;
							tmp.display=inputs.display;
							newPanels[panelName]=tmp;
						}
					}
					stx.panels=newPanels;

					// we want to preserve the order so we keep it unless the ID changed. Otherwise it will attempt to draw the depending study before the base study
					if ( parameters.replaceID != sd.inputs.id) delete stx.layout.studies[parameters.replaceID]; // delete the old study if using a different id (not modifying the same)
				}
			}else if(stx.panelExists(panelName)){
				sd.panel=panelName;
			}else if(!isOverlay && !isUnderlay){
				var panelHeight=study.panelHeight?study.panelHeight:null;
				stx.createPanel(inputs.display, inputs.id, panelHeight, parameters.chartName);
				if(!study.yAxis){
					stx.panels[inputs.id].yAxis.displayGridLines=false;
				}
			}else{
				sd.panel=determinePanelForOverlay(inputs, parameters);
			}
			var panel=stx.panels[sd.panel];
			if(panel && panel.chart.name!=panel.name){
				if(study && study.yAxis){
					STX.extend(panel.yAxis, study.yAxis);
					if(study.yAxis.ground) panel.yAxis.initialMarginBottom=0;
					if(study.yAxis.ground ||
							study.yAxis.initialMarginTop || study.yAxis.initialMarginTop===0 ||
							study.yAxis.initialMarginBottom || study.yAxis.initialMarginBottom===0){
						stx.calculateYAxisMargins(panel.yAxis);
					}
				}else if(study && study.parameters && (study.parameters.zoom || study.parameters.zoom===0)){ // LEGACY, instead add a yAxis to the study
					panel.yAxis.zoom=study.parameters.zoom; // Optionally set the default zoom in the "parameters" in the study library
				}else{
					panel.yAxis.zoom=10;	// Default to slight zoom when adding study panels so that studies are not up on the edge
				}
			}

			return sd;
		};

		/**
		 * Plots over/under zones for indicators that support them, and when the user selects them. This method will draw its own
		 * yAxis which will not have a scale, but merely the over under points.
		 * @private
		 * @memberOf STX.Studies
		 */
		STX.Studies.overZones=function(stx, sd, quotes){
			if(!quotes.length) return;
			var panel=stx.panels[sd.panel];
			if(!panel) return;
			if(panel.hidden) return;
			//var parameters=sd.parameters;
			STX.Studies.displaySeriesAsLine(stx, sd, quotes);
			if(sd.parameters && sd.parameters.studyOverZonesEnabled){
				var overBought=parseFloat(sd.parameters.studyOverBoughtValue), overSold=parseFloat(sd.parameters.studyOverSoldValue);
				var ypx=panel.height/panel.shadow;
				var overBoughtY=panel.bottom-ypx*overBought;
				var overSoldY=panel.bottom-ypx*overSold;
				var parameters={
					lineWidth: 1
				};
				stx.chart.context.globalAlpha=0.2;
				stx.plotLine(panel.left,panel.right-5, overBoughtY, overBoughtY, sd.parameters.studyOverBoughtColor, "segment", stx.chart.context, false, parameters);
				stx.chart.context.globalAlpha=0.2;
				stx.plotLine(panel.left,panel.right-5, overSoldY, overSoldY, sd.parameters.studyOverSoldColor, "segment", stx.chart.context, false, parameters);

				if(!sd.libraryEntry.yaxis){
					// Draw the y-axis with overbought/oversold
					var fontHeight=stx.getCanvasFontSize("stx_yaxis");
					stx.canvasFont("stx_yaxis");
					stx.canvasColor("stx_yaxis");
					stx.chart.context.fillText(overBought, panel.yAxis.left, overBoughtY + (fontHeight/2));
					stx.chart.context.fillText(overSold, panel.yAxis.left, overSoldY + (fontHeight/2));
					panel.axisDrawn=true;
				}
			}
		};



		if(!Function.prototype.stxInheritsFrom){
			/**
			 * Template for JavaScript inheritence.
			 * @param  {object} parentClassOrObject The parent class or object
			 * @param {Boolean} [autosuper=true] Set to false to prevent the base class constructor from being called automatically
			 */
			Function.prototype.stxInheritsFrom = function (parentClassOrObject, autosuper){
				if(autosuper!==false){
					this.prototype=new parentClassOrObject();
				}else{
					this.prototype=Object.create(parentClassOrObject);
					for (var key in parentClassOrObject.prototype)  {
						this.prototype[key] = parentClassOrObject.prototype[key];
					}
				}
				this.prototype.constructor = this;
				this.prototype.parent = parentClassOrObject.prototype;
			};
		}

		/**
		 * Replacement for isPrototypeOf and instanceof so that both types of inheritance can be checked
		 * @param  {Object} parent Prototype
		 * @return {boolean} True if the object is derived from the parent
		 * @memberOf  STX
		 * @since 07/01/2015
		 */
		STX.derivedFrom = function(child, parent){
			if(parent.isPrototypeOf(child)) return true;
			if(child instanceof parent) return true;
			return false;
		};



		/**
		 * Base class for Renderers.
		 * A renderer is used to draw a complex visualization based on one or more "series" of data.
		 * This is a reusable object. Once defined and attached to a chart, it shouldn’t have to be recreated every time a symbol changed.
		 * The series inside the renderers may change with a new symbol, but the linked renderer itself remains the vehicle for adding series.
		 * @name  STX.Renderer
		 * @constructor
		 */
		STX.Renderer=function (){
		};

		/**
		 * If your render manages a yAxis then the necessary calculations (high and low) should be made here
		 * @memberOf STX.Renderer
		 */
		STX.Renderer.prototype.performCalculations=function(){};

		/**
		 * Perform drawing operations here.
		 * @memberOf STX.Renderer
		 */
		STX.Renderer.prototype.draw=function(){};

		/**
		 * Default constructor for a renderer. Override this if desired.
		 * @param  {object} config Configuration for the renderer
		 * @param  {function} [config.callback] Callback function to perform activity post-drawing, for example, creating a legend. It will be called with a 'colors' argument, which will be an array of objects containing the colors used to draw the rendering. ( Example: cb(colors); ). See example for format.
		 * @param  {string} [config.id] Handle to access the rendering in the future.  If not provided, one will be generated.
		 * @param  {object} [config.params] Parameters to control the renderer itself
		 * @param  {string} [config.params.name] Name of the renderer. Default: 'Data'.  This is used when displaying error message on screen
		 * @param  {string} [config.params.panel] The name of the panel to put the rendering on, defaults to "chart"
		 * @param  {boolean} [config.params.overChart] If set to true, will draw the rendering on top of the chart rather than as an underlay. By default rendering will be as underlay.
		 * @param  {boolean} [config.params.yAxis] Optional Y-axis object to use for the series.
		 * @param  {number} [config.params.opacity] Opacity of the rendering as a whole.  Can be overridden by an opacity set for a series.  Valid values are 0.0-1.0. Default: 1
		 * @memberOf STX.Renderer
		 * @example
			stxx.addSeries("NOK", {display:"NOK",data:{useDefaultQuoteFeed:true},width:4});
			stxx.addSeries("SNE", {display:"Sony",data:{useDefaultQuoteFeed:true},width:4});

			var axis=new STXChart.YAxis();
			axis.position="left";
			axis.textStyle="#FFBE00";

			renderer=stxx.setSeriesRenderer(new STX.Renderer.Lines({params:{name:"lines", type:"mountain", yAxis:axis}}));

			renderer.removeAllSeries()
				.attachSeries("NOK", "#FFBE00")
				.attachSeries("SNE", "#FF9300")
				.ready();
			}
		 */
		STX.Renderer.prototype.construct=function(config){
			var params=config.params?config.params:{};
			if(!params.name) params.name=STX.uniqueID();
			if(!params.heightPercentage) params.heightPercentage=0.7;
			if(!params.opacity) params.opacity=1;
			if(!params.type) params.type="line";
			if(params.type=="legacy" || params.type=="line" || params.type=="mountain") params.highlightable=true;
			if(!params.panel) params.panel="chart";
			this.cb=config.callback;
			this.params=params;
			this.seriesParams=[];
			this.caches={};
			this.colors={};
		};

		/**
		 * Attach a series to the renderer.
		 * This assumes that the series data *is already in the dataSet* and simply connects it to the renderer with the specified parameters. See {@link STXChart#addSeries} for details on how to create a series.
		 * See {@link STXChart.addSeries}.
		 *
		 * The color defined when attaching a series will supersede any color defined when a series was created. This allows you to attach the same series to multiple renderers, each rendering displaying the same series data in a different color if desired.
		 *
		 * @param  {String} field      The name of the field. Name of the field in the dataSet to use for the series.
		 * @param  {object} parameters Settings to control color and opacity of <B>each</B> series in the group. See {@link STXChart#addSeries} for implementation examples. <P>Argument format can be:<ul><li> a `string` containing the color</li><li> or a more granular `object` having the following members:</li></ul>
		 * @param  {string} [parameters.fill_color_up] Color to use to fill the part when the Close is higher than the previous (#RRGGBB(AA) format or null to not draw)
		 * @param  {string} [parameters.border_color_up] Color to use to draw the border when the Close is higher than the previous (#RRGGBB(AA) format or null to not draw)
		 * @param  {number} [parameters.opacity_up] Opacity to use to fill the part when the Close is higher than the previous (0.0-1.0). Default: .4
		 * @param  {string} [parameters.fill_color_down] Color to use to fill the part when the Close is lower than the previous (#RRGGBB(AA) format or null to not draw)
		 * @param  {string} [parameters.border_color_down] Color to use to draw the border when the Close is lower than the previous (#RRGGBB(AA) format or null to not draw)
		 * @param  {number} [parameters.opacity_down] Opacity to use to fill the part when the Close is lower than the previous (0.0-1.0) default: .4
		 * @param  {string} [parameters.color] Color to use to fill the series if fill_color_up or fill_color_down is not specified (#RRGGBB(AA) format).
		 * @param  {boolean} [parameters.permanent] For line chart, whether it can be removed by the user. By default the series will not be permanent. This flag (including the default) will supersede the permanent flag of the actual series. As such, a series will not be permanent unless you set this flag to 'true', even if the series being attached was flaged set as permanent when defined. This gives the renderer most control over the rendering process.
		 * @return {STX.Renderer}            Returns a copy of this for chaining
		 * @memberOf STX.Renderer
		 * @example
 			stxx.addSeries("NOK", {display:"NOK",data:{useDefaultQuoteFeed:true},width:4});

			var axis=new STXChart.YAxis();
			axis.position="left";
			axis.textStyle="#FFBE00";

			renderer=stxx.setSeriesRenderer(new STX.Renderer.Lines({params:{name:"lines", type:"mountain", yAxis:axis}}));

			renderer.removeAllSeries()
				.attachSeries("NOK", "#FFBE00")
				.attachSeries("SNE", "#FF9300")
				.ready();
			}
		 */
		STX.Renderer.prototype.attachSeries=function(field, parameters){
			if(!this.stx || !this.stx.chart.series[field]) return this;
			var sp={
				field: 				field,
				chartType:			this.params.type,
				display: 			this.stx.chart.series[field].parameters.display,
				border_color_up:	this.params.defaultBorders?"auto":null,
				fill_color_up:		this.stx.chart.series[field].parameters.color,
				opacity_up:			this.params.opacity,
				border_color_down:	this.params.defaultBorders?"auto":null,
				fill_color_down:	this.stx.chart.series[field].parameters.color,
				opacity_down:		this.params.opacity,
				color:				this.stx.chart.series[field].parameters.color
			};
			if(typeof parameters=="string"){
				sp.color=sp.fill_color_down=sp.fill_color_up=parameters;
			}else if(typeof parameters=="object"){
				for(var p in parameters) sp[p]=parameters[p];
				if(sp.color){
					if(!sp.fill_color_up) sp.fill_color_up=sp.color;
					if(!sp.fill_color_down) sp.fill_color_down=sp.color;
				}
			}

			this.removeSeries(field,true).seriesParams.push(sp);

			if(sp.fill_color_up!=sp.fill_color_down){
				this.colors[field+" up"]={"color":sp.fill_color_up,"opacity":sp.opacity_up,"display":sp.display?sp.display+" up":field+" up"};
				this.colors[field+" dn"]={"color":sp.fill_color_down,"opacity":sp.opacity_down,"display":sp.display?sp.display+" down":field+" down"};
			}else{
				this.colors[field]={"color":sp.fill_color_up,"opacity":sp.opacity_up,"display":sp.display?sp.display:field};
			}
			if(this.params.yAxis){
				this.stx.addYAxis(this.stx.panels[this.params.panel], this.params.yAxis);
			}
	    	return this;
		};

		/**
		 * Removes a series from the renderer and the yAxis from the panel if it is not being used by any current renderers.
		 * @param  {String} field          The field name of the series.
		 * @param  {Boolean} [preserveSeries=false] Set to true to keep the series data in the STXChart object.
		 * @return {STX.Renderer}                A copy of this for chaining
		 * @memberOf STX.Renderer
		 */
		STX.Renderer.prototype.removeSeries=function(field, preserveSeries){
    		for(var sp=0;sp<this.seriesParams.length;sp++){
    			if(this.seriesParams[sp].field==field){
    				this.seriesParams.splice(sp,1);
    				break;
    			}
    		}
    		delete this.colors[field+" up"];
    		delete this.colors[field+" dn"];
    		delete this.colors[field];

    		if(!preserveSeries){
    			if(!this.stx.chart.series[field] || !this.stx.chart.series[field].parameters.permanent){
        			var seriesInUse=false;
					for(var plot in this.stx.chart.seriesRenderers){
						var myPlot=this.stx.chart.seriesRenderers[plot];
						for(var s=0;s<myPlot.seriesParams.length;s++){
							if(myPlot.seriesParams[s].field==field) {
								seriesInUse=true;
								break;
							}
						}
						if(seriesInUse) break;
					}
 					if(!seriesInUse) {
 						this.stx.deleteSeries(field, this.stx.chart);
						STX.Comparison.removeSeries(this.stx,field);
					}

    			}
    		}
    		this.stx.deleteYAxisIfUnused(this.stx.panels[this.params.panel], this.params.yAxis);
    		return this;
		};

		/**
		 * Removes all series from the renderer and the yAxis from the panel if it is not being used by any current renderers.
		 * @param {Boolean} [eraseData=false] Set to true to erase the actual series data in the STXChart otherwise it will be retained
		 * @return {STX.Renderer} A copy of this for chaining
		 * @memberOf STX.Renderer
		 */
		STX.Renderer.prototype.removeAllSeries=function(eraseData){
			if(eraseData){
				var arr=[];
				// Compile a list of all of the fields
	    		for(var sp=0;sp<this.seriesParams.length;sp++){
	    			arr.push(this.seriesParams[sp].field);
	    		}
	    		for(var i=0;i<arr.length;i++){
	    			this.removeSeries(arr[i]);
	    		}
			}
			this.seriesParams=[];
			this.colors={};
    		this.stx.deleteYAxisIfUnused(this.stx.panels[this.params.panel], this.params.yAxis);
			return this;
		};

		/**
		 * Call this to immediately render the visualization, at the end of a chain of commands.
		 * @return {STX.Renderer} A copy of this for chaining
		 * @memberOf STX.Renderer
		 */
		STX.Renderer.prototype.ready=function(){
			this.stx.createDataSet();
			this.stx.draw();
			return this;
		};

		/**
		 * Base class for Drawing Tools. Use stxInheritsFrom() to build a subclass for custom drawing tools.
		 * The name of the subclass should be STX.Drawing.yourname. Whenever STXChart.vectorType==yourname, then
		 * your drawing tool will be the one that is enabled when the user begins a drawing. Capitalization of yourname
		 * must be an exact match otherwise ther kernel will not be able to find your drawing tool.
		 *
		 * Each of the STX.Drawing prototype functions may be overridden. To create a functioning drawing tool
		 * you must override the functions below that create alerts.
		 *
		 * Drawing clicks are always delivered in *adjusted price*. That is, if a stock has experienced splits then
		 * the drawing will not display correctly on an unadjusted price chart unless this is considered during the rendering
		 * process. Follow the templates to assure correct rendering under both circumstances.
		 *
		 * If no color is specified when building a drawing then color will be set to "auto" and the chart will automatically display
		 * white or black depending on the background.
		 * 
		 * **Permanent drawings:**<br>
		 * To make a drawing permanent set its `permanent` property to `true` once created.
		 * <br>Example: <br>
		 * ```drawingObject.permanent=true;```
		 * 
		 * See {@tutorial Custom Drawing Tools} for more details.
		 *
		 * @name  STX.Drawing
		 * @constructor
		 */
		STX.Drawing=function (){
			this.chartsOnly=false;	// Set this to true to restrict drawing to panels containing charts (as opposed to studies)
			this.penDown=false;   // Set to true when in the midst of creating the object
		};

		/**
		 * Set to true when need to hold mouse down to draw; set to false for click on/off draw
		 * @memberOf STX.Drawing
		 * @example
		 * STX.Drawing.prototype.dragToDraw=true;
		 */
		STX.Drawing.prototype.dragToDraw=false;

		/**
		 * Is called to tell a drawing to abort itself. It should clean up any rendered objects such as DOM elements or toggle states. It
		 * does not need to clean up anything that it drew on the canvas.
		 * @param  {boolean} forceClear Indicates that the user explicitly has deleted the drawing (advanced usage)
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.abort=function(forceClear){};

		/**
		 * Should call this.stx.setMeasure() with the measurements of the drawing if supported
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.measure=function(){};

		/**
		 * Initializes the drawing
		 * @param  {object} stx   The chart object
		 * @param  {object} panel The panel reference
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.construct=function(stx, panel){
			this.stx=stx;
			this.panelName=panel.name;
		};

		/**
		 * Called to render the drawing
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.render=function(context)					{alert("must implement render function!");};

		/**
		 * Called when a user clicks while drawing.
		 * @param  {object} context               The canvas context
		 * @param  {number} tick                  The tick in the dataSet
		 * @param  {number} value - The value (price) of the click
		 * @return {boolean}                       Return true if the drawing is complete. Otherwise the kernel will continue accepting clicks.
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.click=function(context, tick, value)		{alert("must implement click function!");};

		/**
		 * Called when the user moves while creating a drawing.
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.move=function(context, tick, value)		{alert("must implement move function!");};

		/**
		 * Called when the user attempts to reposition a drawing. The repositioner is the latest provided by {@link STX.Drawing.intersected}
		 * and can be used to determine which aspect of the drawing is being repositioned. For instance, this object may indicate
		 * which point on the drawing was selected by the user. It might also contain the original coordinates of the point or anything else
		 * that is useful to render the drawing.
		 * @param  {object} context      The canvas context
		 * @param  {object} repositioner The repositioner object
		 * @param  {number} tick         Current tick in the dataSet for the mouse cursor
		 * @param  {number} value        Current value in the datSet for the mouse cursor
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.reposition=function(context, repositioner, tick, value){};
		/**
		 * Called to determine whether the drawing is intersected by either the tick/value (pointer location) or box (small box surrounding the pointer).
		 * For line based drawings, box should be checked. For area drawings (rectangles, circles) the point should be checked
		 * @param  {number} tick               The tick in the dataSet representing the cursor point
		 * @param  {number} value              The value (price) representing the cursor point
		 * @param  {object} box)	x0,y0,x1,y1 representing an area around the cursor
		 * @return {object}                    An object that contains information about the intersection.
		 *                                     This object is passed back to {@link STX.Drawing.reposition} when repositioning the drawing.
		 *                                     Return false or null if not intersected. Simply returning true will highlight the drawing.
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.intersected=function(tick, value, box)	{alert("must implement intersected function!");};

		/**
		 * Reconstruct this drawing type from a serialization object
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.reconstruct=function(stx, obj)				{alert("must implement reconstruct function!");};

		/**
		 * Serialize a drawing into an object.
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.serialize=function()						{alert("must implement serialize function!");};

		/**
		 * Called whenever periodicity changes so that drawings can adjust their rendering.
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.adjust=function()							{alert("must implement adjust function!");};

		/**
		 * Returns the highlighted state. Set this.highlighted to the highlight state.
		 * For simple drawings the highlighted state is just true or false. For complex drawings
		 * with pivot points for instance, the highlighted state may have more than two states.
		 * Whenever the highlighted state changes a draw() event will be triggered.
		 * @param {Boolean} highlighted True to highlight the drawing, false to unhighlight
		 * @memberOf STX.Drawing.BaseTwoPoint
		 */
		STX.Drawing.prototype.highlight=function(highlighted){
			if(highlighted && !this.highlighted){
				this.highlighted=highlighted;
			}else if(!highlighted && this.highlighted){
				this.highlighted=highlighted;
			}
			return this.highlighted;
		};

		STX.Drawing.prototype.littleCircleRadius=function(){
			var radius=6;  //Math.max(12, this.layout.candleWidth)/2;
			return radius;
		};

		STX.Drawing.prototype.littleCircle=function(ctx, x, y, fill){
			var strokeColor=this.stx.defaultColor;
			var fillColor=STX.chooseForegroundColor(strokeColor);
			ctx.beginPath();
			ctx.lineWidth=1;
			ctx.arc(x, y, this.littleCircleRadius(), 0, 2*Math.PI, false);
			if(fill) ctx.fillStyle=strokeColor;
			else ctx.fillStyle=fillColor;
			ctx.strokeStyle=strokeColor;
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		};

		STX.Drawing.prototype.rotator=function(ctx, x, y, on){
			var circleSize=this.littleCircleRadius();
			var strokeColor=this.stx.defaultColor;
			ctx.beginPath();
			ctx.lineWidth=2;
			if(!on) ctx.globalAlpha=0.5;
			var radius=4+circleSize;
			ctx.arc(x, y, radius, 0, 3*Math.PI/2, false);
			ctx.moveTo(x+2+radius,y+2);
			ctx.lineTo(x+radius,y);
			ctx.lineTo(x-2+radius,y+2);
			ctx.moveTo(x-2,y+2-radius);
			ctx.lineTo(x,y-radius);
			ctx.lineTo(x-2,y-2-radius);
			ctx.strokeStyle=strokeColor;
			ctx.stroke();
			ctx.closePath();
			ctx.globalAlpha=1;
		};

		STX.Drawing.prototype.mover=function(ctx, x, y, on){
			var circleSize=this.littleCircleRadius();
			var strokeColor=this.stx.defaultColor;
			var length=5;
			var start=circleSize+1;
			ctx.save();
			ctx.lineWidth=2;
			ctx.strokeStyle=strokeColor;
			ctx.translate(x,y);
			if(!on) ctx.globalAlpha=0.5;
			for(var i=0;i<4;i++){
				ctx.rotate(Math.PI/2);
				ctx.beginPath();
				ctx.moveTo(0,start);
				ctx.lineTo(0,start+length);
				ctx.moveTo(-2,start+length-2);
				ctx.lineTo(0,start+length);
				ctx.lineTo(2,start+length-2);
				ctx.closePath();
				ctx.stroke();
			}
			ctx.globalAlpha=1;
			ctx.restore();
		};

		STX.Drawing.prototype.resizer=function(ctx, x, y, on){
			var circleSize=this.littleCircleRadius();
			var strokeColor=this.stx.defaultColor;
			var length=5*Math.sqrt(2);
			var start=circleSize+1;
			ctx.save();
			ctx.lineWidth=2;
			ctx.strokeStyle=strokeColor;
			ctx.translate(x,y);
			ctx.rotate(-Math.PI/4);
			if(!on) ctx.globalAlpha=0.5;
			for(var i=0;i<2;i++){
				ctx.rotate(Math.PI);
				ctx.beginPath();
				ctx.moveTo(0,start);
				ctx.lineTo(0,start+length);
				ctx.moveTo(-2,start+length-2);
				ctx.lineTo(0,start+length);
				ctx.lineTo(2,start+length-2);
				ctx.closePath();
				ctx.stroke();
			}
			ctx.globalAlpha=1;
			ctx.restore();
		};

		/**
		 * Returns true if the tick and value are inside the box
		 * @param  {number} tick  The tick
		 * @param  {number} value The value
		 * @param  {object} box   The box
		 * @return {boolean}       True if the tick and value are within the box
		 * @memberOf STX.Drawing
		 */
		STX.Drawing.prototype.pointIntersection=function(tick, value, box){
			var panel=this.stx.panels[this.panelName];
			if(!panel) return false;
			if(tick >= box.x0 && tick<=box.x1 && value>=box.y1 && value<=box.y0) return true;
			return false;
		};

		/**
		 * Sets the internal properties of the drawing points where x is a tick or a date and y is a value.
		 * @param  {number} point    index to point to be converted (0,1)
		 * @param  {number|string} x    index of bar in dataSet (tick) or date of tick (string form)
		 * @param  {number} y    price
		 * @param  {STX.Chart} [chart] Optional chart object
		 * @memberOf STX.Drawing.BaseTwoPoint
		 * @since 04-2015
		 */
		STX.Drawing.prototype.setPoint=function(point, x, y, chart){
			var tick=null;
			var date=null;
			if(typeof x == "number") tick=x;
			else if(x.length>=8) date=x;
			else tick=Number(x);

			if(y || y===0) this["v"+point]=y;
			var d;
			if(tick!==null) {
				d=this.stx.dateFromTick(tick, chart, true);
				this["tzo"+point]=d.getTimezoneOffset();
				this["d"+point]=STX.yyyymmddhhmmssmmm(d);
				this["p"+point]=[tick,y];
			}else if(date!==null){
				d=STX.strToDateTime(date);
				if(!this["tzo"+point] && this["tzo"+point]!==0) this["tzo"+point]=d.getTimezoneOffset();
				this["d"+point]=date;
				var adj=this["tzo"+point]-d.getTimezoneOffset();
				d.setMinutes(d.getMinutes()+adj);
				this["p"+point]=[this.stx.tickFromDate(STX.yyyymmddhhmmssmmm(d), chart), y];
			}
		};

		/**
		 * Base class for drawings that require two mouse clicks. Override as required.
		 * @constructor
		 * @name  STX.Drawing.BaseTwoPoint
		 */
		STX.Drawing.BaseTwoPoint=function(){
			this.p0=null;
			this.p1=null;
			this.color="";
		};

		STX.Drawing.BaseTwoPoint.stxInheritsFrom(STX.Drawing);

		/**
		 * Override this function to copy all of the config necessary to render your drawing
		 * @memberOf STX.Drawing.BaseTwoPoint
		 */
		STX.Drawing.BaseTwoPoint.prototype.copyConfig=function(){
			this.color=this.stx.currentVectorParameters.currentColor;
		};

		/**
		 * Intersection is based on a hypothetical box that follows a user's mouse or finger around
		 * An intersection occurs when either the box crosses over the drawing.The type should be "segment", "ray" or "line" depending on whether
		 * the drawing extends infinitely in any or both directions. radius determines the size of the box in pixels and is
		 * determined by the kernel depending on the user interface (mouse, touch, etc)
		 * @memberOf STX.Drawing.BaseTwoPoint
		 */


		STX.Drawing.BaseTwoPoint.prototype.lineIntersection=function(tick, value, box, type){
			if(!this.p0 || !this.p1) return false;
			if(this.stx.layout.semiLog || this.stx.layout.chartScale=="log"){
				return STX.boxIntersects(box.x0, STX.log10(box.y0), box.x1, STX.log10(box.y1), this.p0[0], STX.log10(this.p0[1]), this.p1[0], STX.log10(this.p1[1]), type);
			}else{
				return STX.boxIntersects(box.x0, box.y0, box.x1, box.y1, this.p0[0], this.p0[1], this.p1[0], this.p1[1], type);
			}
		};

		/**
		 * Determine whether the tick/value lie within the theoretical box outlined by this drawing's two points
		 * @memberOf STX.Drawing.BaseTwoPoint
		 */
		STX.Drawing.BaseTwoPoint.prototype.boxIntersection=function(tick, value){
			if(!this.p0 || !this.p1) return false;
			if(tick>Math.max(this.p0[0], this.p1[0]) || tick<Math.min(this.p0[0], this.p1[0])) return false;
			if(value>Math.max(this.p0[1], this.p1[1]) || value<Math.min(this.p0[1], this.p1[1])) return false;
			return true;
		};

		/**
		 * Any two-point drawing that results in a drawing that is less than 10 pixels
		 * can safely be assumed to be an accidental click. Such drawings are so small
		 * that they are difficult to highlight and delete, so we won't allow them.
		 *
		 * <b>Note:</b> it is very important to use pixelFromValueAdjusted() rather than pixelFromPrice(). This will
		 * ensure that saved drawings always render correctly when a chart is adjusted or transformed for display
		 * @memberOf STX.Drawing.BaseTwoPoint
		 */
		STX.Drawing.BaseTwoPoint.prototype.accidentalClick=function(tick, value){
			var panel=this.stx.panels[this.panelName];
			var x0=this.stx.pixelFromTick(this.p0[0], panel.chart);
			var x1=this.stx.pixelFromTick(tick, panel.chart);
			var y0=this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
			var y1=this.stx.pixelFromValueAdjusted(panel, tick, value);
			var h=Math.abs(x1-x0);
			var v=Math.abs(y1-y0);
			var length=Math.sqrt(h*h+v*v);
			if(length<10) {
				this.penDown=false;
				if(this.dragToDraw) this.stx.undo();
				return true;
			}
		};


		/**
		 * Value will be the actual underlying, unadjusted value for the drawing. Any adjustments or transformations
		 * are reversed out by the kernel. Internally, drawings should store their raw data (date and value) so that
		 * they can be rendered on charts with different layouts, axis, etc
		 * @memberOf STX.Drawing.BaseTwoPoint
		 */
		STX.Drawing.BaseTwoPoint.prototype.click=function(context, tick, value){
			this.copyConfig();
			var panel=this.stx.panels[this.panelName];
			if(!this.penDown){
				this.setPoint(0, tick, value, panel.chart);
				this.penDown=true;
				return false;
			}
			if(this.accidentalClick(tick, value)) return this.dragToDraw;

			this.setPoint(1, tick, value, panel.chart);
			this.penDown=false;
			return true;	// kernel will call render after this
		};

		/**
		 * Default adjust function for BaseTwoPoint drawings
		 * @memberOf STX.Drawing.BaseTwoPoint
		 */
		STX.Drawing.BaseTwoPoint.prototype.adjust=function(){
			// If the drawing's panel doesn't exist then we'll check to see
			// whether the panel has been added. If not then there's no way to adjust
			var panel=this.stx.panels[this.panelName];
			if(!panel) return;
			this.setPoint(0, this.d0, this.v0, panel.chart);
			this.setPoint(1, this.d1, this.v1, panel.chart);
		};

		/**
		 * Default move function for BaseTwoPoint drawings
		 * @memberOf STX.Drawing.BaseTwoPoint
		 */
		STX.Drawing.BaseTwoPoint.prototype.move=function(context, tick, value){
			if(!this.penDown) return;

			this.copyConfig();
			this.p1=[tick,value];
			this.render(context);
		};

		/**
		 * Default measure function for BaseTwoPoint drawings
		 * @memberOf STX.Drawing.BaseTwoPoint
		 */
		STX.Drawing.BaseTwoPoint.prototype.measure=function(){
			this.stx.setMeasure(this.p0[1], this.p1[1], this.p0[0], this.p1[0], true);
		};

		STX.Drawing.BaseTwoPoint.prototype.reposition=function(context, repositioner, tick, value){
			if(!repositioner) return;
			var panel=this.stx.panels[this.panelName];
			var tickDiff=repositioner.tick-tick;
			var valueDiff=repositioner.value-value;
			if(repositioner.action=="move"){
				this.setPoint(0, repositioner.p0[0]-tickDiff, repositioner.p0[1]-valueDiff, panel.chart);
				this.setPoint(1, repositioner.p1[0]-tickDiff, repositioner.p1[1]-valueDiff, panel.chart);
				this.render(context);
			}else if(repositioner.action=="drag"){
				this[repositioner.point]=[tick, value];
				this.setPoint(0, this.p0[0], this.p0[1], panel.chart);
				this.setPoint(1, this.p1[0], this.p1[1], panel.chart);
				this.render(context);
			}
		};


		var STXTouchAction="onmouseup";
		if(STX.touchDevice && (STX.ipad || STX.iphone)) STXTouchAction="ontouchend";

		/**
		 * DropDownManager
		 *
		 * A simple widget for managing drop downs.
		 */
		STX.DropDownManager=function(){};
		STX.DropDownManager.dropDowns=[];
		STX.DropDownManager.callback=null;
		STX.DropDownManager.listeners={};
		STX.DropDownManager.newDropDown=function(dropDown){
			function toggle(dropDown){
				return function(e){
					if($$$("ul", dropDown).style.display=="block"){
						$$$("ul", dropDown).style.display="none";
						return;
					}
					$$$("ul", dropDown).style.display="block";
					STX.DropDownManager.callback=function(dropDown){
						return function(e){
							var inside=false;
							if((e.which && e.which>=2) || (e.button && e.button>=2)) return; // right click
							var menu=$$$("ul", dropDown);
							if(!STX.withinElement(dropDown, e.pageX, e.pageY) && !STX.withinElement(menu, e.pageX, e.pageY)){
								menu.style.display="none";
								e.stopPropagation(); // Prevent the event from being received by any DOM element except those in the menu
								e.preventDefault();	// Prevent the browser from doing things like checking checkboxes, selectboxes, etc
								inside=true;
							}
							for(var event in STX.DropDownManager.listeners){
								document.removeEventListener(event, STX.DropDownManager.listeners[event], true);
							}
							if(inside) return false;
						};
					}(dropDown);
					// Set a temporary listener on the entire document. This will prevent anything on the page from responding
					// to normal touch/click events. Note that we use logic here to attach the same (similar) type of event
					// as was received on the menu to begin with. Given that touch devices receive multiple event types this may
					// need some refinement
					setTimeout(function(){
						if(e.type=="click"){
							document.addEventListener("click", STX.DropDownManager.callback, true);
							STX.DropDownManager.listeners.click=STX.DropDownManager.callback;
						}
						if(e.type=="pointerup"){
							document.addEventListener("pointerdown", STX.DropDownManager.callback, true);
							STX.DropDownManager.listeners.pointerdown=STX.DropDownManager.callback;
						}
						if(e.type=="touchend"){
							document.addEventListener("touchstart", STX.DropDownManager.callback, true);
							STX.DropDownManager.listeners.touchstart=STX.DropDownManager.callback;
						}
					},0);
				};
			}
			$$$("ul", dropDown).style.display="none";
			STX.safeClickTouch(dropDown, toggle(dropDown));
		};
		STX.DropDownManager.initialize=function(){
			var dropDowns=document.querySelectorAll(".stx-dropdown");
			for(var i=0;i<dropDowns.length;i++){
				var dropDown=dropDowns[i];
				STX.DropDownManager.newDropDown(dropDown);
			}
		};

		/**
		 * Convenience function to destruct a chart window and related GUI ({@link STX.ThemeManager}, {@link STX.MenuManager}), eliminating all references and dependencies, and optionally its containing DOM element.
		 * <BR> Please note that this call will destroy the menu manager and theme manager even if multiple charts are registered to them, in which case you must manually call the destroy() method for the remaining charts.
		 * @param {STXChart} stx The chart object to destroy
		 * @param {string} excludedSelector If passed then any top level object within chartContainer which matches this selector will not be deleted (and neither will the wrapper)
		 * @since 07/01/2015
		 * @memberOf STX
		 */
		STX.destroy=function(stx, excludedSelector){
		    for(var rc=0;rc<STXChart.registeredContainers.length;rc++){
		    	if(STXChart.registeredContainers[rc]==stx.chart.container){
		    		STXChart.registeredContainers.splice(rc,1);
		    		break;
		    	}
		    }
		    
		    // to do:
		    // remove all stx stored in STX.MenuManager.registeredCharts insted and and remove the stx argument so the signature is STX.destroy=function(excludedSelector)
		    stx.styles={};
		    stx.destroy();
		    stx=null;
		    STX.ThemeManager.destroy();
		    STX.MenuManager.destroy();
		    if(excludedSelector){
		    	var childNodes=$$$(".stx-wrapper").childNodes;
		    	var matches=$$$(".stx-wrapper").querySelectorAll(excludedSelector);
		    	for(var m=0;m<matches.length;m++) {
		    		if(matches[m].parentNode==$$$(".stx-wrapper")) STX.appendClassName(matches[m],"stx-passover");
		    	}
		    	for(var c=childNodes.length-1;c>=0;c--){
		    		if(STX.hasClassName(childNodes[c],"stx-passover")) STX.unappendClassName(childNodes[c],"stx-passover");
		    		else childNodes[c].parentNode.removeChild(childNodes[c]);
		    	}
		    }else{
			    $$$(".stx-wrapper").parentNode.removeChild($$$(".stx-wrapper"));
		    }
		};

		/**
		 * MenuManager
		 *
		 * This widget manages menus. First, it ensures that charts do not react to users clicking or tapping on menus that overlap
		 * the charting area. Then it also allows users to close menus by tapping outside of the menu area. This is accomplished
		 * through the use of invisible, temporary overlay divs. Menu manager is a singleton. It automatically exists and only one is required per page.
		 * Simply register your charts with the manager in order for it to automatically engage.
		 * @namespace
		 * @name  STX.MenuManager
		 */
		STX.MenuManager=function(){};
		STX.MenuManager.registeredCharts=[];
		STX.MenuManager.openMenu=null;
		STX.MenuManager.useOverlay=true;
		STX.MenuManager.menusDisabled=false;	// Set to true when menus are disabled based on state. Menus with "alwaysOn" will still function.
		STX.MenuManager.menusDisabledDialog=false;	// Set to true for instance when opening a dialog. No menus will function, even "alwaysOn".
		STX.MenuManager.onClass=null;
		STX.MenuManager.offClass=null;
		STX.MenuManager.menus=[];
		//STX.MenuManager.closeCurrent=null;	// function callback to close current menu
		STX.MenuManager.stack=[];

		/**
		 * Clears out the MenuManager, eliminating all stxx references.
		 * To destroy the complete chart and related UI use {@link STX.destroy}
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.destroy=function(){
			this.registeredCharts=[];
			if(STX.MenuManager.bodyOverlay){
				STX.MenuManager.bodyOverlay.parentNode.removeChild(STX.MenuManager.bodyOverlay);
			}
		};

		/**
		 * Registers a chart with the menuManager. This should be called for each chart on the screen.
		 * @param  {object} stx The chart object
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.registerChart=function(stx){
			STX.MenuManager.registeredCharts.push(stx);
			if(!STX.MenuManager.bodyOverlay){
				STX.MenuManager.bodyOverlay=STX.newChild(document.body, "DIV", "stxBodyOverlay");
			}
		};

		/**
		 * Override whether or not to use overlays. If overlays are not enabled then menus will still co-react
		 * but no overlay will be generated to allow tapping outside of the menus
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.useOverlays=function(useOverlay){
			STX.MenuManager.useOverlay=useOverlay;
		};

		/**
		 * Cancels a single click event that might otherwise have been picked up by a chart object when the user taps on the overlay to close the menu
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.cancelSingleClick=function(){
			for(var i=0;i<STX.MenuManager.registeredCharts.length;i++){
				STX.MenuManager.registeredCharts[i].cancelTouchSingleClick=true;
			}
		};

		/**
		 * Turns on a menu and disables touch and mouse events. Typically managed automatically but can be called programatically.
		 * @param {string} name Name of menu. This should be unique so that clicking one menu will close an already open menu
		 * @param {function} callback This function will be called when the user taps outside of the menu, and passed the name
		 * @param {boolean} cascading Set to true if the menu is a cascade (2nd level) menu
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.menuOn=function(name, callback, cascading){
			function tapMe(callback, name){
				return function(e){
					STX.MenuManager.menuOff();
					//callback(name);
				};
			}
			if(!STX.MenuManager.registeredCharts.length) return;
			if(STX.MenuManager.openMenu){
				if(name==STX.MenuManager.openMenu) return;	// menu already open and manager active
				if(!cascading) STX.MenuManager.menuOff(true);
				//STX.MenuManager.closeCurrentMenu();
			}
			STX.MenuManager.openMenu=name;
			if(!cascading && STX.MenuManager.useOverlay){
				STX.MenuManager.bodyOverlay.style.display="block";
				STX.MenuManager.bodyOverlay[STXTouchAction]=tapMe(name);
				//STX.MenuManager.closeCurrent=callback;
			}
			STX.MenuManager.stack.push({closeCurrentMenu:callback, cascading:cascading});
			//STX.MenuManager.closeCurrentMenu=callback;
			for(var i=0;i<STX.MenuManager.registeredCharts.length;i++){
				STX.MenuManager.registeredCharts[i].openDialog=name;
			}
		};

		/**
		 * Hides any menus that are currently showing and re-enables touch and mouse events.
		 * @param {boolean} [closeAll] If true then all menus will be closed, otherwise just the top cascading menu will be closed
		 * @param {boolean} [dontBlur] Dont blur the currently active element, for instance when you have purposefully focused an element
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.menuOff=function(closeAll, dontBlur){
			if(!STX.MenuManager.stack.length) return;
			if(!STX.MenuManager.registeredCharts.length) return;
			if(!dontBlur && document.activeElement && document.activeElement.tagName!="BODY" && document.activeElement.blur) document.activeElement.blur();	// Hide keyboard on touch devices
			/*if(STX.MenuManager.closeCurrent){
				var fc=STX.MenuManager.closeCurrent;
				STX.MenuManager.closeCurrent=null; // prevent infinite loop
				fc(STX.MenuManager.openMenu);
			}*/
			//STX.MenuManager.closeCurrent=null;
			while(STX.MenuManager.stack.length){
				var obj=STX.MenuManager.stack.pop();
				obj.closeCurrentMenu();
				if(!closeAll) break;
			}
			if(!STX.MenuManager.stack.length){
				STX.MenuManager.openMenu=null;
				if(STX.MenuManager.useOverlay){
					STX.MenuManager.bodyOverlay.style.display="none";
					STX.MenuManager.bodyOverlay[STXTouchAction]=null;
				}
			}
			this.cancelSingleClick();
			if(!STX.DialogManager.stack.length){
				for(var i=0;i<STX.MenuManager.registeredCharts.length;i++){
					STX.MenuManager.registeredCharts[i].openDialog="";
				}
			}
		};

		/**
		 * Initializes the menuing system. Menus should be of specified format, using class stxMenu to indicate an object that can be clicked
		 * to create a menu. class menuOutline should be assigned to a sub-element of the menu that is displayed or hidden. stxToggle should
		 * be assigned to any active element of the menu.
		 * The code in stxToggle will be run through either eval() or parsing of a JSON string with objects fn for the function name and args as the arguments array.
		 *  For example, stxToggle='{"fn":"STXUI.changePeriodicity","args":["day"]}' which is the same as
		 *  stxToggle='STXUI.changePeriodicity(day)' except the former avoids eval and automatically makes the element clicked available as
		 *  'this' in the function.
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.makeMenus=function(){
			function toggle(div, menu){
				return function(e){
					function turnMeOff(div){
						return function(){
							div.style.display="none";
							if(div.colorPickerDiv) div.colorPickerDiv.style.display="none";
						};
					}
					var dom=STX.getEventDOM(e);
					do{
						if(dom.className && dom.className.indexOf("menuOutline")!=-1) return;	// clicked inside the menuDisplay and not the menu button
						if(dom.className && dom.className.indexOf("stxMenu")!=-1) break; // clicked the actual button
						dom=dom.parentNode;
					}while(dom);
					if(div.style.display=="none"){
						var menuName=STX.uniqueID();
						if((STX.MenuManager.menusDisabled && !menu.alwaysOn) || STX.MenuManager.menusDisabledDialog) return;
						STX.MenuManager.menuOn(menuName, turnMeOff(div));
						div.style.display="block";
						if(div.className.indexOf("menuScroll")!=-1){
							if(!this.iscroll){
								this.iscroll = STX.iscroll.newScroller(div, {vScrollbar: true, hScroll:false, hideScrollbar: false});
							}else{
								this.iscroll.refresh();
							}
						}
					}else{
						STX.MenuManager.menuOff();
						div.style.display="none";
					}
				};
			}
			function activate(menuOutline){
				STX.MenuManager.menuOff();
				menuOutline.style.display="none";
				var action=this.getAttribute("stxToggle");
				try{
					var f=JSON.parse(action);
					var props=f.fn.split(".");
					f.fn=window;
					for(var p=0;p<props.length;p++) f.fn=f.fn[props[p]];
					f.fn.apply(this,f.args);
				}catch(e){
					/*jslint evil: true */ /*jshint -W061 */ /*eslint no-eval: 0 */
					eval(action);
					/*jslint evil: false */ /*jshint +W061 */ /*eslint no-eval: 1 */
				}
			}
			STX.MenuManager.menus=document.querySelectorAll(".stxMenu");
			function menuSafeClick(m,c){
				return function(e){activate.call(c,m);e.stopPropagation();};
			}
			for(var i=0;i<STX.MenuManager.menus.length;i++){
				var menu=STX.MenuManager.menus[i];
				var menuOutline=menu.querySelectorAll(".menuOutline")[0];
				menu.alwaysOn=(menu.className.indexOf("stxAlwaysOn")!=-1);
				menu[STXTouchAction]=toggle(menuOutline, menu);

				var clickables=menuOutline.querySelectorAll("*[stxToggle]");
				for(var j=0;j<clickables.length;j++){
					STX.safeClickTouch(clickables[j],(menuSafeClick(menuOutline,clickables[j])));
				}
			}
		};

		/**
		 * Disable the menuing system (for instance when a dialog is open)
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.disableMenus=function(){
			STX.MenuManager.menusDisabled=true;
			for(var i=0;i<STX.MenuManager.menus.length;i++){
				var menu=STX.MenuManager.menus[i];
				if(STX.MenuManager.onClass) STX.unappendClassName(menu, STX.MenuManager.onClass);
				if(STX.MenuManager.offClass) STX.appendClassName(menu, STX.MenuManager.offClass);
			}
		};

		/**
		 * Enable the menuing system (for instance after disabling it)
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.enableMenus=function(){
			STX.MenuManager.menusDisabled=false;
			for(var i=0;i<STX.MenuManager.menus.length;i++){
				var menu=STX.MenuManager.menus[i];
				if(STX.MenuManager.offClass) STX.unappendClassName(menu, STX.MenuManager.offClass);
				if(STX.MenuManager.onClass) STX.appendClassName(menu, STX.MenuManager.onClass);
			}};

		/**
		 * Close the menu that an element lives in. For instance, when hitting enter in an input box contained
		 * within a menu simply send the input box itself in and the library will find and close the menu for you.
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.closeThisMenu=function(el){
			while(el && typeof(el.className)!="undefined" && el.className.indexOf("menuOutline")==-1){
				el=el.parentNode;
			}
			if(el && el.style){
				el.style.display="none";
			}
			STX.MenuManager.menuOff();
		};

		/**
		 * Attach a color picker to a div (swatch).
		 *
		 * @param {object} colorClick - Should be the swatch DOM element
		 *
		 * @param {object} cpHolder - Should be a DOM element that contains the color picker. If the color picker is within a dialog
		 * or menu then cpHolder should be that dialog or menu in order to assure that the color picker is closed
		 * when the menu or dialog is closed
		 *
		 * @param {function} cb - The callback when the color is selected fc(color)
		 *
		 * @param {boolean} noMenuBehavior - When set to true bypasses the menuing system, otherwise the color picker is treated as a menu
		 * element and will close whenever another menu is opened. Always use noMenuBehavior when the color picker
		 * is contained within a parent menu otherwise the color picker could get orphaned on the screen.
		 * @memberOf STX.MenuManager
		 */
		STX.MenuManager.attachColorPicker = function(colorClick, cpHolder, cb, noMenuBehavior){
			var closure=function(colorClick, cpHolder, cb){
				return function(color){
					if(cpHolder.colorPickerDiv) cpHolder.colorPickerDiv.style.display="none";
					colorClick.style.backgroundColor="#"+color;
					if(cb) cb(color);
					if(!noMenuBehavior) STX.MenuManager.menuOff();
				};
			};
			function closeMe(cpHolder){
				return function(){
					if(cpHolder.colorPickerDiv) cpHolder.colorPickerDiv.style.display="none";
				};
			}

			colorClick[STXTouchAction]=(function(fc, cpHolder){ return function(){
				if(!noMenuBehavior) STX.MenuManager.menuOn("colorPicker", closeMe(cpHolder));
				if(!cpHolder.colorPickerDiv){
					cpHolder.colorPickerDiv=document.createElement("DIV");
					cpHolder.colorPickerDiv.className="ciqColorPicker";
					document.body.appendChild(cpHolder.colorPickerDiv);
				}
				STX.createColorPicker(cpHolder.colorPickerDiv, fc);
				cpHolder.colorPickerDiv.style.display="block";
				var xy=STX.getPos(this);
				var x=xy.x+this.clientWidth;
				if((x+cpHolder.colorPickerDiv.offsetWidth)>STX.pageWidth())
					x-=(x+cpHolder.colorPickerDiv.offsetWidth)-STX.pageWidth()+20;
				cpHolder.colorPickerDiv.style.left=x+"px";

				var y=(xy.y);
				if(y+cpHolder.colorPickerDiv.clientHeight>STX.pageHeight())
					y-=(y+cpHolder.colorPickerDiv.clientHeight)-STX.pageHeight();
				cpHolder.colorPickerDiv.style.top=y+"px";
			};})(closure(colorClick, cpHolder, cb), cpHolder);
		};

		/**
		 * A widget for managing modal dialogs. It maintains an internal stack so that multiple dialogs may be open simultaneously.
		 * Optionally set useOverlay to true in order to create an overlay for dimming the screen
		 * @namespace
		 * @name STX.DialogManager
		 */
		STX.DialogManager=function(){};

		/**
		 * Whether to use overlay for closing dialogs
		 * @type {Boolean}
		 * @memberOf  STX.DialogManager
		 */
		STX.DialogManager.useOverlay=false;
		STX.DialogManager.stack=[];

		/**
		 * Makes charts unresponsive during modal
		 * @memberOf  STX.DialogManager
		 */
		STX.DialogManager.modalBegin=function(){
			STX.MenuManager.menusDisabledDialog=true;
			for(var i=0;i<STXChart.registeredContainers.length;i++){
				var stx=STXChart.registeredContainers[i].stx;
				stx.modalBegin();
			}
		};

		/**
		 * Releases modal
		 * @memberOf  STX.DialogManager
		 */
		STX.DialogManager.modalEnd=function(){
			STX.MenuManager.menusDisabledDialog=false;
			for(var i=0;i<STXChart.registeredContainers.length;i++){
				var stx=STXChart.registeredContainers[i].stx;
				stx.modalEnd();
			}
		};

		/**
		 * Displays the dialog. Optionally displays the overlay if STX.DialogManager.useOverlay is set
		 * @param  {string} id ID of the dialog
		 * @memberOf  STX.DialogManager
		 */
		STX.DialogManager.displayDialog=function(id){
			STX.hideKeyboard();
			STX.DialogManager.modalBegin();
			if(STX.DialogManager.useOverlay && !STX.DialogManager.bodyOverlay){
				STX.DialogManager.bodyOverlay=STX.newChild(document.body, "DIV", "stxDialogOverlay");
			}
			if(STX.DialogManager.useOverlay){
				STX.DialogManager.bodyOverlay.style.display="block";
			}
			var node=id;
			if(typeof id=="string") node=$$(id);
			node.style.display="block";
			STX.DialogManager.stack.push(node);
		};

		/**
		 * Dismisses any active dialogs
		 * @memberOf  STX.DialogManager
		 */
		STX.DialogManager.dismissDialog=function(){
			document.activeElement.blur();	// Hide keyboard on touch devices
			var node=STX.DialogManager.stack.pop();
			if(!node) return;
			node.style.display="none";
			if(node.colorPickerDiv) node.colorPickerDiv.style.display="none";

			if(!STX.DialogManager.stack.length){
				if(STX.DialogManager.bodyOverlay && STX.DialogManager.bodyOverlay.style.display=="block"){
					STX.DialogManager.bodyOverlay.style.display="none";
				}
				STX.DialogManager.modalEnd();
			}
			STX.fixScreen();
		};


		/**
		 * A widget for managing chart colors and themes. The dialog functionality assumes that color picker
		 * divs have been set up with a class that matches one of the stx chart configuration classes (such as stx_candle_up)
		 *
		 * The classMapping determines which classes are mapped to each color picker. If null then apply to the container itself.
		 *
		 * See the following tutorial if you wish to programatically create **custom color themes**: {@tutorial Custom Color Themes}
		 *
		 * @namespace
		 * @name  STX.ThemeManager
		 */
		STX.ThemeManager=function(){};

		/**
		 * Basic initialization of ThemeManager values.
		 * Use this to set stx and cb as opposed to STX.ThemeManager.themesToMenu, in the event you do not wish to use the automatic themes menu generation.
		 * @memberOf STX.ThemeManager
		 * @param {object} stx - a chart
		 * @param {function} cb - A callback method for storing the themes (i.e. to localStorage)
		 */
		STX.ThemeManager.initialize=function(stx, cb){
			STX.ThemeManager.stx=stx;
			STX.ThemeManager.storageCB=cb;
		};

		/**
		 * List of built in themes. Override this with your built in themes.
		 * @memberOf STX.ThemeManager
		 * @type {Object}
		 */
		STX.ThemeManager.builtInThemes={};
		STX.ThemeManager.themes={
				enabledTheme:null,
				customThemes:{}
		};

		/**
		 * Clears out the ThemeManager, eliminating all references to stx objects.
		 * To destroy the complete chart and related UI use {@link STX.destroy}
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.destroy=function(){
			this.builtInThemes={};
			this.themes.customThemes={};
			this.themes.enabledTheme=null;
		};

		/**
		 * Determines which underlying classes are overridden by each of the dialog swatches a user can change.
		 * @type {Object}
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.classMapping={
			stx_candle_up: {stx_candle_up:true, stx_bar_up:true, stx_hollow_candle_up:true, stx_line_up:true, stx_baseline_up:true},
			stx_candle_down: {stx_candle_down:true, stx_bar_down:true, stx_hollow_candle_down:true ,stx_line_down:true, stx_baseline_down:true},
			stx_candle_shadow: {stx_candle_shadow:true, stx_bar_even:true, stx_bar_chart:true, stx_line_chart:true, stx_hollow_candle_even:true},			stx_candle_shadow_up: {stx_candle_shadow_up:true},
			stx_candle_shadow_down: {stx_candle_shadow_down:true},
			stx_grid: {stx_grid:true},
			stx_grid_dark: {stx_grid_dark:true},
			stx_xaxis_dark: {stx_xaxis_dark:true, stx_xaxis:true, stx_yaxis:true, stx_yaxis_dark:true},
			stx_mountain: {stx_mountain_chart:true},
			stx_market_session: {stx_market_session:true},
			backgroundColor: null
		};

		/**
		 * Populate a dialog with the existing colors from a chart.
		 * @param {string} id Name of the theme dialog
		 * @param {object} stx The chart object
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.populateDialog=function(id, stx){
			var mountainGradientCheckbox=$$$("#mountainGradientOn",$$(id));  //backwards compatibility

			function toggleBorders(noDraw){
				if($$$("#candleBordersOn",$$(id)).checked){
					stx.styles.stx_candle_up["border-left-color"]=$$(id).querySelectorAll(".stx-border-color.stx_candle_up")[0].style.backgroundColor;
					stx.styles.stx_candle_down["border-left-color"]=$$(id).querySelectorAll(".stx-border-color.stx_candle_down")[0].style.backgroundColor;
				}else{
					stx.styles.stx_candle_up["border-left-color"]="transparent";
					stx.styles.stx_candle_down["border-left-color"]="transparent";
				}
				if(!noDraw && stx.displayInitialized) stx.draw();
			}
			function toggleMountainGradient(){
				if(mountainGradientCheckbox && mountainGradientCheckbox.checked){
					stx.styles.stx_mountain_chart.color=STX.hexToRgba($$(id).querySelectorAll(".stx-border-color.stx_mountain")[0].style.backgroundColor,1);
					stx.styles.stx_mountain_chart.backgroundColor=STX.hexToRgba($$(id).querySelectorAll(".stx-border-color.stx_mountain")[0].style.backgroundColor,50);
				}else{
					stx.styles.stx_mountain_chart.color=$$(id).querySelectorAll(".stx-border-color.stx_mountain")[0].style.backgroundColor;
					stx.styles.stx_mountain_chart.backgroundColor=$$(id).querySelectorAll(".stx-border-color.stx_mountain")[0].style.backgroundColor;
				}
				if(stx.displayInitialized) stx.draw();
			}
			function chooseColor(property, className){
				return function(color){
					var mapping=STX.ThemeManager.classMapping[className];
					if(mapping){
						for(var mapped in mapping){
							stx.canvasStyle(mapped);
							stx.styles[mapped][property]="#"+color;
							if(className=="stx_mountain"){	// Hacked in here. Ideally we would expand class mapping to accept specific css fields
								if(mountainGradientCheckbox && mountainGradientCheckbox.checked){
									stx.styles[mapped].color=STX.hexToRgba("#"+color,1);
									stx.styles[mapped].backgroundColor=STX.hexToRgba("#"+color,50);
								}else{
									stx.styles[mapped].color="#"+color;
									stx.styles[mapped].backgroundColor="#"+color;
								}
								stx.styles[mapped].borderTopColor="#"+color;
							}
						}
					}else{
						stx.chart.container.style[className]="#" + color;
					}
					if(stx.displayInitialized) stx.draw();
					if(property=="border-left-color" && color && color!="transparent"){
						$$$("#candleBordersOn", $$(id)).checked=true;
					}
				};
			}
			$$$("#candleBordersOn",$$(id)).checked=false;
			$$$("#candleBordersOn",$$(id)).onclick=toggleBorders;

			if(mountainGradientCheckbox){
				mountainGradientCheckbox.checked=false;
				mountainGradientCheckbox.onclick=toggleMountainGradient;
			}

			var computed="#FFFFFF";
			if(stx.chart.container){
				computed=getComputedStyle(stx.chart.container);
			}
			for(var className in STX.ThemeManager.classMapping){
				var mapping=STX.ThemeManager.classMapping[className];
				var color=null;
				var borderColor=null;

				if(mapping){
					var firstClass=STX.first(mapping);
					var style=stx.canvasStyle(firstClass);
					color=style.color;
					borderColor=style["border-left-color"];
					if(!borderColor || borderColor=="transparent") borderColor=style.borderLeftColor;
				}else{
					color=computed[className];
					if(STX.isTransparent(color) && className=="backgroundColor") color=stx.containerColor;
				}

				var picker=$$(id).querySelectorAll(".stx-color." + className)[0];
				if(picker){
					picker.style.backgroundColor=color;
					if(!picker[STXTouchAction]){
						STX.MenuManager.attachColorPicker(picker, STX.DialogManager, chooseColor("color", className));
					}
				}

				picker=$$(id).querySelectorAll(".stx-border-color." + className)[0];
				if(picker){
					picker.style.backgroundColor=borderColor;
					if(!picker[STXTouchAction]){
						STX.MenuManager.attachColorPicker(picker, STX.DialogManager, chooseColor("border-left-color", className));
					}
					if(borderColor && borderColor!="transparent") $$$("#candleBordersOn", $$(id)).checked=true;
					if(mountainGradientCheckbox && color && color.indexOf("rgba("===0)) mountainGradientCheckbox.checked=true;
				}
			}
			toggleBorders(true);
		};

		/**
		 * Convert colors from an existing chart into a theme object
		 * @param {object} stx The chart object
		 * @return {Object} The theme object 
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.createTheme=function(stx){
			var theme={};
			if(STX.ThemeManager.baseTheme) theme.baseTheme=STX.ThemeManager.baseTheme;
			for(var className in STX.ThemeManager.classMapping){
				var mapping=STX.ThemeManager.classMapping[className];
				if(mapping){
					var firstClass=STX.first(mapping);
					var style=stx.canvasStyle(firstClass);
					theme[className]={color:style.color};
					if(style.borderTopColor) theme[className].borderTopColor=style.borderTopColor;
					if(style.backgroundColor) theme[className].backgroundColor=style.backgroundColor;
					if(style["border-left-color"] && style["border-left-color"]!="transparent"){
						theme[className]["border-left-color"]=style["border-left-color"];
					}else{
						theme[className]["border-left-color"]="transparent";
					}
				}else{
					if(stx.chart.container)
						theme[className]=stx.chart.container.style[className];
				}
			}
			return theme;
		};

		/**
		 * Save a theme by name. Optional callback function when finished of fc(str) where str is a stringified version of the themes
		 * that can be used for saving to a server or to local storage
		 * @param {string} name The name of the theme
		 * @param {object} stx The chart object
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.saveTheme=function(name, stx){
			var theme=STX.ThemeManager.createTheme(stx);
			STX.ThemeManager.themes.customThemes[name]=theme;
			STX.ThemeManager.themes.enabledTheme=name;
			if(STX.ThemeManager.storageCB) STX.ThemeManager.storageCB(JSON.stringify(STX.ThemeManager.themes), stx);
			STX.ThemeManager.themesToMenu(STX.ThemeManager.el, STX.ThemeManager.el2, STX.ThemeManager.stx, STX.ThemeManager.storageCB);
		};

		/**
		 * Delete a custom theme by name.
		 * @param {object} stx The chart object
		 * @param {string} theme The name of the theme
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.deleteTheme=function(stx, theme){
			if(STX.ThemeManager.themes.customThemes[theme]){
				if(theme==STX.ThemeManager.themes.enabledTheme) STX.ThemeManager.enableBuiltInTheme(stx, STX.ThemeManager.baseTheme);
				delete STX.ThemeManager.themes.customThemes[theme];
				if(STX.ThemeManager.storageCB) STX.ThemeManager.storageCB(JSON.stringify(STX.ThemeManager.themes), stx);
			}
		};

		/**
		 * Sets themes from a serialized object
		 * @param {object} obj Serialized themes
		 * @param {object} stx The chart object
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.setThemes=function(obj, stx){
			if(obj){
				if(obj.customThemes) STX.ThemeManager.themes.customThemes=obj.customThemes;
				STX.ThemeManager.themes.enabledTheme=obj.enabledTheme;
				if(STX.ThemeManager.themes.enabledTheme){
					STX.ThemeManager.enableTheme(stx, STX.ThemeManager.themes.enabledTheme);
				}
			}
		};

		/**
		 * Enables a specific theme. Custom themes are objects that contain color choices on top of a base theme (CSS File).
		 * @param  {object} stx   The chart object
		 * @param  {string} theme The theme name
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.enableTheme=function(stx, theme){
			function addCustomizations(){
				var obj=STX.ThemeManager.themes.customThemes[theme];
				for(var className in obj){
					if(className=="baseTheme") continue;
					var mapping=STX.ThemeManager.classMapping[className];
					if(mapping){
						for(var mapped in mapping){
							stx.canvasStyle(mapped);
							stx.styles[mapped].color=obj[className].color;
							if(obj[className]["border-left-color"]){
								stx.styles[mapped]["border-left-color"]=obj[className]["border-left-color"];
							}
							if(className=="stx_mountain"){ // Hacked in. See other note.
								stx.styles[mapped].backgroundColor=obj[className].backgroundColor;
								stx.styles[mapped].borderTopColor=obj[className].borderTopColor;
								if(!stx.styles[mapped].backgroundColor) stx.styles[mapped].backgroundColor=obj[className].color;
								if(!stx.styles[mapped].borderTopColor) stx.styles[mapped].borderTopColor=obj[className].color;
							}
						}
					}else{
						if(stx.chart.container) stx.chart.container.style[className]=obj[className];
					}
				}
				if(stx.chart.container){
					stx.clearPixelCache();	// force new yAxis to be drawn
					stx.draw();
				}
			}
			var obj=STX.ThemeManager.themes.customThemes[theme];
			if(obj){
				var baseTheme=obj.baseTheme;
				STX.ThemeManager.loadBuiltInTheme(stx, baseTheme, addCustomizations);
				STX.ThemeManager.themes.enabledTheme=theme;
				if(STX.ThemeManager.storageCB) STX.ThemeManager.storageCB(JSON.stringify(STX.ThemeManager.themes), stx);
			}else{
				STX.ThemeManager.loadBuiltInTheme(stx, theme);
			}
		};

		/**
		 * Enables a built in theme. Built in themes are CSS files.
		 * @param  {object} stx   The chart object
		 * @param  {string} theme The theme name
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.enableBuiltInTheme=function(stx, theme){
			STX.ThemeManager.loadBuiltInTheme(stx, theme);
			STX.ThemeManager.themes.enabledTheme=theme;
			if(STX.ThemeManager.storageCB) STX.ThemeManager.storageCB(JSON.stringify(STX.ThemeManager.themes), stx);
		};

		/**
		 * Loads a built in theme by dynamically linking the CSS that defines that theme.
		 * @param {object} stx The chart object
		 * @param {string} theme The theme to load. Pass null to remove the current built in theme.
		 * @param {function} cb Callback function when theme is successfully loaded
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.loadBuiltInTheme=function(stx, theme, cb){
			if(!theme){
				if(cb) cb();
				return;
			}

			var themeName=STX.ThemeManager.builtInThemes[STX.ThemeManager.baseTheme];
			if(typeof themeName!="string") themeName=STX.ThemeManager.baseTheme;
			STX.unappendClassName($$$("body"), themeName);

			themeName=STX.ThemeManager.builtInThemes[theme];
			if(typeof themeName!="string") themeName=theme;
			STX.appendClassName($$$("body"), themeName);
			stx.styles={};
			stx.chart.container.style.backgroundColor="";
			stx.updateListeners("theme");  // tells listening objects that theme has changed
			if(stx.displayInitialized){
				//stx.initializeChart(); -- don't need to initialize the chart just because the colors changed. Initializing also removes the drawings
				stx.headsUpHR();
				stx.clearPixelCache();	// force new yAxis to be drawn
				stx.draw();
			}
			STX.ThemeManager.baseTheme=theme;
			if(cb) cb();
		};

		/**
		 * Construct a menu from available themes
		 * @param {object} el - The menu element where custom themes will be added
		 * @param {object} el2 - The menu element where built-in themes will be added
		 * @param {object} stx - a chart
		 * @param {function} cb - A callback method for storing the themes (i.e. to localStorage)
		 * @memberOf STX.ThemeManager
		 */
		STX.ThemeManager.themesToMenu=function(el, el2, stx, cb){
			STX.ThemeManager.el=el;
			STX.ThemeManager.el2=el2;
			STX.ThemeManager.stx=stx;
			STX.ThemeManager.storageCB=cb;

			if(!el) return;

			function useBuiltInTheme(theme){
				return function(){
					STX.ThemeManager.enableBuiltInTheme(stx, theme);
				};
			}
			function useTheme(theme){
				return function(){
					STX.ThemeManager.enableTheme(stx, theme);
				};
			}

			function deleteTheme(theme){
				return function(){
					STX.ThemeManager.deleteTheme(stx, theme);
					STX.ThemeManager.themesToMenu(el, el2, stx, cb);
				};
			}
			var els=el.querySelectorAll("li");
			for(var i=0;i<els.length;i++){
				if(els[i].style.display=="block")
					el.removeChild(els[i]);
			}

			var template=el.querySelectorAll(".themeSelectorTemplate")[0];
			var theme,li;
			for(theme in STX.ThemeManager.themes.customThemes){
				li=template.cloneNode(true);
				li.style.display="block";
				var stxItem=$$$(".stxItem",li);
				stxItem.innerHTML=theme;
				stxItem[STXTouchAction]=useTheme(theme);
				el.appendChild(li);
				$$$(".stxClose", li)[STXTouchAction]=deleteTheme(theme);
			}
			STX.clearNode(el2);
			for(theme in STX.ThemeManager.builtInThemes){
				li=STX.newChild(el2, "li");
				li[STXTouchAction]=useBuiltInTheme(theme);
				li.appendChild(STX.translatableTextNode(stx,theme));
			}
		};

		/**
		 * Namespace for managing iscrolls (scrollable elements by touch of mousewheel).
		 * @name  STX.iscroll
		 */
		STX.iscroll=function(){};

		/**
		 * The scrollers in use
		 * @type {Array}
		 * @memberOf STX.iscroll
		 */
		STX.iscroll.scrollers=[];

		/**
		 * Create a new iscroll
		 * @param  {object} node   The element to attach the scroller to
		 * @param  {object} [params] Parameters for the scroller as defined by iscroll library
		 * @param {string} version Set to "IScroll5" to use iscroll v5 otherwise defaults to iscroll v4
		 * @return {object}        Returns the scroller
		 * @memberOf STX.iscroll
		 */
		STX.iscroll.newScroller=function(node, params){
			if(!params) params={
				tap:true,
				scrollbars:true,
				interactiveScrollbars: true,
				mouseWheel: true
			};
			var iscroll = new iScroll5(node, params);
			STX.iscroll.scrollers.push(iscroll);
			return iscroll;
		};

		/**
		 * Refreshes all iscrolls on the page
		 * @memberOf STX.iscroll
		 */
		STX.iscroll.refresh=function(){
			for(var i=0;i<STX.iscroll.scrollers.length;i++){
				var iscroll=STX.iscroll.scrollers[i];
				iscroll.refresh();
			}
		};

		/**
		 * This is a widget that can be used to display search results
		 * @constructor
		 * @name  STX.LookupWidget
		 * @param {object} config Configuration for widget
		 * @param {object} config.stx - the chart object
		 * @param {object} config.input - DOM input field to attach the lookup widget
		 * @param {function} config.textCallback - function to call when a search string is entered of format func(this, txt, filter)
		 * @param {function} config.selectCallback - function to call when the user selects a search result or hits enter func(this, txt, filter)
		 * @param {array} config.filters - an array of security classes to filter on. Valid values at this time for symbols are: ALL, STOCKS, FOREX, INDEXES. Null to not provide a filter.
		 * @param {boolean} config.cascade - set to true to allow the lookup window to cascade on top of another window ( example: the comparison window in the advanced package).
		 * @param {boolean} config.mustSelect - set to true to disable pressing enter in the input box.  A selection from the list must occur.
		 * @param {boolean} config.allowSymbolObject - set to true to return a symbol object from the search dropdown instead of just a symbol string. **Please note that only if an item from the drop down is selected, can the corresponding object be returned**. If the user enters text and presses enter or the add button, only that text will be returned as it is not derived from the dropdown list, wich contains the additional object information. See {@link STXChart#newChart} for details on how to use charts with a symbol object.		@name STX.LookupWidget
		 * @example
			var config={
				input: $$$("#symbol"),						// input field from the GUI
				textCallback: textCallbackChartIQ,			// Function used to do lookup - If you don't have a symbol lookup then just leave this blank
				selectCallback: selectCallback,             // Function used to act on the symbol selected. Normally used to create a new chart with the new symbol.
				filters:["ALL","STOCKS","FUNDS","FOREX","INDEXES"],	// Names of the filters you are supporting
				allowSymbolObject : false,                   // set to true to return a symbol object from the search insted of just a symbol string
		    	stx: stxx									// the chart object -- needed for translations
			};
			var stxLookupWidget=new STX.LookupWidget(config);
		*/

		STX.LookupWidget=function(config){
			this.config=config;
			this.div=null;
			this.currentFilter=null;
			this.filterButtons=[];
			this.height=480;
		};

		/**
		 * Call this function with the results from your search.
		 * @param {object} results Results to display on the dropdown. See `Example` for format.
		 * @example
		 * // Results should be an array of the following object:
		 * {
		 * 		symbol: symbol,
		 * 		description: full name of security,
		 * 		exchange: optional exchange
		 * }
		 * @memberOf STX.LookupWidget
		 */
		STX.LookupWidget.prototype.displayResults=function(results){
			function select(that, symbol){
				return function(e){
					if(typeof symbol == 'object') {
						that.config.input.value=symbol.symbol;
					} else {
						that.config.input.value=symbol;
					}
					that.config.selectCallback(that, symbol, that.currentFilter);
					that.close();
					that.config.input.blur();
				};
			}
			if(this.ul) STX.clearNode(this.ul);
			if(results.length>0){
				this.display();
			}else{
				if(!this.config.filters && this.div) this.div.style.display="none";
				return;
			}
			for(var i=0;i<results.length;i++){
				var result=results[i];
				var li=STX.newChild(this.ul, "LI");
				var symbolSpan=STX.newChild(li, "span");
				symbolSpan.innerHTML=result.symbol;
				var descriptionSpan=STX.newChild(li, "span");
				if(result.description===null || typeof(result.description)=="undefined") result.description=result.name;
				descriptionSpan.innerHTML=result.description;
				var exchangeSpan=STX.newChild(li, "span");
				if(result.exchange===null || typeof(result.exchange)=="undefined") result.exchange=result.exchDisp;
				if(result.exchange) exchangeSpan.appendChild(this.config.stx? STX.translatableTextNode(this.config.stx,result.exchange) : result.exchange);
				if ( this.config.allowSymbolObject )
					STX.ScrollManager.attach(li, select(this, result));
				else
					STX.ScrollManager.attach(li, select(this, result.symbol));
			}
			if(!this.iscroll){
				this.iscroll = STX.iscroll.newScroller(this.ul.parentNode);
			}else{
				this.iscroll.refresh();
				this.iscroll.scrollTo(0,0);
			}
		};

		/**
		 * Initializes the lookup widget by attaching keyup and click events to the input.
		 * Also will start the chartIQ service if enabled.
		 * @memberOf STX.LookupWidget
		 */
		STX.LookupWidget.prototype.init=function(){
			function closure(that){
				return function(e){
					var div=STX.getEventDOM(e);
					var key = (window.event) ? event.keyCode : e.keyCode;
					switch(key){
						case 13:
							if(that.config.mustSelect) break;
							var symbol=div.value;
							that.close();
							that.config.selectCallback(that, symbol, that.currentFilter);
							div.blur();
							break;
						case 27:
							that.close();
							div.blur();
							break;
						default:
							//TODO, clear symbol icon
							that.config.textCallback(that, div.value, that.currentFilter, false);	// false means user typed in input box
							break;
					}
					e = e||event;
					if(e.stopPropagation){
						e.stopPropagation();
					}else{
						e.cancelBubble = true;
					}
				};
			}
			function closure2(that){
				return function(e){
					var div=STX.getEventDOM(e);
					that.config.textCallback(that, div.value, that.currentFilter, true);	// true means user clicked in input box
				};
			}
			this.config.input.onkeyup=closure(this);
			this.config.input.onclick=closure2(this);
		};

		/**
		 * Displays the lookup widget results. The lookup widget behaves like a menu. It will close if you click out of it or if you click on another menu.
		 * @memberOf STX.LookupWidget
		 */
		STX.LookupWidget.prototype.display=function(){
			function pressFilter(that, div, filter){
				return function(){
					for(var i=0;i<that.filterButtons.length;i++){
						STX.unappendClassName(that.filterButtons[i],"on");
					}
					STX.appendClassName(div, "on");
					that.currentFilter=filter;
					that.config.textCallback(that, that.config.input.value, that.currentFilter);
				};
			}
			if(!this.div){
				this.div=STX.newChild(this.config.input.parentNode, "DIV", "menuOutline stxLookupResults");
				var ul=STX.newChild(this.div, "UL", "stxResults");
				var li;
				if(this.config.filters){
					li=STX.newChild(ul, "LI", "stxLookupFilter");
					for(var i=0;i<this.config.filters.length;i++){
						var filter=this.config.filters[i];
						var div=STX.newChild(li, "div", "stx-btn");
						div.appendChild(this.config.stx? STX.translatableTextNode(this.config.stx,filter) : filter);
						div[STXTouchAction]=pressFilter(this, div, filter);
						this.filterButtons.push(div);
					}
					STX.newChild(ul, "LI", "divider");
				}
				li=STX.newChild(ul, "LI");
				this.ul=STX.newChild(li, "UL", "menuSelect");
				var lookupClassName=this.config.className;
				if(!lookupClassName) lookupClassName="stxLookupSymbols";
				STX.appendClassName(this.ul, lookupClassName);
				li.style.maxHeight=this.height + "px";
				if(!this.config.cascade) STX.MenuManager.menuOff(true, true);
			}else{
				if(this.div.style.display=="none"){
					if(!this.config.cascade) STX.MenuManager.menuOff(true, true);
				}
				this.div.style.display="inline-block";
			}

			function closeCallback(that){
				return function(){
					if(that.div) that.div.style.display="none";
				};
			}
			STX.MenuManager.menuOn("lookup", closeCallback(this), this.config.cascade);

		};

		/**
		 * Closes the lookup results window
		 * @memberOf STX.LookupWidget
		 */
		STX.LookupWidget.prototype.close=function(){
			if(this.div) this.div.style.display="none";
			STX.MenuManager.menuOff(true);
		};


		/**
		 * ScrollManager
		 *
		 * This is a widget for detecting whether a user has scrolled between the time that they press the mouse and let go. Otherwise
		 * the act of scrolling a dialog would cause a selection of items in the dialog. To use, register start as your mousedown or touchstart event. Then
		 * call isClick(e) during your mouseup or touchend event to determine whether the user truly clicked or not.
		 * @name STX.ScrollManager
		 */
		STX.ScrollManager=function(){};

		STX.ScrollManager.x=0;
		STX.ScrollManager.y=0;
		STX.ScrollManager.downTime=0;
		/**
		 * Use this method to attach a click event to a node that is within an iscroll. Use this instead of onclick, onmousedown or ontouchstart.
		 * @param {object} node The DOM element that is clickable
		 * @param {function} fc Callback method when node is clicked
		 * @memberOf STX.ScrollManager
		 */
		STX.ScrollManager.attach=function(node, fc){
			if(navigator.pointerEnabled){
				node.addEventListener("pointerdown", STX.ScrollManager.start);
			}else if(navigator.msMaxTouchPoints>1){
				node.addEventListener("MSPointerDown", STX.ScrollManager.start);
			}else{
				node.addEventListener("mousedown", STX.ScrollManager.start);
				node.addEventListener("touchstart", STX.ScrollManager.start);
			}
			node.addEventListener("tap", function(fc){
				return function(e){
				if(!node.tapped || Date.now()-node.tapped>750) fc(e);
					node.tapped=Date.now();
				};
			}(fc));
			node.addEventListener("click", function(fc){
				return function(e){
					if(STX.ScrollManager.isClick(e)){
						if(!node.tapped || Date.now()-node.tapped>750) fc(e);
						node.tapped=Date.now();
					}
				};
			}(fc));
		};

		/**
		 * Begins a scroll event
		 * @private
		 * @memberOf STX.ScrollManager
		 */
		STX.ScrollManager.start=function(e){
			STX.ScrollManager.x=e.pageX;
			STX.ScrollManager.y=e.pageY;
			if(e.touches && e.touches.length>=1){
				STX.ScrollManager.x=e.touches[0].pageX;
				STX.ScrollManager.y=e.touches[0].pageY;
			}
			STX.ScrollManager.downTime=new Date().getTime();
		};

		/**
		 * True if the click was an actual click. This depends on how long the user held their finger/mouse down (under 2 seconds) and whether
		 * their finger or mouse moved significantly in that time (over 10 pixels). If either of those conditions is true then likely the user
		 * was scrolling, not clicking
		 * @private
		 * @memberOf STX.ScrollManager
		 */
		STX.ScrollManager.isClick=function(e){
			var now=new Date().getTime();
			if(now-STX.ScrollManager.downTime>2000) return false;	// Over two seconds from mouse down to mouse up is not a click
			if(Math.abs(e.pageX-STX.ScrollManager.x)>10) return false;	// Moved mouse or finger too much
			if(Math.abs(e.pageY-STX.ScrollManager.y)>10) return false;
			return true;
		};

		/**
		 * Use this method to attach a right click event to a node. Second argument is the callback function.
		 * @param {object} node DOM element that is "right clickable"
		 * @param {function} fc Callback when user right clicks
		 * @memberOf STX.ScrollManager
		 */
		STX.ScrollManager.attachRightClick=function(node, fc){
			function closure(fc){
				return function(e){
					if((e.which && e.which>=2) || (e.button && e.button>=2)){
						fc(e);
					}
				};
			}
			if(navigator.pointerEnabled){
				node.addEventListener("pointerup", closure(fc));
			}else if(navigator.msMaxTouchPointers>1){
				node.addEventListener("MSPointerUp", closure(fc));
			}else{
				node.addEventListener("mouseup", closure(fc));
			}
			node.rightClickable=true;
		};

		/**
		 * This method kills the context menu (default browser behavior) if the target is right clickable. It assumes that
		 * STX.ScrollManager.attachRightClick has been called on that node. This is automatic and should not be called directly
		 * @private
		 * @memberOf STX.ScrollManager
		 */
		STX.ScrollManager.onContextMenu=function(e){
			if(e.target.rightClickable){ // If node is right clickable then kill context menu, which will allow the mouseup event to trigger
				e.preventDefault();
				return false;
			}
			// otherwise the standard context menu will appear
		};

		document.addEventListener("contextmenu", STX.ScrollManager.onContextMenu, false);	// To support right clicking

		/**
		 * Lets users pick a local timezone for display on the xaxis of charts.
		 * Creates a menu structure which can be used to provide a user with timezone selection
		 * First level tier is the region. Each region has an array of cities. If the array is empty
		 * then no cities are available for that region. The timezone should be reconstructed as
		 * region/city. For instance, "America/New_York". Or for regions without cities simply "Iran".
		 * The reconstructed value can then be passed into stxx.setTimeZone();
		 * @namespace
		 * @name  STX.TimeZoneWidget
		 */
		STX.TimeZoneWidget=function(){};

		/**
		 * Initializes the TimeZoneWidget. This method is called once, automatically. Do not call directly. It iterates
		 * through the known timezomes as provided by stxTimeZoneData.js and creates a comprehensive timezone menu from those items.
		 * @private
		 * @memberOf STX.TimeZoneWidget
		 */
		STX.TimeZoneWidget.init=function(){
			if(typeof timezoneJS!="undefined"){
				STX.TimeZoneWidget.timezoneMenu={};

				for(var i in timezoneJS.timezone.zones){
					//if(typeof timezoneJS.timezone.zones[i]=="string") continue;	// translations
					var s=i.split("/");
					var region=s[0];
					if(!STX.TimeZoneWidget.timezoneMenu[region]) STX.TimeZoneWidget.timezoneMenu[region]=[];

					if(s.length>1){
						var city=s[1];
						if(s.length>2) city+="/" + s[2];
						STX.TimeZoneWidget.timezoneMenu[region].push(city);
					}
				}
			}
		};

		/**
		 * Selects a time zone and enables it in all registered charts.
		 * @param {string} zone A valid time zone
		 * @memberOf STX.TimeZoneWidget
		 */
		STX.TimeZoneWidget.setTimeZone=function(zone){
			STXChart.defaultDisplayTimeZone=zone;
			for(var i=0;i<STXChart.registeredContainers.length;i++){
				var stx=STXChart.registeredContainers[i].stx;
				stx.setTimeZone(stx.dataZone, zone);
				if(stx.chart.symbol) stx.draw();
			}
		};

		/**
		 * Removes the time zone from registered charts, and also from the attached storage mechanism.
		 * @memberOf STX.TimeZoneWidget
		 */
		STX.TimeZoneWidget.removeTimeZone=function(){
			STXChart.defaultDisplayTimeZone=null;
			for(var i=0;i<STXChart.registeredContainers.length;i++){
				var stx=STXChart.registeredContainers[i].stx;
				stx.displayZone=null;
				stx.setTimeZone();
				if(STX.TimeZoneWidget.storageCB){
					STX.TimeZoneWidget.storageCB(null);
				}
				if(stx.displayInitialized) stx.draw();
			}
		};

		/**
		 * The comprehensive list of timezones can be overwhelming. This is a reduced list that provides just a single
		 * entry for each valid timezone. Each entry maps back to a valid stxTimeZoneData.js entry.
		 * @type {Object}
		 * @memberOf STX.TimeZoneWidget
		 */
		STX.TimeZoneWidget.timeZoneMap={
				"(GMT-11:00) American Samoa, Midway Island":"Pacific/Midway",
				"(GMT-10:00) Hawaii":"Pacific/Honolulu",
				"(GMT-09:00) Alaska":"America/Juneau",
				"(GMT-08:00) Pacific Time (US and Canada); Tijuana":"America/Los_Angeles",
				"(GMT-08:00) Tijuana":"America/Tijuana",
				"(GMT-07:00) Arizona":"America/Phoenix",
				"(GMT-07:00) Chihuahua, La Paz, Mazatlan":"America/Chihuahua",
				"(GMT-07:00) Mountain Time (US and Canada)":"America/Denver",
				"(GMT-06:00) Central America":"America/Costa_Rica",
				"(GMT-06:00) Central Time (US and Canada)":"America/Chicago",
				"(GMT-06:00) Guadalajara, Mexico City, Monterrey":"America/Mexico_City",
				"(GMT-06:00) Saskatchewan":"America/Regina",
				"(GMT-05:00) Bogota, Lima, Quito, Rio Branco":"America/Bogota",
				"(GMT-05:00) Eastern Time (US and Canada)":"America/New_York",
				"(GMT-05:00) Indiana (East)":"America/Indiana/Indianapolis",
				"(GMT-04:00) Caracas":"America/Caracas",
				"(GMT-04:00) Atlantic Time (Canada)":"America/Halifax",
				"(GMT-04:00) Georgetown, La Paz, Manaus, San Juan":"America/Puerto_Rico",
				"(GMT-03:30) Newfoundland and Labrador":"America/St_Johns",
				"(GMT-03:00) Buenos Aires, Santiago":"America/Buenos_Aires",
				"(GMT-03:00) Sao Paulo, Montevideo":"America/Sao_Paulo",
				"(GMT-02:00) Mid-Atlantic":"Atlantic/South_Georgia",
				"(GMT-01:00) Azores":"Atlantic/Azores",
				"(GMT-01:00) Cape Verde Islands":"Atlantic/Cape_Verde",
				"(GMT) Casablanca, Dublin, Lisbon, London":"Europe/London",
				"(GMT) Greenwich Mean Time, Reykjavik":"Atlantic/Reykjavik",
				"(GMT+01:00) Algiers, Tunis":"Africa/Tunis",
				"(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna":"Europe/Amsterdam",
				"(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague":"Europe/Belgrade",
				"(GMT+01:00) Brussels, Copenhagen, Madrid, Paris":"Europe/Brussels",
				"(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb":"Europe/Sarajevo",
				"(GMT+01:00) Kaliningrad":"Europe/Kaliningrad",
				"(GMT+02:00) Athens, Istanbul, Nicosia":"Europe/Athens",
				"(GMT+02:00) Bucharest":"Europe/Bucharest",
				"(GMT+02:00) Simferopol":"Europe/Simferopol",
				"(GMT+02:00) Cairo":"Africa/Cairo",
				"(GMT+02:00) Harare, Johannesburg":"Africa/Johannesburg",
				"(GMT+02:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius":"Europe/Helsinki",
				"(GMT+02:00) Jerusalem":"Asia/Jerusalem",
				"(GMT+03:00) Baghdad, Kuwait, Riyadh":"Asia/Kuwait",
				"(GMT+03:00) Minsk, Moscow, Kirov, Volgograd":"Europe/Moscow",
				"(GMT+03:00) Nairobi":"Africa/Nairobi",
				"(GMT+03:30) Tehran":"Asia/Tehran",
				"(GMT+04:00) Baku":"Asia/Baku",
				"(GMT+04:00) Dubai, Muscat":"Asia/Muscat",
				"(GMT+04:00) Astrakhan, Samara, Ulyanovsk":"Europe/Samara",
				"(GMT+04:30) Kabul":"Asia/Kabul",
				"(GMT+05:00) Karachi, Tashkent":"Asia/Karachi",
				"(GMT+05:00) Yekaterinburg":"Asia/Yekaterinburg",
				"(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi":"Asia/Kolkata",
				"(GMT+05:45) Kathmandu":"Asia/Kathmandu",
				"(GMT+06:00) Almaty, Novosibirsk, Omsk":"Asia/Novosibirsk",
				"(GMT+06:00) Astana, Dhaka":"Asia/Dhaka",
				"(GMT+06:30) Yangon":"Asia/Rangoon",
				"(GMT+07:00) Bangkok, Hanoi, Jakarta":"Asia/Bangkok",
				"(GMT+07:00) Hovd":"Asia/Hovd",
				"(GMT+07:00) Barnaul, Tomsk, Novokuznetsk, Krasnoyarsk":"Asia/Krasnoyarsk",
				"(GMT+08:00) Beijing, Chongqing, Hong Kong SAR, Urumqi":"Asia/Hong_Kong",
				"(GMT+08:00) Brunei, Kuala Lumpur, Singapore":"Asia/Kuala_Lumpur",
				"(GMT+08:00) Irkutsk":"Asia/Irkutsk",
				"(GMT+08:00) Perth":"Australia/Perth",
				"(GMT+08:00) Taipei":"Asia/Taipei",
				"(GMT+08:00) Ulaanbaatar":"Asia/Ulaanbaatar",
				"(GMT+08:30) Pyongyang":"Asia/Pyongyang",
				"(GMT+08:45) Eucla":"Australia/Eucla",
				"(GMT+09:00) Osaka, Sapporo, Tokyo":"Asia/Tokyo",
				"(GMT+09:00) Seoul":"Asia/Seoul",
				"(GMT+09:00) Yakutsk, Khandyga, Chita":"Asia/Yakutsk",
				"(GMT+09:30) Adelaide":"Australia/Adelaide",
				"(GMT+09:30) Darwin":"Australia/Darwin",
				"(GMT+10:00) Brisbane":"Australia/Brisbane",
				"(GMT+10:00) Canberra, Melbourne, Sydney":"Australia/Canberra",
				"(GMT+10:00) Guam, Port Moresby":"Pacific/Guam",
				"(GMT+10:00) Vladivostok, Ust-Nera":"Asia/Vladivostok",
				"(GMT+11:00) Noumea, Solomon Islands":"Pacific/Noumea",
				"(GMT+11:00) Magadan":"Asia/Magadan",
				"(GMT+11:00) Sakhalin, Srednekolymsk":"Asia/Srednekolymsk",
				"(GMT+12:00) Auckland, Wellington, Fiji":"Pacific/Auckland",
				"(GMT+12:00) Kamchatka, Anadyr":"Asia/Kamchatka",
				"(GMT+12:45) Chatham":"Pacific/Chatham",
				"(GMT+13:00) Nuku'alofa, Samoa":"Pacific/Tongatapu",
				"(GMT+14:00) Kiritimati":"Pacific/Kiritimati"
		};

		/**
		 * Populates the timezone dialog. This generates a list from STX.TimeZoneWidget.timeZoneMap. Generally this method
		 * is called when the menu is enabled.
		 * @memberOf STX.TimeZoneWidget
		 */
		STX.TimeZoneWidget.populateDialog=function(id){
			if(!STX.TimeZoneWidget.timezoneMenu) STX.TimeZoneWidget.init();

			function setTimezone(zone){
				return function(e){
					STX.DialogManager.dismissDialog();
					var translatedZone=STX.TimeZoneWidget.timeZoneMap[zone];
					STX.TimeZoneWidget.setTimeZone(translatedZone);
					if(STX.TimeZoneWidget.storageCB){
						STX.TimeZoneWidget.storageCB(translatedZone);
					}
				};
			}
			if(typeof timezoneJS=="undefined") return;
			var el=$$(id);
			if(!el) return;
			var ul=el.querySelector("ul");
			var template=ul.querySelector("li#timezoneTemplate").cloneNode(true);
			STX.clearNode(ul);
			ul.appendChild(template);
			var arr=[];
			var zone;
			for(zone in STX.TimeZoneWidget.timeZoneMap){
				arr.push(zone);
			}
			for(var i=0;i<arr.length;i++){
				zone=arr[i];
				var display=zone;
				var li=template.cloneNode(true);
				li.style.display="block";
				li.innerHTML=display;
				STX.ScrollManager.attach(li, setTimezone(zone));
				ul.appendChild(li);
			}
			if(!STX.TimeZoneWidget.iscroll){
				STX.TimeZoneWidget.iscroll = STX.iscroll.newScroller('#timezoneDialogWrapper', {tap:true, scrollbars:false, interactiveScrollbars:false, mouseWheel:true});
			}else{
				STX.TimeZoneWidget.iscroll.refresh();
			}
		};

		/**
		 * Initialize the time zone manager with a prior saved timezone (initialTimeZone) and a callback
		 * mechanism for saving the timezone. Call this function when you initialize your UI.
		 * @param {string} [initialTimeZone] Default timezone to use
		 * @param {function} [cb] Callback function to store a different timezone that the user might pick through the menu fc(string)
		 * @memberOf STX.TimeZoneWidget
		 */
		STX.TimeZoneWidget.initialize=function(initialTimeZone, cb){
			if(initialTimeZone){
				STX.TimeZoneWidget.setTimeZone(initialTimeZone);
			}
			STX.TimeZoneWidget.storageCB=cb;
		};

		/**
		 * Base class for interacting with a name value store. This base class saves to local storage
		 * but you can override your own for remote storage.
		 */
		STX.NameValueStore=function(){
		};

		STX.NameValueStore.prototype.toJSONIfNecessary=function(obj){
			if(obj.constructor==String) return obj;
			try{
				var s=JSON.stringify(obj);
				return s;
			}catch(e){
				console.log("Cannot convert to JSON: " + obj);
				return null;
			}
		};

		STX.NameValueStore.prototype.fromJSONIfNecessary=function(obj){
			try{
				var s=JSON.parse(obj);
				return s;
			}catch(e){
				return obj;
			}
		};

		/**
		 * Get a value from the name value store
		 * @param  {String}   field The field to fetch
		 * @param  {Function} cb    Callback. First field is error or null. Second field is the result.
		 * @example
		 * nameValueStore.get("myfield", function(err,data){
		 *    if(!err){
		 *        // do something with data
		 *    }
		 * });
		 */
		STX.NameValueStore.prototype.get=function(field, cb){
			var value=STX.localStorage.getItem(field);
			cb(null, this.fromJSONIfNecessary(value));
		};

		STX.NameValueStore.prototype.set=function(field, value, cb){
			STX.localStorage.setItem(field, this.toJSONIfNecessary(value));
			if(cb) cb(null);
		};

		STX.NameValueStore.prototype.remove=function(field, cb){
			STX.localStorage.removeItem(field);
			if(cb) cb(null);
		};


		/**
		 * A widget for saving and getting name value pairs. Uses browser localStorage by default but you can override
		 * the remove, get and store functions, or derive a new class, to save to a different data store.
		 * @namespace
		 * @name  STX.StorageManager
		 */
		STX.StorageManager=function(){};

		/**
		 * Get the value for a given key from storage
		 * @param  {string} key The key
		 * @param {Function} [cb] Optionally receive the result in a callback. Required for asynchronous interfaces.
		 * @return {object}     The data in JSON format ( sample: "[{"list 1":["IBM","GE","INTC"]},{"list 2":["G","T","W","K"]}]")
		 * @memberOf STX.StorageManager
		 * @since  2015-03-01 Added optional callback
		 */
		STX.StorageManager.get=function(key, cb){
			if(!STX.localStorage) return null;
			var datum=STX.localStorage.getItem(key);
			if(cb){
				cb(null, datum);
			}
			return datum;
		};

		/**
		 * Save the key value pair in storage
		 * @param  {string} key   The key
		 * @param  {object} value The value in Json format ( sample: "[{"list 1":["IBM","GE","INTC"]},{"list 2":["G","T","W","K"]}]")
		 * @memberOf STX.StorageManager
		 */
		STX.StorageManager.store=function(key, value){
			STX.localStorage.setItem(key, value);
		};

		/**
		 * Remove the key from storage
		 * @param  {string} key The key
		 * @memberOf STX.StorageManager
		 */
		STX.StorageManager.remove=function(key){
			STX.localStorage.removeItem(key);
		};

		/**
		 * Provides a closure that can be passed in to other STX UI components for storage or removal.
		 * @param  {string} key The key for the closure
		 * @return {fc}     A closure of form fc(value, stx)
		 * @example
		 * // This provides the ThemeManager with a mechanism for saving its data, under the key "themes"
		 * STX.ThemeManager.themesToMenu(node, node, stx, STX.StorageManager.callbacker("themes"));
		 * @memberOf STX.StorageManager
		 */
		STX.StorageManager.callbacker=function(key){
			return function(value, stx){
				if(value===null){
					STX.StorageManager.remove(key);
				}else{
					STX.StorageManager.store(key, value);
				}
			};
		};

		/**
		 * Initializes and interacts with the settings tool for fibonacci
		 * @name STX.FibDialog
		 */
		STX.FibDialog=function(){

		};

		STX.FibDialog.initialize=function(element){
			var template=$$$(".fib-template", element);
			var fibs=[-0.786, -0.618, -0.5, -0.382, -0.236, 0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.382, 1.618, 2.618, 4.236];
			for(var i=0;i<fibs.length;i++){
				var fib=fibs[i];
				var li=template.cloneNode(true);
				li.style.display="block";
				$$$(".stx-fib-level", li).innerHTML=fib;
				li.fib=fib;
				li.id="stx-fib-" + fib.toString().replace(".","");
				template.parentNode.appendChild(li);
			}
		};

		STX.FibDialog.restore=function(fibonacci){
			STX.FibDialog.fibonacci=fibonacci;
			var fibTemplates=document.querySelectorAll(".fib-template");
			var i;
			for(i=0;i<fibTemplates.length;i++){
				$$$(".check input", fibTemplates[i]).checked=false;
			}
			for(i=0;i<fibonacci.fibs.length;i++){
				var fibdef=fibonacci.fibs[i];
				var template=$$$("#stx-fib-" + fibdef.level.toString().replace(".",""));
				if(!template) continue;
				$$$(".check input", template).checked=true;
			}
		};

		STX.FibDialog.save=function(){
			var fibonacci=STX.FibDialog.fibonacci; // for now recall initial settings, eventually derive the entire fibonacci settings from dialog
			fibonacci.fibs=[];
			var fibTemplates=document.querySelectorAll(".fib-template");
			for(var i=0;i<fibTemplates.length;i++){
				var fibTemplate=fibTemplates[i];
				if($$$(".check input", fibTemplate).checked){
					fibonacci.fibs.push({
						level:fibTemplate.fib,
						color:"auto",
						parameters:{pattern:"solid", opacity:0.25, lineWidth:1}
					});
				}
			}
			if(STX.FibDialog.drawingToolbar){
				STX.FibDialog.drawingToolbar.stx.currentVectorParameters.fibonacci=fibonacci;
				if(STX.FibDialog.drawingToolbar.callback) STX.FibDialog.drawingToolbar.callback();
			}
			return fibonacci;
		};

		STX.FibDialog.setLine=function(weight, pattern, htmlElement){
			alert(pattern);
		};

		STX.FibDialog.display=function(drawingToolbar){
			var dialog=$$$("#fibDialog");
			STX.FibDialog.drawingToolbar=drawingToolbar; // stash the toolbar, which has a reference to the current stx
			STX.FibDialog.restore(drawingToolbar.stx.currentVectorParameters.fibonacci); // set the dialog to reflect the current fib settings
			STX.DialogManager.displayDialog(dialog); // display the dialog
		};

		/**
		 * The drawing toolbar is dynamic, displaying various configuration options depending on the tool that is enabled.
		 * This object manages the drawing toolbar.
		 * @constructor
		 * @param {HTMLElement} htmlElement The toolbar htmlElement
		 * @param {STXChart} stx STXChart object associated with this toolbar.
		 * @param {function} [callback] Set this to receive a notification whenever a change is made to the toolbar. Examine stx.currentVectorParameters for the change.
		 * @name  STX.DrawingToolbar
		 */
		STX.DrawingToolbar=function(htmlElement, stx, callback){
			this.stx=stx;
			this.callback=callback;
			this.initialize(htmlElement);
			this.setVectorType(null);
		};


		/**
		 * Initializes the drawing toolbar. It finds the toolbar through class stx-toolbar. Be sure to copy that HTML verbatim into your project
		 * if you aren't using the demo as a starting point. Call this function when you initialize your UI.
		 * Automatically called when a `new STX.DrawingToolbar(htmlElement, stx, callback);` is instantiated.
		 * @param {HTMLElement} htmlElement The toolbar htmlElement
		 * @memberOf STX.DrawingToolbar
		 */
		STX.DrawingToolbar.prototype.initialize=function(htmlElement){
			this.htmlElement=htmlElement;
			htmlElement.DrawingToolbar=this;
			function setLineColor(self){
				return function(color){
					if(color=="000000" || color=="ffffff") self.stx.currentVectorParameters.currentColor="auto";
					else self.stx.currentVectorParameters.currentColor="#" + color;
					if(self.callback) self.callback();
				};
			}
			function setFillColor(self){
				return function(color){
					self.stx.currentVectorParameters.fillColor="#" + color;
					if(self.callback) self.callback();
				};
			}
			var toolbar=this.htmlElement;

			var lineColorPicker=$$$(".stxLineColorPicker", toolbar);
			if(this.stx.currentVectorParameters.currentColor=="auto")
				this.stx.currentVectorParameters.currentColor=lineColorPicker.style.backgroundColor;
			else
				lineColorPicker.style.backgroundColor=this.stx.currentVectorParameters.currentColor;
			STX.MenuManager.attachColorPicker(lineColorPicker, toolbar, setLineColor(this));

			var fillColorPicker=$$$(".stxFillColorPicker", toolbar);
			if(this.stx.currentVectorParameters.fillColor=="auto")
				this.stx.currentVectorParameters.fillColor=fillColorPicker.style.backgroundColor;
			else
				fillColorPicker.style.backgroundColor=this.stx.currentVectorParameters.fillColor;
			STX.MenuManager.attachColorPicker(fillColorPicker, toolbar, setFillColor(this));

			var display=$$$(".stxAxisLabel", toolbar);
			if(display) {
				STX.unappendClassName(display, !this.stx.currentVectorParameters.axisLabel);
				STX.appendClassName(display, this.stx.currentVectorParameters.axisLabel);
			}
			if(this.stx.currentVectorParameters.annotation.font.style=="italic")
				STX.appendClassName($$$(".stx-toolbar .stx-annotation-italic", htmlElement), "active");
			if(this.stx.currentVectorParameters.annotation.font.weight=="bold")
				STX.appendClassName($$$(".stx-toolbar .stx-annotation-bold", htmlElement), "active");
			if(this.stx.currentVectorParameters.annotation.font.size) STX.DrawingToolbar.setFont(htmlElement, this.stx.currentVectorParameters.annotation.font.size);
			if(this.stx.currentVectorParameters.annotation.font.family) STX.DrawingToolbar.setFont(htmlElement, this.stx.currentVectorParameters.annotation.font.family);
			this.setLine(this.stx.currentVectorParameters.lineWidth, this.stx.currentVectorParameters.pattern);
		};

		/**
		 * Old version of initialize for use with old static version of STX.DrawingToolbar
		 * @deprecated
		 */
		STX.DrawingToolbar.initialize=function(){}; // @deprecated, this remains for backward compatibility

		/**
		 * Sets the current drawing line color based on what is picked in the toolbar
		 * @param {STXChart} stx STXChart object associated with this toolbar.
		 * @memberOf STX.DrawingToolbar
		 */
		STX.DrawingToolbar.prototype.setLineColor=function(stx){
			var lineColorPicker=$$$(".stxLineColorPicker", this.htmlElement);
			if(this.stx.currentVectorParameters.currentColor=="transparent"){
				lineColorPicker.style.backgroundColor=stx.defaultColor;
			}else{
				lineColorPicker.style.backgroundColor=this.stx.currentVectorParameters.currentColor;
			}
		};


		/**
		 * This object determines which toolbar configuration widgets are available for any given drawing type.
		 * The default settings can be found in `stx.js`, and they can be changed by overriding these defaults on your own files.
		 * When adding a new drawing type, set it to false for any given widget to disable the widget for that drawing. 
		 * @type {Object}
		 * @memberOf STX.DrawingToolbar
		 * @example
		 * 	STX.DrawingToolbar.configurator={
				".stxToolbarFill":{			"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false,									   "continuous":false, 														"freeform":false, "pitchfork":false},
				".stxToolbarLine":{},
				".stxToolbarLinePicker":{																 "annotation":false,																							   "fibonacci":false},
				".stxToolbarNone":{			"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false,									   "continuous":false, "fibonacci":false, "channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false},
				".stxToolbarDotted":{},
				".stxToolbarDashed":{},
				".stxToolbarAxisLabel":{	"measure":false, "line":false, "ray":false, "segment":false, "annotation":false,				 					   "rectangle":false, "ellipse":false, "continuous":false, "fibonacci":false, "channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false, "shape":false},
				".stxToolbarAnnotation":{	"measure":false, "line":false, "ray":false, "segment":false, 					 "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false, "fibonacci":false, "channel":false, "gartley":false, "freeform":false, "pitchfork":false,				  "shape":false},
				".stxToolbarStylePicker":{  "measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false,                    "channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false},
				"#stx-toolbar-settings":{	"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false,					  "channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false, "shape":false}
			};
		 */
		STX.DrawingToolbar.configurator={
				".stxToolbarFill":{			"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false,									   "continuous":false, 														"freeform":false, "pitchfork":false},
				".stxToolbarLine":{},
				".stxToolbarLinePicker":{																 "annotation":false,																							   "fibonacci":false},
				".stxToolbarNone":{			"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false,									   "continuous":false, "fibonacci":false, "channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false},
				".stxToolbarDotted":{},
				".stxToolbarDashed":{},
				".stxToolbarAxisLabel":{	"measure":false, "line":false, "ray":false, "segment":false, "annotation":false,				 					   "rectangle":false, "ellipse":false, "continuous":false, "fibonacci":false, "channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false, "shape":false},
				".stxToolbarAnnotation":{	"measure":false, "line":false, "ray":false, "segment":false, 					 "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false, "fibonacci":false, "channel":false, "gartley":false, "freeform":false, "pitchfork":false,				  "shape":false},
				".stxToolbarStylePicker":{  "measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false,                    "channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false},
				"#stx-toolbar-settings":{	"measure":false, "line":false, "ray":false, "segment":false, "annotation":false, "horizontal":false, "vertical":false, "rectangle":false, "ellipse":false, "continuous":false,					  "channel":false, "gartley":false, "freeform":false, "pitchfork":false, "callout":false, "shape":false}
		};

		/**
		 * Sets the line type (STXChart.currentVectorParameters) from the toolbar selections.
		 * @param {Number} width   The width of the line
		 * @param {string} pattern The type of line ("solid","dotted","dashed" or "none")
		 * @memberOf STX.DrawingToolbar
		 * @private
		 */
		STX.DrawingToolbar.prototype.setLine=function(width, pattern){
			var className="stx-line stxLineDisplay weight" + Math.floor(width);
			this.stx.currentVectorParameters.lineWidth=width;
			if(this.stx.currentVectorParameters.lineWidth==Math.floor(this.stx.currentVectorParameters.lineWidth))
					this.stx.currentVectorParameters.lineWidth+=0.1;	// Use 1.1 instead of 1 to get good anti-aliasing on Android Chrome
			if(pattern=="solid"){
				this.stx.currentVectorParameters.pattern="solid";
				className+=" style1";
			}else if(pattern=="dotted"){
				this.stx.currentVectorParameters.pattern="dotted";
				className+=" style2";
			}else if(pattern=="dashed"){
				this.stx.currentVectorParameters.pattern="dashed";
				className+=" style3";
			}else if(pattern=="none"){
				this.stx.currentVectorParameters.pattern="none";
			}
			var display=$$$(".stx-toolbar .stxLineDisplay", this.htmlElement);
			if(display) display.className=className;
			if(this.callback) this.callback();
		};

		/**
		 * Sets the line type (STXChart.currentVectorParameters) from the toolbar selections.
		 * @param {Number} width   The width of the line
		 * @param {string} pattern The type of line ("solid","dotted","dashed" or "none")
		 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
		 * @memberOf STX.DrawingToolbar
		 */
		STX.DrawingToolbar.setLine=function(width, pattern, div){
			var self=STX.DrawingToolbar.findInstance(div);
			self.setLine(width, pattern);
		};

		/**
		 * Displays the Fib settings dialog.
		 * @private
		 */
		STX.DrawingToolbar.prototype.settingsDialog=function(){
			if(this.stx.currentVectorParameters.fibonacci){
				STX.FibDialog.display(this);
			}
		};

		/**
		 * Displays the Fib settings dialog.
		 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
		 */
		STX.DrawingToolbar.settingsDialog=function(div){
			var self=STX.DrawingToolbar.findInstance(div);
			self.settingsDialog();
		};
		/**
		 * Toggles the axis label from the drawing toolbar.
		 * @memberOf STX.DrawingToolbar
		 * @private
		 */
		STX.DrawingToolbar.prototype.toggleAxisLabel=function(){
			this.stx.currentVectorParameters.axisLabel=!this.stx.currentVectorParameters.axisLabel;
			var display=$$$(".stx-toolbar .stxAxisLabel", this.htmlElement);
			if(display) {
				STX.unappendClassName(display,(!this.stx.currentVectorParameters.axisLabel).toString());
				STX.appendClassName(display,this.stx.currentVectorParameters.axisLabel.toString());
			}
			if(this.callback) this.callback();
		};
		
		/**
		 * Toggles the axis label from the drawing toolbar.
		 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
		 * @memberOf STX.DrawingToolbar
		 */
		STX.DrawingToolbar.toggleAxisLabel=function(div){
			var self=STX.DrawingToolbar.findInstance(div);
			self.toggleAxisLabel();
		};

		/**
		 * Sets the font from the drawing toolbar.
		 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
		 * @param  {string} txt A valid font name or font family, size ( "12px", for example), "italic, "bold" or "Default".
		 * @memberOf STX.DrawingToolbar
		 */
		STX.DrawingToolbar.setFont=function(div, txt){
			var fontSizeRegEx=new RegExp("[0-9]+px");
			var self=STX.DrawingToolbar.findInstance(div);
			var button;
			if(txt=="italic"){
				button=$$$(".stx-toolbar .stx-annotation-italic", self.htmlElement);
				if(self.stx.currentVectorParameters.annotation.font.style=="italic"){
					self.stx.currentVectorParameters.annotation.font.style=null;
					STX.unappendClassName(button, "active");
				}else{
					self.stx.currentVectorParameters.annotation.font.style="italic";
					STX.appendClassName(button, "active");
				}
			}else if(txt=="bold"){
				button=$$$(".stx-toolbar .stx-annotation-bold", self.htmlElement);
				if(self.stx.currentVectorParameters.annotation.font.weight=="bold"){
					self.stx.currentVectorParameters.annotation.font.weight=null;
					STX.unappendClassName(button, "active");
				}else{
					self.stx.currentVectorParameters.annotation.font.weight="bold";
					STX.appendClassName(button, "active");
				}
			}else if(fontSizeRegEx.test(txt)){
				self.stx.currentVectorParameters.annotation.font.size=txt;
				$$$(".stx-toolbar .stx-annotation-size > span", self.htmlElement).innerHTML=STX.stripPX(txt);
			}else if(txt=="Default"){
				self.stx.currentVectorParameters.annotation.font.family=null;
				$$$(".stx-toolbar .stx-annotation-family > span", self.htmlElement).innerHTML=txt;
			}else{
				self.stx.currentVectorParameters.annotation.font.family=txt;
				$$$(".stx-toolbar .stx-annotation-family > span", self.htmlElement).innerHTML=txt;
			}
			if(self.callback) self.callback();
		};

		/**
		 * Changes the currently selected drawing type (vectorType). The drawing type should match the name of the Drawing object.
		 * <P>
		 * Requires an html node with ID of "toolSelection" to display the currently selected drawing tool. Defaults to "Select Tool".
		 * <br>Example: `<span id="toolSelection"></span>`
		 * <P>
		 * @param {string} vectorType The drawing type
		 * @memberOf STX.DrawingToolbar
		 * @private
		 */
		STX.DrawingToolbar.prototype.setVectorType=function(vectorType){
			var stx=this.stx;
			stx.clearMeasure();
			var all,i,j;
			if(!vectorType){
				stx.changeVectorType("");
				for(i in STX.DrawingToolbar.configurator){
					all=this.htmlElement.querySelectorAll(i);
					for(j=0;j<all.length;j++){
						all[j].style.display="none";
					}
				}
				$$$("#toolSelection", this.htmlElement).innerHTML="";
				$$$("#toolSelection", this.htmlElement).appendChild(STX.translatableTextNode(stx,"Select Tool"));
				return;
			}
			for(i in STX.DrawingToolbar.configurator){
				all=this.htmlElement.querySelectorAll(i);
				var baseVectorType;
				try{
					baseVectorType=(new STX.Drawing[vectorType]()).configurator;
				}catch(e){}
				if(!baseVectorType) baseVectorType=vectorType;
				for(j=0;j<all.length;j++){
					if(STX.DrawingToolbar.configurator[i][baseVectorType]===false){
						all[j].style.display="none";
					}else{
						all[j].style.display="";
					}
				}
			}
			if(stx.currentVectorParameters.pattern=="none" && !STX.DrawingToolbar.configurator[".stxToolbarNone"][vectorType])
				this.setLine(stx.currentVectorParameters.lineWidth, "solid");
			stx.changeVectorType(vectorType);
			$$$("#toolSelection", this.htmlElement).innerHTML="";
			$$$("#toolSelection", this.htmlElement).appendChild(STX.translatableTextNode(stx,vectorType.capitalize()));
			this.setLineColor(stx);
		};

		/**
		 * Old version of setVectorType for use with old static version of STX.DrawingToolbar
		 * @deprecated
		 */
		STX.DrawingToolbar.setVectorType=function(stx, vectorType, div){
			var self=STX.DrawingToolbar.findInstance(div);
			if(!self){	// First time through we initialize the default instance
				self=STX.DrawingToolbar._default=new STX.DrawingToolbar($$$(".stx-toolbar"), stx);
			}
			self.stx=stx;
			self.setVectorType(vectorType);
		};

		/**
		 * Changes the currently selected drawing type. The drawing type should match the name of the Drawing object.
		 * <P>
		 * Requires an html node with ID of "toolSelection" to display the currently selected drawing tool. Defaults to "Select Tool".
		 * <br>Example: `<span id="toolSelection"></span>`
		 * <P>
		 * @param {string} vectorType The drawing type
		 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
		 * @memberOf STX.DrawingToolbar
		 */
		STX.DrawingToolbar.setDrawingType=function(vectorType, div){
			var self=STX.DrawingToolbar.findInstance(div);
			self.setVectorType(vectorType);
		};
		
		/**
		 * Locates the STX.DrawingToobar instance associated with the particular HTML element. If none can be found
		 * then it reverts to the default instance
		 * @param  {HTMLElement} div The HTMLElement that was interacted with (via stxToggle)
		 * @return {STX.DrawingToolbar}     The instance associated with the element, or the default
		 * @private
		 * @memberOf  STX.DrawingToolbar
		 */
		STX.DrawingToolbar.findInstance=function(div){
			if(!div) return STX.DrawingToolbar._default;
			for(var i=0;i<40;i++){
				if(STX.hasClassName(div, "stx-toolbar")) break;
				div=div.parentNode;
				if(!div) return STX.DrawingToolbar._default;
			}
			if(div.DrawingToolbar) return div.DrawingToolbar;
			return STX.DrawingToolbar._default;
		};

		/**
		 * Turns crosshairs on or off based on the toolbar selection. Note that crosshairs can be turned on or off
		 * anytime by simply setting stx.layout.crosshair to true or false.
		 * @param  {boolean} state True if the crosshairs should be on, otherwise false
		 * @memberOf STX.DrawingToolbar
		 * @private
		 */
		STX.DrawingToolbar.prototype.crosshairs=function(state){
			var stx=this.stx;
			this.setVectorType(null);
			stx.layout.crosshair=state;
			$$$("#toolSelection", this.htmlElement).innerHTML="";
			if(state){
				$$$("#toolSelection", this.htmlElement).appendChild(STX.translatableTextNode(stx,"Crosshairs"));
			}else{
				$$$("#toolSelection", this.htmlElement).appendChild(STX.translatableTextNode(stx,"Select Tool"));
			}


			/* sane crosshair state on touch devices */
			stx.doDisplayCrosshairs();
			stx.positionCrosshairsAtPointer();
			stx.findHighlights(false, true); // turn off sticky and crosshairs
			stx.changeOccurred("layout");
			stx.draw();
		};
		
		/**
		 * Old version of crosshairs for use with old static version of STX.DrawingToolbar
		 * @deprecated
		 */
		STX.DrawingToolbar.crosshairs=function(stx, state, div){
			var self=STX.DrawingToolbar.findInstance(div);
			self.stx=stx;
			self.crosshairs(state);

		};
		
		/**
		 * Turns crosshairs on or off. Note that crosshairs can be turned on or off
		 * anytime by simply setting stx.layout.crosshair to true or false.
		 * @param  {boolean} state True if the crosshairs should be on, otherwise false
		 * @param  {HTMLElement} div The HTMLElement comtaining the toolbar
		 * @memberOf STX.DrawingToolbar
		 */
		STX.DrawingToolbar.setCrosshairs=function(state, div){
			var self=STX.DrawingToolbar.findInstance(div);
			self.crosshairs(state);
		};

		/* Enumerated types for time units */
		STX.MILLISECOND=1;
		STX.SECOND=1000;
		STX.MINUTE=60*STX.SECOND;
		STX.HOUR=60*STX.MINUTE;
		STX.DAY=24*STX.HOUR;
		STX.WEEK=7*STX.DAY;
		STX.MONTH=31*STX.DAY;
		STX.YEAR=365*STX.DAY;
		STX.DECADE=10*STX.YEAR;

		STXChart.version=["Version 2016-07-16_10"];

		STXChart.drawingLine=false; // Toggles to true when a drawing is initiated
		STXChart.resizingPanel=null; // Toggles to true when a panel is being resized
		STXChart.vectorType="";		// @deprecated The type of drawing currently enabled "segment", "line", "ray", etc. See sample.html menu
		STXChart.crosshairX=0;	// Current X screen coordinate of the crosshair
		STXChart.crosshairY=0;
		STXChart.insideChart=false;	// Toggles to true whenever the mouse cursor is within the chart (canvas)
		STXChart.overXAxis=false;	// Toggles to true if the mouse cursor is over the X Axis.
		STXChart.overYAxis=false;	// Toggles to true if the mouse cursor is over the Y Axis.
		STXChart.currentColor="auto";	// @deprecated Currently selected color for drawing tools. This may be changed by developing a menu with a color picker.
		STXChart.drawingTools={};
		STXChart.useAnimation=!STX.is_chrome;		// Animation API is on by default, except for Chrome which turns out to be faster without it
		STXChart.ipadMaxTicks=1500;		// performance limitation as of IOS7
		STXChart.enableCaching=false;
		STXChart.ignoreTouch=false;		// set this true to override the touch commands in the kernel (such as when manipulating DOM elements on screen)
		STXChart.useOldAndroidClear=true;	// Turn this off to boost native android browser performance, but at risk of "double candle" display errors on some devices
		/**
		 * Each STXChart object will clone a copy of this object template and use it to store the settings for the active drawing tool.
		 * The default settings can be found in `stx.js`, and they can be changed by overriding these defaults on your own files.
		 * See {@tutorial Custom Drawing Menu and Colors} for details on how to use this template to replace the standard drawing toolbar.
		 * <br>This object can be extended to support additional drawing tools (for instance note the extensive customization capabilities for fibonacci)
		 * @type {Object}
		 * @memberOf  STXChart
		 */
		STXChart.currentVectorParameters={
				/**
				 *  Drawing to activate.
			     * <br>See 'Classes' in {@link STX.Drawing} for available drawings.
			     * Use {@link STXChart#changeVectorType} to activate.
			     * @type string
			     * @alias currentVectorParameters.vectorType
			     * @memberof STXChart
			     */
				vectorType: null,
				/**
				 *  Line pattern.
				 * <br><B>Valid values for pattern: solid,dotted,dashed,none</B>
				 * <br>Not all parameters/values are valid on all drawings. See the specific `recontruct` method for your desired drawing for more details(Example: {@link STX.Drawing.horizontal#reconstruct})
			     * @type string
			     * @default
			     * @alias currentVectorParameters.pattern
			     * @memberof STXChart
			     */
				pattern:"solid",
				/**
				 *  Line width
				 * <br>Not all parameters/values are valid on all drawings. See the specific `recontruct` method for your desired drawing for more details(Example: {@link STX.Drawing.horizontal#reconstruct})
			     * @type number
			     * @default
			     * @alias currentVectorParameters.lineWidth
			     * @memberof   STXChart
			     */
				lineWidth:1,
				/**
				 *  Fill color.
				 * <br>Not all parameters/values are valid on all drawings. See the specific `recontruct` method for your desired drawing for more details(Example: {@link STX.Drawing.horizontal#reconstruct})
			     * @type string
			     * @default
			     * @alias currentVectorParameters.fillColor
			     * @memberof   STXChart
			     */
				fillColor:"#7DA6F5",
				/**
				 * Line color.
				 * <br>Not all parameters/values are valid on all drawings. See the specific `recontruct` method for your desired drawing for more details(Example: {@link STX.Drawing.horizontal#reconstruct})
			     * @type string
			     * @default
			     * @alias currentVectorParameters.currentColor
			     * @memberof   STXChart
			     */
				currentColor: "auto",
				/**
				 * Axis Label.
				 * Set to 'true' to display a label on the x axis.
				 * <br>Not all parameters/values are valid on all drawings. See the specific `recontruct` method for your desired drawing for more details(Example: {@link STX.Drawing.horizontal#reconstruct})
			     * @type string
			     * @default
			     * @alias currentVectorParameters.axisLabel
			     * @memberof   STXChart
			     */
				axisLabel:true,
				/**
				 * Fibonacci settings.
				 * See {@link STX.Drawing.fibonacci.#reconstruct} `parameters` object for valid options
			     * @type object
			     * @alias currentVectorParameters.fibonacci
			     * @memberof   STXChart
			     * @example
					fibonacci:{
						trend:{color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
						fibs:[
						      {level:-0.618, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
						      {level:-0.382, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
						      {level:0, color:"auto", parameters:{pattern:"solid", lineWidth:1}},
						      {level:0.382, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
						      {level:0.618, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
						      {level:0.5, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
						      {level:1, color:"auto", parameters:{pattern:"solid", lineWidth:1}},
						      {level:1.382, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
						      {level:1.618, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}}
						      ],
						extendLeft: false,
						printLevels: true,
						printValues: false,
						timezone:{color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}}
					}
			     */
				fibonacci:{
					trend:{color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
					fibs:[
					      {level:-0.618, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
					      {level:-0.382, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
					      {level:0, color:"auto", parameters:{pattern:"solid", lineWidth:1}},
					      {level:0.382, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
					      {level:0.618, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
					      {level:0.5, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
					      {level:1, color:"auto", parameters:{pattern:"solid", lineWidth:1}},
					      {level:1.382, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}},
					      {level:1.618, color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}}
					      ],
					extendLeft: false,
					printLevels: true,
					printValues: false,
					timezone:{color:"auto", parameters:{pattern:"solid", opacity:0.25, lineWidth:1}}
				},
				/**
				 * Annotation settings.
			     * @type object
			     * @alias currentVectorParameters.annotation
			     * @memberof   STXChart
			     * @example
					annotation:{
						font:{
							style:null,
							size:null,	// override .stx_annotation default
							weight:null, // override .stx_annotation default
							family:null // override .stx_annotation default
						}
					}
			     */
				annotation:{
					font:{
						style:null,
						size:null,	// override .stx_annotation default
						weight:null, // override .stx_annotation default
						family:null // override .stx_annotation default
					}
				}
		};

		STXChart.defaultDisplayTimeZone=null;	// If set, then new STXChart objects will pull their display timezone from this

		if(typeof $$=="undefined"){	// Bypass $$ when running under node.js
			window.$$=function(node){
				return{};
			};
		}

		/**
		 * Defines an object used for rendering a chart.
		 * Chart objects contain the data and config for each chart but they don't actually exist on the screen until a panel is attached.
		 * A chart object is attached to both the main chart panel and any related study panels so they can share the same chart data.
		 *
		 * Example: stxx.panels['chart'].chart
		 *
		 * Example: stxx.chart (convenience shortcut for accessing the main chart object - same as above)
		 *
		 * Example stxx.panels['Aroon (14)'].chart
		 *
		 * @constructor
		 * @name  STXChart.Chart
		 */
		STXChart.Chart=function(){
			this.xAxis=new STXChart.XAxis();
			this.yAxis=new STXChart.YAxis();
			this.symbolObject={symbol : null};
			this.series={};
			this.seriesRenderers={};
			this.xaxis=[];
		};

		/**
		 * set this to true to turn off auto-scrolling when fresh data comes in. By default, the chart will scroll backward
		 * whenever a new bar comes in, so as to maintain the chart's forward position on the screen. If lockScroll is
		 * true then fresh bars with advance the chart forward (and eventually off the right edge of the screen)
		 *
		 * Note that setSpan({base:"today"}) will set an internal variable that accomplishes the same thing. This is a unique case.
		 * @type {Boolean}
		 * @default
		 * @memberOf  STXChart.Chart
		 * @since 05-2016-10
		 */
		STXChart.Chart.prototype.lockScroll = false;

		/**
		 * Defines an object used for rendering the Y-axis on a panel.
		 * Each panel object will include a YAxis object, which can be adjusted immediately after declaring your `new STXChart();`
		 * Any adjustments to the Y-axis members after it has been rendered and will require a draw() call to apply the changes ( initializeChart() may be required as well depending on the setting being changed).
		 *
		 * See {@tutorial Gridlines and  axis labels}, {@link STXChart.AdvancedInjectable#createYAxis} and {@link STXChart.AdvancedInjectable#drawYAxis} for additional customization instructions.
		 *
		 * Example: stxx.panels['chart'].yAxis
		 *
		 * Example: stxx.chart.panel.yAxis (convenience shortcut for accessing the main panel object - same as above)
		 *
		 * Example: stxx.panels['Aroon (14)'].yAxis
		 *
		 * @constructor
		 * @name  STXChart.YAxis
		 * @example
		 * // here is an example on how to override the default top and bottom margins after the inital axis has already been rendered
		 * stxx.newChart(symbol, yourData, null, function () {    // call new chart to render your data
         *    	// callback - your code to be executed after the chart is loaded
		 * 		stxx.chart.yAxis.initialMarginTop=50;
		 * 		stxx.chart.yAxis.initialMarginBottom=50;
		 * 		stxx.calculateYAxisMargins(stxx.chart.panel.yAxis); // must recalculate the margins after they are changed.
		 * 		stxx.draw();
		 * });
		 * @example
		 * // here is an example on how to override the default top and bottom margins before the inital axis has been rendered
		 * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		 * stx.setPeriodicityV2(1, 1);  			// set your default periodicity to match your data. In this case one minute.
		 * stx.chart.yAxis.initialMarginTop=50;		// set default margins so they do not bump on to the legend
		 * stx.chart.yAxis.initialMarginBottom=50;
		 * stx.newChart("SPY", yourData);
		 * @example
		 * // here is an example on how to turn off the last price label (main chart panel) before the inital axis has already been rendered
		 * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		 * stxx.chart.panel.yAxis.drawCurrentPriceLabel=false;
		 */
		STXChart.YAxis=function(){};

		/**
		 * Defines an object used for rendering the X-axis on the chart, which can be adjusted immediately after declaring your `new STXChart();`
		 * The STXChart.XAxis object is part of the STXChart.Chart object and is used on the main charts only. There is only one x axis per chart container.
		 *
		 * Colors and fonts for the x axis can be controlled by manipulating the CSS.
		 * You can override the `stx_xaxis` class in `stx-chart.css` to change the font.
		 * If you also want to control the color, you will need to override the defaults  for `.Light .stx_xaxis` and `.Dark .stx_xaxis` styles found in `stx-standard.css`
		 *
		 * For full customization instructions see:
		 * - {@tutorial Custom X-axis}
		 * - {@link STXChart.AdvancedInjectable#createXAxis}
		 * - {@link STXChart#createTickXAxisWithDates}
		 *
		 * Example: stxx.chart.xAxis
		 *
		 * @constructor
		 * @name  STXChart.XAxis
		 * @example
		 * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		 * stxx.chart.xAxis.axisType="numeric";
		 */
		STXChart.XAxis=function(){
		};

		/**
		 * Defines a Panel object.
		 * Every chart or study is rendered in a panel.
		 *
		 * Example: stxx.panels['chart']
		 *
		 * Example: stxx.panels['Aroon (14)']

		 * @param {string} name The name of the panel.
		 * @param {STXChart.YAxis} [yAxis] Pass an optional {@link STXChart.YAxis} object
		 * @constructor
		 * @name  STXChart.Panel
		 */
		STXChart.Panel=function(name, yAxis){
			if(yAxis) this.yAxis=yAxis;
			else this.yAxis=new STXChart.YAxis();
			this.name=name;
		};

		STXChart.YAxis.prototype={
			high: null,									// High value on y axis (read only)
			low: null,									// Low value on y axis (read only)
			shadow: null,								// high - low (read only)
			logHigh: null,								// High log value on y axis (read only)
			logLow: null,								// Low log value on y axis (read only)
			logShadow: null,							// logHigh - logLow (read only)
			multiplier: null,							// Computed automatically. Divide pixel by this to get the price (then add to low). Or multiply price by this to get the pixel (then add to top)
			bottom: null,								// calculated automatically (panel.bottom-yAxis.bottomOffset)
			top: null,									// calculated automatically (panel.top+yAxis.topOffset;)
			height: null,								// bottom - top
			left: null,									// calculated left position on canvas to begin drawing.
			width: null,								// calculated width of y axis
		};

		/**
		 * maximum decimal places to ever display on a price label. Leave null and the chart will compute based on the number of decimal places in the actual data.
		 * Generally you want to leave this alone, in order to display the full actual current value of the security. But if you're running out of space
		 * on the y-axis, or you have a very tightly controlled configuration, you can lower this value.
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.maxDecimalPlaces = 5;

		/**
		 * Optionally hard set the high (top value) of the yAxis (for instance when plotting 0 - 100% charts)
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.max = null;

		/**
		 * Optionally hard set the low (bottom value) of the yAxis (for instance when plotting 0 - 100% charts)
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.min = null;

		/**
		 * 0-4 or leave null and the chart will choose automatically. Note that this only affects the number of decimal places on the axis marks, not on the
		 * axis price labels (current price, indicators). See {@link STXChart.YAxis#maxDecimalPlaces} for controlling decimal places on price labels.
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.decimalPlaces= null;

		/**
		 * ideal size between y-axis values in pixels. Leave null to automatically calculate.
		 * See {@tutorial Gridlines and  axis labels} for additional details.
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.idealTickSizePixels= null;

		/**
		 * Set to specify that the y-axis vertical grid be drawn with specific intervals between ticks.
		 * This amount will be overridden if it will result  in y axis crowding.
		 * In which chase, multiples of the original interval will be used.
		 * For example, if `.25` is selected, and that will cause labels to be on top of or too close to each other, `.50` may be used.
		 * Crowding is prevented by allowing for a minimum of space equating the y-axis font height between labels.
		 *
		 * **This parameter is also used in the 'Trade From Chart' (TFC) module**. If set, it will force the widget to skip certain price values and instead 'snap' to your desired intervals. This will guarantee that an order is only placed at the allowed price intervals for the security in question.
		 *
		 * **Note that this flag is not compatible with {@link STXChart.YAxis#pretty}.**
		 *
		 * Visual Reference:<br>
		 * ![yAxis.minimumPriceTick](yAxis.minimumPriceTick.png "yAxis.minimumPriceTick")
		 *
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @example
		 * // Declare a STXChart object. This is the main object for drawing charts
		 * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		 * // set interval between ticks
		 * stxx.chart.yAxis.minimumPriceTick=.50;
		 */
		STXChart.YAxis.prototype.minimumPriceTick= null;

		/**
		 * Set to specify that the y-axis vertical grid be drawn with fractional intervals.
		 * This is checked in {@link STXChart.AdvancedInjectable#drawYAxis} and if it is not null,
		 * and there is no existing yAxis.priceFormatter, one is created to specially format the y-axis ticks.
		 *
		 * @type {Object}
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @example
		 * // Declare a STXChart object. This is the main object for drawing charts
		 * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		 * // set axis to display in 1/32nds; for example, 100 5/32 will display as 100'05.  If there is a price midway between
		 * // two ticks (for example, 11/64), a plus (+) will follow the price; for example 100 11/64 will display as 100'11+.
		 * stxx.chart.yAxis.fractional={
				formatter: "'",				// This is the character used to separate he whole number portion from the numerator (' default)
				resolution: 1/32			// Set to smallest increment for the quoted amounts
		 */
		STXChart.YAxis.prototype.fractional= null;

		/**
		 * set to true to draw a line left of the y-axis and tick marks
		 * @type {boolean}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.displayBorder= true;

		/**
		 * set to false to hide grid lines. See {@tutorial Gridlines and  axis labels} for additional details.
		 * @type {boolean}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.displayGridLines= true;

		/**
		 * set to true to hide the yaxis
		 * @type {boolean}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.noDraw= null;

		/**
		 * set to false to hide the current price label <b>in the main panel's y-axis<b>.
		 *
		 * Visual Reference:<br>
		 * ![yAxis.drawCurrentPriceLabel](drawCurrentPriceLabel.png "yAxis.drawCurrentPriceLabel")
		 * @type {Boolean}
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @since  04-2015
		 */
		STXChart.YAxis.prototype.drawCurrentPriceLabel=true;

		/**
		 * Set to false to hide **all** price labels on the particular y axis.
		 * <br>See {@link STXChart.YAxis#drawCurrentPriceLabel} to disable just the current price label on the main chart panel.
		 * <br>See [STXChart.preferences.labels]{@link STXChart#preferences}  to disable just the last value label on studies.
		 * @type {Boolean}
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @since  04-2015
		 */
		STXChart.YAxis.prototype.drawPriceLabels=true;


		/**
		 * Set to either "roundRectArrow", "semiRoundRect", "roundRect","tickedRect","rect","noop".
		 * It will default to {@link STXChartyaxisLabelStyle}
		 * This could be set independently on each panel if desired.
		 * @type string
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @since  04-2015
		 * @example
		 * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		 * stxx.chart.yAxis.yaxisLabelStyle="rect"
		 */
		STXChart.YAxis.prototype.yaxisLabelStyle=null;

		/**
		 * Set to true to right justify the yaxis (use with STXChart.yaxisPaddingRight)
		 * @type Boolean
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @since  15-07-01
		 */
		STXChart.YAxis.prototype.justifyRight=null;

		/**
		 * Set to true to put a rectangle behind the yaxis text (use with STXChart.yaxisPaddingRight)
		 * @type Boolean
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @since  15-07-01
		 */
		STXChart.YAxis.prototype.textBackground=false;

		/**
		 * Optional function used to override default formatting of Y-axis values, including the floating HUD value of the crosshair.
		 *
		 * Expected format :
		 *
		 * 		function(stx, panel, price, decimalPlaces)
		 *
		 * Parameters:
		 *
		 * 		{STXChart} stx			- The chart object
		 *		{STXChart.Panel} panel	- The panel
		 *		{number} price			- The price to format
		 *		{number} decimalPlaces	- The number of decimal places to use
		 *
		 * Returns:
		 *
		 *		{text} Formated text label for the price
		 *
		 * @type {function}
		 * @example
		 * stxx.chart.panel.yAxis.priceFormatter=function(stx, panel, price){
		 * 	var convertedPrice;
		 * 	// add our logic here to convert 'price' to 'convertedPrice'
		 *   	return convertedPrice; // string
		 * }
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.priceFormatter= null;

		/**
		 * Sets the y-axis bottom on any panel.  Rendering will start this number of pixels above the panel's bottom
		 *
		 * Visual Reference:<br>
		 * ![yAxis.width](yAxis.bottomOffset.png "yAxis.bottomOffset")
		 * ![yAxis.width](yAxis.bottomTopOffset.png "yAxis.bottomTopOffset")
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.bottomOffset= 0;

		/**
		 * Sets y-axis top on Study panels, Rendering will start this number of pixels below the panel's top
		 *
		 * Visual Reference:<br>
		 * ![yAxis.width](yAxis.bottomTopOffset.png "yAxis.bottomTopOffset")
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.topOffset= 0;

		/**
		 * Set this to automatically compress and offset the y-axis so that this many pixels of white space is above the display.
		 * Note that {@link STXChart#calculateYAxisMargins} will need to be called to immediately activate this setting after the axis has already been drawn.
		 *
		 * Visual Reference:<br>
		 * ![yAxis.width](yAxis.initialMarginTop.png "yAxis.initialMarginTop")
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @example
		 * // here is an example on how to override the default top and bottom margins **before** the inital axis has been rendered
		 * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		 * stxx.setPeriodicityV2(1, 1);  				// set your default periodicity to match your data. In this case one minute.
		 * stxx.chart.yAxis.initialMarginTop=50;		// set default margins so they do not bump on to the legend
		 * stxx.chart.yAxis.initialMarginBottom=50;
		 * stxx.newChart("SPY", yourData);
		 * @example
		 * // here is an example on how to override the default top and bottom margins **after** the inital axis has already been rendered
		 * stxx.newChart(symbol, yourData, null, function () {    // call new chart to render your data
         *    	// callback - your code to be executed after the chart is loaded
		 * 		stxx.chart.yAxis.initialMarginTop=50;
		 * 		stxx.chart.yAxis.initialMarginBottom=50;
		 * 		stxx.calculateYAxisMargins(stxx.chart.panel.yAxis); // !!!! must recalculate the margins after they are changed. !!!!
		 * 		stxx.draw();
		 * });

		 */
		STXChart.YAxis.prototype.initialMarginTop= 10;

		/**
		 * set this to automatically compress and offset the y-axis to that this many pixels of white space is below the display
		 * Note that {@link STXChart#calculateYAxisMargins} will need to be called to immediately activate this setting after the axis has already been drawn.
		 *
		 * Visual Reference:<br>
		 * ![yAxis.width](yAxis.initialMarginTop.png "yAxis.initialMarginTop")
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @example
		 * // here is an example on how to override the default top and bottom margins **before** the inital axis has been rendered
		 * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		 * stxx.setPeriodicityV2(1, 1);  				// set your default periodicity to match your data. In this case one minute.
		 * stxx.chart.yAxis.initialMarginTop=50;		// set default margins so they do not bump on to the legend
		 * stxx.chart.yAxis.initialMarginBottom=50;
		 * stxx.newChart("SPY", yourData);
		 * @example
		 * // here is an example on how to override the default top and bottom margins **after** the inital axis has already been rendered
		 * stxx.newChart(symbol, yourData, null, function () {    // call new chart to render your data
         *    	// callback - your code to be executed after the chart is loaded
		 * 		stxx.chart.yAxis.initialMarginTop=50;
		 * 		stxx.chart.yAxis.initialMarginBottom=50;
		 * 		stxx.calculateYAxisMargins(stxx.chart.panel.yAxis); // !!!! must recalculate the margins after they are changed. !!!!
		 * 		stxx.draw();
		 * });
		 *
		 *
		 */
		STXChart.YAxis.prototype.initialMarginBottom= 10;

		/**
		 * Set this to the number of pixels to zoomed in or out, positive or negative.
		 * This is defined as the number of pixels to add or subtract from both top and bottom of panel for calculations.
		 *
		 * Please note that the zoom level will be reset as determined by {@link STXChart.YAxis#initialMarginTop} and
		 * {@link STXChart.YAxis#initialMarginBottom} when a {@link STXChart#newChart} is rendered, the {@link STXChart#home} button is pressed, or when {@link STXChart.AdvancedInjectable#touchDoubleClick} is activated on a touch device.
		 *
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.zoom= 0;

		/**
		 * set this to the number of pixels to offset the y-axis, positive or negative.
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.scroll= 0;

		/**
		 * The width in pixels.
		 *
		 * Visual Reference:<br>
		 * ![yAxis.width](yAxis.width.png "yAxis.width")
		 * @type {Number}
		 * @default
		 * @memberOf  STXChart.YAxis
		 */
		STXChart.YAxis.prototype.width = 50;

		/**
		 * Override the default stx_yaxis style for text by setting this to the desired CSS style. This would typically be used to set a secondary axis to a particular color.
		 * @type {string}
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @since  15-07-01
		 */
		STXChart.YAxis.prototype.textStyle = null;

		/**
		 * Set to "left" for the yaxis to draw on the left side of the screen. The main chart axis will default to "right". The main
		 * access for any study panel will follow the main chart axis as long as this is set to null. Note that this only applies to chart panels.
		 * @type {string}
		 * @default
		 * @memberOf  STXChart.YAxis
		 * @since  15-07-01
		 */
		STXChart.YAxis.prototype.position = null;

		/**
		 * Default setting for the array that determines how many decimal places to print based on the size of the shadow (the difference between chart high and chart low).
		 * The array consists of tuples in descending order. If the shadow is less than n1 then n2 decimal places will be printed.
		 * See {@link STXChart.YAxis#shadowBreaks}
		 * @type {Array}
		 * @memberOf  STXChart.YAxis
		 * @since  2015-11-1
		 * @default
		 */
		STXChart.YAxis.defaultShadowBreaks=[[1000,2],[1,4]];

		/**
		 * Alternative setting (for small charts)  array that determines how many decimal places to print based on the size of the shadow (the difference between chart high and chart low).
		 * The array consists of tuples in descending order. If the shadow is less than n1 then n2 decimal places will be printed.
		 * See {@link STXChart.YAxis#shadowBreaks}
		 * @type {Array}
		 * @memberOf  STXChart.YAxis
		 * @since  2015-11-1
		 * @default
		 */
		STXChart.YAxis.smallChartShadowBreaks=[[10,2],[1,4]];

		/**
		 * If true then uses the "pretty" algorithm instead of the "best fit" algorithm. The pretty algorithm
		 * uses the values specified in {@link STXChart.YAxis#increments} to set axis label locations.
		 *
		 * **Note that this algorithm is not compatible with {@link STXChart.YAxis#minimumPriceTick}.**
		 *
		 * @memberOf STXChart.YAxis
		 * @since 2015-11-1
		 * @type {Boolean}
		 * @default
		 */
		STXChart.YAxis.prototype.pretty=true;

		/**
		 * Values used by the {@link STXChart.YAxis#pretty} algorithm to set axis label locations.
		 * @memberOf STXChart.YAxis
		 * @since 2015-11-1
		 * @type {Array}
		 * @default
		 */
		STXChart.YAxis.prototype.increments=[1,2.5,5];

		/**
		 * If true then uses an additional step in the "pretty" algorithm for the log
		 * scale. This allows the algorithm to lower the grid to fill large visual gaps.
		 * The "increments" are not fully respected by this approach.
		 *
		 * Only applicable when using *both* pretty mode and semiLog.
		 * @memberof STXChart.YAxis
		 * @since 2016-03-11
		 * @type {Boolean}
		 * @default
		 */
		STXChart.YAxis.prototype.prettySemiLog=true;

		/**
		 * An array that determines how many decimal places to print based on the size of the shadow (the difference between chart high and chart low).
		 * The array consists of tuples in descending order. If the shadow is less than n1 then n2 decimal places will be printed.
		 * See {@link STXChart.YAxis.defaultShadowBreaks} and {@link STXChart.YAxis.smallChartShadowBreaks} for default settings.
		 * @type {Array}
		 * @memberOf  STXChart.YAxis
		 * @since  2015-11-1
		 */
		STXChart.YAxis.prototype.shadowBreaks=STXChart.YAxis.defaultShadowBreaks;

		STXChart.Panel.prototype={
				name: null,								// Name of panel
				display: null,							// Display text of panel
				chart: null,							// The chart from which this panel derives its data
				yAxis: null,							// Y axis object for this panel, this is the same object as chart.yAxis on chart panels
				shareChartXAxis: null,					// Set to false to indicate panel does not share x axis with its chart
				top: null,								// Y location of top of chart
				bottom: null,							// Y location of bottom of chart
				height: null,							// height of chart in pixels
				percent: null							// percent of overall window this panel takes up
		};

		STXChart.XAxis.prototype={
		    /**
		     * Optional function to format dates on x-axis. If defined, will be used to completely control x-axis formatting, including the floating HUD date of the crosshair .
		     * This is only for actual date or time formats, not boundaries, months, years.
		     *
			 * Expected format :
			 *
			 * 		function(labelDate, gridType, timeUnit, timeUnitMultiplier)
			 *
			 * Parameters:
			 *
			 * 		{Date} labelDate			- date to format in epoch (=new Date()) format
			 * 		{String} gridType			- "boundary" or "line"
			 * 		{Enumerated type} timeUnit	- STX.MILLISECOND, STX.SECOND, STX.MINUTE, STX.HOUR, STX.DAY, STX.MONTH, STX.YEAR, STX.DECADE
			 * 		{Number} timeUnitMultiplier	- how many timeUnits
			 *
			 * Returns:
			 *
			 * 		{text} Formated text label for the particular date passed in
			 *
		     * @type function
		     * @default
		     * @memberof   STXChart.XAxis#
		     * @example
		     * stxx.chart.xAxis.formatter = function(labelDate, gridType, timeUnit, timeUnitMultiplier){
		     * 		//your code here to format your string
		     * 		return "formated string"
		     * }

			 */
			formatter: null,
		    /**
		     * If true, the user selected (default browser if none selected) timezone will be used on the x axis. 
		     * If not set to true, the data timezone will be used even if a user timezone was set.
		     * @type boolean
		     * @default
		     * @memberof   STXChart.XAxis#
		     */
			adjustTimeZone: true,
		    /**
		     * Ideal space between x-axis labels in pixels.
		     * If null then the chart will attempt a tick size and time unit in proportion to the chart.
		     * Please note that if `stxx.chart.yAxis.goldenRatioYAxis` is set to `true`, this setting will also affect the spacing between y-axis labels.
		     * Please note that this setting will be overwritten at rendering time if too small to prevent labels from covering each other.
		     * Not applicable if {@link STXChart.XAxis#timeUnit} is manually set. 
		     * See {@tutorial Custom X-axis} for additional details.
		     * @type number
		     * @default
		     * @memberof   STXChart.XAxis#
		     */
			idealTickSizePixels: null,
		    /**
		     * Overrides default used in {@link STXChart#createTickXAxisWithDates}
		     * <br>Allowable values:
		     * - STX.MILLISECOND,
		     * - STX.SECOND
		     * - STX.MINUTE
		     * - STX.HOUR
		     * - STX.DAY
		     * - STX.WEEK
		     * - STX.MONTH
		     * - STX.YEAR
		     * - STX.DECADE
		     *
		     * Visual Reference for sample code below ( draw a label every 5 seconds) :<br>
		     * ![xAxis.timeUnit](xAxis.timeUnit.png "xAxis.timeUnit")
		     * @type number
		     * @default
		     * @memberof   STXChart.XAxis#
		     * @example
		     * // The following will cause the default implementation of createTickXAxisWithDates to print labels in seconds every 5 seconds.
		     * // masterData is in 1 second intervals for this particular example.
             * stxx.chart.xAxis.axisType='ntb';
             * stxx.chart.xAxis.futureTicksInterval=1/60; // 1 second grouping
             * stxx.chart.xAxis.timeUnit = STX.SECOND;
             * stxx.chart.xAxis.timeUnitMultiplier = 5; // 5 units (e.g. seconds) grid line
		     */
			timeUnit: null,
		    /**
		     * Overrides default used in {@link STXChart#createTickXAxisWithDates}
		     * @type number
		     * @default
		     * @memberof   STXChart.XAxis#
		     * @example
		     * // The following will cause the default implementation of createTickXAxisWithDates to print labels in seconds every 5 seconds.
		     * // masterData is in 1 second intervals for this particular example.
             * stxx.chart.xAxis.axisType='ntb';
             * stxx.chart.xAxis.futureTicksInterval=1/60; // 1 second grouping
             * stxx.chart.xAxis.timeUnit = STX.SECOND;
             * stxx.chart.xAxis.timeUnitMultiplier = 5; // 5 units (e.g. seconds) grid line
		     */
			timeUnitMultiplier: null,
		    /**
		     * Set to "ntb" for non time based rendering of the x-axis. See See {@link STXChart#createTickXAxisWithDates}
		     *
		     * Set to "numeric" to render an x axis based on the "index" field instead of "Date" field to determine the label. See {@link STXChart#createNumericXAxis}
		     *
		     * If not set, it will default to "ntb".
		     *
		     * @type string
		     * @default
		     * @memberof   STXChart.XAxis#
		     */
			axisType: null,
		    /**
		     * Set to true to draw a line above the x-axis.
		     * @type boolean
		     * @default
		     * @memberof   STXChart.XAxis#
		     */
			displayBorder: true,
		    /**
		     * Set to false to suppress grid lines
		     * @type boolean
		     * @default
		     * @memberof   STXChart.XAxis#
		     */
			displayGridLines: true,
		    /**
		     * Minimum size for label. This ensures adequate padding so that labels don't collide with one another.
		     * Please note that this setting is used during the rendering process, not during the label spacing calculation process and will be overwritten if too small to prevent labels from covering each other.
		     * To modify at what interval labels will be placed, please see {@tutorial Custom X-axis} for more details
		     * @type number
		     * @default
		     * @memberof   STXChart.XAxis#
		     */
			minimumLabelWidth: 50,
		    /**
		     * Set to false to hide axis markings in the future.
		     * @type boolean
		     * @default
		     * @memberof   STXChart.XAxis#
		     */
			futureTicks: true,
		    /**
		     * Set to the number of minutes ticks will move by when iterating in "tick" interval.
		     * <P>
		     * Since 'tick' is not a time based display, there is no way to predict what the time between ticks will be.
		     * Ticks can come a second later, a minute later or even more depending on how active a particular instrument may be.
		     * As such, if iterating trough the market day in 'tick' periodicity, the library uses a pre-defined number of minutes to move around.
		     * This will be primarily used when deciding where to put x axis labels when going into the future in 'tick' mode.
		     *
		     * @type number
		     * @default
		     * @memberof   STXChart.XAxis#
		     * @example
		     * //You can override this behavior as follows:
			 * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
			 * stxx.chart.xAxis.futureTicksInterval=1; // to set to 1 minute, for example
		     */
			futureTicksInterval: 10
		};

		STXChart.Chart.prototype={
				symbol: null,							// This will be set to the current symbol
				symbolObject : {symbol: null },			// This will be set  to the current symbol and optionally include any other elements included in the object ( needed to represent the symbol or make additional data fetches). Initialized by newChart()
			    /**
			     * Set this to presnet an alternate name for the symbol on the chart label and comparison legend.
			     * Set `stxx.chart.symbolDisplay='yourName'; ` right before calling newChart();
			     * @type string
			     * @default
			     * @memberof   STXChart.Chart#
			     */
				symbolDisplay: null,
			    series: {}, 							// Series that are drawn on chart, or for comparison. A series may have a different y-axis calculation than the price chart.
			    seriesRenderers: {}, 					// Graphs that are drawn on chart.
			    /**
			     * Current number of ticks scrolled in from the end of the chart.
			     * Setting to zero would theoretically cause the chart to be scrolled completely to the left showing an empty canvas.
			     * Setting to 10 would display the last 10 candles on the chart.
			     * Setting to `maxTicks` would display a full screen on the chart (assuming enough data is available).
			     * @type number
			     * @default
			     * @memberof   STXChart.Chart#
			     */
				scroll: 0,
				standStill: 0,							// Used internally
				maxTicks: 0,							// Horizontal number of chart ticks that currently fit in the canvas, based on candlewidth and spacing. This is generally one greater than the actual size of the canvas due to candle clipping.
			    /**
			     * The master data for this chart. This data is never modified by the chart engine itself and should not be altered directly. Use {@link STXChart#setMasterData} , {@link STXChart#appendMasterData}, or {@link STXChart#streamTrade} to manipulate this object. See {@tutorial Data Loading} for details.
			     * @type object 
			     * @memberof   STXChart.Chart#
			     */
				masterData: null,			
			    /**
			     * Contains the current complete data set created by {@link STXChart#createDataSet}, adjusted for periodicity and with calculated studies. See {@tutorial Data Loading} for details.
			     * @type object 
			     * @memberof   STXChart.Chart#
			     */
				dataSet: null,						
				scrubbed: null,							// Contains the data set, scrubbed for null entries (gap dates) (if this.dataSetContainsGaps is set to true)
			    /**
			     * Contains the segment of the data set that is displayed on the screen (view-window). See {@tutorial Data Loading} for details.
			     * @type object 
			     * @memberof   STXChart.Chart#
			     */
				dataSegment: null,				
				/**
				 * Parameters used to control the baseline in baseline_delta charts
				 * @type object
				 */
			    baseline:{
					/**
					 * includeInDataSegment - If set to true, forces a line chart (usually a baseline chart) to begin inside the chart,
				     *                        whereas normally the first point in a line chart is off the left edge of the screen.
				     * @type boolean
				     * @default
				     * @alias baseline.includeInDataSegment
				     * @memberof!   STXChart.Chart#
					 */
			    	includeInDataSegment: false,
				    /**
				     * defaultLevel - If set to a value, overrides the default behavior of baseline chart
				     *                which is to set baseline to leftmost point visible on the chart.
				     * @type number
				     * @default
				     * @alias baseline.defaultLevel
				     * @memberof!   STXChart.Chart#
				     */
			    	defaultLevel: null,
				    /**
				     * userLevel - Value of the user-set baseline level.  To prevent user from adjusting the baseline,
				     *             set this property to false.
				     * @type boolean/number
				     * @default
				     * @alias baseline.userLevel
				     * @memberof!   STXChart.Chart#
				     */
			    	userLevel: null,
				    /**
				     * actualLevel - This is computed automatically.  Do not set.
				     * @type number
				     * @default
				     * @memberof   STXChart.Chart#
				     */
					actualLevel: null
			    },
				xAxis: null,							// x Axis for the chart
			    xaxis:[],								// Contains data entries for the full xaxis. It is a superset of dataSegment
			    /**
			     * Determines at which zoom level interior axis points are displayed. Value in pixels.
			     * @type number
			     * @default
			     * @memberof   STXChart.Chart#
			     */
				xaxisFactor: 30,
				decimalPlaces: 2,						// Maximum number of decimal places in data set. Computed automatically by calculateTradingDecimalPlaces
				roundit: 100,							// Computed automatically to round y-axis display
			    /**
			     * Function used to render the Legend when multiple series are being displayed on the main chart panel.
			     * Update your prototype or a specific chart instance, if you want to use a different rendering method for legend.
			     * See {@link STX.drawLegend} for details and function signature.
			     * <P>
			     * Defaults to {@link STX.drawLegend}
			     * @type function
			     * @default
			     * @memberof   STXChart.Chart#
			     * @example stxx.chart.legendRenderer = yourFunction; // must follow the function signature of drawLegend(stx, params);
			     * @since 07/01/2015
			     */
				legendRenderer: STX.drawLegend,
			    /**
			     * This function will be called on certain chart types, before rendering each tick in the dataSegment, to determine the proper color to use on each bar, candle or line segment.
			     * Mainly used to setting colors for 'up' vs. 'down' ticks.
				 * For use with 'colored_bar', 'colored_line', "colored_mountain", 'candle', 'hollow_candle' and 'volume_candle' chart only.
				 *
				 * Expected format :
				 *
				 * 		function(stx, quote, mode)
				 *
				 * Parameters:
				 *
				 *		{object} stx	- A chart object
				 *		(object} quote	- A properly formated OHLC object.
				 *		{string} mode	- Applicable on 'candle', 'hollow_candle' and 'volume_candle' charts only. Allowed values: "shadow", "outline", and "solid".
				 *							`shadow`- indicates the function is asking for the candle wick color
				 *							`outline` indicates the function is asking for the candle border color
				 *							`solid` indicates the function is asking for the candle fill color
				 *										(Inside of candle. Not applicable on 'hollow_candle' or 'volume_candle')
				 *
				 * Returns:
				 *
				 *		{string/object} Color to use for the bar, candle or line segment component. Set to null to skip bar or line segment.
				 *		For colored line charts a color/pattern combination can be returned in an object of the follwing format: `{pattern:[3,3],color:"red"}`
				 *
				 * See {@tutorial Chart Types and Styles} for more details.
			     * @type object
			     * @default
			     * @alias customChart.colorFunction
			     * @memberof!   STXChart.Chart#
			     * @example
				 * stxx.chart.customChart.colorFunction=function(stx, quote, mode){
				 *		if(mode=="shadow" || mode=="outline") return "black";  //draw black wicks and borders
				 *		else{
				 *			if(quote.Close>100) return "green";
				 * 			else if(quote.DT.getHours()<12) return "yellow";
				 *			else return "orange";
				 *		}
				 *		return null;
				 * 	};
			     */
				customChart: null,
			    /**
			     * How much padding to leave for the right y-axis. Default is enough for the axis. Set to zero to overlap y-axis onto chart.
			     * @type number
			     * @default
			     * @alias yaxisPaddingRight
			     * @memberOf  STXChart.Chart.prototype
			     * @since 07/01/2015
			     */
			    yaxisPaddingRight:null,
			    /**
			     * How much padding to leave for the left y-axis. Default is enough for the axis. Set to zero to overlap y-axis onto chart.
			     * @type number
			     * @default
			     * @alias yaxisPaddingLeft
			     * @memberOf  STXChart.Chart.prototype
			     * @since 07/01/2015
			     */
			    yaxisPaddingLeft:null,
			    tickCache: {} // private
		};

		/**
		 * This is the constructor that instantiates the basic chart object and links it to its DOM container. 
		 * Before any chart operations can be performed this constructor must be called. 
		 * 
		 * Multiple STXChart (stx) objects can exist on an HTML document.
		 * `charts` is a member object that can contain multiple charts (in separate panels).
		 * For backward compatibility, there is always one chart called `stxx.chart` which points to the first chart in the `charts` object. 
		 * Users can feel free to reference this chart directly if they only ever need to support a single chart panel.
		 * `chart` contains some variables that are applicable to all of the charts on the screen (i.e. canvas, canvasWidth, canvasHeight, etc)
		 *
		 * Each "chart" contains a unique set of data. In theory each chart supports a separate scroll position but this is not implemented.
		 * @constructor
		 * @param {Object} config Configuration object. Any field or object within the config parameter will be preset or added to the STXChart object itself.
		 * Generally you will want to at least include {container: <your div element>}.
		 * @name  STXChart
		 * @example
		 * // declare a chart
		 * var stxx=new STXChart({container: $$("chartContainer")});
		 * // override defaults after a chart object is declared (this can be done at any time. If the chart has already been rendered, you will need to call `stx.draw();` to immediately see your changes )
		 * stxx.yaxisLabelStyle="roundRectArrow";
		 * stxx.layout.chartType="bar";
		 * @example
		 * // declare a chart and preset defaults
		 * var stxx=new STXChart({container: $$("chartContainer"),layout:{"chartType": "candle","candleWidth": 16}});
		 * @since  15-07-01 deprecated STXChart#underlayPercentage
		 */
		function STXChart(config){
			if(!config) config={
				container: null
			};
			if(config.constructor==HTMLDivElement){ // legacy versions accepted the chart container as the first parameters rather than a config object
				var newConfig={
					container: config
				};
				config=newConfig;
			}
		    /**
		     * READ ONLY. A map of marker objects, sorted by label.
		     * @type object
		     * @alias markers
		     * @memberOf  STXChart.prototype
		     */
			this.markers={};								
		    /**
		     * READ ONLY. An array of currently enabled panels
		     * @type object
		     * @alias panels
		     * @memberOf  STXChart.prototype
		     */
			this.panels={};									
		    /**
		     * READ ONLY. An array of currently enabled overlay studies
		     * @type object
		     * @alias overlays
		     * @memberOf  STXChart.prototype
		     */
			this.overlays={};								
		    /**
		     * READ ONLY. The charts on the screen. Will contain at least one item, "chart"
		     * @type object
		     * @alias charts
		     * @memberOf  STXChart.prototype
		     */
		    this.charts={};									
		    /**
		     * READ ONLY. Array of event listeners. These listeners will be killed when {@link STXChart#destroy} is called.
		     * @type array
		     * @alias eventListeners
		     * @memberOf  STXChart.prototype
		     */
		    this.eventListeners=[]; 					
		    /**
		     * Holds the HTML control elements managed by the chart. Usually this will be a copy of the default [htmlControls]{@link STXChart#htmlControls}.
		     * These are not the GUI elements around the chart, but rather the HTML elements that the library will directly interact with on the canvas 
		     * for things like panel resizing, study edit controls, zooming controls, etc. See {@link STXChart#htmlControls} for more details.
		     * @type object
		     * @alias controls
		     * @memberOf  STXChart.prototype
		     */
		    this.controls={};								// contains the HTML controls for the chart (zoom, home, etc)
			this.goneVertical=false;						// Used internally for pinching algorithm
			this.pinchingScreen=false;						// "
			this.grabbingScreen=false;						// Used internally for panning. Toggles to true when the screen is being panned
			this.grabStartX=0;								// Used internally for panning
			this.grabStartY=0;								// "
			this.grabStartScrollX=0;						// "
			this.grabStartScrollY=0;						// "
			this.swipe={};									// "
		    /**
		     * Number of pixels the mouse needs to move in vertical direction to "unlock" vertical panning/scrolling.
		     * Setting to a number larger than the pixels on the canvas will also disable vertical scrolling
		     * @type number
		     * @default
		     * @alias yTolerance
		     * @memberOf  STXChart.prototype
		     * @example
		     * //This will disable the tolerance, so panning will immediately follow the user actions without maintaining a locked vertical location when panning left or right.
		     * var stxx=new STXChart({container:$$$(".chartContainer"), layout:{"candleWidth": 16, "crosshair":true}});
		     * stxx.yTolerance=0;
		     */
			this.yTolerance=100;

			/**
			 * Number of bars to always keep on the left of the screen when the user pans forward in time. 
			 * If this is set to less than 1 then it will be possible to have a blank chart.
			 * @type number
			 * @default
			 * @alias minimumLeftBars
			 * @memberOf STXChart.prototype
			 * @since 05-2016-10
			 */
			this.minimumLeftBars=1;
			this.grabStartCandleWidth=0;					// Used internally for zooming
			this.grabStartZoom=0;							// "
			this.grabOverrideClick=false;					// "
			this.grabMode="";								// Used internally. Set to either pan, zoom-x or zoom-y when grabbing screen
			this.vectorsShowing=false;						// Used internally to ensure that vectors aren't drawn more than once
			this.mouseMode=true;							// Used internally. For Windows8 devices this is set to true or false depending on whether the last touch was a mouse click or touch event. To support all-in-one computers
		    /**
		     * Set to true to reverse direction of mousewheel for zooming
		     * @type boolean
		     * @default
		     * @alias reverseMouseWheel
		     * @memberOf  STXChart.prototype
		     */
			this.reverseMouseWheel=false;
		    /**
		     * Set to false to turn off mousewheel acceleration
		     * @type boolean
		     * @default
		     * @alias mouseWheelAcceleration
		     * @since 2015-11-1
		     * @memberOf  STXChart.prototype
		     */
			this.mouseWheelAcceleration=true;
		    /**
		     * Minimum candleWidth for zoom actions.
		     * @type number
		     * @default
		     * @alias minimumCandleWidth
		     * @memberOf  STXChart.prototype
		     */
			this.minimumCandleWidth=1;

		    /**
		     * Minimum number of ticks to display when zooming in.
		     * @type number
		     * @default
		     * @alias minimumZoomTicks
		     * @memberOf  STXChart.prototype
		     * @since TBD
		     */
			this.minimumZoomTicks=9;
		    /**
		     * Set to false to disable any user zooming on the chart
		     * @type boolean
		     * @default
		     * @alias allowZoom
		     * @memberOf  STXChart.prototype
		     * @since 04-2015
		     * @example
		     * var stxx=new STXChart({container:$$$(".chartContainer"), allowZoom:false, layout:{"candleWidth": 16, "crosshair":true}});
		     */
			this.allowZoom=true;
		    /**
		     * Set to false to disable any user scrolling of the chart
		     * @type boolean
		     * @default
		     * @alias allowScroll
		     * @memberOf  STXChart.prototype
		     * @since 04-2015
			 * @example
		     * var stxx=new STXChart({container:$$$(".chartContainer"), allowScroll:false, layout:{"candleWidth": 16, "crosshair":true}});
		     */
			this.allowScroll=true;
		    /**
		     * Set to false to disable 2 finger side swipe motion for scrolling
		     * @type boolean
		     * @default
		     * @alias allowSideswipe
		     * @memberOf  STXChart.prototype
		     * @since 2015-12-08
		     */
			this.allowSideswipe=true;

			this.anyHighlighted=false;						// READ ONLY. Toggles to true if any drawing or overlay is highlighted for deletion
			this.accessoryTimer=null;						// Used internally to control drawing performance
			this.lastAccessoryUpdate=new Date().getTime();	// "
			this.displayCrosshairs=true;					// READ ONLY. Use doDisplayCrosshairs() or undisplayCrosshairs()
			this.hrPanel=null;								// READ ONLY. Current panel that mouse is hovering over
			this.editingAnnotation=false;					// READ ONLY. True if an annotation is open for editing
			this.openDialog="";								// Set this to non-blank to disable chart touch and mouse events use STXChart.prototype.modalBegin() and STXChart.prototype.modalEnd

		    /**
		     * Set these to false to not display this panel management component. See {@link STXChart.controls} for alternate methods and more details.		     
		     * @type boolean
		     * @default
		     * @alias displayIconsUpDown
		     * @memberOf  STXChart.prototype
		     * @example
		     * stxx.displayIconsUpDown=false;
		     */
			this.displayIconsUpDown=true;
		    /**
		     * Set these to false to not display this panel management component. See {@link STXChart.controls} for alternate methods and more details.		     
		     * @type boolean
		     * @default
		     * @alias displayIconsSolo
		     * @memberOf  STXChart.prototype
		     * @example
		     * stxx.displayIconsSolo=false;
		     */
			this.displayIconsSolo=true;
		    /**
		     * Set these to false to not display this panel management component. See {@link STXChart.controls} for alternate methods and more details.		     
		     * @type boolean
		     * @default
		     * @alias displayIconsClose
		     * @memberOf  STXChart.prototype
		     * @example
		     * stxx.displayIconsClose=false;
		     */
			this.displayIconsClose=true;
		    /**
		     * Set these to false to not display this panel management component. See {@link STXChart.controls} for alternate methods and more details.		     
		     * @type boolean
		     * @default
		     * @alias displayPanelResize
		     * @memberOf  STXChart.prototype
		     * @example
		     * stxx.displayPanelResize=false;
		     */
			this.displayPanelResize=true;
		    /**
		     * Only reposition markers this many milliseconds. Set to zero or null for no visible delay. (lower numbers are more CPU intensive).
		     * See {@tutorial Markers} for more details on adding markers to your charts
		     * @type number
		     * @default
		     * @alias markerDelay
		     * @memberOf  STXChart.prototype
		     * @example
		     * stxx.markerDelay=0;
		     */
			this.markerDelay=25;
		    /**
		     * If true when the chart initially is rendered, then the STXChart object will register to listen and manage touch and mouse browser events within then canvas by attaching them to the container div.
		     *
		     * Set to false to restrict all events registration and optionally turn into a static chart. Users will not be able to zoom or scroll.
		     *
		     * It is possible to re-enable the events after the chart has been rendered, but you must call stx.initializeChart(); stx.draw(); to register the events once again.
		     * @type boolean
		     * @default
		     * @alias manageTouchAndMouse
		     * @memberOf  STXChart.prototype
		     * @example
		     * // if enabling events after the chart was already rendered, you must reinitialize to re register the browser events.
		     * stxx.manageTouchAndMouse = true;
		     * stxx.initializeChart();
		     * stxx.draw();
		     */
			this.manageTouchAndMouse=true;
		    /**
		     * Primarily intended for mobile devices, if set to false it will allow up/down swiping (don't capture events) to pass trough the chart container so the main page can manage it. 
		     * This allows a user swiping up and down to swipe trough the chart instead of having the chart capture the event and prevent the page from continue moving.
		     * It therefore produces a more natural up/down swiping motion throughout the page.
		     * @type boolean
		     * @default
		     * @alias captureTouchEvents
		     * @memberOf  STXChart.prototype
		     * @since 12-2015-08
		     */
			this.captureTouchEvents=true;
			this.touches=[];					// Used internally for touch
			this.changedTouched=[];				// Used internally for touch
		    /**
		     * The value (price) representing the crosshair cursor point
		     * @type number
		     * @alias crosshairTick
		     * @memberOf  STXChart.prototype
		     */
			this.crosshairTick=null;			
		    /**
		     * Read Only. The value (price) representing the crosshair cursor point
		     * @type number
		     * @alias crosshairValue
		     * @memberOf  STXChart.prototype
		     */
			this.crosshairValue=null;
		    /**
		     * Set to either "roundRectArrow", "semiRoundRect", "roundRect","tickedRect","rect","noop"
		     * @type string
		     * @default
		     * @alias yaxisLabelStyle
		     * @memberOf  STXChart.prototype
		     * @example
		     * var stxx=new STXChart({container: $$("chartContainer")});
		     * stxx.yaxisLabelStyle="roundRectArrow";
		     */
			this.yaxisLabelStyle="roundRectArrow";
		    /**
		     * Set to false if you don't want the axis borders drawn. This will override individual settings on yaxis and xaxis.
		     * @type boolean
		     * @default
		     * @alias axisBorders
		     * @memberOf  STXChart.prototype
		     */
			this.axisBorders=null;

			this.pt={
				x1:-1,
				x2:-1,
				y1:-1,
				y2:-1
			};
			this.moveA=-1;									// Used internally for touch
			this.moveB=-1;									// "
			this.touchStartTime=-1;							// "
			this.gestureStartDistance=-1; 					// "
			this.grabStartPeriodicity=1; 					// "
			this.grabEndPeriodicity=-1; 					// "
			this.scrollEvent=null; 							// "
			this.cmd=false; 								// "
			this.ctrl=false; 								// "
			this.shift=false; 								// "
			this.userPointerDown=false;  					//represents either mouse button or finger on touch device
		    /**
		     * Set to true based on a key stroke, button press, etc, when you want to enable the ability to clone a highlighted drawing. 
		     * Reset to false when you want the cloning to end. 
		     * For example, you can set to true when the `control` key is pressed and disable when it is released. 
		     * @type number
		     * @default
		     * @alias cloneDrawing
		     * @memberOf  STXChart.prototype
		     * @since 07-2016-16.7
		     * @example
		     * 
				document.onkeyup=keyup;
				document.onkeydown=keydown;
				
				// disable cloning if the ctl key is released
				function keyup(e){
					var key = (window.event) ? event.keyCode : e.keyCode;
					if (key == 18 ) stxx.cloneDrawing=false;
				}
				
				// enable cloning if the ctl key is pressed
				function keydown(e){
					var key = (window.event) ? event.keyCode : e.keyCode;
					if (key == 18 ) stxx.cloneDrawing=true;
				}
		     */
			this.cloneDrawing=false;
		    /**
		     * X axis offset for touch devices so that finger isn't blocking crosshair
		     * @type number
		     * @default
		     * @alias crosshairXOffset
		     * @memberOf  STXChart.prototype
		     */
			this.crosshairXOffset=-40;						
		    /**
		     * Y axis Offset for touch devices so that finger isn't blocking crosshair
		     * @type number
		     * @default
		     * @alias crosshairYOffset
		     * @memberOf  STXChart.prototype
		     */
			this.crosshairYOffset=-40;					
		    /**
		     * Read only. This gets set to true when the chart display has been initialized.
		     * @type boolean
		     * @default
		     * @alias displayInitialized
		     * @memberOf  STXChart.prototype
		     */
			this.displayInitialized=false; 			

		    /**
		     * When set to true, line and mountain charts are extended slightly in order to reduce whitespace at the right edge of the chart
		     * @type boolean
		     * @default
		     * @alias extendLastTick
		     * @memberOf  STXChart.prototype
		     * @since 05-2016-10 The line will be extended to the end of the chart (full candle width) instead of the candle border, even when using yaxisLabelStyle "roundRectArrow"
		     */
			this.extendLastTick=false;

			this.clicks={
				s1MS: -1,
				e1MS: -1,
				s2MS: -1,
				e2MS: -1
			};

			this.cancelTouchSingleClick=false; 				// Set this to true whenever a screen item is touched so as to avoid a chart touch event
		    /**
		     * Contains the current screen layout
		     * @type object
		     * @alias layout
		     * @memberOf  STXChart#
		     * @example
		     * // Layout parameters can be preset on a chart as follows:
		     * var stxx=new STXChart({container: $$("chartContainer"),layout:{"interval":"day","periodicity":1,"chartType": "candle","candleWidth": 16}});
		     */
			this.layout={
			    /**
			     * Chart interval
			     * Available options are: [number] representing minutes, "day", "week", "month"
			     * See the [Periodicity and Quote feed](tutorial-Data%20Loading.html#Periodicity) tutorial.
			     * @type string
			     * @default
			     * @alias layout.interval
			     * @memberof!   STXChart#
			     */
				interval: "day",
			    /**
			     * Number of periods per interval
			     * See the [Periodicity and Quote feed](tutorial-Data%20Loading.html#Periodicity) tutorial.
			     * @type number
			     * @default
			     * @alias layout.periodicity
			     * @memberof!   STXChart#
			     */
				periodicity: 1,
				/**
				 * Time unit for the interval. "millisecond", "second","minute" or null for daily charts
				 * @type string
				 * @default
				 * @memberOf! STXChart#
				 */
				timeUnit: null,
			    /**
			     * Candle Width In pixels ( see {@tutorial Managing Chart Zoom and Range} )
			     * @type number
			     * @default
			     * @alias layout.candleWidth
			     * @memberof!   STXChart#
			     */
				candleWidth: 8,
				volumeUnderlay: false,
			    /**
			     * Whether adjusted or nominal prices are being displayed. If true then the chart will look for "Adj_Close" in the masterData as an alternative to "Close".
			     * @type boolean
			     * @default
			     * @alias layout.adj
			     * @memberof!   STXChart#
			     * @instance
			     */
				adj: true,
			    /**
			     * Whether crosshairs are being displayed
			     * @type boolean
			     * @default
			     * @alias layout.crosshair
			     * @memberof!   STXChart#
			     * @instance
			     */
				crosshair: false,
			    /**
			     * Sets type of chart to render
			     * Available options are: "line", "candle", "bar", "wave", “colored_bar”, "colored_line", “hollow_candle”,”scatterplot”, "baseline_delta", "baseline_delta_mountain", "mountain","colored_mountain", "volume_candle"
			     * @type string
			     * @default
			     * @alias layout.chartType
			     * @memberof!   STXChart#
			     * @since 05-2016-10.1 "baseline_delta_mountain" and  "colored_mountain" are also available
			     */
				chartType: "candle",
			    /**
			     * Flag for extended hours time-frames. 
			     * The chart includes the 'extended' parameter in the `params` object sent into the `fetch()` call. 
			     * Your quote feed must be able to provide extended hours data when requested (`extended:true`) for any extended hours functionality to work. 
			     * See {@link STX.ExtendedHours} and {@link STX.Market} for more details on how extended hours are set and used.
			     * @type boolean
			     * @default
			     * @alias layout.extended
			     * @memberof!   STXChart#
			     */
				extended: false,
				/**
				 * Tracks the extended market sessions to display on the chart.  
				 * Once set, call newChart() to enable the corresponding time-frames in the x axis and load the data for these sessions.
				 * Session names must match the session names declared in {@link STX.Market}.
				 * See {@link STX.ExtendedHours} and {@link STX.Market} for more details on how extended hours are set and used.
			     * @type object
			     * @default
			     * @alias layout.marketSessions
			     * @memberof!   STXChart#
				 * @example
				 * marketSessions = {
				 *      "session1": true,
				 *      "session2": true,
				 *      "session3": false,
				 *      "pre": true,
				 *      "post": true
				 * }
				 * @since  06-2016-02
				 */
				marketSessions: {}, //use defaults
			    /**
			     * Type of aggregation to use
			     * Available options are: "rangebars" "ohlc" "kagi" "pandf" "heikinashi" "linebreak" "renko" See {@link STXChart#setAggregationType}
			     * @type string
			     * @default
			     * @alias layout.aggregationType
			     * @memberof!   STXChart#
			     */
				aggregationType: "ohlc",
			    /**
			     * Type of scale to use
			     * Available options are: "log", "linear" See {@link STXChart#setChartScale}
			     * @type string
			     * @default
			     * @alias layout.chartScale
			     * @memberof!   STXChart#
			     */
				chartScale:  "linear",
				studies: {},
				panels: {}
			};
		    /**
		     * Contains the chart preferences
		     * @type object
		     * @alias preferences
		     * @memberOf  STXChart#
		     */
			this.preferences={
				/**
				* Draw a horizontal line at the current price.
				* Only drawn if the most recent tick is visible.
				* @type boolean
				* @default
				* @alias preferences.currentPriceLine
				* @memberof! STXChart#
				* @since 05-2016-10
				*/
				currentPriceLine: false,
			    /**
			     * Magnetize the crosshairs to datapoints during drawing operations to improve placement accuracy. See {@link STXChart.AdvancedInjectable#magnetize} for more details
			     * @type boolean
			     * @default
			     * @alias preferences.magnet
			     * @memberof!   STXChart#
			     */
				magnet: false,
					/**
					 * Locks the crosshair Y value to the value of the field name specified
					 * for the tick under the cursor on the primary chart.
					 *
					 * For studies create a horizontalCrosshairFieldFN function that will be called by
					 * STX.Studies.addStudy. The function must return the field name in the dataSet to
					 * reference. The function will not be called when the study is set to overly or
					 * underlay the chart's panel.
					 *
					 * @example
					 * // Have the crosshair lock to the "Close" field of the tick under the cursor
					 * stxx.preferences.horizontalCrosshairField = "Close";
					 *
					 * @example
					 * // Have the crosshair lock to the "ATR ATR (14)" field for a ATR study with a period of 14
					 * STX.Studies.studyLibrary["ATR"].horizontalCrosshairFieldFN = function(stx, sd) {
					 * 	// returns the field name, which should be created by the study's "calculateFN"
					 * 	return "ATR " + sd.name;
					 * };
					 *
					 * @type string
					 * @default
					 * @alias preferences.horizontalCrosshairField
					 * @memberof!   STXChart#
					 * @since 04-2016-08
					 */
				horizontalCrosshairField: null,
			    /**
			     * Set to true to display labels on y-axis for line based studies using {@link STX.Studies.displayIndividualSeriesAsLine} or {@link STX.Studies.displaySeriesAsLine} (this is overridden by the particular y-axis setting of {@link STXChart.YAxis#drawPriceLabels}).
			     * This flag is checked inside these 2 functions to decide if a label should be set, as such if you do not wish to have a label on a particular study line, you can set this flag to `false`, before calling the function, and then back to `true`.
			     * @type boolean
			     * @default
			     * @alias preferences.labels
			     * @memberof!   STXChart#
			     * @example
					//do not display the price labels for this study
					stxx.preferences.labels=false;
					STX.Studies.displaySeriesAsLine(stx, sd, quotes);

					//restore price labels to default value
					stxx.preferences.labels=true;
			     */
				labels: true,
			    /**
			     * Initial whitespace on right of the screen in pixels.
			     * @type number
			     * @default
			     * @alias preferences.whitespace
			     * @memberof!   STXChart#
			     * @example
			     * // override the default value at declaration time
			     * var stxx=new STXChart({container:$$$(".chartContainer"), preferences:{"whitespace": 20}});
			     */
				whitespace: 50,
			    /**
			     * zoom-in speed for mousewheel and zoom button.
			     *
			     * Range: **0 -.99999**. The closer to 1 the slower the zoom.
			     * @type number
			     * @default
			     * @alias preferences.zoomInSpeed
			     * @memberof!   STXChart#
			     * @example
			     * stxx.preferences.zoomInSpeed=.98;
			     * @example
			     * var stxx=new STXChart({container:$$$(".chartContainer"), preferences:{"zoomInSpeed": .98}});
			     * @since 07/01/2015
			     */
				 zoomInSpeed: null,
			    /**
			     * zoom-out speed for mousewheel and zoom button.
			     *
			     * Range: **1-2**. The closer to 1 the slower the zoom.
			     * @type number
			     * @default
			     * @alias preferences.zoomOutSpeed
			     * @memberof!   STXChart#
			     * @example
			     * stxx.preferences.zoomOutSpeed=1;
			     * @example
			     * var stxx=new STXChart({container:$$$(".chartContainer"), preferences:{"zoomOutSpeed": 1}});
			     * @since 07/01/2015
			     */
				 zoomOutSpeed: null,
			};
		    /**
		     * Used to control the behavior and  throttling of real time updates from streamTrade() or appendMasterData() to prevent overloading the chart engine
		     * @type object
		     * @alias streamParameters
		     * @memberOf  STXChart#
		     */
			this.streamParameters={
				count: 0,
			//	lastDraw: (new Date()).getTime(),
			    /**
			     * ms to wait before allowing update to occur (if this condition is met, the update will occur and all pending ticks will be loaded - exclusive of maxTicks)
			     * @type number
			     * @default
			     * @alias streamParameters.maxWait
			     * @memberof!   STXChart#
			     */
				maxWait: 1000,
			    /**
			     * ticks to wait before allowing update to occur (if this condition is met, the update will occur and all pending ticks will be loaded - exclusive of maxWait)
			     * @type number
			     * @default
			     * @alias streamParameters.maxTicks
			     * @memberof!   STXChart#
			     */
				maxTicks: 100,
				timeout: -1,
			    /**
			     * if true, gaps will be filled in the master data from the last tick in the chart to the date of the trade. The close price from the last tick will be used to fill the gaps. This will cause charts to display a straight line instead of a gap. Only applicable when using streamTrade()
			     * @type boolean
			     * @default
			     * @alias streamParameters.fillGaps
			     * @memberof!   STXChart#
			     * @since 2016-03-11
			     */
				fillGaps: true,
			};
		    /**
		     * This is the callback function used to translate languages.
		     * Should return a translated phrase given the English phrase. See separate translation file for list of phrases.
		     *
			 * Expected format :
			 *
			 * 		var translatedWord = fc(english);
			 *
			 * Defaults to {@link STX.I18N.translate}
			 * @type {function}
		     * @alias translationCallback
		     * @memberOf  STXChart.prototype
		     */
			this.translationCallback=null;
			this.locale=null;								// set by setLocale()
		    /**
		     * Read Only. Timezone of the masterData, set by {@link STXChart#setTimeZone}.
			 * @type {string}
		     * @alias dataZone
		     * @memberOf  STXChart.prototype
		     */
			this.dataZone=null;
		    /**
		     * Read Only. Timezone to display on the chart, set by {@link STXChart#setTimeZone}.
			 * @type {string}
		     * @alias displayZone
		     * @memberOf  STXChart.prototype
		     */
			this.displayZone=null;
			this.timeZoneOffset=0;							// use setTimeZone() to compute this value
		    /**
		     * This is the callback function used to react to {@link STXChart#changeOccurred}.
		     * Use this for storing chart configurations or drawings real time as users make changes.
		     *
			 * Expected format :
			 *
			 * 		fc(stxChart, eventType);
			 *
			 * Currently implemented values for  "eventType" are "layout" and "vector".
			 *
			 * You can create any additional event types and trigger them by calling 'STXChart.changeOccurred(eventType)'
			 *
			 * **Note** only one changeCallback function can be registered per chart object. As such, you must program it to handle any and all possible events triggered by {@link STXChart#changeOccurred}.
			 * @type {function}
		     * @alias changeCallback
		     * @memberOf  STXChart.prototype
		     * @example
		     * stxx.changeCallback=function(stxx, eventType){
			 *		if(eventType=="layout") saveLayout();
			 *		if(eventType=="vector") saveDrawing();
			 * }
		     */
			this.changeCallback=null;
			this.masterData=null;							// Contains the historical quotes for the current chart
		    /**
		     * Register this function to transform the data set before a createDataSet() event; such as change in periodicity.
		     * You can also explicitly call  <code>stxx.createDataSet(); stxx.draw();</code> to trigger this function.
		     *
			 * Expected Format :
			 *
			 * 		fc(stxChart, dataSet);
			 *
			 * @type {function}
		     * @alias transformDataSetPre
		     * @memberOf  STXChart.prototype
		     * @example
		     * stxx.transformDataSetPre=function(stxx, dataSet){
			 *		for(var i=0;i < dataSet.length;i++){
			 *			// do somethng to the dataset here
			 *		}
			 * }
			*/
			this.transformDataSetPre=null;
		    /**
		     * Register this function to transform the data set after a createDataSet() event; such as change in periodicity.
		     * You can also explicitly call  <code>stxx.createDataSet(); stxx.draw();</code> to trigger this function.
		     *
			 * Expected Format :
			 *
			 * 		fc(stxChart, dataSet, min low price in the dataset, max high price in the dataset);
			 *
			 * @type {function}
		     * @alias transformDataSetPost
		     * @memberOf  STXChart.prototype
		     * @example
			 * stxx.transformDataSetPost=function(self, dataSet, min, max){
			 *		for(var i=0;i < dataSet.length;i++){
			 *			// do somethng to the dataset here
			 *		}
			 * }
			*/
			this.transformDataSetPost=null;
		    /**
		     * Register this function if you need [setMasterData()]{@link STXChart#setMasterData} to transform each quote returned by your data feed into a properly formatted OHLC object before loading it into the chart.
		     * {@link STXChart#setMasterData} is called by {@link STXChart#newChart}.
		     *
		     * This is a useful function if your data is not properly formated as required by the charting library.
		     * Instead of having to iterate trough your data to re-format it, and once again within setMasterData() to load it,
		     * you can use the transform function to format it as it is being loaded, and thus preventing the dual looping.
		     *
			 * Expected Format :
			 *
			 * 		var formattedOHLCObject = fc(quote);
			 *
			 * @type {function}
		     * @alias transformMasterDataQuote
		     * @memberOf  STXChart.prototype
		     * @example
			 * stxx.transformMasterDataQuote=function(quote){
			 *		var formattedOHLCObject =
			 *			{
			 *				DT:new Date(quote.DT),
			 *				Open:parseFloat(quote.Open),
			 *				Close:parseFloat(quote.Close),
			 *				High:parseFloat(quote.High),
			 *				Low:parseFloat(quote.Low),
			 *				Volume:parseInt(quote.Volume,10)
			 *			};
			 *
			 *		return formattedOHLCObject;
			 * }
			*/
			this.transformMasterDataQuote=null;
		    /**
		     * This is the callback function used by setPeriodicityV2 when no quotefeed has been attached to the chart.
		     * Called if the masterData does not have the interval requested.
		     *
		     * Do not initialize if you are using a quotefeed ( {@link STX.QuoteFeed } )
		     *
			 * @type {function}
		     * @alias dataCallback
		     * @memberOf  STXChart.prototype
		     * @example
		     * stxx.dataCallback=function(){
			 *		// put code here to get the new data in the correct periodicity.
			 *		// use layout.interval and layout.periodicity to determine what you need.
			 *		// finally call stxx.newChart(symbol,data) to load the data and render the chart.
			 * }
		     */
			this.dataCallback=null;
		    /**
		     * Set this to true if your server returns data in  week or monthly ticks, and doesn't require rolling computation from daily
		     * @type boolean
		     * @default
		     * @alias dontRoll
		     * @memberOf  STXChart.prototype
		     */
			this.dontRoll=false;
		    /**
		     * Set to true to allow an equation to be entered into the symbol input.  For example, =2*IBM-GM
		     * NOTE: the equation needs to be preceded by an equals sign (=) in order for it to be parsed as an equation.
		     * @type boolean
		     * @default
		     * @alias allowEquations
		     * @memberOf  STXChart.prototype
		     */
			this.allowEquations=true;
		    /**
		     * Stores a list of active drawing object on the chart. Serialized renditions of drawings can be added using {@link STXChart#createDrawing} and removed using {@link STXChart#removeDrawing}
		     * @type array
		     * @default
		     * @alias drawingObjects
		     * @memberOf  STXChart.prototype
		     */
			this.drawingObjects=[];
			this.undoStamps=[];
		    /**
		     * Set to true if there may be null quote gaps coming back from your feed, and need to scrub the data to remove them.
		     * If set, a new 'scrubbed' dataSet called `stx.chart.scrubbed` will be created.
		     * If disabled 'scrubbed' will still exist, but will be identical to `stx.chart.dataSet` and *will* have gaps.
		     * @type boolean
		     * @default
		     * @alias dataSetContainsGaps
		     * @memberOf  STXChart.prototype
		     */
			this.dataSetContainsGaps=true;
		    /**
		     * Set to true to have the Chart create missing data points for lightly traded stocks that may have missing ticks for an introday or daily interval. See {@link STXChart#doCleanupGaps}
		     * @type boolean
		     * @default
		     * @alias cleanupGaps
		     * @memberOf  STXChart.prototype
		     * @since ver 15-07-01 gaps are automatically cleaned up unless this flag is set to false
		     * <br>2015-11-1, gaps are not automatically cleaned unless this flag is set to true
		     */
			this.cleanupGaps=false;
		    /**
		     * Set to maximum size of dataSet allowed (the larger, the more of a performance hit)
		     * @type number
		     * @default
		     * @alias maxDataSetSize
		     * @memberOf  STXChart.prototype
		     */
			this.maxDataSetSize=20000;
			/**
		     * Set to zero to avoid resize checking loop. See {@link STXChart#setResizeTimer} for more details
		     * @type number
		     * @default
		     * @alias resizeDetectMS
		     * @memberOf  STXChart.prototype
		     */
			this.resizeDetectMS=1000;
			/**
			 * Display the xAxis below all panels.
			 * @type boolean
			 * @default
			 * @alias xAxisAsFooter
			 * @memberof 	STXChart.prototype
			 * @since 05-2016-10
			 */
			this.xAxisAsFooter = false;
			this.chart=new STXChart.Chart();
			this.chart.name="chart";
			this.chart.canvas=null;							// Contains the HTML5 canvas with the chart and drawings
			this.chart.tempCanvas=null;						// lays on top of the canvas and is used when creating drawings
			this.chart.container=config.container;

			/**
			 * Create a default market.
			 * @memberOf STXChart.prototype
			 */
			this.chart.market = new STX.Market(); //always open
			/**
		     * If set to true, allow scrolling from left to right, creating white space on either side.
		     * @type boolean
		     * @default
		     * @alias allowScrollPast
		     * @memberOf  STXChart.prototype
		     */
			this.chart.allowScrollPast=true;
		    /**
		     * Set to true to temporarily hide drawings
		     * @type boolean
		     * @default
		     * @alias hideDrawings
		     * @memberOf  STXChart.prototype
		     */
			this.chart.hideDrawings=false;
		    /**
		     * Adjust to increase or decrease the default width of candles
		     * @type boolean
		     * @default
		     * @alias candleWidthPercent
		     * @memberOf  STXChart.prototype
		     */
			this.candleWidthPercent=0.65;
		    /**
		     * chart types which do not draw wicks on candles
		     * @type object
		     * @default
		     * @alias noWicksOnCandles
		     * @memberOf  STXChart.prototype
		     */
			this.noWicksOnCandles={"rangebars":1,"renko":1,"linebreak":1};
		    /**
		     * chart types which require fetching as many bars as possible (since they aggregate data)
		     * @type object
		     * @default
		     * @alias fetchMaximumBars
		     * @memberOf  STXChart.prototype
		     */
			this.fetchMaximumBars={"rangebars":1,"kagi":1,"renko":1,"linebreak":1,"pandf":1};
		    /**
		     * chart types which have a non-time-based x-axis (since they aggregate data)
		     * @type object
		     * @default
		     * @alias hasNTBAxis
		     * @memberOf  STXChart.prototype
		     */
			this.hasNTBAxis={"rangebars":1,"kagi":1,"renko":1,"linebreak":1,"pandf":1};

			this.charts.chart=this.chart;
			this.styles={};		// Contains CSS styles used internally to render canvas elements
			this.currentVectorParameters=STX.clone(STXChart.currentVectorParameters); // contains the current drawing parameters for this chart
			if(typeof config.animate=="undefined") this.animate=new STX.Animate(this); // set to null to bypass animation
			STX.extend(this, config);

			if(config.container){
				this.registerHTMLElements();
				// Initialize the very basic dimensions of chart so that it is operational immediately
				this.chart.width=this.chart.container.clientWidth-this.chart.yAxis.width;
				this.setCandleWidth(this.layout.candleWidth, this.chart);
				this.chart.canvasHeight=this.chart.container.clientHeight;

				// This prevents mousewheel events from inadvertently triggering page scroll in Firefox and IE
				if(!STX.FireFoxWheelWorkaround){
					if(STX.isIE){
						document.body.addEventListener("wheel", function(e){
							if(STXChart.insideChart){
								e.preventDefault();
								// IE won't propagate the event so we need to manually figure out if we're inside the chart
								for(var i=0;i<STXChart.registeredContainers.length;i++){
									var stx=STXChart.registeredContainers[i].stx;
									if(STXChart.crosshairX>=stx.left &&
										STXChart.crosshairX<=stx.right &&
										STXChart.crosshairY>=stx.top &&
										STXChart.crosshairY<=stx.bottom){
										stx.mouseWheel(e, "onmousewheel");
									}
								}
							}
						});
					}else{
						document.body.addEventListener("wheel", function(e){if(STXChart.insideChart) e.preventDefault();});
					}
					STX.FireFoxWheelWorkaround=true;
				}
			}
			this.construct();
		}
		
		/**
		 * Given a browser time it will return the date in dataZone time. See {@link STXChart#setTimeZone} for more details.
		 * If no dataZone is set, it will return the original date passed in.
		 * @param {Date} browserDate Date in broswr time - as in 'new Date();'
		 * @return {Date} Date converted to dataZone
		 * @memberOf  STXChart
		 * @since TBD
		 */
		STXChart.prototype.convertToDataZone=function(browserDate){	
			if(this.dataZone){
				// convert the current time to the dataZone
				var tzNow = STX.convertTimeZone(browserDate, null, this.dataZone);
				// remember the the masterData is in local time but really representing the dataZone time.
				// now build a browser timezone time using the dataZone time so it will match the offset of the existing data in masterData.
				browserDate = new Date(tzNow.getFullYear(), tzNow.getMonth(), tzNow.getDate(), tzNow.getHours(), tzNow.getMinutes(), tzNow.getSeconds(), tzNow.getMilliseconds());
			}
			return browserDate;
		}


		/**
		 * This method does nothing. It is just a known location to put a break point for debugging the kernel.
		 * @private
		 */
		STXChart.prototype.debug=function(){
			return;
		};

		/**
		 * Measures frames per second. Use this from the console.
		 * @private
		 */
		STXChart.prototype.fps=function(){
		    var start = new Date().getTime();
		    var frames = 0;
		    var time_seconds = 5;
		    var self=this;
		    console.log("Measuring settimeout for " + time_seconds + " seconds.");
		    console.log(STXChart.useAnimation?"Using requestAnimationFrame":"Using setTimeout");

		    function render() {
		        var now = new Date().getTime();
		        if (((now - start) / 1000) > time_seconds) {
		            console.log("FPS=" + (frames / time_seconds));
		            return;
		        }
		        self.draw();
		        frames++;
		        if(STXChart.useAnimation){
       				requestAnimationFrame(render);
		        }else{
			        setTimeout(render,0);
			    }
		    }
		    render();
		};
		
		/**
		 * Specify callbacks. These can be specified on the prototype or on individual instances. You can also register
		 * for a callback with {@link STXChart#addEventListener}
		 * @type {object}
		 * @memberOf  STXChart
		 */
		STXChart.prototype.callbacks={
		    /**
		     * Called when a user right clicks on an overlay study.
		     *
		     * ***Please note that this callback must be set *before* you call {@link STXChart#importLayout}.
		     * Otherwise your imported studies will not have an edit capability***
		     *
		     * Format:<br>
		     * callback({stx, sd, inputs, outputs, parameters})
		     * @type Function
			 * @alias callbacks.studyOverlayEdit
			 * @memberof!   STXChart#
		     */
		    studyOverlayEdit: null,
		    /**
		     * Called when a user clicks the edit button on a study panel. If forceEdit==true then a user has clicked
		     * on an edit button (cog wheel) so pull up an edit dialog. Otherwise they have simply right clicked so
		     * give them a context menu.
		     *
		     * ***Please note that this callback should be set *before* you call {@link STXChart#importLayout}.
		     * Otherwise your imported studies will not have an edit capability***
		     *
		     * Format:<br>
		     * callback({stx, sd, inputs, outputs, parameters, forceEdit})
		     * @type Function
			 * @alias callbacks.studyPanelEdit
			 * @memberof!   STXChart#
		     */
			studyPanelEdit: null,
		    /**
		     * Called when a user clicks or taps on the chart. Not called if a drawing tool is active!
		     *
		     * Format:<br>
		     * callback({stx:STXChart, panel:STXChart.Panel, x:this.cx, y:this.cy})
		     * @type Function
			 * @alias callbacks.tap
			 * @memberof!   STXChart#
			 * @example
			 * stxx.callbacks.tap=testTap;
			 *
			 * function testTap(tapObject){
			 * 	alert('tap event at x: ' + tapObject.x + ' y: '+ tapObject.y);
			 * }
		     */
			tap: null,
		    /**
		     * Called when a user "long holds" on the chart. By default this is set to 1000 milliseconds.
		     * Optionally change the value of stxx.longHoldTime to a different setting, or set to zero to disable.
		     *
		     * Format:<br>
		     * callback({stx:STXChart, panel:STXChart.Panel, x:this.cx, y:this.cy})
		     * @type Function
			 * @alias callbacks.tap
			 * @memberof!   STXChart#
			 * @example
			 * stxx.longHoldTime=... // Optionally override default value of 1000ms
			 * stxx.callbacks.longhold=testLongHold;
			 *
			 * function testLongHold(tapObject){
			 * 	alert('long hold event at x: ' + tapObject.x + ' y: '+ tapObject.y);
			 * }
			 * @memberof!   STXChart#
			 * @since 2016-06-22
		     */
			longhold: null,
		    /**
		     * Called when a user moves on the chart. Not called if a drawing tool is active, panel resizing, etc
		     * grab is true if a mouse user has the mouse button down while moving. For touch users it is true
		     * if they do not have the crosshair tool enabled.
		     *
		     * Format:<br>
		     * callback({stx:STXChart, panel:STXChart.Panel, x:this.cx, y:this.cy, grab:boolean})
		     * @type Function
			 * @alias callbacks.move
			 * @memberof!   STXChart#
		     */
			move:null,

			/**
			 * Called when the layout changes
			 * Format:<br>
			 * callback({stx:STXChart, chart:STXChart.Chart, symbol: String, symbolObject:Object, layout: Object})
			 * @type Function
			 * @alias callbacks.layout
			 * @memberOf! STXChart#
			 */
			layout: null,
			/**
			 * Called when a drawing is added or deleted (all the drawings are returned, not just the new one)
			 * Format:<br>
			 * callback({stx:STXChart, symbol: String, symbolObject:Object, drawings: Object})
			 * @type Function
			 * @alias callbacks.drawing
			 * @memberOf! STXChart#
			 */
			drawing: null,
			/**
			 * Called when the symbol is changed (when newChart is called) or added (addSeries). Note
			 * that this is not called if the symbol change occurs during an importLayout
			 * Format:<br>
			 * callback({stx:STXChart, symbol: String, symbolObject:Object,drawings:Object})
			 * @type Function
			 * @alias callbacks.symbolChange
			 * @memberOf! STXChart#
			 * @since 2016-06-21
			 */
			symbolChange: null,

			/**
			 * Called to determine how many decimal places the stock trades in. This is used for head's up display
			 * and also for the current price pointer label.
			 *
			 * Format:<br>
			 * callback({stx:STXChart, chart:STXChart.Chart, symbol: String, symbolObject:Object})
			 * @type Function
			 * @alias callbacks.calculateTradingDecimalPlaces
			 * @memberof! STXChart#
			 */
			calculateTradingDecimalPlaces: STX.calculateTradingDecimalPlaces

		};

		_exports.STXChart=STXChart;

		/**
		 * @deprecated
		 */
		STXChart.DrawingDescriptor={
				"name": "",
				"render": null, 				/// function(vector, color, context, highlight (boolean), temporary (boolean), stx)
				"intersected": null,			/// function(vector, x, y) returns whether coordinates intersect the object
				"click": null,					/// function(vector, clickNumber) called when mouse click or tap. Return true to end drawing. False to accept more clicks.
				"abort": null					/// called when user has aborted drawing action (esc key for instance)
		};

		/**
		 * Prepends custom developer functionality to an internal chart member. See [“Injection API"](index.html#injection-api-prepend-and-append).
		 * @param  {string} o Signature of member
		 * @param  {function} n Callback function, will be called with "apply"
		 * @memberOf  STXChart
		 * @since
		 * <br>- 04-2015 You can append either to an {@link STXChart} instance, or to the prototype. The first will affect only a single
		 * chart while the latter will affect any chart (if you have multiple on the screen).
		 * <br>- 15-07-01 function returns a descriptor which can be passed in to [removeInjection()]{@link STXChart#removeInjection} to remove it later on.
		 * @return {object} Injection descriptor which can be passed in to {@link STXChart#removeInjection} to remove it later on.
		 */
		STXChart.prototype.prepend=function(o,n){
			var prepends;
			if(this instanceof STXChart){
				prepends=this["prepend"+o];
				if(!prepends){
					this["prepend"+o]=[n];
				}else{
					this["prepend"+o]=[n].concat(prepends);
				}
			}else{
				prepends=STXChart.prototype["prepend"+o];
				if(!prepends){
					STXChart.prototype["prepend"+o]=[n];
				}else{
					STXChart.prototype["prepend"+o]=[n].concat(prepends);
				}
			}
			return {method:"prepend"+o, func:n};
		};

		/**
		 * Appends custom developer functionality to an internal chart member. See [“Injection API"](index.html#injection-api-prepend-and-append).
		 * @param  {string} o Signature of member
		 * @param  {function} n Callback function, will be called with "apply"
		 * @memberOf  STXChart
		 * @since
		 * <br>- 04-2015 You can append either to an {@link STXChart} instance, or to the prototype. The first will affect only a single
		 * chart while the latter will affect any chart (if you have multiple on the screen)
		 * <br>- 15-07-01 function returns a descriptor which can be passed in to [removeInjection()]{@link STXChart#removeInjection} to remove it later on.
		 * @return {object} Injection descriptor which can be passed in to {@link STXChart#removeInjection} to remove it later on.
		 */
		STXChart.prototype.append=function(o,n){
			var appends;
			if(this instanceof STXChart){
				appends=this["append"+o];
				if(!appends){
					this["append"+o]=[n];
				}else{
					appends.push(n);
				}
			}else{
				appends=STXChart.prototype["append"+o];
				if(!appends){
					STXChart.prototype["append"+o]=[n];
				}else{
					appends.push(n);
				}
			}
			return {method:"append"+o, func:n};
		};

		/**
		 * Removes a specific injection.
		 * @param  {Object} id The injection descriptor returned from {@link STXChart#prepend} or {@link STXChart#append}
		 * @since 07/01/2015
		 * @memberOf  STXChart
		 */
		STXChart.prototype.removeInjection=function(id){
			var method=id.method;
			var i;
			if(this instanceof STXChart){
				if(!this[method]) return;
				for(i=0;i<this[method].length;i++){
					if(this[method][i]==id.func){
						this[method].splice(i,1);
						return;
					}
				}
			}else{
				if(!STXChart.prototype[method]) return;
				for(i=0;i<STXChart.prototype[method].length;i++){
					if(STXChart.prototype[method][i]==id.func){
						STXChart.prototype[method].splice(i,1);
						return;
					}
				}
			}
		};
		/**
		 * Removes custom developer functionality from an internal chart member. Will remove any and all appends or prepends.
		 * @param  {string} o Signature of member
		 * @memberOf  STXChart
		 */
		STXChart.prototype.remove=function(o){
			if(this instanceof STXChart){
				delete this["append"+o];
				delete this["prepend"+o];
			}else{
				delete STXChart.prototype["append"+o];
				delete STXChart.prototype["prepend"+o];
			}
		};

		STXChart.registeredContainers=[];	// This will contain an array of all of the STX container objects
		// Note that if you are dynamically destroying containers in the DOM you should delete them from this array when you do so

		/**
		 * @deprecated Use STX.ScrollManager.attachRightClick
		 */
		STXChart.handleContextMenu=function(e){ // This code prevents the browser context menu from popping up if you right click on a drawing or overlay
			if(!e) e=event;
			for(var i=0;i<STXChart.registeredContainers.length;i++){
				var stx=STXChart.registeredContainers[i].stx;
				if(stx){
					if(stx.anyHighlighted){
						if(e.preventDefault) e.preventDefault();
						return false;
					}
				}
			}
		};


		/**
		 * Convenience function to iterate through the charts masterData and add a data member. Generally used for additional comparison or study symbols.
		 * Can be used with any data object array which contains at least the 'DT' ( date in epoch format) and 'Close' ( close/last price ) elements.
		 * The data member will be the string defined by "symbol".
		 * Dates must be exact matches (minutes, hours, seconds, milliseconds) in order to show up in comparisons.
		 * @param  {STXChart} stx        	A chart object
		 * @param  {String} [label]     	The new member name to add to masterData. masterData[label]=data["Close"]. Required unless "fields" is specified.
		 * @param  {Array} data 			The data to add (which should align or closely align with the chart data by date)
		 * @param {Array} [fields] 			The fields from the data objects to extract (as opposed to "Close") and add to the new label member. One label member will be added per field. Takes precedence over `createObject` flag.
		 * @param {Boolean} [createObject] 	If true, then data elements from the data array are added as *objects* assigned to the label. Example: member[label]=data[element]; This behavior is mutually exclusive with `fields`.
		 * @param {String} [fieldForLabel] 	If set, this will be the field from data copied into label, if not set, Close is used; This behavior is mutually exclusive with `fields`.
		 * @memberOf STX
		 * @since 04-2015
		 * @example
		 * //data element format if neither fields nor createObject are used
		 * {DT:epoch,Date:strDate,Close:value}
		 * //data element format if fields is used
		 * {DT:epoch,Date:strDate,Field1:value,Field2:value,Field3:value,Field4:value}
		 * //data element format if createObject is used
		 * {DT:epoch,Date:strDate,AnyOtherData:otherData,MoreData:otherData,...}
		 * @since 15-07-01 fieldForLabel argument
		 */
		STX.addMemberToMasterdata=function(stx, label, data, fields, createObject, fieldForLabel){
			// Match up the data and store the data point
			if (!data) return;
			var mIterator=0,cIterator=0;
			while(mIterator<stx.masterData.length && cIterator<data.length){
				var c=data[cIterator];
				var m=stx.masterData[mIterator];
				if(!c.DT) c.DT=STX.strToDateTime(c.Date);
				if(c.DT.getTime()==m.DT.getTime()){
					if(fields){
						for(var i=0;i<fields.length;i++){
							m[fields[i]]=c[fields[i]];
						}
					}else if(createObject){
						m[label]=c;
					}else if(fieldForLabel){
						m[label]=c[fieldForLabel];
					}else if (stx.layout.adj && typeof c.Adj_Close!="undefined") {
						m[label]=c.Adj_Close;
					}else{
						m[label]=c.Close;
					}
					cIterator++;
					mIterator++;
					continue;
				}
				if(c.DT<m.DT) cIterator++;
				else mIterator++;
			}
		};


		/**
		 * Base class for Quotes infrastructure. Many of the built in UI capabilities such as comparison charts and mult-symbol studies expect
		 * to follow this infrastructure. You should define your own classes that follow this pattern
		 * in order to adapt your quote feed to make the most use of the built in componentry.
		 * <P>See {@link STXChart#attachQuoteFeed} for details on how to attach a QuoteFeed to your chart.</P>
		 * <P>See {@tutorial Data Loading} for a complete tutorial on how to load data into your charts.</P>
		 * <P>**Note:** please review the following tutorial about data accessibility before attempting to request data from the browser : {@tutorial Integrating Third Party Data Feeds}<P>

		 * @name  STX.QuoteFeed
		 * @constructor
		 */
		STX.QuoteFeed=function(){};

		/**
		 * This function MUST be used with the fetch method to return any results back to the chart (errors, or the data used to update the chart) -- this is a requirement.
		 * Failure to use this callback will affect the chart's ability to autorefresh and properly render.
		 *
		 * @callback STX.QuoteFeed~dataCallback
		 * @param response
		 * @param {string} response.error			Null if no error, otherwise an error message.
		 * @param {array} response.quotes			An array of Quotes in required JSON format if no error.
		 * @param {boolean} [response.moreAvailable]	Set this to `true` to enable pagination when user scrolls off the left of the chart if more data will be available from the quote feed. Set to `false` if the quote feed has exhausted the historical data for the instrument requested.
		 * @param {object} [response.attribution]		This object will be assigned to `stx.chart.attribution` and can be used by your UI to display market source and mode. See example.
		 * @memberOf  STX.QuoteFeed
		 * @example
		 * cb({quotes:[--array of quote elements here--], moreAvailable:true, attribution:{source:"delayed", exchange:"NYSE"}});
		 * @example
		 * cb({error:"Your error message here"});
		 * @example
		 * // have your quotefeed callback call the attribution function.
			var quoteBehavior={
			  refreshInterval: 1,
			  callback: function(params){
				  showAttribution(params.stx);
			  }
			};
		 * // after very data call, the attribution function will be called and you can then use it to display any message regarding the quote feed
			function showAttribution(stx){
				var source=stx.chart.attribution.source;
				var exchange= stx.chart.attribution.exchange;
				var message = exchange + " quotes are "+ source;
				// add your code here to display the message on your screen.
			}
		 */

		/**
		 * The charting engine will call this method whenever it needs data from your feed.
		 * Override this with your implementation to fetch data from your server.
		 * <br>See full implementation outline and demo engine example in stx.js and a fully functinal jsfiddle at {@link http://jsfiddle.net/chartiq/qp33kna7}.
		 * <br>See {@tutorial Data Loading} tutorial for complete usage details and examples.
		 *
		 * **Important:** All data returned in the array must be sorted in ascending order. yourData[0] must be the oldest and yourData[length] must be the newest element in the dataset.
		 *
		 * @param  {object}   params					-Describes the data requested by the chart. You must return exactly what is requested.
		 * @param {STXChart} params.stx 				-The chart object requesting data
		 * @param {string} params.symbol 				-The symbol to fetch. If your chart was created with a symbol Object instead of a symbol string, you can access it in params.stx.chart.symbolObject
		 * @param {string} [params.symbolObject] 		-The symbol to fetch in object format; if a symbolObject is initalized ( see {@link STXChart#newChart}, {@link STXChart#addSeries}, {@link STX.Comparison.add} )
		 * @param {number} params.period 				-The timeframe each returned object represents. For example, if using interval "minute", a period of 30 means your feed must return ticks (objects) with dates 30 minutes apart; where each tick represents the aggregated activity for that 30 minute period. **Note that this will not always be the same as the period set in {@link STXChart#setPeriodicityV2}, since it represents the aggregation of the raw data to be returned by the feed server, rather than the final data to be displayed.**
		 * @param {string} params.interval 				-The type of data your feed will need to provide. Allowable values: "millisecond,"second","minute","day","week","month". (This is **not** how much data you want the chart to show on the screen; for that you can use {@link STXChart#setRange} or {@link STXChart#setSpan})
		 * @param {Date} [params.startDate] 			-The starting datetime. This will be sent when the chart requires an update to add more data at the right side of the chart. Your feed should return any new ticks it has starting from this date. This is also used in combination with endDate when the chart needs a specific date range of data for comparisons. Your feed should return the entire range specified, regardless of ticks. If no start or end dates are sent, your feed should return the number of  most current bars requested in `ticks`
		 * @param {Date} [params.endDate] 				-The ending datetime. This will be sent when the chart is executing a "loadMore" pagination operation. Your feed should return the requested number of historical ticks with the most current date not newer than this date. This is also used in combination with startDate when the chart needs a specific date range of data for comparisons. Your feed should return the entire range specified, regardless of ticks. If no start or end dates are sent, your feed should return the number of  most current bars requested in `ticks`
		 * @param {Boolean} [params.update]				-This will be true when the chart requires a refresh. params.startDate will also be set.
		 * @param {Boolean} [params.fetchMaximumBars]	-If set to true, the chart requires as much historical data as is available from the feed (params.ticks may also be set to 20,000 to set a safety max), regardless of start date. This is needed for some chart types since they aggregate data (kagi,renko, or linebreak, for example). Developers implementing fetch, should override params.tick and use a smaller number if their feed can't support that much data being sent back. The engine will then make multiple smaller calls to get enough data to fill the screen.
		 * @param {number} params.ticks 				-The number of ticks required to fill the chart screen. It is suggested to return 3 times this amount to prevent excessive quote feed requests when user paginates. This can be used to determine how much data to fetch when a date range is not requested (initial load) . Less ticks can be returned if your feed can not support the requested amount, and the engine will make additional calls to try to get the rest of the data. If a date range is requested, you must return the entire range regardless of ticks. If an `update` is requested (strtDate only) you can ignore the number of `ticks` and return the most current data you have.
		 * @param  {STX.QuoteFeed~dataCallback} cb		-Call this function with the results (or error) of your data request, and an indicator back to the engine indicating if there is more historical data available.
		 * @abstract
		 * @memberOf  STX.QuoteFeed
		 * @since
		 * <br> 04-2015 -- must take into account the scenario where a date range is sent in the params (params.startDate && params.endDate) to fill in a gap in the masterData array. Usually used for series or studies.
		 * <br>- 2015-11-1 `paras.symbolObject` is now available
		 */
		STX.QuoteFeed.prototype.fetch=function(params, cb){
			console.log("You must implement STX.QuoteFeed.[yourfeedname].prototype.fetch()");
		};

		/**
		 * Whenever an error occurs the params and dataCallback from fetch will be automatically passed to this method by the quote engine.
		 * Use this to alert the user if desired.
		 * Override this with your own alerting mechanisms.
		 * @param  {object} params The params originally passed into fetch()
		 * @param {object} dataCallback The data returned to fetch
		 * @memberOf  STX.QuoteFeed
		 * @example
		 * 	STX.MyQuoteFeed.prototype.announceError=function(params, dataCallback){
		 *		if(params.startDate){
		 *			// Perhaps some sort of "disconnected" message on screen
		 *		}else if(params.endDate){
		 *			// Perhaps something indicating the end of the chart
		 *		}else{
		 *			STX.alert("Error fetching quote:" + dataCallback.error);	// Probably a not found error?
		 *		}
		 *	};
		 */
		STX.QuoteFeed.prototype.announceError=function(params, dataCallback){
			if(params.suppressErrors || dataCallback.suppressAlert) return;
			if(params.startDate){
				// Perhaps some sort of "disconnected" message on screen
			}else if(params.endDate){
				// Perhaps something indicating the end of the chart
			}else if(dataCallback.error){
				STX.alert("Error fetching quote:" + dataCallback.error);
			}else{
				//STX.alert("Error fetching quote:" + params.symbol);	// Probably a not found error?
			}
		};

		/**
		 * Fetches multiple quotes asynchronously, possibly from various data sources. This method is used to update a chart with multiple symbols
		 * such as a comparison chart.
		 * @param  {array}   arr Array of stock symbols
		 * @param  {Function} cb  Function to callback when quotes are fetched. Will be passed an array of results. Each result is an object {dataCallback, params}.
		 * @memberOf  STX.QuoteFeed
		 */
		STX.QuoteFeed.prototype.multiFetch=function(arr, cb){
			if(arr.length===0) cb([]);

			var tracker={
				counter:0,
				finished: arr.length,
				results: []
			};

			function handleResponse(params, tracker, cb){
				return function(dataCallback){
					tracker.results.push({dataCallback:dataCallback, params: params});
					tracker.counter++;
					if(tracker.counter>=tracker.finished){
						var results=tracker.results;
						tracker.results=[];
						cb(results);
					}
				};
			}
			for(var i=0;i<arr.length;i++){
				var params=arr[i];
				if(params.stx.isEquationChart(params.symbol)){  //equation chart
					STX.fetchEquationChart(params, handleResponse(params, tracker, cb));
				}else{
					this.fetch(params, handleResponse(params, tracker, cb));
				}
			}
		};


		/**
		 * A QuoteFeed that maintains a list of subscribed symbols and provides
		 * callbacks for when to subscribe or unsubscribe.
		 *
		 * A subscription is uniquely defined by a params object accepted by {@link STX.QuoteFeed#fetch}:
		 * {
		 * 	symbolObject:
		 * 	period:
		 * 	interval:
		 * }
		 * @name  STX.QuoteFeed.Subscriptions
		 * @constructor
		 */
		STX.QuoteFeed.Subscriptions=function(){
			this.subscriptions=[];
		};

		STX.QuoteFeed.Subscriptions.stxInheritsFrom(STX.QuoteFeed);

		STX.QuoteFeed.Subscriptions.prototype.checkSubscriptions=function(stx){
			var sub, need;
			var chartNeeds=stx.getSymbols();

			// reset subscription match status
			for(var s=0;s<this.subscriptions.length;s++){
				this.subscriptions[s].match=false;
			}

			for(var i=0;i<chartNeeds.length;i++){
			// Convert kernel periodicity/interval/timeUnit to feed format
				need=chartNeeds[i];
				var interval=need.interval;
				// If we're rolling our own months or weeks then we should ask for days from the quote feed
				if((interval=="month" || interval=="week") && !stx.dontRoll){
					interval="day";
				}

				need.interval=interval;
				need.period=1;
				delete need.periodicity; // to avoid confusion
				delete need.timeUnit; // to avoid confusion
				delete need.setSpan; // to avoid confusion
				need.match=false;

				if(!isNaN(need.interval)){	// normalize numeric intervals into "minute" form
					need.period=need.interval;
					need.interval=need.timeUnit;
					if(!need.interval) need.interval="minute";
				}
				need.timeUnit=null;

				for(s=0;s<this.subscriptions.length;s++){
					sub=this.subscriptions[s];
					if(STX.equals(sub, need, {match:true})){
						need.match=true;
						sub.match=true;
						break;
					}
				}
			}
			//console.log(this.subscriptions);
			//console.log(chartNeeds);

			var self=this;
			// unsubscribe to any symbols no longer matched, and remove them from subscriptions
			this.subscriptions=this.subscriptions.filter(function(c){
				if(!c.match){
					self.unsubscribe(c);
				}
				return c.match;
			});

			chartNeeds.forEach(function(c){
				if(!c.match){
					self.subscribe(c);
					self.subscriptions.push(c);
				}
			});
		};

		STX.QuoteFeed.Subscriptions.prototype.fetch=function(params, cb){
			var self=this;
			this.fetchFromSource(params, function(results){
				if(!results.error){
					self.checkSubscriptions(params.stx);
				}
				cb(results);
			});
		};

		STX.QuoteFeed.Subscriptions.prototype.subscribe=function(params){
			console.log("subscribe",params);
		};

		STX.QuoteFeed.Subscriptions.prototype.unsubscribe=function(params){
			console.log("unsubscribe",params);
		};

		STX.QuoteFeed.Subscriptions.prototype.fetchFromSource=function(params, cb){
			console.log("Please provide implementation of fetchFromSource");
		};

		/* Copy and paste STX.QuoteFeed.CopyAndPasteMe. Change "CopyAndPasteMe" to the name
		of your quote service. Then implement the fetch() method based on the included comments */

		STX.QuoteFeed.CopyAndPasteMe=function(){};

		STX.QuoteFeed.CopyAndPasteMe.stxInheritsFrom(STX.QuoteFeed.Subscriptions);

		STX.QuoteFeed.CopyAndPasteMe.prototype.fetchFromSource=function(params, cb){

			// This is an outline for how to implement fetch in your custom feed. Cut and paste
			// this code and then implement. Leave any portion blank that you cannot support.
			// 
			// Most quote feeds will support startDate and endDate. This will be enough to implement
			// charts. It is also possible to implement charts with quote feeds that support other
			// request parameters but you may need to do some manipulation within this code to
			// accomplish this.
			// 
			// See STX.QuoteFeed.Demo or STX.QuoteFeed.EndOfDay below for actual implementations.

			if(params.startDate && params.endDate){
				// If you receive both a startDate and endDate then the chart is asking for a
				// specific data range. This usually happens when a comparison symbol has been
				// added to the chart. You'll want the comparison symbol to show up on all the same
				// bars on the screen.
				// 
				// You should return data for the entire range, otherwise you could get a gap of data on the screen.
			} else if(params.startDate){
				// This means the chart is asking for a refresh of most recent data.
				// (This is streaming by "polling". For actual push based streaming see {@link STXChart#streamTrade} and {@link STXChart.appendMasterData}.
				// 
				// The chart will call this every X seconds based on what you have specified in behavior.refreshInterval
				// when you initially attached the quote feed to stxx (attachQuoteFeed).
				// 
				// If you don't support polling then just do nothing and return.
				// Otherwise fetch your data, probably using Ajax, and call the cb method with your data.
				// 
				// Please note that you may need to return more than 1 bar of data. If the chart has moved
				// forward then the requested startDate will be the previous bar (to finalized the bar) and
				// you should return that bar as well as the current (new) bar. To simplify, always return
				// all of the bars starting with startDate and ending with the most recent bar.
			}else if(params.endDate){
				// If you only receive an endDate, it means the user has scrolled past the end of
				// the chart. The chart needs older data, if it's available.
				// If you don't support pagination just return and do nothing.
				// 
				// Note: If your server requires a startDate then you'll need to calculate one here. A simple method
				// would be to take the endDate and then, using JavaScript Date math, create a date that is far enough
				// in the past based on params.period, params.interval and params.ticks. @todo, provide a convenience method
				// 
				// Otherwise fetch your data, probably using Ajax, and call the call with cb method with your data.
			}else{
				// The chart needs an initial load.
				// 
				// params.tick provides an suggested number of bars to retrieve to fill up the chart
				// and provide some bars off the left edge of the screen. It's good to provide more initial
				// data than just the size of the chart because many users will immediately zoom out. If you
				// have extra data off the left edge of the chart, then the zoom will be instantaneous. There
				// is very little downside to sending extra data.
				// 
				// You do not need to retrieve exactly params.tick number of bars. This is a suggestion.
				// You can return as many as you want. Fetching 1,000 bars is another good approach. This will
				// cover the immediate zooming and panning needs of 95% of users.
				//
				// Note: If your server requires startDate and endDate then use Date.now() for the endDate
				// and calculate a startDate using JavaScript Date math. params.period, params.interval and params.ticks
				// provide all the variables necessary to do the math. @todo, provide a convenience method
				// 
				// Fetch your data, probably using Ajax, and call the cb method with yourdata. This
				// is where you'll need to reformat your data into the format required by the chart.
				// 
				//  Put your code here to format the response according to the specs and return it in the callback.
				//
				//	Example code:
				//	
				// STX.postAjax(url, null, function(status, response){
				//	if(status!=200){
				//		cb({error:status});	// something went wrong, use the callback function to return your error
				//		return;
				//	}
				//	
				//	var quotes=formatQuotes(response);
				//	var newQuotes=[];
				//	for(var i=0;i<quotes.length;i++){
				//		newQuotes[i]={};
				//		newQuotes[i].Date=quotes[i][0]; // Or set newQuotes[i].DT if you have a JS Date
				//		newQuotes[i].Open=quotes[i][1];
				//		newQuotes[i].High=quotes[i][2];
				//		newQuotes[i].Low=quotes[i][3];
				//		newQuotes[i].Close=quotes[i][4];
				//		newQuotes[i].Volume=quotes[i][5];
				//		newQuotes[i].Adj_Close=quotes[i][6];
				//	}
				//  cb({quotes:newQuotes, moreAvailable:false}); // set moreAvailable to true or false if your server supports fetching older data, and you know that older data is available.
				// });
				// 
			}
		};

		STX.QuoteFeed.CopyAndPasteMe.prototype.subscribe=function(params){
			// This will get called each time the chart encounters a new symbol. This
			// could happen from a user changing symbol, a user adding a comparison symbol,
			// a new study that requires a new symbol.
			// 
			// You can use this along with unsubscribe() to keep track for the purpose
			// of maintaining legends, lists of securities, or to open or close streaming
			// connections.
			// 
			// If using a push streamer, subscribe to this security and then have the push
			// streamer push updates using {@link STXChart#streamTrade} if you have
			// a "last trade" stream or {@link STXChart@appendMasterData} if you have an "OHLC" stream.
			// 
			// Use params.interval, params.period, params.symbolObject to inform your streamer
			// what it needs to send
		};

		STX.QuoteFeed.CopyAndPasteMe.prototype.unsubscribe=function(params){
			// When a chart no longer needs to keep track of a symbol it will call
			// unsubscribe(). You can use this to tell your streamer it no longer
			// needs to send updates.
		};


		/**
		 * Demo version of quotes which uses EOD data. See full demo code in stx.js.
		 * @name  STX.QuoteFeed.Demo
		 * @constructor
		 */
		STX.QuoteFeed.Demo=function(){
		};

		STX.QuoteFeed.Demo.stxInheritsFrom(STX.QuoteFeed.Subscriptions);

		/**
		 * This is a demo version of fetch. You will need to create one for your own quote feed that behaves similarly.
		 * @memberOf  STX.QuoteFeed.Demo
		 */
		STX.QuoteFeed.Demo.prototype.fetchFromSource=function(params, cb){

			if(params.startDate && params.endDate ){
				//date range
				if(params.interval=="minute" || params.interval=="second" || params.interval=="millisecond"){
					this.generateIntradayRange(params, cb);
				} else {
					this.generateDaily(params, cb);
				}
				return;
			} else if(params.startDate ){
				// new update
				if(params.interval=="minute" || params.interval=="second" || params.interval=="millisecond"){
					this.update(params, cb);
				}else{
					cb({error:"STX.QuoteFeed.Demo does not support updates for daily charts"});
				}
				return;
			} else if(params.endDate){
				// pagination
				if(params.interval=="minute" || params.interval=="second" || params.interval=="millisecond"){
					this.loadMore(params, cb);
				}else{
					cb({error:"STX.QuoteFeed.Demo does not support loadMore for daily charts"});
				}
				return;
			} else {
				// initial load
				if(params.interval=="minute" || params.interval=="second" || params.interval=="millisecond"){
					this.generateIntraday(params, cb);
				} else {
					this.generateDaily(params, cb);
				}
				return;
			}
		};


		/**
		 * Creates a random update. Note that updates are returned as an array. You should check params.startDate to decide
		 * the starting point for an update.
		 * @memberOf  STX.QuoteFeed.Demo
		 */
		STX.QuoteFeed.Demo.prototype.update=function(params, cb){

			if (!this.market.isOpen()) return;

			var masterData=params.stx.chart.masterData;
			var current=masterData[masterData.length-1];
			var previous=masterData[masterData.length-2];

			var ms=this.market.marketZoneNow().getTime();
			var divisor=60*1000;
			if(params.interval=="second") divisor=1000;
			if(params.interval=="millisecond") divisor=1;
			ms=ms-ms%(params.period*divisor); // move to evenly divided bar
			var now=new Date(ms);

			var newQuote={};
			newQuote.DT=now; // Or set newQuote.Date if you have a string form date
			var field=params.symbol;
			if(!current[field]){
				if(previous[field]) current=previous; // get series which might be lagging behind a bar
				else field="Close";
			}
			newQuote.Close=Math.round((current[field]-(Math.random()-0.5)*0.8)*100)/100;

			if(ms==masterData[masterData.length-1].DT.getTime()){
				if(field=="Close"){
					newQuote.Open=current.Open;
					newQuote.High=Math.max(current.High, newQuote.Close);
					newQuote.Low=Math.min(current.Low, newQuote.Close);
				}else{
					newQuote.Open=Math.round((current[field]-(Math.random()-0.5)*0.8)*100)/100;;
					newQuote.High=Math.max(newQuote.Open, newQuote.Close);
					newQuote.Low=Math.min(newQuote.Open, newQuote.Close);					
				}
				newQuote.Volume=current.Volume+Math.round(Math.random()*1000);
			}else{
				newQuote.Open=newQuote.High=newQuote.Low=newQuote.Close;
				newQuote.Volume=1000;
			}
			cb({quotes:[newQuote], moreAvailable:false, attribution:{source:"demo", exchange:"RANDOM"}});
		};

		STX.QuoteFeed.Demo.prototype.randomQuote=function(seed){
			var Open=seed-(Math.random()-0.5)*2;
			var Close=seed-(Math.random()-0.5)*2;
			var High=Math.max(seed-(Math.random()-0.5)*2, Open, Close);
			var Low=Math.min(seed-(Math.random()-0.5)*2, Open, Close);
			var newQuote={
				Open: Math.round(Open*100)/100,
				Close: Math.round(Close*100)/100,
				High: Math.round(High*100)/100,
				Low: Math.round(Low*100)/100
			};
			// Reasonable random volume generator. Higher volumes for red candles.
			if(newQuote.Close<newQuote.Open){
				newQuote.Volume=1000000+Math.round(Math.random()*1500000);
			}else{
				newQuote.Volume=1000000+Math.round(Math.random()*300000);
			}
			return newQuote;
		};


		/**
		 * Creates daily data for the chart
		 * @memberOf  STX.QuoteFeed.Demo
		 */
		STX.QuoteFeed.Demo.prototype.generateDaily=function(params, cb){
			function setQuotes(response){
				var varName=response.substr(0,response.indexOf("="));
				var valueToParse=response.substring(response.indexOf(varName+"=")+(varName+"=").length,response.length-1);
				try{
					return JSON.parse(valueToParse.replace(/,0+/g,",0").replace(/,[.]/g,",0.").replace(/;/g,""));
				}catch(e){
					return [];
				}
			}

			var symbol=params.symbol.toUpperCase();
			if(symbol.charAt(0)!="^" && STX.Market.Symbology.isForexSymbol(symbol)) symbol="^"+symbol;
			var url="https://demoquotes.chartiq.com/" + symbol;
			STX.postAjax(url, null, function(status, response){
				if(status!=200){
					cb({error:status});
					return;
				}
				var quotes=setQuotes(response);
				var newQuotes=[];
				for(var i=0;i<quotes.length;i++){
					newQuotes[i]={};
					newQuotes[i].Date=quotes[i][0]; // Or set newQuotes[i].DT if you have a JS Date
					newQuotes[i].Open=quotes[i][1];
					newQuotes[i].High=quotes[i][2];
					newQuotes[i].Low=quotes[i][3];
					newQuotes[i].Close=quotes[i][4];
					newQuotes[i].Volume=quotes[i][5];
					newQuotes[i].Adj_Close=quotes[i][6];
				}
				params.noUpdate=true;   //Daily demo quotes do not support updates
				cb({quotes:newQuotes, moreAvailable:false, attribution:{source:"demo", exchange:"RANDOM"}}); // set moreAvailable to true so that the chart will request more when scrolling into the past. Set to false if at the end of data.
			});
		};


		/**
		 * Creates a random intraday chart (uses STX.Market to be market hours aware)
		 * @memberOf  STX.QuoteFeed.Demo
		 */
		STX.QuoteFeed.Demo.prototype.generateIntraday=function(params, cb){
			if(params.stx.marketFactory) {
				params.stx.setMarket(params.stx.marketFactory(params.symbolObject),params.stx.chart);
			}
			this.market = params.stx.chart.market;

			var seed=155.43;
			var quotes=[];
			var ticksToLoad=params.ticks*3; // load extra to fill up space before chart
			if( ticksToLoad > 2000 ) ticksToLoad =2000; // demo data could be slow for very large data sets since it recursively calls iter.previous() wich is not inteded to be uses this way normally
			if(isNaN(ticksToLoad)) ticksToLoad=params.stx.chart.dataSet.length;

			var ms=this.market.marketZoneNow().getTime();
			var divisor=60*1000;
			if(params.interval=="second") divisor=1000;
			if(params.interval=="millisecond") divisor=1;
			ms=ms-ms%(params.period*divisor); // move to evenly divided bar
			var now=new Date(ms);

			var iter = this.market.newIterator(
					{
						'begin': now,
						'interval': params.stx.layout.interval,
						'periodicity': params.stx.layout.periodicity,
						'timeUnit': params.stx.layout.timeUnit,
						'inZone': params.stx.dataZone,
						'outZone': params.stx.dataZone
					}
			);

			if (!this.market.isOpen()) now = iter.previous();
			// if we are only loading market hours, we may reach today's date before the number of max ticks.
			// So we go backwards based on ticks and not date, then reverse the array.
			for(var i=0;i<ticksToLoad ;i++){
				var newQuote=this.randomQuote(seed);
				newQuote.DT=new Date(now);
				newQuote.Volume=Math.round(newQuote.Volume*params.period/500);
				quotes.push(newQuote);
				now = iter.previous();
				//console.log(now);
				seed=newQuote.Close;
			}

			cb({quotes:quotes.reverse(), moreAvailable:true, attribution:{source:"demo", exchange:"RANDOM"}}); // set moreAvailable to true so that the chart will request more when scrolling into the past. Set to false if at the end of data.
		};

		/**
		 * Creates a random intraday range of data for a chart
		 * @memberOf  STX.QuoteFeed.Demo
		 */
		STX.QuoteFeed.Demo.prototype.generateIntradayRange=function(params, cb){

			var seed=155.43;
			var quotes=[];

			var now=new Date(params.startDate);

			var iter = this.market.newIterator(
					{
						'begin': now,
						'interval': params.stx.layout.interval,
						'periodicity': params.stx.layout.periodicity,
						'timeUnit': params.stx.layout.timeUnit,
						'inZone': params.stx.dataZone,
						'outZone': params.stx.dataZone
					}
			);

			while (now <=params.endDate){
				var newQuote=this.randomQuote(seed);
				newQuote.DT=new Date(now);
				newQuote.Volume=Math.round(newQuote.Volume*params.period/500);
				quotes.push(newQuote);
				now = iter.next();
				seed=newQuote.Close;
			}

			cb({quotes:quotes,moreAvailable:true, attribution:{source:"demo", exchange:"RANDOM"}});
		};

		/**
		 * Loads more random data when the user scrolls back.
		 * @memberOf  STX.QuoteFeed.Demo
		 */
		STX.QuoteFeed.Demo.prototype.loadMore=function(params, cb){

			var firstQuote=params.chart.masterData[0];
			var i;
			for(i=0;i<params.chart.masterData.length;i++){
				if(params.chart.masterData[i].DT.getTime()>=params.endDate.getTime()){
					firstQuote=params.chart.masterData[i];
					if( firstQuote[params.symbol] || firstQuote.Close) break;
				}
			}
			var field=params.symbol;
			if ( !firstQuote[field] ) field="Close";
			var seed=firstQuote[field];
			var quotes=[];

			var iter = this.market.newIterator(
					{
						'begin': params.endDate,
						'interval': params.stx.layout.interval,
						'periodicity': params.stx.layout.periodicity,
						'timeUnit': params.stx.layout.timeUnit,
						'inZone': params.stx.dataZone,
						'outZone': params.stx.dataZone
					}
			);

			now = new Date(iter.previous());
			for(i=0;i<params.ticks;i++){
				var newQuote=this.randomQuote(seed);
				newQuote.DT=new Date(now);
				if(params.interval=="minute") newQuote.Volume=Math.round(newQuote.Volume*params.period/500);
				quotes.push(newQuote);
				now = iter.previous();
				seed=newQuote.Close;
			}
			quotes.reverse();

			cb({quotes:quotes, moreAvailable:true, attribution:{source:"demo", exchange:"RANDOM"}}); // set moreAvailable to true so that the chart will request more when scrolling into the past. Set to false if at the end of data.
		};


		STX.QuoteFeed.ChartIQEOD=function(urlQuick, urlFull){
			this.urlQuick=urlQuick;
			this.urlFull=urlFull;
		};

		STX.QuoteFeed.ChartIQEOD.stxInheritsFrom(STX.QuoteFeed);

		/**
		 * EOD quotes from ChartIQ. You'll need to get a valid url from ChartIQ to use this.
		 * @memberOf  STX.QuoteFeed.ChartIQEOD
		 */
		STX.QuoteFeed.ChartIQEOD.prototype.fetch=function(params, cb){
			function setQuotes(response){
				var varName=response.substr(0,response.indexOf("="));
				var valueToParse=response.substring(response.indexOf(varName+"=")+(varName+"=").length,response.length-1);
				try{
					return JSON.parse(valueToParse.replace(/,0+/g,",0").replace(/,[.]/g,",0.").replace(/;/g,""));
				}catch(e){
					return [];
				}
			}

			if(params.startDate && !params.endDate){
				cb({error:"STX.QuoteFeed.ChartIQEOD does not support updates for daily charts"});
				return;
			}
			if(params.endDate && !params.loadMoreReplace){
				cb({error:"STX.QuoteFeed.ChartIQEOD does not support loadMore for daily charts"});
				return;
			}
			if(params.interval=="minute"){
				cb({error:"STX.QuoteFeed.ChartIQEOD does not support intraday charts"});
				return;
			}
			var symbol=params.symbol.toUpperCase();
			if(symbol.charAt(0)!="^" && STX.Market.Symbology.isForexSymbol(symbol)) symbol="^"+symbol;
			var url=this.urlQuick;
			if(params.endDate && params.loadMoreReplace) url=this.urlFull;
			else if((new Date().getTime()-1333238400000)/86400000<params.ticks) url=this.urlFull;  // start predates quick cache
			if(!url) url=this.urlQuick+"/pts";
			STX.postAjax(url+"/"+symbol.toUpperCase(), null, function(status, response){
				if(status!=200){
					cb({error:status});
					return;
				}
				var quotes=setQuotes(response);
				var newQuotes=[];
				for(var i=0;i<quotes.length;i++){
					newQuotes[i]={};
					newQuotes[i].Date=quotes[i][0]; // Or set newQuotes[i].DT if you have a JS Date
					newQuotes[i].Open=quotes[i][1];
					newQuotes[i].High=quotes[i][2];
					newQuotes[i].Low=quotes[i][3];
					newQuotes[i].Close=quotes[i][4];
					newQuotes[i].Volume=quotes[i][5];
					newQuotes[i].Adj_Close=quotes[i][6];
				}
				cb({quotes:newQuotes, moreAvailable:!params.endDate, attribution:{source:"chartiq",exchange:"EOD"}});
			});
		};

		/*
		 * Scroller
		 * Based off of http://github.com/zynga/scroller
		 *
		 * Copyright 2011, Zynga Inc.
		 * Licensed under the MIT License.
		 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
		 *
		 * Based on the work of: Unify Project (unify-project.org)
		 * http://unify-project.org
		 * Copyright 2011, Deutsche Telekom AG
		 * License: MIT + Apache (V2)
		 */

		/**
		 * Generic animation class with support for dropped frames both optional easing and duration.
		 *
		 * Optional duration is useful when the lifetime is defined by another condition than time
		 * e.g. speed of an animating object, etc.
		 *
		 * Dropped frame logic allows to keep using the same updater logic independent from the actual
		 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
		 * based on the pure time difference.
		 * @name  STX.Animate
		 * @constructor
		 */
		STX.Animate = function(stx) {
			this.stx = stx;
			this.desiredFrames = 60;
			this.running = {};
			this.counter = 1;
			this.isAnimating = false;
		};

		/**
		 * Animates a change in the chart
		 * @param  {Object} obj Object containing the change states
		 * @param  {Number} [obj.oldCandleWidth]
		 * @param  {Number} [obj.newCandleWidth]
		 * @param  {Number} [obj.oldScroll]
		 * @param  {Number} [obj.newScroll]
		 * @memberof  STX.Animate
		 */
		STX.Animate.prototype.go=function(obj){
			var self=this;
			var step, verify, completed;
			var screenCenter=this.stx.chart.width/2;

			obj.diffCandleWidth=obj.newCandleWidth-obj.oldCandleWidth;
			obj.diffScroll=obj.newScroll-obj.oldScroll;
			obj.centerTick=this.stx.tickFromPixel(screenCenter)/*/this.stx.layout.periodicity*/;
			var keepCentered;
			if(obj.diffScroll>0){
				keepCentered=this.stx.chart.scroll<=this.stx.chart.maxTicks;
			}else{
				keepCentered=this.stx.chart.scroll>this.stx.chart.maxTicks;
			}

			obj.centerTick=keepCentered?Math.round(this.stx.tickFromPixel(this.stx.chart.width/2)):this.stx.chart.dataSet.length-1;
			obj.callback=function(){
				var stx=self.stx;
				if(this.candleWidth){
					var centerOfCandle=stx.pixelFromTick(this.centerTick);
					stx.setCandleWidth(this.candleWidth);
					stx.micropixels=0;

					var px=stx.pixelFromTick(this.centerTick);
					var pxdiff=px-centerOfCandle;
					var scrollDiff=pxdiff/stx.layout.candleWidth;
					var rounded=Math.round(scrollDiff);
					stx.chart.scroll-=rounded;
					stx.microscroll=rounded-scrollDiff;
					stx.micropixels=stx.layout.candleWidth*stx.microscroll;
				}
				/*if(this.scroll){
					var rounded=Math.round(this.scroll);
					stx.microscroll=rounded-this.scroll;
					stx.micropixels=stx.layout.candleWidth*stx.microscroll*-1;
					stx.scroll=rounded;
				}*/
				stx.draw();
			};

			// publishing
			step=function(percent, now, render){ return self.step(percent, now, render, obj);};
			verify=function(id){ return self.verify(id); };
			completed=function(renderedFramesPerSecond, animationId, wasFinished){
				return self.completed(renderedFramesPerSecond, animationId, wasFinished);
			};

			//TODO, decelerating

			// When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
			this.isAnimating = this.start(step, verify, completed, 250, this.isAnimating ? STX.Animate.easeOutCubic : STX.Animate.easeInOutCubic);
			return this.isAnimating;
		};

		STX.Animate.prototype.step=function(percent, now, render, obj) {
			if (render) {
				if(obj.oldCandleWidth) obj.candleWidth = obj.oldCandleWidth + (obj.diffCandleWidth * percent);
				if(obj.oldScroll || obj.oldScroll===0) obj.scroll = obj.oldScroll + (obj.diffScroll * percent);

				if (obj.callback) {
					obj.callback();
				}
			}
		};

		STX.Animate.prototype.verify = function(id) {
			return this.isAnimating === id;
		};

		STX.Animate.prototype.completed = function(renderedFramesPerSecond, animationId, wasFinished) {
			if (animationId === this.isAnimating) {
				this.isAnimating = false;
			}
		};

		STX.Animate.easeOutCubic = function(pos) {
			return (Math.pow((pos - 1), 3) + 1);
		};

		/**
		 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
		 * @memberof  STX.Animate
		**/
		STX.Animate.easeInOutCubic = function(pos) {
			if ((pos /= 0.5) < 1) {
				return 0.5 * Math.pow(pos, 3);
			}

			return 0.5 * (Math.pow((pos - 2), 3) + 2);
		};

		/**
		 * Stops the given animation.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation was stopped (aka, was running before)
		 * @memberof  STX.Animate
		 */
		STX.Animate.prototype.stop = function(id) {
			var cleared = this.running[id] === true;
			if (cleared) {
				this.running[id] = null;
			}

			return cleared;
		};

		/**
		 * Whether the given animation is still running.
		 *
		 * @param id {Integer} Unique animation ID
		 * @return {Boolean} Whether the animation is still running
		 * @memberof  STX.Animate
		 */
		STX.Animate.prototype.isRunning = function(id) {
			return this.running[id] === true;
		};

		/**
		 * Start the animation.
		 *
		 * @param stepCallback {Function} Pointer to function which is executed on every step.
		 *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
		 * @param verifyCallback {Function} Executed before every animation step.
		 *   Signature of the method should be `function() { return continueWithAnimation; }`
		 * @param completedCallback {Function}
		 *   Signature of the method should be `function(droppedFrames, finishedAnimation) {}`
		 * @param duration {Integer} Milliseconds to run the animation
		 * @param easingMethod {Function} Pointer to easing function
		 *   Signature of the method should be `function(percent) { return modifiedValue; }`
		 * @param root {Element | document.body} Render root, when available. Used for internal
		 *   usage of requestAnimationFrame.
		 * @return {Integer} Identifier of animation. Can be used to stop it any time.
		 * @memberof  STX.Animate
		 */
		STX.Animate.prototype.start = function(stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
			var start = Date.now();
			var lastFrame = start;
			var percent = 0;
			var dropCounter = 0;
			var id = this.counter++;

			if (!root) {
				root = document.body;
			}

			// Compacting running db automatically every few new animations
			if (id % 20 === 0) {
				var newRunning = {};
				for (var usedId in this.running) {
					newRunning[usedId] = true;
				}
				this.running = newRunning;
			}

			var self=this;
			// This is the internal step method which is called every few milliseconds
			var step = function(virtual) {
				var render = virtual !== true; // Normalize virtual value
				var now = Date.now();// Get current time

				// Verification is executed before next animation step
				if (!self.running[id] || (verifyCallback && !verifyCallback(id))) {
					self.running[id] = null;
					if(completedCallback) completedCallback(self.desiredFrames - (dropCounter / ((now - start) / 1000)), id, false);
					return;
				}

				// For the current rendering to apply let's update omitted steps in memory.
				// This is important to bring internal state variables up-to-date with progress in time.
				if (render) {
					var droppedFrames = Math.round((now - lastFrame) / (1000 / self.desiredFrames)) - 1;
					for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
						step(true);
						dropCounter++;
					}
				}

				// Compute percent value
				if (duration) {
					percent = (now - start) / duration;
					if (percent > 1) {
						percent = 1;
					}
				}

				var value = easingMethod ? easingMethod(percent) : percent;
				if ((stepCallback(value, now, render) === false || percent === 1) && render) {
					self.running[id] = null;
					if(completedCallback) completedCallback(self.desiredFrames - (dropCounter / ((now - start) / 1000)), id, percent === 1 || duration === null || typeof(duration)=="undefined");
				} else if (render) {
					lastFrame = now;
					requestAnimationFrame(step, root);
				}
			};

			this.running[id] = true;
			requestAnimationFrame(step, root);

			return id;
		};

		/**
		 * A simple device to make ease functions easy to use. Requests a cubic function that takes the form function (t, b, c, d)
		 * 		t = current time
		 * 		b = starting value
		 * 		c = change in value
		 * 		d = duration
		 * @param {Function} fc        The cubic function
		 * @param {Number} ms         Milliseconds to perform the function
		 * @param {Map} [startValues] Name value pairs of starting values (or pass in a single value)
		 * @param {Map} [endValues]   Name value pairs of ending values (or pass in a single value)
		 * @name  STX.EaseMachine
		 * @constructor
		 * @example
		 * var e=new STX.EaseMachine(Math.easeInOutCubic, 200);
		 * e.run(function(v){console.log(v)}, 100, 110);
		 */
		STX.EaseMachine=function(fc, ms, startValues, endValues){
			this.fc=fc;
			this.ms=ms;
			if(startValues || startValues===0){
				this.reset(startValues, endValues);
			}
		};

		/**
		 * Resets the EaseMachine with a new set of values
		 * @param {Map} [startValues] Name value pairs of starting values (or pass in a single value). If null then the currentValues will become the startValues (allowing for resetting or reversing of direction)
		 * @param {Map} endValues   Name value pairs of ending values (or pass in a single value)
		 * @memberOf  STX.EaseMachine
		 */
		STX.EaseMachine.prototype.reset=function(startValues, endValues){
			if(!startValues && startValues!==0) startValues=this.currentValues;
			this.hasCompleted=false;
			this.running=false;
			this.okayToRun=true;
			this.useNameValuePairs=(typeof endValues=="object");
			this.startTime=Date.now();
			if(this.useNameValuePairs){
				this.startValues=startValues;
				this.endValues=endValues;
			}else{
				this.startValues={"default": startValues};
				this.endValues={"default": endValues};
			}
			this.changeValues={};
			this.currentValues={};
			for(var n in this.startValues){
				this.changeValues[n]=this.endValues[n]-this.startValues[n];
			}
		};

		/**
		 * Returns the next set of values, or individual value
		 * @return {Map} Name value pairs of current values or current value
		 * @memberOf  STX.EaseMachine
		 */
		STX.EaseMachine.prototype.next=function(){
			var now=Date.now();
			if(now>=this.startTime+this.ms){
				now=this.startTime+this.ms;
				this.hasCompleted=true;
				this.running=false;
			}
			this.currentValues={};
			for(var n in this.changeValues){
				this.currentValues[n]=this.fc(now-this.startTime, this.startValues[n], this.changeValues[n], this.ms);
			}
			if(!this.useNameValuePairs) return this.currentValues["default"];
			return this.currentValues;
		};

		/**
		 * This will be true when the cubic has completed
		 * @type {Boolean}
		 * @memberOf  STX.EaseMachine
		 */
		STX.EaseMachine.prototype.hasCompleted=false;


		/**
		 * Runs the ease machine in a loop until completion by calling next() from within a requestAnimationFrame.
		 * @param {Function} fc Function callback, will receive the results of {@link STX.EaseMachine#next}
		 * @param {Map} [startValues] Name value pairs of starting values (or pass in a single value)
		 * @param {Map} [endValues]   Name value pairs of ending values (or pass in a single value)
		 * @param {Boolean} [delayFirstRun=false] Normally, the first pass of the run will happen immediately. Pass true if you want to wait for the next animation frame before beginning.
		 * @memberOf  STX.EaseMachine
		 */
		STX.EaseMachine.prototype.run=function(fc, startValues, endValues, delayFirstRun){
			if(this.afid) cancelAnimationFrame(this.afid);
			this.running=true;
			if(startValues || startValues===0){
				this.reset(startValues, endValues);
			}else if(endValues || endValues===0){
				this.reset(this.currentValues, endValues);
			}
			var self=this;
			function go(){
				self.afid=null;
				if(!self.okayToRun) return;
				var result=self.next();
				fc(result);
				if(self.hasCompleted) return;
				self.afid=requestAnimationFrame(go);
			}
			if(delayFirstRun)
				this.afid=requestAnimationFrame(go);
			else
				go();
		};

		/**
		 * Stops the ease machine from running mid-animation. Returns the current state.
		 * @return {Map} Name value pairs of current values or current value
		 * @memberOf  STX.EaseMachine
		 */
		STX.EaseMachine.prototype.stop=function(){
			if(this.afid) cancelAnimationFrame(this.afid);
			this.afid=null;
			this.okayToRun=false;
			this.running=false;
			if(typeof this.useNameValuePairs=="undefined") return {};
			if(!this.useNameValuePairs) return this.currentValues["default"];
			return this.currentValues;
		};

		if(typeof document!="undefined") document.addEventListener("contextmenu", STXChart.handleContextMenu);

		/* make third party function available in STX */
		STX.EquationParser=equationParser;

		return _exports;

	}

	{
		var _stx_js_exports={};
		if(typeof exports!=="undefined") _stx_js_exports=exports;

		if ( typeof define === "function" && define.amd ) {
			define( ["stxThirdParty"], function(_stxThirdParty) { return _stx_js(_stx_js_exports,_stxThirdParty); } );
		}else{
			var _stxThirdParty={};
			if(typeof(window.STXThirdParty)!="undefined") _stxThirdParty=window.STXThirdParty;

			var _=_stx_js(_stx_js_exports,_stxThirdParty);
			window.STX=_.STX;
			window.STXChart=_.STXChart;
			window.$$=_.$$;
			window.$$$=_.$$$;
		}
	}

})();
