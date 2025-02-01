import React, { useState, useEffect } from 'react';

const HistoricalBodyContainer = ({ activeTab }) => {
  const [unitOfValue, setUnitOfValue] = useState('customers');
  const [unitOfOccurrence, setUnitOfOccurrence] = useState('days');
  const [values, setValues] = useState([0]);
  const [occurrences, setOccurrences] = useState([0]);
  const [probabilities, setProbabilities] = useState([0]);

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
              onKeyPress={(e) => !/[a-zA-Z\s]/.test(e.key) && e.preventDefault()}
            />
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
                      onChange={(e) => handleInputChange(index, e, 'occurrence')}
                      min="0"
                    />
                  </td>
                  <td>{probabilities[index]?.toFixed(3) || '0.000'}</td>
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

export default HistoricalBodyContainer;
