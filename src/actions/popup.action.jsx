export const showPopUp = () => dispatch => {
    dispatch({
        type: 'SHOW_WIDGET_FORM',
        payload: ''
    })
}

export const hidePopUp = () => dispatch => {
    dispatch({
        type: 'HIDE_WIDGET_FORM',
        payload: ''
    })
}