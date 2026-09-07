export default function ExtensionsPage() {
  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Extensions</p>
          <h1 className="page-title">Installed Extensions</h1>
          <p className="page-subtitle">
            Add integrations like search, forms, or analytics through the
            OpenForge Extension API.
          </p>
        </div>
      </div>

      <div className="empty-state">
        <span className="empty-state-icon" aria-hidden="true">
          <svg fill="none" height="20" viewBox="0 0 16 16" width="20">
            <path d="M6 2.5h4v2.3a1.2 1.2 0 0 0 1.2 1.2H13.5v4h-2.3a1.2 1.2 0 0 0-1.2 1.2v2.3h-4v-2.3a1.2 1.2 0 0 0-1.2-1.2H2.5v-4h2.3A1.2 1.2 0 0 0 6 4.8V2.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
          </svg>
        </span>
        <p className="empty-state-title">No extensions installed</p>
        <p className="empty-state-body">
          The Extension API is coming soon — this is where third-party and
          first-party add-ons will live.
        </p>
      </div>
    </div>
  );
}
