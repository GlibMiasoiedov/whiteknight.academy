<?php
/**
 * The template to display default site footer
 *
 * @package ROOK
 * @since ROOK 1.0.10
 */

$rook_footer_id = rook_get_custom_footer_id();
$rook_footer_meta = rook_get_custom_layout_meta( $rook_footer_id );
if ( ! empty( $rook_footer_meta['margin'] ) ) {
	rook_add_inline_css( sprintf( '.page_content_wrap{padding-bottom:%s}', esc_attr( rook_prepare_css_value( $rook_footer_meta['margin'] ) ) ) );
}
?>
<footer class="footer_wrap footer_custom footer_custom_<?php echo esc_attr( $rook_footer_id ); ?> footer_custom_<?php echo esc_attr( sanitize_title( get_the_title( $rook_footer_id ) ) ); ?>">
	<?php
	// Custom footer's layout
	do_action( 'rook_action_show_layout', $rook_footer_id );
	?>
</footer>