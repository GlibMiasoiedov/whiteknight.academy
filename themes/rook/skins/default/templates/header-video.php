<?php
/**
 * The template to display the background video in the header
 *
 * @package ROOK
 * @since ROOK 1.0.14
 */
$rook_header_video = rook_get_header_video();
$rook_embed_video  = '';
if ( ! empty( $rook_header_video ) && ! rook_is_from_uploads( $rook_header_video ) ) {
	if ( rook_is_youtube_url( $rook_header_video ) && preg_match( '/[=\/]([^=\/]*)$/', $rook_header_video, $matches ) && ! empty( $matches[1] ) ) {
		?><div id="background_video" data-youtube-code="<?php echo esc_attr( $matches[1] ); ?>"></div>
		<?php
	} else {
		?>
		<div id="background_video"><?php rook_show_layout( rook_get_embed_video( $rook_header_video ) ); ?></div>
		<?php
	}
}