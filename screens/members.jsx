// Artboard 6: Project members — per-project roster view, accessed from the
// sidebar's "Project members" item. Shows active members, pending invites,
// role definitions, and per-member contribution sparklines wired to activity.

function MembersArtboard() {
  const members = [
    { id: "maria", name: "Maria Reyes",  email: "maria@neural-motion.com", role: "owner",  added: "Mar 12", lastActive: "12 min ago", contribs: [2, 4, 3, 6, 8, 5, 7], you: true,  initials: "MR", accent: "b" },
    { id: "ben",   name: "Ben Okafor",   email: "ben@neural-motion.com",   role: "editor", added: "Apr 02", lastActive: "32 min ago", contribs: [0, 1, 3, 2, 4, 6, 5], initials: "BO", accent: "a" },
    { id: "lin",   name: "Lin Hayashi",  email: "lin@neural-motion.com",   role: "editor", added: "Apr 18", lastActive: "yesterday",   contribs: [3, 2, 4, 1, 0, 2, 3], initials: "LH", accent: "a" },
    { id: "amir",  name: "Amir Tahan",   email: "amir@neural-motion.com",  role: "viewer", added: "May 04", lastActive: "3 days ago",  contribs: [0, 0, 1, 0, 0, 1, 0], initials: "AT", accent: "b" },
    { id: "sara",  name: "Sara Penninger", email: "sara@neural-motion.com",role: "viewer", added: "May 18", lastActive: "this week",   contribs: [0, 0, 0, 0, 0, 0, 0], initials: "SP", accent: "b" },
  ];

  const invites = [
    { email: "kai@neural-motion.com",      role: "editor", sentBy: "maria", sent: "2 days ago", expires: "in 12 days" },
    { email: "noor@external-collab.org",   role: "viewer", sentBy: "ben",   sent: "5 days ago", expires: "in 9 days", external: true },
  ];

  const tabs = [
    { id: "wbcd",    name: "WBCD 2026",          accent: "a" },
    { id: "pickplc", name: "Pickplace v2 prep",  accent: "b" },
    { id: "manip",   name: "Manipulation Bench", accent: "a" },
  ];
  const recent = [{ slug: "kitchen-mar", name: "Kitchen benchmark · march", lastSeen: "4d ago", accent: "a" }];

  const owners  = members.filter(m => m.role === "owner").length;
  const editors = members.filter(m => m.role === "editor").length;
  const viewers = members.filter(m => m.role === "viewer").length;

  return (
    <div className="nm" data-screen-label="06 Project members">
      <TabStrip tabs={tabs} activeId="wbcd" recent={recent} />
      <div style={{ display: "flex", height: "calc(100% - 38px)" }}>
        <Sidebar active="members" project="WBCD 2026" role="owner" />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Topbar crumbs={["WBCD 2026", "Project members"]} env="dev" />

          <main style={{
            flex: 1, overflow: "auto", padding: "18px 24px 32px",
            display: "grid", gridTemplateColumns: "minmax(0, 1fr) 280px",
            gap: 18, alignContent: "start",
          }}>
            {/* LEFT column */}
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Hero / stats */}
              <Panel padding={0} style={{ overflow: "hidden" }}>
                <div style={{
                  padding: "16px 20px 14px",
                  background: "linear-gradient(135deg, var(--nm-accent-b-tint) 0%, transparent 55%)",
                  display: "flex", alignItems: "flex-end", gap: 12,
                }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Chip accent="b" style={{ marginBottom: 6 }}>{members.length} members · {invites.length} pending</Chip>
                    <h1 className="font-display" style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
                      Project members
                    </h1>
                    <p style={{ margin: "4px 0 0", color: "var(--nm-text-dim)", fontSize: 13, lineHeight: 1.5, maxWidth: 580 }}>
                      Everyone with access to <b>WBCD 2026</b>. Roles are scoped to this project — invites you send don't grant access to other workspaces.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6, flex: "none" }}>
                    <Btn variant="solid" icon={<Icon.upload size={13} />}>Import roster</Btn>
                    <Btn variant="primary" icon={<Icon.plus size={13} />}>Invite to project</Btn>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--nm-border)" }}>
                  {[
                    ["Members",  members.length, "b"],
                    ["Owners",   owners, "a"],
                    ["Editors",  editors, "b"],
                    ["Viewers",  viewers, "a"],
                  ].map(([k, v, a], i) => (
                    <div key={k} style={{ padding: "12px 18px", borderLeft: i ? "1px solid var(--nm-border)" : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className={`nm-dot nm-dot--${a}`} />
                        <span className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".1em" }}>{k}</span>
                      </div>
                      <div className="font-display" style={{ fontSize: 22, fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Filters / search */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div className="nm-input" style={{ flex: 1, padding: "7px 12px", borderRadius: 10 }}>
                  <Icon.search size={14} />
                  <input placeholder="Search by name, email" defaultValue="" />
                  <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>{members.length} match</span>
                </div>
                <div style={{ display: "flex", gap: 2, border: "1px solid var(--nm-border)", borderRadius: 8, padding: 2, background: "var(--nm-panel-mono)" }}>
                  {["All", "Owners", "Editors", "Viewers"].map((l, i) => (
                    <button key={l} className="font-mono" style={{
                      padding: "3px 9px", fontSize: 10.5, fontWeight: 600, borderRadius: 5, border: 0,
                      background: i === 0 ? "var(--nm-accent-b)" : "transparent",
                      color: i === 0 ? "#fff8ec" : "var(--nm-text-faint)",
                      cursor: "pointer",
                    }}>{l}</button>
                  ))}
                </div>
                <Btn size="sm" variant="solid" icon={<Icon.filter size={12} />}>Active 30d</Btn>
              </div>

              {/* Active members */}
              <Panel padding={0} style={{ overflow: "hidden" }}>
                <div style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--nm-border)",
                  background: "var(--nm-panel-strong)",
                  display: "flex", alignItems: "baseline", gap: 8,
                }}>
                  <SectionHead eyebrow="Active · with project access today" title="Members" />
                  <span style={{ flex: 1 }} />
                  <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>
                    sort: <span style={{ color: "var(--nm-text)" }}>last active ↓</span>
                  </span>
                </div>
                {/* table */}
                <div>
                  <MemberHeaderRow />
                  {members.map(m => <MemberRow key={m.id} {...m} />)}
                </div>
              </Panel>

              {/* Pending invitations */}
              <Panel padding={0} style={{ overflow: "hidden" }}>
                <div style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--nm-border)",
                  background: "var(--nm-panel-strong)",
                  display: "flex", alignItems: "baseline", gap: 8,
                }}>
                  <SectionHead eyebrow="Pending · awaiting acceptance" title="Invitations" />
                  <span style={{ flex: 1 }} />
                  <Chip accent="a">{invites.length}</Chip>
                </div>
                {invites.map((inv, i) => <InviteRow key={i} {...inv} last={i === invites.length - 1} />)}
              </Panel>
            </div>

            {/* RIGHT rail */}
            <aside style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
              <RoleDefinitions />
              <ProjectAccessLog />
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

