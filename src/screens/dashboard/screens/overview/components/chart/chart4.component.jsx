import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { moneyFormatter } from 'components/helper'

HighchartsMore(Highcharts);

export default class Chart4 extends Component {
    componentDidMount() {
        this.renderChart();
    }

    componentDidUpdate(prevProps) {
        if(prevProps !== this.props && this.props.series.length > 0){
            this.renderChart();
        }
    }

    renderChart() {
        Highcharts.chart({
            chart: {
                renderTo: this.props.id || 'grafik-map-buyer4',
            },
            title: {
                text: this.props.title || 'Result'
            },
            subtitle: {
                text: 'Grafik Harga Terbentuk Berdasarkan Waktu'
            },
            xAxis: {
                title: 'Waktu',
                tickInterval: 1,
                labels: {
                    formatter: function () {
                        return this.value + ' Bulan';
                    }
                },
            },
            plotOptions: {
                series: { pointStart: 1 },
                yAxis: 1,
            },
            yAxis: {
                title: 'Harga Kendaraan',
                labels: {
                    formatter: function () {
                        return moneyFormatter(this.value);
                    }
                },
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
            },
            tooltip: {
                shared: false,
                useHTML: true,
                formatter: function () {
                    return (`<span style="font-size:12px; font-weight: bold">${this.x} Bulan</span><table>` +
                        `<tr style="font-size: 14px">
                            <td style="padding:0">Harga</td>
                            <td style="padding:0px 5px;">: `+ moneyFormatter(this.y) +`</td>
                        </tr></table>`
                    )
                }
            },
            responsive:[],
            credits: { enabled: false },
            series: [...this.props.series],
        });
    }

    render() {

        return (
            <div id={this.props.id || "highchart-buyer4"} className="chart">
            </div>
        )
    }
}


