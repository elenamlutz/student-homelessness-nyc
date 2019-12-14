import * as d3 from 'd3'

// Make the first image appear
d3.select('#img-1').classed('is-active', true)

// Each time you hit a step, check what imageId you are on.
// Make that one opacity 1, and make other images opacity 0, by adding the class 'is-active.'
d3.selectAll('.image-stepper .step').on('stepin', function() {
  const imageId = d3.select(this).attr('data-show-selector')
  // console.log('stepped in', imageId)

  // This is the JS way of looping through something. In pandas, it'll look something like:

  // for i in NumberOfImages:
  // if i < length(NumberOfImages) - 1:
  // add the class '.is-active' to the image that you're currently scrolling on
  // else:
  // remove '.is-active' class from other images to make them opacity 0

  // MAKE SURE YU CHANGE i <=6 to match the number of images you have. If you have 4 images/steps, this should be i <= 4
  for (let i = 1; i <= 2; i++) {
    if (parseInt(imageId.charAt(imageId.length - 1)) === i) {
      d3.select(`#img-${i}`).classed('is-active', true)
    } else {
      // console.log('change opacity to 0 of ', imageId)
      d3.select(`#img-${i}`).classed('is-active', false)
    }
  }
})
