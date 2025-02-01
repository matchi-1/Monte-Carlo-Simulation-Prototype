import './styles/App.css';
import './styles/HistCat.css';
import React, { useState, useEffect } from 'react';
import HistoricalBodyContainer from './components/HistoricalBodyContainer'; 
import CategoricalBodyContainer from './components/CategoricalBodyContainer';

function App() {
  const [activeTab, setActiveTab] = useState('historical');
  const [unitOfValue, setUnitOfValue] = useState('customers');
  const [unitOfOccurrence, setUnitOfOccurrence] = useState('days');
  const [values, setValues] = useState([0]);
  const [occurrences, setOccurrences] = useState([0]);
  const [probabilities, setProbabilities] = useState([0]);
  const [cumulativeProbabilities, setCumulativeProbabilities] = useState([]);
  const [rniIntervals, setRniIntervals] = useState([]);

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
  
      return `${lowerBound}-${upperBound}`;
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
              <div
                className={activeTab === 'historical' ? 'hist-cat-tab-active' : 'hist-cat-tab-inactive'}
                onClick={() => setActiveTab('historical')}
              >
                <p>Historical Data</p>
              </div>
              <div
                className={activeTab === 'categorical' ? 'hist-cat-tab-active' : 'hist-cat-tab-inactive'}
                onClick={() => setActiveTab('categorical')}
              >
                <p>Categorical Data</p>
              </div>
            </div>

            {activeTab === 'historical' ? (
              <HistoricalBodyContainer
                activeTab={activeTab}
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
            ) : (
              <CategoricalBodyContainer />
            )}

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
            <div className='simulations-header-container'>
              <p>Simulations</p>
              <div className="sim-res-buttons">
                <button className="simulate-button">
                  Simulate
                </button>
                <button className="restart-button">
                  Restart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;