// Auto-detects whether we're running locally or in production
var API = window.location.hostname === 'localhost'
  ? 'http://localhost:5500'
  : 'https://srv-d8hgj0d7vvec73du815g.onrender.com';

export default API;
