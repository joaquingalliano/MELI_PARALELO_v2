import React, {Component} from 'react';
import ItemDisplay from './ItemDisplay/ItemDisplay';
import Item from './Item/Item';
import LoginPage from './Login';
import RegisterPage from './Register';
import ShoppingCart from './ShoppingCart/ShoppingCart';
import AdminPage from './AdminView/AdminView';
import Populate from './PopulateDataBase';
import { alertActions } from '../_actions';
import { history } from '../_helpers';
import PropTypes from 'prop-types';


import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import PopulateDataBase from "./PopulateDataBase";
import { connect } from 'react-redux';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            language: 'spanish'
        }

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });

        this.handleLanguageChange = this.handleLanguageChange.bind(this);
    }

    getChildContext() {
        return {language: this.state.language}
    }

    handleLanguageChange(e) {
        let target = e.target;
        let value = target.value;

        this.setState({
            language: value
        });
    }

    render() {
        const { alert } = this.props;
        return (
            <div>
                <Router>
                    <div>
                        <select id="lenguaje" onChange={this.handleLanguageChange} defaultValue="spanish">
                            <option value="spanish">Español</option>
                            <option value="english">English</option>
                            <option value="portuguese">Portuguese</option>
                        </select>
                    </div>
                </Router>
                <Router>
                    <div>
                        <Route exact path="/" component={ItemDisplay} />
                        <Route exact path="/search" component={ItemDisplay} />
                        <Route exact path="/items/:itemID" component={Item}/>
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/register" component={RegisterPage} />
                        <Route exact path="/carrito" component={ShoppingCart} />
                        <Route path="/admin" component={AdminPage} />
                        <Route path="/populate" component={Populate}/>
                    </div>
                </Router>
            <div className="col-sm-8 col-sm-offset-2">
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
            </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}
App.childContextTypes = {
    language: PropTypes.string
};

//export default App;

export default connect(mapStateToProps)(App);

//export default App;
