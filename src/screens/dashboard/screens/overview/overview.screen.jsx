import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Overview1, Overview2, Overview3, Overview4 } from './components';

class HomeScreen extends Component {
    render() {
        return (
            <div className="row wr content">
                <div className="col-md-12">
                    <Overview1 />
                </div>
                <div className="col-md-12">
                    <Overview2 />
                </div>
                <div className="col-md-12">
                    <Overview3 />
                </div>
                <div className="col-md-12">
                    <Overview4 />
                </div>
                <div className="col-md-12">
                    {/* <pre>
                        {JSON.stringify(this.props, '', 2)}
                    </pre> */}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    appReducer: state.appReducer
})

export default connect(mapStateToProps)(HomeScreen);