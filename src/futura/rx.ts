export interface Subscribable<T> {
  subscribe(subscriber: Subscriber<T>): Subscription;
}

export class Signal<T> implements Subscribable<T> {
  private readonly subscribers: Array<Subscriber<T>> = [];
  private readonly events: Array<T> = [];
  private emitting: boolean = false;

  public subscribe(subscriber: Subscriber<T>): Subscription {
    this.subscribers.push(subscriber);

    return new Subscription(() => {
      const index = this.subscribers.indexOf(subscriber);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    });
  }

  public emit(event: T) {
    this.events.push(event);
    if (!this.emitting) {
      this.emitting = true;

      while (this.events.length > 0) {
        const event = this.events.shift();
        this.subscribers.forEach((subscriber) => {
          subscriber(event!);
        });
      }

      this.emitting = false;
    }
  }
}

export class Value<T> extends Signal<T> {
  private _value: T;

  constructor(value: T) {
    super();
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this.emit(newValue);
  }

  public subscribe(subscriber: Subscriber<T>): Subscription {
    subscriber(this.value);
    return super.subscribe(subscriber);
  }
}

export interface Subscriber<T> {
  (value: T): void;
}

export class Subscription {
  private stop?: () => void;

  constructor(stop?: () => void) {
    this.stop = stop;
  }

  public unsubscribe() {
    if (this.stop) {
      this.stop();
      this.stop = undefined;
    }
  }
}
