import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import * as axios from 'axios';

import { Loading } from 'components/structure';
import { TextField } from 'components/input';
// eslint-disable-next-line
import { authenticate } from 'services';

const formSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, 'Terlalu Pendek!')
        .max(50, 'Terlalu Panjang!')
        .required(' '),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Password tidak cocok')
        .min(6, 'Terlalu Pendek!')
        .max(50, 'Terlalu Panjang!')
        .required(' ')
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
                url: window.location.href+"/../login"
            }
        }
    }

    changePassword = (userId, newPassword) => {
        const body = {
            userId: userId, 
            password: newPassword
        };
        axios.post(`http://changeUserPassword/${userId}`, body)
        .then(response => {
            // do something

        }).catch(err => {
            // do something
        
        });
        alert('Fungsi Ubah Password')
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
                        <div className="title">Ubah Password</div>
                        {/* <hr/> */}
                        { this.state.isLoading ? (
                            <Loading />
                        ) : (
                            <Formik 
                                initialValues={this.state.values}
                                validationSchema={formSchema}
                                render={props => {
                                    // eslint-disable-next-line
                                    const { values, handleSubmit, errors} = props;
                                    return (
                                        <form className="form-group">
                                            <Field component={TextField} label={["Password", "top"]} placeholder="New Password" name="password" type="password" />
                                            <Field component={TextField} label={["Konfirmasi Password", "top"]} placeholder="Re-Type Password" name="passwordConfirm" type="password" />
                                            <span style={{color: "red", fontSize: "12px", marginBottom: "10px"}}>{errors['passwordConfirm'] || ''}</span>
                                            <div className="actions vertical">
                                                <button onClick={e => this.changePassword(10, values.password)} disabled={errors.length <= 0} className="btn btn-lg ibid positive">Reset Password</button>
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
