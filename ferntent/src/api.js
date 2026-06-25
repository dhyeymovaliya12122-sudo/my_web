// Auto-detects whether we're running locally or in production
var API = window.location.hostname === 'localhost'
  ? 'http://localhost:5500'
  : 'https://my-web-89so.onrender.com';
export default API;
