/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, Modal, Spinner, Notice } from '@wordpress/components';
import { cog } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { STORE_NAME, REST_API_ROUTE } from './constants';

export default function ApiSetting() {
	const storeOption = useSelect( ( select ) => {
		return select( STORE_NAME ).getOption();
	} );

	const [ isModalOpen, setIsModalopen ] = useState( false );
	const [ notice, setNotice ] = useState();
	const [ isWaiting, setIsWaiting ] = useState( false );
	const [ apiKey, setApiKey ] = useState( storeOption );

	const { setOption } = useDispatch( STORE_NAME );

	useEffect( () => {
		setNotice();
	}, [ isModalOpen ] );

	const handleUpdateOption = () => {
		setIsWaiting( true );
		setNotice();
		setOption( apiKey );

		apiFetch( {
			path: REST_API_ROUTE,
			method: 'POST',
			data: { apiKey },
		} )
			.then( ( response ) => {
				document.querySelector( '.geolonia-setting-modal' ).focus();

				setIsWaiting( false );
				setNotice( {
					status: response.status,
					message: response.message,
				} );
			} )
			.catch( ( response ) => {
				document.querySelector( '.geolonia-setting-modal' ).focus();

				setIsWaiting( false );
				setNotice( {
					status: 'error',
					message: response.message,
				} );
			} );
	};

	return (
		<>
			<div className="geolonia-setting">
				<Button
					className="geolonia-setting-button"
					icon={ cog }
					isLink
					iconSize="20"
					onClick={ () => {
						setIsModalopen( true );
					} }
				>
					{ __( 'Register API Key', 'geolonia-block' ) }
				</Button>
			</div>
			{ isModalOpen && (
				<Modal
					title={ __( 'Register API Key', 'geolonia-block' ) }
					className="geolonia-setting-modal"
					onRequestClose={ () => setIsModalopen( false ) }
				>
					{ isWaiting && (
						<div className="geolonia-setting-modal__loading">
							<Spinner />
						</div>
					) }
					<TextControl
						placeholder={ __( 'Paste API Key', 'geolonia-block' ) }
						value={ apiKey }
						onChange={ ( value ) => setApiKey( value ) }
					/>
					{ notice?.status && notice?.message && (
						<Notice
							className="geolonia-setting-modal__notice"
							status={ notice.status }
							onRemove={ () => {
								setNotice();
								document.querySelector( '.geolonia-setting-modal' ).focus();
							} }
						>
							{ notice.message }
						</Notice>
					) }
					<div className="geolonia-setting-modal__control">
						<Button isPrimary disabled={ isWaiting } onClick={ handleUpdateOption }>
							{ __( 'Save', 'geolonia-block' ) }
						</Button>
					</div>
				</Modal>
			) }
		</>
	);
}
