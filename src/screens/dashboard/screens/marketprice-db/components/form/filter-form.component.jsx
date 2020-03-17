import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { selectInput, TextField, SelectModel } from 'components/input';
import { setAll } from 'components/helper';
import { connect } from 'react-redux';
import { translateOptions } from 'components/helper';

const formScheme = [
    {name: "startYear", option: "year"},
    {name: "endYear", option: "year"},
    {name: "ownerType", option: "ownerType"},
]

const filterScheme = Yup.object().shape({
    brand: Yup.string().required('Required'),
    series: Yup.string().required('Required'),
    model: Yup.string().required('Required'),
    period: Yup.string().required('Required'),
});

class FilterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advanceFilter: true,
            searchResult: this.props.resultz,
            values: this.props.defaults || {},
            modelValue: "All",
        }
        this.handleModelChange = this.handleModelChange.bind(this);
    }

    handleModelChange(value) {
      this.setState({modelValue: value});
    }

    btnFilter() {
        this.setState({advanceFilter: !this.state.advanceFilter})
    }
    btnSerach() {
        this.setState({searchResult: !this.state.searchResult});
        this.setState({advanceFilter: !this.state.advanceFilter});
    }

    render() {

        const { options } = this.props;

        return (
            <Formik
                initialValues={this.state.values}
                enableReinitialize={true}
                validationSchema={filterScheme}
                ref={this.formik}
                onSubmit={(values, actions) => {
                    values.model = this.state.modelValue;
                    this.setState({ values: values, searchResult: true});

                    translateOptions(values, options, formScheme, result => {
                        result.period = result.period === "" ? 0 : result.period;
                        result.cylinder = result.cylinder === "" ? "all" : result.cylinder;
                        result.type = result.type === "" ? "all" : result.type;
                        result.endYear = result.startYear > result.endYear ? "" : result.endYear ;
                        this.props.onSubmit(result);
                    });
                    this.btnSerach();
                }}
                onReset={values => {
                    const nullified = setAll(values, "");
                    this.setState({ values: nullified });
                }}
                render={props => {
                    const { values, errors, handleSubmit, handleReset } = props;

                    var intStartYear = parseInt(values.startYear);
                    var filteredYear = options.year.filter(tahun => {
                        if(intStartYear > 0)
                            return tahun.key >= intStartYear || tahun.key === ""
                        return true;
                    });

                    return (
                        <form action="" className="card">
                            <div className="row filter-comp">
                                <div className="col-md-12 d-flex justify-content-between">
                                    <h6 className="title">FILTER</h6>
                                    <div className="float-right">
                                        <span className="collapse-show" onClick={() => this.btnFilter()} style={{fontSize:'14px', cursor: 'pointer' }}>
                                            {!this.state.advanceFilter ? "Tampilkan" : "Sembunyikan"} Filter {!this.state.advanceFilter ? <GoChevronDown></GoChevronDown> : <GoChevronUp></GoChevronUp>}
                                        </span>
                                    </div>
                                </div>

                                {this.state.advanceFilter &&
                                <div className="form-group col-md-12" style={{marginBottom: '0px'}}>
                                <div className="divider-title ibid">
                                        <span>KENDARAAN</span>
                                        <hr/>
                                    </div>

                                    <div className="advanceForm">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Field component={selectInput} name="brand" label={[`Merk`, 'top']} options={options.brand} />
                                                <Field name="period" component={selectInput} label={["Periode", 'top']} options={options.period} />
                                            </div>
                                            <div className="col-md-3">
                                                <Field component={selectInput} name="series" label={["Seri", 'top']} options={options.series} parent={values.brand} />
                                                <Field component={SelectModel} modelChange={this.handleModelChange} name="model" label={["Model", 'top']} options={options.model} />
                                            </div>
                                            <div className="col-md-3">
                                                <Field component={selectInput} name="cylinder" label={["Silinder", 'top']} options={options.cylinder} parent={values.series} />
                                            </div>
                                            <div className="col-md-3">
                                                <Field component={selectInput} name="type" label={["Tipe", 'top']} options={options.type} parent={values.cylinder} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divider-title ibid">
                                        <span>SPESIFIKASI KENDARAAN</span>
                                        <hr/>
                                    </div>
                                    <div className="advanceForm">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Field component={selectInput} name="grade" label={["Grade", 'top']} options={options.grade} />
                                                <Field name="color" component={selectInput} label={["Color", 'top']} options={options.color} />
                                            </div>
                                            <div className="col-md-3">
                                                <Field component={selectInput} name="transmission" label={["Transmisi", 'top']} options={options.transmission} />
                                            </div>
                                            <div className="col-md-3">
                                                <div className="block" style={{margin: '0 0 10px 0'}}>
                                                    <div className="range-form">
                                                        <Field
                                                            name="startYear"
                                                            component={selectInput}
                                                            label={["Tahun", 'top']}
                                                            options={options.year}/>
                                                        <span style={{marginTop: '10%'}}>-</span>
                                                        <Field
                                                            name="endYear"
                                                            component={selectInput}
                                                            label={[" ", 'top']}
                                                            disabled={values.endYear}
                                                            options={filteredYear}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                            <div className="range-form">
                                                <Field
                                                    name="minKm"
                                                    component={TextField}
                                                    label={["Odometer", 'top']}
                                                    placeholder="Awal"
                                                    type="number"
                                                    />
                                                <span style={{marginTop: '10%'}}>-</span>
                                                <Field
                                                    name="maxKm"
                                                    component={TextField}
                                                    label={[" ", 'top']}
                                                    placeholder="Akhir"
                                                    type="number"
                                                    disabled={values.endYear}/>
                                            </div>
                                                { /* <Field name="odometer" component={selectInput} label={["Odometer", 'top']} options={options.odometer} /> */ }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="divider-title ibid">
                                        <span>PERIHAL LELANG</span>
                                        <hr/>
                                    </div>

                                    <div className="advanceForm">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <Field name="ownerType" component={selectInput} label={["Atas Nama", 'top']} options={options.ownerType} />
                                                <Field name="stnk" component={selectInput} label={["STNK", 'top']} options={options.stnk} />
                                            </div>
                                            <div className="col-md-3">
                                                <Field name="city" component={selectInput} label={["Kota Lelang", 'top']} options={options.city} />
                                                {/* <Field name="bpkb" component={selectInput} label={["Leadtime BPKB", 'top']} options={options.bpkb} /> */}
                                            </div>
                                            <div className="col-md-3">
                                                <Field name="platNo" component={selectInput} label={["Plat Nomor", 'top']} options={options.platNo} />
                                            </div>
                                            <div className="col-md-3">
                                                <Field name="location" component={selectInput} label={["Aktual Lokasi", 'top']} options={options.location} />
                                            </div>
                                        </div>
                                    </div>

                                <hr />
                                <div className="d-flex float-right">
                                    <div  onClick={handleReset} className="btn ibid secondary" style={{margin: '0 5px'}}>RESET FILTER</div>
                                    <div  onClick={handleSubmit} disabled={Object.keys(errors).length > 0} className={"btn ibid primary " + (Object.keys(errors).length> 0 ? "disabled" : "")} style={{margin: '0 5px'}}>SUBMIT</div>
                                </div>

                                </div>
                                }

                            </div>
                        {/* <pre>
                            {"values: " + JSON.stringify(values, null, 2)}
                        </pre> */}
                        </form>
                    )
                }}
            />
        )
    }
}

const mapStateToProps = state => ({
    ...state.appReducer
})

export default connect(mapStateToProps)(FilterForm);
