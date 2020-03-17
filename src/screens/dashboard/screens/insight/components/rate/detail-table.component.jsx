import React, {Component} from 'react';
import $ from 'jquery';
import dataTable from 'datatables.net-bs4';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload, faCheck, faHistory} from '@fortawesome/free-solid-svg-icons'

$.DataTable = dataTable;

const columns = [
    {
        title: 'Name',
        width: 120,
        data: 'name'
    },
    {
        title: 'Nickname',
        width: 180,
        data: 'nickname'
    },
]

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
                <td>{}</td>
                <td>{data.grade}</td>
                <td>{data.kotaLelang}</td>
                <td>{data.tanggalLelang}</td>
                <td>{}</td>
                <td>{}</td>
                <td>
                    <Link to={`/dashboard/detail/${data.id}`}>
                        <div className="btn ibid primary" title="Lihat Detail">Detail</div>
                    </Link>
                </td>
            </tr>
        )
    }
}

export default class DetailTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSet: this.props.data
        }
    }

    componentDidMount() {
        $('#table-result').DataTable({
            responsive: true,
            "columns": [
                null, null, null, null, null, null, null
            ],
            "bLengthChange": false,
            "bFilter": false,
            "searching": false
        });
    }

    render() {
        const data = this.props.data;
        return (
            <div className="table mt-3" style={{fontSize: '12px'}}>
                <div>
                    <table
                        id="table-result"
                        className=" table
                                table-result
                                table-striped
                                table-hover
                                table-sm
                                table-responsive-sm
                                font-weight-light
                                text-center"
                        style={{fontSize: '12px', width: '100%'}}
                    >
                        <thead>
                        <tr>
                            <th rowSpan={"2"} >Car Name</th>
                            <th rowSpan={"2"} >Region</th>
                            <th colSpan={"4"} >Sold Total</th>
                            <th rowSpan={"2"} >Price</th>
                        </tr>
                        <tr>
                            <th>1m</th>
                            <th>3m</th>
                            <th>6m</th>
                            <th>12m</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/*{ data.map((data, index) => (*/}
                        {/*    <IteratorComponent data={data} key={`asd ${index}`} />*/}
                        {/*))}*/}
                        <tr>
                            <td>Regular</td>
                            <td>1 May 2019</td>
                            <td>
                                <h6 className={"text-success"}>
                                    <FontAwesomeIcon icon={['fas','angle-double-down']} />
                                    30%
                                </h6>
                            </td>
                            <td>
                                <h6 className={"text-danger"}>
                                    <FontAwesomeIcon icon={['fas','angle-double-up']} />
                                    30%
                                </h6>
                            </td>
                            <td>
                                <h6 className={"text-danger"}>
                                    <FontAwesomeIcon icon={['fas','angle-double-up']} />
                                    30%
                                </h6>
                            </td>
                            <td>
                                <h6 className={"text-danger"}>
                                    <FontAwesomeIcon icon={['fas','angle-double-up']} />
                                    30%
                                </h6>
                            </td>
                            <td><span className="text-primary"> Rp. 900.000.000,- </span></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}
}

DetailTable.defaultProps = {
    isActive: " ",
};