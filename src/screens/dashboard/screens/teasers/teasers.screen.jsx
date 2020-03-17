import React, { Component } from 'react';

import Teaser1 from './components/teaser1.component'
import Teaser2 from './components/teaser2.component'
import Teaser3 from './components/teaser3.component'

export default class Teasers extends Component {
    render() {
        return (
            <div className="row wr content">
                <div className="col-md-12">
                    <Teaser1 />
                </div>
                <div className="col-md-12">
                    <Teaser2 />
                </div>
                <div className="col-md-12">
                    <Teaser3 />
                </div>
            </div>
        )
    }
}
