import React, {useState} from "react";
import logo from './logo.svg';
import './App.css';
import { Login } from './components/Login';
import { Register } from './components/Register';
import  Popup  from "./components/Popup";

function App() {
  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (<main>
    <div className="top-bar">
          <h2 className="top-bar-text">Grade Tracker</h2>
      </div>
    <div className="App">   
      <br/>
      {
        currentForm === 'login' ? <Login onFormSwitch={toggleForm}/> : <Register onFormSwitch={toggleForm}/>
      }
    </div>
  </main>
    
  );
}

export default App;
