import React, { Component } from 'react';
import Input from '../Input'
import './style.css'

class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            level: 0
         }

        this.updateState = this.updateState.bind(this)
    }

    updateState(value, feild) {
        this.setState({
            [feild]: value
        })
    }


    render() { 
        return ( 
            <div>
                <h1 className="header">{this.props.title}</h1>
                <div className="page-content">
                    <Input label="Name" val={this.state.name} feild="name" onUpdate={this.updateState} />
                    <Input label="Race" val={this.state.race} feild="race" onUpdate={this.updateState} />
                    <Input label="Class" val={this.state.race} feild="class" onUpdate={this.updateState} />
                    <div className="multi-input" >
                        <Input add={true} label="Level" val={this.state.level} feild="level" onUpdate={this.updateState} ></Input>
                        <Input label="Experience"></Input>
                    </div>
                </div>
            </div>
         );
    }
}
 
export default Edit;