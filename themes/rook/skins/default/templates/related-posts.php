<?php
/**
 * The default template to displaying related posts
 *
 * @package ROOK
 * @since ROOK 1.0.54
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
		<h6 class="post_title entry-title"><a href="<?php echo esc_url( $rook_link ); ?>"><?php
			if ( '' == get_the_title() ) {
				esc_html_e( 'No title', 'rook' );
			} else {
				the_title();
			}
		?></a></h6>
		<?php
		if ( in_array( get_post_type(), array( 'post', 'attachment' ) ) ) {
			?>
			<span class="post_date"><a href="<?php echo esc_url( $rook_link ); ?>"><?php echo wp_kses_data( rook_get_date() ); ?></a></span>
			<?php
		}
		?>
	</div>
</div>
