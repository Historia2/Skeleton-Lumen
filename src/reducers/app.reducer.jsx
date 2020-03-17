/*
 src/reducers/simple-reducer.js
*/

export default (state = {
    options: undefined
}, action) => {
    switch (action.type) {
        case 'UPDATE_APP_PROPERTY':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}