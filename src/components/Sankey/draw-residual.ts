import * as d3 from 'd3'

type Theme = {
  colors: { gray: { 400: string } }
}

export const drawResidualLines = (svgEl: SVGSVGElement, theme: Theme) => {
  const svg = d3.select(svgEl)

  const starts = d3.selectAll('.residual-start path.head').nodes() as Element[]
  const ends = d3.selectAll('.residual-end path.head').nodes() as Element[]

  const lineData = starts.map((start, i) => {
    const startEl = start?.getBoundingClientRect()
    const endEl = ends[i].getBoundingClientRect()

    const x1 = startEl.right
    const y1 = startEl.top
    const x2 = endEl.left
    const y2 = endEl.top

    return { x1, y1, x2, y2, id: start.id }
  })

  svg
    .selectAll('line.residual-connector')
    .data(lineData)
    .join('line')
    .attr('class', (d) => `residual-connector ${d.id}`)
    .attr('x1', (d) => d.x1)
    .attr('y1', (d) => d.y1)
    .attr('x2', (d) => d.x2)
    .attr('y2', (d) => d.y2)
    .attr('stroke', theme.colors.gray[400])
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '8,4')
    .style('opacity', 0)
}
