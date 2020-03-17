import React, {Component} from 'react';
import PreviewTable from "./components/preview-table.component";

export default class Preview extends Component {
    constructor(props) {
        super(props);
        this.formatMoney = this.formatMoney.bind(this);
    }

    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ".") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        const values = this.props.location.state;
        const items = values.package_detail;
        let total = this.formatMoney(parseInt(values.price).toFixed(2), ".", ",");
        let ppn = this.formatMoney((parseInt(values.price) / 100 * 10).toFixed(2), ".", ",");
        let subTotal = this.formatMoney((parseInt(values.price) + (parseInt(values.price) / 100 * 10)).toFixed(2), ".", ",");
        return (
            <div className={"preview-container container-fluid"}>
                <div className={"row"}>
                    <div className={"preview-content my-5 col-6 mx-auto"}>
                        <div className={"preview-header px-2 py-3 row"}>
                            <div className={"col-12 text-white"}>
                                <h3 className={"mb-0"}> Invoice </h3>
                                <sup> {values.invoice_number} </sup>
                            </div>
                        </div>
                        <div className={"preview-body px-0 pt-3 row"}>
                            <div className={"preview-company-info col-6"}>
                                <h4 className={"preview-company-info_name"}>Market Auction Price - Ibid</h4>
                                <p className={"preview-company-info_address"}>
                                    {values.sender_address}
                                </p>
                            </div>
                            <div className={"preview-user-info col-6"}>
                                <span className={"preview-user-info_to text-primary"}> to: </span>
                                <p className={"preview-user-info_address"}>
                                    {values.name} ( {values.company} ) <br/>
                                    {values.company_address}
                                </p>
                            </div>
                            <div className={"preview-package-info py-3 col-12"}>
                                <h4 className={"preview-package-info_name text-primary"}>
                                    {items["0"].packages_name}
                                </h4>
                                <p className={"preview-package-info_desc"}>
                                    {items["0"].packages_detail["0"].descriptions}
                                </p>
                            </div>
                            <div className={"preview-table-info col-12 px-0"}>
                                <PreviewTable items={items}/>
                            </div>
                            <div className={"preview-total text-right col-12"}>
                                <h5> Total Rp. {total},- </h5>
                                <sup> PPn(10%) Rp. {ppn},- </sup>
                                <h6 className={"mt-3"}> SubTotal Rp. {subTotal},- </h6>
                            </div>
                        </div>
                        <div className={"preview-button text-center col-12 mb-5"}>
                            <form action={values.end_point} method={"post"} id="MerchatPaymentPage" name="MerchatPaymentPage">
                                { Object.keys(values.doku_requirement).map((data) => (
                                    <input type={"hidden"} name={data} id={data} value={values.doku_requirement[data]} />
                                ))}
                                <button type={"submit"} className={"btn btn-lg ibid primary"}> Proses </button>
                            </form>
                        </div>
                        <div className={"preview-footer col-12 row px-0 pb-3 mx-0"}>
                            <div className={"col-6"}>
                                Market Auction Price - Ibid
                            </div>
                            <div className={"col-6 text-right"}>
                                Page - 1
                            </div>
                        </div>

                    </div>
                </div>
            </div>
    )
    }

    }