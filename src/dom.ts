import { h, init } from 'snabbdom';
import attributes from 'snabbdom/modules/attributes';
import eventlisteners from 'snabbdom/modules/eventlisteners';
import props from 'snabbdom/modules/props';
import style from 'snabbdom/modules/style';
import { VNode } from 'snabbdom/vnode';
import { raf } from './raf';

const patch = init([attributes, eventlisteners, props, style]);

export { h, VNode };
export const when = (cond: boolean, view: () => VNode | null): VNode | null => {
  if (cond) {
    return view();
  } else {
    return null;
  }
}

export class Renderer {
  private vnode0: VNode;
  private vnode1: VNode;
  private refreshScheduled: boolean = false;

  constructor(container: Node, vnode: VNode | null | undefined) {
    this.vnode0 = vnode;
    this.vnode1 = vnode;

    patch(<any>container, vnode);
  }

  render(vnode: VNode | null | undefined) {
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
