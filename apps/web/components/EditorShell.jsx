"use client";

import {
  ActionList,
  BaseStyles,
  Button,
  IconButton,
  TextInput,
  ThemeProvider,
} from "@primer/react";
import {
  ArchiveIcon,
  ChevronDownIcon,
  CodeIcon,
  CommandPaletteIcon,
  DeviceDesktopIcon,
  DeviceMobileIcon,
  FileCodeIcon,
  GearIcon,
  GitBranchIcon,
  HistoryIcon,
  KebabHorizontalIcon,
  MarkGithubIcon,
  PackageIcon,
  PlayIcon,
  PlusIcon,
  RedoIcon,
  SearchIcon,
  SidebarCollapseIcon,
  SyncIcon,
  UndoIcon,
  XIcon,
} from "@primer/octicons-react";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { id: "pages", label: "Pages", icon: FileCodeIcon },
  { id: "layers", label: "Layers", icon: SidebarCollapseIcon },
  { id: "blocks", label: "Blocks", icon: PackageIcon },
  { id: "assets", label: "Assets", icon: ArchiveIcon },
];

const viewportPresets = [
  { id: "mobile", label: "Mobile", shortLabel: "M", width: 390 },
  { id: "tablet", label: "Tablet", shortLabel: "T", width: 768 },
  { id: "laptop", label: "Laptop", shortLabel: "L", width: 1024 },
  { id: "desktop", label: "Desktop", shortLabel: "D", width: 1440 },
];

const layers = [
  { name: "Home", depth: 0, type: "page" },
  { name: "Navigation", depth: 1, type: "component" },
  { name: "Hero", depth: 1, type: "component", selected: true },
  { name: "Eyebrow", depth: 2, type: "text" },
  { name: "Heading", depth: 2, type: "text" },
  { name: "Description", depth: 2, type: "text" },
  { name: "Actions", depth: 2, type: "slot" },
  { name: "Proof", depth: 1, type: "component" },
  { name: "Footer", depth: 1, type: "component" },
];

export function EditorShell() {
  const [activeNav, setActiveNav] = useState("layers");
  const [bottomPanel, setBottomPanel] = useState("problems");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [viewport, setViewport] = useState("desktop");
  const paletteInput = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
      if (event.key === "Escape") setPaletteOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (paletteOpen) paletteInput.current?.focus();
  }, [paletteOpen]);

  return (
    <ThemeProvider colorMode="dark" nightScheme="dark_dimmed">
      <BaseStyles>
        <main className="editor-shell">
          <TopBar onOpenPalette={() => setPaletteOpen(true)} />
          <div className="editor-body">
            <PrimaryRail active={activeNav} onChange={setActiveNav} />
            <LayerPanel activeNav={activeNav} />
            <Canvas viewport={viewport} onViewportChange={setViewport} />
            <Inspector />
          </div>
          <BottomPanel active={bottomPanel} onChange={setBottomPanel} />
          {paletteOpen && (
            <CommandPalette
              inputRef={paletteInput}
              onClose={() => setPaletteOpen(false)}
            />
          )}
        </main>
      </BaseStyles>
    </ThemeProvider>
  );
}

function TopBar({ onOpenPalette }) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">OF</span>
        <span>OpenForge</span>
      </div>
      <div className="project-path">
        <span className="muted">Projects</span>
        <span>/</span>
        <strong>Northstar launch</strong>
        <ChevronDownIcon size={14} />
      </div>
      <button className="save-state" type="button">
        <SyncIcon size={13} />
        Saved
      </button>
      <div className="topbar-actions">
        <IconButton aria-label="Undo" icon={UndoIcon} size="small" />
        <IconButton aria-label="Redo" icon={RedoIcon} size="small" />
        <Button
          leadingVisual={CommandPaletteIcon}
          onClick={onOpenPalette}
          size="small"
        >
          Commands <kbd>Ctrl K</kbd>
        </Button>
        <Button leadingVisual={PlayIcon} size="small">
          Preview
        </Button>
        <Button className="accent-button" size="small">
          Publish
        </Button>
        <IconButton
          aria-label="More project actions"
          icon={KebabHorizontalIcon}
          size="small"
        />
      </div>
    </header>
  );
}

function PrimaryRail({ active, onChange }) {
  return (
    <nav aria-label="Editor sections" className="primary-rail">
      <div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              aria-current={active === item.id ? "page" : undefined}
              className="rail-button"
              key={item.id}
              onClick={() => onChange(item.id)}
              title={item.label}
              type="button"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
      <div>
        <button className="rail-button" title="Source code" type="button">
          <CodeIcon size={18} />
          <span>Code</span>
        </button>
        <button className="rail-button" title="Project settings" type="button">
          <GearIcon size={18} />
          <span>Settings</span>
        </button>
      </div>
    </nav>
  );
}

