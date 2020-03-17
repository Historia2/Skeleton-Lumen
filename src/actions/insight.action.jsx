export const addWidget = (data) => dispatch => {
    dispatch({
        type: 'ADD_WIDGET',
        payload: data
    })
}

export const updateWidget = (data) => dispatch => {
    dispatch({
        type: 'UPDATE_WIDGET',
        payload: data
    })
}

export const updateWidgetData = (data) => dispatch => {
    dispatch({
        type: 'UPDATE_WIDGET_DATA',
        payload: data
    })
}
