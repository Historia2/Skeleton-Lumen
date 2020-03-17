import React, {Component, Suspense, lazy} from 'react';
import axios from 'axios';
import {IoMdHome, IoMdPricetag, IoIosStats} from 'react-icons/io';
import {Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from 'services';
import anime from "animejs";


import {
    HeaderComponent,
    SidebarComponent,
    NoticeCardComponent,
} from './components';

import {
    OverviewScreen,
    InsightsScreen,
    MarketPriceDBScreen,
    DetailScreen,
    NotFound,
    TeasersScreen,
    SubscriptionScreen,
    InsightRate,
    InsightSegment,
    SupplyDemand
} from './screens';

import UserProfile from './components/user-profile.component';
// const UserProfile = React.lazy(() => import('./components/user-profile.component'));

class Dashboard extends Component {
    constructor(props) {
        super(props);
        //determine if user is on demo account or not
        let options;
        if (localStorage.getItem('email') === 'userdemo041@gmail.com') {
            //if in demo account
            options = [
                {
                    'title': 'Overview',
                    'path': 'overview',
                    'icon': <IoMdHome className='icon'/>,
                    'component': OverviewScreen,
                    active: false
                },
            ];
        } else {
            //if in non-demo account
            let verified = localStorage.getItem('verified');

            if (parseInt(verified) !== 0) {
                options = [
                    {
                        'title': 'Overview',
                        'path': 'overview',
                        'icon': <IoMdHome className='icon'/>,
                        'component': OverviewScreen,
                        active: false,
                        dropdown: false
                    },
                    {
                        'title': 'Insights',
                        'path': 'insights',
                        'icon': <IoIosStats className='icon'/>,
                        'component': InsightsScreen,
                        active: false,
                        dropdown: [
                            {
                                'title': 'Overview',
                                'path': 'insights',
                                'component': InsightsScreen
                            },
                            // {
                            //     'title': 'Sold Rate',
                            //     'path': 'insights/rate'
                            // },
                            // {
                            //     'title': 'Segmentation',
                            //     'path': 'insights/segment'
                            // },
                            // {
                            //     'title': 'Supply & Demand',
                            //     'path': 'insights/supply-demand'
                            // },
                        ]
                    },
                    {
                        'title': 'Market Price DB',
                        'path': 'marketplace_db',
                        'icon': <IoMdPricetag className='icon'/>,
                        'component': MarketPriceDBScreen,
                        active: false,
                        dropdown: false,
                        restricted: false
                    },
                ];
            } else {
                options = [
                    {
                        'title': 'Overview',
                        'path': 'overview',
                        'icon': <IoMdHome className='icon'/>,
                        'component': OverviewScreen,
                        active: false,
                        dropdown: false
                    },
                    {
                        'title': 'Insights',
                        'path': 'insights',
                        'icon': <IoIosStats className='icon'/>,
                        'component': InsightsScreen,
                        active: false,
                        dropdown: [
                            {
                                'title': 'Overview',
                                'path': 'insights',
                                'component': InsightsScreen
                            },
                            // {
                            //     'title': 'Sold Rate',
                            //     'path': 'insights/rate'
                            // },
                            // {
                            //     'title': 'Segmentation',
                            //     'path': 'insights/segment'
                            // },
                        ],
                        restricted: false
                    },
                    {
                        'title': 'Market Price DB',
                        'path': 'marketplace_db',
                        'icon': <IoMdPricetag className='icon'/>,
                        'component': MarketPriceDBScreen,
                        active: false,
                        dropdown: false,
                        restricted: false
                    },
                ];
            }

        }
        this.state = {
            'isNoticed': localStorage.getItem('subsTime') <= 7,
            'redirect': undefined,
            'option': options,
        };
        this.closeCurtain = this.closeCurtain.bind(this);
        this.closeCheckout = this.closeCheckout.bind(this);
        this.openCheckout = this.openCheckout.bind(this);
        this.openCurtain = this.openCurtain.bind(this);
    }

    componentDidMount() {
        let screen = this.props.match.params.screen;
        // Set the selected menu in options
        this.changePage(screen || 'overview');
        this.openCurtain = this.openCurtain.bind(this);
    }

    componentWillMount() {
        let path = this.props.location.pathname;
        let history = this.props.history;

        axios.defaults.headers.common['Authorization'] = `bearer ${localStorage.getItem('token')}`;
        if (localStorage.getItem('token') !== 'tokenized') {
            axios.interceptors.response.use((response) => {
                return response;
            }, function (error) {
                // Do something with response error
                if (error.response.status === 401) {
                    history.push('/login');
                    console.log('unauthorized, logging out ...');
                    logout();
                }
                return Promise.reject(error.response);

            });
        }
        // Check the path and Redirect if Necessary
        if (path === '/dashboard' || path === '/dashboard/') {
            history.push('/dashboard/overview');
        }
    }

    changePage(target) {
        let option = this.state.option;

        // Find the index of active option
        const activeIndex = option.indexOf(option.find(x => x.active === true));
        // Deactivating the active option if exist
        if (typeof activeIndex !== 'undefined' && activeIndex >= 0) {
            option[activeIndex].active = false;
        }

        //Activating new option
        const targetIndex = option.indexOf(option.find(x => x.path === target));
        // Activating the target option if exist
        if (typeof targetIndex !== 'undefined' && targetIndex >= 0) {
            option[targetIndex].active = true;
        }

        this.setState({'option': option});
    }

    closeCheckout() {
        anime({
            targets: '.checkout-container',
            opacity: '0',
            marginRight: '-1500px'
        });
    }

    closeCurtain() {
        anime({
            targets: '.curtain',
            opacity: '0',
            begin: function () {
                document.querySelector(".curtain").style.zIndex = "0";
            }
        });
    }

    openCurtain() {
        anime({
            targets: '.curtain',
            opacity: '0.5',
            begin: function () {
                document.querySelector(".curtain").style.display = "block";
                document.querySelector(".curtain").style.zIndex = "10000000";
            }
        });
        this.openCheckout();
    }

    openCheckout() {
        return anime({
            targets: '.checkout-container',
            opacity: '1',
            marginRight: '0',
            right: '0'
        });
    }

    render() {
        const {isSidebarActive} = this.props;

        let verified = localStorage.getItem('verified');
        return (
            <div className="structure">
                <UserProfile/>
                <div className="header">
                    <HeaderComponent onClickHome={(path) => this.changePage(path)}/>
                </div>
                <div className={"sidebar" + (isSidebarActive ? ' active' : '')}>
                    <SidebarComponent option={this.state.option} onClick={(path) => this.changePage(path)}/>
                </div>
                <div className="body">
                    <div onClick={() => {
                        this.closeCurtain();
                        this.closeCheckout();
                    }} className={"curtain"}>
                    </div>
                    {/* Notice */}
                    {this.state.isNoticed && <NoticeCardComponent action={e => {
                        this.setState({isNoticed: false});
                    }}/>}

                    <Switch>
                        <Route path='/dashboard/overview' component={OverviewScreen} exact/>
                        {   
                            //origin !== 0
                            parseInt(verified) !== 0 ? <Route path='/dashboard/insights' component={InsightsScreen} exact/> : ''}
                        { parseInt(verified) !== 0 ? <Route path='/dashboard/insights/rate' component={InsightRate} exact/> : ''}
                        { parseInt(verified) !== 0 ? <Route path='/dashboard/insights/segment' component={() =>
                            <InsightSegment openCurtain={this.openCurtain} />
                        } exact/> : ''}
                        { parseInt(verified) !== 0 ? <Route path='/dashboard/insights/supply-demand' component={SupplyDemand} exact/> : ''}
                        { parseInt(verified) !== 0 ? <Route path='/dashboard/marketplace_db' component={MarketPriceDBScreen} exact/> : '' }
                        { parseInt(verified) !== 0 ? <Route path='/dashboard/detail' component={DetailScreen} exact/> : '' }
                        { parseInt(verified) !== 0 ? <Route path='/dashboard/detail/:id' component={DetailScreen} exact/> : '' }
                        { parseInt(verified) !== 0 ? <Route path='/dashboard/teaser' component={TeasersScreen} exact/> : '' }
                        <Route path='/dashboard/subscription' component={
                            () => <SubscriptionScreen
                                openCurtain={this.openCurtain}
                                closeCheckout={() => {
                                    this.closeCheckout();
                                    this.closeCurtain()
                                }}
                            />
                        } exact/>
                        <Route component={NotFound} exact/>
                    </Switch>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    ...state.dashboardReducer
})

const mapDispatchToProps = dispatch => ({
    // simpleAction: () => dispatch(simpleAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
