import React, { Component } from 'react';

export default class Dropable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hovered: false
        }
    }

    drop = (e) => {
        const data = e.dataTransfer.getData('transfer');
        if (e.target === e.currentTarget) {
            this.props.handleDrop(data);
        }
            this.setState({ hovered: false})
    }

    hover = (status, e) => {
        let hovered = this.state.hovered
        e.preventDefault();
        this.setState({ hovered: status ? ++hovered : --hovered })
    };

    render() {
        // eslint-disable-next-line
        const { children, handleDrop } = this.props
        return (
            <div className={'board' + (this.state.hovered ? ' hovered' : '')}
                onDrop={e => this.drop(e)}
                onDragOver={e => e.preventDefault()}
                onDragEnter={e => this.hover(true, e)}
                onDragLeave={e => this.hover(false, e)}>
                {children}
            </div>
        )
    }
}