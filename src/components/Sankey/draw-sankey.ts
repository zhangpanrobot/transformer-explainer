import * as d3 from 'd3'
import { defaultPathGenerator } from './geometry'
import type { PathMap } from './types'

export const drawSankey = ({
  svgEl,
  svgBackEl,
  pathMap,
  backPathMap,
  defaultCurveOffset,
}: {
  svgEl: SVGSVGElement
  svgBackEl: SVGSVGElement
  pathMap: PathMap
  backPathMap: PathMap
  defaultCurveOffset: number
}) => {
  const svg = d3.select(svgEl)
  const svgBack = d3.select(svgBackEl)

  ;[
    { dataMap: pathMap, svg },
    { dataMap: backPathMap, svg: svgBack },
  ].forEach(({ dataMap, svg }) => {
    const g = svg
      .selectAll('g.path-group')
      .data(Object.keys(dataMap))
      .join('g')
      .attr('class', (d) => `path-group ${d}`)

    g.selectAll('path.sankey-path')
      .data((d: string) => {
        const data = dataMap[d as keyof typeof dataMap].map((item) => {
          const { from, to, curve, pathGenerator, gradientId, unique, ...rest } = item
          const sources = d3.selectAll(from).nodes() as Element[]
          const targets = d3.selectAll(to).nodes() as Element[]

          return sources.map((src, i) => {
            const source = src?.getBoundingClientRect()
            const target = targets[i]?.getBoundingClientRect()

            const curveOffset = curve || defaultCurveOffset

            const generator = pathGenerator || defaultPathGenerator
            const path = source && target ? generator(source, target, curveOffset) : ''

            const isLast = targets.length > 1 && i === sources.length - 1
            let gradUrl = gradientId

            if (isLast && !unique && document.getElementById(`${gradientId}-last`)) {
              gradUrl = `${gradientId}-last`
            }

            return {
              isLast: i === sources.length - 1,
              path,
              fill:
                item.type === 'stroke' ? 'none' : item.gradientId ? `url(#${gradUrl})` : item.fill,
              opacity: item.opacity,
              stroke:
                item.type === 'stroke'
                  ? item.gradientId
                    ? `url(#${item.gradientId})`
                    : item.fill
                  : 'none',
              clickable: !!item.onMouseClick,
              ...rest,
            }
          })
        })

        return data.flat()
      })
      .join('path')
      .attr('class', (d) => `sankey-path ${d.id || ''} ${d.isLast ? 'last' : ''}`)
      .attr('fill', (d) => d.fill || 'none')
      .attr('stroke', (d) => d.stroke || 'none')
      .attr('stroke-width', 2)
      .attr('opacity', (d) => d.opacity || 0)
      .attr('cursor', (d) => d.clickable && 'pointer')
      .attr('d', (d) => d.path)
      .on('mouseenter', (_, d) => d.onMouseOver?.())
      .on('mouseleave', (_, d) => d.onMouseOut?.())
      .on('click', (e, d) => d.onMouseClick?.(e))
  })
}
