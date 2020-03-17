import React, { Component } from 'react';
import { FaThList, FaTable } from 'react-icons/fa'

import FilterForm from './components/form/filter-form.component';
import SearchResultComponent from './components/result-list.component';
import SearchResult1Component from './components/result-table.component';
import axios from 'axios';

import { connect } from 'react-redux';
import { updateData } from 'actions/overview.action';
import { examine } from 'components/helper';
import { Loading, PageState } from 'components/structure';
import { HOSTNAME } from 'services';
import { HTTP_CONFIG } from 'services';
import {MAP_DEV} from "../../../../services";

class MarketPriceDBScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaults: {
                "brand": "1",
                "series": "7",
                "cylinder": "25",
                "type": "45",
                "model": "3",
                "period": "6",
            },
            searchResult: false,
            result: [],
            dataSet: false,
            isRequesting: false,
            error: false,
        };
    }

    getData = (filter) => {
        this.setState({
            isRequesting: true,
            error: false
        });
        filter.cylinder = examine(filter.cylinder, ["", undefined]) ? "all" : filter.cylinder;
        filter.type = examine(filter.type, ["", undefined]) ? "all" : filter.type;
        const $api = MAP_DEV.service.markets.get;
        axios.post($api, filter, HTTP_CONFIG)
        .then((response) => {
            this.setState({isRequesting: false});
            let t1 = response.data.data.data.map((obj, idx) => ({
                id: obj.id,
                nama: obj.title,
                grade: obj.grade,
                tahun: obj.year,
                warna: obj.color,
                bahanBakar: obj.fuel,
                odometer: obj.odometer,
                minKm: obj.minKm,
                maxKm: obj.maxKm,
                kotaLelang: obj.cityAuction,
                tanggalLelang: obj.dateAuction,
                totalEvaluasi: obj.grade,
                hargaDasar: obj.basePrice,
                hargaTerbentuk: obj.finalPrice,
                transmisi: obj.transmission,
                picture: obj.picture,
                gradeInterior: obj.gradeInterior,
                gradeExterior: obj.gradeExterior,
                gradeMesin: obj.gradeMesin,
                gradeRangka: obj.gradeRangka
            }))
            if (response.data.length === 0) {
                alert('Data Tidak Ditemukan')
            }
            this.setState({result: t1});
        })
        .catch(err => {
            console.error(err)
            this.setState({
                searchResult: false,
                error: true,
                result: ""
            })
        })
    }

    render() {
        const { result } = this.state;
        return (
            <div className="row wr content">
                <div className="col-md-12">
                    <FilterForm
                        defaults={this.state.defaults}
                        onSubmit={filter => {
                            this.getData(filter);
                        }} />
                </div>

                {this.state.isRequesting && <Loading size="large" logo="false" /> }
                {this.state.error === true &&
                    <PageState title={"Data Tidak Ditemukan"} />
                }
                {(!this.state.isRequesting && result.length > 0) &&
                    <div className="col-md-12">
                        <div className="card">
                            <div className="header">
                                <h6 className="title">Filter Result ({this.state.result.length})</h6>
                                <ul className="nav nav-pills justify-content-end" id="myTab" role="tablist" style={{marginTop: "-1.5%"}}>
                                    <li className="nav-item">
                                        <button className="btn btn-primary-outline nav-link active" id="table-tab" data-toggle="pill" href="#table" role="tab" aria-controls="table"><FaTable/></button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-primary-outline nav-link" id="list-tab" data-toggle="pill" href="#list" role="tab" aria-controls="list"><FaThList/></button>
                                    </li>
                                </ul>
                            </div>
                            <div className="tab-content">
                                <div className="tab-pane fade show active" id="table" role="tabpanel" aria-labelledby="table-tab" style={{width:"100%"}}>
                                    <SearchResult1Component data={result} />
                                </div>
                                <div className="tab-pane fade" id="list" role="tabpanel" aria-labelledby="list-tab" style={{width:"100%"}}>
                                    <SearchResultComponent dataList={result} />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state.appReducer
})

const mapDispatchToProps = dispatch => ({
    updateData: (payload) => dispatch(updateData(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MarketPriceDBScreen);
