import { Renderer } from './dom/renderer';
import { VNode } from './dom/types';
import { Notify, Options, Program } from './futura';

export const program = <State, Event>(options: Options<State, Event>) =>
  new DomProgram(options);

// Helpers

export class DomProgram<State, Event> extends Program<State, Event> {
  public embed(root: Element, view: View<State, Event>) {
    const container = root.appendChild(document.createElement('div'));
    const renderer = new Renderer(container);

    this.observe((state: State) => {
      renderer.render(view(state, this.update));
    });
  }
}

// Types

export { Init, Update, Notify } from './futura';

export type View<State, Event> = (state: State, notify: Notify<Event>) => VNode;
