/*
 src/reducers/simple-reducer.js
*/

export default (state = {
    widgets: [],
    widgetsData: {}
}, action) => {
    switch (action.type) {
        case 'ADD_WIDGET':
            return {
                ...state,
                widgets: [
                    ...state.widgets,
                    action.payload
                ]
            };
        case 'UPDATE_WIDGET':
            return {
                ...state,
                widgets: [
                    ...action.payload
                ]
            };
        case 'UPDATE_WIDGET_DATA':
            return {
                ...state,
                widgetsData: {
                    ...state.widgetsData,
                    ...action.payload
                }
            };
        default:
            return state
    }
}