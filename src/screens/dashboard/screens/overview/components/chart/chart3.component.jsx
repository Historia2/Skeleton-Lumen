import React, { Component } from 'react';
import * as Highcharts from 'highcharts/highmaps';
import { ID_ALL } from 'constant';
import { moneyFormatter } from 'components/helper';

export default class Chart3 extends Component {
    componentDidMount() {
        this.renderMaps();
    }

    renderMaps() {
        Highcharts.mapChart({
            chart: {
                map: ID_ALL,
                renderTo: this.props.id || 'grafik-map-buyer3',
                height: 370
            },        
            title: {
                text: this.props.title
            },
            plotOptions: {
                map: {
                    states: {
                        hover: {
                            color: '#f0a18c'
                        }
                    }
                }
            },
            credits: {
                enabled: false
            },
            colorAxis: {
                minColor: '#9CCDE2',
                maxColor: '#182361',
                labels: {
                    formatter: function() {
                        return moneyFormatter(this.value);
                    }
                }
            },
            legend: {
                title: {
                    text: 'Index Penjualan',
                },
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                floating: false,
            },
            subtitle: {
                text: 'Harga Terbentuk Berdasarkan Lokasi',
                style: {
                    fontSize: '12px'
                }
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
                    const defaultPoint = {
                        valueMin: 0,
                        value: 0
                    };
                    let {valueMin, value} = typeof this.point === "undefined" ? defaultPoint : this.point ;
                    return (
                        `<span style="font-size:12px; font-weight: bold">${ typeof this.key === "undefined" ? "Loading.." : this.key}</span><table>` +
                        `<tr style="font-size: 14px">
                            <td style="padding:0">Harga Termahal</td>
                            <td style="padding:0px 5px;">: ${moneyFormatter(value)}</td>
                        </tr>
                        <tr style="font-size: 14px">
                            <td style="padding:0">Harga Termurah</td>
                            <td style="padding:0px 5px;">: ${moneyFormatter(valueMin)}</td>
                        </tr></table>`
                    )
                }
            },
            mapNavigation: {
                enableButtons: false,
                enableDoubleClickZoomTo: true,
                enableMouseWheelZoom: true
            },
            series: [{
                mapData: ID_ALL,
                data: [...this.props.series],
                keys: ['hc-key', 'value', 'valueMin']
            }]
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props && this.props.series.length > 0){
            this.renderMaps();
        }
    }

    render() {
        return (
            <div id={this.props.id || "highchart-buyer3"} className="chart">
            </div>
        );
    };
    
}