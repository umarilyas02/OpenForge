"use client";

import { useState } from "react";

const ROLES = ["owner", "admin", "member"];

/**
 * @param {{ members: object[], canManage: boolean, currentUserId: string, changeMemberRole: Function, removeMember: Function }} props
 */
export function TeamMemberList({
  members,
  canManage,
  currentUserId,
  changeMemberRole,
  removeMember,
}) {
  const [rows, setRows] = useState(members);
  const [pendingId, setPendingId] = useState(null);

  async function handleRoleChange(userId, role) {
    setPendingId(userId);
    await changeMemberRole(userId, role);
    setRows((current) =>
      current.map((member) =>
        member.userId === userId ? { ...member, role } : member,
      ),
    );
    setPendingId(null);
  }

  async function handleRemove(userId) {
    setPendingId(userId);
    await removeMember(userId);
    setRows((current) => current.filter((member) => member.userId !== userId));
    setPendingId(null);
  }

  return (
    <div className="card">
      {rows.map((member) => {
        const editable = canManage && member.userId !== currentUserId;

        return (
          <div className="list-row" key={member.userId}>
            <div>
              <div className="list-row-title">
                {member.displayName || member.email}
              </div>
              <div className="list-row-meta">{member.email}</div>
            </div>
            <div style={{ alignItems: "center", display: "flex", gap: 8 }}>
              {editable ? (
                <select
                  disabled={pendingId === member.userId}
                  onChange={(event) =>
                    handleRoleChange(member.userId, event.target.value)
                  }
                  value={member.role}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="badge badge-draft">{member.role}</span>
              )}
              {editable ? (
                <button
                  aria-label={`Remove ${member.email}`}
                  className="icon-btn-sm"
                  data-danger="true"
                  disabled={pendingId === member.userId}
                  onClick={() => handleRemove(member.userId)}
                  type="button"
                >
                  <svg fill="none" height="12" viewBox="0 0 16 16" width="12">
                    <path
                      d="M3 4h10M6.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.3"
                    />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
