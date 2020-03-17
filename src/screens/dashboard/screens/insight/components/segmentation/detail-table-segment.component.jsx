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

export default class DetailTableSegment extends Component {
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
                null, null, null, null, null, null
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
                            <th>Type</th>
                            <th>Region</th>
                            <th className={"text-left"}>1 Month</th>
                            <th className={"text-left"}>3 Month</th>
                            <th className={"text-left"}>6 Month</th>
                            <th className={"text-left"}>12 Month</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>All-Type</td>
                            <td>Region</td>
                            <td className={"text-left"}>
                                <h3> 3.400 </h3>
                                <sup> % of Total : 50% (4.800) </sup>
                            </td>
                            <td className={"text-left"}>
                                <h3> 3.400 </h3>
                                <sup> % of Total : 50% (4.800) </sup>
                            </td>
                            <td className={"text-left"}>
                                <h3> 3.400 </h3>
                                <sup> % of Total : 50% (4.800) </sup>
                            </td>
                            <td className={"text-left"}>
                                <h3> 3.400 </h3>
                                <sup> % of Total : 50% (4.800) </sup>
                            </td>
                        </tr>
                        <tr>
                            <td>All-Type</td>
                            <td>Region</td>
                            <td className={"text-left"}>
                                <h3> 3.400 </h3>
                                <sup> % of Total : 50% (4.800) </sup>
                            </td>
                            <td className={"text-left"}>
                                <h3> 3.400 </h3>
                                <sup> % of Total : 50% (4.800) </sup>
                            </td>
                            <td className={"text-left"}>
                                <h3> 3.400 </h3>
                                <sup> % of Total : 50% (4.800) </sup>
                            </td>
                            <td className={"text-left"}>
                                <h3> 3.400 </h3>
                                <sup> % of Total : 50% (4.800) </sup>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}
}

DetailTableSegment.defaultProps = {
    isActive: " ",
};