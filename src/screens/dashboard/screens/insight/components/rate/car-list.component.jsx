import React, { Component } from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {faArrowAltCircleDown} from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery';

library.add(fas);

class CarList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgColor: [],
            bgColorActive: [],
        };
        this.getRandomColor = this.getRandomColor.bind(this);
        this.setRandomColor = this.setRandomColor.bind(this);
        this.setBackground = this.setBackground.bind(this);
    }

    getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    setRandomColor(target) {
        let color = this.state.bgColor;
        if (typeof color[target] !== "undefined") {
            return false
        }

        color[target] = this.getRandomColor();
        return this.setState({ bgColor:color });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(this.state.bgColorActive,'bgColor');
    }

    setBackground(target) {
        let color = this.state.bgColorActive;
        if (typeof color[target] !== "undefined") {
            return false
        }

        color[target] = this.state.bgColor[target];
        return this.setState({ bgColorActive:color });
    }

    render() {
        const IterateComponent = (target) => {
            return (
                <div className={"car-list-container_body row mb-5"} onMouseEnter={()=>this.setRandomColor(target.target)} onClick={()=>this.setBackground(target.target)} >
                    <div className={"car-list-container_body-image col-4 px-0"}>
                        <div className={"car-list-container_body-image_pillar"} style={{backgroundColor: typeof this.state.bgColorActive[target.target] !== 'undefined' ? this.state.bgColorActive[target.target] : '' }}> </div>
                        <img src={require('assets/images/not-found.png')} className={"img-fluid"} />
                    </div>
                    <div className={"car-list-container_body-description col-8 row"}>
                        <div className={"col-8 car-list-container_body-description-content"}>
                            <h4 className={"car-list-container_body-description_title"}>
                                Honda Jazz
                                2.1 SA
                            </h4>
                            <sup className={"car-list-container_body-description_price"}>
                                Rp. 900.000.000
                            </sup>
                            <button className={"car-list-container_body-description_button"}>  Compare Data  </button>
                        </div>
                        <div className={"col-4 d-flex"}>
                            <h6>
                                <FontAwesomeIcon icon={['fas','angle-double-up']} />
                                30%
                            </h6>
                        </div>
                    </div>
                </div>
            )
        };
        return (
            <div className={"car-list-container container"}>
                <IterateComponent target={0}/>
                <IterateComponent target={1}/>
                <IterateComponent target={2}/>
                <IterateComponent target={3}/>
                <IterateComponent target={4}/>
            </div>
        );
    }
}

export default (CarList);