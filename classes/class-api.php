<?php
/**
 * @package Georonia_Block
 * @author Tetsuaki Hamano
 * @license GPL-2.0+
 */

namespace Georonia_Block;

class Api {

	/**
	 * Constructor
	 */
	public function __construct() {
		// Register REST API route
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Register REST API route
	 */
	public function register_routes() {

		register_rest_route(
			GEOLONIA_NAMESPACE . '/v1',
			'/option',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => function () {
						$api_key = get_option( GEOLONIA_OPTION_PREFIX . '_api_key', null );
						return rest_ensure_response( $api_key );
					},
					'permission_callback' => function () {
						return current_user_can( 'administrator' );
					},
				),
				array(
					'methods'             => 'POST',
					'callback'            => function ( $request ) {
						$params = $request->get_json_params();
						update_option( GEOLONIA_OPTION_PREFIX . '_api_key', $params['apiKey'] );

						return rest_ensure_response(
							array(
								'status'  => 'success',
								'message' => __( 'Setting saved.', 'geolonia-block' ),
							)
						);
					},
					'permission_callback' => function () {
						return current_user_can( 'administrator' );
					},
				),
			)
		);
	}
}

new Api();
