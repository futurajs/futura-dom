import { VNode as VirtualNode, VNodeEvents, VNodeProps } from 'mostly-dom';

export type VNode = VirtualNode<Element, VNodeProps<Element, VNodeEvents<Element, ElementEventMap>>>;
