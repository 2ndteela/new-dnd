import React, { Component } from 'react';
import './style.css'

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            showMenu: false
         }
    }

    toggleHamberger() {
        this.setState({
            showMenu: !this.state.showMenu
        })
    }

    render() { 
        if(this.props.noActions) return (
            <div className="header-container center-up">
                <h1>{this.props.label}</h1>
            </div>
        )

        return ( 
            <div className="header-container">
                <h1>{this.props.label}</h1>
                <div className="hamberger-icon" onClick={() => this.toggleHamberger()}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div id="hamberger-drawer" class={this.state.showMenu === true ? 'show-menu' : ''}>
                    {this.props.children}
                </div>
            </div>
         );
    }
}

export default Header;