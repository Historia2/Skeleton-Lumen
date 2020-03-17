import React  from 'react';

export const Loading = ({ size = '',  logo = "true", loaderStyle={}, loadingStyle={}},) => (
    <div className={"loading " + size} style={loadingStyle}>
        { logo === "true" && <img className="logo" src={require('assets/images/logo_dark.png')} alt="loading ..."/> }
        <div style={loaderStyle} className="loader" />
    </div>
);
// width: 18px;
// height: 18px;
// margin: 0;
export const LoadingButton = ({ size = '',  logo = "true"},) => (
    <div style={{
        width:'18px',
        height:'18px',
        margin:0
    }} className={"loading " + size}>
        { logo === "true" && <img className="logo" src={require('assets/images/logo_dark.png')} alt="loading ..."/> }
        <div className="loader loader-button" />
    </div>
);


export const LoadingPage = () => (
    <div className="loading-page">
        <Loading />
    </div>
);