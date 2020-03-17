import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import dataTable from 'datatables.net-bs4';
import { moneyParser } from 'components/helper'

$.DataTable = dataTable;

var table;

class IteratorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const data = this.props.data;
        return (
            <tr>
                <td>{data.nama}</td>
                <td>{data.tahun}</td>
                <td>{data.warna}</td>
                <td>{data.transmisi}</td>
                <td>{data.bahanBakar}</td>
                <td>{moneyParser(data.odometer)}</td>
                <td>{data.grade}</td>
                <td>{data.kotaLelang}</td>
                <td>{data.tanggalLelang}</td>
                <td>{moneyParser(data.hargaDasar)}</td>
                <td>{moneyParser(data.hargaTerbentuk)}</td>
                <td>
                    <Link to={`/dashboard/detail/${data.id}`}>
                        <div className="btn ibid primary" title="Lihat Detail">Detail</div>
                    </Link>
                </td>
            </tr>
        )
    }
}

export default class SearchResult1Component extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSet: this.props.data
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps !== this.props && this.props.data.length > 0) {

            $('#table-result').DataTable({
                responsive: true,
                "columns": [
                    null, null, null, null, null, null, null, null, null, null, null,{ "searchable": false }
                ]
            });
        }
    }

    componentDidMount() {
        $('#table-result').DataTable({
            responsive: true,
            "columns": [
                null, null, null, null, null, null, null, null, null, null, null,{ "searchable": false }
            ]
        });
    }

    render() {
        $('#table-result').DataTable().destroy();
        const data = this.props.data;
        return (
            <div className="table" style={{fontSize: '12px'}}>
                <div>
                    <table
                    id="table-result"
                    className=" table
                                table-result
                                table-striped
                                table-hover
                                table-sm
                                table-responsive-sm
                                font-weight-light"
                    style={{fontSize: '12px', width: '100%'}}
                    >
                    <thead>
                        <tr>
                            <th>Nama Kendaraan</th>
                            <th>Tahun</th>
                            <th>Warna</th>
                            <th>Transmisi</th>
                            <th>Bahan Bakar</th>
                            <th>Odometer</th>
                            <th>Total Evaluasi</th>
                            <th>Kota Lelang</th>
                            <th>Tanggal Lelang</th>
                            <th>Harga Dasar</th>
                            <th>Harga Terbentuk</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { data.map((data, index) => (
                            <IteratorComponent data={data} key={`asd ${index}`} />
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        )}

}
