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
	}

	/**
	 * Register block
	 */
	public function register_block() {
		register_block_type( GEOLONIA_PATH . '/src' );
	}
}

new Enqueue();
