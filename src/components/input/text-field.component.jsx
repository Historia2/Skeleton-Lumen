import React from 'react';
import { getNestedObject } from 'components/helper';

export const TextField = ({
    field,
    form: { touched, errors },
    ...props
}) => {
    
    const valuePath = field.name.split('.');
    return (
        <div className="form-item">
            { ('label' in props) ? props.label[1] === 'top' && <label className="form-label">{props.label[0]}</label> : '' }
            <input {...field} {...props} className={"form-control " + ((getNestedObject(errors, valuePath) && getNestedObject(touched, valuePath)) ? "invalid " : "valid ") } />
        </div>
    )
};

export const labeledField = ({
    field,
    form: { touched, errors },
    ...props
}) => (
    <div className="form-item">
        <label className="form-label">{field.name}</label>
        <input {...field} {...props} className={"form-control " + props.inputClass + (touched[field.name] && errors[field.name] ? "invalid" : "")} />
    </div>
);