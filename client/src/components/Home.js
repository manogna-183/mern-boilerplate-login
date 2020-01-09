import React, { Component } from 'react'

export default class Home extends Component {
    render() {
        return (
            <div>
                {this.props.history.push('/login')}
            </div>
        )
    }
}
