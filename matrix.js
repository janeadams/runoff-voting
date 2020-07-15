let margin = {top: 50, right: 50, bottom: 100, left: 10};

function Matrix(options) {
    let width = 250,
        height = 250,
        data = options.data,
        labelsData = options.labels,
        startColor = options.start_color,
        endColor = options.end_color;

    let widthLegend = 100;

    let maxValue = d3.max(data, function(layer) { return d3.max(layer, function(d) { return d; }); });
    let minValue = d3.min(data, function(layer) { return d3.min(layer, function(d) { return d; }); });

    let numrows = data.length;
    let numcols = data[0].length;

    d3.select('#container').html('')
    let svg = d3.select('#container').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let background = svg.append("rect")
        .style("stroke", "black")
        .style("stroke-width", "2px")
        .attr("width", width)
        .attr("height", height);

    let xScale = d3.scaleBand()
        .domain(d3.range(numcols))
        .range([0, width]);

    let yScale = d3.scaleBand()
        .domain(d3.range(numrows))
        .range([0, height]);

    let colorMap = d3.scaleLinear()
        .domain([minValue,maxValue])
        .range([startColor, endColor]);

    let row = svg.selectAll(".row")
        .data(data)
        .enter().append("g")
        .attr("class", "row")
        .attr("transform", function(d, i) { return "translate(0," + yScale(i) + ")"; });

    let cell = row.selectAll(".cell")
        .data(function(d) { return d; })
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d, i) { return "translate(" + xScale(i) + ", 0)"; });

    cell.append('rect')
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .style("stroke-width", 0);

    cell.append("text")
        .attr("dy", ".32em")
        .attr("x", xScale.bandwidth() / 2)
        .attr("y", yScale.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .style("fill", function(d, i) { return d >= maxValue/2 ? 'white' : 'black'; })
        .text(function(d, i) { return d; });

    row.selectAll(".cell")
        .data(function(d, i) { return data[i]; })
        .style("fill", colorMap);

    let labels = svg.append('g')
        .attr('class', "labels");

    let columnLabels = labels.selectAll(".column-label")
        .data(labelsData[0])
        .enter().append("g")
        .attr("class", "column-label")
        .attr("transform", function(d, i) { return "translate(" + xScale(i) + "," + height + ")"; });

    columnLabels.append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", xScale.bandwidth() / 2)
        .attr("x2", xScale.bandwidth() / 2)
        .attr("y1", 0)
        .attr("y2", 5);

    columnLabels.append("text")
        .attr("x", 30)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dy", ".22em")
        .attr("text-anchor", "end")
        .text(function(d, i) { return d; });

    let rowLabels = labels.selectAll(".row-label")
        .data(labelsData[1])
        .enter().append("g")
        .attr("class", "row-label")
        .attr("transform", function(d, i) { return "translate(" + 0 + "," + yScale(i) + ")"; });

    rowLabels.append("line")
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .attr("x1", 0)
        .attr("x2", -5)
        .attr("y1", yScale.bandwidth() / 2)
        .attr("y2", yScale.bandwidth() / 2);

    rowLabels.append("text")
        .attr("x", -8)
        .attr("y", yScale.bandwidth() / 2)
        .attr("dy", ".32em")
        .attr("text-anchor", "end")
        .text(function(d, i) { return d; });

    d3.select("#legend").html('')
    let key = d3.select("#legend")
        .append("svg")
        .attr("width", widthLegend)
        .attr("height", height + margin.top + margin.bottom);

    let legend = key
        .append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    legend
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", endColor)
        .attr("stop-opacity", 1);

    legend
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", startColor)
        .attr("stop-opacity", 1);

    key.append("rect")
        .attr("width", widthLegend/2-10)
        .attr("height", height)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0," + margin.top + ")");

    let y = d3.scaleLinear()
        .range([height, 0])
        .domain([minValue, maxValue]);

    key.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(41," + margin.top + ")")
        .call(d3.axisLeft(y))

}

// The table generation function
function tabulate(data, columns) {
    d3.select("#summary-stats").html('')
    let table = d3.select("#summary-stats").append("table")
            .attr("style", "margin-left: " + margin.left +"px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
        .text(function(column) { return column; });

    // create a row for each object in the data
    let rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    let cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .html(function(d) { return d.value; });

    return table;
}