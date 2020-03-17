import React, {Component} from 'react';
import {Formik, Field} from 'formik';
import * as Yup from 'yup';
import $ from 'jquery';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {faCreditCard} from '@fortawesome/free-solid-svg-icons'
import {selectInput} from 'components/input';
import {OPTIONS} from "../../../constant";
import CustomCheckbox from './custom-checkbox.component';

library.add(fab);

const checkoutScheme = Yup.object().shape({
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

class PickSegment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                username: localStorage.getItem('saved_username') || "",
                password: localStorage.getItem('saved_password') || "",
                remember: localStorage.getItem('saved_username') !== null ? true : false
            }
        }
    }

    render() {
        const { closeCheckout } = this.props;
        return (
            <div className={"checkout-container container px-0"}>
                <div className={"checkout-header mt-2"}>
                    <div className={"row"}>
                        <div className={"col-12 px-5 py-3"}>
                            <h4 className={"checkout-header_text"}>
                                Subscription Payment Information
                            </h4>
                        </div>
                    </div>
                </div>
                <div className={"checkout-body"}>
                    <div className={"row"}>
                        <div className={"col-7 px-5 py-3"}>
                            <h5> Billing Details </h5>
                            <div className={"checkout-body_form"}>
                                <Formik
                                    initialValues={this.state.values}
                                    validationSchema={checkoutScheme}
                                    render={props => {
                                        return (
                                            <form>
                                                <Field component={customField}
                                                       placeholder={localStorage.getItem('username')} label="Full Name"
                                                       name="name" type="text"/>
                                                <Field component={customField}
                                                       placeholder={localStorage.getItem('company')} label="Company"
                                                       name="name" type="text"/>
                                                <Field component={textArea} label="Company Address" name="name"
                                                       type="text"/>
                                                <Field component={paymentCheckboxCC} name={"payment-cc"}/>
                                            </form>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                        <div className={"col-4 mr-5 mt-4 pt-2 checkout-body_payment-detail"}>
                            <label className="form-label mb-3"> Payment Summary </label>
                            <div className={"row"}>
                                <div className={"col-7 checkout-body_payment-detail_item"}>
                                    <h6>1x Regular Package (30 Days)</h6>
                                    <div className={"py-3 mb-1"}>
                                        <sup>
                                            Paket berlangganan fitur premium market auction
                                            place selama 1 bulan
                                        </sup>
                                    </div>
                                </div>
                                <div className={"col-5 text-right checkout-body_payment-detail_total"}>
                                    <span className={"checkout-body_payment-detail_total-text"}> Rp. 450.000,- </span>
                                </div>
                            </div>
                            <hr/>
                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <CustomCheckbox name={"syarat-ketentuan"} label={
                                        (
                                            <span>Dengan membeli paket berlangganan MAP, Anda telah
                                                    menyetujui <a href={"#!"}>syarat</a> dan <a
                                                    href={"#!"}>ketentuan</a> kami</span>
                                        )
                                    }/>
                                    <div className={"mt-2"}>
                                        <CustomCheckbox name={"syarat-ketentuan"} label={
                                            (
                                                <span>Aktifkan perpanjangan otomatis
                                                (Hanya berlaku dengan kartu kredit)</span>
                                            )
                                        }/>
                                    </div>
                                </div>
                            </div>
                            <div className={"mt-3 text-right"}>
                                <button className={"btn ibid gray mr-3"} onClick={closeCheckout}>  Pilih paket lain </button>
                                <button className={"btn ibid primary"}>  Proses </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default (PickSegment);

const textArea = ({
                      field,
                      form: {touched, errors},
                      ...props
                  }) => {
    return (
        <div className={"form-item"}>
            <label className="form-label">{props.label}</label>
            <textarea {...field} {...props} rows={6}
                      className={"form-control " + (touched[field.name] && errors[field.name] ? "invalid" : "")}></textarea>
        </div>
    )
};

const customField = ({
                         field,
                         form: {touched, errors},
                         ...props
                     }) => {
    let label =
        props.label ? <label className="form-label">{props.label}</label> : '';
    return (
        <div className="form-item">
            {label}
            <input {...field} {...props}
                   className={"form-control " + (touched[field.name] && errors[field.name] ? "invalid" : "")}/>
        </div>
    )
};


const paymentCheckboxCC = ({
                               field,
                               form: {touched, errors},
                               component,
                               ...props,
                           }) => {
    function openFields() {
        let paymentRadio = $('.payment-option-container_body_radio').find('input');
        $('.payment-option-container_extra-fields').toggleClass('d-none');
        paymentRadio.toggleClass('uncheck');
        paymentRadio.attr('checked', function (index, value) {
            return value === 'checked' ? false : 'checked'
        });
    }

    return (
        <div className={"payment-option-container container"}>
            <div className={"payment-option-container_body row"} onClick={() => openFields()}>
                <label className={"col-5 payment-option-container_body_radio"}>
                    Credit Card
                    <input type={"radio"} {...field} {...props}
                           className={"form-control uncheck " + (touched[field.name] && errors[field.name] ? "invalid" : "")}/>
                    <span className={"payment-option-container_body_radio-mark"}></span>
                </label>
                <div className={"col-7 text-right pr-1 payment-option-container_body_icons"}>
                    <FontAwesomeIcon icon={faCreditCard}/>
                    <FontAwesomeIcon icon={["fab", "cc-visa"]}/>
                    <FontAwesomeIcon icon={["fab", "cc-mastercard"]}/>
                    <FontAwesomeIcon icon={["fab", "cc-amazon-pay"]}/>
                </div>
            </div>
            <div className={"payment-option-container_extra-fields row d-none px-0"}>
                <div className={"col-12 px-0"}>
                    <label className="form-label"> Expiration Date </label>
                </div>
                <div className={"col-3 pl-0 pr-1"}>
                    <Field component={selectInput} options={OPTIONS.months} label="Full Name" name="name"/>
                </div>
                <div className={"col-3 pr-0 pl-1"}>
                    <Field component={selectInput} options={OPTIONS.years} label="Full Name" name="name"/>
                </div>
                <div className={"col-6 pr-0"}>
                    <Field component={customField} placeholder={"Security Code"} name="security_code" type="text"/>
                </div>
            </div>
        </div>
    )
};
