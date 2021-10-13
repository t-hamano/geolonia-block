/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

// Custom store name.
export const STORE_NAME = 'geolonia-block';

// Rest API routes.
export const REST_API_ROUTE = '/geolonia-block/v1/option';

// Map settings options.
export const MAP_STYLE_CONTROLS = [
	{
		label: __( 'Basic', 'geolonia-block' ),
		value: 'geolonia/basic',
	},
	{
		label: __( 'Midnight', 'geolonia-block' ),
		value: 'geolonia/midnight',
	},
	{
		label: __( 'Red Planet', 'geolonia-block' ),
		value: 'geolonia/red-planet',
	},
	{
		label: __( 'Notebook', 'geolonia-block' ),
		value: 'geolonia/notebook',
	},
];

export const LANG_CONTROLS = [
	{
		label: __( 'Auto', 'geolonia-block' ),
		value: 'auto',
	},
	{
		label: __( 'English', 'geolonia-block' ),
		value: 'en',
	},
	{
		label: __( 'Japanese', 'geolonia-block' ),
		value: 'ja',
	},
];

export const DIRECTION_CONTROLS = [
	{
		label: __( 'Top Right', 'geolonia-block' ),
		value: 'top-right',
	},
	{
		label: __( 'Bottom Right', 'geolonia-block' ),
		value: 'bottom-right',
	},
	{
		label: __( 'Bottom Left', 'geolonia-block' ),
		value: 'bottom-left',
	},
	{
		label: __( 'Top Left', 'geolonia-block' ),
		value: 'top-left',
	},
];
