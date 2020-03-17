export const updateData = (data) => dispatch => {
    dispatch({
        type: 'UPDATE_OVERVIEW_DATA',
        payload: data
    })
}
