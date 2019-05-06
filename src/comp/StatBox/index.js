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
                <h2>{this.props.main}</h2>
                <span className="stat-save">{this.props.save > 0 ? '+' + this.props.save : this.props.save}</span>
            </div>
         );
    }
}
 
export default StatBox;