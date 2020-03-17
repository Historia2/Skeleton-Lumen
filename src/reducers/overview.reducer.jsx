/*
 src/reducers/overview.reducer.js
*/

export default (state = {
    chartData:{
        chart1: {},
        chart2: {},
        chart3: {},
        chart4: {},
 /*     
        chart1: {
            title: 'title',
            series: [{
                < data >
            }]
        } 
*/
    } 
}, action) => {
    switch (action.type) {
        case 'UPDATE_OVERVIEW_DATA':
            return {
                ...state,
                chartData: {
                    ...state.chartData,
                    ...action.payload
                }
            };
        default:
            return state
    }
}