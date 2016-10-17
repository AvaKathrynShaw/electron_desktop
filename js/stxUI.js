// Copyright 2015 by ChartIQ LLC

//TODO replace STX.installTapEvent with jquery.stxtap()
//TODO, add "auto" color to color picker
//TODO, deep color picker, to allow cutom colors
//TODO, color picker remember MRU colors (favorites)
//TODO, convert svg images to inline using web component. (See Angular example)
//http://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
//Then use CSS to style color

// node.stxtap([selector],callback)
jQuery.fn.extend({
	stxtap: function(arg1, arg2) {
	    return this.each(function() {
	    	STX.installTapEvent(this, {stopPropagation:true});
	    	if(typeof arg1=="string"){
		    	$(this).on("stxtap", arg1, function(e){
		    		arg2.call(this, e);
		    	});
	    	}else{
		    	$(this).on("stxtap", function(e){
		    		arg1.call(this, e);
		    	});
		    }
	    });
	}
});

jQuery.fn.extend($.expr[':'], {
    trulyvisible: function(node, j, attr){
    	var parents=$(node).parents();
    	parents=parents.add(node);
    	for(var i=0;i<parents.length;i++){
    		var p=$(parents[i]);
	    	if(p.css("opacity") === "0" ) return false;
	    	if(p.css("visibility") === "hidden" ) return false;
	    	if(p.css("height") === "0px" ) return false;
	    	if(!p.is(":visible")) return false;
	    }
    	return true;
    }
});

/**
 * Creates a virtual DOM and then compares contents before rendering. If the contents
 * are the same then no rendering is done. This prevents flicker. React style.
 */
jQuery.fn.extend({
	cqvirtual: function(arg1){
		var virtual=this.clone();
		virtual.empty();
		virtual.original=this;
		return virtual;
	},
	cqrender: function(arg1){
		if(this[0].innerHTML==this.original[0].innerHTML) return this.original;
		this.original.empty();
		var children=this.children();
		if(children.length){
			var newStuff=children.detach();
			this.original.append(newStuff);
		}

		return this.original;
	},
	emptyExceptTemplate: function(){
		this.children().not("template").remove();
		return this;
	}
});


jQuery.queryString=function(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) return sParameterName[1];
    }
    return null;
};


/*
http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
 */

(function(){
  var attachEvent = document.attachEvent;
  var isIE = navigator.userAgent.match(/Trident/);
  var requestFrame = (function(){
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
        function(fn){ return window.setTimeout(fn, 20); };
    return function(fn){ return raf(fn); };
  })();
  
  var cancelFrame = (function(){
    var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
           window.clearTimeout;
    return function(id){ return cancel(id); };
  })();
  
  function resizeListener(e){
    var win = e.target || e.srcElement;
    if (win.__resizeRAF__) cancelFrame(win.__resizeRAF__);
    win.__resizeRAF__ = requestFrame(function(){
      var trigger = win.__resizeTrigger__;
      trigger.__resizeListeners__.forEach(function(fn){
        fn.call(trigger, e);
      });
    });
  }
  
  function objectLoad(e){
    this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
    this.contentDocument.defaultView.addEventListener('resize', resizeListener);
  }
  
  STX.addResizeListener = function(element, fn){
    if (!element.__resizeListeners__) {
      element.__resizeListeners__ = [];
      if (attachEvent) {
        element.__resizeTrigger__ = element;
        element.attachEvent('onresize', resizeListener);
      }
      else {
        //if (!getComputedStyle(element) || getComputedStyle(element).position == 'static') element.style.position = 'relative';
        var obj = element.__resizeTrigger__ = document.createElement('object'); 
        obj.setAttribute('style', 'visibility:hidden; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; border:0px;');
        obj.__resizeElement__ = element;
        obj.onload = objectLoad;
        obj.type = 'text/html';
        if (isIE) element.appendChild(obj);
        obj.data = 'about:blank';
        if (!isIE) element.appendChild(obj);
      }
    }
    element.__resizeListeners__.push(fn);
  };
  
  STX.removeResizeListener = function(element, fn){
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
      if (attachEvent) element.detachEvent('onresize', resizeListener);
      else {
        element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', resizeListener);
        element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__);
      }
    }
  };
})();




/**
 * Namespace for UI helper objects
 * @namespace
 */
STX.UI=function(){};

STX.UI.KEYSTROKE=1;
STX.UI.BODYTAP=2;

STX.UI.Selectors=function(){};

STX.UI.Selectors.scrollable=".cq-iscroller";
STX.UI.Selectors.noClose="[cq-no-close]";


/**
 * Convenience function for making a new jquery node from a HTML5 <template>
 * @param  {Selector} node Selector or HTMLElement
 * @param {HTMLElement} [appendTo] If set, then the template will automatically be appended to this node.
 * If appendTo==true then the new node will automatically be added in place (appended to the template's parent)
 * @return {JQuery}      A jquery node
 */
STX.UI.makeFromTemplate=function(node, appendTo){
	var n=$(node)[0].content;
	var newNode=document.importNode(n, true);
	var jq = null;
	
	// find first real element
	// nodeType for element = 1
	// nodeType for text = 3
	for(var i=0; i<newNode.childNodes.length; i++){
		var child = newNode.childNodes[i];
		
		// found element
		if(child.nodeType == 1){
			jq=$(child);
			if(appendTo===true) $(node).parent().append(newNode);
			else if(appendTo) $(appendTo).append(newNode);
			break;
		}
	}
	
	return jq;
};

/**
 * UI context helper class. Construct with an {@link STXChart} object
 * @param {STXChart} stx The chart object to associate this UI
 * @param {HTMLElement} topNode The top node of the DOM tree for this context. That node should contain
 * all of the UI elements associated with the STXChart
 * @param {object} [params] Optional parameters
 * @param {Number} [params.reduceMenuHeight=56] Amount in pixels to subtract from menus, so that there is some space between them and the bottom of the screen
 * @name STX.UI.Context
 * @constructor
 */
STX.UI.Context=function(stx, topNode, params){
	this.params=params?params:{};
	if(!this.params.reduceMenuHeight && this.params.reduceMenuHeight!==0)
		this.params.reduceMenuHeight=45;
	this.stx=stx;
	this.topNode=$(topNode)[0];
	if(!this.topNode.STX) this.topNode.STX={};
	if(!this.topNode.STX.UI) this.topNode.STX.UI={};
	if(!this.topNode.STX.UI.Components) this.topNode.STX.UI.Components=[];
	if(!this.topNode.STX.UI.EventClaims) this.topNode.STX.UI.EventClaims=[];
	this.components=this.topNode.STX.UI.Components;
	this.topNode.STX.UI.context=this;
	this.registeredResizes=[];
	this.lifts=[];

	// Search through all of the components that have registered themselves. Call setContext() on each
	// so that they can get their context. This usually initializes and makes the component active.
	for(var i=0;i<this.components.length;i++){
		this.components[i].setContextPrivate(this);
	}
};

/**
 * Abstract method that should be overridden
 * @param  {Object} data A symbol data object acceptible for {@link STXChart#newChart}
 */
STX.UI.Context.prototype.changeSymbol=function(data){
	console.log("Please implement STX.UI.Context.prototype.changeSymbol");
};

/**
 * Attaches an STX.UI helper to the context for future reference. Multiple helpers of the same type
 * can be attached.
 * @param {STX.UI.Helper} uiHelper A UI Helper to attach
 * @param {string} className The classname of the element. For instance "Loader"
 */
STX.UI.Context.prototype.advertiseAs=function(uiHelper, className){
	var nd=$(this.topNode)[0];
	/*if(!nd.STX){
		nd.STX={};
		nd.STX.UI={};
	}*/
	if(!nd.STX.UI[className]){
		nd.STX.UI[className]=[];
	}
	nd.STX.UI[className].push(uiHelper);
};

/**
 * Finds the nearest (parent) node that contains the class (STX.UI.Element type) referenced
 * by an stxtap attribute. Returns null if none found.
 * @param  {HTMLElement} node        The element that was tapped
 * @param  {String} elementName The type of UI Helper to look for
 * @return {Array.STX.UI.Helper}             The associated array of helpers or null if none found
 * @memberOf STX.UI.Context
 * @private
 */
STX.UI.Context.prototype.findNearest=function(node, helperName){
	return this.topNode.STX.UI[helperName];
/*
	var iterator=node;
	while(iterator.parentNode && iterator!=this.topNode){
		if(!iterator.STX || !iterator.STX.UI || !iterator.STX.UI[helperName]){
			iterator=iterator.parentNode;
			continue;
		}
		return iterator.STX.UI[helperName];
	}
	if(iterator.STX && iterator.STX.UI && iterator.STX.UI[helperName]) return iterator.STX.UI[helperName];
	return null;
	*/
};

/**
 * Splits a string form function into function name and arguments
 * @param  {String} cmd The string function call
 */