function MemberHeaderRow() {
  const cell = {
    padding: "8px 12px",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5,
    color: "var(--nm-text-faint)",
    textTransform: "uppercase",
    letterSpacing: ".08em",
    fontWeight: 600,
    borderBottom: "1px solid var(--nm-border)",
    background: "var(--nm-panel-strong)",
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(220px, 2fr) 130px 100px 120px 120px 36px" }}>
      <div style={cell}>Member</div>
      <div style={cell}>Role</div>
      <div style={cell}>Added</div>
      <div style={cell}>Last active</div>
      <div style={cell}>Contributions · 7d</div>
      <div style={cell} />
    </div>
  );
}

function MemberRow({ name, email, role, added, lastActive, contribs, initials, accent, you }) {
  const roleColor = role === "owner" ? "var(--nm-accent-a)" : role === "editor" ? "var(--nm-accent-b)" : "var(--nm-text-dim)";
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(220px, 2fr) 130px 100px 120px 120px 36px",
      alignItems: "center",
      borderBottom: "1px solid var(--nm-border)",
      padding: "10px 12px",
      cursor: "pointer",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: accent === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)",
          color: "#fff8ec",
          display: "grid", placeItems: "center",
          fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 12,
          flex: "none",
        }}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
            {you && <span className="font-mono" style={{ fontSize: 9, padding: "1px 6px", borderRadius: 999, background: "var(--nm-panel-mono)", color: "var(--nm-text-faint)", border: "1px solid var(--nm-border)", textTransform: "uppercase", letterSpacing: ".06em" }}>you</span>}
          </div>
          <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</div>
        </div>
      </div>
      <div>
        <RolePicker role={role} />
      </div>
      <div className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-dim)" }}>{added}</div>
      <div className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-dim)" }}>{lastActive}</div>
      <div>
        <Sparkline values={contribs} accent={roleColor} />
      </div>
      <button title="More" style={{
        background: "transparent", border: "1px solid var(--nm-border)", borderRadius: 6,
        width: 24, height: 24, cursor: "pointer", color: "var(--nm-text-faint)",
        display: "grid", placeItems: "center",
        justifySelf: "end",
      }}><Icon.more size={12} /></button>
    </div>
  );
}