function LayerPanel({ activeNav }) {
  return (
    <aside className="layer-panel">
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Structure</span>
          <h1>{capitalize(activeNav)}</h1>
        </div>
        <IconButton
          aria-label={`Add ${activeNav}`}
          icon={PlusIcon}
          size="small"
        />
      </div>
      <TextInput
        aria-label={`Search ${activeNav}`}
        block
        contrast
        leadingVisual={SearchIcon}
        placeholder={`Search ${activeNav}`}
        size="small"
      />
      {activeNav === "assets" ? (
        <AssetPanel />
      ) : (
        <div className="layer-tree" role="tree">
          {layers.map((layer) => (
            <button
              aria-selected={layer.selected || undefined}
              className="layer-row"
              key={layer.name}
              role="treeitem"
              style={{ "--depth": layer.depth }}
              type="button"
            >
              <ChevronDownIcon
                className={layer.depth === 2 ? "layer-leaf" : undefined}
                size={12}
              />
              <LayerIcon type={layer.type} />
              <span>{layer.name}</span>
              {layer.selected && <span className="component-badge">Block</span>}
            </button>
          ))}
        </div>
      )}
      <div className="branch-card">
        <GitBranchIcon size={14} />
        <div>
          <strong>main</strong>
          <span>Working tree clean</span>
        </div>
      </div>
    </aside>
  );
}

function AssetPanel() {
  return (
    <div className="asset-panel">
      <button className="asset-upload" type="button">
        <PlusIcon size={14} />
        Upload validated asset
      </button>
      <div className="asset-card">
        <div className="asset-thumbnail asset-thumbnail-orange" />
        <div>
          <strong>hero-product.webp</strong>
          <span>1280 × 720 · Alt text ready</span>
        </div>
        <span className="asset-usage">2 uses</span>
      </div>
      <div className="asset-card">
        <div className="asset-thumbnail" />
        <div>
          <strong>customer-mark.png</strong>
          <span>640 × 320 · Alt text missing</span>
        </div>
        <span className="asset-warning">Unused</span>
      </div>
      <p className="asset-policy-note">
        PNG, JPEG, or WebP · maximum 10 MB · duplicates detected automatically
      </p>
    </div>
  );
}

function Canvas({ viewport, onViewportChange }) {
  const activeViewport = viewportPresets.find(({ id }) => id === viewport);

  return (
    <section className="canvas-area" aria-label="Responsive canvas">
      <div className="canvas-toolbar">
        <div className="viewport-switcher">
          {viewportPresets.map((preset) => (
            <button
              aria-label={`${preset.label} viewport`}
              aria-pressed={viewport === preset.id}
              key={preset.id}
              onClick={() => onViewportChange(preset.id)}
              title={`${preset.label} · ${preset.width}px`}
              type="button"
            >
              {preset.id === "mobile" ? (
                <DeviceMobileIcon size={14} />
              ) : preset.id === "desktop" ? (
                <DeviceDesktopIcon size={14} />
              ) : (
                preset.shortLabel
              )}
            </button>
          ))}
          <span>{activeViewport.width} px</span>
        </div>
        <div className="canvas-location">
          <span>/</span>
          <strong>Home</strong>
        </div>
        <div className="canvas-health">
          <span>No horizontal overflow</span>
          <span className="zoom">82%</span>
        </div>
      </div>
      <div className={`canvas-stage canvas-stage-${viewport}`}>
        <div className="review-mode-notice" role="status">
          Review mode · editing is available on a wider screen
        </div>
        <article className="site-preview">
          <PreviewNavigation />
          <section className="preview-hero selected-block">
            <span className="selection-label">Hero</span>
            <div className="preview-copy">
              <p className="preview-kicker">
                Infrastructure for ambitious teams
              </p>
              <h2>Build the future without rebuilding your foundation.</h2>
              <p className="preview-description">
                A reliable platform for products that need to move quickly and
                remain understandable.
              </p>
              <div className="preview-actions">
                <button type="button">Start building</button>
                <a href="#proof">See the platform</a>
              </div>
            </div>
            <div
              className="preview-visual"
              aria-label="Product interface sample"
            >
              <div className="visual-window">
                <div className="visual-header">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="visual-content">
                  <div className="visual-sidebar" />
                  <div className="visual-lines">
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="preview-proof" id="proof">
            <span>Vercel</span>
            <span>GitHub</span>
            <span>Linear</span>
            <span>Raycast</span>
          </section>
        </article>
      </div>
    </section>
  );
}

function PreviewNavigation() {
  return (
    <nav className="preview-nav" aria-label="Preview navigation">
      <strong>Northstar</strong>
      <div>
        <a href="#product">Product</a>
        <a href="#company">Company</a>
        <a href="#resources">Resources</a>
      </div>
      <button type="button">Get started</button>
    </nav>
  );
}

