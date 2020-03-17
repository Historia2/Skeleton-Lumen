import React, {Component} from 'react';
import {Formik, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import $ from 'jquery';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {fab} from '@fortawesome/free-brands-svg-icons'
import {faCreditCard} from '@fortawesome/free-solid-svg-icons'
import {selectInput} from 'components/input';
import {OPTIONS} from "../../../constant";
import CustomCheckbox from './custom-checkbox.component';
import axios from "axios";
import {HTTP_CONFIG, MAP_DEV} from "../../../services";
import { LoadingButton } from '../../../components/structure';
import { Redirect } from 'react-router-dom';
import { dateFormater } from '../../../components/helper'

library.add(fab);

const checkoutScheme = Yup.object().shape({
    name: Yup.string()
        .required('Required'),
    company: Yup.string()
        .required('Required'),
    company_address: Yup.string()
        .required('Company Address is required'),
});

class CheckoutComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: {
                name: localStorage.getItem('username'),
                company: (localStorage.getItem('company') === null ? '' : localStorage.getItem('company')),
                company_address: ((localStorage.getItem('company_address') === 'null' || localStorage.getItem('company_address') === null) ? '' : localStorage.getItem('company_address')),
                sender_address: 'PT. SERASI AUTORAYA, Grha SERA, Jl. Mitra Sunter Boulevard Kav.90/C2, Sunter Jaya - Jakarta Utara 14350',
                price: 0,
                package_detail: [],
                package_name: '',
            },
            isLoading:false,
            isSuccess:false,
            isSuccessAndComplete:false,
            isDisabled:true
        };
        this.toRupiah = this.toRupiah.bind(this);
        this.logInvoices = this.logInvoices.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updatePackagesValues = this.updatePackagesValues.bind(this);
        this.addDays = this.addDays.bind(this);
        this.processActive = this.processActive.bind(this);
    }

    processActive() {
        this.setState({
            isDisabled: !this.state.isDisabled
        })
    }

    addDays(days) {
        let date = new Date(Date.parse(localStorage.getItem('subsDate')));
        date.setDate(date.getDate() + parseInt(days) + 1);

        let result = date.getFullYear() + '-' + ("0" + (date.getMonth() + 1)).slice(-2) + '-' + ("0" + (date.getDate()) ).slice(-2);
        return result;
    }

    logInvoices(values) {
        this.setState({
            isLoading:true,
        });
        const { checkoutDetail } = this.props;

        /**
         *
         * Updating User Address
         *
         * */
        axios.post(MAP_DEV.update_user_data,{
            'data': {
                'address':values.company_address
            },
            'where': {
                'id':localStorage.getItem('plainUserId')
            }
        },HTTP_CONFIG).then((response) => {
            localStorage.setItem('company_address',values.company_address);
        }).catch((e) => {
           console.warn(e)
        });


        this.state.values.company_address = values.company_address;
        let data = {
            user_id: localStorage.getItem('plainUserId'),
            sender_address: this.state.values.sender_address,
            receiver_address: values.company_address,
            price: checkoutDetail.pricing,
            subscriptions_id:checkoutDetail.subscriptions_id,
            items: JSON.stringify([{
                "packages_name": checkoutDetail.packages,
                "packages_price": checkoutDetail.pricing,
                "packages_detail":[{
                    "descriptions":checkoutDetail.description,
                    "total_date": dateFormater(this.addDays(checkoutDetail.duration)),
                    "duration": checkoutDetail.duration + " days"
                }]
                // sample data [{"name": "uhuy", "desc": "ihiy"}]
            }])
        };
        axios.post(MAP_DEV.invoices_log, data, HTTP_CONFIG)
            .then( async (response) => {
                let responseData = response.data.data;
                let message = response.data.message;
                if (message === 'instant payment') {
                    this.setState({
                        isSuccessAndComplete:true
                    })
                } else {
                    this.setState({
                        isLoading:false,
                        isSuccess:true,
                        values: {
                            name: localStorage.getItem('username'),
                            company: (localStorage.getItem('company') == 'null' ? '' : localStorage.getItem('company')),
                            company_address: values.company_address,
                            sender_address: 'PT. SERASI AUTORAYA, Grha SERA, Jl. Mitra Sunter Boulevard Kav.90/C2, Sunter Jaya - Jakarta Utara 14350',
                            price: checkoutDetail.pricing,
                            package_detail: [{
                                "packages_name": checkoutDetail.packages,
                                "packages_price": checkoutDetail.pricing,
                                "packages_detail":[{
                                    "descriptions":checkoutDetail.description,
                                    "total_date": dateFormater(this.addDays(checkoutDetail.duration)),
                                    "duration": checkoutDetail.duration + " days"
                                }]
                            }],
                            end_point:responseData.end_point,
                            invoice_number: responseData.invoice_number,
                            doku_requirement:responseData.doku_requirement,
                            duration: checkoutDetail.duration
                        }
                    });
                    await axios.post(MAP_DEV.payment.save_record,{
                        invoice_id:responseData.invoice_number,
                        requirement_detail:this.state.values
                    },HTTP_CONFIG);
                }
            })
            .catch((e) => {
                console.log(e,'errors');
            })
    }

    handleClick = () => {
        $('#checkoutForm').click();
    };

    toRupiah(number) {

        if (typeof number !== "undefined") {

            let separator;
            let number_string = number.toString(),
                sisa = number_string.length % 3,
                rupiah = number_string.substr(0, sisa),
                ribuan = number_string.substr(sisa).match(/\d{3}/g);

            if (ribuan) {
                separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }
            return rupiah;

        }
    }

    updatePackagesValues(checkoutDetail) {
        this.setState({
            price: checkoutDetail.pricing,
            package_detail: [{
                name:checkoutDetail.packages,
                desc:checkoutDetail.description,
                duration:checkoutDetail.duration
            }],
            package_name: checkoutDetail.packages,
        });

    }

    render() {
        const { closeCheckout, checkoutDetail } = this.props;
        const { isLoading, isSuccess, isSuccessAndComplete, values, isDisabled } = this.state;

        if ( isSuccess ) {
            return (
                <Redirect to={{
                    pathname: '/payment/preview',
                    state: values
                }}/>
            )
        }
        if ( isSuccessAndComplete ) {
            return (
                <Redirect to={{
                    pathname: '/payment/success'
                }}/>
            )
        }

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
                                    onSubmit={  (values, actions) => {
                                        this.logInvoices(values);
                                    }}
                                    render={props => {
                                        const { values, isLoading } = this.state;
                                        return (
                                            <form method={"post"} className={"form-group"} onSubmit={props.handleSubmit}>
                                                <Field component={customField}
                                                       placeholder={values.name}
                                                       label={"Full Name"}
                                                       name={"name"}
                                                       type={"text"}
                                                       isLoading={isLoading}
                                                />
                                                <Field component={customField}
                                                       placeholder={values.company}
                                                       label={"Company"}
                                                       name={"company"}
                                                       type={"text"}
                                                       isLoading={isLoading}
                                                />
                                                <Field component={textArea}
                                                       label={"Company Address"}
                                                       name={"company_address"}
                                                       isLoading={isLoading}
                                                />
                                                <sup> <ErrorMessage name={"company_address"} /> </sup>
                                                {/*<Field component={paymentCheckboxCC} name={"payment-cc"}/>*/}
                                                <button className={"d-none"} type={"submit"} id={"checkoutForm"} />
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
                                    <h6>1x {checkoutDetail.packages} ({checkoutDetail.duration})</h6>
                                    <div className={"py-0 mb-1"}>
                                        <h6 className={"checkout-body_payment-detail_item-description"}>
                                            {checkoutDetail.description}
                                        </h6>
                                    </div>
                                </div>
                                <div className={"col-5 text-right checkout-body_payment-detail_total"}>
                                    <span
                                        className={"checkout-body_payment-detail_total-text"}> Rp. {this.toRupiah(checkoutDetail.pricing)} </span>
                                </div>
                            </div>
                            <hr/>
                            <div className={"row"}>
                                <div className={"col-12"}>
                                    <CustomCheckbox name={"syarat-ketentuan"} onClick={() => this.processActive()} label={
                                        (
                                            <span>Dengan membeli paket berlangganan MAP, Anda telah
                                                    menyetujui <a href={"#!"}>syarat</a> dan <a
                                                    href={"#!"}>ketentuan</a> kami</span>
                                        )
                                    }/>
                                </div>
                            </div>
                            <div className={"mt-3 text-right"}>
                                <button className={"btn ibid gray mr-3"} onClick={closeCheckout}> Pilih paket lain
                                </button>
                                <button type={"submit"} className={"btn ibid primary"}
                                        disabled={isLoading || isDisabled}
                                        title={isDisabled ? 'Please check our Term and Condition first' : ''}
                                        onClick={this.handleClick}> {
                                    this.state.isLoading ?
                                        <LoadingButton logo={false}/> :
                                        <span> Proses </span>
                                } </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default (CheckoutComponent);

const textArea = ({
                      field,
                      form: {touched, errors},
                      value,
                      isLoading,
                      ...props,
                  }) => {
    return (
        <div className={"form-item"}>
            <label className="form-label">{props.label}</label>
            <textarea {...field} {...props} rows={6}
                      readOnly={isLoading}
                      className={"form-control " + (touched[field.name] && errors[field.name] ? "invalid" : "")}>value</textarea>
        </div>
    )
};

const customField = ({
                         field,
                         form: {touched, errors},
                         isLoading,
                         ...props
                     }) => {
    let label =
        props.label ? <label className="form-label">{props.label}</label> : '';
    return (
        <div className="form-item">
            {label}
            <input {...field} {...props}
                   readOnly={isLoading}
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
