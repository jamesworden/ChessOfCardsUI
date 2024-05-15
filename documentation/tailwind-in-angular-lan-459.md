# Tailwind in Angular, LAN-459

This problem with LAN-459, `Moves made sometimes have no bg-color when going to other tab and back`, was that the `[ngClass]` that conditionally applied styles seemed to have no issues with it, but it's styles were clearly not being applied correctly in certain cases. Clicking off of the moves tab and back onto it in desktop mode would alter the initail presentation of the move notation rows.

This bug was happening with this usage of `[ngStyle]`:

```typescript
[ngClass]="{
  'bg-slate-200 hover:bg-slate-300 dark:bg-sky-900 dark:hover:bg-sky-800':
    moveNotation.isSelected && moveNotation.playedByPlayer,
  'bg-rose-100 hover:bg-rose-200 dark:bg-rose-900 dark:hover:bg-rose-800':
    moveNotation.isSelected && !moveNotation.playedByPlayer,
  'bg-gray-50 hover:bg-slate-200 dark:bg-gray-700 dark:hover:bg-slate-500':
    !moveNotation.isSelected && moveNotation.playedByPlayer,
  'bg-gray-50 hover:bg-rose-100 dark:bg-gray-700 dark:hover:bg-slate-500':
    !moveNotation.isSelected && !moveNotation.playedByPlayer
}"
```

... and was solved with this usage:

```typescript
[ngClass]="{
  'bg-gray-50 dark:bg-gray-700 dark:hover:bg-slate-500':
    !moveNotation.isSelected,
  'bg-slate-200 hover:bg-slate-300 dark:bg-sky-900 dark:hover:bg-sky-800':
    moveNotation.isSelected && moveNotation.playedByPlayer,
  'bg-rose-100 hover:bg-rose-200 dark:bg-rose-900 dark:hover:bg-rose-800':
    moveNotation.isSelected && !moveNotation.playedByPlayer,
  'hover:bg-slate-200':
    !moveNotation.isSelected && moveNotation.playedByPlayer,
  'hover:bg-rose-100':
    !moveNotation.isSelected && !moveNotation.playedByPlayer
}"
```

If you can spot the difference, it's that _using the same tailwind class in several properties causes issues_. Specifically, moving `'bg-gray-50 dark:bg-gray-700 dark:hover:bg-slate-500'` out of the third and fourth property of the first code block into it's own one on the first property of the second code block solved the issue.
