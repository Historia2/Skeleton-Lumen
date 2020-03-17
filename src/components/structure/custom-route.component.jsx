import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from 'services/authentication.service';

export const AuthRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => isAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);

export const GateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => !isAuthenticated() ? (
            <Component {...props} />
        ) : (
                <Redirect
                    to={{
                        pathname: '/dashboard',
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
);