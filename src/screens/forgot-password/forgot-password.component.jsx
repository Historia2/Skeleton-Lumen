import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';

import { Loading } from 'components/structure';
// eslint-disable-next-line
import { authenticate, BASE_URL } from 'services';

const forgotScheme = Yup.object().shape({
    username: Yup.string()
        .email('Invalid email')
        .min(6, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
});

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: props.login,
            loginForm: {},
            isLoading: false,
            values: {
                email: "",
                url: BASE_URL
            }
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
                        <div className="title">Forgot Password</div>
                        {/* <hr/> */}
                        { this.state.isLoading ? (
                            <Loading />
                        ) : (
                            <Formik
                                initialValues={this.state.values}
                                validationSchema={forgotScheme}
                                render={props => {
                                    // eslint-disable-next-line
                                    const { values, handleSubmit, errors} = props;
                                    return (
                                        <form className="form-group" action="https://adms-account-charlie.ibid.astra.co.id/MAP/users/ResetPassword" method="POST">
                                            <Field component={customField} placeholder="Email Address" autocomplete="off" name="email" type="email"></Field>
                                            <Field component={customField} name="url" type="hidden"></Field>
                                            <div className="actions vertical">
                                                {/* <div className="link">Lupa Password ?</div> */}
                                                <button type="submit" className="btn btn-lg ibid positive">Reset Password</button>
                                            </div>
                                        </form>
                                    );
                                }}
                            />
                        )}
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