STX.UI.Context.splitMethod=function(cmd){
	if(!cmd) return null;
	var openParentheses=cmd.indexOf("(");
	var closeParentheses=cmd.lastIndexOf(")");
	if(openParentheses==-1 || closeParentheses==-1){
		console.log("malformed stxtap attribute: " + node.tagName);
		return null;
	}
	var helperName=null, functionName;
	var beforeParentheses=cmd.substring(0, openParentheses);
	var period=beforeParentheses.indexOf(".");
	if(period==-1){ // web component
		functionName=beforeParentheses;
	}else{
		helperName=beforeParentheses.substring(0,period);
		functionName=cmd.substring(period+1, openParentheses);
	}
	var args=cmd.substring(openParentheses+1, closeParentheses);
	var parsed=args.match(/('[^']+'|[^,]+)/g);
	var isFloat = new RegExp("^[0-9]+([,.][0-9]+)?$", "g");
	var isInteger = new RegExp("^\\d+$");
	var argArray = [];
	if(parsed){
		for(var i=0;i<parsed.length;i++){
			var arg=parsed[i];
			while(arg.charAt(0)==" ") arg=arg.substring(1);
			if(arg.indexOf('"')!=-1 || arg.indexOf("'")!=-1){
				argArray.push(arg.substring(1, arg.length-1));
			}else if(arg=="true"){
				argArray.push(true);
			}else if(arg=="false"){
				argArray=push(false);
			}else if(arg=="null"){
				argArray.push(null);
			}else if(isInteger.test(arg)){
				argArray.push(parseInt(arg));
			}else if(isFloat.test(arg)){
				argArray.push(parseFloat(arg));
			}else{
				var a=arg.split(".");
				aObj=window;
				for(var b=0;b<a.length;b++){
					aObj=aObj[a[b]];
				}
				argArray.push(aObj);
			}
		}
	}

	return {
		helperName: helperName,
		functionName: functionName,
		args: argArray
	};
};

/**
 * Locates the nearest UI helper for the given attribute. If none exists then it is created at the topNode.
 * @param  {HTMLElement} node    The node with either stxbind or stxtap attribute
 * @param {String} [binding] The type of binding or helper name being looked for, otherwise the stxbind and then stxtap attributes are queried
 * @param {String} attribute Either "stxtap" or "stxbind". Only required if binding==null.
 * @return {STX.UI.Helper}     A UI helper object    
 */
STX.UI.Context.prototype.getHelpers=function(node, binding, attribute){
	if(!node) node=this.topNode;
	else node=$(node)[0];
	if(!binding){
		binding=node.getAttribute(attribute);
		if(!binding) return null;
	}
	var helpers;
	var paren=binding.indexOf("(");
	var beforeParen=binding.substring(0, paren);
	var period=binding.indexOf(".");
	if(paren==-1 || beforeParen.indexOf(".")!=-1){ // Layout or Layout.Chart or Layout.Chart('blah')
		var helperName=binding;
		if(period!=-1){
			helperName=binding.substring(0, period);
		}
		helpers=this.findNearest(node, helperName);
		if(!helpers){
			if(!STX.UI[helperName]){
				console.log("Helper " + helperName + " not found");
				return null;
			}
			helpers=[new STX.UI[helperName](this.topNode, this)];
		}
	}else{ // bind to nearest web component // chart()
		var f=binding.substring(0, paren);
		var parents=$(node).parents();
		for(var i=0;i<parents.length;i++){
			var component=parents[i];
			if(typeof(component[f])=="function"){
				return [component];
			}
		}

	}
	return helpers;
};

/**
 * Activates an element that was tapped on via the stxtap attribute. The contents of stxtap
 * should be the name of a class derived from {@link STX.UI.Element}, a member function of that
 * class and the arguments.
 *
 * The DOM tree will be searched for an instance of that class. If one cannot be found, then an
 * instance will be created on the spot. The instance itself should attach itself if it wants to be re-used.
 * @param  {HTMLElement} node The node that was tapped
 * @param {Event} e The event that triggered the function
 * @param {Object} [params] Optional object to send as last argument
 * @param {Boolean} [setter] If true then use stxsetget instead of stxtap
 * @memberOf STX.UI.Context
 * @private
 */
STX.UI.Context.prototype.activate=function(node, e, params, setter){
	var attribute=setter?"stxsetget":"stxtap";
	var method=STX.UI.Context.splitMethod(node.getAttribute(attribute));
	if(!method) return;
	var helperName=method.helperName;
	var f=method.functionName;
	if(setter) f="set" + f;
	// All helper methods take the node that was activated as the first argument
	var argArray=[{node:node,e:e,params:params}].concat(method.args);

	if(helperName){
		var helpers=this.getHelpers(node, null, attribute);

		for(var i=0;i<helpers.length;i++){
			if(!helpers[i][f]){
				console.log("Method '" + f + "' not found in helper", helpers[i]);
				continue;
			}
			helpers[i][f].apply(helpers[i], argArray);
		}
	}else{
		var parents=$(node).parents();
		for(var j=0;j<parents.length;j++){
			var component=parents[j];
			if(typeof(component[f])==="function"){
				component[f].apply(component, argArray);
			}
		}
	}
};

/**
 * We need to either use iscroll "tap" event or attach a safeClickTouch depending
 * on whether the node in question falls within an iscroll.
 * @param  {HTMLElement}   node The element to attach a tap event to
 * @param  {Function} cb   The callback when tapped
 * @memberOf STX.UI.Context
 */
STX.UI.Context.prototype.makeTap=function(node, cb){
	var scrollableParents=$(node).parents(STX.UI.Selectors.scrollable);
	var self=this;
	node.selectFC=cb;
	if(scrollableParents.length)
		$(node).on("tap", function(e){
			//var noCloseSelector=self.menuParams.noCloseSelector;
			//var noClose=$(e.target).parents(noCloseSelector).length || $(e.target).is(noCloseSelector);
			//if(!noClose) self.closeMenu();
			cb(e);
		});
	else
		STX.safeClickTouch(node, cb); 
};

STX.UI.Context.prototype.inputEntry=function(node, cb){
	$(node).on("keypress", function(e){
		switch(e.which){
			case 13:
			case 9:
				cb();
		}
	});
};

/**
 * Creates a simple tappable observable based on a stxbindtap attribute with the following syntax.
 * object.member=condition,action=value // set object.member to condition and execute the action when clicked (radio button)
 * object.member~=condition,action=value // toggle object.member condition and execute the action when clicked (checkbox)
 * object.member,action=value            // toggle object.member boolean and execute action when true
 * object.member==condition,action=value // check but do not set object.member condition and execute the action when clicked
 * @param  {HTMLElement} node Selector or html element
 */
STX.UI.Context.prototype.makeBindTap=function(node){
	function splitLHS(lhs){
		var o={};
		var s=lhs.split("==");
		if(s.length==2){
			o.objectString=s[0];
			o.condition=s[1];
			o.verb="evaluate";
			return o;
		}
		s=lhs.split("~=");
		if(s.length==2){
			o.objectString=s[0];
			o.condition=s[1];
			o.verb="checkbox";
			return o;
		}
		s=lhs.split("=");
		if(s.length==2){
			o.objectString=s[0];
			o.condition=s[1];
			o.verb="radio";
			return o;
		}
		o.objectString=lhs;
		o.condition=null;
		o.verb="boolean";
	}
	var bindtap=node.getAttribute("stxbindtap");
	var params={
		selector:node
	};
	// Parse the attribute into params
	var comma=bindtap.indexOf(",");
	var lhs=bindtap.substring(0, comma);
	var rhs=bindtap.substring(comma+1);

	$.extend(params,splitLHS(lhs));

	var eq=rhs.indexOf("=");
	params.action=eq==-1?rhs:rhs.substring(0,eq);
	params.value=eq==-1?null:rhs.substring(eq+1);

	var objectChain=params.objectString.split(".");
	params.obj=this;
	for(var i=0;i<objectChain.length-1;i++){
		params.obj=params.obj[objectChain[i]];
	}
	params.member=objectChain[i];
	this.observe(params); // binding

	// tapping
	var self=this;
	function closure(params){
		return function(e){
			self.e=e;
			if(params.verb==="evaluate"){
				//no op
			}else if(params.verb==="radio"){
				params.obj[params.member]=params.condition;
			}else if(params.verb=="checkbox"){
				if(params.obj[params.member]===params.condition) params.obj[params.member]=null;
				else params.obj[params.member]=params.condition;
			}else if(params.verb=="boolean"){
				params.obj[params.member]=!params.obj[params.member];
			}
		};
	}
	this.makeTap(node, closure(params));

};
/**
 * Set bindings for a node that has been created dynamically. The attribute can be either "stxbind", "stxtap" or "stxsetget".
 *
 * In the case of stxsetget, a "set" and "get" will be prepended to the bound method.
 * <Helper>.getXxxxx() will be called once during this initialization. That method should set up a binding.
 * 
 * When tapping (or changing value in the case of an input field) <Helper>.setXxxx() will be called.
 *
 * bindings in web components will search for the nearest parent component that contains the expected function:
 * @example
 * stxtap="tool('gartley')" // Will look for the next parent with method "tool"
 *
 * To explicitly target a web component, use a prefix
 * @example
 * stxtap="DrawingToolbar.tool('gartley')"
 *
 * Then be sure to register the web component
 * @example
 * STX.UI.advertiseAs(this, this, "DrawingToolbar");
 *
 * To bind an action to a class that is not a webcomponent
 * @example
 * STX.UI.advertiseAs(node, class instance, "DrawingToolbar");
 * 
 * @param  {HTMLElement} node      The node to bind
 * @param {Object} [params] Optional parameters that will be passed as final argument
 */
STX.UI.Context.prototype.bind=function(node, params){
	node=$(node)[0]; // If jquery, convert to raw HTMLElement
	var helpers;
	var binding=node.getAttribute("stxbind");
	var tap=node.getAttribute("stxtap");
	var bindtap=node.getAttribute("stxbindtap");
	var setget=node.getAttribute("stxsetget");

	function bindHelper(helper){
		var method;
		var paren=binding.indexOf("(");
		if(paren==-1){
			method=binding.substring(binding.indexOf(".")+1);
		}else{
			method=binding.substring(0, paren);
		}
		helper[method](node);
	}
	if(binding && binding!==""){
    	helpers=this.getHelpers(node, binding, "stxbind");
    	helpers.forEach(bindHelper);
	}
	var self=this;
	function closure(node){
		return function(e){
			self.e=e;
			self.activate(node, e, params, false);
		};
	}
	if(tap && tap!==""){
		this.makeTap(node, closure(node));
	}

	if(bindtap){
		this.makeBindTap(node);
	}
	function setGetHelper(helper){
		function createSetter(){
			return function(e){
				self.e=e;
				self.activate(node, e, params, true);
			};
		}
		var method=STX.UI.Context.splitMethod(setget);
		if(!method){
			console.log("Syntax error " + setget);
			return;
		}
		var argArray=[node].concat(method.args).concat(params);
		helper["get" + method.functionName].apply(helper, argArray);
		if(node.type==="text" || node.type==="number"){
			self.inputEntry(node, createSetter());
		}else{
			self.makeTap(node, createSetter());
		}
	}
	if(setget){
    	helpers=this.getHelpers(node, setget, "stxsetget");
    	helpers.forEach(setGetHelper);
	}
};

/**
 * Travels the DOM tree and locates stxbind attributes. UI elements can use these to configure menus or dialogs.
 * To effect reverse binding, set the value of the stxbind attribute to a Helper class name and data element. For instance "Layout.chartStyle".
 * The Helper element will seek out all children with "stxtap" attribution and examine the arguments to that function call for a match.
 * @param {HTMLElement} [traverseNode] Specify the node to traverse. Defaults to topNode for the context.
 */
STX.UI.Context.prototype.buildReverseBindings=function(traverseNode){
	if(!traverseNode) traverseNode=this.topNode;
	var acceptFunc=function(node) {
		if ( node.hasAttribute("stxbind") ||
			node.hasAttribute("stxtap") ||
			node.hasAttribute("stxbindtap") ||
			node.hasAttribute("stxsetget")) {
    		return NodeFilter.FILTER_ACCEPT;
  		}
  	};

	var walker = document.createNodeIterator(
        traverseNode,
        NodeFilter.SHOW_ELEMENT,
	    STX.isIE?acceptFunc:{acceptNode:acceptFunc},
	    false
    );

	var node;
	//var binding, helpers, node;
	/*function bindHelper(helper){
		var method=binding.substring(binding.indexOf(".")+1);
		helper[method](node);
	}*/

	node = walker.nextNode();
    while(node) {
    	this.bind(node);
    	//binding=node.getAttribute("stxbind");
    	//helpers=this.getHelpers(node, binding, "stxbind");

    	//helpers.forEach(bindHelper);

    	node = walker.nextNode();
    }
};

/**
 * Force a menu to close. Call this when you want to programatically close a menu.
 * @param {HTMLElement} [node] The node which is contained by the menu you wish to close. This is necessary if you wish to close a particular cascading menu.
 * @memberOf STX.UI.Context
 */

STX.UI.Context.prototype.closeMenu=function(node){
	// event management can be a bit maddening. Causing clicks to trickle up to the body and
	// reopen menus that we just closed, forcing the developer to manually call e.stopPropagation().
	// So here is a little sanity check to prevent that from happening.
	this.recentClose=true;
	var self=this;
	if(this.closeMenuTimeout) clearTimeout(this.closeMenuTimeout);
	this.closeMenuTimeout=setTimeout(function(context){
		return function(){
			context.recentClose=false;
			context.closeMenuTimeout=null;
		};
	}(this),10);

	var context=this;
	var selector=this.menuParams.selector;
	var activeClassName=this.menuParams.activeClassName;

	if(node){
		self=$(node);
		if(self.parents(this.selector).length){
  			context.activeMenuCount--;
  			if(context.activeMenuCount<0) context.activeMenuCount=0;
  		}else{
  			context.activeMenuCount=0;
  		}
  		self.removeClass(activeClassName);
	}else{
		context.restoreLifts();
		context.activeMenuCount=0;
	}
  	if(!context.activeMenuCount){
		$(selector).removeClass(activeClassName);
	}
  	if(!context.activeMenuCount && !context.activeDialogCount){
  		context.stx.modalEnd();
  	}
};

/**
 * @external jQuery
 * 
 * Begins the logic processing for menus and dialogs. The logic ensures the following:
 * - Tapping on menus expands them by adding the activeClassName
 * - Tapping on another menu will close the current menu by removing the activeClassName and open the new menu.
 * - Tapping on the document.body will close any existing menus
 * - Tapping on the document.body will not begin drawings if a menu is open
 *
 * If you're using your own menuing system then do not call this method. Instead follow the same logic by calling {@link STXChart#modalBegin}
 * and {@link STXChart#modalEnd} when your menuing system is open or closed
 *
 * @param {Object} [params] Parameters for menu processing
 * @param  {String} [params.menuDependents="cq-color-picker"] A selector that uniquely identifies any elements that should be hidden just like a menu, but not tappable
 * @param {String} [params.activeClassName="stxMenuActive"] The class name to add or remove from a menu to display or hide it
 * @memberOf STX.UI.Context
 */
STX.UI.Context.prototype.startMenuProcessing=function(params){
	if(!params) this.menuParams=params={};
	else this.menuParams=STX.clone(params);
	var selector=this.menuParams.selector="cq-menu-wrap,*[cq-lift],cq-lookup,*[cq-menu]";
	var menuDependents=this.menuParams.menuDependents=params.menuDependents?params.menuDependents:"cq-color-picker";
	var activeClassName=(this.menuParams.activeClassName=params.activeClassName?params.activeClassName:"stxMenuActive");
	var noCloseSelector=this.menuParams.noCloseSelector=STX.UI.Selectors.noClose;

	var context=this;
	context.activeMenuCount=0;
	context.activeDialogCount=0; // Note used by STX.UI.Dialog because the overlay blocks any possible action, but available for homespun dialogs

	STX.installTapEvent($("body")[0], {preventUnderlayClick:false});

	// There is a delicate balance here to achieve the desired effect:
	// 1) tapping on the body will close any open menu
	// 2) tapping on a menu button will toggle that menu
	// 3) tapping on a menu button will open it, and close any other menus
	// 4) tapping on a menu item in an open menu will close the menu unless inside cq-no-close
	// 5) this must all work inside iscrolls and not accidentally register a tap when the user scrolls a menu
	// 6) this must work in select menus that are instantiated from within iscrollable dialogs
	// 7) select menus must be "lifted" outside of the dialog boxes so that they are not cropped
	function handleTap(e){
		if(context.recentClose) return;
		if(!context.activeMenuCount){
			context.processBodyTapClaims(e);
			return; // no menu open
		}

		// prevent dragging on iscroll from closing the menu
		if(e.type=="stxtap"){
			var noCloseSelector=".cq-iscroller";
			var noClose=$(e.target).parents(noCloseSelector).length || $(e.target).is(noCloseSelector);
			if(noClose){
				e.stopPropagation();
				return;
			}
		}

		context.restoreLifts();
		$(context.topNode).find("*").removeClass(activeClassName);
		//$(selector).removeClass(activeClassName);
		//$(menuDependents).removeClass(activeClassName);
		context.activeMenuCount=0;
      	if(!context.activeMenuCount && !context.activeDialogCount) context.stx.modalEnd();
	}

	function handleTapSelected(e) {
		if(context.recentClose) return;
		var self = $(this);
		var noCloseSelector=context.menuParams.noCloseSelector;
		var target=$(e.target);
		var isScrollable=target.parents(STX.UI.Selectors.scrollable).length || target.is(STX.UI.Selectors.scrollable);
		if(e.type=="stxtap"){
			if(isScrollable) return;
			//noCloseSelector+=",.cq-iscroller";
		}else{
			if(!isScrollable) return;			
		}
		var activeSelector="."+activeClassName+",*[cq-lift]";
		var noClose=target.parents(noCloseSelector).length || target.is(noCloseSelector);
		var active=target.parents(activeSelector).length || target.is(activeSelector);
		if(noClose && active){
			e.stopPropagation();
			return;
		}

		// If we've clicked on a lift, then restore it and
		// point back to the parent
		var isLift=self.is("*[cq-lift]");
		context.restoreLifts();
		if(isLift) self=$(self.parents("cq-menu-wrap")[0]);

		// Clicking on an active menu then close it
		if (self.hasClass(activeClassName)) {
    		if(self.parents(selector).length){
      			context.activeMenuCount--;
      			self.removeClass(activeClassName);
      		}else{
      			context.activeMenuCount=0;
      		}
      		if(!context.activeMenuCount){
				$(selector).removeClass(activeClassName);
			}
      		if(context.activeMenuCount < 1 && context.activeDialogCount < 1){
      			context.stx.modalEnd();
      		}
			return false;
		}
		// Opening a menu
    	e.stopPropagation();
    	if(!self.parents(selector).length){
			$(selector).removeClass(activeClassName);
			$(menuDependents).removeClass(activeClassName);
			context.activeMenuCount=1;
			context.processBodyTapClaims(e);
		}else{
      		context.activeMenuCount++;
		}

		self.toggleClass(activeClassName);
		
		
		// at this point the menu is only being activated
    	// find the first input box and give focus
		$(self).find('input[cq-focus]:first-child').focus();
		
		context.lift(self.find("*[cq-lift]"));
      	context.stx.modalBegin();
	}

	$('body').on('stxtap', selector, handleTapSelected);
	$('body').on('tap', selector, handleTapSelected);
	$("body").on("stxtap", handleTap);

};

/**
 * Manually trigger display of menu
 * @param  {String,HTMLElement} node The menu to display or selector for that menu
 * @memberOf  STX.UI.Context
 */
STX.UI.Context.prototype.activateMenu=function(node, closeExistingMenus){
	var self = $(node);
	var activeClassName=this.menuParams.activeClassName;
	var selector=this.menuParams.selector;
	var context=this;
	var noClose=self.parents(this.menuParams.noCloseSelector).length;
	if((noClose) && self.hasClass(activeClassName)){
		if(this.e) this.e.stopPropagation();
		return;
	}
	// Clicking on an active menu
	if (self.hasClass(activeClassName)) {
		return;
	}
	// Opening a menu
	if(this.e) this.e.stopPropagation();
	if(!self.parents(selector).length && closeExistingMenus){
		$(selector).removeClass(activeClassName);
		context.activeMenuCount=1;
	}else{
  		context.activeMenuCount++;
	}
	self.toggleClass(activeClassName);
  	context.stx.modalBegin();
  	if(self[0].activateMenu) self[0].activateMenu();
};

/**
 * Attaches a loader to a UI context
 * @param {STX.UI.Loader} loader Loader instance
 * @memberOf STX.UI.Context
 */
STX.UI.Context.prototype.setLoader=function(loader){
	this.loader=loader;
};

/**
 * Is the context in modal mode?
 * @return {Boolean} true if in modal mode
 */
STX.UI.Context.prototype.isModal=function(){
	return (this.stx.openDialog!=="" || this.currentDialog);
};
/**
 * Claim any keystrokes that come in. Once claimed, any keystrokes
 * that come in will be passed to the helper. It can then choose
 * to capture or propagate the keystrokes. This allows a helper to capture
 * keystrokes even if it doesn't have mouse focus.
 * @param {STX.UI.Helper} helper A helper of ContextTag
 */
STX.UI.Context.prototype.addClaim=function(helper, eventType){
	var claims=this.topNode.STX.UI.EventClaims;
	claims.push({helper: helper, eventType:eventType});
};

/**
 * Remove a claim on keystrokes.
 * @param  {STX.UI.Helper} helper Helper or ContextTag
 */
STX.UI.Context.prototype.removeClaim=function(helper, eventType){
	var claims=this.topNode.STX.UI.EventClaims;
	for(var i=0;i<claims.length;i++){
		if(claims[i].helper===helper && claims[i].eventType===eventType){
			claims.splice(i,1);
			return;
		}
	}
};


STX.UI.Context.prototype.processKeyStrokeClaims=function(hub, key, e, keystroke){
	var claims=this.topNode.STX.UI.EventClaims;
	for(var i=claims.length-1;i>-1;i--){
		if(claims[i].eventType!==STX.UI.KEYSTROKE) continue;
		var helper=claims[i].helper;
		if(helper.keyStroke(hub, key, e, keystroke)){
			e.preventDefault();
			return true;
		}
	}
	return false;
};

STX.UI.Context.prototype.processBodyTapClaims=function(e){
	var claims=this.topNode.STX.UI.EventClaims;
	for(var i=claims.length-1;i>-1;i--){
		if(claims[i].eventType!==STX.UI.BODYTAP) continue;
		var helper=claims[i].helper;
		if(helper.bodyTap(e)){
			e.preventDefault();
			return true;
		}
	}
	return false;
};

/**
 * A helper that needs to know about resize events can register itself here
 * @param  {STX.UI.Helper} helper The helper to register
 * @memberOf STX.UI.Context
 */
STX.UI.Context.prototype.registerForResize=function(helper){
	this.registeredResizes.push(helper);
};

/**
 * If a helper needs to be destroyed, unregister it here
 * @param  {STX.UI.Helper} helper The helper to unregister
 * @memberOf STX.UI.Context
 */
STX.UI.Context.prototype.unregister=function(helper){
	for(var i=0;i<this.registeredResizes.length;i++){
		if(this.registeredResizes[i]===helper){
			this.registeredResizes.splice(i,1);
			return;
		}
	}
};

/**
 * Call this method to resize any elements attached to the context. Typically attach to window resize event.
 * @memberOf STX.UI.Context
 */
STX.UI.Context.prototype.resize=function(){
	var self=this;

	for(var i=0;i<this.components.length;i++){
		var component=this.components[i];
		if(component.resize && component.resize.constructor==Function)
			component.resize();
	}

	for(i=0;i<this.registeredResizes.length;i++){
		if(this.registeredResizes[i].resize) this.registeredResizes[i].resize();
	}
};

STX.UI.Context.prototype.restoreLifts=function(){
	for(var i=0;i<this.lifts.length;i++){
		var node=this.lifts[i];
		var remember=node[0].remember;
		node.detach();
		node.css(remember.css);
		$(remember.parentNode).append(node);
	}
	this.lifts=[];
};

/**
 * Lifts a menu to an absolute position on the body, so that it can rise above any
 * overflow: hidden, scroll or iscroll situations
 *
 * Use cq-lift attribute to indicate that the menu should be lifted when opened
 *
 * context.lifts is an array that contains all of the current lifts so that
 * they can be restored when the menu is closed
 * @private
 */
STX.UI.Context.prototype.lift=function(node){
	if(!node.length) return;
	var n=$(node)[0];
	n.remember={
		parentNode: n.parentNode,
		css: {
			position: n.style.position,
			display: n.style.display,
			left: n.style.left,
			top: n.style.top,
			height: n.style.height,
			width: n.style.width,
			opacity: n.style.opacity
		}
	};
	var offset=node.offset();
	var height=node.height();
	var width=node.width();
	node.detach();
	node.css({
		"position": "absolute",
		"display": "block",
		"left": offset.left + "px",
		"top": offset.top + "px",
		"height": height + "px",
		//"width": width + "px",
		"opacity": 1
	});
	$("body").append(node);
	this.lifts.push(node);
	if(typeof(n.resize)!="undefined") n.resize();
	node.find("cq-scroll").each(function(){
		this.resize();
	});
};

/**
 * Create an observable
 * @param  {Object} params Parameters
 * @param {String} [params.selector] The selector to effect the observable (adding class, setting value)
 * @param {Object} params.obj The object to observe
 * @param {String} [params.member] The member of the object to observe. Pass an array to observe multiple members. Or pass nothing to observe any change to the object.
 * @param {String} [params.condition] Optional condition for the member to trigger the action
 * @param {String} params.action The action to take. "class" - add or remove a class. "callback" - calls back with params
 * @param {String} params.value The value for the action (i.e. class name, callback function)
 * @memberOf  STX.UI.Context
 *
 * @example - Add or remove a class based on whether stx.layout.crosshair is true or false
 * context.observe({selector:".toggle", obj:stx.layout, member:"crosshair", action:"class", value:"active"});

 * @example - Add or remove a class based on whether stx.layout.chartType=="candle"
 * context.observe({selector:".toggle", obj:stx.layout, member:"chartType", condition:"candle", action:"class", value:"active"});

 * @example - Get a callback from a change in value
 * context.observe({selector:".toggle", obj:stx.layout, member:"chartType", condition:"candle", action:"callback", value:function(params){
 *    console.log("new value is" + params.obj[params.member]);
 * }});

 */
STX.UI.Context.prototype.observe=function(params){
	var self=this;
	function observed(change) {
		var match=false;
		if(!params.member){ // wildcard
			match=true;
		}else if(change.name===params.member){
			match=true;
		}else if(params.member.constructor == Array){
			for(var i=0;i<params.member.length;i++){
				if(change.name===params.member[i]) match=true;
			}
		}
    	if(match){
    		var nodes=$(params.selector);
    		if(!nodes.length && params.action==="callback"){ // simple callback not associated with a selector
				params.value.call(self, params);
    			return;
    		}
			if(params.action==="class") nodes.removeClass(params.value);
			nodes.each(function(){
				var isTrue=false;
				if(params.member){
					if(params.condition){
						if(params.obj[params.member]===params.condition) isTrue=true;
					}else{
						isTrue=params.obj[params.member];
					}
				}
				if(params.action==="class"){
					if(isTrue) nodes.addClass(params.value);
				}
				if(params.action==="callback"){
					params.value.call(self, params, this);
				}
				if(params.action==="value"){
					if(params.value){
						this.value=params.value;
					}else{
						if(!params.obj[params.member])
							this.value="";
						else
							this.value=params.obj[params.member];
					}
				}
			});
    	}
	}

	Object.observe(params.obj, function(changes){changes.forEach(observed);}, ["update","add","delete"]);
	observed({name:params.member}); // initialize
};

STX.UI.animatePrice=function(node, newPrice, oldPrice){
	node.removeClass("cq-stable");
	if(newPrice>oldPrice) node.addClass("cq-up");
	else if(newPrice<oldPrice) node.addClass("cq-down");
	setTimeout(function(){
		node.addClass("cq-stable").removeClass("cq-up").removeClass("cq-down");
	},0);
};

/**
 * Abstract class for WebComponents that use a STX.UI.Context
 * @type {HTMLElement}
 */
STX.UI.ContextTag=Object.create(HTMLElement.prototype);

/**
 * Stores the component in the contextHolder so that when the context
 * is started it knows that this tag is contextual
 */
STX.UI.ContextTag.setContextHolder=function(){
	var contextHolder=this.node.parents("cq-context,*[cq-context]")[0];
	if(!contextHolder.STX) contextHolder.STX={};
	if(!contextHolder.STX.UI) contextHolder.STX.UI={};
	if(!contextHolder.STX.UI.Components) contextHolder.STX.UI.Components=[];
	if(!contextHolder.STX.UI.EventClaims) contextHolder.STX.UI.EventClaims=[];
	contextHolder.STX.UI.Components.push(this);

	// This should only get called for components that are generated dynamically, after a context
	// has already been established
	if(contextHolder.STX.UI.context) this.setContextPrivate(contextHolder.STX.UI.context);
};

/**
 * This is called for every registered component when the context is constructed. You can override
 * this as an initialization.
 * @param {STX.UI.Context} context The context
 */
STX.UI.ContextTag.setContext=function(context){
	// override me
};

STX.UI.ContextTag.setContextPrivate=function(context){
	this.context=context;
	var node=$(this);
	if(typeof(node.attr("cq-marker"))!="undefined"){
		node.detach();
		this.marker=new STX.Marker({
			stx: context.stx,
			node: node[0],
			xPositioner:"none",
			yPositioner:"none",
			permanent:true
		});
	}
	setTimeout(function(s,c){return function(){s.setContext(c);};}(this,context));
};

/**
 * Executes a function in the nearest parent component (container). For instance, a cq-close tag might call "close"
 * on its containing component
 * @param  {String} fn   The name of the function
 * @param  {Array}   args Arguments array (a "spread" is also supported)
 */
STX.UI.ContextTag.containerExecute=function(fn, args){
	var myArgs=args;
	if(args && myArgs.constructor!==Array) myArgs=Array.prototype.slice.call(arguments, 1);
	var parents=this.node.parents();
	for(var i=0;i<parents.length;i++){
		var parent=parents[i];
		if(parent[fn] && parent[fn].constructor==Function){
			return parent[fn].apply(parent, myArgs);
		}
	}
	return null;
};

STX.UI.ContextTag.createdCallback=function(){
	this.injections=[];
	this.node=$(this);
};

STX.UI.ContextTag.addInjection=function(position, injection, code){
	this.injections.push(this.context.stx[position](injection,code));
};

STX.UI.ContextTag.detachedCallback=function(){
	if(this.context && this.injections){
		for(var i=0;i<this.injections.length;i++){
			this.context.stx.removeInjection(this.injections[i]);
		}
		this.injections=[];
	}
};

/**
 * Called automatically when a tag is instantiated
 * @private
 */
STX.UI.ContextTag.attachedCallback=function(){
	if(this.attached) return;
	this.node=$(this);
	this.setContextHolder();
	this.attached=true;
};

/**
 * A tag that is modally aware of the chart
 */
STX.UI.ModalTag = Object.create(STX.UI.ContextTag);

STX.UI.ModalTag.modalBegin = function(){
	if(!this.context) return;
	this.context.stx.modalBegin();
};

STX.UI.ModalTag.modalEnd = function(){
	if(!this.context) return;
	this.context.stx.modalEnd();
};

STX.UI.ModalTag.attachedCallback=function(){
	if(this.attached) return;
	var node=$(this);
	var self=this;
	node.mouseover(function(){
		self.modalBegin();
	});
	node.mouseout(function(){
		self.modalEnd();
	});
	STX.UI.ContextTag.attachedCallback.apply(this);
	this.attached=true;
};


/**
 * Abstract class for UI Helpers
 * @name STX.UI.Helper
 * @constructor
 */
STX.UI.Helper=function(node, context){
	this.node=node;
	this.context=context;
	this.injections=[]; // To keep track of injections for later removal
};

/**
 * Adds an injection. These will be automatically destroyed if the helper object is destroyed
 * @param {String} position  "prepend" or "append"
 * @param {String} injection The injection name. i.e. "draw"
 * @param {Function} code      The code to be run
 * @memberOf STX.UI.Helper
 */
STX.UI.Helper.prototype.addInjection=function(position, injection, code){
	this.injections.push(this.context.stx[position](injection,code));
};

STX.UI.Helper.prototype.destroy=function(){
	for(var i=0;i<this.injections.length;i++){
		this.context.stx.removeInjection(this.injections[i]);
	}
	this.injections=[];
};

STX.UI.Lookup=function(){};


/**
 * Base class that drives the lookup widget. You should derive your own Driver that interacts with your datafeed.
 * @name  STX.UI.Lookup.Driver
 * @constructor
 */
STX.UI.Lookup.Driver=function(){};

/**
 * Sets the UI helper. The Driver will send results to the helper for display. Generally this is called
 * directly by STX.UI.Lookup but you can set this manually if using Lookup.Driver without a Lookup component
 * @param {STX.UI.Lookup} uiHelper The STX.UI.Lookup helper widget.
 */
STX.UI.Lookup.Driver.prototype.setHelper=function(uiHelper){
	this.uiHelper=uiHelper;
};

/**
 * Abstract method, override this to accept the selected text and optional filter. Fetch results
 * and return them by calling this.uiHelper.results(). This default driver returns no results.
 * @param  {string} text The text entered by the user
 * @param {string} [filter] The optional filter text selected by the user. This will be the innerHTML of the cq-filter element that is selected.
 */
STX.UI.Lookup.Driver.prototype.acceptText=function(text, filter){
	if(!this.uiHelper) return;
};

/**
 * This will be called when the user selects an item. The default behavior is to create a new chart.
 * @param  {Object} data The data object selected or a text string
 */
STX.UI.Lookup.Driver.prototype.selectItem=function(data){
	this.uiHelper.selectItem(data);
};

/**
 * An example of an asynchronous Lookup.Driver that uses ChartIQ's suggestive search as its source for symbol search
 */
STX.UI.Lookup.Driver.ChartIQ=function(exchanges){
	this.exchanges=exchanges;
	if(!this.exchanges) this.exchanges=["XNYS","XASE","XNAS","XASX","INDCBSX","INDXASE","INDXNAS","IND_DJI","ARCX","INDARCX","forex"];
	this.url="https://symbols.chartiq.com/chiq.symbolserver.SymbolLookup.service";
	//t=ibm&m=10&x=[]&e=STOCKS
};

STX.UI.Lookup.Driver.ChartIQ.stxInheritsFrom(STX.UI.Lookup.Driver);

STX.UI.Lookup.Driver.ChartIQ.prototype.acceptText=function(text, filter, maxResults){
    
    var self=this;
    if(filter=="FX") filter="FOREX";
    if(isNaN(Number(maxResults))) maxResults=100;
    var url=this.url+"?t=" + encodeURIComponent(text) + "&m="+maxResults+"&x=[";
    if(this.exchanges){
    	url+=this.exchanges.join(",");
    }
    url+="]";
    if(filter && filter.toUpperCase()!="ALL"){
    	url+="&e=" + filter;
    }

    function handleResponse(status, response){
    	if(status!=200) return;
    	try{
    		response=JSON.parse(response);
    		var symbols=response.payload.symbols;

    		var results=[];
    		for(var i=0;i<symbols.length;i++){
    			var fields=symbols[i].split('|');
    			var item={
    				symbol: fields[0],
    				name: fields[1],
    				exchDisp: fields[2]
    			};
    			results.push({
    				display:[item.symbol, item.name, item.exchDisp],
    				data:item
    			});
    		}
   			self.uiHelper.results(results);
    	}catch(e){}
    }
    STX.postAjax({url: url, cb: handleResponse});
};

/**
 * UI helper for StudyMenu UI element.
 * @param {HtmlElement} node The node where the study menu will be drawn
 * @param {STX.UI.Context} context The context
 * @param {Object} params Optional parameters to control behavior of the menu
 * @param {Object} [params.excludedStudies] A map of study names that should not be put in the menu.
 * @param {Boolean} [params.alwaysDisplayDialog=false] If set to true then a dialog will always be displayed to allow the end user to pick their study parameters. Otherwise the study will be created automatically with defaults.
 * @param {Object} [params.iscrollParams] Optionally specify iscroll parameters
 * @param {String} [params.template=".stxTemplate"] Optionally specify a selector to use as a template for making the menu
 * @name STX.UI.StudyMenu
 * @constructor
 */
STX.UI.StudyMenu=function(node, context, params){
	this.node=$(node);
	this.context=context;
	this.params=params?params:{};
	if(!this.params.template) this.params.template=".stxTemplate";
	this.params.template=this.node.find(this.params.template);
	this.params.template.detach();
	this.alwaysDisplayDialog=this.params.alwaysDisplayDialog?this.params.alwaysDisplayDialog:false;
	this.excludedStudies=this.params.excludedStudies;
	if(!this.excludedStudies) this.excludedStudies=[];
	//this.iscrollParams=params.iscrollParams?iscrollParams:{tap:true, scrollbars: true, interactiveScrollbars: true};
	context.advertiseAs(this, "StudyMenu");
};
STX.UI.StudyMenu.stxInheritsFrom(STX.UI.Helper);

/**
 * Creates the menu. You have the option of coding a hardcoded HTML menu and just using
 * STX.UI.StudyMenu for processing stxtap attributes, or you can call renderMenu() to automatically
 * generate the menu.
 * @memberOf STX.UI.StudyMenu
 */
STX.UI.StudyMenu.prototype.renderMenu=function(){
	var alphabetized=[];
	var sd;
	for(var field in STX.Studies.studyLibrary){
		sd=STX.Studies.studyLibrary[field];
		if(!sd.name) sd.name=field; // Make sure there's always a name
		if(this.excludedStudies[field] || this.excludedStudies[sd.name]) continue;
		alphabetized.push(field);
	}
	alphabetized.sort(function(lhs, rhs){
		var lsd=STX.Studies.studyLibrary[lhs];
		var rsd=STX.Studies.studyLibrary[rhs];
		if(lsd.name<rsd.name) return -1;
		if(lsd.name>rsd.name) return 1;
		return 0;
	});
	var menu=$(this.node);
	var self=this;
	var tapFn=function(studyName, context){
		return function(e){
			if(self.pickStudy(e.target, studyName));
			context.closeMenu();
			menu.resize();
		};
	};
	for(var i=0;i<alphabetized.length;i++){
		var menuItem=this.params.template.clone();
		sd=STX.Studies.studyLibrary[alphabetized[i]];
		menuItem.append(sd.name);
		menu[0].innards.append(menuItem);
		menuItem[0].selectFC=tapFn(alphabetized[i], this.context);
		menuItem.on("tap", menuItem[0].selectFC);
	}
};

/**
 * Pops up a study dialog for the given study
 */
STX.UI.StudyMenu.prototype.studyDialog=function(params){
	var studyDialog=this.context.getHelpers(null, "StudyDialog");
	if(!studyDialog.length){
		console.log("STX.UI.StudyEdit.prototype.editPanel: no StudyDialog available");
		return;
	}
	studyDialog=studyDialog[0];
	studyDialog.configure(params);
	$(studyDialog).parents("cq-dialog")[0].show();
};

/**
 * Called when the user clicks on a study in the study menu. Depending on the state of
 * this.alwaysDisplayDialog, this will either create a study dialog or it will create the study itself.
 * @param  {HTMLElement} node      The node that was clicked on
 * @param  {String} studyName The name of the study (entry in studyLibrary)
 * @memberOf STX.UI.StudyMenu
 */
STX.UI.StudyMenu.prototype.pickStudy=function(node, studyName){
	var stx=this.context.stx;
	var sd=STX.Studies.addStudy(stx, studyName);

	var asd=this.alwaysDisplayDialog;
	if(asd===true){
		this.studyDialog({sd:sd, stx: stx});
	}else if(typeof asd==="object"){
		for(var i in asd){
			if(i==studyName && asd[i]){
				this.studyDialog({sd: sd, stx: stx});
				break;
			}
		}
	}
};


STX.Marker.HeadsUp=function(params){
	if(!this.className) this.className="STX.Marker.HeadsUp";
	STX.Marker.call(this, params);
	this.prevTick=null;
};
STX.Marker.HeadsUp.stxInheritsFrom(STX.Marker, false);

STX.Marker.HeadsUp.placementFunction=function(params){
	var panel=params.panel;
	var chart=panel.chart;
	var stx=params.stx;
	var useHighs=STXChart.chartShowsHighs(stx.layout.chartType);
	for(var i=0;i<params.arr.length;i++){
		var marker=params.arr[i];
		var node=$(marker.node);
		if(marker.params.x<0 || marker.params.x>=chart.dataSet.length){
			node.removeClass("stx-show");
			return;
		}
		if(stx.layout.crosshair || stx.currentVectorParameters.vectorType){
			node.removeClass("stx-show");
			return;
		}
		node.addClass("stx-show");

		if(!marker.clientWidth) marker.clientWidth=node.width();
		if(!marker.clientHeight) marker.clientHeight=node.height();
		var x=stx.pixelFromTick(marker.params.x);
		if(marker.clientWidth>x){
			node.removeClass("stx-left");
			node.addClass("stx-right");
			node.css({"left":x+"px", "right":"auto"});
		}else{
			node.addClass("stx-left");
			node.removeClass("stx-right");		
			node.css({"right": (stx.chart.canvasWidth-x)+"px", "left":"auto"});
		}

		var quote=chart.dataSet[marker.params.x];

		var bottom=marker.params.chartContainer?stx.chart.canvasHeight:panel.bottom;
		if(useHighs){
			bottom=Math.round(bottom-stx.pixelFromPriceTransform(quote.High, panel))+"px";
		}else{
			bottom=Math.round(bottom-stx.pixelFromPriceTransform(quote.Close, panel))+"px";
		}
		
		if(marker.node.style.bottom!=bottom) marker.node.style.bottom=bottom;
	}
};


/**
 * UI Helper that keeps the "head's up" display operating. There are three modes:
 * params.followMouse=true - The head's up display will follow the mouse
 * params.staticNode=true - The head's up will simply update a DOM node managed by you
 * default - The head's up will be a marker within the chart, positioned in the chart panel unless overidden
 * 
 * @param {HtmlElement} node The node which should be the template for the head's up.
 * @param {STX.UI.Context} context The context
 * @param {Object} [params] Optional parameters
 * @param {Boolean} [autoStart=true] If true then start the head's up on construction
 * @param {boolean} [followMouse=false] If true then the head's up will follow the mouse. In this case, the node should be a template
 * that will be removed from the document and then added dynamically into the chart container.
 * @param {Boolean} [staticNode=false] If true then the node will not be added as a marker
 * @param {String} [showClass="stx-show"] The class that will be added to display the head's up
 * @name STX.UI.HeadsUp
 * @constructor
 */
STX.UI.HeadsUp=function(node, context, params){
	this.params=params?params:{};
	if(typeof this.params.autoStart=="undefined") this.params.autoStart=true;
	if(typeof this.params.showClass=="undefined") this.params.showClass="stx-show";
	this.node=$(node);
	this.node.detach();
	this.context=context;
	this.maxVolume=0;	// This contains the maximum volume in the dataSet, used to generate the volume icon element
	context.advertiseAs(this, "HeadsUp");
	if(this.params.autoStart) this.begin();
};

STX.UI.HeadsUp.stxInheritsFrom(STX.UI.Helper);

/**
 * Begins the head's up operation. This uses injections to manage the contents and location of the display. See {@link STX.UI.HeadsUp#end} to stop
 * the head's up.
 * @memberOf STX.UI.HeadsUp
 */
STX.UI.HeadsUp.prototype.begin=function(){
	var params;
	if(this.params.followMouse){
		this.node.css({"top":"auto"}); // allow style.bottom to override the default top value
		params={
			stx:this.context.stx,
			label: "headsup",
			xPositioner: "bar",
			chartContainer: true,
			x:0,
			node:this.node[0]
		};
		this.marker=new STX.Marker.HeadsUp(params);
		this.node.addClass(this.params.showClass);

		this.addInjection("append", "handleMouseOut", function(self){ return function(){
			self.followMouse(-1);
		};}(this));
		if(STX.touchDevice){
			this.context.stx.touchNoPan=true; // on touch devices, the dynamic head's up moves like a crosshair
		}
	}else if(this.params.staticNode){

	}else{
		this.node.css({"top":"", "left":""}); // Remove any existing styles
		params={
			stx:this.context.stx,
			label: "headsup",
			xPositioner: "none",
			chartContainer: false,
			node:this.node[0]
		};
		$.extend(params, this.params); // Override default marker setup by passing marker parameters into STX.UI.HaedsUp
		this.marker=new STX.Marker(params);
		this.node.addClass(this.params.showClass);
	}
	this.calculateMaxVolume();
	this.addInjection("prepend","headsUpHR", function(self){ return function(){self.position();};}(this));
	this.addInjection("append","createDataSet", function(self){ return function(){self.calculateMaxVolume();};}(this));
};

/**
 * Stops the head's up from operating by removing injections and hiding. You can start it again by calling {@link STX.UI.HeadsUp#begin}.
 * @memberOf STX.UI.HeadsUp
 */
STX.UI.HeadsUp.prototype.end=function(){
	if(STX.touchDevice && this.params.followMouse){
		this.context.stx.touchNoPan=false;
	}
	if(this.marker) this.marker.remove();
	this.destroy();
	this.marker=null;
};

STX.UI.HeadsUp.prototype.calculateMaxVolume=function(){
	this.maxVolume=0;
	if(!this.context.stx.chart.dataSet) return;
	for(var i=0;i<this.context.stx.chart.dataSet.length;i++){
		var q=this.context.stx.chart.dataSet[i];
		if(q.Volume>this.maxVolume) this.maxVolume=q.Volume;
	}
	this.position();
};

//TODO, nice date format
//TODO, calculateMaxVolume on dataSet, symbol change

STX.UI.HeadsUp.prototype.position=function(){
	var stx=this.context.stx;
	var bar=stx.barFromPixel(stx.cx);
	this.tick=stx.tickFromPixel(stx.cx);
	var prices=stx.chart.xaxis[bar];
	
	var node=this.node;
	var self=this;
	function printValues(){
		self.timeout=null;
		node.find("cq-hu-price").text("");
		node.find("cq-hu-open").text("");
		node.find("cq-hu-close").text("");
		node.find("cq-hu-high").text("");
		node.find("cq-hu-low").text("");
		node.find("cq-hu-date").text("");
		node.find("cq-hu-volume").text("");
		if(prices){
			if(prices.data){
				node.find("cq-hu-open").text(stx.formatPrice(prices.data.Open));
				node.find("cq-hu-price").text(stx.formatPrice(prices.data.Close));
				node.find("cq-hu-close").text(stx.formatPrice(prices.data.Close));
				node.find("cq-hu-high").text(stx.formatPrice(prices.data.High));
				node.find("cq-hu-low").text(stx.formatPrice(prices.data.Low));

				var volume=STX.condenseInt(prices.data.Volume);
				var rollup=volume.charAt(volume.length-1);
				if(rollup>'0'){
					volume=volume.substring(0,volume.length-1);
					node.find("cq-volume-rollup").text(rollup.toUpperCase());
				}else{
					node.find("cq-volume-rollup").text("");
				}
				node.find("cq-hu-volume").text(volume);
				var tickDate = prices.data.displayDate;
				if (!tickDate) tickDate = prices.data.DT;
				if (STXChart.isDailyInterval(stx.layout.interval)){
					node.find("cq-hu-date").text(STX.mmddyyyy(STX.yyyymmddhhmm(tickDate)));		
				} else {
					node.find("cq-hu-date").text(STX.mmddhhmm(STX.yyyymmddhhmm(tickDate)));					
				}
				var visuals=node.find("cq-volume-visual");
				if(visuals.length){
					var relativeCandleSize=self.maxVolume?prices.data.Volume/self.maxVolume:0;
					visuals.css({"width":Math.round(relativeCandleSize*100)+"%"});
				}
			}
		}
	}
	if(this.tick!=this.prevTick){
		if(this.timeout) clearTimeout(this.timeout);
		var ms=this.params.followMouse?0:0; // IE and FF struggle to keep up with the dynamic head's up.
		this.timeout=setTimeout(printValues, ms);
	}
	this.prevTick=this.tick; // We don't want to update the dom every pixel, just when we cross into a new candle
	if(this.params.followMouse){
		this.followMouse(this.tick);
	}
};

STX.UI.HeadsUp.prototype.followMouse=function(tick){
	this.marker.params.x=tick;
	var self=this;
	self.marker.render();
};


/**
 * UI Helper for managing study interaction, editing, deleting etc. It sets up
 * {@link STXChart.callbacks#studyOverlayEdit} and {@link STXChart.callbacks#studyPanelEdit} callbacks
 * in order to display a dialog for editing study parameters and a context menu for editing or deleting overlays.
 * @name STX.UI.StudyEdit
 * @param {HTMLElement} [node=context.topNode] Automatically attaches to the top node of the context
 * @param {STX.UI.Context} context The context for the chart
 * @param {STX.UI.Dialog} [studyDialog] The study dialog to use
 * @param {STX.UI.Dialog} [contextDialog] The context dialog to use
 * @constructor
 */
STX.UI.StudyEdit=function(node, context, contextDialog){
	this.context=context;
	this.node=node?node:context.topNode;

	if(contextDialog){
		this.contextDialog=$(contextDialog)[0];
	}
	context.advertiseAs(this, "StudyEdit");
	this.initialize();
};

STX.UI.StudyEdit.stxInheritsFrom(STX.UI.Helper);


STX.UI.StudyEdit.prototype.remove=function(){
	var sd=this.params.sd;
	STX.Studies.removeStudy(this.params.stx, this.params.sd);
	this.contextDialog.close();
};

/**
 * Proxy for editing a study. Assumes the params for the study have already been set.
 */
STX.UI.StudyEdit.prototype.edit=function(){
	this.contextDialog.close();
	this.editPanel(this.params);
};

/**
 * This just finds the StudyDialog web component and proxies the parameters
 * over to it
 * @param  {Object} params Parameters from studyPanelEdit callback
 */
STX.UI.StudyEdit.prototype.editPanel=function(params){
	var studyDialog=this.context.getHelpers(null, "StudyDialog");
	if(!studyDialog.length){
		console.log("STX.UI.StudyEdit.prototype.editPanel: no StudyDialog available");
		return;
	}
	studyDialog=studyDialog[0];
	studyDialog.configure(params);
	$(studyDialog).parents("cq-dialog")[0].show();
};

/**
 * Displays the context dialog for studies and saves the parameters for editing
 * @param  {Object} params Parameters from studyOverlayEdit callback
 */
STX.UI.StudyEdit.prototype.editOverlay=function(params){
	this.params=params;
	if(params.forceEdit){
		this.editPanel(params);
	}else{
		this.contextDialog.show({x:STXChart.crosshairX, y:STXChart.crosshairY});
	}
};

STX.UI.StudyEdit.prototype.initialize=function(){
	var stx=this.context.stx;
	var self=this;

	function closure(fc){
		return function(){
			fc.apply(self, arguments);
		};
	}
	stx.callbacks.studyOverlayEdit=closure(self.editOverlay);
	stx.callbacks.studyPanelEdit=closure(self.editPanel);
};

/**
 * UI Helper for Layout changes, for instance tapping items on the display menu. This Helper
 * is also responsible for initializing menu items in the "display" menu based on the chart layout (STXChart#layout)
 * @name STX.UI.Layout
 * @param {HTMLElement} node The node to associate the Layout with
 * @param {STX.UI.Context} context The context
 * @param {Object} [params] Parameters
 * @param {String} [params.activeClassName="ciq-active"] The class name to be added to a node when a layout item is enabled
 * @constructor
 */
STX.UI.Layout=function(node, context, params){
	this.params=params?params:{};
	if(!this.params.activeClassName) this.params.activeClassName="ciq-active";
	this.node=node;
	this.context=context;
	context.advertiseAs(this, "Layout");
};

STX.UI.Layout.stxInheritsFrom(STX.UI.Helper);


STX.UI.Layout.prototype.getChartType=function(node, chartType){
	var activeClassName=this.params.activeClassName;
	// A little complexity here to consolidate two fields (aggregationType and chartType) into one
	// set of radio buttons
	function showChartType(params, node){
		var layout=params.obj;
		if(layout.aggregationType){
			if(chartType!==layout.aggregationType){
				$(node).removeClass(activeClassName);
			}else{
				$(node).addClass(activeClassName);
			}
		}else{
			if(chartType!==layout.chartType){
				$(node).removeClass(activeClassName);
			}else{
				$(node).addClass(activeClassName);				
			}
		}
	}
	this.context.observe({
		selector: node,
		obj: this.context.stx.layout,
		member: ["chartType","aggregationType"],
		action: "callback",
		value: showChartType
	});
};


STX.UI.Layout.prototype.setChartType=function(node, chartType){
	var aggregations={
		"heikinashi":true,
		"kagi":true,
		"linebreak":true,
		"pandf":true,
		"rangebars":true,
		"renko":true
	};
	if(aggregations[chartType]){
		this.context.stx.setChartType("candle");
		this.context.stx.setAggregationType(chartType);
	}else{
		this.context.stx.setChartType(chartType);
		this.context.stx.setAggregationType(null);
	}
};

STX.UI.Layout.prototype.getChartScale=function(node, chartScale){
	this.context.observe({
		selector: node,
		obj: this.context.stx.layout,
		member: "chartScale",
		condition: chartScale,
		action: "class",
		value: this.params.activeClassName
	});
};

STX.UI.Layout.prototype.setChartScale=function(node, chartScale){
	if(this.context.stx.layout.chartScale==chartScale){
		this.context.stx.setChartScale(null);
	}else{
		this.context.stx.setChartScale(chartScale);
	}
};

STX.UI.Layout.prototype.getExtendedHours=function(node){
	this.context.observe({
		selector: node,
		obj: this.context.stx.layout,
		member: "extended",
		condition: true,
		action: "class",
		value: this.params.activeClassName
	});
};

STX.UI.Layout.prototype.setExtendedHours=function(node){
	this.context.stx.layout.extended=!this.context.stx.layout.extended;
	this.setMarketSessions(node,(this.context.stx.layout.extended?"pre,post":null));
};
	
STX.UI.Layout.prototype.getMarketSessions=function(node, marketSessions){
	this.context.observe({
		selector: node,
		obj: this.context.stx.layout,
		member: "marketSessions",
		condition: marketSessions,
		action: "class",
		value: this.params.activeClassName
	});
};

STX.UI.Layout.prototype.setMarketSessions=function(node, marketSessions){
	var stx=this.context.stx;
	if(!marketSessions) stx.layout.marketSessions=null;
	else{
		marketSessions=marketSessions.split(",");
		for(var s=0;s<marketSessions.length;s++){
			if(!stx.layout.marketSessions) stx.layout.marketSessions={};
			stx.layout.marketSessions[marketSessions[s]]=!stx.layout.marketSessions[marketSessions[s]];
		}
	}
	stx.changeOccurred("layout");

	var loader=this.context.loader;
	if(loader) loader.show();
	stx.newChart(stx.chart.symbol, null, null, function(){
		loader.hide();
	});
};


STX.UI.Layout.prototype.getAggregationType=function(node, aggregationType){
	this.context.observe({
		selector: node,
		obj: this.context.stx.layout,
		member: "aggregationType",
		condition: aggregationType,
		action: "class",
		value: this.params.activeClassName
	});
};

STX.UI.Layout.prototype.setAggregationType=function(node, aggregationType){
	if(this.context.stx.layout.aggregationType==aggregationType){
		this.context.stx.setAggregationType(null);
	}else{
		this.context.stx.setAggregationType(aggregationType);
	}
};

STX.UI.Layout.prototype.getAggregationEdit=function(node, field){
	var obj=this.context.stx.layout;
	var objectChain=field.split(".");
	for(var i=1;i<objectChain.length-1;i++){
		if(!obj[objectChain[i]]) obj[objectChain[i]]={};
		obj=obj[objectChain[i]];
	}
	var member=(obj===this.context.stx.layout)?field:objectChain[objectChain.length-1];
	this.context.observe({
		selector: node,
		obj: obj,
		member: member,
		action: "value"
	});
};

STX.UI.Layout.prototype.setAggregationEdit=function(node, field){
	var stx=this.context.stx;
	if(field==="auto"){
		if(stx.layout.aggregationType==="kagi"){
			stx.layout.kagi=null;
		}else if(stx.layout.aggregationType==="renko"){
			stx.layout.renko=null;
		}else if(stx.layout.aggregationType==="linebreak"){
			stx.layout.priceLines=null;
		}else if(stx.layout.aggregationType==="rangebars"){
			stx.layout.range=null;
		}else if(stx.layout.aggregationType==="pandf"){
			if(!stx.layout.pandf){
				stx.layout.pandf={box:null, reversal:null};
			}
			stx.layout.pandf.box=null;
			stx.layout.pandf.reversal=null;
		}
	}else{
		var tuple=STX.deriveFromObjectChain(stx.layout, field);
		tuple.obj[tuple.member]=$(node.node).val();		
	}
	stx.changeOccurred("layout");
	stx.createDataSet();
	stx.draw();
};

STX.UI.Layout.prototype.showAggregationEdit=function(node, aggregationType){
	var map={
		kagi:{
			title:"Set Reversal Percentage"
		},
		renko:{
			title:"Set Range"
		},
		linebreak:{
			title:"Set Price Lines"
		},
		rangebars:{
			title:"Set Range"
		},
		pandf:{
			title:"Set Point & Figure Parameters"
		}
	};
	if(this.context.stx.layout.aggregationType!=aggregationType)
		this.context.stx.setAggregationType(aggregationType);
	if(!this.aggregationDialog){
		console.log("Error:  Layout.aggregationDialog must reference your dialog for editing aggregation parameters");
		return;
	}
	var dialog=$(this.aggregationDialog);
	var entry=map[aggregationType];
	dialog.find(".title").text(this.context.stx.translateIf(entry.title));

	for(var type in map){
		dialog.find(".ciq" + type).css(aggregationType===type?{display:""}:{display:"none"});
	}

	dialog[0].show();
};


STX.UI.Layout.prototype.clearStudies=function(node){
	var stx=this.context.stx;
	for(var id in stx.layout.studies){
		var sd=stx.layout.studies[id];
        STX.Studies.removeStudy(stx, stx.layout.studies[id]);
	}
	stx.draw();
};

STX.UI.Layout.prototype.setPeriodicity=function(node, periodicity, interval){
	var self=this;
	if(self.context.loader) self.context.loader.show();
	self.context.stx.setPeriodicityV2(periodicity, interval, function(){
		if(self.context.loader) self.context.loader.hide();
	});
};

/**
 * Sets the display periodicity. Usually this is called from an observer that is in STX.UI.Layout#periodicity.
 * 
 * @param  {STXChart} stx    The chart object to examine for periodicity
 * @param  {Object} params Parameters
 * @param {HTMLElement} params.selector The selector to update
 */
STX.UI.Layout.prototype.showPeriodicity=function(stx, params){
	var text="";
	//TODO, translate?
	//TODO, timeUnit seconds, milliseconds
	if(stx.layout.interval=="day"){
		text=stx.layout.periodicity+"D";
	}else if(stx.layout.interval=="week"){
		text=stx.layout.periodicity+"W";
	}else if(stx.layout.interval=="month"){
		text=stx.layout.periodicity+"M";
	}else if(stx.layout.interval=="tick"){
		text=stx.layout.periodicity+"T";
	}else if(stx.layout.interval*stx.layout.periodicity>=60){
		text=(stx.layout.interval*stx.layout.periodicity)/60+"H";
	}else{
		text=stx.layout.interval*stx.layout.periodicity+"m";
	}
	$(params.selector).empty().append(STX.translatableTextNode(stx,text));
};

STX.UI.Layout.prototype.periodicity=function(node){
	var self=this;
	function showPeriodicity(params){
		self.showPeriodicity(this.stx, params);
	}
	this.context.observe({
		selector: node,
		obj: this.context.stx.layout,
		member: ["interval","periodicity","timeUnit"],
		action: "callback",
		value: showPeriodicity
	});
};

/**
 * Populates and displays the timezone widget
 */
STX.UI.Layout.prototype.displayTimezone=function(){
	
	var dialog=$(this.timezoneDialog);	
	var ul=dialog[0].querySelector("ul");
	var template=ul.querySelector("li#timezoneTemplate").cloneNode(true);
	var wrapper = dialog[0].querySelector("#timezoneDialogWrapper");
	var button = dialog[0].querySelector(".ciq-btn");
	
	for(var key in STX.TimeZoneWidget.timeZoneMap){
		var zone=key;
		var display=zone;
		var li=template.cloneNode(true);
		li.style.display="block";
		li.innerHTML=display;
		STX.ScrollManager.attach(li, setTimezone(zone));
		ul.appendChild(li);
	}
	
	var currentUserTimeZone=dialog[0].querySelector("#currentUserTimeZone");
	if( stxx.displayZone ) {
		var fullZone = stxx.displayZone;
		for(var tz in STX.TimeZoneWidget.timeZoneMap){
			if( STX.TimeZoneWidget.timeZoneMap[tz] === stxx.displayZone ) fullZone = tz;
		}
		currentUserTimeZone.innerHTML='Current TimeZone is '+fullZone;
		$(button).show();
	} else {
		currentUserTimeZone.innerHTML='Your timezone is your current location';
		$(button).hide();
	}

//	if(!this.timezoneDialog.iscroll){
//		this.timezoneDialog.iscroll = STX.iscroll.newScroller(wrapper, {vScrollbar: true, tap:true, scrollbars:true, interactiveScrollbars:false, mouseWheel:true});
//	}else{
//		this.timezoneDialog.iscroll.refresh();
//	}
	
	function setTimezone(zone){
		return function(e){
			dialog[0].hide();
			var translatedZone=STX.TimeZoneWidget.timeZoneMap[zone];
			STX.TimeZoneWidget.setTimeZone(translatedZone);
		};
	}

	dialog[0].show();
};

/**
 * Removes the currently selected timezone for the chart
 */
STX.UI.Layout.prototype.removeTimezone=function(){
	STXChart.defaultDisplayTimeZone=null;
	for(var i=0;i<STXChart.registeredContainers.length;i++){
		var stx=STXChart.registeredContainers[i].stx;
		stx.displayZone=null;
		stx.setTimeZone();
		
		if(stx.displayInitialized) stx.draw();
	}
	
	$(this.timezoneDialog)[0].hide();
};


/**
 * UI Helper for capturing and handling keystrokes. cb to capture the key. Developer is responsible
 * for calling e.preventDefault() and/or e.stopPropagation();
 * 
 * @param {HTMLElement} [node] The node to which to attach, generally the chart container
 * @param {Function} [cb] Callback when key pressed
 * @constructor
 */
STX.UI.Keystroke=function(node, cb){
	this.node=$(node);
	this.cb=cb;
	this.initialize();
	this.shift=false;
	this.ctrl=false;
	this.cmd=false;
	this.capsLock=false;
};

/**
 * Set this to true to bypass key capture. Shit, CTRL, CMD will still be toggled however
 * @type {Boolean}
 */
STX.UI.Keystroke.noKeyCapture=false;

STX.UI.Keystroke.prototype.keyup=function(e){
	var key = e.which;
	switch(key){
		case 16:
			this.shift=false;
			this.cb({key:key,e:e,keystroke:this});
			break;
		case 17:
		case 18:
			this.ctrl=false;
			this.cb({key:key,e:e,keystroke:this});
			break;
		case 91:
			this.cmd=false;
			this.cb({key:key,e:e,keystroke:this});
			break;
		default:
			break;
	}
};

STX.UI.Keystroke.prototype.keydown=function(e){
	if(this.noKeyCapture) return;
	var key = e.which;
	if(!this.ctrl)
		if((key>=48 && key<=222)||key==32) return; // handled by keypress

	switch(key){
		case 91:
			this.cmd=true;
			break;
		case 16:
			this.shift=true;
			break;
	    case 17:
	    case 18:
	    	this.ctrl=true;
	    	break;
		case 20:
			this.capsLock=!this.capsLock;
			break;
	}
	if(key==8) key="backspace"; // delete on mac
	if(key==9) key="tab";
	if(key==13) key="enter";
	if(key==27) key="escape";
	if(key==33) key="page up";
	if(key==34) key="page down";
	if(key==35) key="end";
	if(key==36) key="home";
	if(key==37) key="left";
	if(key==38) key="up";
	if(key==39) key="right";
	if(key==40) key="down";
	if(key==45) key="insert";
	if(key==46) key="delete";
	this.cb({key:key,e:e,keystroke:this});
};

STX.UI.Keystroke.prototype.keypress=function(e){
	if(this.noKeyCapture) return;
	var key = e.which;
	if(key<32 || key>222) return; // handled by keydown
	this.cb({key:key,e:e,keystroke:this});
};

STX.UI.Keystroke.prototype.initialize=function(){
	var self=this;
	$(document).on("keyup", this.node, function(e){
		if(self.node[0]!=e.target) return; // not sure why jquery is passing this through
		self.keyup(e);
	});
	$(document).on("keydown", this.node, function(e){
		if(self.node[0]!=e.target) return;
		self.keydown(e);
	});
	$(document).on("keypress", this.node, function(e){
		if(self.node[0]!=e.target) return;
		self.keypress(e);
	});
	$(window).on("blur", function(e){ // otherwise ctrl-t to switch tabs causes ctrl to get stuck
		self.ctrl=false;
		self.cb({key:17,e:e,keystroke:self});
	});
};


/**
 * UI Helper for capturing and handling keystrokes. A helper or ContextTag can
 * "claim" keystrokes and intercept them, otherwise the keystrokes will be handled
 * by keyup and keydown.
 * 
 * @param {HTMLElement} [node] The node to which to attach, generally the chart container
 * @param {STX.UI.Context} context The context for the chart
 * @param {Object} [params] Parameters to drive the helper
 * @param {Function} [params.cb] Callback to handle hot keys.
 * @name STX.UI.KeyboardShortcuts
 * @constructor
 */
STX.UI.KeystrokeHub=function(node, context, params){
	this.node=$(node);
	this.context=context;
	context.advertiseAs(this, "KeyboardShortcuts");
	this.params=params?params:{};

	var self=this;
	function handler(){
		return function(){
			self.handler.apply(self, arguments);
		};
	}
	this.keystroke=new STX.UI.Keystroke(node, handler());
};

STX.UI.KeystrokeHub.stxInheritsFrom(STX.UI.Helper);

/**
 * Global default hotkey method. Pass this or your own metho in to STX.UI.KeystrokeHub
 * @param  {number} key The pressed key
 * @param  {STX.UI.KeystrokeHub} hub The hub that processed the key
 * @return {boolean}     Return true if you captured the key
 */
STX.UI.KeystrokeHub.defaultHotKeys=function(key, hub){
	var stx=hub.context.stx;
	var push=1;
	switch(key){
		case "up":
			stx.zoomIn();
			break;
		case "down":
			stx.zoomOut();
			break;
		case "home":
			stx.home();
			stx.headsUpHR();
			break;
		case "end":
			stx.chart.scroll=stx.chart.dataSet.length;
			stx.draw();
			stx.headsUpHR();
			break;
		case "left":
			if(stx.ctrl){
				stx.zoomOut();
			}else{
				push=1;
				if(stx.shift || hub.capsLock) push=Math.max(5,5*(8-Math.round(stx.layout.candleWidth)));
				if(stx.chart.scroll+push>=stx.chart.dataSet.length)
					push=stx.chart.dataSet.length-stx.chart.scroll;
				stx.chart.scroll+=push;
				stx.draw();
				stx.headsUpHR();
			}
			break;
		case "right":
			if(stx.ctrl){
				stx.zoomIn();
			}else{
				push=1;
				if(stx.shift || hub.capsLock) push=Math.max(5,5*(8-Math.round(stx.layout.candleWidth)));
				stx.chart.scroll-=push;
				stx.draw();
				stx.headsUpHR();
			}
			break;
		case "delete":
		case "backspace":
			if(STXChart.drawingLine){
				stx.undo();
			}else if(stx.anyHighlighted){
				stx.deleteHighlighted();
			}
			break;
		case "escape":
			if(STXChart.drawingLine){
				stx.undo();
				return;
			}else{
				hub.context.closeMenu();
			}
			break;
		default:
			return false; // not captured
	}
	return true;
};

STX.UI.KeystrokeHub.prototype.handler=function(obj){
	var stx=this.context.stx;
	if(stx.editingAnnotation) return;
	var e=obj.e, key=obj.key, keystroke=obj.keystroke;
	switch(key){
		case 16:
			stx.shift=keystroke.shift;
			break;
		case 17:
		case 18:
			stx.ctrl=keystroke.ctrl;
			break;
		case 91:
			stx.cmd=keystroke.cmd;
			break;
		default:
			break;
		case 91:
			stx.cmd=true;
			break;
		case 16:
			stx.shift=true;
			break;
	    case 17:
	    case 18:
	    	stx.ctrl=true;
	    	break;
		case 20:
			this.capsLock=!this.capsLock;
			break;
	}
	if(!STXChart.drawingLine){
		if(this.context.processKeyStrokeClaims(this, key, e, keystroke)) return;
	}

	if(key!="escape"){
		if(this.context.isModal()) return;
	}

	if(this.params.cb){
		if(this.params.cb(key, this)) e.preventDefault();
	}
};


/**
 * Object for saving and restoring layouts across multiple windows. Each window
 * should be uniquely identified with an id. If the id doesn't exist then no restoration
 * will occur (chart will be in default state).
 *
 * Since windows may be ephemeral, we save a maximum number of windows. Windows
 * are arranged in a MRU (most recently used stack). The least recently used windows
 * will be removed in favor of new ones.
 * 
 */
STX.UI.MultiWindow=function(params){
	this.params=params?params:{};
	this.params.maxWindows=this.params.maxWindows?this.params.maxWindows:50;
	this.params.key=this.params.key?this.params.key:"myChartIQLayouts";
	if(!this.params.nameValueStore){
		this.params.nameValueStore=new STX.NameValueStore();
	}
	this.stack=[];
	this.initialize();
};

STX.UI.MultiWindow.prototype.initialize=function(){
	var self=this;
	function cb(err, result){
		if(!err && result) self.stack=result;
	}
	this.params.nameValueStore.get(this.params.key, cb);
};

/**
 * Pushes the id to the top of the stack. If the id didn't exist then one
 * is created at the top of the stack. If the stack exceeds this.params.maxWindows
 * then the stack is truncated.
 *
 * @param  {String} id ID of the window
 * @param {Boolean} [create] If true then create an array item if one doesn't exist
 * @return {Object} Returns the layout or null if not found and not created
 * @private
 */
STX.UI.MultiWindow.prototype._mru=function(id, create){
	for(var i=0;i<this.stack.length;i++){
		var tuple=this.stack[i];
		if(tuple.id===id){
			this.stack.splice(i,1);
			this.stack.unshift(tuple);
			return this.stack[0];
		}
	}
	if(!create){
		if(this.stack.length) return this.stack[0];
		return null;
	}
	this.stack.unshift({id:id, layout:null});
	while(this.stack.length>=this.params.maxWindows)
		this.stack.pop();
	return this.stack[0];
};

/**
 * Restore the layout for this id or otherwise the most recently used layout
 * @param  {String} id   The id of the window
 * @param  {STXChart} stxx The chart object
 * @param {Object} [params] Optional parameters
 * @param {Boolean} [params.restoreSymbol] Optionally restore the symbol
 * @returns {Object} Returns the layout
 */
STX.UI.MultiWindow.prototype.restore=function(id, stxx, params){
	params=params?params:{};
	var item=this._mru(id, false);
	if(item && item.layout){
		stxx.importLayout(item.layout, false);
	}
	if(item && item.symbol){
		if(params.restoreSymbol){
			stxx.newChart(item.symbol);
		}
	}
	this.params.nameValueStore.set(this.params.key, this.stack);
	return item;
};

/**
 * Save the layout, updates all of the windows
 * @param  {String} id   Window ID
 * @param  {STXChart} stxx The chart to save
 */
STX.UI.MultiWindow.prototype.save=function(id, stxx){
	this.initialize(); // reload in case another window has updated the layout
	this._mru(id, true);
	this.stack[0].layout=stxx.exportLayout();
	this.stack[0].symbol=stxx.symbol;
	this.params.nameValueStore.set(this.params.key, this.stack);
};

/**
 * Updates the remembered symbol for the window
 * @param  {String} id     Window ID
 * @param  {Object} symbol The symbol
 */
STX.UI.MultiWindow.prototype.changeSymbol=function(id, symbol){
	this.initialize();
	this._mru(id, true);
	this.stack[0].symbol=symbol;
	this.params.nameValueStore.set(this.params.key, this.stack);
};

STX.UI.MultiWindow.prototype.wipe=function(){
	this.params.nameValueStore.remove(this.params.key);
	this.stack=[];
};


/*********************************** Web Components **************************/

STX.UI.Prototypes={};

STX.UI.Prototypes.Close=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.Close.attachedCallback=function(){
	if(this.attached) return;
	var self=this;
	function closure(){
		self.tap();
	}
	$(this).stxtap(closure);
	STX.UI.ContextTag.attachedCallback.apply(this);
	this.attached=true;
};

/**
 * cq-close web component will close it's containing (parent or up) component
 * by calling its close() method
 */

STX.UI.Close=document.registerElement("cq-close", {prototype: STX.UI.Prototypes.Close});

STX.UI.Close.prototype.tap=function(){
	this.containerExecute("close");
};

STX.UI.Prototypes.Scroll=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.Scroll.resize=function(){
	var node=$(this);
	if(typeof(node.attr("cq-no-resize"))!="undefined") return;
	if(typeof(node.attr("cq-no-maximize"))!="undefined") this.noMaximize=true;
	var position=node.offset();
	var context=this.context;
	var reduceMenuHeight=context?context.params.reduceMenuHeight:0;
	var winHeight=$(window).height();
	if(!winHeight) return;
	var height=winHeight-position.top - reduceMenuHeight;

	// If there are subsequent siblings that have a fixed height then make room for them
	var nextAll=node.nextAll();
	for(var i=0;i<nextAll.length;i++){
		var sibling=$(nextAll[i]);
	    if(!sibling.is(":visible")) continue; // skip hidden siblings
		height-=sibling.height();
	}
	if(!this.noMaximize) node.css({"height": height + "px"});
	node.css({"max-height": height + "px"});
	if(this.iscroll) this.iscroll.refresh();
};

STX.UI.Prototypes.Scroll.createdCallback=function(){
	STX.UI.ContextTag.createdCallback.apply(this);
	// inject the scroller needed for iscroll
	this.innards=$("<div></div>");
	this.innards.addClass("cq-iscroller");
	this.innards.append(this.node.find("> *"));
	this.node.append(this.innards);
};

STX.UI.Prototypes.Scroll.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ContextTag.attachedCallback.apply(this);
	var node=$(this);
	var iscrollParams={tap:true, scrollbars: true, interactiveScrollbars:true};
	this.iscroll=new STXThirdParty.IScroll5(this, iscrollParams);
	var element=this;
	STX.addResizeListener(this, function(){
		element.iscroll.refresh();
	});
	this.resize();
	this.attached=true;
};

