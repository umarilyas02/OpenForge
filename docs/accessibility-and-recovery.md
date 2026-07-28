# Accessibility and recovery

The editor exposes keyboard commands for command search, undo/redo, dismissal,
activation, and canvas tree navigation. Modal command search traps focus while
open and returns focus to its trigger when dismissed. Saved, recovery, and safe
mode state use atomic live-status announcements. Visible `:focus-visible`
treatment and reduced-motion CSS are part of the shell baseline.

The accessibility model normalizes axe findings into stable OpenForge
diagnostics without retaining unbounded markup. Official block source also
passes deterministic rules for notes, hero heading semantics, image alt
attributes, native interactive elements, and tab order. The independent
ten-block Next.js production fixture runs axe-core against its prerendered page
using the WCAG 2 A/AA, 2.1 AA, and 2.2 AA rule tags.

Recovery actions are revision-aware and mutually exclusive:

- restore a known snapshot;
- discard one operation through the provided operation boundary;
- reset the workspace from authoritative source;
- enter safe mode.

Callbacks must return a newer revision and complete file set before state is
replaced. Failure leaves current files and revision intact and announces the
failure. Safe mode disables third-party extensions while retaining explicitly
enabled official extensions. Leaving safe mode never silently re-enables a
third-party extension.
