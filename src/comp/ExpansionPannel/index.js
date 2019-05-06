import React, { Component } from 'react';
import MaterialIcon from 'material-icons-react'
import './style.css'

class ExpansionPannel extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    clickIt() {
        this.props.flip(!this.props.model, this.props.field)
    }

    calcHeight() {
        
    }


    render() { 
        return ( 
            <div style={{width: '100%'}} >
                <div onClick={() => this.clickIt()} className="expansion-pannel-header" >
                    <h2>{this.props.header}</h2>
                    <span className={this.props.model === true ? 'flipped-arrow' : ''}>
                        <MaterialIcon icon="keyboard_arrow_down" />
                    </span>
                </div>
                <div className={this.props.model === true ? 'expansion-pannel-body ' + this.props.size + '-pannel' : 'expansion-pannel-body' } >
                    {this.props.children}
                </div>
            </div>
         );
    }
}
 
export default ExpansionPannel;