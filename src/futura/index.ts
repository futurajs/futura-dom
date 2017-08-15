import { Signal, Value } from './rx';

export const program = <State, Message>(options: Options<State, Message>) =>
  new Program(options);

// Helpers

export class Program<State, Message> {
  private readonly state$: Value<State>;
  private readonly message$: Signal<Message>;

  private init: boolean;
  private initMessages: Array<Message>;

  constructor(options: Options<State, Message>) {
    const { init, update } = options;

    this.init = true;
    this.initMessages = [];

    this.message$ = new Signal<Message>();
    this.message$.subscribe((message) => {
      this.state$.value = update(this.state$.value, message);
    });

    this.state$ = new Value(init(this.update));

    // Init done
    this.init = false;
    this.initMessages.forEach((message) => this.message$.emit(message));
    this.initMessages = [];
  }

  protected update = (message: Message) => {
    if (this.init) {
      this.initMessages.push(message);
    } else {
      this.message$.emit(message);
    }
  }

  protected observe = (observer: (state: State) => void) => {
    this.state$.subscribe(observer);
  }
}

// Types

export interface Options<State, Message> {
  readonly init: Init<State, Message>;
  readonly update: Update<State, Message>;
}

export type Init<State, Message> = (dispatch: Dispatch<Message>) => State;
export type Update<State, Message> = (state: State, message: Message) => State;
export type Dispatch<Message> = (message: Message) => void;
