import React, { Component } from 'react'
import { IoIosArrowForward } from 'react-icons/io';

export default class BreadCrumb extends Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        const crumb = this.props.path.split("/").splice(1);
        let breadCrumb = [];
        for (let i = 0; i < crumb.length; i++) {
            breadCrumb.push(<div key={`arrow_${i}`} className="route"><IoIosArrowForward /></div>);
            breadCrumb.push(<div key={`crumb_${i}`} className="route">{crumb[i].replace(/_/g, ' ')}</div>);
        }
        // crumb.map((path, i) => {
        //     breadCrumb.push(<div key={`arrow_${i}`} className="route"><IoIosArrowForward /></div>);
        //     breadCrumb.push(<div key={`crumb_${i}`} className="route">{path}</div>);
        // })
        return (
            <div className="routes">
                <div className="route">MAP</div>
                { breadCrumb }
            </div>
        )
    }
}
