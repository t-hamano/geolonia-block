/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { registerStore } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME, REST_API_ROUTE } from './constants';

const DEFAULT_STATE = {
	option: null,
};

const actions = {
	getOption( path ) {
		return {
			type: 'GET_OPTION',
			path,
		};
	},
	setOption( options ) {
		return {
			type: 'SET_OPTION',
			options,
		};
	},
};

const reducer = ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case 'SET_OPTION': {
			return {
				...state,
				options: action.options,
			};
		}
		default: {
			return state;
		}
	}
};

const selectors = {
	getOption( state ) {
		const { options } = state;
		return options;
	},
};

const controls = {
	GET_OPTION( action ) {
		return apiFetch( { path: action.path } );
	},
};

const resolvers = {
	*getOption() {
		const options = yield actions.getOption( REST_API_ROUTE );
		return actions.setOption( options );
	},
};

registerStore( STORE_NAME, {
	reducer,
	controls,
	selectors,
	resolvers,
	actions,
} );

export { STORE_NAME };
