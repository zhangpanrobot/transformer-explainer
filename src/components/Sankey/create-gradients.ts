import * as d3 from 'd3'
import { gradientMap } from '~/constants/gradient'

export const createGradients = (svgEl: SVGSVGElement) => {
  const svg = d3.select(svgEl)
  const defs = svg.append('defs')
  Object.keys(gradientMap).forEach((key) => {
    const stops = gradientMap[key as keyof typeof gradientMap]
    type StopType = keyof typeof stops
    const grad = defs
      .append('linearGradient')
      .attr('id', key)
      .attr('class', key)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%')

    const gradClone = defs
      .append('linearGradient')
      .attr('id', `${key}-last`)
      .attr('class', key)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%')

    Object.keys(stops).forEach((stop: StopType) => {
      let color: string
      let opacity: number
      if (typeof stops[stop] !== 'string') {
        color = stops[stop].color
        opacity = stops[stop].opacity
      } else {
        color = stops[stop]
        opacity = 1
      }

      grad
        .append('stop')
        .attr('offset', `${stop}%`)
        .attr('stop-color', color)
        .attr('stop-opacity', opacity)

      gradClone
        .append('stop')
        .attr('offset', `${stop}%`)
        .attr('stop-color', color)
        .attr('stop-opacity', opacity)
    })
  })
}
