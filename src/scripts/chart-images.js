import * as d3 from 'd3'

d3.select('#img-1').classed('is-active', true)

d3.selectAll('.image-stepper .step').on('stepin', function() {
  const imageId = d3.select(this).attr('data-show-selector')
  for (let i = 1; i <= 5; i++) {
    if (parseInt(imageId.charAt(imageId.length - 1)) === i) {
      d3.select(`#img-${i}`).classed('is-active', true)
    } else {
      d3.select(`#img-${i}`).classed('is-active', false)
    }
  }
})
