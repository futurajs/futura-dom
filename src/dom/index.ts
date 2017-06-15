import { elementToVNode, init } from 'mostly-dom';
import { ElementVNode, VNode as VirtualNode, VNodeEvents, VNodeProps } from 'mostly-dom';

import { raf } from './raf';

// API

export {
  a, abbr, acronym, address, applet, area, article, aside, audio, b, base,
  basefont, bdi, bdo, bgsound, big, blink, blockquote, body, br, button,
  canvas, caption, center, cite, code, col, colgroup, command, content,
  data, datalist, dd, del, details, dfn, dialog, dir, div, dl, dt, element,
  em, embed, fieldset, figcaption, figure, font, form, footer, frame, frameset,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html, i, iframe, img,
  input, ins, isindex, kbd, keygen, label, legend, li, link, listing, main,
  map, mark, marquee, math, menu, menuitem, meta, meter, multicol, nav, nextid,
  nobr, noembed, noframes, noscript, object, ol, optgroup, option, output, p,
  param, picture, plaintext, pre, progress, q, rb, rbc, rp, rt, rtc, ruby, s,
  samp, script, section, select, shadow, small, source, spacer, span, strike,
  strong, style, sub, summary, sup, slot, table, tbody, td, template, textarea,
  tfoot, th, time, title, tr, track, tt, u, ul, video, wbr, xmp
} from 'mostly-dom';

export { h } from 'mostly-dom';

export const when = (predicate: boolean, view: () => VNode | null) =>
  predicate ? view() : null;

export class Renderer {
  private vnode0: ElementVNode;
  private vnode1: VNode | null;
  private refreshScheduled: boolean = false;

  constructor(container: Element, vnode: VNode) {
    this.vnode0 = elementToVNode(container);
    this.vnode1 = vnode;

    this.refresh();
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
    if (this.vnode1) {
      this.vnode0 = patch(this.vnode0, this.vnode1);
      this.vnode1 = null;
    }
  }
}

// Types

export type VNode = VirtualNode<Element, VNodeProps<Element, VNodeEvents<Element, ElementEventMap>>>;

// Internals

const patch = init([]);