import './styles/App.css';
import './styles/HistCat.css';
import React, { useState, useEffect } from 'react';
import HistoricalBodyContainer from './components/HistoricalBodyContainer'; 

function App() {
  const [unitOfValue, setUnitOfValue] = useState('customers');
  const [unitOfOccurrence, setUnitOfOccurrence] = useState('days');
  const [values, setValues] = useState([0]);
  const [occurrences, setOccurrences] = useState([0]);
  const [probabilities, setProbabilities] = useState([0]);
  const [cumulativeProbabilities, setCumulativeProbabilities] = useState([]);
  const [rniIntervals, setRniIntervals] = useState([]);
  const [averagePredictedValue, setAveragePredictedValue] = useState(0);
  const [predictedValue, setPredictedValue] = useState([]);
  const [simulations, setSimulations] = useState([]);

  const handleRestart = () => {
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
        // Skip NaN values in rniIntervals
        if (isNaN(rniIntervals[i])) {
            console.log(`Skipping NaN interval at index ${i}`);
            continue;
        }

        // Get the lower and upper bounds from the tuple
        const [lower, upper] = rniIntervals[i];

        // Adjust the condition to check the entire range inclusively
        if (randomNumber >= lower && randomNumber <= upper) {
            predictedValueForThisSimulation = values[i];
            intervalMatched = true;
            console.log(`Interval matched at index ${i}: RNI = ${rniIntervals[i]}, Predicted Value = ${predictedValueForThisSimulation}`);

            // Directly set the predicted value array
            setPredictedValue((prevPredictedValues) => [
                ...prevPredictedValues,
                predictedValueForThisSimulation, // Add predicted value immediately
            ]);
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
          <div className='header-icon-image-right-section'>
            <img src="/info-icon.png" className="info-icon-logo" alt="info-icon"/>
            <p>Documentation</p>
          </div>
        </div>
      </div>
      <div className='body'>
        <div className='instructions-container'>
          <p>How to use?</p>
          <div className='data-inst-container'>
            <h5>Historical Data</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <div className='data-inst-container'>
            <h5>Categorical Data</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
            <HistoricalBodyContainer
                unitOfValue={unitOfValue}
                unitOfOccurrence={unitOfOccurrence}
                values={values}
                occurrences={occurrences}
                probabilities={probabilities}
                handleInputUnitofValue={handleInputUnitofValue}
                handleInputUnitofOccurrence={handleInputUnitofOccurrence}
                handleInputChange={handleInputChange}
                addRow={addRow}
                deleteRow={deleteRow}
              />
          </div>
          <div className='computations-container'>

            <div className='cont-header-container'>
              <p>Computations</p>
            </div>

            <div className='computation-body-container'>
              <div className="computation-table-wrapper">
                <table className="cat-hist-table">
                  <thead>
                    <tr>
                      <th>Cumulative Probability</th>
                      <th>RNI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.map((_, index) => (
                      <tr key={index}>
                        <td>{cumulativeProbabilities[index]?.toFixed(2) || '0.00'}</td>
                        <td>{rniIntervals[index] || 'NaN'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='simulations-container'>
          <div className="simulations-header-container">
            <p>Simulations</p>
            <div className="sim-res-buttons">
              <button className="simulate-button" onClick={handleSimulate}>
                Simulate
              </button>
              <button className="restart-button" onClick={handleRestart}>
                Restart
              </button>
            </div>
          </div>

            <div className='simulations-body-container'>
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
              <h4>Average number of {unitOfOccurrence}: {averagePredictedValue}</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;