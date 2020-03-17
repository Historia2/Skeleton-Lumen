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

    drop = (e, origin) => {
        const target = e.dataTransfer.getData('transfer');
        if(target !== origin){
            this.props.handleDrop(target, origin);
        }
    }

    drag = (e, data) => {
        e.dataTransfer.setData('transfer', data);
    }

    hover = (status, e) => {
        // let hovered = this.state.hovered
        e.preventDefault();
        // this.setState({ hovered: status ? ++hovered : --hovered })
    };

    render() {
        const { id, children, pos } = this.props;
        return (
            <div id={id} draggable
                className={"tile" + (this.state.hovered ? ' hovered' : '')}
                onDragStart={e => this.drag(e, pos)}
                onDrop={e => this.drop(e, pos)}
                onDragEnter={e => this.hover(true, e)}
                onDragLeave={e => this.hover(false, e)}>
                { children }
            </div>
        )
    }

}
