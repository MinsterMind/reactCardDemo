import React from 'react';
import ReactDOM from 'react-dom';
import CardFront from './Card.jsx';
import WordInput from './wordInput.jsx'
// import MyInfiniteScrollExample from './App.jsx'
const cardList = ReactDOM.render(<CardFront />, document.querySelector('.react-card'));
// ReactDOM.render(<WordInput components = {{cardList:cardList}} isUpdate={false} isOpen={false}/>, document.querySelector('#inputForm'))
