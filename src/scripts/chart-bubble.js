import * as d3 from 'd3'
import * as debounce from 'debounce'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 80, left: 100, right: 100, bottom: 80 }

const width = 650 - margin.left - margin.right
const height = 650 - margin.top - margin.bottom

// You'll probably need to edit this one
const svg = d3
  .select('#chart-bubble')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Here are some scales for you
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 0.8])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([700, 1500])
  .range([height, 0])

const radiusScale = d3
  .scaleSqrt()
  .domain([0, 100])
  .range([0, 35])

const colorScale = d3
  .scaleOrdinal()
  .range(['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae'])

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return (
      '<b>' +
      d.school_name +
      '</b>' +
      '<br>' +
      "<b>Average SAT Score:</b> <span style='color:black'>" +
      d.sat_score +
      '<br>' +
      "<b>Homeless:</b> <span style='color:black'>" +
      d.pct_homeless +
      '%' +
      '</span>'
    )
  })
svg.call(tip)

d3.csv(require('../data/schoolsdata2019.csv')).then(ready)

function ready(datapoints) {
  console.log('Data is....', datapoints)

  svg
    .selectAll('.bubble')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('r', 5)
    .attr('cx', d => xPositionScale(d.homeless))
    .attr('cy', d => yPositionScale(d.sat_score))
    .attr('fill', '#ADE5CA')
    .attr('opacity', 0.8)
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)
    .raise()

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickPadding(10)
    .ticks(5)
    .tickSize(7)
    .tickValues([700, 900, 1100, 1300, 1500])

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg
    .selectAll('.y-axis line')
    .attr('x1', width)
    .attr('stroke-dasharray', '3 5')
    .attr('opacity', 0.25)
    .raise()

  svg.selectAll('.y-axis path').remove()

  svg
    .append('rect')
    .attr('class', 'rect_thing')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', height)
    .attr('width', width)
    .attr('fill', '#161616')
    .lower()
  svg
    .append('line')
    .attr('class', 'average-line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', function(d) {
      return yPositionScale(950)
    })
    .attr('y2', function(d) {
      return yPositionScale(950)
    })
    .attr('stroke', '#A91622')
    .attr('stroke-width', 2)
    .lower()

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickPadding(10)
    // .tickFormat(d3.format('.0%'))
    .ticks(5)
    .tickSize(5)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .raise()

  svg
    .append('svg:defs')
    .append('svg:marker')
    .attr('id', 'triangle')
    .attr('refX', 6)
    .attr('refY', 6)
    .attr('markerWidth', 30)
    .attr('markerHeight', 30)
    .attr('markerUnits', 'userSpaceOnUse')
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 12 6 0 12 3 6')
    .style('fill', 'white')

  // line
  svg
    .append('line')
    .attr('x1', 310)
    .attr('y1', 555)
    .attr('x2', 380)
    .attr('y2', 555)

    .attr('stroke-width', 1)
    .attr('stroke', 'white')
    .attr('marker-end', 'url(#triangle)')

  svg
    .append('text')
    .attr('x', 400)
    .attr('y', 560)
    .text('% Homeless')
    .attr('fill', 'white')

  svg
    .append('line')
    .attr('x1', -90)
    .attr('y1', 190)
    .attr('x2', -90)
    .attr('y2', 120)

    .attr('stroke-width', 1)
    .attr('stroke', 'white')
    .attr('marker-end', 'url(#triangle)')

  svg
    .append('text')
    .attr('x', -80)
    .attr('y', -85)
    .text('Higher Scores')
    .attr('transform', function(d) {
      return 'rotate(-90)'
    })
    .attr('fill', 'white')

  // SCROLLYTELLING

  d3.select('#nothing-step').on('stepin', () => {
    svg
      .select('.rect_thing')
      .transition()
      .duration(4000)
      .attr('x', width)
  })

  d3.select('#top-step').on('stepin', () => {
    svg
      .selectAll('.bubble')
      .transition()
      .attr('opacity', d => {
        if (d.non_white < 0.5) {
          return 0.1
        } else {
          return 0.8
        }
      })
  })
  d3.select('#top-step').on('stepout', () => {
    svg
      .selectAll('.bubble')
      .transition()
      .attr('opacity', 0.8)
  })

  d3.select('#average-step').on('stepin', () => {
    svg
      .select('.rect_thing')
      .transition()
      .duration(1000)
      .attr('x', width)
  })
  d3.select('#final-step').on('stepin', () => {
    svg
      .selectAll('.bubble')
      .transition()
      .attr('opacity', d => {
        if (d.non_white > 0.5) {
          return 0.1
        } else {
          return 0.8
        }
      })
  })

  //   } else if (d.district == '9') {
  //     return '#F8977C'
  //   } else if (d.district == '12') {
  //     return '#F8977C'
  //   } else if (d.district == '7') {
  //     return '#F8977C'
  //   } else if (d.district == '23') {
  //     return '#F8977C'
  //   } else if (d.district == '8') {
  //     return '#F8977C'
  //   } else if (d.district == '32') {
  //     return '#F8977C'
  //   } else if (d.district == '11') {
  //     return '#F8977C'
  //   } else if (d.district == '16') {
  //     return '#F8977C'
  //   } else if (d.district == '19') {
  //     return '#F8977C'
  //   } else {
  //     return 'white'
  //   }
  // })
  // .transition()
  // .attr('r', d => {
  //   if (d.district == '6') {
  //     return 10
  //   } else if (d.district == '9') {
  //     return 10
  //   } else if (d.district == '12') {
  //     return 10
  //   } else if (d.district == '7') {
  //     return 10
  //   } else if (d.district == '23') {
  //     return 10
  //   } else if (d.district == '8') {
  //     return 10
  //   } else if (d.district == '32') {
  //     return 10
  //   } else if (d.district == '11') {
  //     return 10
  //   } else if (d.district == '16') {
  //     return 10
  //   } else if (d.district == '19') {
  //     return 10
  //   } else {
  //     return 6
  //   }
}
