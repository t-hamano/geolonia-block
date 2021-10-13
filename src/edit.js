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
import apiFetch from '@wordpress/api-fetch';
import {
	Placeholder,
	TextControl,
	SelectControl,
	RangeControl,
	Button,
	ExternalLink,
	PanelBody,
	ToggleControl,
	BaseControl,
} from '@wordpress/components';
import { mapMarker as icon } from '@wordpress/icons';
import { BlockIcon, InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';
import { STORE_NAME } from './store';
import { REST_API_ROUTE, MAP_STYLE_CONTROLS, LANG_CONTROLS, DIRECTION_CONTROLS } from './constants';

export default function Edit( { attributes, setAttributes } ) {
	const {
		useRender,
		mapStyle,
		render3d,
		pitch,
		zoom,
		minZoom,
		maxZoom,
		bearing,
		lang,
		geoloniaControl,
		navigationControl,
		geolocateControl,
		fullscreenControl,
		scaleControl,
		gestureHandling,
		loader,
		lazyLoading,
	} = attributes;

	const storeOption = useSelect( ( select ) => {
		return select( STORE_NAME ).getOption();
	} );

	const [ apiKey, setApiKey ] = useState();
	const [ isRender, setIsRender ] = useState( true );

	useEffect( () => {
		setApiKey( storeOption );
	}, [ storeOption ] );

	// Adjust minZoom value so that it does not exceed the value of maxZoom value.
	useEffect( () => {
		const newMaxZoom = minZoom ? Math.max( minZoom, maxZoom ) : maxZoom;
		setAttributes( { maxZoom: newMaxZoom } );
	}, [ minZoom ] );

	useEffect( () => {
		const newMinZoom = maxZoom ? Math.min( minZoom, maxZoom ) : minZoom;
		setAttributes( { minZoom: newMinZoom } );
	}, [ maxZoom ] );

	// Register API key.
	const onRegisterKey = ( event ) => {
		event.preventDefault();
		apiFetch( {
			path: REST_API_ROUTE,
			method: 'POST',
			data: { apiKey },
		} ).then( () => {} );
	};

	// Force components to be re-rendered.
	const onRenderMap = () => {
		setIsRender( false );
		setTimeout( () => {
			setIsRender( true );
		}, 10 );
	};

	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			{ ! apiKey ? (
				<Placeholder
					className="wp-block-geolonia-block__placeholder"
					label={ __( 'Geolonia Block', 'geolonia-block' ) }
					icon={ <BlockIcon icon={ icon } showColors /> }
				>
					<p>{ __( 'Please register API key.', 'geolonia-block' ) }</p>
					<form className="wp-block-geolonia-block__placeholder-form" onSubmit={ onRegisterKey }>
						<TextControl
							className="wp-block-geolonia-block__placeholder-input"
							autoComplete="off"
							placeholder={ __( 'Enter your API key…', 'geolonia-block' ) }
						/>
						<Button
							className="wp-block-geolonia-block__placeholder-button"
							isPrimary
							variant="primary"
							type="submit"
						>
							{ __( 'Register' ) }
						</Button>
					</form>
					<ExternalLink
						className="wp-block-geolonia-block__placeholder-link"
						href={ __( 'https://docs.geolonia.com/tutorial/002/', 'geolonia-block' ) }
					>
						{ __( 'About obtaining Geolonia Map API key', 'geolonia-block' ) }
					</ExternalLink>
				</Placeholder>
			) : (
				<>
					<InspectorControls>
						<PanelBody title={ __( 'Map Settings', 'geolonia-block' ) } initialOpen={ true }>
							<p className="geolonia-inspector-controls-help">
								{ __(
									'Note: Click on "Apply Settings" to reflect items other than Map Style and Zoom Level. ',
									'geolonia-block'
								) }
							</p>
							<ToggleControl
								label={ __( 'Enable map rendering', 'geolonia-block' ) }
								checked={ useRender }
								onChange={ ( value ) => setAttributes( { useRender: !! value } ) }
							/>
							<BaseControl
								id="geolonia-block/map-style"
								label={ __( 'Map Style', 'geolonia-block' ) }
							>
								<SelectControl
									value={ mapStyle }
									options={ MAP_STYLE_CONTROLS.map( ( { label, value } ) => {
										return { label, value };
									} ) }
									onChange={ ( value ) => setAttributes( { mapStyle: value } ) }
								/>
							</BaseControl>
							<BaseControl id="geolonia-block/pitch" label={ __( 'Pitch', 'geolonia-block' ) }>
								<RangeControl
									value={ pitch }
									onChange={ ( value ) => {
										const pitchValue = Math.min( Math.max( value, 0 ), 60 );
										setAttributes( { pitch: pitchValue } );
									} }
									initialPosition={ 0 }
									min={ 0 }
									max={ 60 }
								/>
							</BaseControl>
							<BaseControl id="geolonia-block/zoom" label={ __( 'Zoom Level', 'geolonia-block' ) }>
								<RangeControl
									value={ zoom }
									onChange={ ( value ) => {
										const zoomValue = Math.min( Math.max( value, 0 ), 24 );
										setAttributes( { zoom: zoomValue } );
									} }
									initialPosition={ 0 }
									min={ 0 }
									max={ 24 }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-block/min-zoom"
								label={ __( 'Min Zoom Level', 'geolonia-block' ) }
							>
								<RangeControl
									value={ minZoom }
									allowReset
									min={ 0 }
									max={ 24 }
									onChange={ ( value ) => {
										const minZoomValue = value ? Math.min( Math.max( value, 0 ), 24 ) : undefined;
										setAttributes( { minZoom: minZoomValue } );
									} }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-block/max-zoom"
								label={ __( 'Max Zoom Level', 'geolonia-block' ) }
							>
								<RangeControl
									value={ maxZoom }
									allowReset
									min={ 0 }
									max={ 24 }
									onChange={ ( value ) => {
										const maxZoomValue = value ? Math.min( Math.max( value, 0 ), 24 ) : undefined;
										setAttributes( { maxZoom: maxZoomValue } );
									} }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-block/bearing"
								label={ __( 'Direction', 'geolonia-block' ) }
							>
								<RangeControl
									value={ bearing }
									allowReset
									min={ 0 }
									max={ 359 }
									onChange={ ( value ) => {
										const bearingValue = value ? Math.min( Math.max( value, 0 ), 359 ) : undefined;
										setAttributes( { bearing: bearingValue } );
									} }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-block/geolonia-control"
								label={ __( 'Logo Positon', 'geolonia-block' ) }
							>
								<SelectControl
									value={ geoloniaControl }
									options={ DIRECTION_CONTROLS.map( ( { label, value } ) => {
										return { value, label };
									} ) }
									onChange={ ( value ) => setAttributes( { geoloniaControl: value } ) }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-block/navigation-control"
								label={ __( 'Navigation Control Positon', 'geolonia-block' ) }
							>
								<SelectControl
									value={ navigationControl }
									options={ [
										...DIRECTION_CONTROLS.map( ( { label, value } ) => {
											return { value, label };
										} ),
										{ label: __( 'Off', 'geolonia-block' ), value: 'off' },
									] }
									onChange={ ( value ) => setAttributes( { navigationControl: value } ) }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-block/geolocation-control"
								label={ __( 'Geolocation Control Positon', 'geolonia-block' ) }
							>
								<SelectControl
									value={ geolocateControl }
									options={ [
										...DIRECTION_CONTROLS.map( ( { label, value } ) => {
											return { value, label };
										} ),
										{ label: __( 'Off', 'geolonia-block' ), value: 'off' },
									] }
									onChange={ ( value ) => setAttributes( { geolocateControl: value } ) }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-block/fullscreen-control"
								label={ __( 'Fullscreen Control Positon', 'geolonia-block' ) }
							>
								<SelectControl
									value={ fullscreenControl }
									options={ [
										...DIRECTION_CONTROLS.map( ( { label, value } ) => {
											return { value, label };
										} ),
										{ label: __( 'Off', 'geolonia-block' ), value: 'off' },
									] }
									onChange={ ( value ) => setAttributes( { fullscreenControl: value } ) }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-block/scale-control"
								label={ __( 'Scale Control Positon', 'geolonia-block' ) }
							>
								<SelectControl
									value={ scaleControl }
									options={ [
										...DIRECTION_CONTROLS.map( ( { label, value } ) => {
											return { value, label };
										} ),
										{ label: __( 'Off', 'geolonia-block' ), value: 'off' },
									] }
									onChange={ ( value ) => setAttributes( { scaleControl: value } ) }
								/>
							</BaseControl>
							<BaseControl id="geolonia-block/lang" label={ __( 'Language', 'geolonia-block' ) }>
								<SelectControl
									value={ lang }
									options={ DIRECTION_CONTROLS.map( ( { label, value } ) => {
										return { value, label };
									} ) }
									onChange={ ( value ) => setAttributes( { lang: value } ) }
								/>
							</BaseControl>
							<ToggleControl
								label={ __( 'Forces operation with alt key or two fingers', 'geolonia-block' ) }
								checked={ gestureHandling }
								onChange={ ( value ) => setAttributes( { gestureHandling: !! value } ) }
							/>
							<ToggleControl
								label={ __( '3D Rendering', 'geolonia-block' ) }
								checked={ render3d }
								onChange={ ( value ) => setAttributes( { render3d: !! value } ) }
							/>
							<ToggleControl
								label={ __( 'Enable Loading Animation', 'geolonia-block' ) }
								checked={ loader }
								onChange={ ( value ) => setAttributes( { loader: !! value } ) }
							/>
							<ToggleControl
								label={ __( 'Enable Lazy Loading', 'geolonia-block' ) }
								checked={ lazyLoading }
								onChange={ ( value ) => setAttributes( { lazyLoading: !! value } ) }
							/>
							{ useRender && (
								<Button isPrimary variant="primary" onClick={ onRenderMap }>
									{ __( 'Apply Settings', 'geolonia-block' ) }
								</Button>
							) }
						</PanelBody>
					</InspectorControls>
					{ useRender ? (
						<>
							{ isRender && (
								<GeoloniaMap
									apiKey={ apiKey }
									className="wp-block-geolonia-block__map"
									mapStyle={ mapStyle }
									style={ { height: '500px', width: '100%' } }
									lat="35.681236"
									lng="139.767125"
									zoom={ zoom }
									minZoom={ minZoom }
									maxZoom={ maxZoom }
									bearing={ bearing }
									gestureHandling={ gestureHandling ? 'on' : 'off' }
									render3d={ render3d ? 'on' : 'off' }
									pitch={ pitch }
									loader={ loader ? 'on' : 'off' }
									lang={ lang }
									geoloniaControl={ geoloniaControl }
									navigationControl={ navigationControl }
									geolocateControl={ geolocateControl }
									fullscreenControl={ fullscreenControl }
								/>
							) }
						</>
					) : (
						<Placeholder
							className="wp-block-geolonia-block__no-render"
							label={ __( 'Geolonia Block', 'geolonia-block' ) }
							icon={ <BlockIcon icon={ icon } showColors /> }
						>
							<p>
								{ __( 'Map rendering is disabled.', 'geolonia-block' ) }
								<br />
								{ __(
									'Turn on "Enable map rendering" in Map Setting to enable it.',
									'geolonia-block'
								) }
							</p>
						</Placeholder>
					) }
				</>
			) }
		</div>
	);
}
