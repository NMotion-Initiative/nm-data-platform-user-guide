// Artboard 2: Landing page — forces user to create or pick a project before
// entering the app. Cards for "Pinned", "Recent", and "New project".

function LandingArtboard() {
  // Submission deadline chip cut per DECISIONS.md A.§10.5 — no `deadline` field
  // on the project model in V1. Reminders live in Slack / email / leaderboard.
  const pinned = [
    { name: "WBCD 2026", role: "owner", episodes: 142, datasets: 8, accent: "a", lastSeen: "10 min ago" },
    { name: "Pickplace v2 prep", role: "editor", episodes: 64, datasets: 4, accent: "b", lastSeen: "yesterday" },
    { name: "Manipulation Benchmark", role: "viewer", episodes: 312, datasets: 12, accent: "a", lastSeen: "3 days ago" },
  ];
  const recent = [
    { name: "Humanoid locomotion · spike", role: "owner", episodes: 38, lastSeen: "1 week ago", accent: "b" },
    { name: "Kitchen benchmark · march",   role: "editor", episodes: 89, lastSeen: "3 weeks ago", accent: "a" },
    { name: "SO-100 baseline (archived)",  role: "viewer", episodes: 220, lastSeen: "Apr 2", accent: "a", archived: true },
    { name: "Bin-packing study",           role: "owner", episodes: 14, lastSeen: "Mar 21", accent: "b" },
  ];

  return (
    <div className="nm" data-screen-label="02 Landing — pick or create a project" style={{ overflow: "auto", padding: 28 }}>
      {/* Header strip */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22, maxWidth: 1180, margin: "0 auto 22px" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "var(--nm-accent-a)", color: "#fff8ec",
          display: "grid", placeItems: "center",
          fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 18,
        }}>N</div>
        <div style={{ minWidth: 0 }}>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Neural Motion · Data Platform</div>
          <div className="font-mono" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--nm-text-faint)" }}>
            workspace · neural-motion
          </div>
        </div>
        <span style={{ flex: 1 }} />
        <span className="font-mono nm-chip" style={{ padding: "3px 10px" }}>
          <span className="nm-dot nm-dot--ok" /> api · dev
        </span>
        <div className="nm-input" style={{ padding: "5px 10px", borderRadius: 999, minWidth: 220, color: "var(--nm-text-faint)" }}>
          <Icon.search size={12} />
          <input placeholder="Find a project" />
          <Kbd>⌘K</Kbd>
        </div>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--nm-accent-b)", color: "#fff8ec", display: "grid", placeItems: "center", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 11 }}>
          MR
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        {/* Welcome banner */}
        <Panel padding={0} style={{ overflow: "hidden", marginBottom: 18 }}>
          <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, var(--nm-accent-a-tint) 0%, transparent 55%, var(--nm-accent-b-tint) 100%)" }}>
            <Chip accent="a" style={{ marginBottom: 8 }}>Welcome back · maria</Chip>
            <h1 className="font-display" style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
              Pick a project to start.
            </h1>
            <p style={{ margin: "6px 0 0", color: "var(--nm-text-dim)", maxWidth: 620, fontSize: 13.5, lineHeight: 1.55 }}>
              Every dataset, edit, and export is scoped to a project. Open one of yours, or start a fresh one — your workspace stays organised across browser tabs.
            </p>
          </div>
        </Panel>

        {/* Pinned projects + New project */}
        <div style={{ marginBottom: 6, display: "flex", alignItems: "baseline", gap: 10 }}>
          <SectionHead eyebrow="Pinned · 3" title="Your projects" />
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12, marginBottom: 22,
        }}>
          {pinned.map((p, i) => <ProjectCard key={i} {...p} />)}
          <NewProjectCard />
        </div>

        {/* Recent */}
        <div style={{ marginBottom: 6 }}>
          <SectionHead eyebrow="Recent · last 30 days" title="Other projects you can re-open" />
        </div>
        <Panel padding={0} style={{ overflow: "hidden" }}>
          {recent.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "12px 16px",
              borderTop: i ? "1px solid var(--nm-border)" : 0,
              cursor: "pointer",
              opacity: p.archived ? 0.7 : 1,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: p.accent === "b" ? "var(--nm-accent-b-tint)" : "var(--nm-accent-a-tint)",
                color: p.accent === "b" ? "var(--nm-accent-b)" : "var(--nm-accent-a)",
                display: "grid", placeItems: "center",
              }}>
                <Icon.trophy size={16} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  {p.name}
                  {p.archived && <span className="font-mono nm-chip" style={{ fontSize: 9, padding: "2px 6px" }}>archived</span>}
                </div>
                <div className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-faint)", letterSpacing: ".04em" }}>
                  {p.role} · {p.episodes} episodes · last opened {p.lastSeen}
                </div>
              </div>
              <Btn size="sm" variant="solid" icon={<Icon.arrowRight size={12} />}>Open in new tab</Btn>
            </div>
          ))}
        </Panel>

        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14, color: "var(--nm-text-faint)" }}>
          <span className="font-mono" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".12em" }}>
            Tip
          </span>
          <span style={{ fontSize: 12 }}>
            Need to invite someone? Open a project, then <span className="font-mono" style={{ color: "var(--nm-text)" }}>Settings → Members</span>. Each project keeps its own roster.
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ name, role, episodes, datasets, accent, lastSeen }) {
  return (
    <div style={{
      border: "1px solid var(--nm-border)", borderRadius: 14,
      background: "var(--nm-panel)", boxShadow: "var(--nm-shadow-soft)",
      padding: 14, display: "flex", flexDirection: "column", gap: 10,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%",
        background: `radial-gradient(circle, color-mix(in srgb, ${accent === "b" ? "var(--nm-accent-b)" : "var(--nm-accent-a)"} 18%, transparent), transparent 65%)`,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: accent === "b" ? "var(--nm-accent-b-tint)" : "var(--nm-accent-a-tint)",
          color: accent === "b" ? "var(--nm-accent-b)" : "var(--nm-accent-a)",
          display: "grid", placeItems: "center",
        }}>
          <Icon.trophy size={14} />
        </div>
        <span className="font-mono nm-chip" style={{ marginLeft: "auto", fontSize: 9.5, padding: "2px 6px" }}>{role}</span>
      </div>
      <div className="font-display" style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
        {name}
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
        borderRadius: 8, border: "1px solid var(--nm-border)",
        background: "var(--nm-panel-mono)", padding: "8px 10px",
      }}>
        <div>
          <div className="font-mono" style={{ fontSize: 9, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".06em" }}>episodes</div>
          <div className="font-mono" style={{ fontSize: 13, fontWeight: 600 }}>{episodes}</div>
        </div>
        <div>
          <div className="font-mono" style={{ fontSize: 9, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".06em" }}>datasets</div>
          <div className="font-mono" style={{ fontSize: 13, fontWeight: 600 }}>{datasets}</div>
        </div>
      </div>
      <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>
        last opened {lastSeen}
      </div>
      <Btn variant="primary" accent={accent} icon={<Icon.arrowRight size={12} />} style={{ marginTop: "auto" }}>
        Open in new tab
      </Btn>
    </div>
  );
}

function NewProjectCard() {
  return (
    <div style={{
      border: "1.5px dashed var(--nm-border-strong)", borderRadius: 14,
      background: "var(--nm-panel-subtle)",
      padding: 14, display: "flex", flexDirection: "column", gap: 10,
      cursor: "pointer",
      minHeight: 220,
      justifyContent: "center", alignItems: "center", textAlign: "center",
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        border: "1.5px solid var(--nm-accent-a)",
        background: "var(--nm-accent-a-tint)",
        color: "var(--nm-accent-a)",
        display: "grid", placeItems: "center",
      }}>
        <Icon.plus size={20} />
      </div>
      <div className="font-display" style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>
        New project
      </div>
      <div style={{ fontSize: 12, color: "var(--nm-text-dim)", maxWidth: 220, lineHeight: 1.5 }}>
        Spin up an empty workspace. Add datasets from the catalog or import your own HDF5.
      </div>
      <Btn size="sm" variant="solid" icon={<Icon.plus size={12} />}>Create project</Btn>
    </div>
  );
}

window.LandingArtboard = LandingArtboard;
