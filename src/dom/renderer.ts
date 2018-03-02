import { init } from "snabbdom";
import { VNode } from "snabbdom/vnode";

import attributes from "snabbdom/modules/attributes";
import eventListeners from "snabbdom/modules/eventlisteners";
import props from "snabbdom/modules/props";
import style from "snabbdom/modules/style";


export class Renderer {
  private node: Element | VNode;
  private view?: View;

  constructor(container: Element) {
    this.node = document.createElement("div");
    container.appendChild(this.node);
  }

  public render(view: View) {
    if (!this.view) {
      window.requestAnimationFrame(this.refresh);
    }
    this.view = view;
  }

  private refresh = () => {
    if (this.view) {
      this.node = patch(this.node, this.view());
      this.view = undefined;
    }
  }
}


/** Types */

export type View = () => VNode;


/** Internals */

const patch = init([
  attributes,
  eventListeners,
  props,
  style,
]);
