<?php
$rook_woocommerce_sc = rook_get_theme_option( 'front_page_woocommerce_products' );
if ( ! empty( $rook_woocommerce_sc ) ) {
	?><div class="front_page_section front_page_section_woocommerce<?php
		$rook_scheme = rook_get_theme_option( 'front_page_woocommerce_scheme' );
		if ( ! empty( $rook_scheme ) && ! rook_is_inherit( $rook_scheme ) ) {
			echo ' scheme_' . esc_attr( $rook_scheme );
		}
		echo ' front_page_section_paddings_' . esc_attr( rook_get_theme_option( 'front_page_woocommerce_paddings' ) );
		if ( rook_get_theme_option( 'front_page_woocommerce_stack' ) ) {
			echo ' sc_stack_section_on';
		}
	?>"
			<?php
			$rook_css      = '';
			$rook_bg_image = rook_get_theme_option( 'front_page_woocommerce_bg_image' );
			if ( ! empty( $rook_bg_image ) ) {
				$rook_css .= 'background-image: url(' . esc_url( rook_get_attachment_url( $rook_bg_image ) ) . ');';
			}
			if ( ! empty( $rook_css ) ) {
				echo ' style="' . esc_attr( $rook_css ) . '"';
			}
			?>
	>
	<?php
		// Add anchor
		$rook_anchor_icon = rook_get_theme_option( 'front_page_woocommerce_anchor_icon' );
		$rook_anchor_text = rook_get_theme_option( 'front_page_woocommerce_anchor_text' );
		if ( ( ! empty( $rook_anchor_icon ) || ! empty( $rook_anchor_text ) ) && shortcode_exists( 'trx_sc_anchor' ) ) {
			echo do_shortcode(
				'[trx_sc_anchor id="front_page_section_woocommerce"'
											. ( ! empty( $rook_anchor_icon ) ? ' icon="' . esc_attr( $rook_anchor_icon ) . '"' : '' )
											. ( ! empty( $rook_anchor_text ) ? ' title="' . esc_attr( $rook_anchor_text ) . '"' : '' )
											. ']'
			);
		}
	?>
		<div class="front_page_section_inner front_page_section_woocommerce_inner
			<?php
			if ( rook_get_theme_option( 'front_page_woocommerce_fullheight' ) ) {
				echo ' rook-full-height sc_layouts_flex sc_layouts_columns_middle';
			}
			?>
				"
				<?php
				$rook_css      = '';
				$rook_bg_mask  = rook_get_theme_option( 'front_page_woocommerce_bg_mask' );
				$rook_bg_color_type = rook_get_theme_option( 'front_page_woocommerce_bg_color_type' );
				if ( 'custom' == $rook_bg_color_type ) {
					$rook_bg_color = rook_get_theme_option( 'front_page_woocommerce_bg_color' );
				} elseif ( 'scheme_bg_color' == $rook_bg_color_type ) {
					$rook_bg_color = rook_get_scheme_color( 'bg_color', $rook_scheme );
				} else {
					$rook_bg_color = '';
				}
				if ( ! empty( $rook_bg_color ) && $rook_bg_mask > 0 ) {
					$rook_css .= 'background-color: ' . esc_attr(
						1 == $rook_bg_mask ? $rook_bg_color : rook_hex2rgba( $rook_bg_color, $rook_bg_mask )
					) . ';';
				}
				if ( ! empty( $rook_css ) ) {
					echo ' style="' . esc_attr( $rook_css ) . '"';
				}
				?>
		>
			<div class="front_page_section_content_wrap front_page_section_woocommerce_content_wrap content_wrap woocommerce">
				<?php
				// Content wrap with title and description
				$rook_caption     = rook_get_theme_option( 'front_page_woocommerce_caption' );
				$rook_description = rook_get_theme_option( 'front_page_woocommerce_description' );
				if ( ! empty( $rook_caption ) || ! empty( $rook_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
					// Caption
					if ( ! empty( $rook_caption ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
						?>
						<h2 class="front_page_section_caption front_page_section_woocommerce_caption front_page_block_<?php echo ! empty( $rook_caption ) ? 'filled' : 'empty'; ?>">
						<?php
							echo wp_kses( $rook_caption, 'rook_kses_content' );
						?>
						</h2>
						<?php
					}

					// Description (text)
					if ( ! empty( $rook_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
						?>
						<div class="front_page_section_description front_page_section_woocommerce_description front_page_block_<?php echo ! empty( $rook_description ) ? 'filled' : 'empty'; ?>">
						<?php
							echo wp_kses( wpautop( $rook_description ), 'rook_kses_content' );
						?>
						</div>
						<?php
					}
				}

				// Content (widgets)
				?>
				<div class="front_page_section_output front_page_section_woocommerce_output list_products shop_mode_thumbs">
					<?php
					if ( 'products' == $rook_woocommerce_sc ) {
						$rook_woocommerce_sc_ids      = rook_get_theme_option( 'front_page_woocommerce_products_per_page' );
						$rook_woocommerce_sc_per_page = count( explode( ',', $rook_woocommerce_sc_ids ) );
					} else {
						$rook_woocommerce_sc_per_page = max( 1, (int) rook_get_theme_option( 'front_page_woocommerce_products_per_page' ) );
					}
					$rook_woocommerce_sc_columns = max( 1, min( $rook_woocommerce_sc_per_page, (int) rook_get_theme_option( 'front_page_woocommerce_products_columns' ) ) );
					echo do_shortcode(
						"[{$rook_woocommerce_sc}"
										. ( 'products' == $rook_woocommerce_sc
												? ' ids="' . esc_attr( $rook_woocommerce_sc_ids ) . '"'
												: '' )
										. ( 'product_category' == $rook_woocommerce_sc
												? ' category="' . esc_attr( rook_get_theme_option( 'front_page_woocommerce_products_categories' ) ) . '"'
												: '' )
										. ( 'best_selling_products' != $rook_woocommerce_sc
												? ' orderby="' . esc_attr( rook_get_theme_option( 'front_page_woocommerce_products_orderby' ) ) . '"'
													. ' order="' . esc_attr( rook_get_theme_option( 'front_page_woocommerce_products_order' ) ) . '"'
												: '' )
										. ' per_page="' . esc_attr( $rook_woocommerce_sc_per_page ) . '"'
										. ' columns="' . esc_attr( $rook_woocommerce_sc_columns ) . '"'
						. ']'
					);
					?>
				</div>
			</div>
		</div>
	</div>
	<?php
}
