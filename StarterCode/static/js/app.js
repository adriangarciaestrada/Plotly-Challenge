function initialSubject() {
    d3.json("samples.json").then((subjects) => { 
        var IDselector = d3.select("#selDataset").selectAll("option")
        .data(subjects.names)
        .enter()
        .append("option")
        .attr("value", (d) => d)
        .text((d) => d);
    });
};

function subjectSelector(){
    d3.json("samples.json").then((subjects)=> {
        var selectedDataset = d3.select("#selDataset").node().value;
        var index = subjects.names.indexOf(selectedDataset);
        infoDisplay(index);
        createBars(index);
        crateGauge(index);
        createBubbles(index);
    });
};

function infoDisplay(index) {
    d3.select("#sample-metadata").selectAll("p").remove();
    d3.json("samples.json").then((subject) => { 
        var initialSubject = Object
            .entries(subject.metadata[index])
            .forEach( (d) => {
                d3.select("#sample-metadata").append("p").text( `${d[0]} :  ${d[1]}`)}     
            ); 
    });
};

function createBars(index) {
    d3.json("samples.json").then((subject) => {         
        var initialBars = [{
            x: subject.samples[index].sample_values.slice(0,10).reverse(),
            y: subject.samples[index].otu_ids.slice(0,10).reverse().map( (x) => `OTU ${x}`),
            text : subject.samples[index].otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h",
            title: "Top ten OTUs found in subject",
            marker: {
                color: "#0066ff",
                opacity: 0.75
            },
        }];
        Plotly.newPlot("bar", initialBars)
    });
};

function crateGauge(index) {
    d3.json("samples.json").then((subject) => {
        var initialGauge = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: subject.metadata[index].wfreq,
            title: { text: "WeeklyBelly Button Washing Frequency" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9] },
                steps: [
                    { range: [0, 1], color: "#ffffff" },
                    { range: [1, 2], color: "#ebfaeb" },
                    { range: [2, 3], color: "#d6f5d6" },
                    { range: [3, 4], color: "#c2f0c2" },
                    { range: [4, 5], color: "#adebad" },
                    { range: [5, 6], color: "#99e699" },
                    { range: [6, 7], color: "#85e085" },
                    { range: [7, 8], color: "#70db70" },
                    { range: [8, 9], color: "#5cd65c" }
                ]
            }
        }];
        Plotly.newPlot("gauge", initialGauge)
    });
};

function createBubbles(index) {
    d3.json("samples.json").then(function(subject) { 
        var initialBubbles = [{
            x: subject.samples[index].otu_ids,
            y: subject.samples[index].sample_values,
            text : subject.samples[index].otu_labels,
            mode: "markers",
            marker: {
                color: subject.samples[index].otu_ids,
                colorscale: [
                    [0, "#0066ff"],
                    [0.25, "#00ccff"],  
                    [0.5, "#009999"], 
                    [0.75, "#00cc66"],
                    [1, "#009933"]
                ],
                size: subject.samples[index].sample_values
                }
            }
        ];
        Plotly.newPlot("bubble", initialBubbles)
    });
};

initialSubject();
subjectSelector();

d3.select("body").on("change", subjectSelector);