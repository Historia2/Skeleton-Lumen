import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
import dataTable from 'datatables.net-bs4';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faDownload, faCheck, faHistory} from '@fortawesome/free-solid-svg-icons'
import {Formik, Field} from 'formik';
import {HTTP_CONFIG, MAP_DEV} from '../../../../../services/config';
import axios from 'axios';

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
        this.state = {}
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

export default class SubscriptionTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSet: this.props.data,
            searchTable: ''
        }
        this.continuePayment = this.continuePayment.bind(this);
    }

    continuePayment(invoice_number) {
        axios.post(MAP_DEV.payment.get_record,{
            invoice_id:invoice_number
        },HTTP_CONFIG)
            .then((response) => {
                console.log(response,'response log');
            })
    }

    componentDidMount() {
        $('#table-result').DataTable({
            responsive: true,
            "columns": [
                {
                    "title": "Paket",
                    "data": 'subscriptions.package_name'
                },
                {
                    "title": "Extended For",
                    "data": 'subscribed_for'
                },
                {
                    "title": "Status",
                    "data": 'status'
                },
                {
                    "title": "Order Date",
                    "data": 'created_at'
                },
                {
                    "title": "Action",
                    "data": 'action',
                    "render": function (action, type, row) {
                        return row.status_raw === "pending" ? ReactDOMServer.renderToStaticMarkup(<a href={"javascript:void(0)"} > Continue Payment </a>) : (ReactDOMServer.renderToStaticMarkup(<a href={action} target={'_blank'}><FontAwesomeIcon title={"download invoice"} className={"download-invoice"} icon={faDownload}/></a>))
                    }
                },
            ],
            "bLengthChange": false,
            "bFilter": false,
            "searching": true,
            "processing": true,
            "serverSide": true,
            "ajax": {
                url: MAP_DEV.subscription_datatable,
                data: {
                    'user_id':localStorage.getItem('plainUserId'),
                },
                'beforeSend': function (request) {
                    request.setRequestHeader("Authorization",`bearer ${localStorage.getItem('token')}`);
                }
            },
            "pageLength": 5
        });
    }

    handleChange = (e) => {
        $('#table-result').DataTable().search(e.target.value).draw();
    };

    render() {
        const data = this.props.data;
        return (
            <div className="table col-12 mt-3 table-subscriptions" style={{fontSize: '12px'}}>
                <div className={"table-header container-fluid"}>
                    <div className={"row pt-3 pl-3 pb-3 table-header_filter"}>
                        <div className={"d-none"}>
                            <div className={"col-1 table-header_filter-icon text-center"} title={"Filter by Completed"}>
                                <div className={"circle mb-1 "}>
                                    <FontAwesomeIcon icon={faCheck} size={"2x"}/>
                                </div>
                                <span className={"table-header_filter-icon-label"}>Completed</span>
                            </div>
                            <div className={"col-1 text-center table-header_filter-icon"} title={"Filter by Expired"}>
                                <div className={"circle mb-1"}>
                                    <FontAwesomeIcon icon={faHistory} size={"2x"}/>
                                </div>
                                <span className={"table-header_filter-icon-label"}>Expired</span>
                            </div>
                        </div>
                        <div className={"col-2"}>

                            <Formik
                                initialValues={this.state.values}
                                render={props => {
                                    return (
                                        <form>
                                            <Field component={customField} onChange={this.handleChange} placeholder={"Search "}
                                                   name="security_code" type="text"/>
                                        </form>
                                    )
                                }}
                            />
                        </div>
                        <div className={"col-10 text-right table-header_title pt-3"}>
                            <h6> Subscription History </h6>
                            <sup> </sup>
                        </div>
                    </div>
                </div>
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
                    </table>
                </div>
            </div>
        )
    }
}

SubscriptionTable.defaultProps = {
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