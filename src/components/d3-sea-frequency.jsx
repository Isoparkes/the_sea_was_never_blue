import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import referencePaletteData from '../data/iliad_references_colour_palettes.json';
import { HOMERIC_COLOURS, GREEK_TO_TRANSLITERATION } from '../data/constants.js';

const D3SeaFrequency = ({ reference = 'Iliad (books 1 to 24)', hoveredTerm, onSegmentHover, size = 400 }) => {
    const svgRef = useRef(null);

    // Derive data from the selected reference — recomputes only when reference changes
    const data = useMemo(() => {
        const refEntry = referencePaletteData.data.find(d => d.reference === reference);
        if (!refEntry) return [];
        return refEntry.colour_frequencies.map(d => ({
            ...d,
            greekTerm: d.term_category,
            transliteration: GREEK_TO_TRANSLITERATION[d.term_category] || d.term_category,
        }));
    }, [reference]);

    // ── Effect 1: build the chart once ──────────────────────────────
    useEffect(() => {
        const width = size;
        const height = size;
        const margin = Math.round(size * 0.1);
        const radius = size / 2 - margin;

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Polar area: equal angles, radius encodes frequency
        const angleSlice = (2 * Math.PI) / data.length;
        const maxFreq = d3.max(data, d => d.frequency);
        const rScale = d3.scaleSqrt().domain([0, maxFreq]).range([0, radius]);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(d => rScale(d.frequency))
            .startAngle((_, i) => i * angleSlice)
            .endAngle((_, i) => (i + 1) * angleSlice)
            .padAngle(0); // no gaps — segments share exact edges

        svg.selectAll('.arc-slice')
            .data(data)
            .join('path')
            .attr('class', 'arc-slice')
            .attr('data-transliteration', d => d.transliteration) // key for Effect 2
            .attr('d', arc)
            .attr('fill', d => HOMERIC_COLOURS[d.greekTerm] || '#ccc')
            .attr('fill-opacity', 0.85)
            .attr('stroke', 'none') // no stroke — eliminates doubled borders between segments
            .style('cursor', 'pointer')
            .on('mouseover', (event, d) => { onSegmentHover?.(d.transliteration); })
            .on('mouseout', () => { onSegmentHover?.(null); });


    }, [data, size]);

    // ── Effect 2: respond to hover changes ──────────────────────────
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        if (!hoveredTerm) {
            // Nothing hovered — reset all slices
            svg.selectAll('.arc-slice')
                .transition().duration(200)
                .attr('fill-opacity', 0.85);
            return;
        }

        // Check if the hovered scatterplot term appears in the current reference's chart
        const termIsInChart = data.some(d => d.transliteration === hoveredTerm);

        svg.selectAll('.arc-slice')
            .transition().duration(200)
            .attr('fill-opacity', d =>
                !termIsInChart ? 0.85
                : d.transliteration === hoveredTerm ? 1
                : 0.08
            );

    }, [hoveredTerm, data]); // ← runs whenever hover or reference data changes

    return <svg ref={svgRef} style={{ overflow: 'visible' }}></svg>;
};

export default D3SeaFrequency;