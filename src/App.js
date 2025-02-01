import './styles/App.css';
import './styles/HistCat.css';
import React, { useState, useEffect } from 'react';
import HistoricalBodyContainer from './components/HistoricalBodyContainer'; 

function App() {
  const [unitOfValue, setUnitOfValue] = useState('');
  const [unitOfOccurrence, setUnitOfOccurrence] = useState('');
  const [values, setValues] = useState([0]);
  const [occurrences, setOccurrences] = useState([0]);
  const [probabilities, setProbabilities] = useState([0]);
  const [cumulativeProbabilities, setCumulativeProbabilities] = useState([]);
  const [rniIntervals, setRniIntervals] = useState([]);
  const [averagePredictedValue, setAveragePredictedValue] = useState(0);
  const [predictedValue, setPredictedValue] = useState([]);
  const [simulations, setSimulations] = useState([]);
  const [isReadyToSimulate, setIsReadyToSimulate] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);

  const resetValueOccurrence = () => {
    // Reset all the necessary states to their initial values
    setValues([0]);
    setOccurrences([0]);
    setProbabilities([0]);
    setCumulativeProbabilities([]);
    setRniIntervals([]);
    setPredictedValue([]);
    setSimulations([]);
    setAveragePredictedValue(0);
    setUnitOfValue('');
    setUnitOfOccurrence('');
    setHasSimulated(false);
  };
  


  useEffect(() => {
    // Check if cumulativeProbabilities[0] is still 0 and set isReadyToSimulate accordingly
    if (cumulativeProbabilities[0] === 0) {
      setIsReadyToSimulate(false);
    } else {
      setIsReadyToSimulate(true);
    }
  }, [cumulativeProbabilities]);  // Runs whenever cumulativeProbabilities changes

  const handleRestart = () => {
    setHasSimulated(false);
    setSimulations([]);
    setAveragePredictedValue(0);
  };

  const handleInputUnitofOccurrence = (e) => {
    setUnitOfOccurrence(e.target.value);
  };

  const handleInputUnitofValue = (e) => {
    setUnitOfValue(e.target.value);
  };

  const recalculateProbabilities = () => {
    const totalOccurrences = occurrences.reduce((acc, occurrence) => acc + occurrence, 0);
    const newProbabilities = totalOccurrences === 0
      ? occurrences.map(() => 0)
      : occurrences.map((occurrence) => occurrence / totalOccurrences);
    setProbabilities(newProbabilities);
  };


  useEffect(() => {
    recalculateProbabilities();
  }, [values, occurrences]);


  useEffect(() => {
    const newCumulativeProbabilities = probabilities.reduce((acc, prob, index) => {
      const previousSum = index === 0 ? 0 : acc[index - 1];
      acc.push(previousSum + prob);
      return acc;
    }, []);
  
    setCumulativeProbabilities(newCumulativeProbabilities);
  }, [probabilities]);




  useEffect(() => {
    if (cumulativeProbabilities.length === 0) return;
  
    const newRniIntervals = cumulativeProbabilities.map((cumProb, index) => {
        const lowerBound = index === 0 ? 0 : Math.round(cumulativeProbabilities[index - 1] * 100);
        const upperBound = Math.min(Math.round(cumProb * 100) - 1, 99); // Ensure max value is 99

        // If lower bound is greater than upper bound, return NaN
        if (lowerBound > upperBound) return NaN;

        return [lowerBound, upperBound]; // Return as a tuple of numbers
    });
  
    setRniIntervals(newRniIntervals);
  }, [cumulativeProbabilities]);


  const addRow = () => {
    setValues([...values, 0]);
    setOccurrences([...occurrences, 0]);
  };

  const deleteRow = () => {
    if (values.length > 1) {
      setValues(values.slice(0, -1));
      setOccurrences(occurrences.slice(0, -1));
      setProbabilities(probabilities.slice(0, -1));
    }
  };

  const handleInputChange = (index, event, type) => {
    const newArray = type === 'value' ? [...values] : [...occurrences];
    newArray[index] = Number(event.target.value);
    type === 'value' ? setValues(newArray) : setOccurrences(newArray);
  };

  const handleSimulate = () => {
    if (!unitOfValue || !unitOfOccurrence) {
      alert("Please fill in both 'Unit of Value' and 'Unit of Occurrence' before simulation.");
      return; // Stop the simulation if fields are not filled
  }

    setHasSimulated(true);
    console.log('Simulate button clicked');
    console.log('Calculated RNI Intervals:', rniIntervals);
    console.log('Current values:', values);
  
    // Generate random number between 0 and 99
    const randomNumber = Math.floor(Math.random() * 100);
    console.log(`Generated Random Number: ${randomNumber}`);
  
    // Find the corresponding predicted value based on the random number and the RNI intervals
    let predictedValueForThisSimulation = 0;
    let intervalMatched = false;
  
    // Check if rniIntervals and values have the same length
    if (rniIntervals.length !== values.length) {
      console.error('Mismatched lengths between RNI intervals and values arrays');
      return;
    }
  
    for (let i = 0; i < rniIntervals.length; i++) {
      // Skip invalid intervals
      if (!Array.isArray(rniIntervals[i]) || rniIntervals[i].length !== 2) {
        console.log(`Skipping invalid interval at index ${i}`);
        continue;
      }
  
      // Get the lower and upper bounds from the tuple
      const [lower, upper] = rniIntervals[i];
  
      // Adjust the condition to check the entire range inclusively
      if (randomNumber >= lower && randomNumber <= upper) {
        predictedValueForThisSimulation = values[i];
        intervalMatched = true;
        console.log(`Interval matched at index ${i}: RNI = ${rniIntervals[i]}, Predicted Value = ${predictedValueForThisSimulation}`);
        break;
      }
    }
  
    // If no match was found, log a warning
    if (!intervalMatched) {
      console.warn(`No matching RNI interval found for random number: ${randomNumber}`);
    }
  
    console.log(`Simulating... Random Number: ${randomNumber}, Predicted Value: ${predictedValueForThisSimulation}`);
  
    // Add the new simulation to the simulations array
    setSimulations((prevSimulations) => {
      const newSimulation = [
        ...prevSimulations,
        {
          count: prevSimulations.length + 1,
          randomGeneratedNumber: randomNumber,
          predictedValue: predictedValueForThisSimulation,
        },
      ];
  
      // Calculate the new average
      const newAverage =
        newSimulation.reduce((sum, sim) => sum + sim.predictedValue, 0) /
        newSimulation.length;
  
      setAveragePredictedValue(newAverage);
  
      return newSimulation;
    });
  };




  return (
    <div className="app-container">
      <div className="header">
        <h1>Monte Carlo Simulation Prototype</h1>
        <div className='header-right-section'>
          <div className='header-icon-image-right-section'>
            <img src="/video-icon.png" className="video-icon-logo" alt="video-icon"/>
            <p>Video Demo</p>
          </div>
          <a href="https://docs.google.com/document/d/1xBG0dHFGY-5s0ua_5BtuPHGgcgIqAgumM9rfQJdZ194" target="_blank" rel="noopener noreferrer"  className="no-link-style">
            <div className='header-icon-image-right-section'>
              <img src="/info-icon.png" className="info-icon-logo" alt="info-icon"/>
              <p>Documentation</p>
            </div>
          </a>

        </div>
      </div>
      <div className='body'>
        <div className='instructions-container'>
          <p>How to use?</p>
          <div className='data-inst-container'>
            <h5>Historical Data</h5>
            <p><strong>1. Unit of Value:</strong> Enter a ‘Unit of Value’, which defines the measurement or currency to be used for the first column of the table. The name of the leftmost column will dynamically change based on this metric.</p>

            <p><strong>2. Unit of Occurrence:</strong> Enter a ‘Unit of Occurrence’, which specifies the frequency or context in which the data is recorded. The name of the second leftmost column will dynamically change based on this metric.</p>

            <p><strong>3. Adding/Removing Rows:</strong> You can add a row or delete the last row using the two respective buttons next to the ‘Unit of Value’ or ‘Unit of Occurrence’ text fields.</p>

            <p><strong>4. First Column Input:</strong> In each cell of the first column, you can input a numeric whole number. This specifies the value to be displayed later on in the ‘Predicted Value’ column.</p>

            <p><strong>5. Second Column Input:</strong> In each cell of the second leftmost column, you can input a numeric whole number. This value is used to automatically calculate the ‘Probability’ column, and it will also populate the ‘Cumulative Probability’ and ‘RNI’ columns.</p>

            <p><strong>6. Total Number of Occurrences:</strong> The ‘Total number of Occurrences’ will dynamically update as you add more data.</p>

            <p><strong>7. Simulate Button:</strong> After entering data, click the ‘Simulate’ button. This generates a random number and displays it in the ‘Random Generated No.’ column under the ‘Simulations’ section on the right.</p>

            <p><strong>8. # Column in Simulations:</strong> The ‘#’ column indicates how many times you’ve pressed the ‘Simulate’ button.</p>

            <p><strong>9. Predicted Value:</strong> The ‘Predicted Value’ column is based on the random value generated. Specifically, it corresponds to the row in the leftmost column where the random value falls within the range specified by the ‘RNI’ column.</p>

            <p><strong>10. Average Number of Occurrences:</strong> The average number of occurrences will be dynamically displayed. It is calculated as the total sum of all the listed ‘Predicted Values’ divided by the number of simulations (the last value in the ‘#’ column).</p>

            <p><strong>11. Restart Button:</strong> You may press the ‘Restart’ button next to the ‘Simulate’ button to reset and clear all the displayed cells in the ‘Simulations’ section.</p>

            <p><strong>12. Clear All Button:</strong> You may press the ‘Clear All’ button next to the ‘Unit of Occurrence’ text field to reset and clear all the input fields in the ‘Historical Data’ section.</p>

          </div>

        </div>
        <div className='monte-carlo-sim-container'>
          <div className='hist-cat-container'>
            {/* Tab Header */}
            <div className='cont-header-container'>
              <div className='hist-cat-tab-active'>
                <p>Historical Data</p>
              </div>
            </div>
            
            <div className='hist-cat-body-container'>
              <div className='hist-cat-input-unit-container'>
                <div className="inputs-container">
                  <div className='input-label-container'>
                    <label className="input-label-text">Unit of value:</label>
                    <input 
                      type="text" 
                      placeholder="Ex. customers, cakes, etc." 
                      className="input-field-text"
                      value={unitOfValue}
                      onChange={handleInputUnitofValue}
                      disabled={hasSimulated}
                      onKeyPress={(e) => !/[a-zA-Z\s]/.test(e.key) && e.preventDefault()}
                    />
                  </div>
                  <div className='input-label-container'>
                    <label className="input-label-text">Unit of occurrence:</label>
                    <input 
                      type="text" 
                      placeholder="Ex. days, years" 
                      className="input-field-text"
                      value={unitOfOccurrence}
                      onChange={handleInputUnitofOccurrence}
                      disabled={hasSimulated}
                      onKeyPress={(e) => !/[a-zA-Z\s]/.test(e.key) && e.preventDefault()}
                    />
                  </div>
                  <div className="clr-btn" onClick={resetValueOccurrence}>
                    <p>clear all</p>
                  </div>
                </div>
                <div className="buttons-container">
                  <div className="row-button" id='add-row-btn' onClick={addRow}>
                    <p id='btn-text-icon'>+</p><p>add row</p>
                  </div>
                  <div className="row-button" id='delete-row-btn' onClick={deleteRow}>
                    <p id='btn-text-icon'>-</p><p>delete last row</p>
                  </div>
                </div>
              </div>
              <div className='table-wrapper'>
                <table className="cat-hist-table">
                  <thead>
                    <tr>
                      <th>Number of {unitOfValue}</th>
                      <th>Number of {unitOfOccurrence}</th>
                      <th>Probability</th>
                      <th>Cumulative Probability</th>
                      <th>RNI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.map((value, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => handleInputChange(index, e, 'value')}
                            disabled={hasSimulated}
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={occurrences[index]}
                            onChange={(e) => handleInputChange(index, e, 'occurrence')}
                            disabled={hasSimulated}
                            min="0"
                          />
                        </td>
                        <td>{probabilities[index]?.toFixed(2) || '0.00'}</td>
                        <td>{cumulativeProbabilities[index]?.toFixed(2) || '0.00'}</td>
                        <td>{rniIntervals[index] ? `${rniIntervals[index][0]} - ${rniIntervals[index][1]}` : 'NaN'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="hist-cat-additional-data-container">
                <h4>Total number of {unitOfOccurrence}: {occurrences.reduce((acc, val) => acc + val, 0)}</h4>
                <p>Sum of the number of occurrences (used to divide an individual number of occurrence to get its probability)</p>
              </div>
            </div>
          </div>
          
          <div className='simulations-container'>
          <div className="simulations-header-container">
            <p>Simulations</p>
            <div className="sim-res-buttons">
              <button 
              className="simulate-button" 
              onClick={handleSimulate}
              disabled={!isReadyToSimulate}>
                Simulate
              </button>
              <button className="restart-button" onClick={handleRestart}>
                Restart
              </button>
            </div>
          </div>

            <div className='simulations-body-container'>
              <div className='simulations-table-wrapper'>
                <table className="cat-hist-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Random Generated Number</th>
                      <th>Predicted Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                  {simulations.map((simulation) => (
                      <tr key={simulation.count}>
                          <td>{simulation.count}</td>
                          <td>{simulation.randomGeneratedNumber}</td>
                          <td>{simulation.predictedValue}</td>
                      </tr>
                  ))}

                    
                  </tbody>
               </table>
              </div>
              
              <h4>Average number of {unitOfOccurrence}: {averagePredictedValue.toFixed(2)}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;