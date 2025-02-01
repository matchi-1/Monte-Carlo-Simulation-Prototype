import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('historical');
  const [unitOfValue, setUnitOfValue] = useState('customers');
  const [unitOfOccurrence, setUnitOfOccurrence] = useState('days');

  const handleInputUnitofOccurrence = (e) => {
    setUnitOfOccurrence(e.target.value);
  };
  const handleInputUnitofValue = (e) => {
    setUnitOfValue(e.target.value);
  };

  // Store values in separate arrays
  const [values, setValues] = useState([0]); // Initial value array
  const [occurrences, setOccurrences] = useState([0]); // Initial occurrences array
  const [probabilities, setProbabilities] = useState([0]); // Initial probabilities array

  // Function to recalculate the probabilities for all rows
  const recalculateProbabilities = () => {
    const totalOccurrences = occurrences.reduce(
      (acc, occurrence) => acc + occurrence,
      0
    );

    // If total occurrences are zero, set all probabilities to 0
    const newProbabilities = totalOccurrences === 0
      ? occurrences.map(() => 0)
      : occurrences.map((occurrence) => occurrence / totalOccurrences);

    setProbabilities(newProbabilities);
  };

  // Recalculate probabilities whenever values or occurrences change
  useEffect(() => {
    recalculateProbabilities();
  }, [values, occurrences]); // Trigger recalculation when values or occurrences change

  // Function to handle the addition of a new row
  const addRow = () => {
    setValues([...values, 0]); // Add default value (can change)
    setOccurrences([...occurrences, 0]); // Add default occurrence (can change)
  };

  // Function to handle deletion of the last row
  const deleteRow = () => {
    if (values.length > 1) {
      setValues(values.slice(0, values.length - 1));
      setOccurrences(occurrences.slice(0, occurrences.length - 1));
      setProbabilities(probabilities.slice(0, probabilities.length - 1));
    }
  };

  // Function to handle input change for rows
  const handleInputChange = (index, event, type) => {
    const newArray = type === 'value' ? [...values] : [...occurrences];
    newArray[index] = Number(event.target.value); // Update value

    if (type === 'value') {
      setValues(newArray); // Update value array
    } else {
      setOccurrences(newArray); // Update occurrences array
    }
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

            <div className='hist-cat-body-container'>
              {/* Inputs Container */}
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
                      onKeyPress={(e) => {
                        // Allow only alphabets and spaces
                        if (!/[a-zA-Z\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
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
                      onKeyPress={(e) => {
                        // Allow only alphabets and spaces
                        if (!/[a-zA-Z\s]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Buttons Container */}
                <div className="buttons-container">
                  <div className="row-button" id='add-row-btn' onClick={addRow}>
                    <p id='btn-text-icon'>+</p><p>add row</p>
                  </div>
                  <div className="row-button" onClick={deleteRow}>
                    <p id='btn-text-icon'>-</p><p>delete last row
                  </p></div>
                </div>
              </div>
              {/* Table Container */}
              <div className="hist-cat-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Number of {unitOfValue}</th>
                      <th>Number of {unitOfOccurrence}</th>
                      <th>Probability</th>
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
                            min="0"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={occurrences[index]}
                            onChange={(e) =>
                              handleInputChange(index, e, 'occurrence')
                            }
                            min="0"
                          />
                        </td>
                        <td>{probabilities[index] !== undefined ? probabilities[index].toFixed(3) : '0.000'}</td>
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
          <div className='computations-container'>
            <div className='cont-header-container'>
              <p>Computations</p>
            </div>
          
          </div>
          <div className='simulations-container'>
            <div className='cont-header-container'>
              <p>Simulations</p>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
