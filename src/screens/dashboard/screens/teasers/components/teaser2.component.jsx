import React, { Component } from 'react'
import { connect } from 'react-redux';
import { translateOptions } from 'components/helper';

import Dashboard2 from './chart/dashboard2';
import { Loading, PageState } from 'components/structure'
import FilterForm from './form/filter-form.component';
import { MAIN_THEME } from 'constant';
import axios from 'axios';
import { HTTP_CONFIG, HOSTNAME } from 'services';

class Teaser2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isRequesting: true,
            result: [],
            title: "",
            region: [],
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

    getData = (filters) => {
        this.setState({isRequesting: true});
        filters["metric"] = "dashboard2";
        const $api = `${HOSTNAME}/api/Ibid7Teaser`;
        axios.post($api, filters, HTTP_CONFIG)
        .then(({data, ...response}) => {
            let raw = data.data;
            let isEmpty = raw ? ( typeof raw.length !== "undefined" ? ( raw.length > 0 ? false : true ) : false ) : true;
            let region = !isEmpty ? raw.map(e => e.region) : null;
            let result = !isEmpty ? [{
                minPointLength: 5,
                "color": MAIN_THEME[3],
                "name": raw[0].name,
                "data": raw.map((series, i) => ({
                    "low": series.resultPriceMin,
                    "high": series.resultPriceMax
                }))
            }] : null;
            this.setState({
                result: result,
                title: !isEmpty ? raw[0].name : "Data Tidak Ditemukan !",
                region: region,
                isRequesting: false
            });
        }).catch(err => {
          console.log(err);
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
        const {result, title, region} = this.state;

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
                        ) : result === null ? (
                            <PageState title={title} />
                        ) : (
                            <Dashboard2 id="overview1-chart" title={title} xAxis={region} data={result}/>
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

export default connect(mapStateToProps)(Teaser2);
