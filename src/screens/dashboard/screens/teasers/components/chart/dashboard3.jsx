import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { moneyFormatter } from 'components/helper';

HighchartsMore(Highcharts);

export default class Dashboard3 extends Component {
    componentDidMount() {
        const {data, title} = this.props;
        this.drawChart(data, title);
    }

    drawChart(data, title) {
        Highcharts.chart({
            chart: {
                type: 'column',
                renderTo: 'lineChart',
                height: 440
            },
            title: {
                text: `${title}`,
            },
            subtitle: {
                text: '' 
            },
            xAxis: {
                labels: {
                    formatter: function () {
                        return this.value + ' Bulan';
                    }
                },
                crosshair: true,
                title: {
                    text: 'Periode'
                }
            },
            yAxis: {
                title: {
                    text: 'Harga Kendaraan'
                },
                labels: {
                    formatter: function () {
                        return moneyFormatter(this.value);
                    }
                }
            },
            plotOptions: {
                series: { pointStart: 1 },
                yAxis: 1,
            },
            tooltip: {
                useHTML: true,
                shared: true,
                formatter: function () {
                    let labels = '';
                    for(let i = 0; i < this.points.length; i++) {
                        const {point: {y}, series: {name}} = this.points[i]
                        labels += `<tr style="font-size: 14px">
                            <td style="padding:0">${name}</td><td> : Rp.</td>
                            <td style="padding:0px 2.5px; font-weight: bold">${moneyFormatter(y)}</td>
                            </tr>`
                    }
                    return (
                        `<span style="font-size:12px; font-weight: bold">${this.x} Bulan</span><table>${labels}</tabel>`
                    )
                }
            },
            legend: { enabled: true },
            credits: { enabled: false },
            series: [...data]
        });
    }

    render() {
        return (
            <div id={"lineChart"} className="chart">
            </div>
        )
    }
}
