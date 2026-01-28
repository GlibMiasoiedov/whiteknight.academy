<div class="front_page_section front_page_section_about<?php
	$rook_scheme = rook_get_theme_option( 'front_page_about_scheme' );
	if ( ! empty( $rook_scheme ) && ! rook_is_inherit( $rook_scheme ) ) {
		echo ' scheme_' . esc_attr( $rook_scheme );
	}
	echo ' front_page_section_paddings_' . esc_attr( rook_get_theme_option( 'front_page_about_paddings' ) );
	if ( rook_get_theme_option( 'front_page_about_stack' ) ) {
		echo ' sc_stack_section_on';
	}
?>"
		<?php
		$rook_css      = '';
		$rook_bg_image = rook_get_theme_option( 'front_page_about_bg_image' );
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
	$rook_anchor_icon = rook_get_theme_option( 'front_page_about_anchor_icon' );
	$rook_anchor_text = rook_get_theme_option( 'front_page_about_anchor_text' );
if ( ( ! empty( $rook_anchor_icon ) || ! empty( $rook_anchor_text ) ) && shortcode_exists( 'trx_sc_anchor' ) ) {
	echo do_shortcode(
		'[trx_sc_anchor id="front_page_section_about"'
									. ( ! empty( $rook_anchor_icon ) ? ' icon="' . esc_attr( $rook_anchor_icon ) . '"' : '' )
									. ( ! empty( $rook_anchor_text ) ? ' title="' . esc_attr( $rook_anchor_text ) . '"' : '' )
									. ']'
	);
}
?>
	<div class="front_page_section_inner front_page_section_about_inner
	<?php
	if ( rook_get_theme_option( 'front_page_about_fullheight' ) ) {
		echo ' rook-full-height sc_layouts_flex sc_layouts_columns_middle';
	}
	?>
			"
			<?php
			$rook_css           = '';
			$rook_bg_mask       = rook_get_theme_option( 'front_page_about_bg_mask' );
			$rook_bg_color_type = rook_get_theme_option( 'front_page_about_bg_color_type' );
			if ( 'custom' == $rook_bg_color_type ) {
				$rook_bg_color = rook_get_theme_option( 'front_page_about_bg_color' );
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
		<div class="front_page_section_content_wrap front_page_section_about_content_wrap content_wrap">
			<?php
			// Caption
			$rook_caption = rook_get_theme_option( 'front_page_about_caption' );
			if ( ! empty( $rook_caption ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				?>
				<h2 class="front_page_section_caption front_page_section_about_caption front_page_block_<?php echo ! empty( $rook_caption ) ? 'filled' : 'empty'; ?>"><?php echo wp_kses( $rook_caption, 'rook_kses_content' ); ?></h2>
				<?php
			}

			// Description (text)
			$rook_description = rook_get_theme_option( 'front_page_about_description' );
			if ( ! empty( $rook_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				?>
				<div class="front_page_section_description front_page_section_about_description front_page_block_<?php echo ! empty( $rook_description ) ? 'filled' : 'empty'; ?>"><?php echo wp_kses( wpautop( $rook_description ), 'rook_kses_content' ); ?></div>
				<?php
			}

			// Content
			$rook_content = rook_get_theme_option( 'front_page_about_content' );
			if ( ! empty( $rook_content ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				?>
				<div class="front_page_section_content front_page_section_about_content front_page_block_<?php echo ! empty( $rook_content ) ? 'filled' : 'empty'; ?>">
					<?php
					$rook_page_content_mask = '%%CONTENT%%';
					if ( strpos( $rook_content, $rook_page_content_mask ) !== false ) {
						$rook_content = preg_replace(
							'/(\<p\>\s*)?' . $rook_page_content_mask . '(\s*\<\/p\>)/i',
							sprintf(
								'<div class="front_page_section_about_source">%s</div>',
								apply_filters( 'the_content', get_the_content() )
							),
							$rook_content
						);
					}
					rook_show_layout( $rook_content );
					?>
				</div>
				<?php
			}
			?>
		</div>
	</div>
</div>
