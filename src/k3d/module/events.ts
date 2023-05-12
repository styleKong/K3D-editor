import * as _ from './utils';
export default class Events {
  handle: { [k: string]: any } = {};
  constructor() {}
  /**
   * 绑定事件
   * @param type 事件类型
   * @param fn 事件方法
   */
  on(type: string, fn: Function) {
    if (!_.hasOwnProperty.call(this.handle, type)) this.handle[type] = [];
    // 将事件推入事件处理数组中
    this.handle[type].push(fn);
  }
  /**
   * 触发事件处理
   * @param event 事件对象
   */
  emit(event: { [k: string]: any } | string) {
    let type, target;
    if (typeof event == 'string') type = event;
    else {
      type = event.type;
      target = event.target;
    }
    if (!type) throw '请指定事件类型';
    if (_.hasOwnProperty.call(this.handle, type) && this.handle[type] instanceof Array) {
      for (let index = 0; index < this.handle[type].length; index++) {
        // 执行事件处理
        if (typeof this.handle[type][index] == 'function') this.handle[type][index](target || this);
      }
    }
  }
  /**
   * 解绑事件
   * @param type 事件类型
   * @param fn   事件方法
   */
  off(type: string, fn: Function) {
    if (_.hasOwnProperty.call(this.handle, type)) {
      // 过滤掉这个事件方法
      this.handle[type] = this.handle[type].filter((item) => item !== fn);
    }
  }
  /**
   * 清楚事件
   * @param type 事件类型
   */
  clear(type: string) {
    if (_.hasOwnProperty.call(this.handle, type)) delete this.handle[type];
  }
}
