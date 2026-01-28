<?php
/**
 * The template to display the widgets area in the footer
 *
 * @package ROOK
 * @since ROOK 1.0.10
 */

// Footer sidebar
$rook_footer_name    = rook_get_theme_option( 'footer_widgets' );
$rook_footer_present = ! rook_is_off( $rook_footer_name ) && is_active_sidebar( $rook_footer_name );
if ( $rook_footer_present ) {
	rook_storage_set( 'current_sidebar', 'footer' );
	ob_start();
	if ( is_active_sidebar( $rook_footer_name ) ) {
		dynamic_sidebar( $rook_footer_name );
	}
	$rook_out = trim( ob_get_contents() );
	ob_end_clean();
	if ( ! empty( $rook_out ) ) {
		$rook_out          = preg_replace( "/<\\/aside>[\r\n\s]*<aside/", '</aside><aside', $rook_out );
		$rook_need_columns = true;   //or check: strpos($rook_out, 'columns_wrap')===false;
		if ( $rook_need_columns ) {
			$rook_columns = max( 0, (int) rook_get_theme_option( 'footer_columns' ) );			
			if ( 0 == $rook_columns ) {
				$rook_columns = min( 4, max( 1, rook_tags_count( $rook_out, 'aside' ) ) );
			}
			if ( $rook_columns > 1 ) {
				$rook_out = preg_replace( '/<aside([^>]*)class="widget/', '<aside$1class="column-1_' . esc_attr( $rook_columns ) . ' widget', $rook_out );
			} else {
				$rook_need_columns = false;
			}
		}
		?>
		<div class="footer_widgets_wrap widget_area sc_layouts_row">
			<?php do_action( 'rook_action_before_sidebar_wrap', 'footer' ); ?>
			<div class="footer_widgets_inner widget_area_inner">
				<div class="content_wrap">
					<?php
					if ( $rook_need_columns ) {
						?>
						<div class="columns_wrap">
						<?php
					}
					do_action( 'rook_action_before_sidebar', 'footer' );
					rook_show_layout( $rook_out );
					do_action( 'rook_action_after_sidebar', 'footer' );
					if ( $rook_need_columns ) {
						?>
						</div>
						<?php
					}
					?>
				</div>
			</div>
			<?php do_action( 'rook_action_after_sidebar_wrap', 'footer' ); ?>
		</div>
		<?php
	}
}
