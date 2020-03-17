import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { moneyFormatter } from 'components/helper';

HighchartsMore(Highcharts);

export default class Dashboard2 extends Component {
    componentDidMount() {
        const {data, title, xAxis} = this.props;
        this.drawChart(data, title, xAxis);
    }

    drawChart(data, title, xAxis) {
        Highcharts.chart({
            chart: {
                type: 'columnrange',
                inverted: false,
                renderTo: 'rangeChart',
                height: 440
            },
            title: {
                text: `${title}`,
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: xAxis,
                title: {
                    text: 'Plat Nomor'
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
            tooltip: {
                useHTML: true,
                formatter: function () {
                    const {high, low} = this.point;
                    console.log(this);
                    return (
                        `<span style="font-size:12px; font-weight: bold">Plat ${this.x}</span><table>` +
                        `<tr style="font-size: 14px">
                            <td style="padding:0">Harga Termahal </td><td> : Rp.</td>
                            <td style="padding:0px 2.5px; font-weight: bold">${moneyFormatter(high)}</td>
                        </tr>
                        <tr style="font-size: 14px">
                            <td style="padding:0">Harga Termurah </td><td> : Rp.</td>
                            <td style="padding:0px 2.5px; font-weight: bold">${moneyFormatter(low)}</td>
                        </tr></table>`
                    )
                }
            },
            legend: { enabled: false },
            credits: { enabled: false },
            series: [...data]
        });
    }


    render() {
        return (
            <div id={"rangeChart"} className="chart">
            </div>
        )
    }
}
