let url= 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
// how we request the jeson file 
let req= new XMLHttpRequest()
// this will store the request as data
let data 
// this will be storing all the arrays more secific data
let values = []

let heightScale

let xScale

let xAxisScale

let yAxisScale

let width = 800

let height= 600
let padding= 40


let svg= d3.select('svg')

let drawCanvas= () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

//setting the scales before information is imported in
let generateScales = () => {
heightScale = d3.scaleLinear()
                .domain([0,d3.max(values, (item) =>{
                    return item[1]
                })])
                .range([0, height - (2*padding)])

    xScale  = d3.scaleLinear()
                .domain([0, values.length-1])          
                .range([padding, width - padding])

    let datesArray = values.map((item) => {
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime()
                    .domain([d3.min(datesArray),d3.max(datesArray)])
                    .range([padding, width-padding])
    yAxisScale = d3.scaleLinear()
    .domain([0,d3.max(values, (item) =>{
        return item[1]
    })])
    .range([height - padding, padding])                
}

let drawBars = () => {

    // create tool tip to make a hover like function 
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id','tooltip')
                    .style('visibility','hidden')
                    .style('width', 'auto')
                    .style('height','auto')

                svg.selectAll('rect')
                .data(values)
                .enter()
                .append('rect')
                .attr('class','bar')
                .attr('width', (width - (2 * padding)) / values.length)
                .attr('data-date', (item) => {
                    return item[0]
                })
                .attr('data-gdp', (item) => {
                    return item[1]
                })
                .attr('height', (item) =>{
                    return heightScale(item[1])
                })
                // making the bars apear with width
                .attr('x',(item, index) => {
                    return xScale(index)
                    })
                    // data so it fits the axis the right way 
                .attr('y',(item) => {
                  return (height- padding) - heightScale(item[1])
                })
                .on('mouseover', (item) => {
                    tooltip.transition()
                    .style('visibility' , 'visible')

                    tooltip.text(item[0])

                    document.querySelector('#tooltip').setAttribute('data-date', item[0])

                })
                .on('mouseout', (item) => {
                    tooltip.transition()
                           .style('visibility', 'hidden')
                })


}
let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis= d3.axisLeft(yAxisScale)
    
    svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (height-padding) +')')

    svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding +',0)')
}

// the arg is method-URL of resource - asincronistaclly usally always true
req.open( 'GET', url, true)
// onload is a referance to a function once the request has been obtained 
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(values)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()