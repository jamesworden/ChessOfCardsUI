# Animation Overlay, LAN-308

After making optimizations to the code quality and performance of the codebase, I noticed that animated cards would briefly flicker in the top left hand corner of the screen. After hours of investigating, this is what I found:

The Animation Overlay mechanism is recursive; its `updateCurrentSequence` function updates the sequence of which entities ought to be displayed and then inside of a `setTimeout` it calls itself again to render the next series of entities. Because `setTimeout` has a bit of a delay (I believe caused by ZoneJS), there's some time after an entity has animated and before the next series of entities are rendered for animation. During this miniscule gap of time, post-animation entities on the brink of being classified from `in-progress` to `completed` will render at (0, 0).

A visualization might help:

CSS Animation:
||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

`updateCurrentSequence`
**{{{**||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

In representation above, the small delay from `setTimeout`, denoted by **`{{{`**, causes a span of time, just as brief, for the card to render after its animation is complete. A band-aid solution for this fix has been to decrease the delay by an offset to account for the natural delay of `setTimeout`.

### What could we do better?

The problem with this mechanism is that the CSS animation is independent of the Javascript that triggers it. There's no code that's like "Is that done animating yet?". The Javascript actually says, "Go animate, and I'll instruct the next one to animate, and hopefully everything runs smoothly".
