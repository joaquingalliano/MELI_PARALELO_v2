import React, { Component } from 'react';
import './Navbar.css';

class Navbar extends Component {
    constructor() {
        super();

        this.search = this.search.bind(this);
        this.logout = this.logout.bind(this);
    }

    search(e) {
        let value  = this.refs.searchText.value;
        window.location.href = "/search/" + value;
    }

    logout(e) {
        localStorage.removeItem('user');
        window.location.href = "/";
    }

    render() {
        let user = JSON.parse(localStorage.getItem('user'));
        let shoppingCart = (
            <a href="/"><button className="btn btn-nav glyphicon glyphicon-shopping-cart"></button></a>
        );
        let btnLogin = (
            <div>
                <a href="/login"><button className="btn btn-nav">Login</button></a>
                {shoppingCart}
            </div>
        );
        let userName = user ? (
            <ul className="nav-right">
                <li className="dropdown">
                    <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                        <span className="glyphicon glyphicon-user"></span> 
                        <strong>{user.firstName} &nbsp;</strong>
                        <span className="glyphicon glyphicon-chevron-down"></span>
                    </a>
                    <ul className="dropdown-menu">
                        <li>
                            <div className="navbar-login">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <p className="text-center">
                                            <span className="glyphicon glyphicon-user icon-size"></span>
                                        </p>
                                    </div>
                                    <div className="col-lg-8">
                                        <p className="text-left"><strong>{user.firstName + " " + user.lastName}</strong></p>
                                        <p className="text-left small">{user.username}</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="divider"></li>
                        <li>
                            <div className="navbar-login navbar-login-session">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <p>
                                            <a href="#" onClick={this.logout} className="btn btn-danger btn-block">Cerrar Sesion</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
                <li>
                     {shoppingCart}
                </li>
            </ul>
            ) : "";
        let login = user ? userName : btnLogin;

        return(
            <nav className="navbar-melu">
                <div className="nav-container">
                    <a href="/" className="navbarTitle">Kwik-E-Mart</a>
                    <div className="searchBar" >
                        <input ref="searchText" type="text" name="searchText" id="searchText" maxLength="40"/>
                        <button className="glyphicon glyphicon-search btnSearch"
                            type="button"
                            onClick={this.search}></button>
                    </div>
                    <div className="nav-right hidden-xs">
                        {login}
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
