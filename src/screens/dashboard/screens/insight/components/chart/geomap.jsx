import React, { Component } from 'react';
import * as Highcharts from 'highcharts/highmaps';
import { ID_ALL } from 'constant';
import { moneyParser, moneyFormatter } from 'components/helper';


export default class Geomap extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        const {idx, data, metric} = this.props;
        this.drawChart(idx, data, metric);
    }

    drawChart(id, data, metric) {
        Highcharts.mapChart({
            chart: {
                map: ID_ALL,
                renderTo: id,
                height: 320
            },        
            title: {
                text: ''
            },
            plotOptions: {
                map: { states: { hover: {
                    color: '#f0a18c'
                }}}
            },
            credits: {
                enabled: false
            },
            colorAxis: {
                minColor: '#eeeeee',
                maxColor: '#005daf',
                labels: {
                    formatter: function() {
                        return moneyFormatter(this.value);
                    },
                }
            },
            legend: {
                title: {
                    text: `Index ${metric}`,
                },
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                floating: false,
            },
            
            subtitle: {
                text: `Grafik ${metric}`
            },
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            },
        
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: function () {
                    const { key, point: { values } } = this;
                    let labels = '';
                    for(let i = 0; i < values.length; i++) {
                        const {name, value} = values[i];
                        const money = value ? `Rp. ${moneyParser(value)}` : `-`;
                        labels += `<tr style="font-size: 12px">
                            <td style="font-weight: bold">${name}</td>
                            <td style="padding:0px 5px;">: ${money}</td>
                            </tr>`
                    }
                    return (
                        `<span style="font-size:14px; font-weight: bold">${key}</span><table>
                            ${labels}
                        </table>`
                    )
                }
            },
            mapNavigation: {
                enableButtons: true,
                enableMouseWheelZoom: true
            },
            series: [{
                mapData: ID_ALL,
                data: [...data],
                keys: ['hc-key', 'value'],
            }]
        })
    }

    // componentDidUpdate(prevProps) {
    //     if(prevProps.data !== this.props.data && this.props.data.length >= 0){
    //         const {idx, data, metric} = this.props;
    //         this.drawChart(idx, data, metric);
    //     }
    // }

    render() {
        return (
            <div id={this.props.idx}>
            </div>
        );
    };
    
}