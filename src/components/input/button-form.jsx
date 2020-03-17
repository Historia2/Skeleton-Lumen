import React, { Component } from 'react';
import {TiDocumentText, TiMap, TiChartBar, TiChartLine, TiChartPie} from 'react-icons/ti'

export default class ButtonForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || null,
            buttons: [
                { title: 'Lines', value: 0, icon: <TiChartLine className="icon" /> },
                { title: 'Bar', value: 1, icon: <TiChartBar className="icon" /> },
                { title: 'Pie', value: 2, icon: <TiChartPie className="icon" /> },
                { title: 'Table', value: 3, icon: <TiDocumentText className="icon" /> },
                { title: 'Geo Map', value: 4, icon: <TiMap className="icon" /> }
            ]
        }
    }

    _onClick(val) {
        setTimeout(e => this.setState({'value': val}), 0);
        this.props.onChange(val);
        console.log(val);
    }

    componentDidUpdate(prevProps) {
        const { value } = this.props;
        if(prevProps.value !== value){
            let newValue = this.props.value;
            if (value === '') newValue = null
            this.setState({value: newValue})
        }
    }

    render() {
        return (
            <div className="form-item button-form">
                {('label' in this.props) ? this.props.label[1] === 'top' && <label className="form-label">{this.props.label[0]}</label> : ''}
                <div className={"buttons "+(this.props.error && "invalid")}>
                    {this.state.buttons.map((button, i) => (
                        <div 
                            onClick={() => this._onClick(button.value) } 
                            key={`button_group_item${i}`}
                            title={button.title} 
                            className={'btn'+(this.state.value === button.value ? ' active': '')}
                        >
                        {button.icon}
                        <span>{button.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}
