import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('historical');
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
                  <div className="row-button" id='add-row-btn'><p id='btn-text-icon'>+</p><p>add row</p></div>
                  <div className="row-button"><p id='btn-text-icon'>-</p><p>delete last row</p></div>
                </div>
              </div>

              <div className='hist-cat-additional-data-container'>

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
