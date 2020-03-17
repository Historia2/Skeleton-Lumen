import React, { Component } from 'react'
import { connect } from 'react-redux';
// import { updateData } from 'actions/overview.action';
// import { pinkPurpleTheme } from 'constant';
import { translateOptions } from 'components/helper';

import Dashboard3 from './chart/dashboard3';
import { Loading, PageState } from 'components/structure'
import FilterForm from './form/filter-form.component';
import axios from 'axios';
import { HTTP_CONFIG, HOSTNAME } from 'services';
import { MAIN_THEME } from 'constant';

class Teaser3 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            defaults: {
                "city": "2",
                "period": '6',
                "year": "25",
                "brand": "1",
                "series": "7",
                "cylinder": "25",
                "type": "45",
            },
            result: [],
            title: "",
            isRequesting: true,
        };
    }

    getData = (filters) => {
        this.setState({isRequesting: true});
        filters["metric"] = "dashboard3";
        const $api = `${HOSTNAME}/api/Ibid7Teaser`;
        axios.post($api, filters, HTTP_CONFIG)
        .then(({data, ...response}) => {
            let rawData = data.data[0];
            let result = (data.data.length > 0) ? [
                {
                    "name": "HT Max",
                    "data" : rawData.priceMax === undefined ? [] : rawData.priceMax,
                    "color": MAIN_THEME[0]
                },
                {
                    "name": "HT Avg",
                    "data" : rawData.priceAvg === undefined ? [] : rawData.priceAvg,
                    "color": MAIN_THEME[3]
                }
            ] : null;
            this.setState({
                result: result,
                title: rawData === undefined ? "Data Tidak ditemukan" : rawData.name,
                isRequesting: false
            });
        }).catch(err => {
            if (typeof err.response === "undefined") {
              this.setState({
                  result: null,
                  title: `ERROR 500 - Please try again later`,
                  isRequesting: false
              });
            } else {
              const {status = 0} = err.response;
              this.setState({
                  result: null,
                  title: `ERROR ${status} - Please try again later`,
                  isRequesting: false
              });
            }
        })

    }

    componentDidMount() {
        translateOptions(this.state.defaults, this.props.options, [], (result => this.getData(result)))
    }

    render() {
        const {result, title} = this.state;
        return (
            <div className="card overview-widget">
                <div className="row">
                    <div className="col-md-4 col-lg-3 form-container">
                        {/* Forms */}
                        <FilterForm defaults={this.state.defaults} onSubmit={filter => this.getData(filter)}/>
                    </div>
                    <div className="col-lg-9 col-md-8 chart-container">
                        {this.state.isRequesting ? (
                            <Loading logo="false" size="extra-small" />
                        ) : (result === null) ? (
                            <PageState title={title} />
                        ) : (
                            <Dashboard3 id="teaser3-chart" title={title} data={result}/>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state.appReducer
})

export default connect(mapStateToProps)(Teaser3);
