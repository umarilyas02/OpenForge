import { EmptyIllustration } from "../../../../../../src/components/EmptyIllustration.jsx";

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
        <EmptyIllustration variant="puzzle" />
        <p className="empty-state-title">No extensions installed</p>
        <p className="empty-state-body">
          The Extension API is coming soon — this is where third-party and
          first-party add-ons will live.
        </p>
      </div>
    </div>
  );
}
