import React, { useState, useMemo } from 'react';
import { Scrollama, Step } from 'react-scrollama';
import D3SeaFrequency from './components/d3-sea-frequency.jsx';
import D3ScatterPlot from './components/d3-scatterplot.jsx';
import D3ShimmerStrip from './components/d3-shimmer-strip.jsx';
import referencePaletteData from './data/iliad_references_colour_palettes.json';
import { GREEK_TO_TRANSLITERATION } from './data/constants.js';
import './components/visualisation.css';

function App() {
  const [currentStep, setCurrentStep] = useState(0); // tracks which step is active
  const [hoveredTerm, setHoveredTerm] = useState(null);
  const [selectedReference, setSelectedReference] = useState('Iliad (books 1 to 24)');

  // Derive the set of transliterations present in the selected reference's palette
  const activeTerms = useMemo(() => {
    const refEntry = referencePaletteData.data.find(d => d.reference === selectedReference);
    if (!refEntry) return new Set();
    return new Set(
      refEntry.colour_frequencies
        .map(c => GREEK_TO_TRANSLITERATION[c.term_category])
        .filter(Boolean)
    );
  }, [selectedReference]);

  // callback updates the state whenever a new step enters the view
  const onStepEnter = ({ data }) => {
    setCurrentStep(data);
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #1E3A5F',
    borderRadius: '4px',
    textAlign: 'left',
  };

  const steps = [
    {
      id: 1,
      content: (
        <div style={cardStyle}>
          <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '18px' }}>
            Explore the colour palettes by context and hover over each scatterplot colour term to reveal its transliteration and common epithets, from the ‘wine-dark’ sea to the ‘rosy-fingered’ dawn.  
            <br />
            <br />
            The polar area chart represents the frequency of each term; larger wedges mean the colour term appears more often for that particular context.
          </p>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="intro-section">
        <h1 className="chart-title" style={{ fontSize: '48px', marginBottom: '30px', color: '#1E3A5F' }}>
          The sea was never blue
        </h1>

        <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '18px' }}>
          To the modern reader standing on the cliffs of the Aegean, the water is an unmistakable, brilliant blue.
          Yet a pure blue sea cannot be found anywhere in the 24 books of the Iliad — nor, indeed, in the whole of
          ancient Greek literature. Blue is notably absent from the Greek colour vocabulary; the ancient Greeks had
          no word that correlates to our modern concept of blue at all. Homer used two adjectives related to the colour
          blue: <span style={{ color: '#1E3A5F' }}><strong><em> kuaneos</em></strong></span> for a dark blue merging into a black,
          and <span style={{ color: '#6B9AA3' }}><strong><em>glaukos</em></strong></span> for a pale, glinting blue-grey that flickers
          behind the goddess Athena's <span style={{ color: '#6B9AA3' }}><strong><em>glaukopis</em></strong></span> eyes. Homer describes the sea as 'wine-dark' (<span style={{ color: '#43171e' }}><strong><em>oinops</em></strong></span>),
          a shimmering purple (<span style={{ color: '#53285b' }}><strong><em>porphureous</em></strong></span>),
          sometimes chalky and foaming (<span style={{ color: '#c2c2c2' }}><strong><em>polios</em></strong></span>),
          sometimes shading into near-black depths (<span style={{ color: '#1A1A1A' }}><strong><em>melas</em></strong></span>),
          but never just 'blue'.
        </p>

        <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '18px' }}>
          William Gladstone, the four-time British Prime Minister and classics scholar, counted every colour reference
          in the <em>Odyssey</em> and <em>Iliad</em> in his <em>Studies on Homer and the Homeric Age</em> (1858). Gladstone concluded that this
          linguistic void was because the Greeks were in effect colourblind, arguing that "the organ of colour and its
          impressions were but partially developed among the Greeks of the heroic age". This was typical of the
          post-Darwinian intellectual landscape of the late 19th century. Gladstone suggested the Greeks saw the world
          in a monochrome of black and white, with occasional flashes of red (<span style={{ color: '#B8302C' }}><strong><em>erythros</em></strong></span>).
          Rather than a lack of physical perception, modern linguists see Homer's vocabulary as a reflection of how language shifts across cultures
          based on its own distinct worldview.
        </p>

        <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '18px' }}>
          This analysis revisits Gladstone's historic study by mapping every colour term and it's context across the
          24 books of the Iliad, capturing 14 distinct Homeric colour terms. Homeric colour is overwhelming achromatic.
          Brightness (<strong><em>leukos</em></strong>) and darkness (<span style={{ color: '#1A1A1A' }}><strong><em>melas</em></strong></span>) function as the poem's primary visual dimensions, and together with 
          <span style={{ color: '#c2c2c2' }}><strong><em> polios</em></strong></span> and <strong><em>argos</em></strong> (a bright shining white), capture more than half of all colour references. The sheer
          versatility of <span style={{ color: '#1A1A1A' }}><strong><em>melas</em></strong></span> is striking — its 111 uses span ships (39), death/mortality (14), atmosphere/night (12),
          blood (11), human suffering (8), land (7), and water (6).
        </p>

        <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '18px' }}>
          Outside of the fundamental dimensions of light and dark, <span style={{ color: '#B8302C' }}><strong><em>erythros</em></strong></span> was the only colour term Homer reserved
          for a single hue. Yet true red is almost entirely missing from the poem; even blood is consistently described
          as <span style={{ color: '#1A1A1A' }}><strong><em>melas</em></strong></span>. In fact, <span style={{ color: '#B8302C' }}><strong><em>erythros</em></strong></span> appears just twice in the entire epic. The first occurs in Book 9 when Achilles
          speaks of "red bronze" while listing the treasures he will renounce by walking away from battle. The second is in Book 19,
          when the goddess Thetis preserves Patroclus' body with "ambrosia and red nectar," the drink of the gods. The dark colour
          terms outnumbered light colour terms at a ratio of nearly 2:1. The world of the <em>Iliad</em> is significantly darker than it is bright.
        </p>

        <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '18px' }}>
          Though the sea is central to the world of the Achaeans, appearing roughly 160 times across the 24 books of the 
          <em> Iliad</em>, Homer describes it with a colour term just 12 times: <span style={{ color: '#43171e' }}><strong><em>oinops</em></strong></span> (5), <span style={{ color: '#1A1A1A' }}><strong><em>melas</em></strong></span> (3), <span style={{ color: '#53285b' }}><strong><em>porphoreos</em></strong></span> (2), <span style={{ color: '#c2c2c2' }}><strong><em>polios</em></strong></span> (1)
          and <span style={{ color: '#6B9AA3' }}><strong><em>glaukopis</em></strong></span> (1). The vast majority of the other oceanic references focus on sensory and physical behaviours,
          using descriptive words such as tumultuous, barren, or echoing. The sea was defined by its texture and sound long before it was
          categorised by hue.
        </p>


      </div>

      <div className="scrolly-container">
        <div className="sticky-graphic">
          <D3ScatterPlot activeStep={currentStep} onTermHover={setHoveredTerm} activeTerms={activeTerms} fadeDots={selectedReference !== 'Iliad (books 1 to 24)'} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <p style={{ fontFamily: 'Martian Mono, monospace', fontSize: '12px', color: '#000000', marginBottom: '16px', marginTop: '-20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              Colour palette of
              <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <select
                  value={selectedReference}
                  onChange={e => {
                    setSelectedReference(e.target.value);
                  }}
                  style={{
                    fontFamily: 'Martian Mono, monospace',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#000000',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1.5px solid #000000',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    padding: '0 18px 0 0',
                    outline: 'none',
                  }}
                >
                  {referencePaletteData.data.map(d => (
                    <option key={d.reference} value={d.reference} style={{ fontFamily: 'Martian Mono, monospace' }}>{d.reference}</option>
                  ))}
                </select>
                <span style={{ position: 'absolute', right: 0, pointerEvents: 'none', fontSize: '10px' }}>▾</span>
              </span>
            </p>
            <D3SeaFrequency reference={selectedReference} hoveredTerm={hoveredTerm} size={300} />
          </div>
        </div>

        <div className="scrolly-scroll">
          <Scrollama onStepEnter={onStepEnter} offset={0.5}>
            {steps.map((step) => (
              <Step data={step.id} key={step.id}>
                <div className="step-full-height">
                  <div className="step-card">
                    {step.content}
                  </div>
                </div>
              </Step>
            ))}
          </Scrollama>
        </div>

        {/* Spacer so the graphic stays visible and interactive after the card scrolls away */}
        <div style={{ height: '100vh' }}></div>
      </div>

      <div className="below-graphic-section">

        <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '18px' }}>
          Ancient Greeks placed emphasis on the way colour could flicker and flash, the 'glitter effect'.
          <span style={{ color: '#53285b' }}><strong><em> Porphureous</em></strong></span> is a perfect example. 
          While modern translations often flatten this to 'purple', it does not correspond to any definitive hue and 
          is a combination of brightness caught in motion, impossible to grasp without imagining its glimmering edge. 
          When the sea is called <span style={{ color: '#53285b' }}><strong><em>porphureous</em></strong></span>, the description points to its restless play of light, shifting hour by 
          hour with the weather and sunlight.

        </p>

        <D3ShimmerStrip />

        <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '18px' }}>
          By mapping every colour term and its context across Homeric literature, it becomes clear that the ancient 
          Greeks experienced colours in degrees of lightness and darkness, inseparable from motion and shimmer. It 
          is not that the Greeks' were unable to perceive some colours. Understanding ancient colour perception 
          requires stripping away our own modern concepts, from Isaac Newton's prism optics to industrial textile 
          dyes and standard colour wheels, which define colour by it's position on a hue spectrum. Rather than 
          categorisation by hue, Greek colour terms prioritised luminosity and the play of light across surfaces, 
          the texture of materials, even the social standing implied by a sheen or shade. It was a colour vocabulary 
          rooted in their lived perception.
        </p>

      </div>

      <div style={cardStyle} className="methodology-section">
        <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '22px' }}>
            Methods and data
        </p>

        <p className="body-text" style={{ fontFamily: 'Louize Display', fontSize: '16px' }}>
            The ancient Greek text of the <em>Iliad</em> was sourced from the <a href="https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0133" target="_blank" rel="noopener noreferrer">Perseus Digital Library</a>. All 24 books were parsed 
            using a Python script, stripping diacritics and normalising Unicode so that each search could catch all 
            the forms a word takes across the poem. Ancient Greek is a highly inflected language, meaning that a single word 
            changes its ending depending on its grammatical role in a sentence. For example, a colour term like μέλας (melas, black) c
            an appear as μελαίνης, μέλαν, μέλανος, and other variants depending on grammatical case, number, and gender. 
            Searching on word roots rather than exact spellings was the only way to count all instances colour terms were used, 
            though it also meant counting instances where a colour root was being used as something else entirely, e.g. ξανθός 
            (xanthos) is the word for blond or golden-yellow, but Xanthos is also the name of one of Achilles' immortal horses.
            <br />
            <br />
            The 16 colour terms analysed were selected through a literature review drawing on over a hundred academic sources in 
            classical philology and ancient colour perception theory. The terms represent the major Homeric colour adjectives for 
            which there is consistent scholarly consensus.
            <br />
            <br />
            For each colour term, a regex pattern was written to capture the full range of inflected forms that appear across the poem. 
            Each match was recorded alongside its book number, line number, and the surrounding Greek phrase.
            <br />
            <br />
            Every row of data was manually reviewed. For each match, the English translation of the surrounding Greek phrase was checked 
            to confirm that the term was genuinely being used in a colour sense in context and not simply sharing a root with a colour word. 
            Rows where this wasn't the case were removed, as were a small number of proper nouns where no colour meaning was intended. 
            The final counts for each term were then compared against figures in the academic literature to verify the dataset was as accurate as possible.
            <br />
            <br />
            Each of the 16 colour terms was then manually scored from 0 to 10 across three dimensions: luminosity (or brightness), shimmer and movement. 
            The three-dimensional framework draws on Grand-Clément (2004) and Durão (2022), who argue ancient Greek colour terms prioritise luminosity, 
            <em>chatoiement</em> (iridescent surface shimmer), and movement over the hue-based categories of modern colour language. A composite "gleam score” 
            was calculated by averaging the shimmer and movement scores. The scoring went through several iterations and manual spot-checks 
            before settling on final values.
            <br />
            <br />
            Each individual colour term occurrence was then manually classified by reference, i.e. what is being described. Categories 
            include gods and divine attributes, natural phenomena (sea, sky, atmosphere, land), material culture (ships, metalwork and armour, 
            textiles, food), human physical attributes (hair, skin, body), animals, and emotional or metaphorical uses (death, pale fear, dark grief). 
            This classification allowed for a breakdown of which colour terms cluster around which domains of Homeric literature.
            <br />
            <br />
            Research for this piece included the following works: <a href="https://doi.org/10.1093/CQ/BMI034" target="_blank" rel="noopener noreferrer">Gods' Blue Hair in Homer and in Eighteenth-Dynasty Egypt</a> by R. Drew Griffith (2005), <a href="https://doi.org/10.1002/COL.5080060410" target="_blank" rel="noopener noreferrer">Notes on Color Terminology in the Iliad and the Epic of Gilgamesh</a> by Rolf G. Kuehni (1981), <a href="https://scispace.com/papers/historie-du-paysage-sensible-des-grecs-a-l-epoque-archaique-19x8npcvly" target="_blank" rel="noopener noreferrer">Histoire du paysage sensible des Grecs à l'époque archaïque</a> by Adeline Grand-Clément, <a href="https://doi.org/10.1201/9780429299070-46" target="_blank" rel="noopener noreferrer">Did the Ancient Greeks Perceive the Color 'Blue'?</a> by M. J. Durão (2022), <a href="https://doi.org/10.1007/978-3-030-20538-6_1" target="_blank" rel="noopener noreferrer">Is the Sea Wine-Dark?</a> by R. Schiller (2019), <a href="https://aeon.co/essays/can-we-hope-to-understand-how-the-greeks-saw-their-world" target="_blank" rel="noopener noreferrer">Can We Hope to Understand How the Greeks Saw Their World?</a> by Maria Michela Sassi.
        </p>
      </div>

    </div>
  );
}

export default App;