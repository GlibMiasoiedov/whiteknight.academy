<?php
/**
 * The template to display the page title and breadcrumbs
 *
 * @package ROOK
 * @since ROOK 1.0
 */

// Page (category, tag, archive, author) title

if ( rook_need_page_title() ) {
	rook_sc_layouts_showed( 'title', true );
	?>
	<div class="top_panel_title sc_layouts_row">
		<div class="content_wrap">
			<div class="sc_layouts_column sc_layouts_column_align_center">
				<div class="sc_layouts_item">
					<div class="sc_layouts_title sc_align_center">
						<?php
						// Blog/Page title
						?>
						<div class="sc_layouts_title_title">
							<?php
							$rook_blog_title           = rook_get_blog_title();
							$rook_blog_title_text      = '';
							$rook_blog_title_class     = '';
							$rook_blog_title_link      = '';
							$rook_blog_title_link_text = '';
							if ( is_array( $rook_blog_title ) ) {
								$rook_blog_title_text      = $rook_blog_title['text'];
								$rook_blog_title_class     = ! empty( $rook_blog_title['class'] ) ? ' ' . $rook_blog_title['class'] : '';
								$rook_blog_title_link      = ! empty( $rook_blog_title['link'] ) ? $rook_blog_title['link'] : '';
								$rook_blog_title_link_text = ! empty( $rook_blog_title['link_text'] ) ? $rook_blog_title['link_text'] : '';
							} else {
								$rook_blog_title_text = $rook_blog_title;
							}
							?>
							<h1 class="sc_layouts_title_caption<?php echo esc_attr( $rook_blog_title_class ); ?>"<?php
								if ( rook_is_on( rook_get_theme_option( 'seo_snippets' ) ) ) {
									?> itemprop="headline"<?php
								}
							?>>
								<?php
								$rook_top_icon = rook_get_term_image_small();
								if ( ! empty( $rook_top_icon ) ) {
									$rook_attr = rook_getimagesize( $rook_top_icon );
									?>
									<img src="<?php echo esc_url( $rook_top_icon ); ?>" alt="<?php esc_attr_e( 'Site icon', 'rook' ); ?>"
										<?php
										if ( ! empty( $rook_attr[3] ) ) {
											rook_show_layout( $rook_attr[3] );
										}
										?>
									>
									<?php
								}
								echo wp_kses_data( $rook_blog_title_text );
								?>
							</h1>
							<?php
							if ( ! empty( $rook_blog_title_link ) && ! empty( $rook_blog_title_link_text ) ) {
								?>
								<a href="<?php echo esc_url( $rook_blog_title_link ); ?>" class="theme_button sc_layouts_title_link"><?php echo esc_html( $rook_blog_title_link_text ); ?></a>
								<?php
							}

							// Category/Tag description
							if ( ! is_paged() && ( is_category() || is_tag() || is_tax() ) ) {
								the_archive_description( '<div class="sc_layouts_title_description">', '</div>' );
							}

							?>
						</div>
						<?php

						// Breadcrumbs
						ob_start();
						do_action( 'rook_action_breadcrumbs' );
						$rook_breadcrumbs = ob_get_contents();
						ob_end_clean();
						rook_show_layout( $rook_breadcrumbs, '<div class="sc_layouts_title_breadcrumbs">', '</div>' );
						?>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php
}
