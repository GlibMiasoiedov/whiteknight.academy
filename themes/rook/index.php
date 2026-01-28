<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: //codex.wordpress.org/Template_Hierarchy
 *
 * @package ROOK
 * @since ROOK 1.0
 */

$rook_template = apply_filters( 'rook_filter_get_template_part', rook_blog_archive_get_template() );

if ( ! empty( $rook_template ) && 'index' != $rook_template ) {

	get_template_part( $rook_template );

} else {

	rook_storage_set( 'blog_archive', true );

	get_header();

	if ( have_posts() ) {

		// Query params
		$rook_stickies   = is_home()
								|| ( in_array( rook_get_theme_option( 'post_type' ), array( '', 'post' ) )
									&& (int) rook_get_theme_option( 'parent_cat' ) == 0
									)
										? get_option( 'sticky_posts' )
										: false;
		$rook_post_type  = rook_get_theme_option( 'post_type' );
		$rook_args       = array(
								'blog_style'     => rook_get_theme_option( 'blog_style' ),
								'post_type'      => $rook_post_type,
								'taxonomy'       => rook_get_post_type_taxonomy( $rook_post_type ),
								'parent_cat'     => rook_get_theme_option( 'parent_cat' ),
								'posts_per_page' => rook_get_theme_option( 'posts_per_page' ),
								'sticky'         => rook_get_theme_option( 'sticky_style', 'inherit' ) == 'columns'
															&& is_array( $rook_stickies )
															&& count( $rook_stickies ) > 0
															&& get_query_var( 'paged' ) < 1
								);

		rook_blog_archive_start();

		do_action( 'rook_action_blog_archive_start' );

		if ( is_author() ) {
			do_action( 'rook_action_before_page_author' );
			get_template_part( apply_filters( 'rook_filter_get_template_part', 'templates/author-page' ) );
			do_action( 'rook_action_after_page_author' );
		}

		if ( rook_get_theme_option( 'show_filters', 0 ) ) {
			do_action( 'rook_action_before_page_filters' );
			rook_show_filters( $rook_args );
			do_action( 'rook_action_after_page_filters' );
		} else {
			do_action( 'rook_action_before_page_posts' );
			rook_show_posts( array_merge( $rook_args, array( 'cat' => $rook_args['parent_cat'] ) ) );
			do_action( 'rook_action_after_page_posts' );
		}

		do_action( 'rook_action_blog_archive_end' );

		rook_blog_archive_end();

	} else {

		if ( is_search() ) {
			get_template_part( apply_filters( 'rook_filter_get_template_part', 'templates/content', 'none-search' ), 'none-search' );
		} else {
			get_template_part( apply_filters( 'rook_filter_get_template_part', 'templates/content', 'none-archive' ), 'none-archive' );
		}
	}

	get_footer();
}
