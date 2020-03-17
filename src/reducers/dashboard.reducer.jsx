export default (state = {
    isProfileOpen: 0
}, action) => {
    switch (action.type) {
        case 'SHOW_PROFILE': 
            return { 
                ...state,
                isProfileOpen: true
            }
        case 'HIDE_PROFILE':
            return { 
                ...state,
                isProfileOpen: false 
            }
        case 'TOGGLE_SIDEBAR':
            return { 
                ...state,
                isSidebarActive: !state.isSidebarActive 
            }
        default:
            return state
    }
}