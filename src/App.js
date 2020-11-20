import './App.css';
import Body from './Body'
import Footer from './Footer'

function App() {
  return (
    // Can only put one JSX component, so a trick is to wrap in a div first
    // Note to self: Use Ctrl/Cmd + / to comment JSX code
    <div className="App">
      <Body />
      {/* <Footer /> */}

      {/* Import Bootstrap */}
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"/>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"/>
    </div>
  );
}

export default App;
