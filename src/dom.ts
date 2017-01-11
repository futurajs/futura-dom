declare function require(name:string): any;


const init = require('snabbdom').init;
import { raf } from './raf';

const patch = init([
  require('snabbdom/modules/attributes'),
  require('snabbdom/modules/eventlisteners'),
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style')
]);

export type VNode = any;
export const h = require('snabbdom/h');
export const when = (cond: boolean, view: () => VNode) =>
  cond ? view() : '';

export class Renderer {
  private vnode0: VNode;
  private vnode1: VNode;
  private refreshScheduled: boolean = false;

  constructor(container: Node, vnode: VNode) {
    this.vnode0 = vnode;
    this.vnode1 = vnode;

    patch(<any>container, vnode);
  }

  render(vnode: VNode) {
    this.vnode1 = vnode;
    if (!this.refreshScheduled) {
        this.refreshScheduled = true;
        raf(this.refresh);
    }
  }

  private refresh = () => {
    this.refreshScheduled = false;
    this.vnode0 = patch(this.vnode0, this.vnode1);
  }
}