/**
 * Scroll components can handle up and down enter keystrokes.
 * They do not register for claims directly. Another section of code must
 * establish the claim on their behalf or proxy the keystroke.
 *
 * Up and down arrows will iterate through cq-item tags. The attribute
 * cq-focused will be added to the currently focused tag. This can then be
 * queried later, such as when a user hits enter.
 *
 * space bar or enter will call the selectFC callback on the cq-item if it exists
 */
STX.UI.Prototypes.Scroll.keyStroke=function(hub, key, e){
	if(!$(this).is(":trulyvisible")) return false;
	if(key!="up" && key!="down" && key!="enter" && key!=32) return false;
	var items=this.innards.find("cq-item");
	var focused=this.innards.find("cq-item[cq-focused]");

	if(key==32 || key=="enter"){
		if(focused.length && focused[0].selectFC){
			focused[0].selectFC.call(focused, e);
			return true;
		}
		return false;
	}
	if(!focused.length){
		$(items[0]).attr("cq-focused","true");
		return;
	}
	items.removeAttr("cq-focused");

	// locate our location in the list of items
	for(var i=0;i<items.length;i++)
		if(items[i]===focused[0]) break;

	if(key=="up"){
		i--;
		if(i<0) i=0;
	}
	if(key=="down"){
		i++;
		if(i>=items.length) i=items.length-1;
	}
	$(items[i]).attr("cq-focused","true");
	this.iscroll.scrollToElement(items[i],null,true,true);
	return true;
};

