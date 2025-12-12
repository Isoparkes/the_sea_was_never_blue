import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import fullData from '../data/iliad_colour_data.json'; 
import './visualisation.css';

const HOMERIC_COLOURS = {
    'γλαυκός': '#6B9AA3', 'κυάνεος': '#1E3A5F','πορφυρεός': '#53285bff', 
    'οἶνοψ': '#43171eff', 'φοῖνιξ': '#8B2F39', 'ἐρυθρός': '#B8302C', 
    'ῥοδοδάκτυλος': '#E8A0A0', 'ξανθός': '#D4AF37', 'αἴθων': '#C85A28', 
    'χλωρός': '#9CAF88', 'λευκός': '#FAFAFA', 'ἀργός': '#f4f4f4ff', 
    'πολιός': '#c2c2c2ff','μέλας': '#1A1A1A'
};

const LABEL_OFFSETS = {
    'χλωρός': { x: -5, y: -26 },  // otherwise χλωρός is overlapping with οἶνοψ
};

const D3ScatterPlot = ({activeStep}) => {
    const svgRef = useRef(null); 
    const tooltipRef = useRef(null); // html tooltip can float anywhere on the page, it is not constrained by the SVG container

    const hasAnimated = useRef(false);

    useEffect(() => {
        const data = fullData.colour_scales;

        const margin = { top: 40, right: 110, bottom: 90, left: 110 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

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
            .attr("y", 65)
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
            .attr("y", -65)
            .attr("x", -height / 2)
            .attr("fill", "#333")
            .style("text-anchor", "middle")
            .text("Luminosity (brightness)");
        
        // SVG tooltip (this is clipped by the canvas margins)
        // const tooltipGroup = svg.append("g")
        //     .style("opacity", 0) // hide tooltip initially
        //     .style("pointer-events", "none"); // prevent mouse interaction

        // tooltipGroup.append("rect")
        //     .attr("width", 300)
        //     .attr("height", 120)
        //     .attr("fill", "white")
        //     .attr("stroke", "#000000ff") // border
        //     .attr("x", 30) // offset tooltip
        //     .attr("y", -10) // offset

        // tooltipGroup.append("text")
        //     .text("hello")
        //     .attr("x", 55) // Center of the rect (30 + 50/2)
        //     .attr("y", 4)  // Vertical center approximation
        //     .style("text-anchor", "middle")
        //     .style("font-size", "12px")
        //     .style("fill", "black");

        // html tooltip
        const tooltipDiv = d3.select(tooltipRef.current)

        if (activeStep >= 2){

            const shouldAnimate = !hasAnimated.current;

            // animation and scatterplot points (dots)
            const DOT_DELAY = 500;
            const DOT_DURATION = 2000;

            const tDots = d3.transition()
                .duration(DOT_DURATION)
                .delay(DOT_DELAY)
                .ease(d3.easeExpOut);

            svg.selectAll(".dot")
                .data(data)
                .join("circle")
                .attr("class", "dot")
                .attr("cx", width) // animation starts in the top right corner
                .attr("cy", 0)     // ^^^
                .attr("r", 0) 
                .style("fill", d => HOMERIC_COLOURS[d.Greek_Term] || "#ccc")
                .style("opacity", 0.9)
                .style("cursor", "pointer")
                // tooltip
                .on("mouseover", (event, d) => {
                    // tooltipGroup.raise(); // when using SVG tooltips, this brings the tooltip in front of graph text
                    // tooltipGroup
                    //     .attr("transform", `translate(${xScale(d.Unique_gleam_score)}, ${yScale(d.Luminosity_Score)})`)
                    //     .transition()
                    //     .style("opacity", 1); // make tooltip visible

                    const [x, y] = d3.pointer(event, svgRef.current); // gets the coordinates relative to the SVG container

                    const isWhite = d.Greek_Term === 'ἀργός' || d.Greek_Term === 'λευκός';
                    const textColor = isWhite ? '#000000' : HOMERIC_COLOURS[d.Greek_Term];

                    tooltipDiv.html(`
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px; color: #000;">
                            <span>${d.Transliteration}</span>

                            <span style="font-family: Georgia, serif; font-weight: regular; font-size: 15px; color: ${textColor};">
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

                    tooltipDiv
                        .style("opacity", 1)
                        .style("left", (x + 30) + "px")
                        .style("top", (y - 10) + "px");
                    
                    d3.select(event.currentTarget)
                        .transition().duration(200)
                        .attr("r", 12)}) // enlarges scatterplot point
                
                .on("mouseout", (event, d) => {
                    tooltipDiv.style("opacity", 0);

                    d3.select(event.currentTarget)
                        .transition().duration(200)
                        .attr("r", 10);
                })

                .call(enter => {
                    if (shouldAnimate) {
                        // First run: Fly in
                        enter.transition(tDots)
                            .attr("cx", d => xScale(d.Unique_gleam_score))
                            .attr("cy", d => yScale(d.Luminosity_Score))
                            .attr("r", 10);
                    } else {
                        // Subsequent runs (Step 3): Appear instantly (Fixed)
                        enter.attr("cx", d => xScale(d.Unique_gleam_score))
                             .attr("cy", d => yScale(d.Luminosity_Score))
                             .attr("r", 10);
                    }
                });

                // END EVENT LISTENERS
                // .call(enter => enter.transition(tDots)
                //     .attr("cx", d => xScale(d.Unique_gleam_score))
                //     .attr("cy", d => yScale(d.Luminosity_Score))
                //     .attr("r", 10)
                // ); 

            // greek labels for scatterplot points
            
            // Delay = Dot Delay (500) + Dot Duration (2000) = 2500ms
            const tLabels = d3.transition()
                .duration(1000) // fade in takes 1 second
                .delay(DOT_DELAY + DOT_DURATION) 
                .ease(d3.easeLinear);

            svg.selectAll(".label")
                .data(data)
                .enter()
                .append("text")
                .attr("class", "label")
                // Apply Manual X Offset
                .attr("x", d => {
                    const offset = LABEL_OFFSETS[d.Greek_Term]?.x || 0;
                    return xScale(d.Unique_gleam_score) + 14 + offset;
                })
                // Apply Manual Y Offset
                .attr("y", d => {
                    const offset = LABEL_OFFSETS[d.Greek_Term]?.y || 0;
                    return yScale(d.Luminosity_Score) + 10 + offset; // Kept your +10 adjustment
                })
                .text(d => d.Greek_Term)
                .style("font-size", "13px")
                .style("font-family", "Georgia, serif")
                .style("fill", "#333")
                .style("opacity", shouldAnimate ? 0 : 1) 
                .call(enter => {
                    if (shouldAnimate) {
                        enter.transition(tLabels).style("opacity", 1);
                    }
                });

            hasAnimated.current = true;
                // .style("opacity", 0) // Initially invisible
                // .transition(tLabels) // Use the delayed tLabels transition
                // .style("opacity", 1); // Fade to visible

        }
    },[activeStep]);

    return (
        <div className="viz-container">
            <svg ref={svgRef}></svg>
            <div ref={tooltipRef} className="html-tooltip"></div>
        </div>
    );
};

export default D3ScatterPlot;