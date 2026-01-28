<?php
/**
 * The template to display the copyright info in the footer
 *
 * @package ROOK
 * @since ROOK 1.0.10
 */

// Copyright area
?> 
<div class="footer_copyright_wrap">
	<div class="footer_copyright_inner">
		<div class="content_wrap">
			<div class="copyright_text">
				<?php
					$rook_copyright = rook_get_theme_option( 'copyright' );
					if ( ! empty( $rook_copyright ) ) {
						// Replace {{Y}} or {Y} with the current year
						$rook_copyright = str_replace( array( '{{Y}}', '{Y}' ), date( 'Y' ), $rook_copyright );
						// Replace {{...}} and ((...)) on the <i>...</i> and <b>...</b>
						$rook_copyright = rook_prepare_macros( $rook_copyright );
						// Display copyright
						echo wp_kses( nl2br( $rook_copyright ), 'rook_kses_content' );
					}
				?>
			</div>
		</div>
	</div>
</div>