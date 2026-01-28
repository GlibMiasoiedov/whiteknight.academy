<?php
/**
 * The Classic template to display the content
 *
 * Used for index/archive/search.
 *
 * @package ROOK
 * @since ROOK 1.0
 */

$rook_template_args = get_query_var( 'rook_template_args' );

if ( is_array( $rook_template_args ) ) {
	$rook_columns       = empty( $rook_template_args['columns'] ) ? 1 : max( 1, $rook_template_args['columns'] );
	$rook_blog_style    = array( $rook_template_args['type'], $rook_columns );
	$rook_columns_class = rook_get_column_class( 1, $rook_columns, ! empty( $rook_template_args['columns_tablet']) ? $rook_template_args['columns_tablet'] : '', ! empty($rook_template_args['columns_mobile']) ? $rook_template_args['columns_mobile'] : '' );
} else {
	$rook_template_args = array();
	$rook_blog_style    = explode( '_', rook_get_theme_option( 'blog_style' ) );
	$rook_columns       = empty( $rook_blog_style[1] ) ? 1 : max( 1, $rook_blog_style[1] );
	$rook_columns_class = rook_get_column_class( 1, $rook_columns );
}
$rook_expanded   = ! rook_sidebar_present() && rook_get_theme_option( 'expand_content' ) == 'expand';

$rook_post_format = get_post_format();
$rook_post_format = empty( $rook_post_format ) ? 'standard' : str_replace( 'post-format-', '', $rook_post_format );

?><div class="<?php
	if ( ! empty( $rook_template_args['slider'] ) ) {
		echo ' slider-slide swiper-slide';
	} else {
		echo ( rook_is_blog_style_use_masonry( $rook_blog_style[0] )
			? 'masonry_item masonry_item-1_' . esc_attr( $rook_columns )
			: esc_attr( $rook_columns_class )
			);
	}
?>"><article id="post-<?php the_ID(); ?>" data-post-id="<?php the_ID(); ?>"
	<?php
	post_class(
		'post_item post_item_container post_format_' . esc_attr( $rook_post_format )
				. ' post_layout_classic post_layout_classic_' . esc_attr( $rook_columns )
				. ' post_layout_' . esc_attr( $rook_blog_style[0] )
				. ' post_layout_' . esc_attr( $rook_blog_style[0] ) . '_' . esc_attr( $rook_columns )
	);
	rook_add_blog_animation( $rook_template_args );
	?>
>
	<?php

	// Sticky label
	if ( is_sticky() && ! is_paged() ) {
		?><span class="post_label label_sticky"></span><?php
	}

	// Featured image
	$rook_hover      = ! empty( $rook_template_args['hover'] ) && ! rook_is_inherit( $rook_template_args['hover'] )
							? $rook_template_args['hover']
							: rook_get_theme_option( 'image_hover' );

	$rook_components = ! empty( $rook_template_args['meta_parts'] )
							? ( is_array( $rook_template_args['meta_parts'] )
								? $rook_template_args['meta_parts']
								: array_map( 'trim', explode( ',', $rook_template_args['meta_parts'] ) )
								)
							: rook_array_get_keys_by_value( rook_get_theme_option( 'meta_parts' ) );

	rook_show_post_featured( apply_filters( 'rook_filter_args_featured',
		array(
			'thumb_size' => ! empty( $rook_template_args['thumb_size'] )
								? $rook_template_args['thumb_size']
								: rook_get_thumb_size(
									strpos( rook_get_theme_option( 'body_style' ), 'full' ) !== false
										? ( $rook_columns > 2 ? 'big' : 'full' )
										: ( $rook_columns > 2
											? 'med'
											: ( $rook_expanded || $rook_columns == 1 ? 
												( $rook_expanded && $rook_columns == 1 ? 'huge' : 'big' ) 
												: 'med' 
												)
											)												
								),
			'hover'      => $rook_hover,
			'meta_parts' => $rook_components,
			'no_links'   => ! empty( $rook_template_args['no_links'] ),
		),
		'content-classic',
		$rook_template_args
	) );

	// Title and post meta
	$rook_show_title = get_the_title() != '';
	$rook_show_meta  = count( $rook_components ) > 0;

	if ( $rook_show_title ) {
		?><div class="post_header entry-header"><?php
			// Categories
			if ( apply_filters( 'rook_filter_show_blog_categories', $rook_show_meta && in_array( 'categories', $rook_components ), array( 'categories' ), 'classic' ) ) {
				do_action( 'rook_action_before_post_category' );
				?><div class="post_category"><?php
					rook_show_post_meta( apply_filters(
														'rook_filter_post_meta_args',
														array(
															'components' => 'categories',
															'seo'        => false,
															'echo'       => true,
															),
														'hover_' . $rook_hover, 1
														)
										);
				?></div><?php
				$rook_components = rook_array_delete_by_value( $rook_components, 'categories' );
				do_action( 'rook_action_after_post_category' );
			}
			// Post title
			if ( apply_filters( 'rook_filter_show_blog_title', true, 'classic' ) ) {
				do_action( 'rook_action_before_post_title' );
				if ( empty( $rook_template_args['no_links'] ) ) {
					the_title( sprintf( '<h3 class="post_title entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h3>' );
				} else {
					the_title( '<h3 class="post_title entry-title">', '</h3>' );
				}
				do_action( 'rook_action_after_post_title' );
			}
		?></div><?php
	}
	
	// Post meta
	if ( apply_filters( 'rook_filter_show_blog_meta', $rook_show_meta, $rook_components, 'classic' ) ) {
		if ( count( $rook_components ) > 0 ) {
			do_action( 'rook_action_before_post_meta' );
			rook_show_post_meta(
				apply_filters(
					'rook_filter_post_meta_args', array(
						'components' => join( ',', $rook_components ),
						'seo'        => false,
						'echo'       => true,
						'author_avatar' => false,
					), $rook_blog_style[0], $rook_columns
				)
			);
			do_action( 'rook_action_after_post_meta' );
		}
	}

	// Post content
	ob_start();
	if ( apply_filters( 'rook_filter_show_blog_excerpt', ( ! isset( $rook_template_args['hide_excerpt'] ) || (int)$rook_template_args['hide_excerpt'] == 0 ) && (int)rook_get_theme_option( 'excerpt_length' ) > 0, 'classic' ) ) {
		rook_show_post_content( $rook_template_args, '<div class="post_content_inner">', '</div>' );
	}
	$rook_content = ob_get_contents();
	ob_end_clean();

	rook_show_layout( $rook_content, '<div class="post_content entry-content">', '</div>' );

		
	// More button
	if ( apply_filters( 'rook_filter_show_blog_readmore', ! $rook_show_title || ! empty( $rook_template_args['more_button'] ), 'classic' ) ) {
		if ( empty( $rook_template_args['no_links'] ) ) {
			do_action( 'rook_action_before_post_readmore' );
			rook_show_post_more_link( $rook_template_args, '<p>', '</p>' );
			do_action( 'rook_action_after_post_readmore' );
		}
	}

	?>

</article></div><?php
// Need opening PHP-tag above, because <div> is a inline-block element (used as column)!
