import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {toggleSidebar, showProfile} from 'actions/dashboard.action';
import anime from "animejs";

const premiumStyle = {
    color: 'yellow',
    left: '5px',
    cursor:'pointer'
};

class SidebarComponent extends Component {
    constructor(props) {
        super(props);

        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }


    toggleDropdown(parent) {
        if (!this.state.dropdownOpen) {
            anime({
                targets: '.' + parent + ' .menu-dropdown',
                height: '100%',
                easing: 'linear',
                duration: 100,
            });
            this.setState({dropdownOpen: true});
        } else {
            anime({
                targets: '.' + parent + ' .menu-dropdown',
                height: '0px',
                easing: 'linear',
                duration: 100,
            });
            this.setState({dropdownOpen: false});
        }
    }

    MenuItem(param, i) {
        let navigation,
            navigationItem,
            dropdownItem,
            dropdownClass;
        if (param.dropdown) {
            dropdownItem = [];
            param.dropdown.forEach(createDropdown);

            function createDropdown(item, index) {
                dropdownItem.push(
                    <li className={"menu-dropdown_item"}>
                        <NavLink key={'menu-dropdown_item_' + param.title + index} to={`/dashboard/${item.path}`}>
                            {item.title}
                        </NavLink>
                    </li>
                );
            }

            navigationItem =
                <ul className={"menu-dropdown mb-0"}>
                    {dropdownItem}
                </ul>;
            dropdownClass = 'dropdown';

            navigation =
                param.restricted === true ?
                    <NavLink to={'#!'}>
                        <div className={"menu-item " + dropdownClass + " " + (param.active ? "active" : "")}
                             onClick={() => this.props.onClick(param.path)}>
                            {param.icon}
                            <div className="title text-white-50">{param.title} <sup style={premiumStyle}> Premium </sup></div>
                        </div>
                        {navigationItem}
                    </NavLink>
                :
                <div className={"menu-nav menu-parent-" + i}>
                    <div className={"menu-item " + dropdownClass + " " + (param.active ? "active" : "")}
                         onClick={() => this.toggleDropdown("menu-parent-" + i)}>
                        {param.icon}
                        <div className="title">{param.title}{param.restricted === true ?
                            <sup style={premiumStyle}> Premium </sup> : ''}</div>
                    </div>
                    {navigationItem}
                </div>;

        } else {
            navigationItem = <div></div>;
            dropdownClass = '';
            navigation =
                param.restricted === true ?
                    <NavLink to={'#!'}>
                        <div className={"menu-item " + dropdownClass + " " + (param.active ? "active" : "")}
                             onClick={() => this.props.onClick(param.path)}>
                            {param.icon}
                            <div className="title text-white-50">{param.title} <sup style={premiumStyle}> Premium </sup></div>
                        </div>
                        {navigationItem}
                    </NavLink>
                    :
                    <NavLink key={'menu_item_' + i} to={`/dashboard/${param.path}`} onClick={this.props.toggleSidebar}>
                        <div className={"menu-item " + dropdownClass + " " + (param.active ? "active" : "")}
                             onClick={() => this.props.onClick(param.path)}>
                            {param.icon}
                            <div className="title">{param.title}</div>
                        </div>
                        {navigationItem}
                    </NavLink>;
            ;
        }
        return (
            <div>
                {navigation}
            </div>
        );
    }

    // Action to navigate

    render() {
        const { showProfile } = this.props;
        let menuItems = [];
        for (let i = 0; i < this.props.option.length; i++) {
            menuItems.push(this.MenuItem(this.props.option[i], i));
        }

        return (
            <div className="sidebar-container">
                <div className="menu">
                    {menuItems}
                </div>
                {
                // origin localStorage.getItem('verified') === '0'
                localStorage.getItem('verified') === false ?
                    <div>
                        <hr className={"mx-3"} />
                        <div className={"menu mx-3 pr-4"}>
                        <span style={{
                            fontSize:'10pt',
                            color:'white'
                        }}>
                            Please verify your account by sending you Id Card (KTP) at menu <span style={premiumStyle} onClick={() => showProfile()} >Profile</span>
                        </span>
                        </div>
                    </div>
                    : ''
                }
            </div>
        )
    }
}


const mapStateToProps = state => ({
    ...state.dashboardReducer
})

const mapDispatchToProps = dispatch => ({
    toggleSidebar: () => dispatch(toggleSidebar()),
    showProfile: () => dispatch(showProfile())
})

export default connect(mapStateToProps, mapDispatchToProps)(SidebarComponent);