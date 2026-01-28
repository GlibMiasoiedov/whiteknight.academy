<?php
/**
 * Required plugins
 *
 * @package ROOK
 * @since ROOK 1.76.0
 */

// THEME-SUPPORTED PLUGINS
// If plugin not need - remove its settings from next array
//----------------------------------------------------------
if ( ! function_exists( 'rook_skin_required_plugins' ) ) {
	add_action( 'after_setup_theme', 'rook_skin_required_plugins', -1 );
	function rook_skin_required_plugins() {
		$rook_theme_required_plugins_groups = array(
			'core'          => esc_html__( 'Core', 'rook' ),
			'page_builders' => esc_html__( 'Page Builders', 'rook' ),
			'ecommerce'     => esc_html__( 'E-Commerce & Donations', 'rook' ),
			'socials'       => esc_html__( 'Socials and Communities', 'rook' ),
			'events'        => esc_html__( 'Events and Appointments', 'rook' ),
			'content'       => esc_html__( 'Content', 'rook' ),
			'other'         => esc_html__( 'Other', 'rook' ),
		);
		$rook_theme_required_plugins        = array(
			// Core
			'trx_addons'                 => array(
				'title'       => esc_html__( 'ThemeREX Addons', 'rook' ),
				'description' => esc_html__( "Will allow you to install recommended plugins, demo content, and improve the theme's functionality overall with multiple theme options", 'rook' ),
				'required'    => true, // Check this plugin in the list on load Theme Dashboard
				'logo'        => 'trx_addons.png',
				'group'       => $rook_theme_required_plugins_groups['core'],
			),
			// Page Builders
			'elementor'                  => array(
				'title'       => esc_html__( 'Elementor', 'rook' ),
				'description' => esc_html__( "Is a beautiful PageBuilder, even the free version of which allows you to create great pages using a variety of modules.", 'rook' ),
				'required'    => false, // Leave this plugin unchecked on load Theme Dashboard
				'logo'        => 'elementor.png',
				'group'       => $rook_theme_required_plugins_groups['page_builders'],
			),
			'gutenberg'                  => array(
				'title'       => esc_html__( 'Gutenberg', 'rook' ),
				'description' => esc_html__( "It's a posts editor coming in place of the classic TinyMCE. Can be installed and used in parallel with Elementor", 'rook' ),
				'required'    => false,
				'install'     => false, // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
				'logo'        => 'gutenberg.png',
				'group'       => $rook_theme_required_plugins_groups['page_builders'],
			),
			// Events and Appointments
			'the-events-calendar'        => array(
				'title'       => esc_html__( 'The Events Calendar', 'rook' ),
				'description' => '',
				'required'    => false,
				'install'     => false, // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
				'logo'        => 'the-events-calendar.png',
				'group'       => $rook_theme_required_plugins_groups['events'],
			),
			'event-tickets'              => array(
				'title'       => esc_html__( 'Event Tickets', 'rook' ),
				'description' => '',
				'required'    => false,
				'install'     => false, // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
				'logo'        => 'event-tickets.png',
				'group'       => $rook_theme_required_plugins_groups['events'],
			),
			'tutor'                     => array(
				'title'       => esc_html__( 'Tutor LMS', 'rook' ),
				'description' => '',
				'required'    => false,
				'install'     => false, // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
				'logo'        => 'tutor.png',
				'group'       => $rook_theme_required_plugins_groups['events'],
			),
			'tutor-lms-elementor-addons' => array(
				'title'       => esc_html__( 'Tutor LMS Elementor Addons', 'rook' ),
				'description' => '',
				'required'    => false,
				'install'     => false, // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
				'logo'        => '',	//'tutor-lms-elementor-addons.png',	// Don't specify logo, it will be used from the parent plugin folder
				'group'       => $rook_theme_required_plugins_groups['events'],
			),
			// Content
			'sitepress-multilingual-cms' => array(
				'title'       => esc_html__( 'WPML - Sitepress Multilingual CMS', 'rook' ),
				'description' => esc_html__( "Allows you to make your website multilingual", 'rook' ),
				'required'    => false,
				'install'     => false, // Do not offer installation of the plugin in the Theme Dashboard and TGMPA
				'logo'        => 'sitepress-multilingual-cms.png',
				'group'       => $rook_theme_required_plugins_groups['content'],
			),
			'metform'                    => array(
				'title'       => esc_html__( 'MetForm', 'rook' ),
				'description' => esc_html__( "Contact Form, Survey, Quiz, & Custom Form Builder for Elementor", 'rook' ),
				'required'    => false,
				'logo'        => 'metform.png',
				'group'       => $rook_theme_required_plugins_groups['content'],
			),
			'woocommerce'                => array(
				'title'       => esc_html__( 'WooCommerce', 'rook' ),
				'description' => esc_html__( "Connect the store to your website and start selling now", 'rook' ),
				'required'    => false,
				'logo'        => 'woocommerce.png',
				'group'       => $rook_theme_required_plugins_groups['ecommerce'],
			),
			// Other
			'trx_updater'                => array(
				'title'       => esc_html__( 'ThemeREX Updater', 'rook' ),
				'description' => esc_html__( "Update theme and theme-specific plugins from developer's upgrade server.", 'rook' ),
				'required'    => false,
				'logo'        => 'trx_updater.png',
				'group'       => $rook_theme_required_plugins_groups['other'],
			)
		);

		if ( ROOK_THEME_FREE ) {
			unset( $rook_theme_required_plugins['sitepress-multilingual-cms'] );
			unset( $rook_theme_required_plugins['trx_updater'] );
		}

		// Add plugins list to the global storage
		rook_storage_set( 'required_plugins', $rook_theme_required_plugins );
	}
}
