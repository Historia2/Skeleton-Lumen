import React, { Component } from 'react'
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

export default class Dashboard1 extends Component {
    componentDidMount() {
        const {data, title, xAxis} = this.props;
        this.drawChart(data, title, xAxis);
    }

    drawChart(data, title, xAxis) {
        // console.log(data);
        Highcharts.chart({
            chart: {
                type: 'column',
                renderTo: 'barChart',
                height: 440
            },
            title: {
                text: `${title}`,
            },
            subtitle: {
                text: '' 
            },
            xAxis: {
                categories: [...xAxis],
                crosshair: true,
                title: {
                    text: 'Plat Nomor'
                }
            },
            yAxis: [{
                title: { text: 'Jumlah Kendaraan' },
                labels: {    
                    formatter: function () {
                        return this.value+" Unit";
                    }
                }
            },{
                title: { text: 'Persentase' },
                opposite: true,
                linkedTo: 0,
                labels: {    
                    formatter: function () {
                        return this.value+"%";
                    }
                }
            }],
            tooltip: {
                useHTML: true,
                shared: true,
                formatter: function () {
                    let labels = '';
                    for(let i = 0; i < this.points.length; i++) {
                        const {point: {y}, series: {name}} = this.points[i]
                        labels += `<tr style="font-size: 14px">
                            <td style="padding:0">${name}</td><td> : </td>
                            <td style="padding:0px 2.5px; font-weight: bold">${y} ${name === 'Percentage' ? '%' : 'Unit' }</td>
                            </tr>`
                    }
                    return (
                        `<span style="font-size:12px; font-weight: bold">Plat ${this.x}</span><table>${labels}</tabel>`
                    )
                }
            },
            legend: { enabled: true },
            credits: { enabled: false },
            series: [...data]
        });
    }

    // componentDidUpdate(prevProps) {
    //     if(prevProps.data !== this.props.data && this.props.data.length >= 0){
    //         const {data, title, xAxis} = this.props;
    //         this.drawChart(data, title, xAxis);
    //     }
    // }

    render() {
        return (
            <div id={"barChart"} className="chart">
            </div>
        )
    }
}
