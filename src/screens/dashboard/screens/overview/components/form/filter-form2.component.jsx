import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import { selectInput } from 'components/input';
import { setAll } from 'components/helper';
import { connect } from 'react-redux';
import { translateOptions } from 'components/helper';
import * as Yup from 'yup';

const formScheme = [
    {name: "startYear", option: "year"},
    {name: "endYear", option: "year"}
]

const filterScheme = Yup.object().shape({
    city: Yup.string().required('Required'),
    period: Yup.string().required('Required'),
    startYear: Yup.string().required('Required'),
    endYear: Yup.string().required('Required'),
    brand: Yup.string().required('Required'),
    series: Yup.string().required('Required')
});

class FilterForm2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advance: null,
            values: this.props.defaults || {}
        }
    }
    render() {
        const { options } = this.props;
        
        return (
            <Formik
                ref={this.formik}
                initialValues={this.state.values}
                enableReinitialize={true}
                validationSchema={filterScheme}
                validate={values => {
                    let errors = {};
                    return errors;
                }}
                onSubmit={(values, actions) => {
                    this.setState({ values: values });
                    translateOptions(values, options, formScheme, result => this.props.onSubmit(result));
                }}
                onReset={values => {
                    const nullified = setAll(values, "");
                    this.setState({ values: nullified });
                }}
                render={props => {
                    const { values, handleSubmit, handleReset, errors, setFieldValue } = props;
                    
                    var intStartYear = parseInt(values.startYear);
                    var filteredYear = options.year.filter(tahun => {
                        if(intStartYear > 0)
                            // eslint-disable-next-line no-mixed-operators
                            return tahun.key >= intStartYear && tahun.key < intStartYear + 5 || tahun.key === ""
                        return true;
                    });
                    
                    return (
                        <form action="">
                            <div className="form-group" style={{ maxHeight: '380px' }}>
                                <span className="title">FILTER</span>
                                <Field name="city" component={selectInput} options={options.city} />
                                <Field name="period" component={selectInput} options={options.period} />
                                <div className="range-form">
                                    <Field name="startYear" component={selectInput} onChange={ e => {
                                        setFieldValue('startYear', e.target.value);
                                        setFieldValue('endYear', '')
                                    }} options={options.year} />
                                    <span>-</span>
                                    <Field name="endYear" component={selectInput} options={filteredYear} />
                                </div>
                                <Field name="brand" component={selectInput} options={options.brand} />
                                <Field name="series" component={selectInput} options={options.series} parent={values.brand} />
                                <Field name="cylinder" component={selectInput} options={options.cylinder} parent={values.series} />
                                <Field name="type" component={selectInput} options={options.type} parent={values.cylinder} />
                                {/* Advance Filter */}
                                <span 
                                    className="title link" 
                                    onClick={() => this.setState({ advanceFilter: !this.state.advanceFilter })}>
                                    {!this.state.advanceFilter && "SHOW "}
                                    ADVANCE FILTER
                                </span>
                                {this.state.advanceFilter && <div className="advance-filter">
                                    <Field name="fuelType" component={selectInput} options={options.fuelType} />
                                    <Field name="color" component={selectInput} options={options.color} />
                                    <Field name="stnk" component={selectInput} options={options.stnk} />
                                    <Field name="location" component={selectInput} options={options.location} />
                                    <Field name="platNo" component={selectInput} options={options.platNo} />
                                    <Field name="ownerType" component={selectInput} options={options.ownerType} />
                                    <Field name="odometer" component={selectInput} options={options.odometer} />
                                    {/* <Field name="bpkb" component={selectInput} options={options.bpkb} /> */}
                                </div>}
                            </div>
                            {/* Actions */}
                            <div className="action">
                                <div onClick={handleReset} className="btn ibid negative">Reset</div>
                                <div onClick={handleSubmit} disabled={Object.keys(errors).length > 0} className={"btn ibid positive " + (Object.keys(errors).length> 0 ? "disabled" : "")}>Process</div>
                            </div>
                            {/* <br />
                            <pre>
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

export default connect(mapStateToProps)(FilterForm2);