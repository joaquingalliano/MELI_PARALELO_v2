import React, {Component} from 'react';
import ItemDisplay from './ItemDisplay/ItemDisplay';
import Item from './Item/Item';
import LoginPage from './Login';
import RegisterPage from './Register';
import ShoppingCart from './ShoppingCart/ShoppingCart';
import AdminPage from './AdminView/AdminView';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={ItemDisplay} />
                    <Route exact path="/search" component={ItemDisplay} />
                    <Route exact path="/items/:itemID" component={Item}/>
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                    <Route exact path="/carrito" component={ShoppingCart} />
                    <Route path="/admin" component={AdminPage} />
                </div>
            </Router>
        );
    }
}

export default App;
