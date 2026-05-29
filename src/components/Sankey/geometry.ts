export const pathAdjustor = (source: DOMRect, target: DOMRect, curve: number) => {
  const distance = target.left - source.right
  const maxDistance = 100
  const curveOffset = distance > maxDistance ? curve : curve * (distance / maxDistance)

  return { curveOffset }
}

export const defaultPathGenerator = (source: DOMRect, target: DOMRect, curve: number) => {
  const scrollTop = window.scrollY
  const scrollLeft = window.scrollX
  const { curveOffset } = pathAdjustor(source, target, curve)

  return `
    M ${source.right + scrollLeft},${source.top + scrollTop}
    C ${source.right + scrollLeft + curveOffset},${source.top + scrollTop} ${target.left + scrollLeft - curveOffset},${target.top + scrollTop} ${target.left + scrollLeft},${target.top + scrollTop}
    L ${target.left + scrollLeft},${target.bottom + scrollTop}
    C ${target.left + scrollLeft - curveOffset},${target.bottom + scrollTop} ${source.right + scrollLeft + curveOffset},${source.bottom + scrollTop} ${source.right + scrollLeft},${source.bottom + scrollTop}
    Z
  `
}

export const defaultCurveOffset = (screenWidth: number) => {
  const curveFactor = Math.floor(screenWidth / 1000) || 1
  return 40 * (curveFactor - 1) + 80
}
