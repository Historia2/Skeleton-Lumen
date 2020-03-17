/*
 src/reducers/simple-reducer.js
*/

export default (state = {}, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                result: action.payload
            }
        case 'UNSET_USER':
            return {
                result: {}
            }
        default:
            return state
    }
}