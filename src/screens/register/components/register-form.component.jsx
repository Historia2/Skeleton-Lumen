import React, {Component} from 'react';
import {Formik, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {MAP_DEV, HTTP_CONFIG} from 'services';

import {Loading} from 'components/structure';
import SuccessAnimation from "../../../components/structure/success-animation.component";
import ErrorAnimation from "../../../components/structure/error-animation.component";

import $ from 'jquery';

function equalTo(ref, msg) {
    return Yup.mixed().test({
        name: 'equalTo',
        exclusive: false,
        params: {
            reference: ref.path,
        },
        test: function (value) {
            return value === this.resolve(ref);
        },
    });
}

Yup.addMethod(Yup.string, 'equalTo', equalTo);

const registerScheme = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .min(6, 'Email Too Short! Min 6 Characters')
        .max(50, 'Email Too Long! Max 50 Characters')
        .required('This field is required!'),
    password: Yup.string()
        .min(6, 'Password too Short! Min 6 Characters')
        .max(50, 'Password too Long! Max 50 Characters')
        .required('This field is required!'),
    phone: Yup.number('Mus be a valid number'),
    fullname:Yup.string()
        .required('This field is required!'),
    passwordConfirm: Yup.string().equalTo(Yup.ref('password'), 'Passwords must match').required('This field is required!'),
});

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isSuccess: false,
            isError: false,
            values: {}
        }
        this.resubmit = this.resubmit.bind(this);
    }

    resubmit() {
        this.setState({
            isLoading:false,
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.isError) {
            $('#resubmit').click();
        }
    }

    render() {
        return (
            <div className={"sign-container"}>
                {/* <hr/> */}
                {this.state.isLoading ? (
                    this.state.isSuccess ?
                        <SuccessAnimation message={"Registration Success"}
                                          subMessage={[<span>Please check your email for activation</span>]}/> :

                        (this.state.isError ?
                                <ErrorAnimation message={"Your registration failed due to connection issues"}
                                                subMessage={[<span> click <button className={"btn-link"}
                                                onClick={()=>this.resubmit()}> here </button> to resubmit your form </span>]}/> :
                                <Loading logo={"false"}/>
                        )

                ) : (
                    <Formik
                        initialValues={this.state.values}
                        validationSchema={registerScheme}
                        onSubmit={ async (values, actions) => {

                            let isExists = await axios.post(MAP_DEV.check_user,{
                                'login': $('#email').val()
                            }, HTTP_CONFIG)
                                .then((response) => {
                                    let message = response.data.message;
                                    return message === 'User Exist';
                                }).catch((e) => {
                                console.warn(e);
                            });
                            if (isExists) {
                                actions.setErrors({
                                    email:'This email already used'
                                });
                                return false;
                            }
                            this.setState({
                                isLoading: true,
                                isError:false,
                                isSuccess:false,
                                values:values,
                            });
                            axios.post(MAP_DEV.register_user, {
                                email: values.email,
                                password: values.password,
                                first_name: values.fullname,
                                last_name: ' ',
                                company: values.company,
                                phone: values.phone,
                                subscription_status: 1
                            }, HTTP_CONFIG).then((response) => {
                                this.setState({
                                    isSuccess: true
                                });
                            }).catch((e) => {
                                console.error(e);
                                this.setState({
                                    isError: true,
                                })
                            })
                        }}
                        render={props => {
                            return (
                                <div>
                                    <div className={"title"}>Register</div>
                                    <form action={""} className={"form-group"} onSubmit={props.handleSubmit}>
                                        <Field component={customField} placeholder={"Fullname"} label={"Fullname"}
                                               name={"fullname"} type={"text"} value={this.state.values.fullname} required/>
                                        <sup> <ErrorMessage name={"fullname"}/> </sup>
                                        <Field component={customField} placeholder={"Email Adress"} label={"Email"}
                                               name={"email"} id={"email"} type={"email"} value={this.state.values.email} required/>
                                        <sup> <ErrorMessage name={"email"}/> </sup>
                                        <Field component={customField} placeholder={"Phone"} label={"Phone"}
                                               name={"phone"} type={"number"} value={this.state.values.phone} required/>
                                        <sup> <ErrorMessage name={"phone"}/> </sup>
                                        <Field component={customField} placeholder={"Company"} label={"Company"}
                                               name={"company"} type={"text"} value={this.state.values.company}/>
                                        <Field component={customField} placeholder={"Password"} label={"Password"}
                                               name={"password"} type={"password"} value={this.state.values.password}
                                               required/>
                                        <sup> <ErrorMessage name={"password"}/> </sup>
                                        <Field component={customField} placeholder={"Confirm Password"}
                                               label={"Confirm Password"} name={"passwordConfirm"} type={"password"}
                                               value={this.state.values.passwordConfirm} required/>
                                        <sup> <ErrorMessage name={"passwordConfirm"}/> </sup>
                                        <div className={"row mt-3"}>
                                            <div className={"col-6"}>
                                                <button type={"submit"} id={"resubmit"}
                                                        className={"btn btn-lg ibid positive"}
                                                        style={{width: "100%"}}>SUBMIT
                                                </button>
                                            </div>
                                            <div className={"col-6"}>
                                                <a href={"/login"} className={"btn btn-link ibid text-primary"}
                                                   style={{width: "100%"}}>or Login</a>
                                            </div>
                                        </div>
                                    </form>
                                </div>
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
                     }) => {
    let asterisk = (typeof props.required === "undefined" ? '' : <sup className={"text-danger"}> * </sup>);
    return (
        <div className={"form-item"}>
            <label className={"form-label"}>{props.label}{asterisk}</label>
            <input {...field} {...props}
                   className={"form-control " + (touched[field.name] && errors[field.name] ? "invalid" : "")}/>
        </div>
    )
};
