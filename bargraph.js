const drawBarGraph = (data) => {

  /*******************************/
  /*    Declare the constants    */
  /*******************************/
  const margin = {top: 40, right: 30, bottom: 50, left: 40};
  const width = 1000;
  const height = 500;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


  /*******************************/
  /*    Append the containers    */
  /*******************************/
  // Append the SVG container
  const svg = d3.select("#bargraph")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);


  const xScale = d3.scaleBand()
                  .domain(data.map(d=>d.colours))
                  .range([0, innerWidth])
                  .padding(0.2);

  const yScale = d3.scaleLinear()
                  .domain([0, 50])
                  .range([innerHeight, 0]);

  const xAxis = d3.axisBottom(xScale);

  const colourScale = d3.scaleOrdinal()
                      .domain(colours_blue.map(c=>c.id))
                      .range(colours_blue.map(c=> c.colour));

  innerChart
    .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
    .call(xAxis);


  innerChart
    .selectAll("colour-bars")
    .data(data)
    .join("rect")
      .attr("class", "colour-bars")
    .attr("x", d=> xScale(d.colours))
    .attr("y", d=> yScale(d.number_of_times))
    .attr("width", xScale.bandwidth())
    .attr("height", d=> -yScale(d.number_of_times) + innerHeight)
    .attr("fill", d=> colourScale(d.colours));


  const yAxis = d3.axisLeft(yScale);

  innerChart
    .append("g")
    .call(yAxis);

  svg
    .append("text")
    .text("Number of times mentioned in the book")
    .attr("x", 0)
    .attr("y", 15)
    .attr("font-family", "sans-serif");

  svg
    .append("text")
    .text("Colours a to g")
    .attr("x", width/2)
    .attr("y", height-10)
    .attr("font-family", "sans-serif")
    .attr("font-size", 22);

    
};