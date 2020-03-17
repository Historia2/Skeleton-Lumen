import React, {Component} from 'react';
import ErrorAnimation from "../../components/structure/error-animation.component";

export default class FailPayment extends Component {
    constructor(props) {
        super(props);

    }
    render() {
        return (
            <div className={"success-container container-fluid"}>
                <div className={"row"}>
                    <div className={"col-4 offset-sm-4 success-body text-center"}>
                        <h3 className={"text-danger"}> Payment Fail </h3>
                        <sup> We are sorry, something went wrong, please try again later </sup> <br/>
                        <sup> You can retry your payment at <span className={"text-danger"}> Subscriptions Log </span> </sup>
                        <div className={"mt-4 mb-1"}>
                            <ErrorAnimation />
                        </div>
                        <a href={"/dashboard/subscription"} className={"btn btn-link btn-lg mb-1"}> Back to Subscriptions </a>
                    </div>
                </div>
            </div>
        )
    }
}