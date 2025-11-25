import React from 'react';
import D3Visualisation from './components/d3-visualisation.jsx';

// Note: You might need to clean up your src/index.css or src/App.css later, 
// but for now, this basic structure works.

function App() {
  return (
    <div className="App flex flex-col items-center min-h-screen p-8 bg-gray-50">
      <h1 className="text-4xl font-serif font-bold text-gray-800 mb-6 mt-4">
        🏛️ Homeric Colour: Luminance vs. Darkness TESTING
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        The first stage visualises Homer's colour terms on scales of brightness (Luminance) and depth (Darkness/Saturation). 
        The highest score (10) represents the maximum of that property.
      </p>
      <D3Visualisation/>
    </div>
  );
}

export default App;