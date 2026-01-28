<div class="front_page_section front_page_section_team<?php
	$rook_scheme = rook_get_theme_option( 'front_page_team_scheme' );
	if ( ! empty( $rook_scheme ) && ! rook_is_inherit( $rook_scheme ) ) {
		echo ' scheme_' . esc_attr( $rook_scheme );
	}
	echo ' front_page_section_paddings_' . esc_attr( rook_get_theme_option( 'front_page_team_paddings' ) );
	if ( rook_get_theme_option( 'front_page_team_stack' ) ) {
		echo ' sc_stack_section_on';
	}
?>"
		<?php
		$rook_css      = '';
		$rook_bg_image = rook_get_theme_option( 'front_page_team_bg_image' );
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
	$rook_anchor_icon = rook_get_theme_option( 'front_page_team_anchor_icon' );
	$rook_anchor_text = rook_get_theme_option( 'front_page_team_anchor_text' );
if ( ( ! empty( $rook_anchor_icon ) || ! empty( $rook_anchor_text ) ) && shortcode_exists( 'trx_sc_anchor' ) ) {
	echo do_shortcode(
		'[trx_sc_anchor id="front_page_section_team"'
									. ( ! empty( $rook_anchor_icon ) ? ' icon="' . esc_attr( $rook_anchor_icon ) . '"' : '' )
									. ( ! empty( $rook_anchor_text ) ? ' title="' . esc_attr( $rook_anchor_text ) . '"' : '' )
									. ']'
	);
}
?>
	<div class="front_page_section_inner front_page_section_team_inner
	<?php
	if ( rook_get_theme_option( 'front_page_team_fullheight' ) ) {
		echo ' rook-full-height sc_layouts_flex sc_layouts_columns_middle';
	}
	?>
			"
			<?php
			$rook_css      = '';
			$rook_bg_mask  = rook_get_theme_option( 'front_page_team_bg_mask' );
			$rook_bg_color_type = rook_get_theme_option( 'front_page_team_bg_color_type' );
			if ( 'custom' == $rook_bg_color_type ) {
				$rook_bg_color = rook_get_theme_option( 'front_page_team_bg_color' );
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
		<div class="front_page_section_content_wrap front_page_section_team_content_wrap content_wrap">
			<?php
			// Caption
			$rook_caption = rook_get_theme_option( 'front_page_team_caption' );
			if ( ! empty( $rook_caption ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				?>
				<h2 class="front_page_section_caption front_page_section_team_caption front_page_block_<?php echo ! empty( $rook_caption ) ? 'filled' : 'empty'; ?>"><?php echo wp_kses( $rook_caption, 'rook_kses_content' ); ?></h2>
				<?php
			}

			// Description (text)
			$rook_description = rook_get_theme_option( 'front_page_team_description' );
			if ( ! empty( $rook_description ) || ( current_user_can( 'edit_theme_options' ) && is_customize_preview() ) ) {
				?>
				<div class="front_page_section_description front_page_section_team_description front_page_block_<?php echo ! empty( $rook_description ) ? 'filled' : 'empty'; ?>"><?php echo wp_kses( wpautop( $rook_description ), 'rook_kses_content' ); ?></div>
				<?php
			}

			// Content (widgets)
			?>
			<div class="front_page_section_output front_page_section_team_output">
				<?php
				if ( is_active_sidebar( 'front_page_team_widgets' ) ) {
					dynamic_sidebar( 'front_page_team_widgets' );
				} elseif ( current_user_can( 'edit_theme_options' ) ) {
					if ( ! rook_exists_trx_addons() ) {
						rook_customizer_need_trx_addons_message();
					} else {
						rook_customizer_need_widgets_message( 'front_page_team_caption', 'ThemeREX Addons - Team' );
					}
				}
				?>
			</div>
		</div>
	</div>
</div>
