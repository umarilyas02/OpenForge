# Canvas source mapping and selection

The compiler injects `data-openforge-*` attributes only into host JSX elements
for development previews. Each mapping includes deterministic node, file,
component, and source-range identifiers. Component calls are left unchanged,
code-only source remains byte-identical, and user-authored reserved attributes
are rejected to prevent mapping spoofing.

The editor canvas model supports hover, selected, focused, parent, component,
slot, and invalid-drop states. Arrow keys traverse parent, child, and sibling
relationships; Enter or Space selects the focused node. Overlay elements use
measured rectangles, `pointer-events: none`, compact labels outside the selected
box, and emit nothing until geometry is available.

Production preview serialization removes all OpenForge attributes structurally
through the secure preview sanitizer.
