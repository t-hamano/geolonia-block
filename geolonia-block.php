<?php
/**
 * Plugin Name: Geolonia Block
 * Description: Embeds maps in a variety of styles with Geolonia Maps.
 * Version: 1.0.0
 * Author: Tetsuaki Hamano
 * Author URI: https://github.com/t-hamano
 * License: GPL2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: geolonia-block
 * @package geolonia-block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

defined( 'ABSPATH' ) || exit;

define( 'GEOLONIA_NAMESPACE', 'geolonia-block' );
define( 'GEOLONIA_OPTION_PREFIX', 'geolonia_block' );
define( 'GEOLONIA_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'GEOLONIA_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );

require_once __DIR__ . '/classes/class-init.php';

new geolonia_block\Init();
