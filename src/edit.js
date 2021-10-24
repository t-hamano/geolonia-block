/**
 * External dependencies
 */
import { GeoloniaMap } from '@geolonia/embed-react';
import { normalize } from '@geolonia/normalize-japanese-addresses';
import prefactures from '../lib/japanese-prefectural-capitals/index.json';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import {
	BaseControl,
	Placeholder,
	TextControl,
	SelectControl,
	RangeControl,
	Button,
	ExternalLink,
	PanelBody,
	ToggleControl,
	Notice,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';
import { mapMarker as icon } from '@wordpress/icons';
import { BlockIcon, InspectorControls, useBlockProps } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import './editor.scss';
import { STORE_NAME } from './store';
import ApiSetting from './api-setting';
import {
	REST_API_ROUTE,
	MAP_STYLE_CONTROLS,
	LANG_CONTROLS,
	DIRECTION_CONTROLS,
	WIDTH_UNITS,
	HEIGHT_UNITS,
} from './constants';
import { ColorControl } from './components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		lat,
		lng,
		width,
		height,
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
		geoJsonUrl,
		cluster,
		clusterColor,
	} = attributes;

	const storeOption = useSelect( ( select ) => {
		return select( STORE_NAME ).getOption();
	} );

	const [ apiKey, setApiKey ] = useState();
	const [ isRender, setIsRender ] = useState( true );
	const [ searchAddress, setSearchAddress ] = useState( '' );
	const [ searchNotice, setSearchNotice ] = useState();

	const widthUnits = useCustomUnits( { availableUnits: WIDTH_UNITS } );
	const heightUnits = useCustomUnits( { availableUnits: HEIGHT_UNITS } );

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

	const onSearchLatLng = ( event ) => {
		event.preventDefault();
		if ( searchAddress === '' ) return;

		const notFoundText = __(
			'The location could not be determined. Please correct the address and try again.',
			'geolonia-block'
		);

		setSearchNotice( undefined );

		normalize( searchAddress )
			.then( ( json ) => {
				// Can't find latitude and longitude.
				if ( json.level === 0 ) {
					setSearchNotice( {
						status: 'error',
						text: notFoundText,
					} );
				} else if ( json.level === 1 ) {
					// Only the name of the prefecture can be determined (Normalization Level 1).
					if ( json.pref !== '' && prefactures[ json.pref ] ) {
						setAttributes( {
							lat: prefactures[ json.pref ].lat,
							lng: prefactures[ json.pref ].lng,
						} );
					}
				} else if ( json.level === 2 ) {
					// Only the name of the city can be determined (Normalization Level 2).
					// 市区町村名までしか判別できなかった場合(正規化レベル2)は、
					// @geolonia/jisx0402(https://github.com/geolonia/jisx0402)
					// を使って市区町村名から市区町村コードを取得し、
					// @geolonia/japanese-admins(https://github.com/geolonia/japanese-admins)
					// を使って市区町村コードから緯度・経度を取得しています。
				} else {
					setAttributes( {
						lat: json.lat,
						lng: json.lng,
					} );
				}
			} )
			.catch( () => {
				// Catch error.
				setSearchNotice( {
					status: 'error',
					text: notFoundText,
				} );
			} );
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
						<PanelBody title={ __( 'API Key Setting', 'geolonia-block' ) } initialOpen={ false }>
							<ApiSetting />
						</PanelBody>
						<PanelBody title={ __( 'Map Settings', 'geolonia-block' ) } initialOpen={ true }>
							<ToggleControl
								label={ __( 'Enable map rendering', 'geolonia-block' ) }
								checked={ useRender }
								onChange={ ( value ) => setAttributes( { useRender: !! value } ) }
							/>
							<BaseControl id="geolonia-map-width" label={ __( 'Map Width', 'geolonia-block' ) }>
								<UnitControl
									value={ width }
									units={ widthUnits }
									onChange={ ( value ) => setAttributes( { width: value } ) }
								/>
							</BaseControl>
							<BaseControl id="geolonia-map-height" label={ __( 'Map Height', 'geolonia-block' ) }>
								<UnitControl
									value={ height }
									units={ heightUnits }
									onChange={ ( value ) => setAttributes( { height: value } ) }
								/>
							</BaseControl>
							<BaseControl id="geolonia-map-style" label={ __( 'Map Style', 'geolonia-block' ) }>
								<SelectControl
									value={ mapStyle }
									options={ MAP_STYLE_CONTROLS.map( ( { label, value } ) => ( {
										label,
										value,
									} ) ) }
									onChange={ ( value ) => setAttributes( { mapStyle: value } ) }
								/>
							</BaseControl>
							<RangeControl
								label={ __( 'Pitch', 'geolonia-block' ) }
								value={ pitch }
								onChange={ ( value ) => {
									const pitchValue = Math.min( Math.max( value, 0 ), 60 );
									setAttributes( { pitch: pitchValue } );
								} }
								initialPosition={ 0 }
								min={ 0 }
								max={ 60 }
							/>
							<RangeControl
								label={ __( 'Zoom Level', 'geolonia-block' ) }
								value={ zoom }
								onChange={ ( value ) => {
									const zoomValue = Math.min( Math.max( value, 0 ), 24 );
									setAttributes( { zoom: zoomValue } );
								} }
								initialPosition={ 0 }
								min={ 0 }
								max={ 24 }
							/>
							<RangeControl
								label={ __( 'Min Zoom Level', 'geolonia-block' ) }
								value={ minZoom }
								allowReset
								min={ 0 }
								max={ 24 }
								onChange={ ( value ) => {
									const minZoomValue = value ? Math.min( Math.max( value, 0 ), 24 ) : undefined;
									setAttributes( { minZoom: minZoomValue } );
								} }
							/>
							<RangeControl
								label={ __( 'Max Zoom Level', 'geolonia-block' ) }
								value={ maxZoom }
								allowReset
								min={ 0 }
								max={ 24 }
								onChange={ ( value ) => {
									const maxZoomValue = value ? Math.min( Math.max( value, 0 ), 24 ) : undefined;
									setAttributes( { maxZoom: maxZoomValue } );
								} }
							/>
							<RangeControl
								label={ __( 'Direction', 'geolonia-block' ) }
								value={ bearing }
								allowReset
								min={ 0 }
								max={ 359 }
								onChange={ ( value ) => {
									const bearingValue = value ? Math.min( Math.max( value, 0 ), 359 ) : undefined;
									setAttributes( { bearing: bearingValue } );
								} }
							/>
							<BaseControl
								id="geolonia-geolonia-control"
								label={ __( 'Logo Positon', 'geolonia-block' ) }
							>
								<SelectControl
									value={ geoloniaControl }
									options={ DIRECTION_CONTROLS.map( ( { label, value } ) => ( {
										value,
										label,
									} ) ) }
									onChange={ ( value ) => setAttributes( { geoloniaControl: value } ) }
								/>
							</BaseControl>
							<BaseControl id="geolonia-map-style" label={ __( 'Map Style', 'geolonia-block' ) }>
								<SelectControl
									id="geolonia-block-navigation-control"
									value={ navigationControl }
									options={ [
										{ label: __( 'Off', 'geolonia-block' ), value: 'off' },
										...DIRECTION_CONTROLS.map( ( { label, value } ) => ( {
											value,
											label,
										} ) ),
									] }
									onChange={ ( value ) => setAttributes( { navigationControl: value } ) }
								/>
							</BaseControl>
							<BaseControl id="geolonia-map-style" label={ __( 'Map Style', 'geolonia-block' ) }>
								<SelectControl
									label={ __( 'Geolocation Control Positon', 'geolonia-block' ) }
									value={ geolocateControl }
									options={ [
										{ label: __( 'Off', 'geolonia-block' ), value: 'off' },
										...DIRECTION_CONTROLS.map( ( { label, value } ) => {
											return { value, label };
										} ),
									] }
									onChange={ ( value ) => setAttributes( { geolocateControl: value } ) }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-fullscreen-control"
								label={ __( 'Fullscreen Control Positon', 'geolonia-block' ) }
							>
								<SelectControl
									value={ fullscreenControl }
									options={ [
										{ label: __( 'Off', 'geolonia-block' ), value: 'off' },
										...DIRECTION_CONTROLS.map( ( { label, value } ) => {
											return { value, label };
										} ),
									] }
									onChange={ ( value ) => setAttributes( { fullscreenControl: value } ) }
								/>
							</BaseControl>
							<BaseControl
								id="geolonia-scale-control"
								label={ __( 'Scale Control Positon', 'geolonia-block' ) }
							>
								<SelectControl
									value={ scaleControl }
									options={ [
										{ label: __( 'Off', 'geolonia-block' ), value: 'off' },
										...DIRECTION_CONTROLS.map( ( { label, value } ) => {
											return { value, label };
										} ),
									] }
									onChange={ ( value ) => setAttributes( { scaleControl: value } ) }
								/>
							</BaseControl>
							<BaseControl id="geolonia-language" label={ __( 'Language', 'geolonia-block' ) }>
								<SelectControl
									value={ lang }
									options={ LANG_CONTROLS.map( ( { label, value } ) => {
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
							<TextControl
								label={ __( 'GeoJSON', 'geolonia-block' ) }
								autoComplete="off"
								value={ geoJsonUrl }
								placeholder={ __( 'Enter GeoJSON file URL…', 'geolonia-block' ) }
								onChange={ ( value ) => setAttributes( { geoJsonUrl: value } ) }
							/>
							<ToggleControl
								label={ __( 'Enable Cluster', 'geolonia-block' ) }
								checked={ cluster }
								onChange={ ( value ) => setAttributes( { cluster: !! value } ) }
							/>
							<ColorControl
								label={ __( 'Clustor Color', 'geolonia-block' ) }
								value={ clusterColor }
								onChange={ ( value ) => setAttributes( { clusterColor: value } ) }
							/>
							<p className="geolonia-inspector-controls-help">
								{ __(
									'Note: Click on "Apply Settings" to reflect items other than Map Style and Zoom Level. ',
									'geolonia-block'
								) }
							</p>
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
								<>
									<form
										className="wp-block-geolonia-block__search-form"
										onSubmit={ onSearchLatLng }
									>
										<TextControl
											className="wp-block-geolonia-block__search-input"
											autoComplete="off"
											value={ searchAddress }
											placeholder={ __( 'Enter address.…', 'geolonia-block' ) }
											onChange={ ( value ) => setSearchAddress( value ) }
										/>
										<Button
											className="wp-block-geolonia-block__search-button"
											isPrimary
											variant="primary"
											type="submit"
										>
											{ __( 'Search' ) }
										</Button>
									</form>
									{ searchNotice?.text && (
										<Notice
											className="wp-block-geolonia-block__search-notice"
											status={ searchNotice.status }
										>
											{ searchNotice.text }
										</Notice>
									) }
									<div
										className="wp-block-geolonia-block__map-wrap"
										style={ {
											width,
											height,
										} }
									>
										<GeoloniaMap
											apiKey={ apiKey }
											className="wp-block-geolonia-block__map"
											mapStyle={ mapStyle }
											lat={ lat }
											lng={ lng }
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
											scaleControl={ scaleControl }
											geojson={ geoJsonUrl }
											cluster={ cluster ? 'on' : 'off' }
											clusterColor={ clusterColor }
										/>
									</div>
								</>
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
