import React, { Component } from 'react';
import Lottie from 'react-lottie';
import animationData from '../../assets/json/errorAnimation.json'

export default class ErrorAnimation extends Component {

    constructor(props) {
        super(props);
        this.state = {isStopped: false, isPaused: false};
    }

    render() {

        const { message, subMessage } = this.props;

        const defaultOptions = {
            loop: false,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return <div>
            <Lottie options={defaultOptions}
                    height={100}
                    width={100}
                    isStopped={this.state.isStopped}
                    isPaused={this.state.isPaused}/>
            <h6 style={{
                textAlign: 'center',
                marginBottom: '3px',
                marginTop: '10px',
            }}> {message} </h6>
            <sup style={{
                textAlign: 'center',
                margin: 'auto',
                width: '100%',
                display: 'inline-block',
            }}> { subMessage } </sup>
        </div>
    }
}