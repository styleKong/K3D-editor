/**
 * 选择文件
 * @param fn
 * @returns
 */
export const selectFile = function (fn: (this: GlobalEventHandlers, ev: Event) => void) {
  const input = document.createElement('input')
  input.type = 'file'
  input.onchange = fn
  return function () {
    input.click()
  }
}
