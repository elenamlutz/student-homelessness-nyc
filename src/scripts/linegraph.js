import * as d3 from 'd3'
import * as debounce from 'debounce'
import d3Tip from 'd3-tip'
d3.tip = d3Tip

const margin = { top: 80, left: 100, right: 190, bottom: 80 }
const height = 600 - margin.top - margin.bottom
const width = 600 - margin.left - margin.right

const svg = d3
  .select('#chart-01')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3.scaleLinear().range([0, width])

const yPositionScale = d3.scaleLinear().range([height, 0])

const tip = d3
  .tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return '<b>' + d.sum_students + '</span>'
  })
svg.call(tip)

const line = d3
  .line()
  .x(d => xPositionScale(d.year))
  .y(d => yPositionScale(d.sum_students))

d3.csv(require('../data/linegraph.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const minYear = d3.min(datapoints, function(d) {
    return +d.year
  })
  console.log(minYear)

  const maxYear = d3.max(datapoints, function(d) {
    return +d.year
  })
  console.log(maxYear)

  xPositionScale.domain([minYear, maxYear])

  const minValue = d3.min(datapoints, function(d) {
    return +d.sum_students
  })
  console.log(minValue)

  const maxValue = d3.max(datapoints, function(d) {
    return +d.sum_students
  })
  console.log(maxValue)

  yPositionScale.domain([0, 30000])

  const nested = d3
    .nest()
    .key(d => d.county)
    .entries(datapoints)
  console.log(nested)

  svg
    .selectAll('path')
    .data(nested)
    .enter()
    .append('path')
    .attr('class', 'students')
    .attr('fill', 'none')
    .style('stroke-width', 2)
    .attr('stroke', '#F8977C')
    .attr('d', function(d) {
      console.log('This nested thing is', d)
      return line(d.values)
    })

  svg
    .selectAll('text')
    .data(nested)
    .enter()
    .append('text')
    .attr('class', 'student-text')
    .text(d => d.key)

    .style('font-size', 12)
    .attr('fill', '#F8977C')
    .attr('x', width)
    .attr('y', function(d) {
      const datapoints1 = d.values
      const thisyearData = datapoints1.find(d => +d.year === 2019)
      console.log('Latest school year is', thisyearData)
      return yPositionScale(thisyearData.sum_students)
    })
    .attr('font-size', 12)
    .attr('dx', 8)
    .attr('dy', 0)
    .attr('alignment-baseline', 'middle')

  svg
    .selectAll('.student-circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('class', 'student-circle')
    .attr('r', 3)
    .attr('fill', '#F8977C')
    .attr('cx', function(d) {
      return xPositionScale(d.year)
    })
    .attr('cy', function(d) {
      return yPositionScale(d.sum_students)
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

  const curtain = svg
    .append('rect')
    .attr('x', -1.8 * width)
    .attr('y', -1 * height)
    .attr('height', height)
    .attr('width', 850)
    .attr('class', 'curtain')
    .attr('transform', 'rotate(180)')
    .style('fill', '#161616')

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickPadding(10)
    .ticks(7)
    .tickSize(5)
    .tickFormat(d3.format('d'))

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickPadding(10)
    .tickValues([0, 5000, 10000, 15000, 20000, 25000, 30000])
    .tickSize(7)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg
    .selectAll('.y-axis line')
    .attr('x1', width)
    .attr('stroke-dasharray', '3 5')
    .attr('opacity', 0.25)

  svg.selectAll('.y-axis path').remove()

  // SCROLLYTELLING

  d3.select('#nothing').on('stepin', function() {
    curtain
      .transition()
      .duration(4000)
      // .ease('linear')
      .attr('x', -2 * 700)
  })

  d3.select('#city-step').on('stepin', function() {
    svg.selectAll('.students').attr('stroke', function(d) {
      console.log(d)
      if (d.key === 'NEW YORK CITY') {
        return '#F8977C'
      } else {
        return '#cccccc'
      }
    })

    svg.selectAll('.student-text').attr('fill', function(d) {
      if (d.key === 'NEW YORK CITY') {
        return '#F8977C'
      } else {
        return '#cccccc'
      }
    })

    svg.selectAll('.student-circle').attr('fill', function(d) {
      if (d.county === 'NEW YORK CITY') {
        return '#F8977C'
      } else {
        return '#cccccc'
      }
    })
  })

  function render() {
    const svgContainer = svg.node().closest('div')
    const svgWidth = svgContainer.offsetWidth
    const svgHeight = height + margin.top + margin.bottom
    // const svgHeight = window.innerHeight

    const actualSvg = d3.select(svg.node().closest('svg'))
    actualSvg.attr('width', svgWidth).attr('height', svgHeight)
    const newWidth = svgWidth - margin.left - margin.right
    const newHeight = svgHeight - margin.top - margin.bottom

    xPositionScale.range([0, newWidth])
    if (svgWidth < 600) {
      xAxis.ticks(2)
    }
    if (svgWidth < 600) {
      xAxis.tickValues([2012, 2019])
    } else {
      xAxis.ticks(8)
    }

    yPositionScale.range([newHeight, 0])

    svg
      .selectAll('.student-circle')
      .attr('cx', function(d) {
        return xPositionScale(d.year)
      })
      .attr('cy', function(d) {
        return yPositionScale(d.sum_students)
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    svg.selectAll('.students').attr('d', function(d) {
      return line(d.values)
    })

    svg
      .selectAll('.student-text')
      .attr('x', newWidth)
      .attr('y', function(d) {
        const datapoints1 = d.values
        const thisyearData = datapoints1.find(d => +d.year === 2019)
        console.log('Latest school year is', thisyearData)
        return yPositionScale(thisyearData.sum_students)
      })

    svg.selectAll('.y-axis line').attr('x1', newWidth)

    svg
      .append('rect')
      .attr('x', -1.8 * newWidth)
      .attr('y', -1 * height)
      .attr('height', height)
      .attr('width', 850)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180)')
      .style('fill', '#33333300')

    svg.select('.x-axis').call(xAxis)
  }

  window.addEventListener('resize', render)

  render()
}
