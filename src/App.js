import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  const [answer, setAnswer] = useState("No answer Yet")
  const [value, setValue] = useState("");

  function handleChange(e) {
    setValue(e.target.value);
  }

  function submitThequery() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: `${value}` })
    };
    fetch('http://188.245.150.82:5000/ask_question', requestOptions)
      .then(response => response.json())
      .then(data => setAnswer(data.answer));
  }

  return (
    <div className="App">
      <input value={value} onChange={handleChange}></input>
      <button onClick={submitThequery}>Submit</button>
      <div>{answer}</div>
    </div>
  );
}

export default App;
