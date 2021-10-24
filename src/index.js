/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { mapMarker as icon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './style.scss';
import './store';
import metadata from './block.json';
import edit from './edit';

// Register block.
registerBlockType( metadata.name, {
	icon,
	edit,
	save: () => null,
} );
