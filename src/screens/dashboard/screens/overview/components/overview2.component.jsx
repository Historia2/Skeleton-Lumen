import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateData } from 'actions/overview.action';
import { pinkPurpleTheme as color } from 'constant';
import { requestData } from '../overview.service';
import { translateOptions, examine } from 'components/helper';
import { Loading, PageState } from 'components/structure'
import Chart2 from './chart/chart2.component';
import FilterForm2 from './form/filter-form2.component';
import {MAP_DEV} from "../../../../../services";

const formScheme = [
    {name: "startYear", option: "year"},
    {name: "endYear", option: "year"}
]

class Overview2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advance: null,
            isRequesting: true,
            defaults: {
                "city": "2",
                "period": "6",
                "startYear": "21",
                "endYear": "25",
                "brand": "1",
                "series": "7",
                "cylinder": "25",
                "type": "45"
            }
        }
    }

    mapData(data = [], callback) {
        let gradeList = ["A","B","C","D","E"]
        const series = data.length > 0 ? data.map(({ year, price }, i) => ({
            name: year,
            color: color[i],
            minPointLength: 5,
            data: gradeList.map(masuk => {
                const rawData = price.find(obj => obj.grade === masuk) || {grade: masuk, minPrice: "-", maxPrice: "-"} 
                return {
                    low: rawData.minPrice,
                    high: rawData.maxPrice,
                }
            })
        })) : null;
        callback(series);
    }

    getData = (filter) => {
        this.setState({isRequesting: true});
        filter.cylinder = examine(filter.cylinder, ["", undefined]) ? "all" : filter.cylinder;
        filter.type = examine(filter.type, ["", undefined]) ? "all" : filter.type;
        const api = MAP_DEV.service.price_base.type_of_year;
        requestData(api, filter, (status, {title, item}) => {
            this.mapData(item, result => {
                this.props.updateData({
                    chart2: {
                        title: status !== 200 ? `ERROR ${status} - Please try again later`: (result === null) ? "Data tidak ditemukan !" : title,
                        series: result,
                    }
                });
                this.setState({isRequesting: false});
            });
        });
    }

    componentDidMount() {
        translateOptions(this.state.defaults, this.props.options, formScheme, (result => this.getData(result)))
    }

    render() {
    const {series, title} = this.props;
    return (
        <div className="card overview-widget"> 
            <div className="row">
                <div className="col-md-4 col-lg-3 form-container">
                    {/* Forms */}
                    <FilterForm2 defaults={this.state.defaults} onSubmit={filter => this.getData(filter)}  />
                </div>
                <div className="col-lg-9 col-md-8 chart-container">
                    {this.state.isRequesting ? (
                        <Loading logo="false" size="extra-small" />
                    ) : (series === null || series === undefined ? (
                            <PageState title="Data tidak ditemukan !" />
                        ) : (
                            <Chart2 id="overview2-chart" title={title} series={series} />
                        )
                    )}
                </div>
            </div>
        </div>
    )
  }
}

const mapStateToProps = state => ({
    ...state.overviewReducer.chartData.chart2,
    ...state.appReducer
})

const mapDispatchToProps = dispatch => ({
    updateData: (payload) => dispatch(updateData(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview2);