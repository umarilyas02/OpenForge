import { createCmsBlock } from "../block.js";

function Video({ videoUrl, caption }) {
  return (
    <figure className="of-block of-video">
      <div className="of-video-frame">
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          src={videoUrl}
          title={caption || "Embedded video"}
        />
      </div>
      {caption ? (
        <figcaption className="of-video-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export const videoBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.video",
    version: 1,
    name: "Video",
    description: "An embedded video (YouTube, Vimeo, or any embeddable URL).",
    tags: ["media", "video"],
    defaultProps: {},
    editableFields: [
      { path: "videoUrl", label: "Embed URL", control: "url", required: true },
      { path: "caption", label: "Caption", control: "text", required: false },
    ],
    slots: [],
    accessibility: [
      "The iframe has a title; provide a caption for additional context.",
    ],
    migrations: [],
  },
  component: Video,
});