function RolePicker({ role }) {
  const palette = {
    owner:  { bg: "var(--nm-accent-a-tint)", border: "color-mix(in srgb, var(--nm-accent-a) 45%, transparent)", color: "var(--nm-accent-a)" },
    editor: { bg: "var(--nm-accent-b-tint)", border: "color-mix(in srgb, var(--nm-accent-b) 45%, transparent)", color: "var(--nm-accent-b)" },
    viewer: { bg: "var(--nm-panel-mono)", border: "var(--nm-border)", color: "var(--nm-text-dim)" },
  }[role];
  return (
    <button style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 8px 3px 10px",
      borderRadius: 999,
      border: `1px solid ${palette.border}`,
      background: palette.bg,
      color: palette.color,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 10.5, fontWeight: 600,
      textTransform: "lowercase", letterSpacing: ".02em",
      cursor: "pointer",
    }}>
      {role}
      <Icon.chevDown size={11} />
    </button>
  );
}

function Sparkline({ values = [], accent = "var(--nm-accent-b)" }) {
  const max = Math.max(1, ...values);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22, paddingBottom: 1 }}>
      {values.map((v, i) => (
        <div key={i} style={{
          width: 6,
          height: `${Math.max(2, (v / max) * 22)}px`,
          background: v === 0 ? "var(--nm-border)" : accent,
          borderRadius: 1.5,
          opacity: v === 0 ? 0.5 : 1,
        }} />
      ))}
      <span className="font-mono" style={{ marginLeft: 6, fontSize: 10, color: "var(--nm-text-faint)" }}>
        {values.reduce((a, b) => a + b, 0)}
      </span>
    </div>
  );
}

function InviteRow({ email, role, sentBy, sent, expires, external, last }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "40px 1fr 110px 160px 220px",
      gap: 10,
      alignItems: "center",
      padding: "10px 14px",
      borderBottom: last ? "none" : "1px solid var(--nm-border)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "1.5px dashed var(--nm-border-strong)",
        color: "var(--nm-text-faint)",
        display: "grid", placeItems: "center",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 14, fontWeight: 600,
      }}>?</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, fontFamily: "'IBM Plex Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {email}
          {external && <span style={{ marginLeft: 8, fontFamily: "'Manrope', sans-serif", fontSize: 9.5, color: "var(--nm-warn)", textTransform: "uppercase", letterSpacing: ".08em" }}>external</span>}
        </div>
        <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>
          invited by {sentBy} · {sent} · expires {expires}
        </div>
      </div>
      <RolePicker role={role} />
      <div style={{ display: "flex", gap: 6 }}>
        <Btn size="sm" variant="solid">Resend</Btn>
        <Btn size="sm" variant="solid">Copy link</Btn>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
        <button style={{
          background: "transparent", border: "1px solid var(--nm-border)", borderRadius: 6,
          padding: "4px 10px", fontSize: 11, fontWeight: 500, color: "var(--nm-danger)",
          cursor: "pointer",
        }}>Revoke</button>
      </div>
    </div>
  );
}

