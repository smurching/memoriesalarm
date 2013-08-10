/*	
	Watermark plugin for jQuery
	Version: 3.1.4
	http://jquery-watermark.googlecode.com/

	Copyright (c) 2009-2012 Todd Northrop
	http://www.speednet.biz/
	
	August 13, 2012

	Requires:  jQuery 1.2.3+
	
	Dual licensed under the MIT or GPL Version 2 licenses.
	See mit-license.txt and gpl2-license.txt in the project root for details.
------------------------------------------------------*/

( function ( $, window, undefined ) {

var
	// String constants for data names
	dataFlag = "watermark",
	dataClass = "watermarkClass",
	dataFocus = "watermarkFocus",
	dataFormSubmit = "watermarkSubmit",
	dataMaxLen = "watermarkMaxLength",
	dataPassword = "watermarkPassword",
	dataText = "watermarkText",
	
	// Copy of native jQuery regex use to strip return characters from element value
	rreturn = /\r/g,
	
	// Used to determine if type attribute of input element is a non-text type (invalid)
	rInvalidType = /^(button|checkbox|hidden|image|radio|range|reset|submit)$/i,

	// Includes only elements with watermark defined
	selWatermarkDefined = "input:data(" + dataFlag + "),textarea:data(" + dataFlag + ")",

	// Includes only elements capable of having watermark
	selWatermarkAble = ":watermarkable",
	
	// triggerFns:
	// Array of function names to look for in the global namespace.
	// Any such functions found will be hijacked to trigger a call to
	// hideAll() any time they are called.  The default value is the
	// ASP.NET function that validates the controls on the page
	// prior to a postback.
	// 
	// Am I missing other important trigger function(s) to look for?
	// Please leave me feedback:
	// http://code.google.com/p/jquery-watermark/issues/list
	triggerFns = [
		"Page_ClientValidate"
	],
	
	// Holds a value of true if a watermark was displayed since the last
	// hideAll() was executed. Avoids repeatedly calling hideAll().
	pageDirty = false,
	
	// Detects if the browser can handle native placeholders
	hasNativePlaceholder = ( "placeholder" in document.createElement( "input" ) );

// Best practice: this plugin adds only one method to the jQuery object.
// Also ensures that the watermark code is only added once.
$.watermark = $.watermark || {

	// Current version number of the plugin
	version: "3.1.4",
		
	runOnce: true,
	
	// Default options used when watermarks are instantiated.
	// Can be changed to affect the default behavior for all
	// new or updated watermarks.
	options: {
		
		// Default class name for all watermarks
		className: "watermark",
		
		// If true, plugin will detect and use native browser support for
		// watermarks, if available. (e.g., WebKit's placeholder attribute.)
		useNative: true,
		
		// If true, all watermarks will be hidden during the window's
		// beforeunload event. This is done mainly because WebKit
		// browsers remember the watermark text during navigation
		// and try to restore the watermark text after the user clicks
		// the Back button. We can avoid this by hiding the text before
		// the browser has a chance to save it. The regular unload event
		// was tried, but it seems the browser saves the text before
		// that event kicks off, because it didn't work.
		hideBeforeUnload: true
	},
	
	// Hide one or more watermarks by specifying any selector type
	// i.e., DOM element, string selector, jQuery matched set, etc.
	hide: function ( selector ) {
		$( selector ).filter( selWatermarkDefined ).each(
			function () {
				$.watermark._hide( $( this ) );
			}
		);
	},
	
	// Internal use only.
	_hide: function ( $input, focus ) {
		var elem = $input[ 0 ],
			inputVal = ( elem.value || "" ).replace( rreturn, "" ),
			inputWm = $input.data( dataText ) || "",
			maxLen = $input.data( dataMaxLen ) || 0,
			className = $input.data( dataClass );
	
		if ( ( inputWm.length ) && ( inputVal == inputWm ) ) {
			elem.value = "";
			
			// Password type?
			if ( $input.data( dataPassword ) ) {
				
				if ( ( $input.attr( "type" ) || "" ) === "text" ) {
					var $pwd = $input.data( dataPassword ) || [], 
						$wrap = $input.parent() || [];
						
					if ( ( $pwd.length ) && ( $wrap.length ) ) {
						$wrap[ 0 ].removeChild( $input[ 0 ] ); // Can't use jQuery methods, because they destroy data
						$wrap[ 0 ].appendChild( $pwd[ 0 ] );
						$input = $pwd;
					}
				}
			}
			
			if ( maxLen ) {
				$input.attr( "maxLength", maxLen );
				$input.removeData( dataMaxLen );
			}
		
			if ( focus ) {
				$input.attr( "autocomplete", "off" );  // Avoid NS_ERROR_XPC_JS_THREW_STRING error in Firefox
				
				window.setTimeout(
					function () {
						$input.select();  // Fix missing cursor in IE
					}
				, 1 );
			}
		}
		
		className && $input.removeClass( className );
	},
	
	// Display one or more watermarks by specifying any selector type
	// i.e., DOM element, string selector, jQuery matched set, etc.
	// If conditions are not right for displaying a watermark, ensures that watermark is not shown.
	show: function ( selector ) {
		$( selector ).filter( selWatermarkDefined ).each(
			function () {
				$.watermark._show( $( this ) );
			}
		);
	},
	
	// Internal use only.
	_show: function ( $input ) {
		var elem = $input[ 0 ],
			val = ( elem.value || "" ).replace( rreturn, "" ),
			text = $input.data( dataText ) || "",
			type = $input.attr( "type" ) || "",
			className = $input.data( dataClass );

		if ( ( ( val.length == 0 ) || ( val == text ) ) && ( !$input.data( dataFocus ) ) ) {
			pageDirty = true;
		
			// Password type?
			if ( $input.data( dataPassword ) ) {
				
				if ( type === "password" ) {
					var $pwd = $input.data( dataPassword ) || [],
						$wrap = $input.parent() || [];
						
					if ( ( $pwd.length ) && ( $wrap.length ) ) {
						$wrap[ 0 ].removeChild( $input[ 0 ] ); // Can't use jQuery methods, because they destroy data
						$wrap[ 0 ].appendChild( $pwd[ 0 ] );
						$input = $pwd;
						$input.attr( "maxLength", text.length );
						elem = $input[ 0 ];
					}
				}
			}
		
			// Ensure maxLength big enough to hold watermark (input of type="text" or type="search" only)
			if ( ( type === "text" ) || ( type === "search" ) ) {
				var maxLen = $input.attr( "maxLength" ) || 0;
				
				if ( ( maxLen > 0 ) && ( text.length > maxLen ) ) {
					$input.data( dataMaxLen, maxLen );
					$input.attr( "maxLength", text.length );
				}
			}
            
			className && $input.addClass( className );
			elem.value = text;
		}
		else {
			$.watermark._hide( $input );
		}
	},
	
	// Hides all watermarks on the current page.
	hideAll: function () {
		if ( pageDirty ) {
			$.watermark.hide( selWatermarkAble );
			pageDirty = false;
		}
	},
	
	// Displays all watermarks on the current page.
	showAll: function () {
		$.watermark.show( selWatermarkAble );
	}
};

$.fn.watermark = $.fn.watermark || function ( text, options ) {
	///	<summary>
	///		Set watermark text and class name on all input elements of type="text/password/search" and
	/// 	textareas within the matched set. If className is not specified in options, the default is
	/// 	"watermark". Within the matched set, only input elements with type="text/password/search"
	/// 	and textareas are affected; all other elements are ignored.
	///	</summary>
	///	<returns type="jQuery">
	///		Returns the original jQuery matched set (not just the input and texarea elements).
	/// </returns>
	///	<param name="text" type="String">
	///		Text to display as a watermark when the input or textarea element has an empty value and does not
	/// 	have focus. The first time watermark() is called on an element, if this argument is empty (or not
	/// 	a String type), then the watermark will have the net effect of only changing the class name when
	/// 	the input or textarea element's value is empty and it does not have focus.
	///	</param>
	///	<param name="options" type="Object" optional="true">
	///		Provides the ability to override the default watermark options ($.watermark.options). For backward
	/// 	compatibility, if a string value is supplied, it is used as the class name that overrides the class
	/// 	name in $.watermark.options.className. Properties include:
	/// 		className: When the watermark is visible, the element will be styled using this class name.
	/// 		useNative (Boolean or Function): Specifies if native browser support for watermarks will supersede
	/// 			plugin functionality. If useNative is a function, the return value from the function will
	/// 			determine if native support is used. The function is passed one argument -- a jQuery object
	/// 			containing the element being tested as the only element in its matched set -- and the DOM
	/// 			element being tested is the object on which the function is invoked (the value of "this").
	///	</param>
	/// <remarks>
	///		The effect of changing the text and class name on an input element is called a watermark because
	///		typically light gray text is used to provide a hint as to what type of input is required. However,
	///		the appearance of the watermark can be something completely different: simply change the CSS style
	///		pertaining to the supplied class name.
	///		
	///		The first time watermark() is called on an element, the watermark text and class name are initialized,
	///		and the focus and blur events are hooked in order to control the display of the watermark.  Also, as
	/// 	of version 3.0, drag and drop events are hooked to guard against dropped text being appended to the
	/// 	watermark.  If native watermark support is provided by the browser, it is detected and used, unless
	/// 	the useNative option is set to false.
	///		
	///		Subsequently, watermark() can be called again on an element in order to change the watermark text
	///		and/or class name, and it can also be called without any arguments in order to refresh the display.
	///		
	///		For example, after changing the value of the input or textarea element programmatically, watermark()
	/// 	should be called without any arguments to refresh the display, because the change event is only
	/// 	triggered by user actions, not by programmatic changes to an input or textarea element's value.
	/// 	
	/// 	The one exception to programmatic updates is for password input elements:  you are strongly cautioned
	/// 	against changing the value of a password input element programmatically (after the page loads).
	/// 	The reason is that some fairly hairy code is required behind the scenes to make the watermarks bypass
	/// 	IE security and switch back and forth between clear text (for watermarks) and obscured text (for
	/// 	passwords).  It is *possible* to make programmatic changes, but it must be done in a certain way, and
	/// 	overall it is not recommended.
	/// </remarks>
	
	if ( !this.length ) {
		return this;
	}
	
	var hasClass = false,
		hasText = ( typeof( text ) === "string" );
	
	if ( hasText ) {
		text = text.replace( rreturn, "" );
	}
	
	if ( typeof( options ) === "object" ) {
		hasClass = ( typeof( options.className ) === "string" );
		options = $.extend( {}, $.watermark.options, options );
	}
	else if ( typeof( options ) === "string" ) {
		hasClass = true;
		options = $.extend( {}, $.watermark.options, { className: options } );
	}
	else {
		options = $.watermark.options;
	}
	
	if ( typeof( options.useNative ) !== "function" ) {
		options.useNative = options.useNative? function () { return true; } : function () { return false; };
	}
	
	return this.each(
		function () {
			var $input = $( this );
			
			if ( !$input.is( selWatermarkAble ) ) {
				return;
			}
			
			// Watermark already initialized?
			if ( $input.data( dataFlag ) ) {
			
				// If re-defining text or class, first remove existing watermark, then make changes
				if ( hasText || hasClass ) {
					$.watermark._hide( $input );
			
					if ( hasText ) {
						$input.data( dataText, text );
					}
					
					if ( hasClass ) {
						$input.data( dataClass, options.className );
					}
				}
			}
			else {
			
				// Detect and use native browser support, if enabled in options
				if (
					( hasNativePlaceholder )
					&& ( options.useNative.call( this, $input ) )
					&& ( ( $input.attr( "tagName" ) || "" ) !== "TEXTAREA" )
				) {
					// className is not set because current placeholder standard doesn't
					// have a separate class name property for placeholders (watermarks).
					if ( hasText ) {
						$input.attr( "placeholder", text );
					}
					
					// Only set data flag for non-native watermarks
					// [purposely commented-out] -> $input.data(dataFlag, 1);
					return;
				}
				
				$input.data( dataText, hasText? text : "" );
				$input.data( dataClass, options.className );
				$input.data( dataFlag, 1 ); // Flag indicates watermark was initialized
				
				// Special processing for password type
				if ( ( $input.attr( "type" ) || "" ) === "password" ) {
					var $wrap = $input.wrap( "<span>" ).parent(),
						$wm = $( $wrap.html().replace( /type=["']?password["']?/i, 'type="text"' ) );
					
					$wm.data( dataText, $input.data( dataText ) );
					$wm.data( dataClass, $input.data( dataClass ) );
					$wm.data( dataFlag, 1 );
					$wm.attr( "maxLength", text.length );
					
					$wm.focus(
						function () {
							$.watermark._hide( $wm, true );
						}
					).bind( "dragenter",
						function () {
							$.watermark._hide( $wm );
						}
					).bind( "dragend",
						function () {
							window.setTimeout( function () { $wm.blur(); }, 1 );
						}
					);
					
					$input.blur(
						function () {
							$.watermark._show( $input );
						}
					).bind( "dragleave",
						function () {
							$.watermark._show( $input );
						}
					);
					
					$wm.data( dataPassword, $input );
					$input.data( dataPassword, $wm );
				}
				else {
					
					$input.focus(
						function () {
							$input.data( dataFocus, 1 );
							$.watermark._hide( $input, true );
						}
					).blur(
						function () {
							$input.data( dataFocus, 0 );
							$.watermark._show( $input );
						}
					).bind( "dragenter",
						function () {
							$.watermark._hide( $input );
						}
					).bind( "dragleave",
						function () {
							$.watermark._show( $input );
						}
					).bind( "dragend",
						function () {
							window.setTimeout( function () { $.watermark._show($input); }, 1 );
						}
					).bind( "drop",
						// Firefox makes this lovely function necessary because the dropped text
						// is merged with the watermark before the drop event is called.
						function ( evt ) {
							var elem = $input[ 0 ],
								dropText = evt.originalEvent.dataTransfer.getData( "Text" );
							
							if ( ( elem.value || "" ).replace( rreturn, "" ).replace( dropText, "" ) === $input.data( dataText ) ) {
								elem.value = dropText;
							}
							
							$input.focus();
						}
					);
				}
				
				// In order to reliably clear all watermarks before form submission,
				// we need to replace the form's submit function with our own
				// function.  Otherwise watermarks won't be cleared when the form
				// is submitted programmatically.
				if ( this.form ) {
					var form = this.form,
						$form = $( form );
					
					if ( !$form.data( dataFormSubmit ) ) {
						$form.submit( $.watermark.hideAll );
						
						// form.submit exists for all browsers except Google Chrome
						// (see "else" below for explanation)
						if ( form.submit ) {
							$form.data( dataFormSubmit, form.submit );
							
							form.submit = ( function ( f, $f ) {
								return function () {
									var nativeSubmit = $f.data( dataFormSubmit );
									
									$.watermark.hideAll();
									
									if ( nativeSubmit.apply ) {
										nativeSubmit.apply( f, Array.prototype.slice.call( arguments ) );
									}
									else {
										nativeSubmit();
									}
								};
							})( form, $form );
						}
						else {
							$form.data( dataFormSubmit, 1 );
							
							// This strangeness is due to the fact that Google Chrome's
							// form.submit function is not visible to JavaScript (identifies
							// as "undefined").  I had to invent a solution here because hours
							// of Googling (ironically) for an answer did not turn up anything
							// useful.  Within my own form.submit function I delete the form's
							// submit function, and then call the non-existent function --
							// which, in the world of Google Chrome, still exists.
							form.submit = ( function ( f ) {
								return function () {
									$.watermark.hideAll();
									delete f.submit;
									f.submit();
								};
							})( form );
						}
					}
				}
			}
			
			$.watermark._show( $input );
		}
	);
};

// The code included within the following if structure is guaranteed to only run once,
// even if the watermark script file is included multiple times in the page.
if ( $.watermark.runOnce ) {
	$.watermark.runOnce = false;

	$.extend( $.expr[ ":" ], {

		// Extends jQuery with a custom selector - ":data(...)"
		// :data(<name>)  Includes elements that have a specific name defined in the jQuery data
		// collection. (Only the existence of the name is checked; the value is ignored.)
		// A more sophisticated version of the :data() custom selector originally part of this plugin
		// was removed for compatibility with jQuery UI. The original code can be found in the SVN
		// source listing in the file, "jquery.data.js".
		data: $.expr.createPseudo ?
			$.expr.createPseudo( function( dataName ) {
				return function( elem ) {
					return !!$.data( elem, dataName );
				};
			}) :
			// support: jQuery <1.8
			function( elem, i, match ) {
				return !!$.data( elem, match[ 3 ] );
			},

		// Extends jQuery with a custom selector - ":watermarkable"
		// Includes elements that can be watermarked, including textareas and most input elements
		// that accept text input.  It uses a "negative" test (i.e., testing for input types that DON'T
		// work) because the HTML spec states that you can basically use any type, and if it doesn't
		// recognize the type it will default to type=text.  So if we only looked for certain type attributes
		// we would fail to recognize non-standard types, which are still valid and watermarkable.
		watermarkable: function ( elem ) {
			var type,
				name = elem.nodeName;
			
			if ( name === "TEXTAREA" ) {
				return true;
			}
			
			if ( name !== "INPUT" ) {
				return false;
			}
			
			type = elem.getAttribute( "type" );
			
			return ( ( !type ) || ( !rInvalidType.test( type ) ) );
		}
	});

	// Overloads the jQuery .val() function to return the underlying input value on
	// watermarked input elements.  When .val() is being used to set values, this
	// function ensures watermarks are properly set/removed after the values are set.
	// Uses self-executing function to override the default jQuery function.
	( function ( valOld ) {

		$.fn.val = function () {
			var args = Array.prototype.slice.call( arguments );
			
			// Best practice: return immediately if empty matched set
			if ( !this.length ) {
				return args.length? this : undefined;
			}

			// If no args, then we're getting the value of the first element;
			// else we're setting values for all elements in matched set
			if ( !args.length ) {

				// If element is watermarked, get the underlying value;
				// else use native jQuery .val()
				if ( this.data( dataFlag ) ) {
					var v = ( this[ 0 ].value || "" ).replace( rreturn, "" );
					return ( v === ( this.data( dataText ) || "" ) )? "" : v;
				}
				else {
					return valOld.apply( this );
				}
			}
			else {
				valOld.apply( this, args );
				$.watermark.show( this );
				return this;
			}
		};

	})( $.fn.val );
	
	// Hijack any functions found in the triggerFns list
	if ( triggerFns.length ) {

		// Wait until DOM is ready before searching
		$( function () {
			var i, name, fn;
		
			for ( i = triggerFns.length - 1; i >= 0; i-- ) {
				name = triggerFns[ i ];
				fn = window[ name ];
				
				if ( typeof( fn ) === "function" ) {
					window[ name ] = ( function ( origFn ) {
						return function () {
							$.watermark.hideAll();
							return origFn.apply( null, Array.prototype.slice.call( arguments ) );
						};
					})( fn );
				}
			}
		});
	}

	$( window ).bind( "beforeunload", function () {
		if ( $.watermark.options.hideBeforeUnload ) {
			$.watermark.hideAll();
		}
	});
}

})( jQuery, window );

/*
	Watermark v3.1.4 (August 13, 2012) plugin for jQuery
	http://jquery-watermark.googlecode.com/
	Copyright (c) 2009-2012 Todd Northrop
	http://www.speednet.biz/
	Dual licensed under the MIT or GPL Version 2 licenses.
*/
(function(n,t,i){var g="TEXTAREA",d="function",nt="password",c="maxLength",v="type",r="",u=!0,rt="placeholder",h=!1,tt="watermark",s=tt,o="watermarkClass",w="watermarkFocus",a="watermarkSubmit",b="watermarkMaxLength",e="watermarkPassword",f="watermarkText",l=/\r/g,ft=/^(button|checkbox|hidden|image|radio|range|reset|submit)$/i,it="input:data("+s+"),textarea:data("+s+")",p=":watermarkable",k=["Page_ClientValidate"],y=h,ut=rt in document.createElement("input");n.watermark=n.watermark||{version:"3.1.4",runOnce:u,options:{className:tt,useNative:u,hideBeforeUnload:u},hide:function(t){n(t).filter(it).each(function(){n.watermark._hide(n(this))})},_hide:function(n,i){var a=n[0],w=(a.value||r).replace(l,r),h=n.data(f)||r,p=n.data(b)||0,y=n.data(o),s,u;h.length&&w==h&&(a.value=r,n.data(e)&&(n.attr(v)||r)==="text"&&(s=n.data(e)||[],u=n.parent()||[],s.length&&u.length&&(u[0].removeChild(n[0]),u[0].appendChild(s[0]),n=s)),p&&(n.attr(c,p),n.removeData(b)),i&&(n.attr("autocomplete","off"),t.setTimeout(function(){n.select()},1))),y&&n.removeClass(y)},show:function(t){n(t).filter(it).each(function(){n.watermark._show(n(this))})},_show:function(t){var p=t[0],g=(p.value||r).replace(l,r),i=t.data(f)||r,k=t.attr(v)||r,d=t.data(o),h,s,a;g.length!=0&&g!=i||t.data(w)?n.watermark._hide(t):(y=u,t.data(e)&&k===nt&&(h=t.data(e)||[],s=t.parent()||[],h.length&&s.length&&(s[0].removeChild(t[0]),s[0].appendChild(h[0]),t=h,t.attr(c,i.length),p=t[0])),(k==="text"||k==="search")&&(a=t.attr(c)||0,a>0&&i.length>a&&(t.data(b,a),t.attr(c,i.length))),d&&t.addClass(d),p.value=i)},hideAll:function(){y&&(n.watermark.hide(p),y=h)},showAll:function(){n.watermark.show(p)}},n.fn.watermark=n.fn.watermark||function(i,y){var tt="string";if(!this.length)return this;var k=h,b=typeof i==tt;return b&&(i=i.replace(l,r)),typeof y=="object"?(k=typeof y.className==tt,y=n.extend({},n.watermark.options,y)):typeof y==tt?(k=u,y=n.extend({},n.watermark.options,{className:y})):y=n.watermark.options,typeof y.useNative!=d&&(y.useNative=y.useNative?function(){return u}:function(){return h}),this.each(function(){var et="dragleave",ot="dragenter",ft=this,h=n(ft),st,d,tt,it;if(h.is(p)){if(h.data(s))(b||k)&&(n.watermark._hide(h),b&&h.data(f,i),k&&h.data(o,y.className));else{if(ut&&y.useNative.call(ft,h)&&(h.attr("tagName")||r)!==g){b&&h.attr(rt,i);return}h.data(f,b?i:r),h.data(o,y.className),h.data(s,1),(h.attr(v)||r)===nt?(st=h.wrap("<span>").parent(),d=n(st.html().replace(/type=["']?password["']?/i,'type="text"')),d.data(f,h.data(f)),d.data(o,h.data(o)),d.data(s,1),d.attr(c,i.length),d.focus(function(){n.watermark._hide(d,u)}).bind(ot,function(){n.watermark._hide(d)}).bind("dragend",function(){t.setTimeout(function(){d.blur()},1)}),h.blur(function(){n.watermark._show(h)}).bind(et,function(){n.watermark._show(h)}),d.data(e,h),h.data(e,d)):h.focus(function(){h.data(w,1),n.watermark._hide(h,u)}).blur(function(){h.data(w,0),n.watermark._show(h)}).bind(ot,function(){n.watermark._hide(h)}).bind(et,function(){n.watermark._show(h)}).bind("dragend",function(){t.setTimeout(function(){n.watermark._show(h)},1)}).bind("drop",function(n){var i=h[0],t=n.originalEvent.dataTransfer.getData("Text");(i.value||r).replace(l,r).replace(t,r)===h.data(f)&&(i.value=t),h.focus()}),ft.form&&(tt=ft.form,it=n(tt),it.data(a)||(it.submit(n.watermark.hideAll),tt.submit?(it.data(a,tt.submit),tt.submit=function(t,i){return function(){var r=i.data(a);n.watermark.hideAll(),r.apply?r.apply(t,Array.prototype.slice.call(arguments)):r()}}(tt,it)):(it.data(a,1),tt.submit=function(t){return function(){n.watermark.hideAll(),delete t.submit,t.submit()}}(tt))))}n.watermark._show(h)}})},n.watermark.runOnce&&(n.watermark.runOnce=h,n.extend(n.expr[":"],{data:n.expr.createPseudo?n.expr.createPseudo(function(t){return function(i){return!!n.data(i,t)}}):function(t,i,r){return!!n.data(t,r[3])},watermarkable:function(n){var t,i=n.nodeName;return i===g?u:i!=="INPUT"?h:(t=n.getAttribute(v),!t||!ft.test(t))}}),function(t){n.fn.val=function(){var u=this,e=Array.prototype.slice.call(arguments),o;return u.length?e.length?(t.apply(u,e),n.watermark.show(u),u):u.data(s)?(o=(u[0].value||r).replace(l,r),o===(u.data(f)||r)?r:o):t.apply(u):e.length?u:i}}(n.fn.val),k.length&&n(function(){for(var u,r,i=k.length-1;i>=0;i--)u=k[i],r=t[u],typeof r==d&&(t[u]=function(t){return function(){return n.watermark.hideAll(),t.apply(null,Array.prototype.slice.call(arguments))}}(r))}),n(t).bind("beforeunload",function(){n.watermark.options.hideBeforeUnload&&n.watermark.hideAll()}))})(jQuery,window);







