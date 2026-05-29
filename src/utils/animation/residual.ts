import * as d3 from 'd3'
import { gsap } from 'gsap'

export const drawResidualLine = (id?: string) => {
  let residualAnimation: GSAPTween | undefined

  const resolveElements = () => {
    if (!id) {
      return {
        startGroup: document.querySelectorAll('[data-click="residual-start"]'),
        endGroup: document.querySelectorAll('[data-click="residual-end"]'),
        connector: d3.selectAll('.residual-connector'),
      }
    }
    return {
      startGroup: document.querySelectorAll(`#${id}-start`),
      endGroup: document.querySelectorAll(`#${id}-end`),
      connector: d3.selectAll(`.residual-connector.${id}`),
    }
  }

  const drawLine = () => {
    const { startGroup, endGroup, connector } = resolveElements()
    connector.style('opacity', 1)

    residualAnimation = gsap.to(connector.nodes(), {
      strokeDashoffset: -50,
      duration: 1,
      repeat: -1,
      ease: 'none',
    })

    startGroup.forEach((el) => el.classList.add('active'))
    endGroup.forEach((el) => el.classList.add('active'))
  }

  const removeLine = () => {
    const { startGroup, endGroup, connector } = resolveElements()
    connector.style('opacity', 0)

    if (residualAnimation) {
      residualAnimation.kill()
      connector.style('stroke-dashoffset', 0)
    }

    startGroup.forEach((el) => el.classList.remove('active'))
    endGroup.forEach((el) => el.classList.remove('active'))
  }

  return { drawLine, removeLine }
}
