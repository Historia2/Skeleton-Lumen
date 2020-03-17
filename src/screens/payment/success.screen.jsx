import React, {Component} from 'react';
import SuccessAnimation from "../../components/structure/success-animation.component";
import {HTTP_CONFIG, MAP_DEV} from '../../services/config';

import { dateFormater } from '../../../src/components/helper';
import axios from 'axios';

export default class SuccessPayment extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => { 
        axios.post(MAP_DEV.service.user.profile,{
            'id':localStorage.getItem('plainUserId')
        },HTTP_CONFIG)
            .then((response) => {
                localStorage.setItem('subsDate',response.data);
            })
            .catch((response) => {
                
            })
        // let EndDate = localStorage.getItem('subsDate');
        // EndDate = EndDate.
        // localStorage.setItem('subsDate', EndDate);
    }

    render() {
        return (
            <div className={"success-container container-fluid"}>
                <div className={"row"}>
                    <div className={"col-4 offset-sm-4 success-body text-center"}>
                        <h3 className={"success-body_text"}> Payment Success </h3>
                        <sup> Thanks for subscribing </sup>
                        <div className={"my-4"}>
                            <SuccessAnimation />
                        </div>
                        <a href={"/dashboard"} className={"btn btn-link btn-lg"}> Dashboard </a>
                    </div>
                </div>
            </div>
        )
    }
}