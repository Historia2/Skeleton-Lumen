/*
 src/reducers/simple-reducer.js
*/

export default (state = {}, action) => {
    switch (action.type) {
        case 'SHOW_WIDGET_FORM':
            return { isOpen: true }
        case 'HIDE_WIDGET_FORM':
            return { isOpen: false }

        default:
            return state
    }
}