/**
 * Returns the focused element or null. An item is focused if it has
 * attribute cq-focused.
 * @return {HTMLElement} The element or null
 */
STX.UI.Prototypes.Scroll.focused=function(){
	var focused=this.innards.find("cq-item[cq-focused]");
	if(focused.length) return focused[0];
	return null;
};


STX.UI.Prototypes.Menu=Object.create(STX.UI.Prototypes.Scroll);

STX.UI.Prototypes.Menu.createdCallback=function(){
	if (this.ownerDocument !== document) return;  //https://bugs.chromium.org/p/chromium/issues/detail?id=430578
	var node=$(this);
	if(typeof(node.attr("cq-no-scroll"))!="undefined") return;
	STX.UI.Prototypes.Scroll.createdCallback.call(this);
};

STX.UI.Prototypes.Menu.attachedCallback=function(){
	if(this.attached) return;
	var node=$(this);
	if(typeof(node.attr("cq-no-scroll"))!="undefined") return;
	this.noMaximize=true;
	STX.UI.Prototypes.Scroll.attachedCallback.call(this);
	this.attached=true;
};

STX.UI.Prototypes.Scroll.setContext=function(context){
	this.context.addClaim(this, STX.UI.KEYSTROKE);
};

STX.UI.Prototypes.Loader=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.Loader.setContext=function(context){
	this.context.setLoader(this);
	context.advertiseAs(this, "Loader");
};

STX.UI.Prototypes.Loader.show=function(){
	$(this).addClass("stx-show");
};

STX.UI.Prototypes.Loader.hide=function(){
	$(this).removeClass("stx-show");
};

