import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import dataTable from 'datatables.net-bs4';
import { moneyParser } from 'components/helper';

$.DataTable = dataTable;

function sortNumbersIgnoreText(a, b, high) {
    var reg = /[+-]?((\d+(\.\d*)?)|\.\d+)([eE][+-]?[0-9]+)?/;
    a = a.match(reg);
    a = a !== null ? parseFloat(a[0]) : high;
    b = b.match(reg);
    b = b !== null ? parseFloat(b[0]) : high;
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
}
$.extend( $.fn.dataTableExt.oSort, {
    "sort-numbers-ignore-text-asc": function (a, b) {
        return sortNumbersIgnoreText(a, b, Number.POSITIVE_INFINITY);
    },
    "sort-numbers-ignore-text-desc": function (a, b) {
        return sortNumbersIgnoreText(a, b, Number.NEGATIVE_INFINITY) * -1;
    }
});

class IteratorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    reverseArray(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
          newArray.push(arr[i]);
        }
        return newArray;
    }

    render() {
        const data = this.props.data;

        var date = data.tanggalLelang.split("-");
        var newDate = []
        for (let i = date.length - 1; i >= 0; i-- ) {newDate.push(date[i])}
        var newDateJoin = newDate.join("-")

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
                <td>{newDateJoin}</td>
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
                columnDefs: [
                    { type: 'sort-numbers-ignore-text', targets : [9, 10] },
                    { searchable: false, targets : 11 }
                ]
            });
        }
    }

    componentDidMount() {
        $('#table-result').DataTable({
            responsive: true,
            columnDefs: [
                { type: 'sort-numbers-ignore-text', targets : [9, 10] },
                { searchable: false, targets : 11 }
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
