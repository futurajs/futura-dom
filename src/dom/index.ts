import { h as h0 } from "snabbdom";
import { VNode, VNodeData } from "snabbdom/vnode";

export { VNode, VNodeData };
export type VNodes = ReadonlyArray<VNode>;
export type VNodeChildElement = VNode | string | number | undefined | null;
export type ArrayOrElement<T> = T | ReadonlyArray<T>;
export type VNodeChildren = ArrayOrElement<VNodeChildElement>;

// tslint:disable:unified-signatures
export function h(sel: string): VNode;
export function h(sel: string, data: VNodeData): VNode;
export function h(sel: string, children: VNodeChildren): VNode;
export function h(sel: string, data: VNodeData, children: VNodeChildren): VNode;
export function h(sel: any, b?: any, c?: any): VNode {
  return h0(sel, b, c);
}
