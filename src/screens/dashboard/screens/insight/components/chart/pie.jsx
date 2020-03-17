import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

export default class Pie extends Component {
    componentDidMount() {
        const {idx, data, metric} = this.props;
        this.drawChart(idx, data, metric);
    }

    drawChart(id, data, metric) {
        Highcharts.chart({
            chart: {
                type: 'pie',
                renderTo: id,
                height: 320
            },
            title: { text: '' },
            subtitle: { text: `Grafik ${metric}` },
            tooltip: {
                useHTML: true,
                formatter: function() {
                    return (
                        `<span style="font-size:12px; font-weight: bold">${this.point.name}</span><br />` +
                        `<span style="font-size:12px;">Unit Terjual : ${this.percentage.toFixed(2)}%</span>`
                    )
                }
            },
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500,
                    },
                }]
            },
            series: [{
                name: 'Brands',
                data: [...data],
                size: '85%',
                innerSize: '0%',
            }],
            legend: { enabled: true },
            credits: { enabled: false }
        });
    }
    
    componentDidUpdate(prevProps) {
        if(prevProps.data !== this.props.data && this.props.data.length >= 0){
            const {idx, data, metric} = this.props;
            this.drawChart(idx, data, metric);
        }
    }

    render() {
        return (
            <div id={this.props.idx} style={{height: '100%'}}>
            </div>
    )};
}