import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pinkPurpleTheme } from 'constant';
import { updateData } from 'actions/overview.action';
import Chart4 from './chart/chart4.component';
import FilterForm1 from './form/filter-form1.component';
import { requestData } from '../overview.service';
import { translateOptions, examine } from 'components/helper';
import { Loading, PageState } from 'components/structure'
import {MAP_DEV} from "../../../../../services";

const color = [
    pinkPurpleTheme[0],
    pinkPurpleTheme[3],
    '#4ec04e',
    '#d8d836',
    '#51d836'
]

class Overview4 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRequesting: true,
            defaults: {
                "city": "2", 
                "period": "6",
                "year": "25",
                "brand": "1",
                "series": "7",
                "cylinder": "25",
                "type": "45"
            }
        };
    }

    mapData = (data = [], period = 6, callback) => {
        const gradeList = ["A", "B", "C", "D", "E"];
        const series = data.length > 0 ? gradeList.map((grade, i) => {
            const { price } = data.find(e => e.grade === grade) || {price: [].fill(null, 0, period-1)};
            return {
                "name": `Grade ${grade}`,
                "data": price.map(p => p > 0 ? p : null),
                color: color[i],
            }
        }) : null;
        callback(series);
    }

    getData = (filter) => {
        this.setState({isRequesting: true});
        filter.cylinder = examine(filter.cylinder, ["", undefined]) ? "all" : filter.cylinder;
        filter.type = examine(filter.type, ["", undefined]) ? "all" : filter.type;
        this.setState({isRequesting: true});
        const api = MAP_DEV.service.price_base.time;
        requestData(api, filter, (status, { title, item }) => {
            this.mapData(item, filter.period, result => {
                this.props.updateData({
                    chart4: {
                        title: status !== 200 ? `ERROR ${status} - Please try again later`: (result === null) ? "Data tidak ditemukan !" : title ,
                        series: result,
                    }
                });
                this.setState({isRequesting: false});
            })
        });
    }

    componentDidMount() {
        translateOptions(this.state.defaults, this.props.options, [], (result => this.getData(result)));
    }

    render() {
    const {title, series} = this.props;
    const {isRequesting} = this.state;

    return (
        <div className="card overview-widget"> 
            <div className="row">
                <div className="col-md-4 col-lg-3 form-container">
                    <FilterForm1 defaults={this.state.defaults} onSubmit={filter => this.getData(filter)} />  
                </div>
                <div className="col-lg-9 col-md-8 chart-container">
                    {isRequesting ? (
                        <Loading logo="false" size="extra-small" />
                    ) : (series === null || series === undefined ? (
                            <PageState title="Data tidak ditemukan !" />
                        ) : (
                            <Chart4 id="overview4-chart" title={title} series={series} />
                        )
                    )}
                </div>
            </div>
        </div>
    )
  }
}

const mapStateToProps = state => ({
    ...state.overviewReducer.chartData.chart4,
    ...state.appReducer
})

const mapDispatchToProps = dispatch => ({
    updateData: (payload) => dispatch(updateData(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview4);
