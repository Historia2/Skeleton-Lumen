import React, { Component } from 'react';
import { connect } from 'react-redux';
import swal from 'sweetalert';
import { Popup } from 'components/structure';
import { getUniqueId } from 'components/helper';
import { Loading } from 'components/structure';
import { showPopUp, hidePopUp } from 'actions/popup.action';
import { addWidget, updateWidget } from 'actions/insight.action';
import { readProfile, createProfile, updateProfile } from './insights.service';
import { IoIosAdd } from 'react-icons/io';
import Draggable from './components/draggable.component';
import Dropable from './components/dropable.component';
import InsightsForm from './components/insights-form.component';
import InsightsWidget from './components/insights-widget.component';

class InsightsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            widgets: [[], []],
            isLoading: true,
            isEditing: false,
            isUpdating: false,
            isModalOpen: false,
            formValues: {}
        };
    }

    componentWillMount() {
        readProfile(widgets => {
            if(widgets.length > 0){
                this.setState({ widgets: widgets, isLoading: false });
            }else{
                createProfile(result => {
                    if(result) this.setState({ isLoading: false });
                });
            }
        })
    }

    _handleDelete(pos) {
        swal({
            title: "Hapus Widget ?",
            text: "Widget yang telah dihapus tidak dapat dikembalikan",
            icon: "warning",
            dangerMode: true,
            buttons: {
                no: {
                    text: "Batal",
                    value: false,
                    className: "btn ibid negative"
                },
                yes: {
                    text: "Hapus",
                    value: true,
                    className: "btn ibid positive"
                },
            },
        }).then((value) => {
            if(value === true){
                this.deleteWidget(pos)
                swal("Deleted", "Widget berhasil di hapus!", "success");
            }
        });
    }

    _handleSubmit(widget) {
        const newWidget = {...widget};
        if (this.state.isEditing) this.editWidget(this.state.isEditing, newWidget);
        else this.createWidget(newWidget);
        this._handleClose();
    }

    _handleEdit(pos) {
        this.props.showPopUp();
        pos = pos.split("-");
        const widget = {...this.state.widgets[pos[0]][pos[1]]};
        delete widget.id;
        this.setState({ formValues: widget, isEditing: pos})
    }

    _handleClose() {
        this.setState({formValues: {}, isEditing: false})
        this.props.hidePopUp();
    }

    /* --- Widgets Manipulator --- */

    // Create Widget
    createWidget(props) {
        const widgets = [...this.state.widgets];
        const col = widgets[0].length > widgets[1].length ? 1 : 0;

        const newWidget = {
            id: getUniqueId(),
            ...props,
        };
        widgets[col].push(newWidget);
        this.setState({ widgets: widgets, isUpdating: true });
        updateProfile(widgets, result => this.setState({isUpdating: false}));
    }

    editWidget(pos, widget) {
        // console.log(JSON.stringify(widget, '', 2));
        let widgets = [...this.state.widgets];
        widgets[pos[0]][pos[1]] = {
            ...widgets[pos[0]][pos[1]],
            ...widget
        };
        this.setState({ widgets: widgets, isUpdating: true });
        updateProfile(widgets, result => this.setState({isUpdating: false}));
    }

    // Update Widget Position
    moveWidget(origin, target) {
        const widgets = [...this.state.widgets];
        origin = origin.split("-");
        target = target.split("-");
        const originWidget = widgets[origin[0]][origin[1]];
        if(target[1] === "e") target[1] = widgets[target[0]].length;
        widgets[origin[0]].splice(origin[1], 1);
        widgets[target[0]].splice(target[1], 0, originWidget);
        this.setState({ widgets: widgets, isUpdating: true });
        updateProfile(widgets, result => this.setState({isUpdating: false}));
    }

    // Delete Widget Position
    deleteWidget(pos) {
        const widgets = [...this.state.widgets];
        pos = pos.split("-");
        widgets[pos[0]].splice(pos[1], 1);
        // console.log(widgets);
        this.setState({ widgets: widgets, isUpdating: true, toDelete: undefined });
        updateProfile(widgets, result => this.setState({isUpdating: false}));
    }

    render() {
        const { widgets, isLoading, isEditing } = this.state;
        const { showPopUp, popup: { isOpen } } = this.props;
        // const { isOpen } = this.props.popup;
        const isEmpty = (widgets[0].length + widgets[1].length) === 0;
        console.log(widgets[1],'widgets[1]');
        // console.log(widgets[1].length,'widgets[1].length');
        // console.log(widgets[0].length,'+ widgets[1].length');
        // console.log(widgets[0].length + widgets[1].length,'widgets[0].length + widgets[1].length');
        // console.log(isEmpty,'isEmpty');
        return (
            <div className="row wr content" style={{height: 'calc(100% - 60px)', display: 'block'}}>
                {/* Pop Up */}
                <Popup id="dashboardModal" isOpen={isOpen || false} title={isEditing ? "SUNTING WIDGET" : "TAMBAH WIDGET"} backdrop="static">
                    <InsightsForm
                        onSubmit={e => this._handleSubmit(e)}
                        onClose={e => this._handleClose()}
                        values={ this.state.formValues } />
                </Popup>

                { !isEmpty ? (
                    // Action Buttons
                    <div className="col-md-12 screen-title">
                        <div className="action btn-group">
                            <div className="btn hybrid ibid positive" onClick={showPopUp}>
                                <IoIosAdd />
                                <span>Tambah Widget</span>
                            </div>
                            {/* <div className="btn ibid negative" >Clear Layout</div> */}
                            {/* {this.state.isUpdating && <div>Updating ...</div>} */}
                        </div>
                    </div>
                ) : isLoading ? (
                        <Loading logo="false" />
                    ) : (
                        <EmptyState showPopUp={e => showPopUp()} />
                    )
                }
                <div className="widgets">
                    { !isEmpty && widgets.map((widgets, col) => {
                        return (
                        <Dropable key={`board_${col}`} handleDrop={origin => this.moveWidget(origin, `${col}-e`)}>
                            { widgets.map((widget, row) => {
                                const pos = `${col}-${row}`;
                                return (
                                    <Draggable key={widget.id} handleDrop={(origin, target) => this.moveWidget(origin, target)} pos={pos}>
                                        <InsightsWidget
                                            widgetId={widget.id}
                                            pos={pos}
                                            key={widget.id}
                                            chartConfig={widget}
                                            onUpdateWidget={(pos, newProp) => this.editWidget(pos, newProp) }
                                            onEdit={(pos, widgetId) => this._handleEdit(pos, widgetId)}
                                            onDelete={pos => this._handleDelete(pos)} />
                                    </Draggable>
                                )
                            })}
                        </Dropable>
                    )})}
                </div>
                {/* <pre>
                    {JSON.stringify(this.state.widgets, '', 2)}
                </pre> */}
            </div>
        )
    }
}

const EmptyState = ({showPopUp}) => {
    return (
        <div className="empty-state">
            <div className="icon"></div>
            <div className="text">Anda belum memiliki widget. Klik pada tombol Tambah Widget untuk memulai.</div>
            <div className="action">
                <div className="btn hybrid ibid positive" onClick={showPopUp}>
                    <IoIosAdd />
                    <span>Tambah Widget</span>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    ...state.appReducer,
    ...state.insightReducer,
    popup: state.popupReducer
})

const mapDispatchToProps = dispatch => ({
    showPopUp: () => dispatch(showPopUp()),
    hidePopUp: () => dispatch(hidePopUp()),
    addWidget: (payload) => dispatch(addWidget(payload)),
    updateWidget: (payload) => dispatch( updateWidget(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InsightsScreen);
