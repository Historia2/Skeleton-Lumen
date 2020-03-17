import React, {Component} from 'react';

export default class SegmentPoint extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {openCurtain} = this.props;
        return (
            <div className={"pick-segment-container container-fluid"}>
                <IteratorPickSegment openCurtain={openCurtain}/>
            </div>
        )
    }
}

class IteratorPickSegment extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className={"pick-segment-body row"}>
                <div className={"col-12"}>
                    <h3> Minibus </h3>
                </div>
                <div className={"col-12"}>
                    <sup> 50% data - <b> Jakarta </b> </sup>
                </div>
                <div className={"pick-segment-body_percentage-bar"}>

                </div>
            </div>
        )
    }
}