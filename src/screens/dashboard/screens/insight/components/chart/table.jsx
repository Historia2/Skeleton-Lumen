import React, { Component } from 'react';

import $ from 'jquery';
import dataTable from 'datatables.net-bs4';
import { moneyFormatter } from 'components/helper'

$.DataTable = dataTable;


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
                <td>{data.merek}</td>
                <td>{data.seri}</td>
                <td>{data.silinder}</td>
                <td>{data.tipe}</td>
                <td>{data.tahun}</td>
                <td>{data.transmisi}</td>
                <td>{data.kota}</td>
                <td>{data.grade}</td>
                <td>{moneyFormatter(Math.floor(data.harga))}</td>
            </tr>
        )
    }
}

export default class Table extends Component {
    componentDidMount() {
        $('#table-result').DataTable({
            destroy: true,
            responsive: true,
            searching: false,
            lengthChange: false,
            paginate: false,
            info: false,
            autoWidth: true
        });
    }
    
    // componentDidUpdate(prevProps) {
    //     if(prevProps !== this.props && this.props.data.length > 0) {
    //         // console.log('re render');
    //         $('#table-result').DataTable({
    //             destroy: true,
    //             responsive: true,
    //             searching: false,
    //             lengthChange: false,
    //             paginate: false,
    //             info: false,
    //             autoWidth: true
    //         });
    //     }
    // }

    render() {
        $('#table-result').DataTable().destroy()
        const data = this.props.data;
        const { idx, metric } = this.props;
        return (
            <div id={idx} className="chart" style={{fontSize: '12px'}}>
                <span className="chart-title" style={{fontSize: '16px', fontWeight: '800'}}>Table {metric}</span>
                <div className="chart-content">
                    <table id="table-result"  className="table table-sm table-striped table-hover table-responsive">
                        <thead>
                            <tr>
                                <th>Merek</th>
                                <th>Seri</th>
                                <th>Silinder</th>
                                <th>Tipe</th>
                                <th>Tahun</th>
                                <th>Transmisi</th>
                                <th>Kota</th>
                                <th>Grade</th>
                                <th>Harga</th>
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
        )
    }
}
