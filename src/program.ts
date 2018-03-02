import { Dispatch, Program } from "futura";

import { Renderer } from "./dom/renderer";
import { VNode } from "./dom/types";


export const program = <State, Message>(options: Program.Options<State, Message>) =>
  new DOMProgram(options);

export class DOMProgram<State, Message> extends Program<State, Message> {
  public embed(container: Element, view: View<State, Message>) {
    const renderer = new Renderer(container);

    this.observe((state: State) => {
      renderer.render(() => view(state, this.update));
    });
  }
}


/** Types */

export type View<State, Message> = (state: State, dispatch: Dispatch<Message>) => VNode;
