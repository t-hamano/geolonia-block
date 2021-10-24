<?php
/**
 * @package Georonia_Block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace Georonia_Block;

class Enqueue {

	/**
	 * Constructor
	 */
	function __construct() {
		// Register block & scripts.
		add_action( 'init', array( $this, 'register_block' ) );
	}

	/**
	 * Register block & scripts
	 */
	public function register_block() {
		register_block_type(
			GEOLONIA_PATH . '/src',
			array(
				'style'         => GEOLONIA_NAMESPACE,
				'editor_script' => GEOLONIA_NAMESPACE,
			)
		);

		if ( is_admin() ) {
			wp_register_style(
				GEOLONIA_NAMESPACE,
				GEOLONIA_URL . '/build/index.css',
				array( 'wp-components' ),
				filemtime( GEOLONIA_PATH . '/build/index.css' ),
			);
		} else {
			wp_register_style(
				GEOLONIA_NAMESPACE,
				GEOLONIA_URL . '/build/style-index.css',
				array(),
				filemtime( GEOLONIA_PATH . '/build/style-index.css' ),
			);
		}

		$asset_file = include( GEOLONIA_PATH . '/build/index.asset.php' );

		wp_register_script(
			GEOLONIA_NAMESPACE,
			GEOLONIA_URL . '/build/index.js',
			$asset_file['dependencies'],
			filemtime( GEOLONIA_PATH . '/build/index.js' ),
		);

		// Load translated strings.
		wp_set_script_translations( GEOLONIA_NAMESPACE, GEOLONIA_NAMESPACE );
	}
}

new Enqueue();
