/**
 * main.js
 *
 * responsible for adding menu to the page
 */

;(function ( window, document, Btn, FastClick, undefined) {
    'use strict';



    // Used for creating alert messages popups for button
    function alertEvent( title ) {
        return function() { window.alert( title ); };
    }



    // Used for creating links for button
    function linkEvent( link ) {
        return function() { window.location.href = link; };
    }



    // remove CSS that makes the menu invisible onload
    function removeIsMainInvisble() {
        document.documentElement.classList.remove('is-main-invisible');
    }


    // The functions that run after `DOMContetedLoaded`
    function onload() {
        // fast click for iOS / Android
        if ( document.documentElement.classList.contains('touch-fix') ) FastClick.attach(document.body);

        // creates the menu
        new Btn( 'Touch Me' ).addClass('skin-main_menu')
            .append( new Btn('Presenter').addClass('skin-presenter').on( 'click', linkEvent('/lib/audienceChannel/presenter.html') ) )

            .append( new Btn('Slides').addClass('skin-slides').on( 'click', linkEvent('/lib/audienceChannel/slides.html') ) )

            .append( new Btn('Agenda').addClass('skin-agenda').on( 'click', linkEvent('/lib/audienceChannel/agenda.html') ) )

            .append( new Btn('Codex').addClass('skin-codex').on( 'click', linkEvent('/lib/audienceChannel/codex.html') ) )

            .append( new Btn('Questions').addClass('skin-question').on( 'click', linkEvent('/lib/audienceChannel/questions.html') ) )

            // Appending the button menu to the DOM - `#main` element
            .appendTo( '#main' );

        // remove the class that makes the menu invisible
        if ('requestAnimationFrame' in window) {
            window.requestAnimationFrame( removeIsMainInvisble );
        } else if ('webkitRequestAnimationFrame' in window) {
            window.webkitRequestAnimationFrame( removeIsMainInvisble );
        } else {
            window.setTimeout( removeIsMainInvisble, 0 );
        }
    }



    // the init function - also call it self
    (function init() {
        // iOS / Android - touch hack fix by sniff user agent - maybe better to use modernizr touch event detect - but not sure it's a problem of all Webkit
        document.documentElement.className += ((/(like Mac OS X)|(Android)/i.test(window.navigator.userAgent)) ? ' touch-fix' : ' no-touch-fix');

        // Makes the menu invisible for fading in animation
        document.documentElement.className += ' is-main-invisible';

        // Makes sure everything is work when blocking render
        document.addEventListener( 'DOMContentLoaded', onload, false );
    } ());


} (window, document, Btn, FastClick) );
