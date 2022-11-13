import { Tutorial } from '../views/tutorial-view';

export class StartTutorial {
  static readonly type = '[TutorialState] Start Tutorial';
  constructor(public tutorial: Tutorial) {}
}

export class EndTutorial {
  static readonly type = '[TutorialState] End Tutorial';
  constructor() {}
}
