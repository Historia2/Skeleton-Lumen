import React, {Component} from 'react';
import OfferingComponent from "./components/offering.component";
import SubscriptionTable from "./components/subscription-table.component";
import CheckoutComponent from "../../components/checkout.component";
import {HTTP_CONFIG, MAP_DEV} from '../../../../services/config';
import { dateFormater } from '../../../../../src/components/helper';
import { Loading } from '../../../../components/structure';

import axios from 'axios';

class SubscriptionLists extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { openCurtain, data, checkoutDetail } = this.props;
        return (
            <OfferingComponent
                openCurtain={() => {
                    openCurtain()
                }}
                duration={data.package_duration}
                pricing={data.price}
                packages={data.package_name}
                description={data.package_description}
                subscriptions_id={data.id}
                setDataCheckout={(pricing, description, packages, duration, subscriptions_id) => {
                    checkoutDetail(pricing, description, packages, duration, subscriptions_id)
                }}
                isActive={data.best_deal}
            />
        )
    }
}

class SubscriptionScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkoutDetail: {},
            data:[],
            isLoading: false,
        };
        this.setCheckoutDetail = this.setCheckoutDetail.bind(this);
        this.getSubscriptionPackage = this.getSubscriptionPackage.bind(this);
    }

    setCheckoutDetail(pricing, description, packages, duration, subscriptions_id) {
        let data = {
            pricing: pricing,
            description: description,
            packages: packages,
            duration: duration,
            subscriptions_id: subscriptions_id
        };
        this.setCheckoutDetail = this.setCheckoutDetail.bind(this);
        this.setState({checkoutDetail: data});
    }

    getSubscriptionPackage = async () => {
        this.setState({
            isLoading: true
        });
        let data = await axios.get(MAP_DEV.get_subscriptions_package, HTTP_CONFIG)
            .then((response) => {
                let data = response.data.data;
                this.setState({
                    isLoading: false
                });
                return data;
            }).catch((e) => {
                console.log(e);
            });
        return this.setState({
            data:data
        });
    };

    componentDidMount() {
        this.getSubscriptionPackage();
    }

    render() {
        const {openCurtain, closeCheckout} = this.props;
        const {checkoutDetail, data} = this.state;
        return (
            <div className="row wr content">
                <CheckoutComponent
                    closeCheckout={() => {
                        closeCheckout()
                    }}
                    checkoutDetail={checkoutDetail}
                />
                <div className={"col-12"}><h6 className={"text-danger pl-1"} style={{fontSize: '10pt'}}> Your Current subscription active until {dateFormater(localStorage.getItem('subsDate'))} </h6></div>
                <div className="col-12">
                    <div className="row px-0">
                        {
                            this.state.isLoading ?
                            <Loading logo={false} /> :
                            data.map((item,index) => (
                                <SubscriptionLists checkoutDetail={this.setCheckoutDetail} openCurtain={openCurtain} data={item} />
                            ))
                        }
                    </div>
                    <div className="row px-0">
                        <SubscriptionTable/>
                    </div>
                </div>
            </div>
        );
    }
}

export default (SubscriptionScreen);