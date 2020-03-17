import React, {Component} from 'react';

export default  class CustomCheckbox extends Component {
    constructor() {
        super()
    }

    render() {
        const {
            label,
            ...props
        } = this.props;
        return (
        <div className={"checkbox-option-container container"}>
            <div className={"checkbox-option-container_body row"}>
                <label className={"checkbox-option-container_body_radio"}>
                    <label className={"form-label"}> {label} </label>
                    <input type={"checkbox"} {...props} className={"form-control"}/>
                    <span className={"checkbox-option-container_body_radio-mark"}></span>
                </label>
            </div>
        </div>
        )
    }
}