function Inspector() {
  return (
    <aside className="inspector">
      <div className="panel-heading inspector-heading">
        <div>
          <span className="panel-kicker">Selected block</span>
          <h2>Hero</h2>
        </div>
        <IconButton
          aria-label="Inspector actions"
          icon={KebabHorizontalIcon}
          size="small"
        />
      </div>
      <InspectorGroup title="Content">
        <label>
          <span className="field-label">
            Eyebrow <ValueSource>Local</ValueSource>
          </span>
          <input defaultValue="Infrastructure for ambitious teams" />
        </label>
        <label>
          <span className="field-label">
            Heading <ValueSource>Local</ValueSource>
          </span>
          <textarea
            defaultValue="Build the future without rebuilding your foundation."
            rows={3}
          />
        </label>
      </InspectorGroup>
      <InspectorGroup title="Layout">
        <div className="source-summary">
          <span>Display</span>
          <ValueSource>Inherited · Hero</ValueSource>
        </div>
        <div className="segmented">
          <button aria-pressed="true" type="button">
            Split
          </button>
          <button type="button">Stack</button>
          <button type="button">Center</button>
        </div>
        <div className="field-grid">
          <label>
            Gap
            <input defaultValue="48" inputMode="numeric" />
          </label>
          <label>
            Width
            <select defaultValue="wide">
              <option value="wide">Wide</option>
              <option value="full">Full</option>
            </select>
          </label>
        </div>
      </InspectorGroup>
      <InspectorGroup title="Spacing">
        <div className="spacing-control">
          <span>
            Section padding
            <small>Semantic token</small>
          </span>
          <code>space.section</code>
        </div>
        <button className="usage-button" type="button">
          Check affected usage before changing
        </button>
      </InspectorGroup>
      <InspectorGroup title="Typography">
        <div className="field-grid">
          <label>
            <span className="field-label">
              Size <ValueSource>Local</ValueSource>
            </span>
            <input defaultValue="56px" />
          </label>
          <label>
            <span className="field-label">
              Weight <ValueSource>Token</ValueSource>
            </span>
            <select defaultValue="strong">
              <option value="strong">font.weight-strong</option>
            </select>
          </label>
        </div>
      </InspectorGroup>
      <InspectorGroup title="Background & border">
        <div className="field-grid">
          <label>
            Background
            <input aria-label="Background color" defaultValue="#f5f6f8" />
          </label>
          <label>
            Radius
            <select defaultValue="none">
              <option value="none">0</option>
              <option value="card">radius.card</option>
            </select>
          </label>
        </div>
        <div className="breakpoint-source">
          <DeviceDesktopIcon size={13} />
          Base value · no desktop override
        </div>
      </InspectorGroup>
      <InspectorGroup title="Visibility">
        <label className="toggle-row">
          <span>Show media</span>
          <input defaultChecked type="checkbox" />
        </label>
      </InspectorGroup>
    </aside>
  );
}

function ValueSource({ children }) {
  return <span className="value-source">{children}</span>;
}

function InspectorGroup({ children, title }) {
  return (
    <section className="inspector-group">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function BottomPanel({ active, onChange }) {
  const tabs = [
    ["problems", "Problems", "2"],
    ["logs", "Logs", null],
    ["diff", "Diff", "1"],
    ["activity", "Activity", null],
  ];
  return (
    <section className="bottom-panel">
      <div className="bottom-tabs">
        {tabs.map(([id, label, count]) => (
          <button
            aria-selected={active === id}
            key={id}
            onClick={() => onChange(id)}
            role="tab"
            type="button"
          >
            {label}
            {count && <span>{count}</span>}
          </button>
        ))}
      </div>
      <div className="problem-summary">
        <strong>2 issues</strong>
        <span>Hero.jsx:18</span>
        <p>Heading hierarchy skips from h1 to h3</p>
        <span className="warning">Accessibility</span>
      </div>
      <div className="status-strip">
        <span>
          <MarkGithubIcon size={13} /> main
        </span>
        <span>
          <HistoryIcon size={13} /> Revision 42
        </span>
        <span>JavaScript</span>
        <span>Next.js 16</span>
      </div>
    </section>
  );
}

function CommandPalette({ inputRef, onClose }) {
  return (
    <div className="palette-backdrop" onMouseDown={onClose} role="presentation">
      <section
        aria-label="Command palette"
        aria-modal="true"
        className="command-palette"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="palette-search">
          <SearchIcon size={18} />
          <input
            aria-label="Search commands"
            placeholder="Type a command or search blocks"
            ref={inputRef}
          />
          <button
            aria-label="Close command palette"
            onClick={onClose}
            type="button"
          >
            <XIcon size={16} />
          </button>
        </div>
        <ActionList>
          <ActionList.Group title="Suggested">
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <PlusIcon />
              </ActionList.LeadingVisual>
              Insert block
              <ActionList.TrailingVisual>Enter</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <CodeIcon />
              </ActionList.LeadingVisual>
              Open code workspace
              <ActionList.TrailingVisual>Ctrl E</ActionList.TrailingVisual>
            </ActionList.Item>
            <ActionList.Item>
              <ActionList.LeadingVisual>
                <PlayIcon />
              </ActionList.LeadingVisual>
              Start preview
            </ActionList.Item>
          </ActionList.Group>
        </ActionList>
      </section>
    </div>
  );
}

function LayerIcon({ type }) {
  if (type === "page") return <FileCodeIcon size={13} />;
  if (type === "text") return <span className="text-icon">T</span>;
  if (type === "slot") return <PlusIcon size={13} />;
  return <PackageIcon size={13} />;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
