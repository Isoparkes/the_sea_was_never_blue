
// Load data
d3.csv("./data/data.csv", d3.autoType).then(data => {
  console.log("data", data);

  drawBarGraph(data);

});

d3.csv("./data/blue_words.csv", d3.autoType).then(data => 
{console.log(data);

  drawScattergraph(data);
}
);