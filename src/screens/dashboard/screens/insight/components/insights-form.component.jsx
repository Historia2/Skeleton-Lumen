import React, { Component } from 'react'
import { Formik, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { IoMdClose } from 'react-icons/io';
// import { translateOptions, decodeOptions } from 'components/helper';

import { OPTIONS as lov } from 'constant';
import { TextField, ButtonForm, Select } from 'components/input';
import { setAll } from 'components/helper';

const filterSchema = Yup.object().shape({
    brand: Yup.string().required('Required'),
    series: Yup.string().required('Required'),
    cylinder: Yup.string().required('Required'),
    type: Yup.string(),
    transmission: Yup.string(),
    year: Yup.string(),
});


const Schema = Yup.object().shape({
    name: Yup.string().required('Required'),
    chartType: Yup.string().required('Required'),
    metric: Yup.string().required('Required'),
    period: Yup.string().required('Required'),
    filters: Yup.array().of(filterSchema)
});

const defaultValue = {
    filters: [{
        brand: '',
        series: '',
        cylinder: '',
        type: 'All',
        transmission: 'All',
        year: 'All',
        grade: '',
        city: ''
    }],
    name: '',
    chartType: '',
    period: '',
    metric: ''
}

class InsightsForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {...defaultValue}
        }
        console.log(this.state.values,'vasasdlues')
    }

    componentDidUpdate(prevProps) {
        const { setValues, handleReset } = this.form;
        if(prevProps.values !== this.props.values) {
            handleReset();
            const values = {
                ...this.state.values,
                ...this.props.values
            }
            setTimeout(e => setValues(values) , 0);
        }
    }

    _onSubmit = (values) => {
        console.log(values,'valuesss');
        this.props.onSubmit(values);
    }

    _onClose = () => {
        this.props.onClose();
    }

    render() {
        const { options } = this.props;

        return (
            <Formik
                ref={node => (this.form = node)}
                initialValues={this.state.values}
                enableReinitialize={true}
                validationSchema={ Schema }
                onSubmit={(values, actions) => {
                    this.setState({ values: values });
                    actions.resetForm();
                    this._onSubmit(values);
                    let nullified = setAll(values, "");
                    nullified.filters = [{}];
                    actions.resetForm(nullified);
                }}
                onReset={values => {
                    let nullified = setAll(values, "");
                    nullified.filters = [...defaultValue.filters];
                    this.setState({ values: nullified });
                }}

                render={(props) => {
                    const { values, handleReset, handleSubmit, errors, touched } = props;
                    return (
                        <form className="form-group">
                            <Field
                                component={TextField}
                                name="name"
                                type="text"
                                label={["Widget Name", 'top']}
                                placeholder="Insert Widget Name" />
                            <ButtonForm
                                label={["Chart Type", "top"]}
                                value={values.chartType}
                                name="chartType"
                                error={errors.chartType && touched.chartType}
                                onChange={value => this.form.setFieldValue("chartType", value)} />
                            <div className="split">
                                <Field name="metric" component={Select} label={["Tampilkan Data", "top"]} options={lov.metric} parent={values.chartType === 2 ? "2" : "1"} />
                                <Field name="period" component={Select} label={["Periode Lelang", "top"]} options={options.period} />
                            </div>
                            <FieldArray
                                name="filters"
                                render={arrayHelpers => (
                                    <div className="filter-list">
                                            {values.filters.map((item, i) => {
                                                return (
                                                    <div className="filter-set" key={`filter_${i}`}>
                                                        <span className="form-label">Filter {i+1}</span> {(values.filters.length > 1) && <IoMdClose className="delete" onClick={e => arrayHelpers.remove(i)} />}
                                                        <div className="split-3">
                                                            <Field name={`filters.${i}.brand`} component={Select} options={options.insights.brand} />
                                                            <Field name={`filters.${i}.series`} component={Select} options={options.insights.series} parent={values.filters[i].brand} />
                                                            <Field name={`filters.${i}.cylinder`} component={Select} options={options.insights.cylinder} parent={values.filters[i].series} />
                                                            <Field name={`filters.${i}.type`} component={Select} options={options.insights.type} parent={values.filters[i].cylinder} />
                                                            <Field name={`filters.${i}.transmission`} component={Select} options={options.insights.transmission} />
                                                            <Field name={`filters.${i}.year`} component={Select} options={options.insights.year} />
                                                            { values.chartType !== 4 && <Field name={`filters.${i}.city`} component={Select} options={options.insights.city} /> }
                                                            <Field name={`filters.${i}.grade`} component={Select} options={options.insights.grade} />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {values.filters.length < 5 && (
                                                <div className="btn ibid wire" onClick={(e) => arrayHelpers.push({
                                                    brand: '',
                                                    series: '',
                                                    cylinder: '',
                                                    type: 'All',
                                                    transmission: 'All',
                                                    year: 'All'
                                                })}> + Add Filter </div>)}
                                            {2 === 0 &&  <div className="btn ibid wire">No Filter Available</div>}
                                    </div>
                                )}
                            />
                            <div style={{fontSize: "12px", color: "red"}}>{ Object.keys(errors).length > 0 && "Please fill required fields to proceed" }</div>
                            <div className="actions horizontal">
                                <button className="btn ibid secondary" type="reset" onClick={e => {
                                    this._onClose();
                                    handleReset();
                                }}>Close</button>
                                <button className="btn ibid primary" onClick={handleSubmit} type="button">Save changes</button>
                            </div>
                            {/* <pre>values: {JSON.stringify(values, "", 2)}</pre> */}
                        </form>
                    )
                }}
            />
        )
    }
}

const mapStateToProps = state => ({
    ...state.appReducer
});

export default connect(mapStateToProps)(InsightsForm);
