<?php
/**
 * The template to display custom header from the ThemeREX Addons Layouts
 *
 * @package ROOK
 * @since ROOK 1.0.06
 */

$rook_header_css   = '';
$rook_header_image = get_header_image();
if ( ! empty( $rook_header_image ) && rook_trx_addons_featured_image_override( rook_is_singular() || rook_storage_isset( 'blog_archive' ) || is_category() ) ) {
	$rook_header_image = rook_get_current_mode_image( $rook_header_image );
}

$rook_header_id = rook_get_custom_header_id();
$rook_header_meta = rook_get_custom_layout_meta( $rook_header_id );
if ( ! empty( $rook_header_meta['margin'] ) ) {
	rook_add_inline_css( sprintf( '.page_content_wrap{padding-top:%s}', esc_attr( rook_prepare_css_value( $rook_header_meta['margin'] ) ) ) );
	rook_storage_set( 'custom_header_margin', rook_prepare_css_value( $rook_header_meta['margin'] ) );
}

?><header class="top_panel top_panel_custom top_panel_custom_<?php echo esc_attr( $rook_header_id ); ?> top_panel_custom_<?php echo esc_attr( sanitize_title( get_the_title( $rook_header_id ) ) ); ?>
				<?php
				echo ! empty( $rook_header_image )
					? ' with_bg_image'
					: ' without_bg_image';
				if ( '' != $rook_header_image ) {
					echo ' ' . esc_attr( rook_add_inline_css_class( 'background-image: url(' . esc_url( $rook_header_image ) . ');' ) );
				}
				if ( rook_is_single() && has_post_thumbnail() ) {
					echo ' with_featured_image';
				}
				?>
">
	<?php

	// Custom header's layout
	do_action( 'rook_action_show_layout', $rook_header_id );

	?>
</header>
