import './App.css';

import Body from './Body'
import Footer from './Footer'

const App = () => {
  return (
    // Can only put one JSX component, so a trick is to wrap in a div first
    // Note to self: Use Ctrl/Cmd + / to comment JSX code
    <div className="App">
      <Body />
      {/* <Footer /> */}
    </div>
  );
}

export default App;
