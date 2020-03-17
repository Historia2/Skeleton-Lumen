import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { moneyFormatter } from 'components/helper';

HighchartsMore(Highcharts);

export default class Bar extends Component {
    componentDidMount() {
        const {idx, data, metric} = this.props;
        this.drawChart(idx, data, metric);
    }

    drawChart(id, data, metric) {
        Highcharts.chart({
            chart: {
                type: 'column',
                renderTo: id || 'barChart',
                height: 320 + (20 * data.length)
            },
            title: {
                text: '',
            },
            subtitle: {
                text: `Grafik ${metric}`
            },
            xAxis: { visible: false },
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
                formatter: function() {
                    const { y, series:{name} } = this.point;

                    return (
                        `<span style="font-size:12px; font-weight: bold">GRADE ${name}</span><br />` +
                        `<span style="font-size:12px;">Rp. ${moneyFormatter(y)}</span>`
                    )
                }
            },
            legend: { enabled: true },
            credits: { enabled: false },
            series:  [...data]
        });
    }

    // componentDidUpdate(prevProps) {
    //     if(prevProps.data !== this.props.data && this.props.data.length >= 0){
    //         const {idx, data, metric} = this.props;
    //         this.drawChart(idx, data, metric);
    //     }
    // }

    render() {
        return (
            <div id={this.props.idx || "barChart"} className="chart-container">
            </div>
        )
    }
}
