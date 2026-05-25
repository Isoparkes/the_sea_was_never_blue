import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import fullData from '../data/iliad_colour_data.json';
import { HOMERIC_COLOURS } from '../data/constants.js';
import './visualisation.css';

const LABEL_OFFSETS = {
    'χλωρός': { x: -6, y: -22 },
    'πολιός': { x: -3, y: 0 },  // otherwise χλωρός is overlapping with οἶνοψ
};

const D3ScatterPlot = ({activeStep, onTermHover, activeTerms, fadeDots}) => {
    const svgRef = useRef(null); 
    const tooltipRef = useRef(null); // html tooltip can float anywhere on the page, it is not constrained by the SVG container

    useEffect(() => {
        const data = fullData.colour_scales;

        const margin = { top: 36, right: 100, bottom: 80, left: 100 };
        const width = 720 - margin.left - margin.right;
        const height = 540 - margin.top - margin.bottom;

        // clear previous render
        d3.select(svgRef.current).selectAll("*").remove();

        // create SVG container
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);
        
        // x, y scales
        const xScale = d3.scaleLinear().domain([0, 10]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);

        // Low/Moderate/High categories on the axes
        const separators = [3.33, 6.66]; 
        const labelPositions = [1.67, 5, 8.33]; // center points for the text labels
        const categoryLabels = ["LOW", "MODERATE", "HIGH"];

        // gridlines
        const makeXGrid = () => d3.axisBottom(xScale).tickValues(separators);
        const makeYGrid = () => d3.axisLeft(yScale).tickValues(separators);

        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(makeXGrid()
                .tickSize(-height)
                .tickFormat("")
            )
            .style("stroke-dasharray", "3 3") // dashed lines for separators
            .style("stroke-opacity", 0.3);

        svg.append("g")
            .attr("class", "grid")
            .call(makeYGrid()
                .tickSize(-width)
                .tickFormat("")
            )
            .style("stroke-dasharray", "3 3")
            .style("stroke-opacity", 0.3);

        // x-axis (Gleam) set-up
        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0,${height})`);

        // tick labels (Low, Moderate, High)
        xAxisGroup.call(d3.axisBottom(xScale)
            .tickValues(labelPositions)
            .tickFormat((d, i) => categoryLabels[i])
            .tickSize(0) // hide the ticks under the text
            .tickPadding(15));
            
        // ticks (at the boundaries 0.33 and 0.66)
        xAxisGroup.append("g")
            .call(d3.axisBottom(xScale)
            .tickValues([0, ...separators, 10]) // ticks at 0, 3.33, 6.66, 10 (separators)
            .tickFormat("")
            .tickSize(6));

        // axis label
        xAxisGroup.append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 58)
            .attr("fill", "#333")
            .style("text-anchor", "middle")
            .text("Gleam (shimmer & movement)");

        // y-axis (Luminosity) set-up
        const yAxisGroup = svg.append("g");

        // tick labels (Low, Moderate, High)
        yAxisGroup.call(d3.axisLeft(yScale)
            .tickValues(labelPositions)
            .tickFormat((d, i) => categoryLabels[i])
            .tickSize(0)
            .tickPadding(10)) // padding between tick labels and axis
            .selectAll("text")
                .attr("transform", "rotate(-90)") // rotate text labels 90 degrees counter-clockwise
                .style("text-anchor", "middle")   // centre the text on the tick mark
                .attr("x", 0)   // reset X (which becomes vertical position after rotation)
                .attr("y", -15) // move Y (which becomes horizontal distance) to the left
                .style("font-family", "Martian Mono, monospace")
                .style("font-size", "11px");

        // ticks (at the boundaries 0.33 and 0.66)
        yAxisGroup.append("g")
            .call(d3.axisLeft(yScale)
            .tickValues([0, ...separators, 10])
            .tickFormat("")
            .tickSize(6));

        // axis label
        yAxisGroup.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("y", -59)
            .attr("x", -height / 2)
            .attr("fill", "#333")
            .style("text-anchor", "middle")
            .text("Luminosity (brightness)");

        // html tooltip
        const tooltipDiv = d3.select(tooltipRef.current);

        if (activeStep >= 0){

            // Render Dots Instantly
            svg.selectAll(".dot")
                .data(data)
                .join("circle")
                .attr("class", "dot")
                .attr("cx", d => xScale(d.Unique_gleam_score)) 
                .attr("cy", d => yScale(d.Luminosity_Score))     
                .attr("r", 8) 
                .style("fill", d => HOMERIC_COLOURS[d.Greek_Term] || "#ccc")
                .style("opacity", 1)
                .style("cursor", "pointer")
                // tooltip listeners
                .on("mouseover", (event, d) => {
                    onTermHover?.(d.Transliteration); // hover callback
                    const [x, y] = d3.pointer(event, svgRef.current); 

                    const isWhite = d.Greek_Term === 'ἀργός' || d.Greek_Term === 'λευκός';
                    const textColor = isWhite ? '#000000' : HOMERIC_COLOURS[d.Greek_Term];

                    tooltipDiv.html(`
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px; color: #000;">
                            <span>${d.Transliteration}</span>
                            <span style="font-family: Georgia, serif; font-weight: normal; font-size: 15px; color: ${textColor};">
                                ${d.Greek_Term}
                            </span>
                        </div>
                        <div style="color: #666; font-style: italic;">
                            ${d.English}
                        </div>
                        <div style="margin-top: 5px; padding-top: 5px; font-size: 11px;">
                            ${d.Context}
                        </div>
                    `);

                    const nearRight = x > (width + margin.left) * 0.95;

                    tooltipDiv
                        .style("opacity", 1)
                        .style("min-width", nearRight ? "160px" : "300px")
                        .style("max-width", nearRight ? "180px" : "320px")
                        .style("left", (x + 20) + "px")
                        .style("top", (y - 10) + "px");
                    
                    d3.select(event.currentTarget)
                        .transition().duration(200)
                        .attr("r", 10);
                })
                .on("mouseout", (event, d) => {
                    onTermHover?.(null); // hover callback reset
                    tooltipDiv.style("opacity", 0);
                    d3.select(event.currentTarget)
                        .transition().duration(200)
                        .attr("r", 8);
                });

            // Render Greek Labels Instantly
            svg.selectAll(".label")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", d => {
                    const offset = LABEL_OFFSETS[d.Greek_Term]?.x || 0;
                    return xScale(d.Unique_gleam_score) + 14 + offset;
                })
                .attr("y", d => {
                    const offset = LABEL_OFFSETS[d.Greek_Term]?.y || 0;
                    return yScale(d.Luminosity_Score) + 10 + offset;
                })
                .text(d => d.Greek_Term)
                .style("font-size", "13px")
                .style("font-family", "Georgia, serif")
                .style("fill", "#333")
                .style("opacity", 1); 
        }
    }, [activeStep]);

    // ── Effect 2: respond to reference dropdown selection — dim dots not in the selected reference's palette ───────
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const terms = activeTerms || new Set();
        if (!fadeDots) {
            // Reset all dots and labels to full opacity
            svg.selectAll('.dot').transition().duration(300).style('opacity', 1);
            svg.selectAll('.label').transition().duration(300).style('opacity', 1);
        } else {
            // Fade out dots and labels that aren't part of the selected reference's palette
            svg.selectAll('.dot')
                .transition().duration(300)
                .style('opacity', d => terms.has(d.Transliteration) ? 1 : 0.08);
            svg.selectAll('.label')
                .transition().duration(300)
                .style('opacity', d => terms.has(d.Transliteration) ? 1 : 0.08);
        }
    }, [fadeDots, activeTerms]);

    return (
        <div className="viz-container">
            <svg ref={svgRef}></svg>
            <div ref={tooltipRef} className="html-tooltip"></div>
        </div>
    );
};

export default D3ScatterPlot;