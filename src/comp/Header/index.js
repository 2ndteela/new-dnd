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
                <h1>{this.props.label} {this.state.showMenu}</h1>
                <div className={this.state.showMenu === true ? 'make-ex hamberger-icon': 'hamberger-icon'  } onClick={() => this.toggleHamberger()}>
                    <span id="nomal-bar" ></span>
                    <span id="flippy-bar"></span>
                    <span id='go-away-bar'></span>
                </div>
                <div id="hamberger-drawer" className={this.state.showMenu === true ? 'show-menu' : ''}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Header;