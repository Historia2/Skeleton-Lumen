import React, { Component } from 'react'
import { connect } from 'react-redux';
import { updateData } from 'actions/overview.action';
import { pinkPurpleTheme } from 'constant';
import { requestData } from '../overview.service';
import { translateOptions, examine } from 'components/helper';

import Chart1 from './chart/chart1.component';
import { Loading, PageState } from 'components/structure'
import FilterForm1 from './form/filter-form1.component';
import {MAP_DEV} from "../../../../../services";
const color = [...pinkPurpleTheme].reverse();
const formSchema = []

class Overview1 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRequesting: true,
            defaults: {
                "city": "2",
                "period": '6',
                "year": "25",
                "brand": "1",
                "series": "7",
                "cylinder": "25",
                "type": "45"
            }
        };
    }

    mapData({title, item = []}, callback) {
        const grades = ["A", "B", "C", "D", "E"];
        const series = (item.length > 0) ? [{
            name: title,
            data: grades.map((grade, i) => {
                const { minPrice, maxPrice } = item.find(e => e.grade === grade) || {minPrice: null, maxPrice: null};
                return {
                    color: color[i],
                    low: minPrice !== null ? minPrice : null,
                    high: maxPrice !== null ? maxPrice : null,
                }
            }),
            minPointLength: 5,
        }] : null;
        callback(series);
    }

    getData = (filter) => {
        this.setState({isRequesting: true});
        filter.cylinder = examine(filter.cylinder, ["", undefined]) ? "all" : filter.cylinder;
        filter.type = examine(filter.type, ["", undefined]) ? "all" : filter.type;
        const api = MAP_DEV.service.price_base.unit_condition;
        requestData(api, filter, (status, data) => {
            this.mapData(data, result => {
                this.props.updateData({
                    chart1: {
                        title: status !== 200 ? `ERROR ${status} - Please try again later`: (result === null) ? "Data tidak ditemukan !" : data.title,
                        series: result,
                    }
                });
                this.setState({isRequesting: false});
            })
            
        });
    }

    componentDidMount() {
        translateOptions(this.state.defaults, this.props.options, formSchema, (result => this.getData(result)))
    }

    render() {
        const {series, title} = this.props;
        return (
            <div className="card overview-widget"> 
                <div className="row">
                    <div className="col-md-4 col-lg-3 form-container">
                        {/* Forms */}
                        <FilterForm1 defaults={this.state.defaults} onSubmit={filter => this.getData(filter)} />
                    </div>
                    <div className="col-lg-9 col-md-8 chart-container">
                        {this.state.isRequesting ? (
                            <Loading logo="false" size="extra-small" />
                        ) : series === null ? (
                            <PageState title={title} />
                        ) : (
                            <Chart1 id="overview1-chart" title={title} series={series} />
                        )}
                    </div>
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state.overviewReducer.chartData.chart1,
    ...state.appReducer
    
})

const mapDispatchToProps = dispatch => ({
    updateData: (payload) => dispatch(updateData(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview1);
