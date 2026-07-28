# Responsive editing

OpenForge uses four named preview and editing presets:

| Preset  |   Width |
| ------- | ------: |
| Mobile  |  390 px |
| Tablet  |  768 px |
| Laptop  | 1024 px |
| Desktop | 1440 px |

Responsive values remain source-derived. The editor model stores an explicit
override per node, property, and breakpoint, resolves the nearest lower active
override, identifies whether that value is inherited, and removes a reset
override instead of writing a duplicate base value.

Measured preview nodes produce stable diagnostics for horizontal viewport
overflow, clipped/scrolling content, and fixed widths larger than the active
viewport. Diagnostics identify the source-mapped node so the inspector and
canvas can focus the exact target.

OpenForge remains a desktop-first editor. Below 1180 px the inspector collapses;
below 900 px the shell enters a read-only review mode that prioritizes the
responsive canvas and hides editing panels. This is a review surface, not a
claim of full mobile editing.
