import App from "./src/App.js";
const createRoot = window.ReactDOM.createRoot
const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App />);