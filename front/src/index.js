import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar/Navbar'
import App from './components/App';
import Chat from './components/Chat/Chat';
import { store } from './_helpers';
import { Provider } from 'react-redux';


ReactDOM.render(<Navbar />, document.getElementById('navbar'));
ReactDOM.render(<Chat/>, document.getElementById('chat'));
ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('app'));
