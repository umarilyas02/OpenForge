import { createCmsBlock } from "../block.js";

function TeamMember({ name, role, bio, photo }) {
  return (
    <div className="of-block of-team-member">
      {photo ? (
        <img alt="" className="of-team-member-photo" src={photo} />
      ) : null}
      <h3 className="of-team-member-name">{name}</h3>
      {role ? <p className="of-team-member-role">{role}</p> : null}
      {bio ? <p className="of-team-member-bio">{bio}</p> : null}
    </div>
  );
}

export const teamMemberBlock = createCmsBlock({
  definition: {
    schemaVersion: 1,
    id: "openforge-cms.team-member",
    version: 1,
    name: "Team Member",
    description: "A person's photo, name, role, and short bio.",
    tags: ["team", "content"],
    defaultProps: {},
    editableFields: [
      { path: "name", label: "Name", control: "text", required: true },
      { path: "role", label: "Role", control: "text", required: false },
      { path: "bio", label: "Bio", control: "textarea", required: false },
      { path: "photo", label: "Photo", control: "image", required: false },
    ],
    slots: [],
    accessibility: ["Photo is decorative; the name carries the meaning."],
    migrations: [],
  },
  component: TeamMember,
});
