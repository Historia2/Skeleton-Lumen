import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { moneyFormatter } from 'components/helper';

HighchartsMore(Highcharts);

export default class Chart1 extends Component {
    componentDidMount() {
        this.renderChart();
    }

    renderChart() {
        const { id, title = 'Result', series } = this.props;
        Highcharts.chart({
            chart: {
                type: 'columnrange',
                renderTo: id || 'grafik-map-buyer1',
            },
            title: {
                text: title,
            },
            subtitle: {
                text: 'Harga Terbentuk (Min Max) Berdasarkan Kondisi Unit'
            },
            xAxis: {
                title: { text: 'Grade Kendaraan'},
                categories: ['A', 'B', 'C', 'D', 'E']
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
            tooltip: {
                headerFormat: '<span style="font-size:12px; font-weight: bold">GRADE {point.key}</span><table>',
                pointFormat: `<tr style="font-size: 14px">
                    <td style="padding:0">Harga Termurah</td>
                    <td style="padding:0px 5px;">: {point.low} Juta</td>
                </tr>
                <tr style="font-size: 14px">
                    <td style="padding:0">Harga Termahal</td>
                    <td style="padding:0px 5px;">: {point.high} Juta</td>
                </tr>`,
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                formatter: function () {
                    const {high, low} = this.points[0].point;
                    return (
                        `<span style="font-size:12px; font-weight: bold">GRADE ${this.x}</span><table>` +
                        `<tr style="font-size: 14px">
                            <td style="padding:0">Harga Termahal</td>
                            <td style="padding:0px 5px;">: ${moneyFormatter(high)}</td>
                        </tr>
                        <tr style="font-size: 14px">
                            <td style="padding:0">Harga Termurah</td>
                            <td style="padding:0px 5px;">: ${moneyFormatter(low)}</td>
                        </tr></table>`
                    )
                }
            },
            responsive:[],
            credits: { enabled: false },
            legend: { enabled: false },
            series: [ ...series ]
        });
    }

    render() {
        return (
            <div id={this.props.id || "grafik-map-buyer1"} className="chart">
            </div>
        )
    }
}

