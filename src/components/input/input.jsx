import React, { Component } from 'react'

export default class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        };
    }

    option(props) {
        return (
            <option key={`option_${props.key}_${props.value}`} value={props.key}>{props.value}</option>
        );
    }

    render() {

        return (
            <select className="form-control form-control-sm" name={this.props.name} id={this.props.id} defaultValue="null">
                {this.props.default && this.option({ key: null, value: this.props.default })}
                {this.props.options.map((data) => this.option(data))}
            </select>
        )
    }
}
