import React from 'react';
import ReactDOMServer from 'react-dom/server';

const origError = console.error;
const errors = [];
console.error = (...args) => {
  errors.push(args);
  origError(...args);
};

console.log("Ready to test");
