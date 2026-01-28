<?php
/**
 * This file is NOT updated when the theme engine is updated
 * and contains features that affect all skins in the theme lineup.
 *
 * @package ROOK
 * @since ROOK 2.34.6
 */

if ( ! function_exists( 'rook_ai_assistant_type' ) ) {
	add_filter( 'trx_addons_filter_ai_assistant_type', 'rook_ai_assistant_type' );
	/**
	 * Set the type of AI Support Assistant to use.
	 *
	 * @since ROOK 2.34.6
	 * 
	 * @hooked trx_addons_filter_ai_assistant_type
	 * 
	 * @param string $type  The type of AI Support Assistant to use: 'v1' for Qwery-based, 'v2' for Rook-based themes
	 *
	 * @return string  The modified type of AI Support Assistant to use
	 */
	function rook_ai_assistant_type( $type = 'v1') {
		return 'v2';
	}
}

/* ThemeREX Addons components
------------------------------------------------------------------------------- */
if ( ! function_exists( 'rook_skins_trx_addons_theme_specific_setup1' ) ) {
	add_action( 'after_setup_theme', 'rook_skins_trx_addons_theme_specific_setup1', 1 );
	function rook_skins_trx_addons_theme_specific_setup1() {
		if ( rook_exists_trx_addons() ) {
			add_filter( 'trx_addons_addons_list', 'rook_trx_addons_addons_list', 100 );
		}
	}
}

// Addons
if ( ! function_exists( 'rook_trx_addons_addons_list' ) ) {
	//Handler of the add_filter( 'trx_addons_addons_list', 'rook_trx_addons_addons_list', 100 );
	function rook_trx_addons_addons_list( $list = array() ) {
		// To do: Enable/Disable theme-specific addons via add/remove it in the list
		if ( is_array( $list ) ) {
			// List of the theme/skin required addons:
			// array(
			// 		'addon1-slug' => array( 'title' => "Title of the addon 1" ),
			// 		'addon2-slug' => array( 'title' => "Title of the addon 2" ),
			// 		...
			//      )
			$required_addons = array(
				'elementor-templates' => array( 'title' => esc_html__( 'Elementor Templates', 'rook' ) ),
				'elementor-widgets'   => array( 'title' => esc_html__( 'Elementor Widgets', 'rook' ) ),
				'expand-collapse'     => array( 'title' => esc_html__( 'Expand / Collapse', 'rook' ) ),
			);
			foreach( $required_addons as $k => $v ) {
				if ( ! isset( $list[ $k ] ) || ! is_array( $list[ $k ] ) ) {
					$list[ $k ] = $v;
				}
				$list[ $k ]['required'] = true;
			}
		}
		return $list;
	}
}