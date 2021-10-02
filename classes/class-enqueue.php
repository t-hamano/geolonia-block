<?php
/**
 * @package geolonia-block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace geolonia_block;

class Enqueue {

	/**
	 * Constructor
	 */
	function __construct() {
		// Register block
		add_action( 'init', array( $this, 'register_block' ) );

		// Enqueue block-editor scripts
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );
	}

	/**
	 * Register block, scripts, styles
	 */
	public function register_block() {
		register_block_type(
			GEOLONIA_PATH . '/src',
			array(
				'editor_script' => GEOLONIA_NAMESPACE,
				'editor_style'  => GEOLONIA_NAMESPACE,
			)
		);
	}

	/**
	 * Enqueue block-editor styles
	 */
	public function enqueue_block_editor_assets() {
		$asset_file = include( GEOLONIA_PATH . '/build/index.asset.php' );

		wp_enqueue_style(
			GEOLONIA_NAMESPACE,
			GEOLONIA_URL . '/build/editor-style.css',
			array(),
			filemtime( GEOLONIA_PATH . '/build/editor-style.css' ),
		);

		wp_enqueue_script(
			GEOLONIA_NAMESPACE,
			GEOLONIA_URL . '/build/index.js',
			$asset_file['dependencies'],
			filemtime( GEOLONIA_PATH . '/build/index.js' ),
		);
	}
}

new Enqueue();
