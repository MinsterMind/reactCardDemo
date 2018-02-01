import React from 'react';
import ReactDOM from 'react-dom';
import CardFront from './Card.jsx';
import WordInput from './wordInput.jsx'
// import MyInfiniteScrollExample from './App.jsx'

ReactDOM.render(<WordInput/>, document.querySelector('#inputForm'))
ReactDOM.render(<CardFront />, document.querySelector('.react-card'));