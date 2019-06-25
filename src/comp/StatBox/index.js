import React, { Component } from 'react';
import './style.css'


class StatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div className="stat-box">
                <span className="stat-name" >{this.props.name}</span>
                <h2> {this.props.save > 0 ? '+' + this.props.save : this.props.save}</h2>
                <span className="stat-save">{this.props.main}</span>
            </div>
         );
    }
}
 
export default StatBox;