<?php
/**
 * The template to display Admin notices
 *
 * @package ROOK
 * @since ROOK 1.0.1
 */

$rook_theme_slug = get_template();
$rook_theme_obj  = wp_get_theme( $rook_theme_slug );
?>
<div class="rook_admin_notice rook_welcome_notice notice notice-info is-dismissible" data-notice="admin">
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
		<?php
		echo esc_html(
			sprintf(
				// Translators: Add theme name and version to the 'Welcome' message
				__( 'Welcome to %1$s v.%2$s', 'rook' ),
				$rook_theme_obj->get( 'Name' ) . ( ROOK_THEME_FREE ? ' ' . __( 'Free', 'rook' ) : '' ),
				$rook_theme_obj->get( 'Version' )
			)
		);
		?>
	</h3>
	<?php

	// Description
	?>
	<div class="rook_notice_text">
		<p class="rook_notice_text_description">
			<?php
			echo str_replace( '. ', '.<br>', wp_kses_data( $rook_theme_obj->description ) );
			?>
		</p>
		<p class="rook_notice_text_info">
			<?php
			echo wp_kses_data( __( 'Attention! Plugin "ThemeREX Addons" is required! Please, install and activate it!', 'rook' ) );
			?>
		</p>
	</div>
	<?php

	// Buttons
	?>
	<div class="rook_notice_buttons">
		<?php
		// Link to the page 'About Theme'
		?>
		<a href="<?php echo esc_url( admin_url() . 'themes.php?page=rook_about' ); ?>" class="button button-primary"><i class="dashicons dashicons-nametag"></i> 
			<?php
			echo esc_html__( 'Install plugin "ThemeREX Addons"', 'rook' );
			?>
		</a>
	</div>
</div>
