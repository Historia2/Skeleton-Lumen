export const showProfile = () => dispatch => {
    dispatch({
        type: 'SHOW_PROFILE',
        payload: ''
    })
}

export const hideProfile = () => dispatch => {
    dispatch({
        type: 'HIDE_PROFILE',
        payload: ''
    })
}

export const toggleSidebar = () => dispatch => {
    dispatch({
        type: 'TOGGLE_SIDEBAR',
        payload: ''
    })
}
