import './App.css';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { CircularProgress, Switch } from '@mui/material';
import Swal from 'sweetalert2';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GradingIcon from '@mui/icons-material/Grading';
import ListingStaff from './ListingStaff.js';
import VSRListing from './VSRListing.js';

function App() {
  const [answer, setAnswer] = useState("No answer yet")
  const [value, setValue] = useState("");
  const [myFetch, setMyFetch] = useState("OK");
  const [checked, setChecked] = useState(true);
  const [label, setLabel] = useState("Using the VSR model")
  const [myDocs, setMyDocs] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (checked) {
      setLabel("Using the VSR model");
      
    } else {
      setLabel("Using the RAG model");
    }
  }, [checked]);


  function handleChangeSwitch(e) {
    setChecked(e.target.checked); // Update the checked state
    setAnswer("No answer yet");
    setMyFetch("OK");
    setMyDocs([]);
    setResults([]);
  }

  function handleChange(e) {
    setValue(e.target.value);
  }

  function submitThequery() {

    if (value === "") {
      Swal.fire({
        title: "Please provide a valid query!",
        text: "Please provide a non-empty query to procced",
        icon: "info",
        confirmButtonColor: "green"
      });
    }
    if (value !== "") {
      setMyFetch("NO")
      setMyDocs([]);

      if (checked) {

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: `${value}` })
        };
        fetch('http://188.245.150.82:5002/query', requestOptions)
          .then(response => response.json())
          .then(data => { setAnswer("A response is expected only when using the RAG model"); setMyFetch("OK"); setResults(parseResponse(data.result)); console.log(parseResponse(data.result)) });
      }
      if (!checked) {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: `${value}` })
        };
        fetch('http://188.245.150.82:8000/query', requestOptions)
          .then(response => response.json())
          .then(data => { setAnswer(data.answer); setMyFetch("OK"); setMyDocs(data.documents); });//console.log(data) 
      }
    }
  }

  function parseResponse(responseText) {
    // Regular expression to capture the data based on the provided format
    const regex = /Rank:\s*(\d+),\s*Doc ID:\s*([a-f0-9]+),\s*Distance:\s*([\d.]+),\s*App URL:\s*(https?:\/\/[^\s]+)/g;    // Array to hold the parsed objects
    const parsedData = [];
    let match;

    // Match all occurrences of the pattern
    while ((match = regex.exec(responseText)) !== null) {
      const data = {
        rank: match[1],           // The Rank
        id: match[2],             // The Doc ID
        distance: match[3],       // The Distance
        url: match[4]             // The App URL
      };
      parsedData.push(data);  // Push each data object to the array
    }

    return parsedData;
  }



  return (
    <div className="App">
      <div className='caption'>LSD Team Search Engines</div>
      <textarea value={value} placeholder='Please provide your query and press submit' onChange={handleChange} style={{ width: "30%", height: "150px" }}></textarea>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <button onClick={submitThequery} style={{cursor:"pointer"}}>Submit</button>
        <Switch
          checked={checked}
          onChange={handleChangeSwitch}
          color='success'
        //inputProps={{ 'aria-label': 'controlled' }}
        />
        <div style={{ fontWeight: "700", color: "gray" }}>{label}</div>
      </div>
      <div className='results_answers'>
        <div className="response">
          <div className='response_title'><div style={{ display: "flex", alignItems: "center" }}><GradingIcon sx={{ marginRight: "5px", fontSize: "35px" }} />Response</div></div>
          <div className='markdown'>{myFetch === "OK" ? <ReactMarkdown>{answer}</ReactMarkdown> : <div style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%" }}>Waiting for Response...<CircularProgress color="success" size={100} sx={{ margin: "40px" }} /></div>}</div>
        </div>
        <div className="response2">
          <div className='response2_title'><div style={{ display: "flex", alignItems: "center" }}><ReceiptLongIcon sx={{ marginRight: "2px", fontSize: "35px" }} /> Ranked Documents</div></div>
          <div className='docs'>{myFetch === "OK" ? (
            <div>
              {!checked ? (
                <div>
                  {myDocs.map(function (data) {
                    return (
                      <div key={data.id}>
                        <ListingStaff
                          appName={data.app_name}
                          appURL={data.app_url}
                          appPrice={data.app_price}
                          appDescription={data.description}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  {results.map(function (data) {
                    return (
                      <div key={data.id}>
                        <VSRListing
                          rank={data.rank}
                          url={data.url}
                          distance={data.distance}
                          id={data.id}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", flexDirection: "column", width: "100%" }}>
              Retrieving Ranked Documents...
              <CircularProgress color="success" size={100} sx={{ margin: "40px" }} />
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
