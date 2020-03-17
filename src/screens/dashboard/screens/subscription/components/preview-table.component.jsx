import React, {Component} from 'react';
import $ from 'jquery';
import dataTable from 'datatables.net-bs4';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload, faCheck, faHistory} from '@fortawesome/free-solid-svg-icons'
import {Formik, Field} from 'formik';

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

export default class PreviewTable extends Component {
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
                null, null, null
            ],
            "bLengthChange": false,
            "bFilter": false,
            "searching": false,
            "bInfo" : false,
            "paging": false
        });
    }

    render() {
        const { items } = this.props;
        return (
            <div className="table col-12 px-0" style={{fontSize: '12px'}}>
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
                            <th>Package</th>
                            <th>Active For</th>
                            <th>Your total Subscription Active Until</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{ items["0"].packages_name }</td>
                            <td>{ items["0"].packages_detail["0"].duration }</td>
                            <td>{ items["0"].packages_detail["0"].total_date }</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )}
}

PreviewTable.defaultProps = {
    isActive: " ",
};

const customField = ({
                         field,
                         ...props
                     }) => {
    let label =
        props.label ? <label className="form-label">{props.label}</label> : '';
    return (
        <div className="form-item">
            {label}
            <input {...field} {...props}
                   className={"form-control "}
                   style={{
                       width: '200px',
                       borderRadius: '10px',
                       border: '2px solid #ddd',
                       marginTop: '10px'
                   }}
            />
        </div>
    )
};