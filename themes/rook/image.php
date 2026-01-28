<?php
/**
 * The template to display the attachment
 *
 * @package ROOK
 * @since ROOK 1.0
 */


get_header();

while ( have_posts() ) {
	the_post();

	// Display post's content
	get_template_part( apply_filters( 'rook_filter_get_template_part', 'templates/content', 'single-' . rook_get_theme_option( 'single_style' ) ), 'single-' . rook_get_theme_option( 'single_style' ) );

	// Parent post navigation.
	$rook_posts_navigation = rook_get_theme_option( 'posts_navigation' );
	if ( 'links' == $rook_posts_navigation ) {
		?>
		<div class="nav-links-single<?php
			if ( ! rook_is_off( rook_get_theme_option( 'posts_navigation_fixed', 0 ) ) ) {
				echo ' nav-links-fixed fixed';
			}
		?>">
			<?php
			the_post_navigation( apply_filters( 'rook_filter_post_navigation_args', array(
					'prev_text' => '<span class="nav-arrow"></span>'
						. '<span class="meta-nav" aria-hidden="true">' . esc_html__( 'Published in', 'rook' ) . '</span> '
						. '<span class="screen-reader-text">' . esc_html__( 'Previous post:', 'rook' ) . '</span> '
						. '<h5 class="post-title">%title</h5>'
						. '<span class="post_date">%date</span>',
			), 'image' ) );
			?>
		</div>
		<?php
	}

	// Comments
	do_action( 'rook_action_before_comments' );
	comments_template();
	do_action( 'rook_action_after_comments' );
}

get_footer();
