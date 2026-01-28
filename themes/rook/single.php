<?php
/**
 * The template to display single post
 *
 * @package ROOK
 * @since ROOK 1.0
 */

// Full post loading
$full_post_loading          = rook_get_value_gp( 'action' ) == 'full_post_loading';

// Prev post loading
$prev_post_loading          = rook_get_value_gp( 'action' ) == 'prev_post_loading';
$prev_post_loading_type     = rook_get_theme_option( 'posts_navigation_scroll_which_block', 'article' );

// Position of the related posts
$rook_related_position   = rook_get_theme_option( 'related_position', 'below_content' );

// Type of the prev/next post navigation
$rook_posts_navigation   = rook_get_theme_option( 'posts_navigation' );
$rook_prev_post          = false;
$rook_prev_post_same_cat = (int)rook_get_theme_option( 'posts_navigation_scroll_same_cat', 1 );

// Rewrite style of the single post if current post loading via AJAX and featured image and title is not in the content
if ( ( $full_post_loading 
		|| 
		( $prev_post_loading && 'article' == $prev_post_loading_type )
	) 
	&& 
	! in_array( rook_get_theme_option( 'single_style' ), array( 'style-6' ) )
) {
	rook_storage_set_array( 'options_meta', 'single_style', 'style-6' );
}

do_action( 'rook_action_prev_post_loading', $prev_post_loading, $prev_post_loading_type );

get_header();

while ( have_posts() ) {

	the_post();

	// Type of the prev/next post navigation
	if ( 'scroll' == $rook_posts_navigation ) {
		$rook_prev_post = get_previous_post( $rook_prev_post_same_cat );  // Get post from same category
		if ( ! $rook_prev_post && $rook_prev_post_same_cat ) {
			$rook_prev_post = get_previous_post( false );                    // Get post from any category
		}
		if ( ! $rook_prev_post ) {
			$rook_posts_navigation = 'links';
		}
	}

	// Override some theme options to display featured image, title and post meta in the dynamic loaded posts
	if ( $full_post_loading || ( $prev_post_loading && $rook_prev_post ) ) {
		rook_sc_layouts_showed( 'featured', false );
		rook_sc_layouts_showed( 'title', false );
		rook_sc_layouts_showed( 'postmeta', false );
	}

	// If related posts should be inside the content
	if ( strpos( $rook_related_position, 'inside' ) === 0 ) {
		ob_start();
	}

	// Display post's content
	get_template_part( apply_filters( 'rook_filter_get_template_part', 'templates/content', 'single-' . rook_get_theme_option( 'single_style' ) ), 'single-' . rook_get_theme_option( 'single_style' ) );

	// If related posts should be inside the content
	if ( strpos( $rook_related_position, 'inside' ) === 0 ) {
		$rook_content = ob_get_contents();
		ob_end_clean();

		ob_start();
		do_action( 'rook_action_related_posts' );
		$rook_related_content = ob_get_contents();
		ob_end_clean();

		if ( ! empty( $rook_related_content ) ) {
			$rook_related_position_inside = max( 0, min( 9, rook_get_theme_option( 'related_position_inside' ) ) );
			if ( 0 == $rook_related_position_inside ) {
				$rook_related_position_inside = mt_rand( 1, 9 );
			}

			$rook_p_number         = 0;
			$rook_related_inserted = false;
			$rook_in_block         = false;
			$rook_content_start    = strpos( $rook_content, '<div class="post_content' );
			$rook_content_end      = strrpos( $rook_content, '</div>' );

			for ( $i = max( 0, $rook_content_start ); $i < min( strlen( $rook_content ) - 3, $rook_content_end ); $i++ ) {
				if ( $rook_content[ $i ] != '<' ) {
					continue;
				}
				if ( $rook_in_block ) {
					if ( strtolower( substr( $rook_content, $i + 1, 12 ) ) == '/blockquote>' ) {
						$rook_in_block = false;
						$i += 12;
					}
					continue;
				} else if ( strtolower( substr( $rook_content, $i + 1, 10 ) ) == 'blockquote' && in_array( $rook_content[ $i + 11 ], array( '>', ' ' ) ) ) {
					$rook_in_block = true;
					$i += 11;
					continue;
				} else if ( 'p' == $rook_content[ $i + 1 ] && in_array( $rook_content[ $i + 2 ], array( '>', ' ' ) ) ) {
					$rook_p_number++;
					if ( $rook_related_position_inside == $rook_p_number ) {
						$rook_related_inserted = true;
						$rook_content = ( $i > 0 ? substr( $rook_content, 0, $i ) : '' )
											. $rook_related_content
											. substr( $rook_content, $i );
					}
				}
			}
			if ( ! $rook_related_inserted ) {
				if ( $rook_content_end > 0 ) {
					$rook_content = substr( $rook_content, 0, $rook_content_end ) . $rook_related_content . substr( $rook_content, $rook_content_end );
				} else {
					$rook_content .= $rook_related_content;
				}
			}
		}

		rook_show_layout( $rook_content );
	}

	// Comments
	do_action( 'rook_action_before_comments' );
	comments_template();
	do_action( 'rook_action_after_comments' );

	// Related posts
	if ( 'below_content' == $rook_related_position
		&& ( 'scroll' != $rook_posts_navigation || (int)rook_get_theme_option( 'posts_navigation_scroll_hide_related', 0 ) == 0 )
		&& ( ! $full_post_loading || (int)rook_get_theme_option( 'open_full_post_hide_related', 1 ) == 0 )
	) {
		do_action( 'rook_action_related_posts' );
	}

	// Post navigation: type 'scroll'
	if ( 'scroll' == $rook_posts_navigation && ! $full_post_loading ) {
		?>
		<div class="nav-links-single-scroll"
			data-post-id="<?php echo esc_attr( get_the_ID( $rook_prev_post ) ); ?>"
			data-post-link="<?php echo esc_attr( get_permalink( $rook_prev_post ) ); ?>"
			data-post-title="<?php the_title_attribute( array( 'post' => $rook_prev_post ) ); ?>"
			data-cur-post-link="<?php echo esc_attr( get_permalink() ); ?>"
			data-cur-post-title="<?php the_title_attribute(); ?>"
			<?php do_action( 'rook_action_nav_links_single_scroll_data', $rook_prev_post ); ?>
		></div>
		<?php
	}
}

get_footer();
