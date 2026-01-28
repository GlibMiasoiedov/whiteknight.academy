<?php
/**
 * The template to display Admin notices
 *
 * @package ROOK
 * @since ROOK 1.0.64
 */

$rook_skins_url  = get_admin_url( null, 'admin.php?page=trx_addons_theme_panel#trx_addons_theme_panel_section_skins' );
$rook_skins_args = get_query_var( 'rook_skins_notice_args' );
?>
<div class="rook_admin_notice rook_skins_notice notice notice-info is-dismissible" data-notice="skins">
	<?php
	// Theme image
	$rook_theme_img = rook_get_file_url( 'screenshot.jpg' );
	if ( '' != $rook_theme_img ) {
		?>
		<div class="rook_notice_image"><img src="<?php echo esc_url( $rook_theme_img ); ?>" alt="<?php esc_attr_e( 'Theme screenshot', 'rook' ); ?>"></div>
		<?php
	}

	// Title
	?>
	<h3 class="rook_notice_title">
		<?php esc_html_e( 'New skins are available', 'rook' ); ?>
	</h3>
	<?php

	// Description
	$rook_total      = $rook_skins_args['update'];	// Store value to the separate variable to avoid warnings from ThemeCheck plugin!
	$rook_skins_msg  = $rook_total > 0
							// Translators: Add new skins number
							? '<strong>' . sprintf( _n( '%d new version', '%d new versions', $rook_total, 'rook' ), $rook_total ) . '</strong>'
							: '';
	$rook_total      = $rook_skins_args['free'];
	$rook_skins_msg .= $rook_total > 0
							? ( ! empty( $rook_skins_msg ) ? ' ' . esc_html__( 'and', 'rook' ) . ' ' : '' )
								// Translators: Add new skins number
								. '<strong>' . sprintf( _n( '%d free skin', '%d free skins', $rook_total, 'rook' ), $rook_total ) . '</strong>'
							: '';
	$rook_total      = $rook_skins_args['pay'];
	$rook_skins_msg .= $rook_skins_args['pay'] > 0
							? ( ! empty( $rook_skins_msg ) ? ' ' . esc_html__( 'and', 'rook' ) . ' ' : '' )
								// Translators: Add new skins number
								. '<strong>' . sprintf( _n( '%d paid skin', '%d paid skins', $rook_total, 'rook' ), $rook_total ) . '</strong>'
							: '';
	?>
	<div class="rook_notice_text">
		<p>
			<?php
			// Translators: Add new skins info
			echo wp_kses_data( sprintf( __( "We are pleased to announce that %s are available for your theme", 'rook' ), $rook_skins_msg ) );
			?>
		</p>
	</div>
	<?php

	// Buttons
	?>
	<div class="rook_notice_buttons">
		<?php
		// Link to the theme dashboard page
		?>
		<a href="<?php echo esc_url( $rook_skins_url ); ?>" class="button button-primary"><i class="dashicons dashicons-update"></i> 
			<?php
			esc_html_e( 'Go to Skins manager', 'rook' );
			?>
		</a>
		<?php
		// Dismiss notice for 7 days
		?>
		<a href="#" role="button" class="button button-secondary rook_notice_button_dismiss" data-notice="skins"><i class="dashicons dashicons-no-alt"></i> 
			<?php
			esc_html_e( 'Dismiss', 'rook' );
			?>
		</a>
		<?php
		// Hide notice forever
		?>
		<a href="#" role="button" class="button button-secondary rook_notice_button_hide" data-notice="skins"><i class="dashicons dashicons-no-alt"></i> 
			<?php
			esc_html_e( 'Never show again', 'rook' );
			?>
		</a>
	</div>
</div>
