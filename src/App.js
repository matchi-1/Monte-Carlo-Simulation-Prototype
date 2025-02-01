import logo from './logo.svg';
import './App.css';

function App() {
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
            
          </div>
          <div className='data-inst-container'>
            
          </div>
        </div>
        <div className='monte-carlo-sim-container'>
          <div className='hist-cat-container'>
          
          </div>
          <div className='computations-container'>
          
          </div>
          <div className='simulations-container'>
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
