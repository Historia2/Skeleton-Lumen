import React, { Component } from 'react'
import { IoMdClose, IoMdCreate } from 'react-icons/io';
import {connect} from "react-redux"
import { updateWidgetData } from 'actions/insight.action'
import { pinkPurpleTheme, regionList, OPTIONS } from 'constant';
import { Loading, PageState } from 'components/structure';

import Geomap from './chart/geomap';
import Bar from './chart/bar';
import Pie from './chart/pie';
import Lines from './chart/lines';
import Table from './chart/table';
import { requestData } from '../insights.service';
import { translateOptions } from 'components/helper';

const color = [
    pinkPurpleTheme[0],
    pinkPurpleTheme[3],
    '#4ec04e',
    '#d8d836',
    '#51d836'
]

class InsightsWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRequesting: false
        }
    }

    processData(rawData, type, callback) {
        let result = [];
        let max;
        // Timeline Data Maping
        if (type === 0) {
            result = rawData.map((row, idx) => ({
                "name": row.name,
                "data": row.data.map(d => d > 0 ? d : null),
                "color": color[idx]
            }));
            let values = [];
            for(let i = 0; i < rawData.length; i++){
                values = [...values, ...rawData[i].data];
            }
            max = Math.max(...values);
        // Bar Data Maping
        } else if (type === 1) {
            result = rawData.map(({name, data}, i) => ({
                "name": name,
                "data": [ Math.floor(data) ],
                "color": pinkPurpleTheme[4-i]
            }))
            max = Math.max(...rawData.map(e => e.data));
        // Pie Data Maping
        } else if (type === 2) {
            let other = 100.0;
            result = rawData.map(({name, data, percentage}, i) => {
                const value = parseFloat(percentage);
                other -= value;
                return {
                    "name": name,
                    "y": value,
                    "color": pinkPurpleTheme[4-i]
                }
            })
            max = Math.max(...rawData.map(e => e.percentage));
            result.push({
                "name": "Other Car",
                "y": other,
                "color": pinkPurpleTheme[result.length%5],
                "visible": false
            })
        // Table Data Maping
        } else if(type === 3) {
            result = rawData.map((row, idx) => ({
                "merek": row.brand,
                "seri": row.series,
                "silinder": row.cylinder,
                "tipe": row.type,
                "tahun": row.year,
                "transmisi": row.transmission,
                "kota": row.city === "-" ?  "Semua Kota" : row.city,
                "grade": row.grade === "-" ?  "Semua Grade" : row.grade,
                "harga": row.price
            }))
            max = Math.max(...rawData.map(e => e.price));
        // Geomap Data Maping
        } else if (type === 4) {
            result = regionList.map(city => ({
                "hc-key": city,
                "value": Math.max(...(rawData.map(car => {
                    const data = car.data.find(e => e.city === city) || {value: 0}
                    return data.value
                }))),
                "values": rawData.map(car => {
                    const data = car.data.find(e => e.city === city) || {value: 0}
                    return { 
                        "name": car.name,
                        "value": data.value
                    }
                })
            }))
            let values = [];
            for(let i = 0; i < rawData.length; i++){
                values = [...values, ...rawData[i].data.map(e => e.value)];
            }
            max = Math.max(...values);
        }
        if(max <= 0) { result = null; }
        callback(result);
    }

    translateFilter(filters, callback) {
        let newFilter = [];
        // eslint-disable-next-line array-callback-return
        filters.map(filter => {
            translateOptions(filter, this.props.options, [], result => {
                if(result.city === "") { delete result.city  }
                if(result.grade === "") { delete result.grade  }
                newFilter.push(result)
            } );
        });
        callback(newFilter);
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        if(prevProps.chartConfig !== this.props.chartConfig){
            this.getData();
        }
    }

    getData() {
        const { chartType, filters, metric, period } =  this.props.chartConfig;
        // const period = 6;
        const requestFilters = {
            "chartType": chartType,
            "metric": metric,
            "period": period,
            "filters": filters
        }
        this.setState({"isRequesting": true});
        this.translateFilter(requestFilters.filters, translated => {
            requestFilters.filters = [...translated];
            requestData(requestFilters, data => {
                this.processData(data, chartType, (result) => {
                    let widgetsData = {};
                    widgetsData[this.props.widgetId] = result;
                    this.props.updateWidgetData(widgetsData);
                    this.setState({"isRequesting": false});
                });
            });
        });
    }

    render() {
        const { chartConfig: { chartType, name, metric, period }, onDelete, onEdit, onUpdateWidget, widgetId, pos, options, widgetsData } = this.props;
        const { isRequesting } = this.state;
        const subtitle = OPTIONS.metric.find(e => e.key === metric) || { label: "Tak diketahui" };

        return (
            <div className="card widget">
                <div className="header">
                    <h6 className="title">{name}</h6>
                    <div className="action">
                        <div title="Edit" className="icon" onClick={e => onEdit(pos, widgetId)}><IoMdCreate /></div>
                        <div title="Delete" className="icon" onClick={e => onDelete(pos)}><IoMdClose /></div>
                    </div>
                </div>
                <div className="body">
                    {isRequesting ? (
                        <Loading logo="false" size="extra-small" style={{margin: "40px auto"}} />
                    ) : (widgetsData[widgetId] === null) ? (
                        <PageState title="Data not found" style={{margin: "40px auto"}} />
                    ) : (
                        <InsightChart type={chartType} idx={widgetId} data={widgetsData[widgetId] || []} metric={subtitle.label} />
                    )}
                </div>
                <div style={{padding: "0px 20px 20px", width: "200px" }}>
                    <select name="period" value={period} defaultValue="6" className="form-control form-control-sm valid" 
                        onChange={e => onUpdateWidget(pos.split("-"), {period: e.target.value}) }>
                        { options.period.filter(e => e.value !== "").map(({label, value}) => <option key={"period" + value} value={value}>{label}</option>) }
                    </select>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state.appReducer,
    ...state.insightReducer
});

const mapDispatchToProps = dispatch => ({
    updateWidgetData: (payload) => dispatch(updateWidgetData(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InsightsWidget);

export const InsightChart = (props) => {
    switch(props.type){
        case 0:
            return <Lines {...props} />;
        case 1:
            return <Bar {...props} />;
        case 2:
            return <Pie {...props} />;
        case 3:
            return <Table {...props} />;
        case 4:
            return <Geomap {...props} />;
        default:
            return <Bar {...props} />;
    }
}