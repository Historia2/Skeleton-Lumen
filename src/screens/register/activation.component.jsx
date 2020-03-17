import React from 'react';
import SuccessAnimation from "../../components/structure/success-animation.component";
import ErrorAnimation from "../../components/structure/error-animation.component";
import axios from 'axios';
import { MAP_DEV, HTTP_CONFIG } from "../../services";
import { Loading } from 'components/structure';

export default class Activation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'isOpen': false,
            isLoading:true,
            isSuccess:false,
        }
    }

    componentDidMount() {
        let user_id = this.props.match.params.user_id;
        let activation_key = this.props.match.params.activation_key;

        axios.get(MAP_DEV.activation_user+'/'+user_id+'/'+activation_key, HTTP_CONFIG )
            .then((response) => {
                console.log(response.data.message,'response');
                if (response.data.message === 'User already activated') {
                    return this.setState({
                        isLoading:false,
                        isSuccess:false
                    })
                }
                return this.setState({
                    isLoading:false,
                    isSuccess:true
                })
            }).catch((e) => {
                console.error(e)
        })
    }

    render() {
        let result = this.state.isLoading ? <Loading logo={"false"} /> : (this.state.isSuccess ? <SuccessAnimation message={"Confirmation Success"} subMessage={[<span> You can <a href='/login'> login </a> here </span>]}/> : <ErrorAnimation message={"User Already Active"} subMessage={[<span> You can <a href='/login'> login </a> here </span>]}/>);
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
                    <div className="sign-container">
                        {result}
                    </div>
                </div>
            </div>
        );
    }
}