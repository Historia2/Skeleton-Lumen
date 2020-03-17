export const updateAppProperty = (data) => dispatch => {
    dispatch({
        type: 'UPDATE_APP_PROPERTY',
        payload: data
    })
}
