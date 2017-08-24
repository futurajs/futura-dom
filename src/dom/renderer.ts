import { elementToVNode, init } from 'mostly-dom';
import { ElementVNode } from 'mostly-dom';

import { VNode } from './types';

export class Renderer {
  private vnode0: ElementVNode;
  private vnode1: VNode | null;
  private refreshScheduled: boolean = false;

  constructor(container: Element, vnode: VNode | null = null) {
    this.vnode0 = elementToVNode(container);
    this.vnode1 = vnode;

    this.refresh();
  }

  public render(vnode: VNode) {
    this.vnode1 = vnode;
    if (!this.refreshScheduled) {
        this.refreshScheduled = true;
        window.requestAnimationFrame(this.refresh);
    }
  }

  private refresh = () => {
    this.refreshScheduled = false;
    if (this.vnode1) {
      this.vnode0 = patch(this.vnode0, this.vnode1);
      this.vnode1 = null;
    }
  }
}

// Internals

const patch = init();
