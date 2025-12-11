import React from 'react';
import D3ScatterPlot from './components/d3-scatterplot.jsx';
import './components//visualisation.css';

function App() {
  return (
    <div className="App">
      
      <h1 className="chart-title" style={{ fontSize: '48px', marginBottom: '10px', color: '#1E3A5F' }}>
        The sea was never blue
      </h1>
      
      <p className="body-text"style={{ fontFamily: 'Martian Mono', fontSize: '12px' }}>
        The ancient Greek experience of colour was inseparable from motion and shimmer. 
        Colour was a basic unit of information which reflected the natural world – encoding brightness 
        and darkness as fundamental dimensions. Greek colour terms not only prioritised luminosity but the 
        play of light across surfaces, the texture of materials, even the social standing implied by a sheen or shade. 
        It was a colour vocabulary rooted in their lived perception, rather than the modern hue-based categories 
        we use today.
      </p>

      <p className="body-text" style={{ fontFamily: 'Martian Mono', fontSize: '12px' }}>
        Blue is notably absent from the Greek colour vocabulary. Homer used two adjectives related to the colour blue: 
        <span style={{ color: '#1E3A5F' }}><strong><em> kuaneos</em></strong></span> for dark blue merging into black, 
        and <span style={{ color: '#6B9AA3' }}><strong><em>glaukos</em></strong></span> for a pale, glinting blue-grey 
        that flickers behind Athena's <span style={{ color: '#6B9AA3' }}><strong><em>glaukopis</em></strong></span> eyes. 
        Homer describes the sea as 'wine-dark' (<span style={{ color: '#43171eff' }}><strong><em>oinops</em></strong></span>), 
        turbulent purple (<span style={{ color: '#53285bff' }}><strong><em>porphureous</em></strong></span>), 
        sometimes chalky and foaming (<span style={{ color: '#8C8C8C' }}><strong><em>polios</em></strong></span>), 
        sometimes shading into near-black depths (<span style={{ color: '#1A1A1A' }}><strong><em>melas</em></strong></span>). 
        The sea was never just blue.
      </p>

      <p className="body-text" style={{ fontFamily: 'Martian Mono', fontSize: '12px' }}>
        This visualisation explores the 'sensory' experience of ancient Greek colour perception, with a focus on the
        major colour adjectives Homer uses in the <em>Iliad</em>. Hover over each colour term to reveal Homeric contexts
        – from the 'wine-dark' sea to the 'rosy-fingered' dawn.
      </p>

      <div className="chart-container">
        <D3ScatterPlot />
      </div>

      <p className="body-text" style={{ fontFamily: 'Martian Mono', fontSize: '12px' }}>
        Ancient Greeks placed emphasis on the way colour could flicker and flash, the 'glitter effect'. 
        <span style={{ color: '#53285bff' }}><strong><em> Porphureous</em></strong></span> is a perfect example, a combination 
        of brightness caught in motion, impossible to grasp without imagining its glimmering edge. When the sea is called 
        <span style={{ color: '#53285bff' }}><strong><em> porphureous</em></strong></span>, the description points to its
        restless play of light, shifting hour by hour with the weather and sunlight.
      </p>
      
    </div>
  );
}

export default App;