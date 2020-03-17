import React, { Component } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import $ from 'jquery';

import { Loading } from 'components/structure';
// eslint-disable-next-line
import { authenticate } from 'services';

const loginScheme = Yup.object().shape({
    username: Yup.string()
        .email('Invalid email')
        .min(6, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
    password: Yup.string()
        .min(6, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Required'),
});

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: props.login,
            loginForm: {},
            isLoading: false,
            values: {
                username: localStorage.getItem('saved_username') || "",
                password: localStorage.getItem('saved_password') || "",
                remember: localStorage.getItem('saved_username') !== null ? true : false
            }
        }
    }

    componentDidMount() {
        if(localStorage.getItem('saved_username') !== null){
          $(`input[name="remember"]`).prop('checked',true);
        }
    }

    render() {
        return (
            <div className="sign-container">
                <div className="title">Login</div>
                {/* <hr/> */}
                { this.state.isLoading ? (
                    <Loading logo="false" />
                ) : (
                    <Formik
                        initialValues={this.state.values}
                        validationSchema={loginScheme}
                        onSubmit={(values, actions) => {
                            this.setState({isLoading: true})
                            authenticate(values, response => {
                                this.props.onAuth(response);
                                this.setState({isLoading: false});
                            });
                            this.setState({ loginForm: values});
                        }}
                        render={props => {
                            // eslint-disable-next-line
                            const { values, handleSubmit, errors, setFieldValue} = props;
                            return (
                                <form className="form-group" onSubmit={handleSubmit}>
                                    <Field component={customField} placeholder="Email Adress" name="username" type="email" />
                                    <Field component={customField} placeholder="Password" name="password" type="password" />
                                    <div className="actions vertical">
                                        <div className="split">
                                        <div className="remember">
                                            <input type="checkbox" name="remember" onChange={e => setFieldValue('remember', e.target.checked)} />
                                            <span>Ingat Saya</span>
                                        </div>
                                        <a href="forgot-password" className="link">Lupa Password ?</a>
                                        </div>
                                        <div className={'container-fluid px-0'}>
                                            <div className={'row h-auto'}>
                                                <div className={'col-6 h-auto'}>
                                                    <button type="submit" className="btn btn-lg ibid w100 positive">LOG IN</button>
                                                </div>
                                                <div className={'col-2 h-auto m-auto'}>
                                                    or 
                                                </div>
                                                <div className={'col-4 h-auto'}>
                                                    <a href={'register'} className={'btn btn-link'}> Register </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            );
                        }}
                    />
                )}
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
        <label className="form-label">{field.name}</label>
        <input {...field} {...props}
                className={"form-control " + (touched[field.name] && errors[field.name] ? "invalid" : "")} />
    </div>
);
