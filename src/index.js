/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { mapMarker as icon } from '@wordpress/icons';
import { InspectorControls } from '@wordpress/block-editor';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import './style.scss';
import './store';
import metadata from './block.json';
import edit from './edit';
import ApiSetting from './api-setting';

// Register block.
registerBlockType( metadata.name, {
	icon,
	edit,
	save: () => null,
} );

// Add Global Setting to InspectorControls.
const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { name, isSelected } = props;

		if ( name !== 'geolonia-block/map' || ! isSelected ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<InspectorControls>
					<ApiSetting />
				</InspectorControls>
				<BlockEdit { ...props } />
			</>
		);
	};
}, 'withInspectorControl' );
addFilter( 'editor.BlockEdit', 'geolonia-block/withInspectorControls', withInspectorControls );
