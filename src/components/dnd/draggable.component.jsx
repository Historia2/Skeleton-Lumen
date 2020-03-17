import React, { Component } from 'react';
import $ from 'jquery';
import { findDOMNode } from 'react-dom';

export default class Draggable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hovered: false
        }
    }

    componentWillUnmount() {
        $(findDOMNode(this)).stop(true, true).fadeOut('slow');
    }

    

    drop = (e) => {
        const data = parseInt(e.dataTransfer.getData('transfer'));
        const myId = parseInt(this.props.id);
        if(data !== myId){
            alert(data + " - " + myId + (data !== myId ? "beda" : "sama"));
            this.props.handleDrop(data, myId);
        }
    }

    drag = (e) => {
        e.dataTransfer.setData('transfer', this.props.id);

    }

    hover = (status, e) => {
        // let hovered = this.state.hovered
        e.preventDefault();
        // this.setState({ hovered: status ? ++hovered : --hovered })
    };

    render() {
        return (
            <div id={this.props.id} draggable
                className={"tile" + (this.state.hovered ? ' hovered' : '')}
                onDragStart={e => this.drag(e)}
                onDrop={e => this.drop(e)}
                onDragEnter={e => this.hover(true, e)}
                onDragLeave={e => this.hover(false, e)}>
                {this.props.children}
            </div>
        )
    }

}
