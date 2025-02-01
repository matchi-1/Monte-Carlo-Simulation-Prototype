import './styles/App.css';
import './styles/HistCat.css';
import React, { useState } from 'react';
import HistoricalBodyContainer from './components/HistoricalBodyContainer'; 
import CategoricalBodyContainer from './components/CategoricalBodyContainer';

function App() {
  const [activeTab, setActiveTab] = useState('historical'); // State for active tab

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

            {/* Use the HistoricalBodyContainer component */}
            {activeTab === 'historical' ? (
              <HistoricalBodyContainer activeTab={activeTab} />
            ) : (
              <CategoricalBodyContainer activeTab={activeTab} />
            )}
          </div>
          <div className='computations-container'>
            <div className='cont-header-container'>
              <p>Computations</p>
            </div>
            <div className='computation-body-container'>

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