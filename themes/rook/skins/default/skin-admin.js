/* global jQuery, ROOK_STORAGE */

( function() {
	"use strict";

	// Disable a "Title, Description, Link" parameters in out shortcodes
	rook_add_filter( 'trx_addons_filter_add_title_param', function( allow, sc ) {
		return false;
	} );

} )();