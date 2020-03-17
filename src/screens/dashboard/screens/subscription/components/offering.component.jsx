import React, {Component} from 'react';

export default class OfferingComponent extends Component {

    constructor(props) {
        super(props);
        // this.state
        this.toRupiah = this.toRupiah.bind(this);
    }

    toRupiah(number) {
        let separator;
        let	number_string = number.toString(),
            sisa 	= number_string.length % 3,
            rupiah 	= number_string.substr(0, sisa),
            ribuan 	= number_string.substr(sisa).match(/\d{3}/g);

        if (ribuan) {
            separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }
        return rupiah;
    }

    render() {
        const { isActive, duration, subscriptions_id, pricing, packages, setDataCheckout, openCurtain,description } = this.props;
        let footer, active, price;

        if (isActive === 1) {
            active = 'active';
            footer = <sub> <span>BEST DEAL!</span> - Extend Subscription </sub>;
        } else {
            footer = <sub className="text-danger"> Extend Subscription </sub>;
        }
        
        if (pricing !== 0) {
            price = <span>Rp. { this.toRupiah(pricing) }</span>
        } else {
            price = <span> Free </span>
        }

        return (
            <div onClick={() => { openCurtain(); setDataCheckout(pricing,description,packages,duration,subscriptions_id) }} className={"col-4 pr-0 offering-container offering-content "}>
                <div className={"offering-content_body " + active}>
                    <div className="offering-content_body-title">
                        <h6 className="offering-content_body-title-text"> {packages} </h6> <span> - {duration} days </span>
                    </div>
                    <div className="offering-content_body-content">
                        <h2 className="offering-content_body-content-price">
                            { price }
                        </h2>
                        {footer}
                    </div>
                </div>
            </div>
        );
    }
}

OfferingComponent.defaultProps = {
    isActive: " ",
    duration: "",
};