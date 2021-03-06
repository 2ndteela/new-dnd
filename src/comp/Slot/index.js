import React, { Component } from 'react';
import './style.css'

class Slot extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    inc() {
        const temp = parseInt(this.props.val, 10) + 1
        if(temp <= this.props.max) 
            if(this.props.arr) this.handleUpdate(temp, this.props.field, this.props.idx, this.props.arr)
            else this.handleUpdate(temp)
    }

    dec() {
        const temp = parseInt(this.props.val, 10) - 1
        if(temp > -1) 
            if(this.props.arr) this.handleUpdate(temp, this.props.field, this.props.idx, this.props.arr)
            else this.handleUpdate(temp)
    }


    handleUpdate(val, idx, arr) {
        console.log(val, this.props.max)
        if(parseInt(val, 10) > parseInt(this.state.max)) val = parseInt(this.props.max, 10) 
        if(this.props.arr) this.props.onUpdate(val, this.props.field, this.props.idx, this.props.arr)
        else this.props.onUpdate(val, this.props.field)
    }

    makeBackground() {
        const percent = (parseInt(this.props.val, 10) / parseInt(this.props.max, 10)) * 100

        if(this.props.reverse) {
            if(percent > 75) return <div className='slot-background' style={{width: percent + '%'}}></div>
            else if (percent > 50) return <div className='slot-background yellow-back' style={{width: percent + '%'}}></div>
    
            return <div className='slot-background green-back' style={{width: percent + '%'}}></div>
        }

        if(percent > 50) return <div className='slot-background green-back' style={{width: percent + '%'}}></div>
        else if (percent > 25) return <div className='slot-background yellow-back' style={{width: percent + '%'}}></div>

        return <div className='slot-background' style={{width: percent + '%'}}></div>
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
                    {this.makeBackground()}
                </div>
            </div>
         );
    }
}
 
export default Slot;