import React from 'react';
import RegisterForm from './components/register-form.component';
import swal from 'sweetalert';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'isOpen': false
        }
    }

    // redirect() { this.props.history.push('/dashboard'); }

    popup({status, message}) {
        message = message.split("<a");
        const buttons = {
            ok: {
                text: "Ok",
                value: false,
                className: "btn ibid positive"
            }
        }
        if (status) {
            // this.props.history.push('dashboard');
        } else {
            if(message.length > 1) buttons.close = {
                text: "Daftar Sekarang",
                value: true,
                className: "btn ibid positive"
            };
            swal({
                title: "Maaf",
                text: message[0],
                icon: "warning",
                dangerMode: true,
                buttons: {...buttons},
            }).then((value) => {
                if(value) window.open("https://ims-frontend-charlie.ibid.astra.co.id/register", "_blank")
            });
        }
    }

    render() {
        return (
            <div className="landing-page">
                <div className="left">
                    <div className="logo">
                        <img src={require('assets/images/logo_white.png')} alt="logo"/>
                    </div>
                    <h1>Market Auction Price</h1>
                    <p> Market Auction Price (MAP) adalah aplikasi yang menyediakan
                        informasi harga pasaran mobil lelang terlengkap di Indonesia.
                        Buatlah keputusan yang tepat dan menguntungkan, karena semua informasi
                        harga pasaran mobil yang mau Anda beli atau jual ada disini.</p>
                </div>
                <div className="right">
                    <RegisterForm onAuth={response => this.popup(response)} />
                </div>
            </div>
        );
    }
}