STX.UI.Prototypes.ShowRange=Object.create(STX.UI.ContextTag);

/**
 * Proxies UI requests for span changes to the kernel
 * @param {Object} activator Activation information
 * @param {Number} multiplier   The period that will be passed to {@link STXChart#setSpan}
 * @param {Number} base The interval that will be passed to {@link STXChart#setSpan}
 * @param {Number} [interval] Optional chart interval to use (leave empty for autodetect)
 * @param {Number} [period] Optional chart period to use (leave empty for autodetect)
 */
STX.UI.Prototypes.ShowRange.set=function(activator, multiplier, base, interval, period){
	var self=this;
	if(self.context.loader) self.context.loader.show();
	var params={
		multiplier:multiplier,
		base:base
	};
	if(interval){
		params.periodicity={
			interval: interval,
			period: period?period:1
		};
	}
	self.context.stx.setSpan(params, function(){
		if(self.context.loader) self.context.loader.hide();
	});
};


/**
 * Emits a "change" event when changed
 */
STX.UI.Prototypes.DrawingToolbar=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.DrawingToolbar.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ContextTag.attachedCallback.apply(this);
	this.node=$(this);
	this.params={
		toolSelection:this.node.find("*[cq-current-tool]"),
		lineSelection:this.node.find("*[cq-line-style]"),
		fontSizeSelection:this.node.find("*[cq-font-size]"),
		fontFamilySelection:this.node.find("*[cq-font-family]"),
		elementsMap:STX.UI.Prototypes.DrawingToolbar.defaultElements
	};
	this.noToolSelectedText="";
	this.attached=true;
};


STX.UI.Prototypes.DrawingToolbar.defaultElements={
	"line":["cq-line-style", "cq-line-color", "cq-magnetize"],
	"segment":["cq-line-style", "cq-line-color", "cq-magnetize"],
	"ray":["cq-line-style", "cq-line-color", "cq-magnetize"],
	"horizontal":["cq-line-style", "cq-line-color", "cq-axis-label", "cq-magnetize"],
	"vertical":["cq-line-style", "cq-line-color", "cq-axis-label", "cq-magnetize"],
	"continuous":["cq-line-style", "cq-line-color", "cq-magnetize"],
	"fibonacci":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"fibarc":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"fibfan":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"fibtimezone":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"freeform":["cq-line-style", "cq-line-color"],
	"pitchfork":["cq-line-style", "cq-line-color", "cq-magnetize"],
	"annotation":["cq-line-color", "cq-annotation", "cq-magnetize"],
	"callout":["cq-line-color", "cq-annotation", "cq-magnetize"],
	"rectangle":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"ellipse":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"channel":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"gartley":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"arrow":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"check":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"xcross":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"focusarrow":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"heart":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
	"star":["cq-line-style", "cq-line-color", "cq-fill-color", "cq-magnetize"],
};


STX.UI.Prototypes.DrawingToolbar.setContext=function(context){
	this.noToolSelectedText=$(this.params.toolSelection).text();
	this.sync();
};


/**
 * Synchronizes the drawing toolbar with stx.currentVectorParameters. Poor man's data binding.
 * @param {Object} [cvp=stx.currentVectorParameters] A new drawing object, otherwise defaults to the current one
 */
STX.UI.Prototypes.DrawingToolbar.sync=function(cvp){
	var stx=this.context.stx;
	if(!cvp) cvp=stx.currentVectorParameters;
	else stx.currentVectorParameters=cvp;

	this.setLine(null, cvp.lineWidth, cvp.pattern);

	var style=stx.canvasStyle("stx_annotation");

	var initialSize=cvp.annotation.font.size;
	if(!initialSize) initialSize=style.fontSize;
	this.setFontSize(null, initialSize);

	var initialFamily=cvp.annotation.font.family;
	if(!initialFamily) initialFamily=style.fontFamily;
	this.setFontFamily(null, initialFamily);

	this.getFillColor({});
	this.getLineColor({});
};

STX.UI.Prototypes.DrawingToolbar.emit=function(){
	// This is old style to support IE11
	var event = document.createEvent('Event');
	event.initEvent('change', true, true);
	this.dispatchEvent(event);
};

STX.UI.Prototypes.DrawingToolbar.noTool=function(){
	var stx=this.context.stx;
	stx.changeVectorType(null);
	if(stx.layout.crosshair){
		stx.layout.crosshair=false;
		stx.changeOccurred("layout");
		stx.doDisplayCrosshairs();
	}
	$(this.params.toolSelection).text(this.noToolSelectedText);
	this.node.find("*[cq-section]").removeClass("ciq-active");
	this.emit();
};

STX.UI.Prototypes.DrawingToolbar.crosshairs=function(activator){
	var stx=this.context.stx;
	$(this.params.toolSelection).text(stx.translateIf($(activator.node).text()));
	stx.changeVectorType(null);
	stx.layout.crosshair=true;
	stx.doDisplayCrosshairs();
	stx.positionCrosshairsAtPointer();
	stx.findHighlights(false, true);
	stx.changeOccurred("layout");
	stx.draw();
	this.node.find("*[cq-section]").removeClass("ciq-active");
	this.emit();
};

STX.UI.Prototypes.DrawingToolbar.toggleMagnet=function(activator){
	var toggle=$(activator.node).find("cq-toggle");
	var stx=this.context.stx;
	if(ciq.preferences.magnet){
		toggle.removeClass("active");
		ciq.preferences.magnet=false;
	}else{
		toggle.addClass("active");
		ciq.preferences.magnet=true;
	}
	STX.clearCanvas(stx.chart.tempCanvas, stx);
};

STX.UI.Prototypes.DrawingToolbar.clearDrawings=function(){
	this.context.stx.clearDrawings();
};

STX.UI.Prototypes.DrawingToolbar.tool=function(activator, toolName){
	var stx=this.context.stx;
	stx.clearMeasure();
	stx.changeVectorType(toolName);
	$(this.params.toolSelection).text(stx.translateIf($(activator.node).text()));

	this.node.find("*[cq-section]").removeClass("ciq-active");
	var elements=this.params.elementsMap[toolName];
	if(elements){
		for(var i=0;i<elements.length;i++){
			$(this.node).find(elements[i]).addClass("ciq-active");
		}
	}
	this.emit();
};

STX.UI.Prototypes.DrawingToolbar.setLine=function(activator, width, pattern){
	var stx=this.context.stx;

	stx.currentVectorParameters.lineWidth=width;
	stx.currentVectorParameters.pattern=pattern;
	if(this.currentLineSelectedClass) $(this.params.lineSelection).removeClass(this.currentLineSelectedClass);
	this.currentLineSelectedClass="ciq-"+pattern+"-"+parseInt(width,10);
	if(pattern=="none"){
		this.currentLineSelectedClass=null;
	}else{
		$(this.params.lineSelection).addClass(this.currentLineSelectedClass);
	}
	this.emit();
};

STX.UI.Prototypes.DrawingToolbar.setFontSize=function(activator, fontSize){
	var stx=this.context.stx;

	stx.currentVectorParameters.annotation.font.size=fontSize;
	$(this.params.fontSizeSelection).text(fontSize);
	this.emit();
};

STX.UI.Prototypes.DrawingToolbar.setFontFamily=function(activator, fontFamily){
	var stx=this.context.stx;

	if(fontFamily=="Default"){
		stx.currentVectorParameters.annotation.font.family=null;
	}else{
		stx.currentVectorParameters.annotation.font.family=fontFamily;
	}
	$(this.params.fontFamilySelection).text(fontFamily);
	this.emit();
};

STX.UI.Prototypes.DrawingToolbar.toggleFontStyle=function(activator, fontStyle){
	var stx=this.context.stx;

	if(fontStyle=="italic"){
		if(stx.currentVectorParameters.annotation.font.style=="italic"){
			stx.currentVectorParameters.annotation.font.style=null;
			$(activator.node).removeClass("ciq-active");
		}else{
			stx.currentVectorParameters.annotation.font.style="italic";
			$(activator.node).addClass("ciq-active");
		}
	}else if(fontStyle=="bold"){
		if(stx.currentVectorParameters.annotation.font.weight=="bold"){
			stx.currentVectorParameters.annotation.font.weight=null;
			$(activator.node).removeClass("ciq-active");
		}else{
			stx.currentVectorParameters.annotation.font.weight="bold";
			$(activator.node).addClass("ciq-active");
		}
	}
	this.emit();
};

STX.UI.Prototypes.DrawingToolbar.toggleAxisLabel=function(activator){
	var stx=this.context.stx;

	if(stx.currentVectorParameters.axisLabel===true){
		stx.currentVectorParameters.axisLabel=false;
		$(activator.node).removeClass("ciq-active");
	}else{
		stx.currentVectorParameters.axisLabel=true;
		$(activator.node).addClass("ciq-active");
	}
	this.emit();
};

STX.UI.Prototypes.DrawingToolbar.getFillColor=function(activator){
	var node=activator.node;
	if(!node) node=$(this).find("cq-fill-color");
	var color=this.context.stx.currentVectorParameters.fillColor;
	$(node).css({"background-color": color});
};

STX.UI.Prototypes.DrawingToolbar.pickFillColor=function(activator){
	var node=activator.node;
	var colorPickers=this.context.getHelpers(node, "ColorPicker");
	if(!colorPickers.length){
		console.log("STX.UI.Prototypes.DrawingToolbar.getFillColor: no ColorPicker available");
		return;
	}
	var colorPicker=colorPickers[0];
	var self=this;
	colorPicker.callback=function(color){
		self.context.stx.currentVectorParameters.fillColor=color;
		self.getFillColor({node:node});
		self.emit();
	};
	colorPicker.display({node:node});
};

STX.UI.Prototypes.DrawingToolbar.getLineColor=function(activator){
	var node=activator.node;
	if(!node) node=$(this).find("cq-line-color");
	var color=this.context.stx.currentVectorParameters.currentColor;
	if(color=="transparent" || color=="auto") color=this.context.stx.defaultColor;
	$(node).css({"background-color": color});
};

STX.UI.Prototypes.DrawingToolbar.pickLineColor=function(activator){
	var node=activator.node;
	var colorPickers=this.context.getHelpers(node, "ColorPicker");
	if(!colorPickers.length){
		console.log("STX.UI.Prototypes.DrawingToolbar.getFillColor: no ColorPicker available");
		return;
	}
	var colorPicker=colorPickers[0];
	var self=this;
	colorPicker.callback=function(color){
		self.context.stx.currentVectorParameters.currentColor=color;
		self.getLineColor({node:node});
		self.emit();
	};
	colorPicker.display({node:node});
};


STX.UI.Prototypes.Toggle=Object.create(STX.UI.ContextTag);


STX.UI.Prototypes.Toggle.setContext=function(context){
	this.currentValue=false;
	this.params.obj=this.context.stx.layout;
	var member=this.node.attr("cq-member");
	if(member) this.params.member=member;
	var action=this.node.attr("cq-action");
	if(action) this.params.action=action;
	var value=this.node.attr("cq-value");
	if(value) this.params.value=value;
	var toggles=this.node.attr("cq-toggles");
	if(toggles) this.params.toggles=toggles.split(",");
	for(var i=0;i<this.params.toggles.length;i++){
		if(this.params.toggles[i]=="null") this.params.toggles[i]=null;
	}
	this.begin();
};

STX.UI.Prototypes.Toggle.attachedCallback=function(){
	if(this.attached) return;
	this.params={
		member: null,
		obj: null,
		action: "class",
		value: "active",
		toggles: [],
		callbacks: []
	};
	STX.UI.ContextTag.attachedCallback.apply(this);
	this.attached=true;
};

STX.UI.Prototypes.Toggle.registerCallback=function(fc, immediate){
	if(immediate!==false) immediate=true;
	this.params.callbacks.push(fc);
	if(immediate) fc.call(this, this.currentValue);
};

STX.UI.Prototypes.Toggle.updateFromBinding=function(params){
	this.currentValue=params.obj[params.member];
	if(!this.params.callbacks.length){
		if(this.params.action=="class"){
			if(this.currentValue){
				this.node.addClass(this.params.value);
			}else{
				this.node.removeClass(this.params.value);
			}
		}
	}else{
		for(var i=0;i<this.params.callbacks.length;i++){
			this.params.callbacks[i].call(this, this.currentValue);
		}
	}
	
	if( params.member == "crosshair" && this.currentValue === false ) this.context.stx.doDisplayCrosshairs();
};

STX.UI.Prototypes.Toggle.set=function(value){
	if(this.params.member){
		this.params.obj[this.params.member]=value;
	}else{
		this.currentValue=value;
		for(var i=0;i<this.params.callbacks.length;i++){
			this.params.callbacks[i].call(this, this.currentValue);
		}
	}
};

STX.UI.Prototypes.Toggle.begin=function(){
	var self=this;
	var stx=this.context.stx;
	if(this.params.member){
		this.context.observe({
			selector: this.node,
			obj: this.params.obj,
			member: this.params.member,
			action: "callback",
			value: function(params){
				self.updateFromBinding(params);
			}
		});
	}
	this.node.stxtap(function(){
		var toggles=self.params.toggles;
		var obj=self.params.obj;
		if(toggles.length>1){ // Cycle through each field in the array with each tap
			for(var i=0;i<toggles.length;i++){
				var toggle=toggles[i];
				if(self.currentValue==toggle){
					if(i<toggles.length-1)
						self.set(toggles[i+1]);
					else
						self.set(toggles[0]);
					break;
				}
			}
			if(i==toggles.length){ // default to first item in toggle
				self.set(toggles[0]);
			}
		}else{
			if(self.currentValue){
				self.set(false);
			}else{
				self.set(true);
			}
		}
		stx.draw();
		if(obj===stx.layout) stx.changeOccurred("layout");
	});
};

STX.UI.Prototypes.SidePanel=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.SidePanel.createdCallback=function(){
	STX.UI.ContextTag.createdCallback.apply(this,arguments);
	this.callbacks=[];
};

STX.UI.Prototypes.SidePanel.registerCallback=function(fc){
	this.callbacks.push(fc);
};

/**
 * Opens a side panel
 * @param  {Object} params Parameters
 * @param {String} params.selector The selector for which child to enable
 * @param {String} [params.className] The class name to add to turn on the panel
 * @param {String} [params.attribute] The attribute to add to turn on the panel
 */
STX.UI.Prototypes.SidePanel.open=function(params){
	this.close();
	var children=this.node.find(params.selector);
	if(params.className){
		children.addClass(params.className);
		children.each(function(){
			this.sidePanelActiveClass=params.className; // store the class name used to turn it on
		});
	}else{
		children.attr(params.attribute, "true");
		children.each(function(){
			this.sidePanelActiveAttribute=params.attribute; // store the attribute name used to turn it on
		});		
	}
	this.node.attr("cq-active","true");
	var self=this;
	setTimeout(function(){
		self.resizeMyself();
	},0);
};

STX.UI.Prototypes.SidePanel.close=function(){
	this.node.removeAttr("cq-active");
	var children=this.node.children();
	children.each(function(){
		if(this.sidePanelActiveClass)
			$(this).removeClass(this.sidePanelActiveClass); // turn off a child by removing the class name added to it
		else
			$(this).removeAttr(this.sidePanelActiveAttribute); // turn off a child by removing the attribute name added to it
	});
	var self=this;
	setTimeout(function(){
		self.resizeMyself();
	},0);
};

/**
 * Use this method to get the width instead of querying the node directly because the side panel may be animated.
 * @return {[type]} [description]
 */
STX.UI.Prototypes.SidePanel.nonAnimatedWidth=function(){
	var width=0;
	this.node.children().width(function(i,w){width+=w;}); // accumulate width of all children
	return width;
};

STX.UI.Prototypes.SidePanel.resizeMyself=function(){
	var width=0;
	this.node.children().width(function(i,w){width+=w;}); // accumulate width of all children
	this.node.css({"width": width + "px"}); // expand the side panel
	for(var i=0;i<this.callbacks.length;i++) // let any callbacks know that we've been resized
		this.callbacks[i].call(this, width);
};

STX.UI.Prototypes.Dialog=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.Dialog.setContext=function(context){
	this.context.registerForResize(this);
};

STX.UI.Prototypes.Dialog.resize=function(){
	if(this.params && this.params.x){
		this.contextMenu();
	}else{
		this.center();
	}
	var scrollers=$(this.node).find("cq-scroll");
	scrollers.each(function(){
		this.resize();
	});
};

// TODO, test this on a scrollable page
// TODO, adjust for when inside of a container
STX.UI.Prototypes.Dialog.contextMenu=function(){
	var parent=this.node.parent();
	if(parent[0].tagName=="BODY") parent=$(window);
	var w=parent.width();
	var h=parent.height();
	var cw=this.node.outerWidth();
	var ch=this.node.outerHeight();
	var left=this.params.x;
	var top=this.params.y;
	if(left+cw>w) left=w-cw;
	if(top+ch>h) top=top-ch;
	if(top<0) top=0;
	this.node.css({"top":top+"px", "left": left + "px"});
};

STX.UI.Prototypes.Dialog.center=function(){
	var parent=this.node.parent();
	if(parent[0].tagName=="BODY") parent=$(window);
	var w=parent.width();
	var h=parent.height();
	var cw=this.node.outerWidth();
	var ch=this.node.outerHeight();
	var left=w/2-cw/2;
	var top=h/2-ch/2;
	if(left<0) left=0;
	if(h>ch*2 && top+(ch/2)>h/3){
		top=h/3-ch/2; // Position 1/3 down the screen on large screens
	}
	if(top<0) top=0;
	this.node.css({"top":top+"px", "left": left + "px"});
};

/**
 * Hide the dialog
 * @memberOf STX.UI.Dialog
 */

STX.UI.Prototypes.Dialog.close=function(){
	if(this.context.overlay) this.context.overlay.remove();
	this.context.overlay=null;
	this.node.removeClass("stx-active");
	this.node.blur();
	this.context.currentDialog=null;
	this.active=false;
	this.context.activeDialogCount--;
	if(this.context.activeDialogCount===0) {
		this.context.stx.modalEnd();
		$(this.context.topNode).find("*").removeClass("stxMenuActive");
		this.context.restoreLifts();
	}
};

STX.UI.Prototypes.Dialog.hide=function(){
	this.close();
};

/**
 * Show the dialog. Use X,Y *screen location* (pageX, pageY from an event) for where to display context menus. If the context menu cannot fit on the screen then it will be adjusted leftward and upward
 * by enough pixels so that it shows.
 * @param {object} [params] Parameters
 * @param  {Boolean} [params.requireExplicitClose=false] If true then tapping outside of the dialog will not close it
 * @param {Number} [params.x] X location of top left corner. Use for context menus, otherwise dialog will be centered.
 * @param {Number} [params.y] Y location of top left corner. Use for context menus, otherwise dialog will be centered.
 * @memberOf STX.UI.Dialog
 */
STX.UI.Prototypes.Dialog.show=function(params){
	this.params=params;
	if(!params) this.params={};
	var self=this;
	function hide(){
		return function(e){
			if(self.context.activeMenuCount) return; // a menu is open in the dialog
			self.close();
			e.stopPropagation();
		};
	}
	if(!this.context.overlay){
		this.context.overlay=$("<DIV></DIV>");
		this.context.overlay.addClass("ciq-dialog-overlay");
		$("BODY").append(this.context.overlay);
		if(!this.params.requireExplicitClose) STX.safeClickTouch(this.context.overlay[0], hide());
	}
	this.context.currentDialog=this;
	if(!this.active) this.context.activeDialogCount++;
	this.active=true;
	this.context.stx.modalBegin();
	setTimeout(function(){ // to get the opacity transition effect
		if(self.context.overlay) self.context.overlay.addClass("stx-active");
		self.node.addClass("stx-active");
		self.resize();
	});
};

/**
 * An interactive color swatch. Relies on the existance of a {@link
 * STX.UI.Prototypes.ColorPicker} component.
 *
 * When a color is selected, setColor(color) will get called for any parent component with that method
 */
STX.UI.Prototypes.Swatch=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.Swatch.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ContextTag.attachedCallback.apply(this);
	var node=$(this);
	node.on("stxtap", function(self){return function(e){
		self.launchColorPicker();
		e.stopPropagation();
	};}(this));
	this.attached=true;
};

STX.UI.Prototypes.Swatch.setColor=function(color, percolate){
	var node=$(this);
	var bgColor=STX.getBackgroundColor(this.parentNode);
	var hslb=STX.hsl(bgColor);
	if(!color) color="transparent";
	var hslf=STX.hsl(color);
	if((Math.abs(hslb[2] - hslf[2])<0.2) || STX.isTransparent(color)){
		border=STX.chooseForegroundColor(bgColor);
		node.css({"border": "solid " + border + " 1px"});
	}else{
		node.css({"border": ""});		
	}

	node.css({"background-color": color});
	if(percolate!==false) this.containerExecute("setColor", color);
};

STX.UI.Prototypes.Swatch.launchColorPicker=function(){
	var node=$(this);
	var colorPickers=this.context.getHelpers(null, "ColorPicker");
	if(!colorPickers.length){
		console.log("STX.UI.Prototypes.Swatch.launchColorPicker: no ColorPicker available");
		return;
	}

	var colorPicker=colorPickers[0];
	colorPicker.callback=function(self){return function(color){
		self.setColor(color);
	};}(this);
	var overrides=this.node.attr("cq-overrides");
	if(overrides) overrides=overrides.split(",");
	colorPicker.display({node:node, overrides:overrides});
};

/**
 * cq-color-picker component
 * cq-colors attribute can contain a csv list of CSS colors to use
 * or this.params.colorMap can be set to a two dimensional array of colors
 */
