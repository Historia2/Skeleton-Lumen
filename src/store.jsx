/*
 * src/store.js
 * With initialState
*/

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

export default function configureStore(initialState = {}) {
    // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return createStore(rootReducer, initialState, composeWithDevTools(
        applyMiddleware(thunk)
    ));
    // return createStore(
    //     rootReducer,
    //     initialState,
    //     applyMiddleware(thunk),
    // );
}