import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { Loading } from 'components/structure';
// eslint-disable-next-line
import { BASE_URL } from 'services';

const validationSchema = Yup.object().shape({
  password: Yup.string()
      .min(6, 'Too Short!')
      .max(50, 'Too Long!')
      .required("This field is required"),
  changepassword: Yup.string().when("password", {
    is: val => (val && val.length > 0 ? true : false),
    then: Yup.string()
      .min(6, 'Too Short!')
      .max(50, 'Too Long!')
      .oneOf(
      [Yup.ref("password")],
      "Both password need to be the same"
    )
  })
  .required('The field is Required')
});

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: props.login,
            loginForm: {},
            isLoading: false,
            resetSuccess: false,
            values: {
                email: "",
                password: "",
                url: BASE_URL+"/login"
            },
        }
    }

    render() {

        return (
            <div className="landing-page">
                <div className="left">
                    <h1>Market Auction Price</h1>
                    <p> Market Auction Price (MAP) adalah aplikasi yang menyediakan informasi harga pasaran mobil lelang terlengkap di Indonesia. Buatlah keputusan yang tepat dan menguntungkan, karena semua informasi harga pasaran mobil yang mau Anda beli atau jual ada disini.</p>
                </div>
                <div className="right">
                    <div className="sign-container">
                        <div className="title">Reset Password</div>
                        {/* <hr/> */}
                        { this.state.isLoading ? (
                            <Loading />
                        ) : (this.state.resetSuccess ? (<span> Success, please <a href="/login" > login here </a> with your new password  </span>) : (
                            <Formik
                                initialValues={{
                                    password: "",
                                    changepassword: "",
                                    url: this.state.values.url,
                                    enc: this.props.match.params.key
                                  }}
                                onSubmit={(values, actions) => {
                                    this.setState({isLoading: true})
                                    // resetPassword(values, response => {
                                    //   if (!response.status) {
                                    //     this.setState({resetSuccess: true});
                                    //   }
                                    //   this.setState({isLoading: false});
                                    // })
                                }}
                                validationSchema={validationSchema}
                                render={props => {
                                    // eslint-disable-next-line
                                    const { values,
                                            handleSubmit,
                                            errors,
                                            touched,
                                            dirty,
                                            isSubmitting,
                                            handleChange,
                                            handleBlur,
                                            handleReset,
                                            isValid,
                                          } = props;
                                    return (
                                        <form className="form-group" action="https://adms-account.ibid.astra.co.id/MAP/users/ResetPassword/apa" method="POST">
                                            <input type="hidden" name="url" value={this.state.values.url} />
                                            <input type="hidden" name="enc" value={this.props.match.params.key} />
                                            {/*<form className="form-group" action="https://adms-account-charlie.ibid.astra.co.id/MAP/users/ResetPassword" method="POST">*/}
                                            <Field component={customField} placeholder="Enter Password" name="password" type="password"></Field>
                                            <span class="error" style={{ color: "red" }}>
                                                {errors.password}
                                                </span>
                                            <Field component={customField} placeholder="Confirm Password" name="changepassword" type="password"></Field>
                                            <span class="error" style={{ color: "red" }}>
                                                {errors.changepassword}
                                            </span>
                                            <Field component={customField} name="url" type="hidden"></Field>
                                            <div className="actions vertical">
                                                {/* <div className="link">Lupa Password ?</div> */}
                                                <button type="submit" className="btn btn-lg ibid positive">Submit</button>
                                            </div>
                                        </form>
                                    );
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}

const customField = ({
    field,
    form: {touched, errors},
    ...props
}) => (
    <div className="form-item">
        <input {...field} {...props}
                className={"form-control " + (touched[field.name] && errors[field.name] ? "invalid" : "")} />
    </div>
);
