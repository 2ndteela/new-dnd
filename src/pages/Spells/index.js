import React, { Component } from 'react';
import BottomNav from '../../comp/BottomNav';

class Spells extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( 
            <div>
                <h1 className="header">SpellBook</h1>
                <div className="page-content with-bottom-nav">

                </div>
                <BottomNav></BottomNav>
            </div>
         );
    }
}
 
export default Spells;