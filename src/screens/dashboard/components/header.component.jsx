import React, { Component } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { connect } from 'react-redux';

import { showProfile, toggleSidebar } from 'actions/dashboard.action';
import { logout } from 'services';
import { Link } from 'react-router-dom';

const picture = require('assets/images/picture.jpg');

class HeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }

    render() {
        const { showProfile, toggleSidebar } = this.props;
        return (
            <div className="header-container">
                <div className="brand">
                    <Link to="/dashboard/overview">
                        <div className="logo" onClick={() => this.props.onClickHome('overview')}>
                            <img src={require('assets/images/logo.png')} alt=""/>
                        </div>
                    </Link>
                </div>
                <div className="sidebar-toggle" onClick={toggleSidebar}>
                    <IoMdMenu className='icon' />
                </div>
                <div className="title">Market Auction Price</div>
                <div className="title-alt">M.A.P</div>
                <div className="user">
                    <div className="name">{ localStorage.getItem('username') }</div>
                    <div className="picture" id="userOption" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="0,10">
                        <img src={picture} alt="pic" />
                    </div>
                    <div className="dropdown-menu" aria-labelledby="userOption">
                        <div className="profile">
                            <div className="pic"><img src={picture} alt="" /></div>
                            <div className="info">
                                <div className="username">{localStorage.getItem('username')}</div>
                                <div className="status">Subscribed</div>
                            </div>
                        </div>
                        <span className="dropdown-item" onClick={e => showProfile()}>Profile</span>
                        {/* <a className="dropdown-item" href="#">Another action</a> */}
                        <Link to={`/dashboard/`}><span className="dropdown-item" onClick={() => logout()}>Logout</span></Link>
                        <hr />
                        <Link to={'/dashboard/subscription'}><span className="dropdown-item"> Billing </span></Link>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    ...state.dashboardReducer
})

const mapDispatchToProps = dispatch => ({
    showProfile: () => dispatch(showProfile()),
    toggleSidebar: () => dispatch(toggleSidebar())
})

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
