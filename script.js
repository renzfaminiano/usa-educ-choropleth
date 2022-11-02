let educUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
let countyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

let width = window.innerWidth/1.5
let height = window.innerHeight/1.25

let svg = d3.select('svg')

let colors = ['#FF8788','#F8C4B6','#E5EBB3','#BCE28E']

let countyData
let educData

let drawCanvas = () => {

    svg.attr("width", width)
    svg.attr("height", height)
    
}

let drawMap = () => {

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id','tooltip')
                    .style('position','absolute')
                    .style('visibility','hidden')     

    svg.selectAll('path')
       .data(countyData)
       .enter()
       .append('path')
       .attr('d',d3.geoPath())
       .attr('class','county')
       .attr('fill', (d)=>{
            
            let percentage = educData.find((x)=>{
                return x['fips'] === d['id']
            })['bachelorsOrHigher']
            if (percentage <= 15){
                return colors[0]
            } else if(percentage <= 30){
                return colors[1]
            } else if(percentage <= 45){
                return colors[2]
            } else{
                return colors[3]
            } 
       })
       .attr('data-fips',(d)=>{return d['id']})
       .attr('data-education',(d)=>{
            let educ = educData.find((x)=>{
                return x['fips'] === d['id']
            })
            return educ['bachelorsOrHigher']
       })
       
       .on('mouseover', (event,d)=>{
            
            let county = educData.find((x)=>{
                return x['fips'] === d['id']
            })
            
            tooltip.transition()
                .style('visibility','visible')
                .style('left',(event.clientX+15)+'px')
                .style('top',(event.clientY-15)+'px')
                .attr('data-education',county['bachelorsOrHigher'])
                
            tooltip.text(county['state']+' '+county['area_name']+' '+county['bachelorsOrHigher']+'%')
            
        })
        .on('mouseout', ()=>{
            tooltip.transition()
                .style('visibility','hidden')
        })
    
}

let drawLegend = () => {

    let xScale = d3.scaleLinear()
                    .domain([0,60])
                    .range(['400',400 + 100*4])      

    let xAxis = d3.axisBottom(xScale)
        
    d3.select('#legend').append('g')
       .call(xAxis)
       .attr('id','x-axis')
       .attr('transform','translate(15,15)')
       
    svg.selectAll('rect')
        .data(colors)
        .enter()
        .append('rect')
        .attr('width','100px')
        .attr('height','10px')
        .attr('x',(d,i)=>{return 415 + i*100})
        .attr('y','5')
        .attr('fill',(d)=>{return d})   
}

d3.json(countyUrl).then(
    (data,error) => {
        if (error){
            console.log(log)
        } else {
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educUrl).then(
                (data,error) => {
                    if (error){
                        console.log(error)
                    } else {
                        educData = data
                        console.log(educData)
                        drawCanvas()
                        drawMap()
                        drawLegend()
                    }
                }
            )
        }
    }
)




