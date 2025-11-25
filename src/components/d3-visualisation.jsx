// src/components/d3-visualisation.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
// 1. Import the JSON data we just created
import data from '../data/homerColourData.json'; 
import './visualisation.css'; // Import the new styles

const D3Visualisation = () => {
    const svgRef = useRef(null); 

    useEffect(() => {
        // --- Setup Dimensions ---
        const margin = { top: 30, right: 30, bottom: 60, left: 60 };
        const width = 750 - margin.left - margin.right;
        const height = 550 - margin.top - margin.bottom;

        // Clear any previous SVG content (important for React's useEffect)
        d3.select(svgRef.current).selectAll("*").remove();

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
            
        // --- D3 Scales (1-10 Data to Pixel Range) ---
        
        // X-Scale: Darkness (1 to 10 score mapped across width)
        const xScale = d3.scaleLinear()
            .domain([1, 10]) // Data range: 1 (Lightest) to 10 (Darkest)
            .range([0, width]);

        // Y-Scale: Luminance (1 to 10 score mapped across height - reversed for SVG)
        const yScale = d3.scaleLinear()
            .domain([1, 10]) // Data range: 1 (Darkest) to 10 (Brightest)
            .range([height, 0]); // Reversing range makes 10 (Bright) appear at the top

        // --- Draw Axes ---

        // X-Axis (Darkness)
        g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickValues([1, 5, 10]).tickFormat(d => d === 1 ? 'LIGHTEST' : (d === 10 ? 'DARKEST' : d)))
            .attr("font-size", "12px")
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 45)
            .style("text-anchor", "middle")
            .style("fill", "#333")
            .text("Darkness / Saturation (X-Axis Score)");

        // Y-Axis (Luminance)
        g.append("g")
            .call(d3.axisLeft(yScale).tickValues([1, 5, 10]).tickFormat(d => d === 10 ? 'BRIGHTEST' : (d === 1 ? 'DARKEST' : d)))
            .attr("font-size", "12px")
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -45)
            .attr("x", -height / 2)
            .style("text-anchor", "middle")
            .style("fill", "#333")
            .text("Luminance / Brightness (Y-Axis Score)");

        // --- Draw Scatterplot Points ---
        g.selectAll(".dot")
            .data(data, d => d.term)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.xVal_Darkness))
            .attr("cy", d => yScale(d.yVal_Luminance))
            .attr("r", 8) 
            .style("fill", d => d.hue)
            .style("opacity", 0.8)
            .style("stroke", "#333");
            
        // For debugging and identification: add Greek labels (optional but helpful)
        g.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => xScale(d.xVal_Darkness) + 10)
            .attr("y", d => yScale(d.yVal_Luminance) + 4)
            .text(d => d.term)
            .style("font-size", "10px")
            .style("fill", "#333");

    }, []);

    return (
        <div className="viz-container">
            <svg ref={svgRef}></svg>
            {/* We'll implement a custom tooltip here later */}
        </div>
    );
};

export default D3Visualisation;