STX.UI.Prototypes.ColorPicker=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.ColorPicker.createdCallback=function(){
	STX.UI.ContextTag.createdCallback.apply(this);
	this.params={colorMap:[
		["#ffffff", "#e1e1e1", "#cccccc", "#b7b7b7", "#a0a0a5", "#898989", "#707070", "#626262", "#555555", "#464646", "#363636", "#262626", "#1d1d1d", "#000000"],
		["#f4977c", "#f7ac84", "#fbc58d", "#fff69e", "#c4de9e", "#85c99e", "#7fcdc7", "#75d0f4", "#81a8d7", "#8594c8", "#8983bc", "#a187bd", "#bb8dbe", "#f29bc1"],
		["#ef6c53", "#f38d5b", "#f8ae63", "#fff371", "#acd277", "#43b77a", "#2ebbb3", "#00bff0", "#4a8dc8", "#5875b7", "#625da6", "#8561a7", "#a665a7", "#ee6fa9"],
		["#ea1d2c", "#ee652e", "#f4932f", "#fff126", "#8ec648", "#00a553", "#00a99c", "#00afed", "#0073ba", "#0056a4", "#323390", "#66308f", "#912a8e", "#e9088c"],
		["#9b0b16", "#9e4117", "#a16118", "#c6b920", "#5a852d", "#007238", "#00746a", "#0077a1", "#004c7f", "#003570", "#1d1762", "#441261", "#62095f", "#9c005d"],
		["#770001", "#792e03", "#7b4906", "#817a0b", "#41661e", "#005827", "#005951", "#003b5c", "#001d40", "#000e35", "#04002c", "#19002b", "#2c002a", "#580028"],
		]
	};
};

STX.UI.Prototypes.ColorPicker.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ContextTag.attachedCallback.apply(this);

	var node=$(this);
	var colors=node.attr("cq-colors");
	if(colors){
		// Convert a csv list of colors to a two dimensional array
		colors=colors.split(",");
		var cols=Math.ceil(Math.sqrt(colors.length));
		this.params.colorMap=[];
		var col=0;
		var row=[];
		for(var i=0;i<colors.length;i++){
			if(col>=cols){
				col=0;
				this.params.colorMap.push(row);
				row=[];
			}
			row.push(colors[i]);
			col++;
		}
		this.params.colorMap.push(row);
	}
	this.cqOverrides=node.find("cq-overrides");
	this.template=this.cqOverrides.find("template");
	this.attached=true;
};

STX.UI.Prototypes.ColorPicker.setContext=function(context){
	context.advertiseAs(this, "ColorPicker");
	this.initialize();
};

STX.UI.Prototypes.ColorPicker.setColors=function(colorMap){
	this.params.colorMap=colorMap;
	this.initialize();
};

STX.UI.Prototypes.ColorPicker.initialize=function(){
	var self=this;
	this.picker=$(this);
	this.colors=this.picker.find("cq-colors");
	if(!this.colors.length) this.colors=this.picker;
	this.colors.empty();// allow re-initialize, with new colors for instance

	function pickColor(self, color){
		return function(){
			self.pickColor(color);
		};
	}
	for(var a=0;a<this.params.colorMap.length;a++){
		var lineOfColors=this.params.colorMap[a];
		var ul=$("<UL></UL>").appendTo(this.colors);
		for(var b=0;b<lineOfColors.length;b++){
			var li=$("<LI></LI>").appendTo(ul);
			var span=$("<SPAN></SPAN>").appendTo(li);
			span.css({"background-color": lineOfColors[b]});
			span.stxtap(pickColor(self, lineOfColors[b]));
		}
	}
};

STX.UI.Prototypes.ColorPicker.pickColor=function(color){
	if(this.callback) this.callback(color);
	this.context.closeMenu(this.picker);
};

/**
 * Displays the color picker in proximity to the node passed in
 * @param  {HTMLElement} _node The node near where to display the color picker
 * @param {Array} [overrides] Optional array of overrides. For each of these, a button will be created that if pressed
 * will pass that override back instead of the color
 * @memberOf  STX.UI.ColorPicker
 */
STX.UI.Prototypes.ColorPicker.display=function(activator){
	var node=$(activator.node);

	// Algorithm to place the color picker to the right of whichever node was just pressed
	var positionOfNode=node.offset();
	this.picker.css({"top":"0px","left":"0px"});
	var positionOfColorPicker=this.picker.offset();
	var x=positionOfNode.left-positionOfColorPicker.left + node.width() + 10;
	var y=positionOfNode.top-positionOfColorPicker.top + 5;

	// ensure color picker doesn't go off right edge of screen
	var docWidth=$( document ).width();
	var w=this.picker.width();
	if(x+w>docWidth) x=docWidth-w-20; // 20 for a little whitespace and padding

	// or bottom of screen
	var docHeight=$( document ).height();
	var h=this.picker.height();
	if(y+h>docHeight) y=docHeight-h-20; // 20 for a little whitespace and padding

	this.picker.css({"left": x+"px","top": y+"px"});
	this.cqOverrides.emptyExceptTemplate();

	if(activator.overrides && this.template.length){
		for(var i=0;i<activator.overrides.length;i++){
			var override=activator.overrides[i];
			var n=STX.UI.makeFromTemplate(this.template, true);
			n.text(override);
			n.stxtap((function(self,override){return function(){self.pickColor(override);};})(this, override));
		}
	}

	if(!this.picker.hasClass(this.context.menuParams.activeClassName)){
		this.context.activateMenu(this.picker); // Manually activate the color picker
	}else{
		if(this.context.e) this.context.e.stopPropagation(); // Otherwise the color picker is closed when you swap back and forth between fill and line swatches on the toolbar
	}
};

STX.UI.Prototypes.StudyInput=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.StudyOutput=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.StudyParameter=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.StudyOutput.initialize=function(params){
	this.params=params;
};

STX.UI.Prototypes.StudyOutput.setColor=function(color){
	if(!this.params) return;
	var updates={outputs:{}};
	updates.outputs[this.params.output]=color;
	this.params.studyDialog.updateStudy(updates);
};

STX.UI.Prototypes.StudyParameter.initialize=function(params){
	this.params=params;
};

STX.UI.Prototypes.StudyParameter.setColor=function(color){
	if(!this.params) return;
	var updates={parameters:{}};
	updates.parameters[this.params.parameter]=color;
	this.params.studyDialog.updateStudy(updates);
};

STX.UI.Prototypes.StudyDialog=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.StudyDialog.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ContextTag.attachedCallback.apply(this);
	var dialog=$(this);
	this.inputTemplate=dialog.find("template[cq-study-input]");
	this.outputTemplate=dialog.find("template[cq-study-output]");
	this.parameterTemplate=dialog.find("template[cq-study-parameters]");
	this.attached=true;
};

STX.UI.Prototypes.StudyDialog.setContext=function(context){
	context.advertiseAs(this, "StudyDialog");
};

/**
 * Sets up a handler to process changes to input fields
 * @param {HTMLElement} node    The input field
 * @param {String} section The section that is being updated, "inputs","outputs","parameters"
 * @param {String} name    The name of the field being updated
 * @memberOf  STX.UI.StudyEdit
 * @private
 */
STX.UI.Prototypes.StudyDialog.setChangeEvent=function(node, section, name){
	var self=this;
	function closure(){
		return function(){
			var updates={};
			updates[section]={};
			updates[section][name]=this.value;
			if(this.type=="checkbox" || this.type=="radio"){
				updates[section][name]=this.checked;
			}
			self.updateStudy(updates);
		};
	}
	node.change(closure());
};

STX.UI.Prototypes.StudyDialog.updateStudy=function(updates){
	var self=this;
	function update(params){
		if(!self.parentNode.active) {
			self.helper.updateStudy(self.lastUpdate);
			self.lastUpdate=null;
		}
	}
	if(!this.lastUpdate){
		if(this.helper.libraryEntry.deferUpdate){
			this.lastUpdate=updates;
			this.context.observe({obj:this.parentNode, member:"active", action:"callback", value:update});
		}
		else this.helper.updateStudy(updates);
	}else{
		STX.extend(this.lastUpdate,updates);
	}
};

/**
 * Accepts new menu (select box) selections
 */
STX.UI.Prototypes.StudyDialog.setSelectOption=function(activator){
	var params=activator.params;
	var newInput=$($(activator.node)[0].cqMenuWrapper);
	var inputValue=newInput.find("cq-selected");
	inputValue.text(params.value);
	newInput[0].fieldValue=params.value;
	var updates={inputs:{}};
	updates.inputs[params.name]=params.value;
	this.updateStudy(updates);
};

STX.UI.Prototypes.StudyDialog.configure=function(params){
	// Generate a "helper" which tells us how to create a dialog
	this.helper=new STX.Studies.DialogHelper(params);
	var dialog=$(this);

	dialog.find(".title").text(this.helper.title);

	var self=this;
	function makeMenu(name, currentValue, fields){
		var menu=STX.UI.makeFromTemplate(self.menuTemplate);
		var cqMenu=menu.find("cq-menu div"); // scrollable in menu.
		for(var field in fields){
			var item=$("<cq-item></cq-item>");
			item.text(fields[field]);
			item.attr("stxtap","StudyDialog.setSelectOption()"); // must call StudyDialog because the item is "lifted" and so doesn't know it's parent
			cqMenu.append(item);
			item[0].cqMenuWrapper=cqMenu.parents("cq-menu-wrap")[0];
			self.context.bind(item, {name: name, value: field});
		}
		var inputValue=menu.find("cq-selected");
		inputValue.text(currentValue);
		return menu;
	}

	// Create form elements for all of the inputs
	var inputs=dialog.find("cq-study-inputs");
	inputs.empty();
	for(var i in this.helper.inputs){
		var input=this.helper.inputs[i];
		var newInput=STX.UI.makeFromTemplate(this.inputTemplate, inputs);
		this.menuTemplate=newInput.find("template[cq-menu]");
		newInput.find(".ciq-heading").text(input.heading);
		newInput[0].fieldName=input.name;
		var formField=null;

		var option;
		if(input.type=="number"){
			formField=$("<input>");
			formField.attr("type", "number");
			formField.val(input.value);
			this.setChangeEvent(formField, "inputs", input.name);
		}else if(input.type=="text"){
			formField=$("<input>");
			formField.attr("type", "text");
			formField.val(input.value);
			this.setChangeEvent(formField, "inputs", input.name);
		}else if(input.type=="select"){
			formField=makeMenu(input.name, input.value, input.options);
		}else if(input.type=="checkbox"){
			formField=$("<input>");
			formField.attr("type","checkbox");
			if(input.value) formField.prop("checked", true);
			this.setChangeEvent(formField, "inputs", input.name);
		}
		if(formField) newInput.find(".stx-data").append(formField);
	}

	var outputs=dialog.find("cq-study-outputs");
	outputs.empty();
	for(i in this.helper.outputs){
		var output=this.helper.outputs[i];
		var newOutput=STX.UI.makeFromTemplate(this.outputTemplate, outputs);
		newOutput[0].initialize({studyDialog:this, output:output.name, params: params});
		newOutput.find(".ciq-heading").text(output.heading);
		newOutput.find(".ciq-heading")[0].fieldName=output.name;

		var swatch=newOutput.find("cq-swatch");
		swatch[0].setColor(output.color, false); // don't percolate
	}
	
	var parameters=dialog.find("cq-study-parameters");
	parameters.empty();
	for(i in this.helper.parameters){
		var parameter=this.helper.parameters[i];
		var newParam=STX.UI.makeFromTemplate(this.parameterTemplate, parameters);
		newParam.find(".ciq-heading").text(parameter.heading);
		var swatch=newParam.find("cq-swatch");
		var paramInput=$("<input>");
		if(parameter.defaultValue.constructor==Boolean){
			paramInput.attr("type", "checkbox");
			if(parameter.value) paramInput.prop("checked", true);
			this.setChangeEvent(paramInput, "parameters", parameter.name+"Enabled");
			swatch.remove();
		}else if(parameter.defaultValue.constructor==Number){
			paramInput.attr("type", "number");
			paramInput.val(parameter.value);
			this.setChangeEvent(paramInput, "parameters", parameter.name+"Value");
			newParam[0].initialize({studyDialog:this, parameter:parameter.name+"Color", params: params});
			swatch[0].setColor(parameter.color, false); // don't percolate
		}else continue;
		newParam.find(".stx-data").append(paramInput);
	};

};



/**
 * UI Helper that maintains a legend of studies. Click on the "X" to remove the study. Click on the cog to edit the study.
 * Optionally only show studies needing custom Removal. cq-custom-removal-only
 * Optionally only show overlays. cq-overlays-only
 * Optionally only show studies in this panel. cq-panel-only
 * @constructor 
 */
STX.UI.Prototypes.StudyLegend=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.StudyLegend.setContext=function(context){
	this.template=this.node.find("template");
	this.previousStudies={};
	this.begin();
};

STX.UI.Prototypes.StudyLegend.setCallback=function(cb){
	this.cb=cb;
};

/**
 * Begins running the StudyLegend.
 * @memberOf STX.UI.StudyLegend
 * @private
 */
STX.UI.Prototypes.StudyLegend.begin=function(){
	var self=this;
	this.addInjection("append", "createDataSet", function(){
		self.showHide();
		self.renderLegend();
	});
};

STX.UI.Prototypes.StudyLegend.showHide=function(){
	if(STX.isEmpty(this.context.stx.layout.studies)){
		$("cq-study-legend").css({"display":"none"});
	}else{
		$("cq-study-legend").css({"display":""});		
	}
	if(this.cb) this.cb();
};

/**
 * Renders the legend based on the current studies in the STXChart object. Since this gets called
 * continually in the draw animation loop we are very careful not to render unnecessarily.
 * @memberOf STX.UI.StudyLegend
 */
STX.UI.Prototypes.StudyLegend.renderLegend=function(){
	var stx=this.context.stx;
	if(!stx.layout.studies) return;
	var foundAChange=false;
	var id;

	// Logic to determine if the studies have changed, otherwise don't re-create the legend
	if(STX.objLength(this.previousStudies)==STX.objLength(stx.layout.studies)){
		for(id in stx.layout.studies){
			if(!this.previousStudies[id]){
				foundAChange=true;
				break;
			}
		}
		if(!foundAChange) return;
	}
	this.previousStudies=STX.shallowClone(stx.layout.studies);

	$(this.template).parent().emptyExceptTemplate();

	function closeStudy(self, sd){
		return function(e){
		    STX.Studies.removeStudy(self.context.stx,sd);
		    self.renderLegend();
		};
	}
	function editStudy(self, sd){
		return function(e){
			self.context.closeMenu();
			var studyEdit=self.context.getHelpers(self.node, "StudyEdit")[0];
			var isPanelStudy=!(sd.study.overlay || sd.study.underlay);
			var params={stx:stx,sd:sd,inputs:sd.inputs,outputs:sd.outputs, parameters:sd.parameters};
			studyEdit.editPanel(params);
		};
	}
	var overlaysOnly=typeof(this.node.attr("cq-overlays-only"))!="undefined";
	var panelOnly=typeof(this.node.attr("cq-panel-only"))!="undefined";
	var customRemovalOnly=typeof(this.node.attr("cq-custom-removal-only"))!="undefined";
	var holder=this.node.parents(".stx-holder");
	var panelName=null;
	if(holder.length){
		panelName=holder.attr("cq-panel-name");
	}
	for(id in stx.layout.studies){
		var sd=stx.layout.studies[id];
		if(customRemovalOnly && !sd.study.customRemoval) continue;
		if(panelOnly && sd.panel!=panelName) continue;
		if(overlaysOnly && !sd.libraryEntry.overlay) continue;
		var newChild=STX.UI.makeFromTemplate(this.template, true);
		newChild.find("cq-label").html(id);
		var close=newChild.find(".ciq-close");
		close.stxtap(closeStudy(this, sd));
		var edit=newChild.find(".ciq-edit");
		edit.stxtap(editStudy(this, sd));
	}
	this.showHide();
};


STX.UI.Prototypes.Undo=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.Undo.createdCallback=function(){
	STX.UI.ContextTag.createdCallback.apply(this);
	this.redoButton=null;
	this.undostack=[];
	this.redostack=[];
	this.contexts=[];
};

STX.UI.Prototypes.Undo.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ContextTag.attachedCallback.apply(this);
	this.attached=true;
	var self=this;
	$(this).on("stxtap", function(){
		self.undo();
	});
};

STX.UI.Prototypes.Undo.setContext=function(context){
	this.manageContext(this.context);

	var self=this;
	this.addInjection("append", "initializeChart", function(){
    	self.undostack=[];
    	self.redostack=[];
    	self.clear();
	});
};


STX.UI.Prototypes.Undo.handleEvent=function(context, type, data){
	this.undostack.push({context: context, drawings:data.before});
	this.redostack=[];
	this.setButtonStyle();
};

STX.UI.Prototypes.Undo.manageContext=function(context){
	context.addClaim(this, STX.UI.KEYSTROKE);
	var self=this;
	context.stx.addEventListener("undoStamp", function(data){
		self.handleEvent(context, "undoStamp", data);
	});
	this.contexts.push(context);
};

STX.UI.Prototypes.Undo.keyStroke=function(hub, key, e, keystroke){
	if(key==90 && (keystroke.ctrl || keystroke.cmd)){ // ctrl-z
		if(keystroke.shift){
			this.redo();
		}else{
			this.undo();			
		}
		return true;
	}
	if(key==89 && (keystroke.ctrl || keystroke.cmd)){ // ctrl-y
		this.redo();
		return true;
	}
};

STX.UI.Prototypes.Undo.undo=function(){
	// If a drawing tool is in action, then pressing undo will kill the current tool
	var foundOne=false;
	for(var i=0;i<this.contexts.length;i++){
		if(this.contexts[i].stx.activeDrawing){
			this.contexts[i].stx.undo();
			foundOne=true;
		}
	}
	if(foundOne) return;

	// otherwise proceed to popping off the stack
	var state=this.undostack.pop();
	if(state){
		var context=state.context;
		this.redostack.push({context:context, drawings: STX.shallowClone(context.stx.drawingObjects)});
		var drawings=state.drawings;
		context.stx.drawingObjects=STX.shallowClone(drawings);
		context.stx.changeOccurred("vector");
		context.stx.draw();
	}
	this.setButtonStyle();
};

STX.UI.Prototypes.Undo.redo=function(){
	var state=this.redostack.pop();
	if(state){
		var context=state.context;
		this.undostack.push({context:context, drawings: STX.shallowClone(context.stx.drawingObjects)});
		var drawings=state.drawings;
		context.stx.drawingObjects=STX.shallowClone(drawings);
		context.stx.changeOccurred("vector");
		context.stx.draw();
	}
	this.setButtonStyle();
};

/**
 * Clears the stack of all redo or undo operations for the context
 * @param  {STX.UI.Context} context The context to clear
 */
STX.UI.Prototypes.Undo.clear=function(context){
	this.setButtonStyle();
};

STX.UI.Prototypes.Undo.setButtonStyle=function(){
	if(this.undostack.length){
		$(this).attr("cq-active","true");
	}else{
		$(this).removeAttr("cq-active");
	}
	if(this.redoButton){
		if(this.redostack.length){
			$(this.redoButton).attr("cq-active","true");
		}else{
			$(this.redoButton).removeAttr("cq-active");
		}
	}
};

STX.UI.Prototypes.Redo=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.Redo.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ContextTag.attachedCallback.apply(this);
	this.attached=true;
};

STX.UI.Prototypes.Redo.pairUp=function(undo){
	this.undo=$(undo)[0];
	this.undo.redoButton=this;
	var self=this;
	$(this).on("stxtap", function(){
		self.undo.redo();
	});
};


STX.UI.Prototypes.Advertisement=Object.create(STX.UI.ModalTag);

STX.UI.Prototypes.Advertisement.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ModalTag.attachedCallback.apply(this);
	this.nameValueStore=new STX.NameValueStore();
	this.attached=true;
};

/**
 * Sets the sleep time for this amount of time before re-displaying
 * @param  {Number} units    Units
 * @param  {String} unitType Unit type. Value values "minute","hour","day","week"
 */
STX.UI.Prototypes.Advertisement.setSleepAmount=function(units, unitType){
	this.sleepAmount={
		units: units,
		unitType: unitType
	};
};

STX.UI.Prototypes.Advertisement.setNameValueStore=function(nameValueStore){
	this.nameValueStore=nameValueStore;
};

STX.UI.Prototypes.Advertisement.makeMarker=function(){
	if(this.markerExists) return;
    var marker=new STX.Marker({
    	stx: this.context.stx,
    	xPositioner: "none",
    	label: "advertisement",
    	permanent: true,
    	node: this.node[0]
    });
    this.markerExists=true;
};

/**
 * Show the advertisement. This should be a div inside of the web component.
 * @param  {Selector} [selector]    A selector. If none specified then the first div will be selected.
 * @param  {Boolean} [ignoreSleep=false] If true then ignore sleep
 */
STX.UI.Prototypes.Advertisement.show=function(selector, ignoreSleep){
	if(this.selector){
		var priorContent=this.node.find(this.selector);
		priorContent.removeClass("ciq-show");		
	}
	this.selector=selector;
	if(!this.selector){
		var div=this.node.find("div:first-of-type");
		this.selector="." +  div.attr("class");
	}
	this.ignoreSleep=ignoreSleep;
	var self=this;
	function doIt(){
		self.makeMarker();
		self.node.css({"display":"block"});
		var content=self.node.find(self.selector);
		content.addClass("ciq-show");

		// resize content
		self.node.css({height:"0px"});
		setTimeout(function(){
			self.node.css({height:self.node[0].scrollHeight+"px"});
		},0);

	}
	if(!ignoreSleep){
		this.nameValueStore.get("cq-advertisement", function(err, ls){
			if(err) return;
			if(!ls || typeof(ls)!="object") ls={};
			var ms=ls[self.selector];
			var dt=new Date(ms);
			if(ms && ms>Date.now()) return; // still surpressed
			doIt();
		});
	}else{
		doIt();
	}
};

/**
 * Hides the advertisement and surpresses it for 24 hours by storing it in local storage.
 * If the selector itself changes however then the ad will reappear.
 */
