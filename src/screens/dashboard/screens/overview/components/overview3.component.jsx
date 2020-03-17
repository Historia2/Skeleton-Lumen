import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateData } from 'actions/overview.action';
import { translateOptions, examine } from 'components/helper';
import { requestData } from '../overview.service';
import { regionList } from 'constant';
import { Loading, PageState } from 'components/structure';
import Chart3 from './chart/chart3.component';
import FilterForm3 from './form/filter-form3.component';
import {MAP_DEV} from "../../../../../services";

class Overview3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRequesting: true,
            defaults: {
                "period": "6",
                "year": "25",
                "brand": "1",
                "series": "7",
                "cylinder": "25",
                "type": "45"
            },
        }
    }

    mapData(data = [], callback) {
        const series = data.length > 0 ? regionList.map(region => {
            const { minPrice, maxPrice } = data.find(e => e.city === region) || { "minPrice": null, "maxPrice": null };
            return {
                'hc-key': region,
                'value': maxPrice,
                'valueMin': minPrice,
            }
        }) : () => {
            return {
                'hc-key': '',
                'value': 0,
                'valueMin': 0,
            }
        };
        callback(series);
    }

    getData = (filter) => {
        this.setState({isRequesting: true});
        filter.cylinder = examine(filter.cylinder, ["", undefined]) ? "all" : filter.cylinder;
        filter.type = examine(filter.type, ["", undefined]) ? "all" : filter.type;
        const api = MAP_DEV.service.price_base.area_city;
        requestData(api, filter, async (status, {title, item}) => {
            await this.mapData(item, result => {
                this.props.updateData({
                    chart3: {
                        title: status !== 200 ? `ERROR ${status} - Please try again later`: (result === null) ? "Data tidak ditemukan !" : title ,
                        series: result,
                    }
                });
            });
            await this.setState({isRequesting: false});
        });
    }

    componentDidMount() {
        translateOptions(this.state.defaults, this.props.options, [], (result => this.getData(result)))
    }

    render() {
    const {series, title} = this.props;
    return (
        <div className="card overview-widget"> 
            <div className="row">
                <div className="col-md-4 col-lg-3 form-container">
                    <FilterForm3 defaults={this.state.defaults} onSubmit={filter => this.getData(filter)} />
                </div>
                <div className="col-lg-9 col-md-8 chart-container">
                    {this.state.isRequesting ? (
                        <Loading logo="false" size="extra-small" />
                    ) : (series === null || series === undefined ? (
                            <PageState title="Data tidak ditemukan !" />
                        ) : (
                            <Chart3 id="overview3-chart" title={title} series={series} />
                        )
                    )}
                </div>
            </div>
        </div>
    )
  }
}

const mapStateToProps = state => ({
    ...state.overviewReducer.chartData.chart3,
    ...state.appReducer

})

const mapDispatchToProps = dispatch => ({
    updateData: (payload) => dispatch(updateData(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Overview3);