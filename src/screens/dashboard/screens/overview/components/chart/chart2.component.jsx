import React, { Component } from 'react';
import Highcharts from 'highcharts';
import { moneyFormatter } from 'components/helper';

//Load Module
require('highcharts/highcharts-more')(Highcharts);

export default class Chart2 extends Component {
    componentDidMount() {
        this.renderChart();
    }

    renderChart() {
        const { id, title = 'Result', series } = this.props;
        Highcharts.chart({
            chart: {
                type: 'columnrange',
                inverted: false,
                renderTo: id || 'highchart-buyer2',
            },
            title: {
                text: title || 'Result',
            },
            subtitle: {
                text: 'Harga Terbentuk (Min Max) Berdasarkan Tipe per Tahun'
            },
            xAxis: {
                title: {
                    text: 'Grade'
                },
                categories: ['A', 'B', 'C', 'D', 'E'],
                crosshair: true
            },
            yAxis: {
                title: {
                    text: 'Harga Terjual'
                },
                labels: {
                    formatter: function () {
                        return moneyFormatter(this.value);
                    }
                }
            },
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: function () {
                    const { key } = this.points[0];
                    let labels = '';
                    for(let i = 0; i < this.points.length; i++) {
                        const {color, point: {high, low}, series: {name}} = this.points[i]
                        labels += `<tr style="font-size: 14px">
                            <td style="color: ${color}">Tahun ${name}</td>
                            <td style="padding:0px 5px;">: ${moneyFormatter(low)} - ${moneyFormatter(high)}</td>
                            </tr>`
                    }
                    return (
                        `<span style="font-size:14px; font-weight: bold">GRADE ${key}</span>
                        <table>${labels}</table>`
                    )
                }
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500,
                    },
                }]
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series:{
                    lineWidth: '1',
                },
            },
        
            series: [...series]
        });
    }

    render() {
        return (
            <div id={this.props.id || "highchart-buyer2"} className="chart">
            </div>
        );
    };
}