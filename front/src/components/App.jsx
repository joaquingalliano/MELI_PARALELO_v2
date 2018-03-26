import React, {Component} from 'react';
import ItemDisplay from './ItemDisplay/ItemDisplay';
import NotFound from './NotFound/NotFound';
import Item from './Item/Item';
import LoginPage from './Login';
import RegisterPage from './Register';
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
                    <Route exact path="/search/:keywords" component={ItemDisplay} />
                    <Route exact path="/items/:itemID" component={Item}/>
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/register" component={RegisterPage} />
                </div>
            </Router>
        );
    }
}

export default App;
