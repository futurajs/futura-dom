import { Automaton, HasTransitions } from 'futura';
import { Renderer, VNode } from './dom';


export class App<State extends HasTransitions<State, Events, Services>, Events, Services> {
  private readonly automaton: Automaton<State, Events, Services>;
  private readonly notify: Notify<Events>;
  private readonly view: View<State, Events>;

  constructor(stateInit: StateInit<State, Services>, servicesInit: ServicesInit<Events, Services>, view: View<State, Events>) {
    this.notify = (event: Events) => this.automaton.handleEvent(event);
    const services = servicesInit(this.notify);
    const state = stateInit(services);
    this.automaton = new Automaton(state, services);
    this.view = view;
  }

  embed(root: Element) {
    const node = root.appendChild(document.createElement('div'));
    const renderer = new Renderer(node, this.view(this.automaton.state, this.notify));
    this.automaton.subscribe(state => renderer.render(this.view(state, this.notify)));
  }
}

export interface Notify<Events> {
  (event: Events): void;
}

export interface View<State, Events> {
  (state: State, notify: Notify<Events>): VNode;
}

export interface StateInit<State, Services> {
  (services: Services): State;
}

export interface ServicesInit<Events, Services> {
  (notify: Notify<Events>): Services
}
