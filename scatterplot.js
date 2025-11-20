const drawScattergraph = (data) => {

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
  const svg = d3.select("#scattergraph")
    .append("svg")
      .attr("viewBox", `0, 0, ${width}, ${height}`);

  // Append the group that will contain the inner chart
  const innerChart = svg
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale = d3.scaleLinear()
                .domain([-10,10])
                .range([0, innerWidth]);

const yScale = d3.scaleLinear()
                .domain([-10,10])
                .range([0, innerHeight]);

const sizeScale = d3.scaleLinear()
                .domain([0,10])
                .range([3,5]);

const yAxis = d3.axisLeft(yScale);

const xAxis = d3.axisBottom(xScale)


innerChart
.append("g")
    .attr("class", "y-axis")
.attr("transform", `translate(${innerWidth/2}, 0)`)
.call(yAxis);


innerChart
.append("g")
    .attr("class", "x-axis")
.attr("transform", `translate(0,${innerHeight/2})`)
.call(xAxis);


innerChart
    .selectAll("circle")
    .data(data)
    .join("circle")
        .attr("cx", d=> xScale(d.texture))
        .attr("cy", d=> yScale(d.brightness))
        .attr("r", d=> sizeScale(d.size))
        .attr("fill", "blue");


svg
    .append("text")
    .text("Darkness")
    .attr("x", width/2)
    .attr("y", height)
    .attr("font-size", 14);        

}