import React, { Component } from 'react'
import { getNestedObject } from 'components/helper';


export default class SelectLegacy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        };
    }

    option(props) {
        return (
            //<option key={`option_${props.key}_${props.value}`} value={props.key} disabled={props.disabled || false}>{props.value}</option>
            <option key={`option_${props.key}_${props.value}`} value={props.key}>{props.value}</option>
        );
    }

    render() {

        return (
            <select
            onChange={(th) => this.props.onChange({
                name: th.target.name,
                value: th.target.value
            })}
            className={"form-control form-control-sm "+this.props.className}
            name={this.props.name}
            id={this.props.id}
            defaultValue={this.props.default}>
                {this.props.placeholder && this.option({key: null, value: this.props.placeholder, disabled: true}) }
                {this.props.options.map((data) => this.option(data))}
            </select>
        )
    }
}

export const SelectEdge = ({
    field,
    form: { touched, errors, values },
    ...props
  }) => (
    <div className="form-item">
        <span className="better-label">Periode <span style={{ color: 'red' }}>*</span></span>
        <select {...field} {...props}
            defaultValue="null"
            className={"form-control " +
                (values[field.name] && "valid")} >
            {/* {props.placeholder && <option value="">{props.placeholder}</option>} */}
            {props.options.map((data) => <option key={data.key} value={data.key}>{data.value}</option>)}
        </select>
    </div>
);


// export const Select = ({
  //     field,
  //     form: { touched, errors, values },
  //     ...props
  // }) => {
  //     // let disabled = false;
  //     const dependency = ('depend' in props);
  //     const inheritance = ('parent' in props);
  //     const disabled = dependency ? !props.depend : inheritance ? !props.parent : false;

  //     // const disabled = (props.childOf || props.dependOf) === '' ? !(props.childOf || props.dependOf) || false : false;
  //     return(
  //         <div className="form-item">
  //             { ('label' in props) ? props.label[1] === 'top' && <label className="form-label">{props.label[0]}</label> : ''}

  //             <select {...field} {...props}
  //                 disabled={disabled}
  //                 defaultValue="null"
  //                 className={"form-control form-control-sm " +
  //                     (values[field.name] ? "valid" : 'invalid') +
  //                     (props.extraClass ? props.extraClass: '') } >
  //                 {/* {props.placeholder && <option value="">{props.placeholder}</option>} */}
  //                 {props.options.filter(o => {
  //                     if(inheritance)
  //                         return o.parent === props.parent || o.parent === "";
  //                     else
  //                         return true;
  //                 })
  //                     .map((data) => (<option key={field.name + '_' + data.key} value={data.key}>{data.label}</option>))}
  //             </select>
  //         </div>
  //     )
// };

export class SelectModel extends Component {

  constructor(props) {
    super(props);
    this.state = {value: 'All'};

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const {modelChange} = this.props;
    this.setState({value: event.target.value});
    modelChange(event.target.value);
  }

  componentDidUpdate(prevProps) {
    const {form: { setFieldValue, values }, field: { name }, options, } = this.props;
    // Reset Cild Value on "onChange" event
    if (prevProps.parent !== this.props.parent) {
      const keys = name.split(".");
      let vall = getNestedObject(values, keys)
      const option = [...options].find(e => e.key === vall) || {};
      if(this.props.parent !== option.parent)
        setFieldValue(name, '')
    }
  }

  render() {
    const { modelChange, field, form: { errors, touched }, ...props } = this.props;
    const isDepend = ('depend' in props);
    const isInheritance = ('parent' in props);
    const disabled = isDepend ? !props.depend : isInheritance ? !props.parent : false;
    const valuePath = field.name.split('.');

    return (
      <div className="form-item">
        {('label' in props) ? props.label[1] === 'top' && <label className="form-label">{props.label[0]}</label> : ''}

        <select {...field} {...props}
          // disabled={disabled}
          value={this.state.value}
          onChange={(e) => {this.handleChange(e)} }

          className={"form-control form-control-sm " +
            ((getNestedObject(errors, valuePath) && getNestedObject(touched, valuePath)) ? "invalid" : 'valid') +
            (props.extraClass ? props.extraClass : '')} >
          {/* {props.placeholder && <option value="">{props.placeholder}</option>} */}
          {props.options.filter(o => {
            if (isInheritance)
              return o.parent === props.parent || o.parent === "";
            else
              return true;
          })
            .map((data) => (<option key={field.name + '_' + data.key} value={data.key}>{data.label}</option>))}
        </select>
      </div>
    )
  }

}

export class Select extends Component {
  componentDidUpdate(prevProps) {
    const {form: { setFieldValue, values }, field: { name }, options, } = this.props;
    // Reset Cild Value on "onChange" event
    if (prevProps.parent !== this.props.parent) {
      const keys = name.split(".");
      let vall = getNestedObject(values, keys)
      const option = [...options].find(e => e.key === vall) || {};
      if(this.props.parent !== option.parent)
        setFieldValue(name, '')
    }
  }

  render() {
    const { field, form: { errors, touched }, ...props } = this.props;
    const isDepend = ('depend' in props);
    const isInheritance = ('parent' in props);
    const disabled = isDepend ? !props.depend : isInheritance ? !props.parent : false;
    const valuePath = field.name.split('.');
    return (
      <div className="form-item">
        {('label' in props) ? props.label[1] === 'top' && <label className="form-label">{props.label[0]}</label> : ''}

        <select {...field} {...props}
          disabled={disabled}
          className={"form-control form-control-sm " +
            ((getNestedObject(errors, valuePath) && getNestedObject(touched, valuePath)) ? "invalid" : 'valid') +
            (props.extraClass ? props.extraClass : '')} >
          {/* {props.placeholder && <option value="">{props.placeholder}</option>} */}
          {props.options.filter(o => {
            if (isInheritance)
              return o.parent === props.parent || o.parent === "";
            else
              return true;
          })
            .map((data) => (<option key={field.name + '_' + data.key} value={data.key}>{data.label}</option>))}
        </select>
      </div>
    )
  }

}
