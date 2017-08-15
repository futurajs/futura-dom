import { Renderer } from './dom/renderer';
import { VNode } from './dom/types';
import { Dispatch, Options, Program as BaseProgram } from './futura';

export const program = <State, Message>(options: Options<State, Message>) =>
  new Program(options);

// Helpers

export class Program<State, Message> extends BaseProgram<State, Message> {
  public embed(root: Element, view: View<State, Message>) {
    const container = root.appendChild(document.createElement('div'));
    const renderer = new Renderer(container);

    this.observe((state: State) => {
      renderer.render(view(state, this.update));
    });
  }
}

// Types

export type View<State, Message> = (state: State, dispatch: Dispatch<Message>) => VNode;

export { Init, Dispatch, Update } from './futura';
