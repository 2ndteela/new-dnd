import React, { Component } from 'react';
import './style.css'

class Slot extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    inc() {
        const temp = this.props.val + 1
        if(temp <= this.props.max) this.handleUpdate(temp)
    }

    dec() {
        const temp = this.props.val - 1
        if(temp > 1) this.handleUpdate(temp) 
    }


    handleUpdate(val) {
        this.props.onUpdate(val, this.props.field)
    }

    render() { 
        return ( 
            <div className="slot-box">
                <span>{this.props.label}</span>
                <div className="slot-container">
                    <button onClick={() => this.dec()} >-</button>
                    <div className="main-slot-container">
                        <input value={this.props.val} onChange={(e) => this.handleUpdate(e.target.value) } type="number"></input>
                        <div className="slot-max-number" >/ {this.props.max}</div>
                    </div>
                    <button onClick={() => this.inc()} >+</button>
                </div>
            </div>
         );
    }
}
 
export default Slot;