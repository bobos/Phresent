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
        var width = $(window).width();
        var height = $(window).height();
        var btns = {
                     'Presenter':     ['skin-presenter', '/lib/audienceChannel/presenter.html'], 
                     'Slides':        ['skin-slides', '/lib/audienceChannel/slides.html'], 
                     'Agenda':        ['skin-agenda', '/lib/audienceChannel/agenda.html'], 
                     'Codex':         ['skin-codex', '/lib/audienceChannel/codex.html'], 
                     'Questions':     ['skin-question', '/lib/audienceChannel/questions.html'],
                     'Vote':          ['skin-vote', '/lib/audienceChannel/vote.html']
                   };
        var btnNum = Object.keys(btns).length;
        var btnHeight = height/(btnNum+1);
        var space = btnHeight/(btnNum+1);

        var i = 0;
        var space1 = btnHeight+space;
        var space2 = space*2;
        // creates the menu
        for(var k in btns) {
            var classname = btns[k][0];
            var link = btns[k][1];
            // add button
            new Btn(k).addClass(classname).on( 'click', linkEvent(link)).appendTo('#main');
            // adjust button size
            var classname1 = "."+classname;
            $(classname1).height(btnHeight);
            $(classname1).width(width*0.8);
            $(classname1).css("top", space1*i+space2);
            i++;
        }

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
