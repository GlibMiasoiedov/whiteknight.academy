<?php
/**
 * The template to display the logo or the site name and the slogan in the Header
 *
 * @package ROOK
 * @since ROOK 1.0
 */

$rook_args = get_query_var( 'rook_logo_args' );

// Site logo
$rook_logo_type   = isset( $rook_args['type'] ) ? $rook_args['type'] : '';
$rook_logo_image  = rook_get_logo_image( $rook_logo_type );
$rook_logo_text   = rook_is_on( rook_get_theme_option( 'logo_text' ) ) ? get_bloginfo( 'name' ) : '';
$rook_logo_slogan = get_bloginfo( 'description', 'display' );
if ( ! empty( $rook_logo_image['logo'] ) || ! empty( $rook_logo_text ) ) {
	?><a class="sc_layouts_logo" href="<?php echo esc_url( home_url( '/' ) ); ?>">
		<?php
		if ( ! empty( $rook_logo_image['logo'] ) ) {
			if ( empty( $rook_logo_type ) && function_exists( 'the_custom_logo' ) && is_numeric( $rook_logo_image['logo'] ) && (int) $rook_logo_image['logo'] > 0 ) {
				the_custom_logo();
			} else {
				$rook_attr = rook_getimagesize( $rook_logo_image['logo'] );
				echo '<img src="' . esc_url( $rook_logo_image['logo'] ) . '"'
						. ( ! empty( $rook_logo_image['logo_retina'] ) ? ' srcset="' . esc_url( $rook_logo_image['logo_retina'] ) . ' 2x"' : '' )
						. ' alt="' . esc_attr( $rook_logo_text ) . '"'
						. ( ! empty( $rook_attr[3] ) ? ' ' . wp_kses_data( $rook_attr[3] ) : '' )
						. '>';
			}
		} else {
			rook_show_layout( rook_prepare_macros( $rook_logo_text ), '<span class="logo_text">', '</span>' );
			rook_show_layout( rook_prepare_macros( $rook_logo_slogan ), '<span class="logo_slogan">', '</span>' );
		}
		?>
	</a>
	<?php
}
