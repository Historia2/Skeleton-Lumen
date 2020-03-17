import React, { Component } from 'react';
import axios from 'axios';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { moneyParser } from 'components/helper';
import { Loading } from 'components/structure';
import { HOSTNAME } from 'services';
import { HTTP_CONFIG } from 'services';
import {MAP_DEV} from "../../../../services";

const getData = (id, callback) => {
    const api = MAP_DEV.service.markets.detail.get;
    axios.post(api, {
        id: id
    }, HTTP_CONFIG).then(({data, ...response}) => {
        callback(data.data);
    }).catch(err => {
        callback(undefined);
    });
}

export default class DetailScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            id: this.props.match.params.id,
            data: undefined,
            nopol: "D 4 MRI",
        }
    }

    goBack() {
        this.props.history.goBack();
    }

    componentDidMount() {
        const id = this.props.match.params.id || null;
        if (id !== null) {
            getData(id, (result) => {
                let data = undefined;
                if(result !== undefined){
                    data = result;
                    data.title = `${data.info.brand} ${data.info.series} ${data.info.type} ${data.info.cylinder} ${data.info.fuel} ${data.info.transmission} ${data.info.year}`;
                }
                this.setState({data: data, isLoading: false});
            });
        }
    }

    render() {
        const { isLoading, data } = this.state;
        // const { brand, series, type, cylinder, fuel, transmission, year } = this.state.data.info
        return (
            <div className="content">
                <div className="screen-title" style={{marginBottom: "20px"}}>
                    <div className="btn hybrid ibid positive" onClick={e => this.goBack()}>
                        <IoIosArrowRoundBack />
                        <span>Go Back</span>
                    </div>
                </div>
                { isLoading ? (
                    <Loading size="small" logo="false" />
                ) : (
                    
                    data !== undefined && data !== "error" ? (
                <div className="card detail">
                    <div className="row">
                        <div className="photos col-md-5">
                            <div id="carousel" className="carousel slide carousel-fade" data-ride="carousel" data-interval="false">
                                <div className="carousel-inner">

                                    {data.pictures.map((picture, index) => (
                                        <div className={"carousel-item" + (index === 0 ? " active" : "")}>
                                            <img className="d-block w-100" src={picture} alt="First slide"/>
                                        </div>
                                    ))}
                                </div>
                                <a className="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#carousel" role="button" data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div>
                            <br/>
                            <div className="carousel-indicators col">
                                {data.pictures.map((picture, index) => (
                                    <div className={"col-xs-3" + (index === 0 ? " active": "")} data-target="#carousel" data-slide-to={index}>
                                        <img src={picture} alt={"pic-"+index} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="upper-detail col-md-7">
                            <div className="title">{data.title}</div>
                            <div className="price">
                                <div className="base-price">
                                    <span>Harga Dasar</span>
                                    <div>
                                        <span>Rp.</span>
                                        <span className="number">{moneyParser(data.basePrice)}</span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className="final-price">
                                    <span>Harga Terbentuk</span>
                                    <div>
                                        <span>Rp.</span>
                                        <span className="number">{moneyParser(data.finalPrice)}</span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                            <div className="specs">
                                <div className="label">Jadwal Lelang</div>
                                <div className="value">{`${this.state.data["auctionLocation"]}, 
                                ${data.auctionDate.split('T08')[0]} | Lot #${data.lotNumber}`}</div>
                            </div>
                            <div className="specs">
                                <div className="label">Nomor Polisi</div>
                                <div className="value">{data.plateNumber}</div>
                            </div>
                            <Specifications data={this.state.data}/>
                        </div>
                    </div>
                </div>
                    ) : (
                        <div className="empty-state">
                            <div className="icon"></div>
                            <div className="text">Car Number #{this.state.id} Found</div>
                        </div>
                    )
                ) }
            </div>
        )
    }
}


const schema = {
    info: [
        [
            { key: "brand", label: "Merk"}, 
            { key: "series", label: "Seri"}
        ], 
        [
            { key: "cylinder", label: "Silinder"}, 
            { key: "type", label: "Tipe"}
        ], 
        [
            { key: "transmission", label: "Transmisi"}, 
            { key: "model", label: "Model"}
        ], 
        [
            { key: "year", label: "Tahun"}, 
            { key: "chassisNumber", label: "Nomor Rangka"}
        ], 
        [
            { key: "engineNumber", label: "Nomor Mesin"}, 
            { key: "registrationDate", label: "Tanggal STNK"}
        ], 
        [
            { key: "KeurDate", label: "Tanggal Keur"}, 
            { key: "color", label: "Warna"}
        ], 
        [
            { key: "fuel", label: "Bahan Bakar"}, 
            { key: "odometer", label: "Odometer"}
        ]
    ],
    document: [
        [
            { key: "bpkb", label: "BPKB"},
            { key: "invoice", label: "Faktur"}
        ],
        [
            { key: "receipt", label: "Kuitansi"},
            { key: "letterOfRelease", label: "Surat Pelepasan Hak"}
        ],
        [
            { key: "ownerId", label: "KTP Pemilik"},
            { key: "formA", label: "Form A"}
        ],
    ]
}

const SpecTable = ({ schema, data }) => {
    return (
        <table className="table-spec">
            <tbody>
            {schema.map((row, rowNum) => (
                <tr key={rowNum}>
                    {row.map(({ label, key }, colNum) => (
                        <td key={colNum}>
                            <span className="label" style={{ textTransform: 'capitalize' }}>{label}</span>
                            <span className="value">{data[key]}</span>
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    )
} 

const Specifications = ({ data, ...props}) => {
    // const pics = data.inspectionResult;
    return (
        <div className="specifications">

            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" id="pills-home-tab" data-toggle="pill" href="#tab_info" role="tab" aria-controls="tab_info" aria-selected="true">Info</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#tab_kelengkapan" role="tab" aria-controls="tab_kelengkapan" aria-selected="false">Kelengkapan</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" id="pills-profile-tab" data-toggle="pill" href="#tab_inspeksi" role="tab" aria-controls="tab_inspeksi" aria-selected="false">Hasil Inspeksi</a>
                </li>
            </ul>

            <div className="tab-content">
                {/* Tab Info */}
                 <div className="tab-pane active" id="tab_info">
                    <SpecTable schema={schema.info} data={data.info} />
                </div>

                {/* Tab Kelengkapan */}
                <div className="tab-pane" id="tab_kelengkapan">
                    <SpecTable schema={schema.document} data={data.document} />
                </div> 

                {/* Tab Inspeksi */}
                <div className="tab-pane" id="tab_inspeksi">
                    <div className="specs stripe">
                        <div className="label">Total Score : </div>
                        <div className="value" style={{fontSize:"xx-large", fontWeight: "bolder"}}>{data.grade.total}</div>
                    </div>
                    <br />
                    <table className="table-spec">
                        <tbody>
                            <tr>
                                <td><span className="label">Interior</span><span className="value">{data.grade.interior}</span></td>
                                <td><span className="label">Exterior</span><span className="value">{data.grade.eskterior}</span></td>
                            </tr>
                            <tr>
                                <td><span className="label">Rangka</span><span className="value">{data.grade.rangka}</span></td>
                                <td><span className="label">Mesin</span><span className="value">{data.grade.interior}</span></td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <span className="label" style={{ textTransform: 'capitalize' }}>Kuitansi</span>
                                    <span className="value">{data["receiptGrade"]}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                    <div className="subtitle">Detail Inspeksi</div>
                    <div className="inspection-result row">
                        {/* <img src={require()} /> */}
                        {/* { pics.map((pic, index) => (
                            <img src={(pic[0] === "/" ? "http:" : "" ) + pic} alt={`Inspection Result ${index}`} />
                        ))} */}
                        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
                        <iframe 
                            className="col-lg-12 col-md-12 col-sm-12"
                            src={"https://ims2storage.blob.core.windows.net/acv-pdf/5000"+data.id+"/inspection.pdf"}
                            frameborder="0"
                            height="820"
                        ></iframe> 
                    </div>
                </div>
            </div>
        </div>
    )
}
