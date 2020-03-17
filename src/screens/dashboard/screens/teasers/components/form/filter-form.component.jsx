import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';

import { selectInput } from 'components/input';
import { setAll } from 'components/helper';
import { connect } from 'react-redux';
import { translateOptions } from 'components/helper';

const filterScheme = Yup.object().shape({
    year: Yup.string().required('Required'),
    period: Yup.string().required('Required'),
    brand: Yup.string().required('Required'),
    series: Yup.string().required('Required'),
    type: Yup.string().required('Required'),
    cylinder: Yup.string().required('Required'),
});

class FilterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advance: null,
            values: this.props.defaults || {},
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
                onSubmit={(values, actions) => {
                    this.setState({ values: values });
                    translateOptions(values, options, [], result => this.props.onSubmit(result));
                }}
                onReset={values => {
                    const nullified = setAll(values, "");
                    this.setState({ values: nullified });
                }}

                render={props => {
                    const { values, handleSubmit, handleReset, errors } = props;
                    return (
                        <form action="">
                            <div className="form-group">
                                <span className="title">FILTER</span>
                                <Field name="brand" component={selectInput} options={options.brand} />
                                <Field name="series" component={selectInput} options={options.series} parent={values.brand} />
                                <Field name="cylinder" component={selectInput} options={options.cylinder} parent={values.series} />
                                <Field name="type" component={selectInput} options={options.type} parent={values.cylinder} />
                                <Field name="year" component={selectInput} options={options.year} />
                                <Field name="period" component={selectInput} options={options.period} />
                                <hr/>
                                <Field name="transmission" component={selectInput} options={options.transmission} />
                                <Field name="city" component={selectInput} options={options.city} />
                                <Field name="location" component={selectInput} options={options.location} />
                                <Field name="platNo" component={selectInput} options={options.platNo} />
                            </div>
                            {/* <pre>
                                {"values: " + JSON.stringify(values, null, 2)}
                            </pre> */}
                            {/* Actions */}
                            <div className="action">
                                <div onClick={handleReset} className="btn ibid negative">Reset</div>
                                <div onClick={handleSubmit} disabled={Object.keys(errors).length > 0} className={"btn ibid positive " + (Object.keys(errors).length > 0 ? 'disabled': '')}>Process</div>
                            </div>
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