function RoleDefinitions() {
  const roles = [
    { id: "owner",  color: "var(--nm-accent-a)", desc: "Full control — manage members, settings, exports, delete the project." },
    { id: "editor", color: "var(--nm-accent-b)", desc: "Read + write data, run edits, create folders, export drafts." },
    { id: "viewer", color: "var(--nm-text-dim)", desc: "Read-only. Can browse My Data, watch episodes, view exports." },
  ];
  return (
    <Panel padding={0} style={{ overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--nm-border)" }}>
        <SectionHead eyebrow="Reference · scoped to this project" title="Role definitions" />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {roles.map((r, i) => (
          <div key={r.id} style={{
            padding: "10px 14px",
            borderTop: i ? "1px dashed var(--nm-border)" : 0,
            display: "flex", gap: 10,
          }}>
            <div style={{
              width: 6, alignSelf: "stretch", borderRadius: 3,
              background: r.color, flex: "none",
            }} />
            <div style={{ minWidth: 0 }}>
              <div className="font-mono" style={{ fontSize: 10.5, fontWeight: 700, color: r.color, textTransform: "uppercase", letterSpacing: ".06em" }}>
                {r.id}
              </div>
              <div style={{ fontSize: 12, color: "var(--nm-text-dim)", lineHeight: 1.5, marginTop: 2 }}>
                {r.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        padding: "8px 14px",
        borderTop: "1px solid var(--nm-border)",
        background: "var(--nm-panel-subtle)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <Icon.help size={12} style={{ color: "var(--nm-text-faint)" }} />
        <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>
          per-folder permissions land in V1.5
        </span>
      </div>
    </Panel>
  );
}

function ProjectAccessLog() {
  const events = [
    { who: "maria",        what: "promoted",  whom: "ben",            to: "editor", when: "5d ago",   kind: "promote" },
    { who: "you",          what: "invited",   whom: "kai@…",          to: "editor", when: "2d ago",   kind: "invite" },
    { who: "ben",          what: "invited",   whom: "noor@…",         to: "viewer", when: "5d ago",   kind: "invite" },
    { who: "sara",         what: "joined",    whom: "",               to: "viewer", when: "1w ago",   kind: "join" },
    { who: "maria",        what: "revoked",   whom: "ravi@…",         to: "",        when: "2w ago",   kind: "revoke" },
  ];
  const kindIcon = { promote: Icon.arrowRight, invite: Icon.plus, join: Icon.check, revoke: Icon.x };
  const kindColor = {
    promote: "var(--nm-accent-a)",
    invite:  "var(--nm-accent-b)",
    join:    "var(--nm-success)",
    revoke:  "var(--nm-danger)",
  };
  return (
    <Panel padding={0} style={{ overflow: "hidden" }}>
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--nm-border)" }}>
        <SectionHead eyebrow="Last 30 days · this project" title="Access changes" />
      </div>
      <div style={{ padding: "4px 4px 8px" }}>
        {events.map((e, i) => {
          const I = kindIcon[e.kind];
          const color = kindColor[e.kind];
          return (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 10px", borderRadius: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%",
                background: `color-mix(in srgb, ${color} 16%, transparent)`,
                color, display: "grid", placeItems: "center", flex: "none",
              }}>
                <I size={11} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12, lineHeight: 1.3 }}>
                  <span style={{ fontWeight: 600 }}>{e.who}</span>{" "}
                  <span style={{ color: "var(--nm-text-dim)" }}>{e.what}</span>
                  {e.whom && (<> <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{e.whom}</span></>)}
                  {e.to && (<> <span style={{ color: "var(--nm-text-dim)" }}>to</span> <span className="font-mono" style={{ fontSize: 11, color }}>{e.to}</span></>)}
                </div>
                <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)", marginTop: 1 }}>{e.when}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

window.MembersArtboard = MembersArtboard;
