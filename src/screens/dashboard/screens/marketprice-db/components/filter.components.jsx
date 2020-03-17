import React, { Component } from 'react';
import FilterForm from './form/filter-form.component';

export default class filterComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            advance: true,
            advanceFilter: true,
        }
    }
    btnFilter() {
        this.setState({advanceFilter: !this.state.advanceFilter})
    }
    render() {
    return (
        <div className="card">
            {/* Forms */}
            <FilterForm defaults={this.props.defaults} />
        </div>
    )
  }
}

