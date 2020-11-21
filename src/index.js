// Third Party Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import './index.css';
import App from './App'; // .js extension is optional

import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  // What do I want to render?
  // <App /> is component syntax
  <React.StrictMode>
    <App />  
  </React.StrictMode>,
  // Where do I want to render it?
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();