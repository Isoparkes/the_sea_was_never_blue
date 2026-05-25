import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import fullData from '../data/iliad_colour_data.json';
import { HOMERIC_COLOURS } from '../data/constants.js';
import './visualisation.css';

const D3ShimmerStrip = () => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const data = [...fullData.colour_scales].sort(
      (a, b) => a.Unique_gleam_score - b.Unique_gleam_score
    );

    const r = 8; // dot radius (px)

    const margin = { top: 20, right: 80, bottom: 72, left: 80 };
    const containerWidth = containerRef.current?.clientWidth || 800;
    const width = containerWidth - margin.left - margin.right;

    // ── Position dots on axis ────────────────────────────────────────────────
    const xScale = d3.scaleLinear().domain([0, 10]).range([r * 2, width - r * 2]);

    const plottedData = data.map(d => ({
      ...d,
      px: xScale(d.Unique_gleam_score),
      py: 0,
    }));

    // ── SVG dimensions ───────────────────────────────────────────────────────
    const dotsHeight = r; // just enough room above the axis for the dot radius
    const totalHeight = margin.top + dotsHeight + margin.bottom;
    const baselineY = margin.top + dotsHeight; // y of the axis line inside the SVG

    // ── Draw ─────────────────────────────────────────────────────────────────
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', totalHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${baselineY})`);

    // Axis line
    svg.append('line')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', width).attr('y2', 0)
      .attr('stroke', '#1A1A1A')
      .attr('stroke-width', 1);

    // End ticks
    [0, width].forEach(x => {
      svg.append('line')
        .attr('x1', x).attr('y1', -8)
        .attr('x2', x).attr('y2', 8)
        .attr('stroke', '#1A1A1A')
        .attr('stroke-width', 1);
    });

    // "No shimmer" label
    svg.append('text')
      .attr('x', 0).attr('y', 34)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Martian Mono, monospace')
      .style('font-size', '12px')
      .style('fill', '#1A1A1A')
      .text('No gleam');

    // "Very high shimmer" label
    svg.append('text')
      .attr('x', width).attr('y', 34)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Martian Mono, monospace')
      .style('font-size', '12px')
      .style('fill', '#1A1A1A')
      .text('Very high gleam');

    // Axis title
    svg.append('text')
      .attr('x', width / 2).attr('y', 52)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Martian Mono, monospace')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#1A1A1A')
      .text('Shimmer and movement quality');

    // Dots
    svg.selectAll('.shimmer-dot')
      .data(plottedData)
      .join('circle')
      .attr('class', d => d.Greek_Term === 'πορφυρεός' ? 'shimmer-dot dot-porphureos-shimmer' : 'shimmer-dot')
      .attr('cx', d => d.px)
      .attr('cy', d => d.py)
      .attr('r', r)
      .attr('fill', d => HOMERIC_COLOURS[d.Greek_Term] || '#ccc')

    // Eye-shine diamond on porphureos
    const porphureos = plottedData.find(d => d.Greek_Term === 'πορφυρεός');
    if (porphureos) {
      const s = 4.5, sw = 3.5, i = 0.7;
      const starPath = `M 0,${-s} L ${i},${-i} L ${sw},0 L ${i},${i} L 0,${s} L ${-i},${i} L ${-sw},0 L ${-i},${-i} Z`;

      svg.append('path')
        .attr('class', 'porphureos-eyeshine')
        .attr('d', starPath)
        .attr('transform', `translate(${porphureos.px - 1}, ${porphureos.py - r + 6})`)
        .attr('fill', 'white');
    }

  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <svg ref={svgRef} style={{ display: 'block', overflow: 'visible' }} />
    </div>
  );
};

export default D3ShimmerStrip;
