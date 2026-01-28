<?php
/**
 * The template 'Style 2' to displaying related posts
 *
 * @package ROOK
 * @since ROOK 1.0
 */

$rook_link        = get_permalink();
$rook_post_format = get_post_format();
$rook_post_format = empty( $rook_post_format ) ? 'standard' : str_replace( 'post-format-', '', $rook_post_format );

?><div id="post-<?php the_ID(); ?>" <?php post_class( 'related_item post_format_' . esc_attr( $rook_post_format ) ); ?> data-post-id="<?php the_ID(); ?>">
	<?php
	rook_show_post_featured(
		array(
			'thumb_size' => apply_filters( 'rook_filter_related_thumb_size', rook_get_thumb_size(
				(int) rook_get_theme_option( 'related_posts' ) == 1 || (int) rook_get_theme_option( 'related_columns' ) == 1 ? 'full' : 'big' )
			),
		)
	);
	?>
	<div class="post_header entry-header">
		<?php
		if ( in_array( get_post_type(), array( 'post', 'attachment' ) ) ) {
			rook_show_post_meta(
				array(
					'components' => 'categories',
					'class'      => 'post_meta_categories',
				)
			);	
		}
		?>
		<h4 class="post_title entry-title"><a href="<?php echo esc_url( $rook_link ); ?>"><?php
			if ( '' == get_the_title() ) {
				esc_html_e( 'No title', 'rook' );
			} else {
				the_title();
			}
		?></a></h4>
		<?php
		if ( in_array( get_post_type(), array( 'post', 'attachment' ) ) ) {
			rook_show_post_meta(
				array(
					'components' => 'date, comments',
					'class'      => 'post_meta_info',
				)
			);	
		}
		?>
	</div>
</div>
