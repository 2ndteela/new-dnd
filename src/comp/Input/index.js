import React, { Component } from 'react';
import './style.css'

class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    handleInput(val) {
        if(this.props.idx !== undefined) {
            this.props.onUpdate(val, this.props.field, this.props.idx, this.props.arr)
        }
        else {
            this.props.onUpdate(val, this.props.field)
        }
    }

    dec() {
        const temp = this.props.val - 1
        if(this.props.idx === 0 || this.props.idx) this.props.onUpdate(temp, this.props.field, this.props.idx, this.props.arr)
        else this.props.onUpdate(temp, this.props.field)
    }

    inc() {
        const temp = parseInt(this.props.val, 10) + 1
        if(this.props.idx === 0 || this.props.idx) this.props.onUpdate(temp, this.props.field, this.props.idx, this.props.arr)
        else this.props.onUpdate(temp, this.props.field)
    }

    render() { 
        if(this.props.textarea) {
            return ( 
                <div className={ this.props.fillHeight === true ? "styled-input fill-height" : "styled-input"} >
                    <textarea onChange={(e) => this.handleInput(e.target.value, this.props.field)}  value={this.props.val} ></textarea>
                    <span>{this.props.label}</span>
                </div>
             );
        }
        if(this.props.hidden) {
            return(
                <div className="styled-input" >
                    <input onChange={(e) => this.handleInput(e.target.value, this.props.field)} type="password" value={this.props.val} ></input>
                    <span>{this.props.label}</span>
                </div>
            )
        }

        if(this.props.add) {
            return (
                <div className="styled-input add" >
                    <button onClick={() => this.dec()} >-</button>
                    <input onChange={(e) => this.handleInput(e.target.value, this.props.field)} type="number" value={this.props.val} ></input>
                    <button onClick={() => this.inc()}>+</button>
                    <span>{this.props.label}</span>
                </div>
            )
        }
        return ( 
            <div className="styled-input" >
                <input onChange={(e) => this.handleInput(e.target.value, this.props.field)} value={this.props.val} ></input>
                <span>{this.props.label}</span>
            </div>
         )
    }
}
 
export default Input;