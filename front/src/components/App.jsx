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
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import PopulateDataBase from "./PopulateDataBase";
import { connect } from 'react-redux';

class App extends Component {
    constructor(props) {
        super(props);

        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            dispatch(alertActions.clear());
        });
    }
    render() {
        const { alert } = this.props;
        return (
            <div>
                        {alert.message &&
                            <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
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

export default connect(mapStateToProps)(App);

//export default App;