STX.UI.Prototypes.Advertisement.close=function(){
	this.node.css({"display":"none"});
	var self=this;
	this.nameValueStore.get("cq-advertisement", function(err, ls){
		if(err) return;
		var future=new Date();
		if(!self.sleepAmount) self.sleepAmount={units:1,unitType:"day"};
		var u=self.sleepAmount.units;
		var ut=self.sleepAmount.unitType;
		if(ut=="minute") future.setMinutes(future.getMinutes()+u);
		else if(ut=="hour") future.setHours(future.getHours()+u);
		else if(ut=="day") future.setDate(future.getDate()+u);
		else if(ut=="week") future.setDate(future.getDate()+(u*7));
		else if(ut=="month") future.setMonth(future.getMonth()+u);
		var ms=future.getTime();
		if(!ls || typeof(ls)!="object") ls={};
		ls[self.selector]=ms;
		self.nameValueStore.set("cq-advertisement", ls);
	});
};

/**
 * Call this to force the advertisement to monitor the nameValueStore for updates. It will do this by
 * polling. This is useful when running in multiple windows, do that if the advertisement is closed in one
 * window then it will automatically close in the other windows.
 * @param {Number} [ms=1000] Number of milliseconds to poll.
 */
STX.UI.Prototypes.Advertisement.watchForRemoteClose=function(ms){
	if(!ms) ms=1000;
	var self=this;
	setInterval(function(){
		if(self.node.css("display")=="none") return; // already closed, do nothing
		self.nameValueStore.get("cq-advertisement", function(err,ls){
			if(err) return;
			if(!ls || typeof(ls)!="object") ls={};
			var ms=ls[self.selector];
			if(ms && ms>Date.now())
				self.close();
		});
	},ms);
};


/**
 * UI Helper for managing Themes. This helper has two functions. The first is displaying available themes
 * in a menu. The second is providing a theme dialog for entering a new theme.
 *
 * Built in themes are merely the names of classes that will be added to the top element of the UIContext when
 * selected.
 * 
 * @param {HTMLElement} [node] The node where to place menu items
 * @param {STX.UI.Context} context The context for the chart
 * @param {Object} [params] Parameters to drive the helper
 * @param {STX.UI.Dialog} [params.themeDialog] The theme dialog to use
 * @param {Object} [params.builtInThemes] Object map of built in theme names, display names
 * @param {Object} [params.customThemes] Object describing custom themes defined by the user
 * @param {Function} [params.callback] Callback function when the user adds, deletes or modifies a custom theme. The parameter will be an object that can be sent to this.setState()
 * @param {STX.NameValueStore} [params.nameValueStore] An optional NameValueStore object. If passed them saving and restoring will be automatic.
 * @name STX.UI.Themes
 * @constructor
 */

STX.UI.Prototypes.Themes=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.Themes.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ContextTag.attachedCallback.apply(this);
	this.attached=true;
	this.builtInMenu=$(this).find("cq-themes-builtin");
	this.builtInTemplate=this.builtInMenu.find("template");
	this.customMenu=$(this).find("cq-themes-custom");
	this.customTemplate=this.customMenu.find("template");
};

STX.UI.Prototypes.Themes.setContext=function(context){
	context.advertiseAs(this, "Themes");
};
/**
 * @param {Object} params Parameters
 * @param {Object} [params.builtInThemes] Object map of built in theme names, display names
 * @param {Object} [params.defaultTheme] The default built in theme to use
 * @param {Object} [params.nameValueStore] A {@link STX.NameValueStore} object for fetching and saving theme state
 */
STX.UI.Prototypes.Themes.initialize=function(params){
	this.params={};
	if(params) this.params=params;
	if(!this.params.customThemes) this.params.customThemes={};
	if(!this.params.builtInThemes) this.params.builtInThemes={};
	if(!this.params.nameValueStore) this.params.nameValueStore=new STX.NameValueStore();

	var self=this;

	if(this.params.nameValueStore){
		// Retrieve any custom themes the user has created
		this.params.nameValueStore.get("CIQ.Themes.custom", function(err, result){
			if(!err && result){
				self.params.customThemes=result;
			}
			// Set the current theme to the last one selected by user
			self.params.nameValueStore.get("CIQ.Themes.current", function(err, result){
				if(!err && result && result.theme){
					self.loadTheme(result.theme);
				}else{
					self.loadTheme(self.params.defaultTheme);
				}
				self.configureMenu();
			});
		});
	}else{
		this.loadTheme(self.params.defaultTheme);
	}
};

STX.UI.Prototypes.Themes.configureMenu=function(){
	var self=this;
	function loadBuiltIn(self, className){
		return function(e){
			self.loadBuiltIn(className);
			if(self.params.callback){
				self.params.callback({theme:self.currentTheme});
			}
			self.persist("current");
		};
	}
	function loadCustom(self, themeName){
		return function(e){
			self.loadCustom(themeName);
			if(self.params.callback){
				self.params.callback({theme:self.currentTheme});
			}
			self.persist("current");
		};
	}
	this.builtInMenu.emptyExceptTemplate();
	this.customMenu.emptyExceptTemplate();
	var display,newMenuItem;
	var builtInThemes=this.params.builtInThemes;
	for(var className in builtInThemes){
		display=builtInThemes[className];
		newMenuItem=STX.UI.makeFromTemplate(this.builtInTemplate);
		newMenuItem.text(display);
		newMenuItem[0].selectFC=loadBuiltIn(this, className);
		newMenuItem.on("tap", newMenuItem[0].selectFC);
		this.builtInMenu.append(newMenuItem);
	}

	var customThemes=this.params.customThemes;
	for(var themeName in customThemes){
		display=themeName;
		newMenuItem=STX.UI.makeFromTemplate(this.customTemplate);
		newMenuItem.find("cq-label").text(display);
		newMenuItem[0].selectFC=loadCustom(this, themeName);
		newMenuItem.on("tap", newMenuItem[0].selectFC);
		newMenuItem[0].close=(function(self, themeName){ return function(){ self.removeTheme(themeName);}; })(this, themeName);
		this.customMenu.append(newMenuItem);
	}
};

STX.UI.Prototypes.Themes.removeTheme=function(themeName){
	delete this.params.customThemes[themeName];
	this.configureMenu();
	this.persist();
};

STX.UI.Prototypes.Themes.persist=function(which){
	if(!this.params.nameValueStore) return;
	if(!which || which=="current") this.params.nameValueStore.set("CIQ.Themes.current", {theme:this.currentTheme});
	if(!which || which=="custom") this.params.nameValueStore.set("CIQ.Themes.custom", this.params.customThemes);
};

STX.UI.Prototypes.Themes.addCustom=function(theme){
	this.params.customThemes[theme.name]=theme;
	this.currentTheme=theme.name;
	this.configureMenu();
	this.persist();
};

/**
 * @private
 * @memberOf STX.UI.Themes
 */
STX.UI.Prototypes.Themes.reinitializeChart=function(theme){
	var stx=this.context.stx;
	stx.styles={};
	stx.chart.container.style.backgroundColor="";
	if(theme){
		var helper=new STX.ThemeHelper({stx:stx});
		helper.settings=theme.settings;
		helper.update();		
	}
	stx.updateListeners("theme");
	if(stx.displayInitialized){
		stx.headsUpHR();
		stx.clearPixelCache();
		stx.updateListeners("theme");
		stx.draw();
	}
};

STX.UI.Prototypes.Themes.loadTheme=function(themeName){
	if(this.params.customThemes[themeName])
		this.loadCustom(themeName);
	else if(this.params.builtInThemes[themeName])
		this.loadBuiltIn(themeName);
	else
		this.loadBuiltIn(this.params.defaultTheme);
};

STX.UI.Prototypes.Themes.loadBuiltIn=function(className){
	if(this.currentLoadedBuiltIn){
		$(this.context.topNode).removeClass(this.currentLoadedBuiltIn);
	}
	$(this.context.topNode).addClass(className);
	this.currentLoadedBuiltIn=this.currentTheme=className;
	this.reinitializeChart();
};

STX.UI.Prototypes.Themes.loadCustom=function(themeName){
	if(this.currentLoadedBuiltIn){
		$(this.context.topNode).removeClass(this.currentLoadedBuiltIn);
	}
	var theme=this.params.customThemes[themeName];
	if(theme.builtIn) $(this.context.topNode).addClass(theme.builtIn);
	this.currentLoadedBuiltIn=theme.builtIn;
	this.currentTheme=theme.name;
	this.reinitializeChart(theme);
};

STX.UI.Prototypes.Themes.newTheme=function(){
	var dialog=this.context.getHelpers(null, "ThemeDialog");
	if(!dialog.length){
		console.log("STX.UI.Prototypes.Themes.newTheme: no ThemeDialog available");
		return;
	}
	dialog=dialog[0];
	dialog.configure(null, this);
	$(dialog).parents("cq-dialog")[0].show();
};


STX.UI.Prototypes.ThemePiece=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.ThemePiece.setColor=function(color){
	if(color=="Hollow" || color=="No Border"){
		color="transparent";
		this.node.find("cq-swatch")[0].setColor("transparent", false);
	}
	this.containerExecute("setValue", this.piece.obj, this.piece.field, color);
};

STX.UI.Prototypes.ThemePiece.setBoolean=function(result){
	this.containerExecute("setValue", this.piece.obj, this.piece.field, result);
};

STX.UI.Prototypes.ThemeDialog=Object.create(STX.UI.ContextTag);


STX.UI.Prototypes.ThemeDialog.setContext=function(context){
	context.advertiseAs(this, "ThemeDialog");
};

STX.UI.Prototypes.ThemeDialog.setValue=function(obj, field, value){
	obj[field]=value;
	this.helper.update();
};

STX.UI.Prototypes.ThemeDialog.close=function(){
	this.helper.settings=this.revert;
	this.helper.update();
	this.containerExecute("close");
};

STX.UI.Prototypes.ThemeDialog.save=function(){

	var themeName=this.node.find("cq-action input").val();
	var theme={
		settings:STX.clone(this.helper.settings),
		name: themeName,
		builtIn:null
	};
	//var themeMenu=this.context.getHelpers(null, "Themes"); // TODO, fix advertiseAs by using bus, eliminate auto-creation of helpers
	var themeMenu=this.themeMenu;
	if(themeMenu){
		theme.builtIn=themeMenu.currentLoadedBuiltIn;
		themeMenu.addCustom(theme);
	}
	this.context.stx.updateListeners("theme");
	this.node.parents("cq-dialog")[0].close();
};

STX.UI.Prototypes.ThemeDialog.configure=function(themeName, themeMenu){
	this.themeMenu=themeMenu;
	this.helper=new STX.ThemeHelper({stx:this.context.stx});
	this.revert=STX.clone(this.helper.settings);

	var self=this;
	function configurePiece(name, obj, field, type){
		var cu=self.node.find('cq-theme-piece[cq-piece="' + name + '"]');

		cu[0].piece={obj:obj, field:field};
		if(type=="color"){
			cu.find("cq-swatch")[0].setColor(obj[field], false);
		}
	}
	configurePiece("cu", this.helper.settings.chartTypes["Candle/Bar"].up, "color", "color");
	configurePiece("cd", this.helper.settings.chartTypes["Candle/Bar"].down, "color", "color");
	configurePiece("wu", this.helper.settings.chartTypes["Candle/Bar"].up, "wick", "color");
	configurePiece("wd", this.helper.settings.chartTypes["Candle/Bar"].down, "wick", "color");
	configurePiece("bu", this.helper.settings.chartTypes["Candle/Bar"].up, "border", "color");
	configurePiece("bd", this.helper.settings.chartTypes["Candle/Bar"].down, "border", "color");
	configurePiece("lc", this.helper.settings.chartTypes["Line"], "color", "color");
	configurePiece("mc", this.helper.settings.chartTypes["Mountain"], "color", "color");
	configurePiece("bg", this.helper.settings.chart["Background"], "color", "color");
	configurePiece("gl", this.helper.settings.chart["Grid Lines"], "color", "color");
	configurePiece("dd", this.helper.settings.chart["Grid Dividers"], "color", "color");
	configurePiece("at", this.helper.settings.chart["Axis Text"], "color", "color");

	if(!themeName) themeName="My Theme";
	this.node.find("cq-action input").val(themeName);

};

/**
 * Manages a comparison UI.
 * Add attribute cq-marker in order to have the component insert itself as a marker on the chart
 * @type {[type]}
 */
STX.UI.Prototypes.Comparison=Object.create(STX.UI.ModalTag);


STX.UI.Prototypes.Comparison.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ModalTag.attachedCallback.apply(this);
	var node=$(this);
	this.attached=true;
	this.swatchColors=["#8ec648", "#00afed",  "#ee652e", "#912a8e", "#fff126",
	"#e9088c", "#ea1d2c", "#00a553", "#00a99c",  "#0056a4", "#f4932f", "#0073ba", "#66308f", "#323390", ];
	this.loading=[];
};

STX.UI.Prototypes.Comparison.removeSeries=function(symbol, series){
	this.context.stx.removeSeries(symbol);
};

STX.UI.Prototypes.Comparison.pickSwatchColor=function(){
	var node=$(this);
	var stx=this.context.stx;
	var swatch=node.find("cq-swatch");
	if(!swatch) return;
	var currentColor=swatch[0].style.backgroundColor;

	var usedColors={};
	for(var s in stx.chart.series){
		var series=stx.chart.series[s];
		if(!series.parameters.isComparison) continue;
		usedColors[series.parameters.color]=true;
	}

	if(currentColor!=="" && !usedColors[currentColor]) return; // Currently picked color not in use then allow it
	for(var i=0;i<this.swatchColors.length;i++){ // find first unused color from available colors
		if(!usedColors[this.swatchColors[i]]){
			swatch[0].style.backgroundColor=this.swatchColors[i];
			return;
		}
	}
	//Uh oh, all colors take. Last color will keep getting used.
};

/**
 * The legend gets re-rendered whenever we createDataSet() (wherein the series may have changed).
 * We re-render the entire thing each time, but we use a virtual DOM to determine whether
 * to actually change anything on the screen (so as to avoid unnecessary flickering)
 */
STX.UI.Prototypes.Comparison.renderLegend=function(){
	var node=$(this);
	var key=node.find("cq-comparison-key").cqvirtual();
	var stx=this.context.stx;
	var q=stx.currentQuote();
	for(var s in stx.chart.series){
		var series=stx.chart.series[s];
		if(!series.parameters.isComparison) continue;
		var frag=STX.UI.makeFromTemplate(this.template);
		var swatch=frag.find("cq-comparison-swatch");
		var label=frag.find("cq-comparison-label");
		var description=frag.find("cq-comparison-description");
		var price=frag.find("cq-comparison-price");
		var tickPrice=frag.find("cq-comparison-tick-price");
		var loader=frag.find("cq-comparison-loader");
		var btn=frag.find(".ciq-close");
		swatch.css({"background-color": series.parameters.color});
		label.text(stx.translateIf(series.display));
		description.text(stx.translateIf(series.description));
		frag.attr("cq-symbol", s);

		if(price.length && q){
			price.text(stx.padOutPrice(q[s]));
		}

		if(this.loading[series.parameters.symbolObject.symbol]) loader.addClass("stx-show");
		else loader.removeClass("stx-show");
		if(series.parameters.error) frag.attr("cq-error", true);
		btn.stxtap(function(self, s, series){ return function(){
			self.nomore=true;
			self.removeSeries(s, series);
			self.modalEnd(); // tricky, we miss mouseout events when we remove items from under ourselves
		};}(this, s, series));
		key.append(frag);
	}
	key.cqrender();
	this.pickSwatchColor();
};

STX.UI.Prototypes.Comparison.updatePrices=function(){
	var key=this.node.find("cq-comparison-key");
	var stx=this.context.stx;
	var q=stx.currentQuote();
	if( q) {
		for(var s in stx.chart.series){
			var price=key.find('cq-comparison-item[cq-symbol="' + s + '"] cq-comparison-price');
			if(price.length){
				var oldPrice=parseFloat(price.text());
				var newPrice=q[s];
				price.text(stx.padOutPrice(newPrice));
				if(typeof(price.attr("cq-animate"))!="undefined")
					STX.UI.animatePrice(price, newPrice, oldPrice);
			}
		}
	}
};

STX.UI.Prototypes.Comparison.startPriceTracker=function(){
	var self=this;
	this.addInjection("append", "createDataSet", function(){
		self.updatePrices();
	});
};

STX.UI.Prototypes.Comparison.position=function(){
	var stx=this.context.stx;
	var bar=stx.barFromPixel(stx.cx);
	this.tick=stx.tickFromPixel(stx.cx);
	var prices=stx.chart.xaxis[bar];
	var key=this.node.find("cq-comparison-key");	
	var node=this.node;
	var self=this;
	
	function printValues(){
		self.timeout=null;
		for(var s in stx.chart.series){
			var price=key.find('cq-comparison-item[cq-symbol="' + s + '"] cq-comparison-tick-price');
			price.text("");
			if(price.length){
				price.text(stx.padOutPrice(prices.data[s]));
			}
		}		
	}
	if(this.tick!=this.prevTick){
		if(this.timeout) clearTimeout(this.timeout);
		var ms=0; // IE and FF struggle to keep up with the dynamic head's up.
		this.timeout=setTimeout(printValues, ms);
	}
	this.prevTick=this.tick; // We don't want to update the dom every pixel, just when we cross into a new candle
};

STX.UI.Prototypes.Comparison.startTickPriceTracker=function(){
	this.prevTick=null;
	this.addInjection("prepend","headsUpHR", function(self){ return function(){self.position();};}(this));
};

STX.UI.Prototypes.Comparison.setContext=function(context){
	this.node.attr("cq-show","true");
	// if attribute cq-marker then detach and put ourselves in the chart holder
	context.advertiseAs(this, "Comparison");
	this.configureUI();
	var self=this;
	this.context.observe({
		obj: this.context.stx.chart.series,
		action: "callback",
		value:function(){self.renderLegend();}
	});
	var frag=STX.UI.makeFromTemplate(this.template);
	if(frag.find("cq-comparison-price")){
		this.startPriceTracker();
	}
	if(frag.find("cq-comparison-tick-price")){
		this.startTickPriceTracker();
	}
};

STX.UI.Prototypes.Comparison.selectItem=function(context, obj){
	var series=null;
	var self=this;
	function cb(err, series){
		if(err){
			series.parameters.error=true;
			//todo, report error
		}
		self.loading[series.parameters.symbolObject.symbol]=false;
		self.renderLegend();
	}
	var swatch=this.node.find("cq-swatch");
	var color="auto";
	if(swatch[0]) color=swatch[0].style.backgroundColor;
	var stx=context.stx;
	this.loading[obj.symbol]=true;
	var params={
		//field: obj.symbol,
		symbolObject: obj,
		isComparison: true,
		color: color,
		data: {useDefaultQuoteFeed: true}
	};
	
	// don't allow symbol if same as main chart, comparison already exists, 
	// or start with an '='
	if(context.stx.chart.symbol.toLowerCase() !== obj.symbol.toLowerCase() && !context.stx.chart.series[obj.symbol.toLowerCase()] && obj.symbol[0]!="="){
		stx.addSeries(obj.symbol, params, cb);
	}
};

STX.UI.Prototypes.Comparison.configureUI=function(){
	var node=this.node;
	var addNew=node.find("cq-accept-btn");
	this.template=node.find("*[cq-comparison-item]");
	var swatchColors=node.find("cq-swatch").attr("cq-colors");
	if(swatchColors) this.swatchColors=swatchColors.split(",");
	for(var i=0;i<this.swatchColors.length;i++){
		this.swatchColors[i]=STX.convertToNativeColor(this.swatchColors[i]);
	}
	var lookup=node.find("cq-lookup");
	lookup[0].setCallback(function(self){return function(){self.selectItem.apply(self, arguments);};}(this));
	addNew.on("stxtap", function(){
		lookup[0].forceInput();
	});
	node.find("input").on("stxtap", function(){
		this.focus();
	});
};

/**
 * UI helper for Lookup UI element. Note, a STX.UI.Lookup.Driver must be provided. If none is provided then the default will be used
 * which displays no results. To turn off the result window modify add css ".stxMenuActive cq-lookup cq-menu { opacity: 0 }"
 * @name STX.UI.Lookup
 * @constructor
 * @param {HTMLElement} node    The encapsulating node for the lookup.
 * @param {STX.UI.Context} context The context
 * @param {Object} [params] Optional parameters
 * @param {STX.UI.Lookup.Driver} params.driver A lookup driver, which fetches the results to be displayed in the UI.
 * @param {Function} params.cb A callback function to call when a new symbol is entered
 * 
 */
STX.UI.Prototypes.Lookup=Object.create(STX.UI.ModalTag);

STX.UI.Prototypes.Lookup.attachedCallback=function(){
	if(this.attached) return;
	this.usingEmptyDriver=false;
	STX.UI.ModalTag.attachedCallback.apply(this);
	var node=$(this);
	this.attached=true;
	this.currentFilter=null;
	this.params={};
};

STX.UI.Prototypes.Lookup.setContext=function(context){
	context.advertiseAs(this, "Lookup");
	this.initialize();
};

/**
 * Set a callback method for when the user selects a symbol
 * @param {Function} cb Callback method
 */
STX.UI.Prototypes.Lookup.setCallback=function(cb){
	this.params.cb=cb;
};

/**
 * Set a {@link STX.UI.Lookup.Driver}. If none is set then STX.UI.Context.lookupDriver will be used.
 * If none available then the input box will still be active but not present a drop down.
 * @param {STX.UI.Lookup.Driver} driver The driver
 */
STX.UI.Prototypes.Lookup.setDriver=function(driver){
	this.params.driver=driver;
};

