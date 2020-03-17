import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from './screens/login/login.screen';
import Dashboard from './screens/dashboard/dashboard.screen';
import NotFound from './screens/not-found/not-found.screen';
import ForgotPassword from './screens/forgot-password/forgot-password.component';
import ResetPassword from './screens/reset-password/reset-password.component';
import ChangePassword from './screens/change-password/change-password.screen';
import PreviewTable from "./screens/dashboard/screens/subscription/preview.screen";
import Register from "./screens/register/register.component";
import Activation from "./screens/register/activation.component";

import SuccessPayment from "./screens/payment/success.screen";
import FailPayment from "./screens/payment/fail.screen";

// import dashboardSubscription from'./screens/subscription/screens/dashboard.screen';

import { AuthRoute, GateRoute } from 'components/structure';
import { updateAppProperty } from "actions/app.action";
import { LoadingPage } from 'components/structure';
import { prerequisite } from 'services';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentWillMount() {
        const { options, updateAppProperty } = this.props;
        if (options === undefined) {
            prerequisite(newOptions => {
                console.log(newOptions,'newOptions');
                updateAppProperty({ options: newOptions });
                this.setState({ isLoading: false });
            })
        } else {
            this.setState({ isLoading: false })
        }
    }

    render() {

        return this.state.isLoading ? (
            <LoadingPage />
        ) : (
            <BrowserRouter basename="/">
                <Switch>
                    {/* {routes} */}
                    <GateRoute path='/' component={Login} exact />
                    <GateRoute path='/login' component={Login} exact />
                    <GateRoute path='/register' component={Register} exact />
                    <GateRoute path='/register/:user_id/:activation_key' component={Activation} exact />
                    <AuthRoute path='/dashboard' component={Dashboard} exact />
                    <AuthRoute path='/dashboard/:screen' component={Dashboard} />
                    <Route path="/forgot-password" component={ForgotPassword} />
                    <Route path="/reset-password/:key" component={ResetPassword} />
                    <Route path="/change-password" component={ChangePassword} />
                    <Route path="/payment/preview" component={PreviewTable} />
                    <Route path="/payment/success" component={SuccessPayment} />
                    <Route path="/payment/fail" component={FailPayment} />

                    {/*<Route path="/subscription" component={dashboardSubscription} />*/}
                    <AuthRoute component={NotFound} exact />
                </Switch>
            </BrowserRouter>
        );
    }
}


const mapStateToProps = state => ({
    ...state.appReducer
})

const mapDispatchToProps = dispatch => ({
    updateAppProperty: (payload) => dispatch(updateAppProperty(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
