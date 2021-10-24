<?php
/**
 * @package Georonia_Block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace Geolonia_Block;

class Init {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Uninstallation process
		register_uninstall_hook( GEOLONIA_NAMESPACE, 'geolonia_block\Init::plugin_uninstall' );

		// Load classes
		$this->load_classes();
	}

	/**
	 * Uninstallation process
	 */
	public static function plugin_uninstall() {
		delete_option( GEOLONIA_OPTION_PREFIX . '_api_key' );
	}

	/**
	 * Load classes
	 */
	public function load_classes() {
		require_once( GEOLONIA_PATH . '/classes/class-enqueue.php' );
		require_once( GEOLONIA_PATH . '/classes/class-api.php' );
	}
}
