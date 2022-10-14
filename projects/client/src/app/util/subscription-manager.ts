import { Subscription } from 'rxjs';

export class SubscriptionManager {
  private subscriptions: Subscription[] = [];

  public add(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  public unsubscribe() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }

    this.subscriptions = [];
  }
}
