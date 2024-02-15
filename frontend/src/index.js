import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/tasks');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('API requests error:', error);
  }
};

fetchData();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals(console.log);
// reportWebVitals();
