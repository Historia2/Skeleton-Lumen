import React from 'react';
import { IoMdInformationCircleOutline as Icon } from 'react-icons/io';

export const Loading = ({ size = '',  logo = "true"},) => (
    <div className={"loading " + size}>
        { logo === "true" && <img className="logo" src={require('assets/images/logo_dark.png')} alt="loading ..."/> }
        <div className="loader"></div>
    </div>
);


export const PageState = ({title, text, icon = ""}) => {
    return (
        <div className="page-state">
            <Icon className={"icon " + icon} />
            {title && <span className="title">{title}</span>}
            {text && <span className="subtitle">{text}</span>}
        </div>
    )
}