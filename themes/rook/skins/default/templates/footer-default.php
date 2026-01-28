<?php
/**
 * The template to display default site footer
 *
 * @package ROOK
 * @since ROOK 1.0.10
 */

?>
<footer class="footer_wrap footer_default">
	<?php
	// Footer widgets area
	get_template_part( apply_filters( 'rook_filter_get_template_part', 'templates/footer-widgets' ) );
	// Copyright area
	get_template_part( apply_filters( 'rook_filter_get_template_part', 'templates/footer-copyright' ) );
	?>
</footer>