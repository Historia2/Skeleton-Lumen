import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import dataTable from 'datatables.net-bs4';
import { MdPalette, MdLocalGasStation, MdTimeToLeave } from 'react-icons/md';
import { IoMdSpeedometer, IoMdCalendar } from 'react-icons/io';
import { gradeScale } from 'constant';
import { moneyParser } from 'components/helper'

$.DataTable = dataTable;

var table;

class IteratorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    gradeColor(code) {
        const colorNumber = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
        return gradeScale[colorNumber[code]];
    }

    render() {
        const data = this.props.dataList;
        const picture = data.picture || "noimage";
        return (
            <tr>
                <td>
                        <div className="result-filter">
                        <div className="thumbnail">
                            <img src={(picture[0] === "/" ? "http:" : "" ) + picture} alt="thumbmail" />
                        </div>

                        {/* Description */}
                        <div className="description">
                            <div className="title">{data.nama}</div>
                            <div className="desc-spec d-flex">
                                <div className="grade" data-toggle="tooltip" style={{ background: this.gradeColor(data.grade)}} data-placement="top" title="Grade">{data.grade}</div>
                                <div className="specs">
                                    <div className="spec-item">
                                        <MdPalette className="icon" />
                                        <div className="text">{data.warna}</div>
                                    </div>
                                    <div className="spec-item">
                                        <IoMdCalendar className="icon" />
                                        <div className="text">{data.tahun}</div>
                                    </div>
                                    <div className="spec-item">
                                        <IoMdSpeedometer className="icon" />
                                        <div className="text">{moneyParser(data.odometer)}</div>
                                    </div>
                                    <div className="spec-item">
                                        <MdLocalGasStation className="icon" />
                                        <div className="text">{data.bahanBakar}</div>
                                    </div>
                                    <div className="spec-item">
                                        <div className="bg-transmisi" />
                                        <div className="text">{data.transmisi}</div>
                                    </div>
                                    <span className="d-flex">
                                    <span><hr/></span>
                                        <div className="spec-item" title="Nilai Interior">
                                            <div className="bg-interior" />
                                            <div className="text">{data.gradeInterior}</div>
                                        </div>
                                        <div className="spec-item" title="Nilai Eksterior">
                                            <MdTimeToLeave className="icon" />
                                            <div className="text">{data.gradeExterior}</div>
                                        </div>
                                        <div className="spec-item" title="Nilai Mesin">
                                            <div className="bg-mesin" />
                                            <div className="text">{data.gradeMesin}</div>
                                        </div>
                                        <div className="spec-item" title="Nilai Rangka">
                                            <div className="bg-rangka" />
                                            <div className="text">{data.gradeRangka}</div>
                                        </div>
                                    </span>
                                </div>
                            </div>

                        </div>
                        {/* Action */}
                        <div className="action">
                            <div className="prices">
                                <div className="price-item">
                                    <div className="label">Harga Dasar</div>
                                    <div className="value">Rp. <span className="number">{data.hargaDasar / 1000000}</span> Juta </div>
                                </div>
                                <div className="price-item">
                                    <div className="label">Harga Terbentuk</div>
                                    <div className="value">Rp. <span className="number">{data.hargaTerbentuk / 1000000}</span> Juta</div>
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col-md-7 date">
                                    <span title="Kota dan Tanggal Lelang">{`${data.kotaLelang}, ${data.tanggalLelang}`}</span>
                                </div>
                                <div className="col-md-5  button">
                                    <Link to={`/dashboard/detail/${data.id}`}>
                                        <div className="btn ibid primary" title="Detail">Tampilkan Detail</div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                </div>
                </td>
            </tr>
        )
    }
}

export default class SearchResult1Component extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.dataList
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props && this.props.dataList.length > 0) {

            $('#result').DataTable({
                sort: false,
                responsive: true,
            });
        }
    }

    componentDidMount() {
        $('#result').DataTable({
            sort: false,
            responsive: true
        });
    }


    render() {
        $('#result').DataTable().destroy();
        const data = this.props.dataList;
        return (
            <div className="">
                <div className="table" style={{fontSize: '12px'}}>
                    <div>
                      <table
                        id="result"
                        className=" table
                                    table-result
                                    table-hover
                                    table-sm
                                    table-responsive-sm
                                    font-weight-light"
                        style={{fontSize: '12px', width: '100%'}}
                        >
                        <thead>
                            <tr>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { data.map((data, index) => (
                                <IteratorComponent dataList={data} key={`asd ${index}`} />
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

}
