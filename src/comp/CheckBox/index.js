import React, { Component } from 'react';
import './style.css'

class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    handleClick() {
        const temp = !this.props.model

        if(this.props.arr) this.props.onUpdate(temp, this.props.field, this.props.idx, this.props.arr)
        else this.props.onUpdate(temp, this.props.field)
    }

    render() { 
        return ( 
            <div style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%', paddingBottom: '8px'}} >
                <div className="outer-box" onClick={() => this.handleClick()}>
                    <div className={this.props.model === true ? 'inner-box filled-box' : 'inner-box'} ></div>
                </div>
                <div style={{marginLeft: '8px'}}>{this.props.label}</div>
            </div>
         );
    }
}
 
export default CheckBox;