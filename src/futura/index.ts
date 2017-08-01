import { Signal, Value } from './rx';

export const program = <State, Event>(options: Options<State, Event>) =>
  new Program(options);

// Helpers

export class Program<State, Event> {
  private readonly state$: Value<State>;
  private readonly event$: Signal<Event>;
  private readonly services: Services<Event>;

  constructor(options: Options<State, Event>) {
    const { init, update, subscriptions = emptySubscriptions } = options;
    const { state, commands = [] } = init();

    this.state$ = new Value(state);
    this.event$ = new Signal<Event>();
    this.services = new Services(this.update);

    this.event$.subscribe((event) => {
      const { state, commands = [] } = update(this.state$.value, event);

      this.state$.value = state;
      this.services.handleCommands(commands);
      this.services.updateSubscriptions(subscriptions(state));
    });
    this.services.handleCommands(commands);
    this.services.updateSubscriptions(subscriptions(state));
  }

  protected update = (event: Event) => {
    this.event$.emit(event);
  }

  protected observe = (observer: (state: State) => void) => {
    this.state$.subscribe(observer);
  }
}

class Services<Event> {
  private readonly services: Array<{ type: ServiceClass<Event>, instance: Service }>;
  private readonly notify: Notify<Event>;

  constructor(notify: Notify<Event>) {
    this.services = [];
    this.notify = notify;
  }

  public handleCommands(commands: ReadonlyArray<Command<Event>>) {
    commands.forEach((command) => {
      const service = this.service(command.service);
      service.handleCommand(command.desc);
    });
  }

  public updateSubscriptions(subscriptions: ReadonlyArray<Subscription<Event>>) {
    // Ensure all services are setup
    subscriptions.forEach((subscription) => {
      this.service(subscription.service);
    });
    // For each service update their subscriptions
    this.services.forEach((service) => {
      const serviceSubscriptions = subscriptions.filter((subscription) =>
        subscription.service === service.type);
      
        service.instance.updateSubscriptions(serviceSubscriptions);
    });
  }

  private service(Type: ServiceClass<Event>): Service {
    for (let i = 0; i < this.services.length; i++) {
      const service = this.services[i];
      if (service.type === Type) {
        return service.instance;
      }
    }
    const service = new Type(this.notify);
    this.services.push({ type: Type, instance: service });
    return service;
  }
}

const emptySubscriptions = <State>(_: State) => [];

// Types

//// Options

export interface Options<State, Event> {
  readonly init: Init<State, Event>;
  readonly update: Update<State, Event>;
  readonly subscriptions?: (state: State) => ReadonlyArray<Subscription<Event>>;
}

export type Init<State, Event> = () => UpdateResult<State, Event>;
export type Update<State, Event> = (state: State, event: Event) => UpdateResult<State, Event>;
export type Notify<Event> = (event: Event) => void;

export interface UpdateResult<State, Event> {
  readonly state: State;
  readonly commands?: ReadonlyArray<Command<Event>>;
}

//// Service

export interface Service {
  handleCommand(command: any): void;
  updateSubscriptions(subscriptions: ReadonlyArray<any>): void;
}

export interface ServiceClass<Event> {
  new(notify: Notify<Event>): Service
}

export interface Command<Event> {
  service: ServiceClass<Event>;
  desc: any;
  // map<OtherEvent>(func: (event: Event) => OtherEvent): Subscription<OtherEvent>;
}

export interface Subscription<Event> {
  service: ServiceClass<Event>;
  desc: any;
  // map<OtherEvent>(func: (event: Event) => OtherEvent): Subscription<OtherEvent>;
}
