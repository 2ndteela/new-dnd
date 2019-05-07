import React, { Component } from 'react';
import BottomNav from '../../comp/BottomNav'

import './style.css'

class Pack extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <h1 className="header">Backpack</h1>
                <div className="page-content with-bottom-nav">

                </div>
                <BottomNav></BottomNav>
            </div>
         );
    }
}
 
export default Pack;