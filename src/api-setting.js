/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { Button, TextControl, Modal, Spinner, Notice, ExternalLink } from '@wordpress/components';
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

	const onChangeKey = ( value ) => {
		setApiKey( value );
	};

	const onRegisterKey = ( event ) => {
		event.preventDefault();
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
			<Button icon={ cog } isLink variant="link" onClick={ () => setIsModalopen( true ) }>
				{ __( 'Register API key', 'geolonia-block' ) }
			</Button>
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
					<form className="geolonia-setting-modal__form" onSubmit={ onRegisterKey }>
						<TextControl
							className="geolonia-setting-modal__input"
							autoComplete="off"
							placeholder={ __( 'Enter your API key…', 'geolonia-block' ) }
							onChange={ onChangeKey }
						/>
						<Button
							className="geolonia-setting-modal__button"
							isPrimary
							variant="primary"
							type="submit"
						>
							{ __( 'Register' ) }
						</Button>
					</form>
					<div className="geolonia-setting-modal__link">
						<ExternalLink
							href={ __( 'https://docs.geolonia.com/tutorial/002/', 'geolonia-block' ) }
						>
							{ __( 'About obtaining Geolonia Map API key', 'geolonia-block' ) }
						</ExternalLink>
					</div>
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
				</Modal>
			) }
		</>
	);
}
