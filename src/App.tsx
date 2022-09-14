import { HashRouter } from 'react-router-dom';

import Routes from './Routes';

import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes />
    </HashRouter>
  );
}

export default App;