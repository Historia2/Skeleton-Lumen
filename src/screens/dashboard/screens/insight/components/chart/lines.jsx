import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { moneyFormatter } from 'components/helper';

HighchartsMore(Highcharts);

export default class Lines extends Component {

    constructor(props) {
        super(props);
        this.state = {
            series: {},
        };
    }

    componentDidMount() {
        const {idx, data, metric} = this.props;
        this.drawChart(idx, data, metric);
    }

    // componentDidUpdate(prevProps) {
    //     if(prevProps.data !== this.props.data && this.props.data.length >= 0){
    //         const {idx, data, metric} = this.props;
    //         this.drawChart(idx, data, metric);
    //     }
    // }

    drawChart(id, data, metric) {
        // const { title } = this.props;
        Highcharts.chart({
            chart: {
                renderTo: id,
                height: 320
            },
            title: { text: '' },
            subtitle: { text: `Grafik ${metric}` },
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
                }
            },
            tooltip: {
                shared: false,
                useHTML: true,
                formatter: function () {
                    return (`<span style="font-size:12px; font-weight: bold">${this.x} Bulan</span><table>` +
                        `<tr style="font-size: 14px">
                            <td style="padding:0">Harga</td>
                            <td style="padding:0px 5px;">:`+ moneyFormatter(this.y) +`</td>
                        </tr></table>`
                    )
                }
            },
            series: [...data],
            responsive:[],
            credits: { enabled: false },
        });
    }

    render() {

        return (
            <div id={this.props.idx}>
            </div>
        )
    }
}
