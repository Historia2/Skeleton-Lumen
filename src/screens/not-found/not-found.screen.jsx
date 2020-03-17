import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class NotFound extends Component {
  render() {
    return (
        <div className="empty-state" style={{background: '#f1f1f1'}}>
            <div className="icon"></div>
            <div className="text">Page not founds !</div>
            <div className="action">
                <Link to="/">
                    <div className="btn ibid negative">Back to Dashboard</div>
                </Link>
            </div>
        </div>
    )
  }
}
