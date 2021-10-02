/**
 * External dependencies
 */
import { GeoloniaMap } from '@geolonia/embed-react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { STORE_NAME } from './store';

export default function Edit() {
	const storeOption = useSelect( ( select ) => {
		return select( STORE_NAME ).getOption();
	} );

	const [ apiKey, setApiKey ] = useState();

	useEffect( () => {
		setApiKey( storeOption );
	}, [ storeOption ] );

	const blockProps = useBlockProps();

	if ( ! apiKey ) {
		return (
			<div { ...blockProps }>
				<p>{ __( 'Please register API Key.', 'geolonia-block' ) }</p>
			</div>
		);
	}

	return (
		<div { ...blockProps }>
			<GeoloniaMap
				apiKey={ apiKey }
				className="wp-block-geolonia__map"
				style={ { height: '500px', width: '100%' } }
				lat="35.681236"
				lng="139.767125"
				zoom="16"
				render3d="on"
			/>
		</div>
	);
}
