import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    previewContainer: {
        maxHeight: '100vh',
        overflowY: 'auto',
        backgroundColor: '#f1f1f1'
    },
    containerFluid: {
        width: '100%',
        paddingRight: '15px',
        paddingLeft: '15px',
        marginRight: 'auto',
        marginLeft: 'auto',
    },

});
