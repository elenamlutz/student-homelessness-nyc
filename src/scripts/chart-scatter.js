import * as d3 from 'd3'
import * as debounce from 'debounce'

const margin = { top: 80, left: 100, right: 100, bottom: 80 }

const width = 600 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom

// You'll probably need to edit this one
const svg = d3
  .select('#chart-scatter')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Here are some scales for you
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 1.0])
  .range([0, width])

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 0.6])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range(['#b3e2cd', '#fdcdac', '#cbd5e8', '#f4cae4', '#e6f5c9', '#fff2ae'])

d3.csv(require('../data/schoolsdata2019.csv')).then(ready)

function ready(datapoints) {
  console.log('Data is....', datapoints)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 7)
    .attr('cx', d => xPositionScale(d.white))
    .attr('cy', d => yPositionScale(d.homeless))
    .attr('fill', '#F8977C')
    .attr('opacity', 0.4)

  // svg
  //   .append('text')
  //   .attr('class', 'title')
  //   .attr('x', -30)
  //   .attr('y', -65)
  //   .text('Homelessness and Race')
  // svg
  //   .append('text')
  //   .attr('class', 'subtitle')
  //   .attr('x', -30)
  //   .attr('y', -40)
  //   .text(
  //     'Hispanic and Black students experience homelessness at higher rates.'
  //   )
  // .classed('country-circle', true)
  // .on('mouseover', function(d) {
  //   console.log('ok')
  //   d3.select(this).attr('stroke', 'black')
  // })
  // .on('mouseout', function(d) {
  //   console.log('ok2')
  //   d3.select(this).attr('stroke', 'none')
  // })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickPadding(10)
    .ticks(7)
    .tickSize(5)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  // d3.select('.y-axis .domain').remove()

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickPadding(10)
    .ticks(7)
    .tickSize(5)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  /* 

  SCROLLYTELLING

  */
  d3.select('#title-step').on('stepin', function() {
    svg
      .selectAll('circle')
      .attr('cx', d => xPositionScale(d.white))
      .attr('cy', d => yPositionScale(d.homeless))
      .attr('fill', '#F8977C')
  })
  d3.select('#white-step').on('stepin', function() {
    svg
      .selectAll('circle')
      .each(function() {
        d3.selectAll('.circle')
          .transition()
          .style('opacity', 0)
          .remove()
      })
      .attr('cx', d => xPositionScale(d.white))
      .attr('cy', d => yPositionScale(d.homeless))
      .attr('fill', '#F8977C')
  })

  d3.select('#asian-step').on('stepin', function() {
    svg
      .selectAll('circle')
      .transition()
      .attr('cx', d => xPositionScale(d.asian))
      .attr('cy', d => yPositionScale(d.homeless))
      .attr('fill', '#F8977C')
  })

  d3.select('#nonwhite-step').on('stepin', function() {
    svg
      .selectAll('circle')
      .transition()
      .attr('cx', d => xPositionScale(d.non_white))
      .attr('cy', d => yPositionScale(d.homeless))
      .attr('fill', '#F8977C')
  })

  d3.select('#school-step').on('stepin', () => {
    svg
      .selectAll('circle')
      .transition()
      .attr('opacity', d => {
        if (d.school_name == 'Crotona International High School') {
          return 0.8
        } else {
          return 0.4
        }
      })
      .attr('fill', d => {
        if (d.school_name == 'Crotona International High School') {
          return '#F8977C'
        } else {
          return 'white'
        }
      })
      .attr('r', d => {
        if (d.school_name == 'Crotona International High School') {
          return 15
        } else {
          return 6
        }
      })
  })

  // d3.select('#top-step').on('stepin', () => {
  //   svg
  //     .selectAll('circle')
  //     .transition()
  //     .attr('fill', d => {
  //       if (d.district == '6') {
  //         return '#F8977C'
  //       } else if (d.district == '9') {
  //         return '#F8977C'
  //       } else if (d.district == '12') {
  //         return '#F8977C'
  //       } else if (d.district == '7') {
  //         return '#F8977C'
  //       } else if (d.district == '23') {
  //         return '#F8977C'
  //       } else if (d.district == '8') {
  //         return '#F8977C'
  //       } else if (d.district == '32') {
  //         return '#F8977C'
  //       } else if (d.district == '11') {
  //         return '#F8977C'
  //       } else if (d.district == '16') {
  //         return '#F8977C'
  //       } else if (d.district == '19') {
  //         return '#F8977C'
  //       } else {
  //         return 'white'
  //       }
  //     })
  //     .transition()
  //     .attr('r', d => {
  //       if (d.district == '6') {
  //         return 10
  //       } else if (d.district == '9') {
  //         return 10
  //       } else if (d.district == '12') {
  //         return 10
  //       } else if (d.district == '7') {
  //         return 10
  //       } else if (d.district == '23') {
  //         return 10
  //       } else if (d.district == '8') {
  //         return 10
  //       } else if (d.district == '32') {
  //         return 10
  //       } else if (d.district == '11') {
  //         return 10
  //       } else if (d.district == '16') {
  //         return 10
  //       } else if (d.district == '19') {
  //         return 10
  //       } else {
  //         return 6
  //       }
  //     })
  // })
}
