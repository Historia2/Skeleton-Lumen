import React, { Component } from 'react'
import $ from 'jquery';

export class Popup extends Component {

    componentDidUpdate() {
        const { isOpen } = this.props;
        if (isOpen === true)
            this.show();
        else if (isOpen === false)
            this.hide();
            $('#myModal').on('hidden.bs.modal', function () {
                alert('Hey');
            })
    }

    hide() { $(`#${this.props.id}`).modal('hide'); }
    show() { $(`#${this.props.id}`).modal('show'); }
    render() {
        const { id, title, children, backdrop, modalDialogStyle = false } = this.props;
        const config = backdrop === "static" ? {
            "data-backdrop": "static",
            "data-keyboard": "false"
        } : {};
        return (
            <div {...config} className="modal fade custom" id={id} role="dialog" show="true">
                <div className="modal-dialog modal-dialog-centered" style={modalDialogStyle ? modalDialogStyle : {maxWidth:'800px'}} role="document">
                    <div className="modal-content">
                        {/* Modal Title */}
                        {('title' in this.props) && (
                        <div className="modal-header">
                            <h6 className="modal-title title">{title}</h6>
                        </div> )}
                        {/* Modal Body */}
                        <div className="modal-body"> {children} </div>
                    </div>
                </div>
            </div>
        );
    }
}
