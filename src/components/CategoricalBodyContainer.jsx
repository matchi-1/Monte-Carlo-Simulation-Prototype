import React, { useState, useEffect } from 'react';

const CategoricalBodyContainer = ({ activeTab }) => {
  const [unitOfValue, setUnitOfValue] = useState('customers');
  const [unitOfOccurrence, setUnitOfOccurrence] = useState('days');
  const [values, setValues] = useState(['']); // Keep this as an array of strings for categories
  const [occurrences, setOccurrences] = useState([0]);
  const [probabilities, setProbabilities] = useState(['0.00']);

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
  }, [values]);

  const addRow = () => {
    setValues([...values, '']); // Add empty string for new category
    setOccurrences([...occurrences, 0]);
    setProbabilities([...probabilities, 0]);
  };

  const deleteRow = () => {
    if (values.length > 1) {
      setValues(values.slice(0, -1));
      setOccurrences(occurrences.slice(0, -1));
      setProbabilities(probabilities.slice(0, -1));
    }
  };

  const handleInputChange = (index, event, type) => {
    if (type === 'value') {
      const newArray = [...values];
      newArray[index] = event.target.value; // Keep category as string
      setValues(newArray);
    } else if (type === 'occurrence') {
      const newArray = [...occurrences];
      newArray[index] = Number(event.target.value); // Ensure occurrences are numbers
      setOccurrences(newArray);
    } else if (type === 'probabilities') {
      const newArray = [...probabilities];
      let inputValue = event.target.value;

      // Automatically append "0." if the user inputs a number greater than 2 digits
      if (/^\d{3,}$/.test(inputValue)) {
        inputValue = `0.${inputValue}`;
      }

      // Validate input: must be a number between 0 and 1
      if (/^\d*\.?\d*$/.test(inputValue)) { // Allow numbers and decimals
        const parsedValue = parseFloat(inputValue);
        if (parsedValue >= 0 && parsedValue <= 1) { // Ensure value is between 0 and 1
          // Update the state with the raw input value
          newArray[index] = inputValue;
          setProbabilities(newArray);
        }
      }
    }
  };

  const handleProbabilityBlur = (index, event) => {
    const newArray = [...probabilities];
    const inputValue = event.target.value;

    // Format to 2 decimal places when the input loses focus
    const parsedValue = parseFloat(inputValue);
    if (!isNaN(parsedValue)) {
      newArray[index] = parsedValue.toFixed(2);
      setProbabilities(newArray);
    }
  };

  return (
    <div className='hist-cat-body-container'>
      <div className='hist-cat-input-unit-container'>
        <div className="inputs-container">
          <div className='input-label-container'>
            <label className="input-label-text">Unit of occurrence:</label>
            <input 
              type="text" 
              placeholder="Ex. days, years" 
              className="input-field-text"
              value={unitOfOccurrence}
              onChange={handleInputUnitofOccurrence}
              onKeyPress={(e) => !/[a-zA-Z\s]/.test(e.key) && e.preventDefault()}
            />
            <div className='input-label-container'></div>
          </div>
        </div>
        <div className="buttons-container">
          <div className="row-button" id='add-row-btn' onClick={addRow}>
            <p id='btn-text-icon'>+</p><p>add row</p>
          </div>
          <div className="row-button" onClick={deleteRow}>
            <p id='btn-text-icon'>-</p><p>delete last row</p>
          </div>
        </div>
      </div>
      <div className='hist-cat-table-container-table-wrapper'>
        <div className="hist-cat-table-container">
          <table className="cat-hist-table">
            <thead>
              <tr>
                <th>Category</th> {/* Fixed header */}
                <th>Number of {unitOfOccurrence}</th>
                <th>Input Probability</th>
              </tr>
            </thead>
            <tbody>
              {values.map((value, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleInputChange(index, e, 'value')} // Handle as string
                      placeholder="Enter category"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={occurrences[index]}
                      onChange={(e) => handleInputChange(index, e, 'occurrence')}
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="number" // Use number type
                      value={probabilities[index]}
                      onChange={(e) => handleInputChange(index, e, 'probabilities')}
                      onBlur={(e) => handleProbabilityBlur(index, e)} // Format on blur
                      step="0.01" // Enforce 2 decimal places
                      min="0.00"
                      placeholder="0.00"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="hist-cat-additional-data-container">
        <h4>Total number of {unitOfOccurrence}: {occurrences.reduce((acc, val) => acc + val, 0)}</h4>
        <p>Sum of the number of occurrences (used to divide an individual number of occurrence to get its probability)</p>
      </div>
    </div>
  );
};

export default CategoricalBodyContainer;