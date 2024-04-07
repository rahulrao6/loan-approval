// Define data
const data = d3.csv("df_sample_small2.csv");

let width = 800;
let height = 600;
let margin = { top: 50, bottom: 70, left: 70, right: 200 };

let svg = d3.select('#plot')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

data.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.GrAppv = +d.GrAppv;
        d.ChgOffPrinGr = +d.ChgOffPrinGr;
    });

    // Create color scale for industry
    let industries = [...new Set(data.map(d => d.Industry))];
    let colorScale = d3.scaleOrdinal()
        .domain(industries)
        .range(d3.schemeCategory10);

    // Create x scale and axis
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.GrAppv)])
        .range([0, width]);
    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end');

    // Create y scale and axis
    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.ChgOffPrinGr)])
        .range([height, 0]);
    svg.append('g')
        .call(d3.axisLeft(yScale));

    // Draw scatterplot points
    svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.GrAppv))
        .attr('cy', d => yScale(d.ChgOffPrinGr))
        .attr('r', 5)
        .style('fill', d => colorScale(d.Industry));

    // Add labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 10)
        .attr('text-anchor', 'middle')
        .text('Approval Amount');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 15)
        .attr('text-anchor', 'middle')
        .text('Defaulted Amount');

    // Add legend
    let legend = svg.selectAll('.legend')
        .data(industries)
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', (d, i) => `translate(${width + 20}, ${i * 20})`);

    legend.append('rect')
        .attr('x', 0)
        .attr('width', 18)
        .attr('height', 18)
        .style('fill', d => colorScale(d));

    legend.append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '.35em')
        .text(d => d);
});