STX.UI.Prototypes.Lookup.initialize=function(){
	var node=$(this);
	this.scrollable=node.find("cq-scroll")[0];
	if(this.scrollable)
		this.resultList=this.scrollable.innards;

	this.input=node.find("input");
	if(!this.input.length){
		this.input=node.append($("<input type='hidden'>"));
		this.input[0].value="";
	}
	var self=this;
	this.input.on("input", function(e){
		self.acceptText(self.input[0].value, self.currentFilter);
	});
	var filters=node.find("cq-lookup-filters");
	if(filters){
		filters.find("cq-filter").stxtap(function() {
	        filters.find("cq-filter").removeClass('true');
	        var t=$(this);
	        t.addClass('true');
	        var translate=t.find("translate");
	        if(translate.length){ // if the filter text has been translated then it will be in a <translate> tag
	        	self.currentFilter=translate.attr("original");
	        }else{
		        self.currentFilter=this.innerHTML;
		    }
			self.acceptText(self.input[0].value, self.currentFilter);
		});
	}

	// default key handler
	new STX.UI.Keystroke(this.input, function(obj){
		self.keyStroke(null, obj.key, obj.e, obj.keystroke);
	});

	if(typeof(node.attr("cq-keystroke-claim"))!="undefined"){
		// add keyboard claim for entire body
		this.context.addClaim(this, STX.UI.KEYSTROKE);
	}
};

/**
 * Accepts a new symbol or symbolObject
 * @param  {Object} data The symbol object (in a form accepted by {@link STXChart#newChart})
 * @param  {Object} params Settings to control callback action
 */
STX.UI.Prototypes.Lookup.selectItem=function(data, params){
	if(this.params.cb){
		this.params.cb(this.context, data, params);
	}
};

STX.UI.Prototypes.Lookup.isActive=function(){
	// case 1, the lookup results are displaying
//	var activeSelector="." + this.context.menuParams.activeClassName;
//	var actives=$(this).parents(activeSelector);
//	if (actives.length || $(this).is(activeSelector))
//		return true;

	return this.input[0].value!=="";
};

STX.UI.Prototypes.Lookup.acceptText=function(value, filter){
	if(!this.params.driver){
		if(this.context.lookupDriver){
			this.setDriver(this.context.lookupDriver);
		}else{
			this.setDriver(new STX.UI.Lookup.Driver());
			this.usingEmptyDriver=true;
		}
	}
	this.params.driver.setHelper(this);
	this.params.driver.acceptText(value, filter);
};

STX.UI.Prototypes.Lookup.forceInput=function(){
	var input=this.input[0];
	this.selectItem({symbol:input.value});
	STX.blur(this.input);
	this.context.closeMenu(this);
	input.value="";
};

// todo, take regular expression to determine whether a keystroke is valid
STX.UI.Prototypes.Lookup.keyStroke=function(hub, key, e, keystroke){
	if(keystroke.ctrl) return false;
	var menu=$(this).parents().addBack();
	if(this.context.isModal() && !menu.hasClass(this.context.menuParams.activeClassName)) return;
	var input=this.input[0];
	var result=false;
	if(key===32 && input.value===""){
		return false;
	}
	if(key>=32 && key<=222){
		input.value+=String.fromCharCode(key);
		this.acceptText(input.value, this.currentFilter);
		result=true;
	}
	if(key=="delete" || key=="backspace"){
		if(this.context.stx.anyHighlighted) return false;
		if(input.value.length){
			input.value=input.value.substring(0,input.value.length-1);
			this.acceptText(this.input[0].value, this.currentFilter);
			result=true; // only capture delete key if there was something to delete
		}
		if(key=="backspace") result=true; // always capture backspace because otherwise chrome will navigate back
	}
	if(key==="escape"){
		input.value="";
		this.context.closeMenu(this);
		result=true;
	}
	if(key==="enter" && input.value!==""){
		if(this.isActive()){
			var focused=this.scrollable && this.scrollable.focused(); // Using cursor keys to maneuver down lookup results
			if(focused && focused.selectFC){
				focused.selectFC.apply(focused, {});
			}else{
				this.selectItem({symbol:input.value});
			}
			STX.blur(this.input);
			this.context.closeMenu(this);
			input.value="";
			result=true;
		}
	}
	if(result){
		e.preventDefault();
		e.stopPropagation();
		if(input.value.length/* && !this.usingEmptyDriver*/){
			this.context.activateMenu($(this), true);
		}else{
			this.context.closeMenu(this);
		}
		return true;
	}
};

/**
 * Processes an array of results and displays them.
 * The array should be of format:
 * [
 * {display:["A","Agilent Technologies Inc","NYSE"], data:{symbol:"A"}},
 * {display:["AA","Alcoa Inc","NYSE"], data:{symbol:"AA"}},
 * ]
 *
 * The lookup widget by default displays three columns as represented by the array. The data object
 * can be an format required by your QuoteFeed or it can be a simple string if you just need to support
 * a stock symbol.
 * @param  {Array} arr The array of results.
 */
STX.UI.Prototypes.Lookup.results=function(arr){
	function closure(self, data){
		return function(e){
			STX.blur(self.input);
			self.context.closeMenu();
			self.params.driver.selectItem(data);
			self.input[0].value="";
		};
	}

	this.resultList.empty();
	for(var i=0;i<arr.length;i++){
		var item=arr[i];
		var nodeText="<cq-item>";
		for(var j=0;j<item.display.length;j++){
			nodeText+="<SPAN>" + item.display[j] + "</SPAN>";
		}
		nodeText+="</cq-item>";
		var node=$(nodeText);
		this.resultList.append(node);
		node[0].selectFC=closure(this, item.data);
		node.on("tap", node[0].selectFC);
	}
	this.scrollable.iscroll.scrollTo(0,0);
	this.refresh();
};

STX.UI.Prototypes.Lookup.refresh=function(){
	this.scrollable.iscroll.refresh();
};


STX.UI.Prototypes.TFC=Object.create(STX.UI.ContextTag);

STX.UI.Prototypes.TFC.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ContextTag.attachedCallback.apply(this);
	this.attached=true;
};

STX.UI.Prototypes.TFC.setContext=function(context){	
	context.advertiseAs(this, "TFC");
	this.initialize();
};

STX.UI.Prototypes.TFC.start=function(){
	$(".stx-trade-panel").appendTo($("cq-side-panel"));
	var stx=this.context.stx;

	stx.account=new STX.Account.Demo();
	var tfcConfig={
		stx: stx,
 		account: stx.account
	};
	stx.tfc=new STX.TFC(tfcConfig);
	//stx.tfc.setResizeCallback(resizeScreen);

	var self=this;
	$(".stx-trade-nav .stx-trade-ticket-toggle").stxtap(function(){
		$(".stx-trade-nav").removeClass("active");
		$(".stx-trade-info").addClass("active");
		$("cq-side-panel")[0].resizeMyself();
	});
	$(".stx-trade-info .stx-trade-ticket-toggle").stxtap(function(){
		$(".stx-trade-nav").addClass("active");
		$(".stx-trade-info").removeClass("active");
		$("cq-side-panel")[0].resizeMyself();
	});

	stx.tfc.selectSymbol=function(symbol){
		symbol=symbol.toUpperCase();
		self.context.changeSymbol({symbol:symbol});
	};
};

STX.UI.Prototypes.TFC.initialize=function(){
	var count=3;
	var hasError=false;

	var self=this;
	function acc(err){
		if(err){
			console.log(err);
			hasError=true;
		}
		count--;
		if(!count){
			if(!hasError){
				self.start();
			}
		}
	}
	STX.loadStylesheet("plugins/tfc/stx-tfc.css", acc);
	STX.loadScript("plugins/tfc/stx-tfc.js", acc);
	STX.loadUI("plugins/tfc/stx-tfc.html", acc);
};

/**
 * UI helper for Chart Title UI element. Note, if the cq-marker is added to the element, and it is placed within the
 * chartArea, the element will sit above the chart bars.
 * @name STX.UI.ChartTitle
 * @since 06-15-16
 <cq-chart-title>
     <cq-symbol></cq-symbol>
     <cq-chart-price>
         <cq-current-price></cq-current-price>
         <cq-change>
          <div class="ico"></div> <cq-todays-change></cq-todays-change> (<cq-todays-change-pct></cq-todays-change-pct>)
         </cq-change>
     </cq-chart-price>
 </cq-chart-title>
 *
 */

STX.UI.Prototypes.ChartTitle=Object.create(STX.UI.ModalTag);


STX.UI.Prototypes.ChartTitle.attachedCallback=function(){
    if(this.attached) return;
    STX.UI.ModalTag.attachedCallback.apply(this);
    this.attached=true;
};

STX.UI.Prototypes.ChartTitle.setContext=function(context){
    context.advertiseAs(this, "Title");
    var self = this;
    this.context.observe({
        obj:this.context.stx.chart.symbolObject,
        action:"callback",
        value:function(){if(self.context.stx.currentQuote()) self.previousClose = self.context.stx.currentQuote().iqPrevClose}
    })
    this.initialize();
};


/**
 * Begins the Title helper. This observes the chart and updates the title elements as necessary.
 * @memberOf  STX.UI.Prototypes.ChartTitle
 */
STX.UI.Prototypes.ChartTitle.begin=function(){
    var self=this;
    this.addInjection("append", "createDataSet", function(){
        self.update();
    });
    this.update();
};

STX.UI.Prototypes.ChartTitle.initialize=function(params){
    this.params=params?params:{};
    if(typeof this.params.autoStart=="undefined") this.params.autoStart=true;
    this.marker=null;
    this.title=null; // Use this for document.title

    if(this.params.autoStart) this.begin();
};

/**
 * Keep this value up to date in order to calculate change from yesterday's close
 * @type {Float}
 * @memberOf  STX.UI.Prototypes.ChartTitle
 */
STX.UI.Prototypes.ChartTitle.previousClose=null;

/**
 * Updates the values in the node
 * @memberOf  STX.UI.Prototypes.ChartTitle
 */
STX.UI.Prototypes.ChartTitle.update=function(){
    var stx=this.context.stx;

    var node=$(this);
    node.addClass("stx-show");
    var symbolDiv=node.find("cq-symbol");
    var symbolDescriptionDiv=node.find("cq-symbol-description");
    var currentPriceDiv=node.find("cq-current-price");
    var todaysChangeDiv=node.find("cq-todays-change");
    var todaysChangePctDiv=node.find("cq-todays-change-pct");
    var chartPriceDiv=node.find("cq-chart-price");
    var changeDiv=node.find("cq-change");
    if(symbolDiv.length){
        symbolDiv.text(stx.chart.symbol);
    }
    var todaysChange="", todaysChangePct=0, todaysChangeDisplay="", currentPrice="";
    var currentQuote=stx.currentQuote();
    currentPrice=currentQuote?currentQuote.Close:"";
    if(currentPriceDiv.length){
		var oldPrice=parseFloat(currentPriceDiv.text());
        currentPriceDiv.text(stx.padOutPrice(currentPrice));
		if(typeof(currentPriceDiv.attr("cq-animate"))!="undefined"){
			STX.UI.animatePrice(currentPriceDiv, currentPrice, oldPrice);
		}
    }

    if(symbolDescriptionDiv.length){
        symbolDescriptionDiv.text(stx.chart.symbolDescription);
    }

    //var previousCloseField=this.params.previousCloseField?this.params.previousCloseField:"PrevClose";
    var previousCloseField="PrevClose";
    this.previousClose = currentQuote ? currentQuote.iqPrevClose : null;
    if(currentQuote && this.previousClose){
        todaysChange=STX.fixPrice(currentQuote.Close-this.previousClose);
        todaysChangePct=todaysChange/this.previousClose*100;
        if(stx.internationalizer){
            todaysChangeDisplay=stx.internationalizer.percent2.format(todaysChangePct/100);
        }else{
            todaysChangeDisplay=todaysChangePct.toFixed(2) + "%";
        }
        changeDiv.css({"display":"block"});
    }else{
        changeDiv.css({"display":"none"});
    }
    var todaysChangeAbs=Math.abs(todaysChange);
    if(todaysChangeDiv.length){
        todaysChangeDiv.text(todaysChangeAbs);
    }
    if(todaysChangePctDiv.length){
        todaysChangePctDiv.text(todaysChangeDisplay);
    }
    if(chartPriceDiv.length){
        chartPriceDiv.removeClass("stx-up");
        chartPriceDiv.removeClass("stx-down");
        if(todaysChangeDisplay!=="" && todaysChangePct>0){
            chartPriceDiv.addClass("stx-up");
        }else if(todaysChangeDisplay!=="" && todaysChangePct<0){
            chartPriceDiv.addClass("stx-down");
        }
    }

    // These strange characters create some spacing so that the title appears
    // correctly in a browser tab
    if(stx.chart.symbol){
        this.title=stx.chart.symbol + " \u200b \u200b " +
            currentPrice + " \u200b \u200b \u200b ";
        if(todaysChangePct>0){
            this.title+="\u25b2 " + todaysChangeAbs;
        }else if(todaysChangePct<0){
            this.title+="\u25bc " + todaysChangeAbs;
        }
    }
};


/**
 * Attribution UI element.  This will put a node inside a panel to attribute the data.
 * Both the main chart panel (for quotes) and a study panel can use an attribution.
 * @name STX.UI.Attribution
 * @since TBD
  <cq-attribution>
	<template>
		<cq-attrib-container>
			<cq-attrib-source></cq-attrib-source>
			<cq-attrib-quote-type></cq-attrib-quote-type>
		</cq-attrib-container>
	</template>
  </cq-attribution>
 *
 */
STX.UI.Prototypes.Attribution=Object.create(STX.UI.ModalTag);

STX.UI.Prototypes.Attribution.insert=function(stx,panel){
	var attrib=STX.UI.makeFromTemplate(this.template);
	new STX.Marker({
		stx: stx,
	    node: attrib[0],
	    xPositioner: "none",
	    yPositioner: "none",
	    label: "attribution",
	    panelName: panel
	});
	return attrib;
};

STX.UI.Prototypes.Attribution.attachedCallback=function(){
	if(this.attached) return;
	STX.UI.ModalTag.attachedCallback.apply(this);
	this.attached=true;
};

STX.UI.Prototypes.Attribution.setContext=function(context){
	context.advertiseAs(this, "Attribution");
	this.template=this.node.find("template");
	var chartAttrib=this.insert(context.stx,"chart");
	var self=this;
	this.addInjection("append", "createDataSet", function(){
		if(this.chart.attribution){
			var source=self.messages.sources[this.chart.attribution.source];
			var exchange=self.messages.exchanges[this.chart.attribution.exchange];
			if(!source) source="";
			if(!exchange) exchange="";
			if(source+exchange!=chartAttrib.attr("lastAttrib")){
				chartAttrib.find("cq-attrib-source").html(source);
				chartAttrib.find("cq-attrib-quote-type").html(exchange);
				STX.I18N.translateUI(chartAttrib[0]);
				chartAttrib.attr("lastAttrib",source+exchange);
			}
		}
		outer:
		for(var study in this.layout.studies){
			var type=this.layout.studies[study].type;
			if(self.messages.sources[type]){
				for(var i=0;i<this.markers.attribution.length;i++){
					if(this.markers.attribution[i].params.panelName==this.layout.studies[study].panel) continue outer;
				}
				if(!this.panels[study]) continue;
				var source=self.messages.sources[type];
				var exchange=self.messages.exchanges[type];
				if(!source) source="";
				if(!exchange) exchange="";
				var attrib=self.insert(this,study);
				attrib.find("cq-attrib-source").html(source);
				attrib.find("cq-attrib-quote-type").html(exchange);
				STX.I18N.translateUI(attrib[0]);
			}
		}
	});
};

/**
 * Here is where the messages go.  This could be supplemented, overridden, etc. by the developer.
 * The sources contain properties whose values which go into <cq-attrib-source>.
 * The exchanges contain properties whose values which go into <cq-attrib-quote-type>.
 * 
 * For quotes, the sources would match the quote source.  For a study, it would match the study type.
 * If there is no matching property, the appropriate component will have no text.
 */
STX.UI.Prototypes.Attribution.messages={
	"sources":{
		"demo": "Demo data.",
		"xignite": "<a target=\"_blank\" href=\"https://www.xignite.com\">Market Data</a> by Xignite.",
		"Twiggs": "Formula courtesy <a target=\"_blank\" href=\"https://www.incrediblecharts.com/indicators/twiggs_money_flow.php\">IncredibleCharts</a>."
	},
	"exchanges":{
		"RANDOM": "Data is randomized.",
		"REAL-TIME": "Data is real-time.",
		"DELAYED": "Data delayed 15 min.",
		"BATS": "BATS BZX real-time.",
		"EOD": "End of day data."
	}
};

/**
 * Displays an advertisement banner as a "marker" (inside the chart, use CSS to position absolutely against the chart panel).
 * The advertisement should contain content that can be enabled by calling {@link STX.UI.Advertisement#show} based on your
 * business logic.
 *
 * The advertisement will automatically adjust the height to accomodate the content (assuming overflow-y: auto)
 */
STX.UI.Advertisement=document.registerElement("cq-advertisement", {prototype: STX.UI.Prototypes.Advertisement});


/**
 * cq-scroll web component creates an iscrollable container. This will resize
 * itself when the associated STX.UI.Context is resized() (screen resize). The iscroll will
 * automatically refresh if the size changes.
 *
 * Attributes:
 * cq-no-maximize - Do not automatically maximize the height (but keep it showing on screen)
 * cq-no-resize - Do not apply any sizing logic.
 * 
 * Use this.dataPortion to dynamically inject items into the list
 * Use this.iscroll to obtain the iscroll reference and operate on the component
 */
STX.UI.Scroll=document.registerElement("cq-scroll", {prototype: STX.UI.Prototypes.Scroll});

/**
 * UI Helper that binds a toggle to an object member, or callbacks when toggled
 * cq-member Object member to observe. If not provided then callbacks will be used exclusively.
 * cq-action default="class" Action to take
 * cq-value default="active" Value for action (i.e. class name)
 * cq-toggles A comma separated list of valid values which will be toggled through with each click. List may include "null".
 *
 * use registerCallback to receive a callback every time the toggle changes. When a callback is registered, any automatic
 * class changes are bypassed
 *
 * @example
 * $("cq-toggle").registerCallback(function(value){
 *    console.log("current value is " + value);
 *    if(value!=false) this.node.addClass("active");
 * })
 */

STX.UI.Toggle=document.registerElement("cq-toggle", {prototype: STX.UI.Prototypes.Toggle});

STX.UI.Menu=document.registerElement("cq-menu", {prototype: STX.UI.Prototypes.Menu});


/**
 * Drawing toolbar web component
 * @param {Object} [params] Parameters to drive the helper
 * @param {string} [params.toolSelection=node.find(".CIQCurrentDrawingTool")] Selector (or element) for displaying the selected tool
 * @param {string} [params.lineSelection=node.find(".CIQCurrentLineStyle")] Selector (or element) for displaying the selected line width and pattern
 * @param {string} [params.fontSizeSelection=node.find(".CIQCurrentFontSize")] Selector (or element) for displaying the selected font size
 * @param {string} [params.fontFamilySelection=node.find(".CIQCurrentFontFamily")] Selector (or element) for displaying the selected font family
 * @param {Map} [params.elementsMap=STX.UI.DrawingToolbar.defaultSettings] A map of which drawing toolbar elements should be displayed for each tool
 * @name STX.UI.DrawingToolbar
 * @constructor
 */
STX.UI.DrawingToolbar=document.registerElement("cq-toolbar", {prototype: STX.UI.Prototypes.DrawingToolbar});

STX.UI.ShowRange=document.registerElement("cq-show-range", {prototype: STX.UI.Prototypes.ShowRange});

STX.UI.Loader=document.registerElement("cq-loader", {prototype: STX.UI.Prototypes.Loader});

STX.UI.ColorPicker=document.registerElement("cq-color-picker", {prototype: STX.UI.Prototypes.ColorPicker});
STX.UI.Swatch=document.registerElement("cq-swatch", {prototype: STX.UI.Prototypes.Swatch});

STX.UI.Dialog=document.registerElement("cq-dialog", {prototype: STX.UI.Prototypes.Dialog});

/**
 * A side panel contains children that should be enabled by calling open({selector:selector}).
 */
STX.UI.SidePanel=document.registerElement("cq-side-panel", {prototype: STX.UI.Prototypes.SidePanel});
STX.UI.ChartTitle=document.registerElement("cq-chart-title", {prototype: STX.UI.Prototypes.ChartTitle});

STX.UI.Attribution=document.registerElement("cq-attribution", {prototype: STX.UI.Prototypes.Attribution});

STX.UI.StudyDialog=document.registerElement("cq-study-dialog", {prototype: STX.UI.Prototypes.StudyDialog});
STX.UI.StudyOutput=document.registerElement("cq-study-output", {prototype: STX.UI.Prototypes.StudyOutput});
STX.UI.StudyInput=document.registerElement("cq-study-input", {prototype: STX.UI.Prototypes.StudyInput});
STX.UI.StudyParameter=document.registerElement("cq-study-parameter", {prototype: STX.UI.Prototypes.StudyParameter});
STX.UI.StudyLegend=document.registerElement("cq-study-legend", {prototype: STX.UI.Prototypes.StudyLegend});

STX.UI.Undo=document.registerElement("cq-undo", {prototype: STX.UI.Prototypes.Undo});
STX.UI.Redo=document.registerElement("cq-redo", {prototype: STX.UI.Prototypes.Redo});

STX.UI.Comparison=document.registerElement("cq-comparison", {prototype: STX.UI.Prototypes.Comparison});
STX.UI.SymbolLookup=document.registerElement("cq-lookup", {prototype: STX.UI.Prototypes.Lookup});

STX.UI.Themes=document.registerElement("cq-themes", {prototype: STX.UI.Prototypes.Themes});
STX.UI.ThemeDialog=document.registerElement("cq-theme-dialog", {prototype: STX.UI.Prototypes.ThemeDialog});
STX.UI.ThemePiece=document.registerElement("cq-theme-piece", {prototype: STX.UI.Prototypes.ThemePiece});


STX.UI.TFC=document.registerElement("cq-tfc", {prototype: STX.UI.Prototypes.TFC});
