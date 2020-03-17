import React, { Component } from 'react'

export const Select = ({
    field,
    form: { touched, errors, values },
    ...props
}) => {
    // let disabled = false;
    const dependency = ('dependOn' in props);
    const inheritance = ('childOf' in props);
    const disabled = dependency ? !props.dependOn : inheritance ? !props.childOf : false;

    // const disabled = (props.childOf || props.dependOf) === '' ? !(props.childOf || props.dependOf) || false : false;
    return (
        <div className="form-item">
            {('label' in props) ? props.label[1] === 'top' && <label className="form-label">{props.label[0]}</label> : ''}

            <select {...field} {...props}
                disabled={disabled}
                defaultValue="null"
                className={"form-control form-control-sm " +
                    (values[field.name] ? "valid" : '') + (props.extraClass ? props.extraClass : '')} >
                {/* {props.placeholder && <option value="">{props.placeholder}</option>} */}
                {props.options.filter(o => {
                    if (inheritance) {
                        return o.parent == props.childOf || o.parent === '';
                    }
                    return true;
                })
                    .map((data) => (<option key={field.name + '_' + data.key} value={data.key}>{data.value}</option>))}
            </select>
        </div>
    )
};