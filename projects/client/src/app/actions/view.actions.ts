import { View } from '../views';

export class UpdateView {
  static readonly type = '[ViewState] Update View';
  constructor(public view: View) {}
}
