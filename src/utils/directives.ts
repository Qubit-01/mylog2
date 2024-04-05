import type { Directive } from 'vue'

/**
 * 毛玻璃效果
 * @param dom
 * @returns
 */
export const vM: Directive = dom => dom.classList.add('-m')

/**
 * 超出省略号，传入行数，默认一行，0就啥都不干
 * @param el
 * @param param1
 */
export const vOverflowEllipsis: Directive = (el, { value = 1 }) => {
  if (value === 0) {
    // 删除样式
    el.classList.remove('-overflow-ellipsis-s', '-overflow-ellipsis-m')
    el.style.webkitLineClamp = 'revert'
  } else if (value === 1) {
    el.classList.add('-overflow-ellipsis-s')
    el.classList.remove('-overflow-ellipsis-m')
    el.style.webkitLineClamp = 'revert'
  } else {
    el.classList.remove('-overflow-ellipsis-s')
    el.classList.add('-overflow-ellipsis-m')
    el.style.webkitLineClamp = value
  }
}
