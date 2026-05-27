// Artboard 5: Add-to-project dropdown — close-up of the picker UI state
// (triggered from the selection toolbar in the explorer). Shows:
//   - search inside the dropdown
//   - default = current tab's project (highlighted)
//   - folder picker for the chosen project
//   - "Create new project…" affordance

function AddToProjectArtboard() {
  const projects = [
    { name: "WBCD 2026",              role: "owner",  accent: "a", current: true,  episodes: 142 },
    { name: "Pickplace v2 prep",      role: "editor", accent: "b", episodes: 64 },
    { name: "Manipulation Benchmark", role: "viewer", accent: "a", episodes: 312 },
    { name: "Humanoid locomotion · spike", role: "owner", accent: "b", episodes: 38 },
    { name: "Kitchen benchmark · march",   role: "editor", accent: "a", episodes: 89, archived: true },
  ];

  const folders = [
    { label: "(top level)", count: null, level: 0 },
    { label: "Raw imports", count: 62, level: 0, open: true },
    { label: "↳ 2025-12 · gen-2", count: 44, level: 1 },
    { label: "Reference (LeRobot)", count: 30, level: 0 },
    { label: "Trial episodes", count: 24, level: 0, active: true },
    { label: "For submission", count: 26, level: 0 },
  ];

  return (
    <div className="nm" data-screen-label="05 Add-to-project dropdown · close-up"
      style={{
        padding: 24,
        display: "flex", alignItems: "stretch", justifyContent: "center",
        background: `
          radial-gradient(circle at 80% 0%, var(--nm-accent-a-tint), transparent 40%),
          radial-gradient(circle at 0% 100%, var(--nm-accent-b-tint), transparent 50%),
          var(--nm-page-glow)
        `,
      }}>
      {/* faded explorer-ish context behind */}
      <div style={{
        position: "absolute", inset: 0, padding: 32, opacity: 0.5,
        filter: "blur(1.2px) saturate(0.85)", pointerEvents: "none",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 22 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              height: 200, borderRadius: 12, border: "1px solid var(--nm-border)",
              background: i < 3 ? "var(--nm-panel)" : "var(--nm-accent-a-tint)",
              boxShadow: i < 3 ? `0 0 0 1.5px ${i < 3 ? "var(--nm-border)" : "var(--nm-accent-a)"}` : `0 0 0 2px var(--nm-accent-a)`,
            }} />
          ))}
        </div>
        <div style={{
          margin: "0 auto", width: 420, height: 44, borderRadius: 999,
          border: "1px solid color-mix(in srgb, var(--nm-accent-a) 35%, var(--nm-border))",
          background: "var(--nm-panel-strong)",
          boxShadow: "var(--nm-shadow-strong)",
        }} />
      </div>

      {/* The dropdown panel */}
      <div style={{
        zIndex: 2, marginTop: 28, alignSelf: "flex-start",
        width: 540,
        background: "var(--nm-panel-strong)",
        border: "1px solid var(--nm-border-strong)",
        borderRadius: 14,
        boxShadow: "0 32px 80px rgba(22, 35, 32, 0.18), 0 0 0 6px rgba(255,255,255,0.04)",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* anchor tail */}
        <div style={{
          position: "absolute", bottom: -7, left: 90,
          width: 14, height: 14,
          background: "var(--nm-panel-strong)",
          borderRight: "1px solid var(--nm-border-strong)",
          borderBottom: "1px solid var(--nm-border-strong)",
          transform: "rotate(45deg)",
        }} />

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 14px",
          background: "linear-gradient(135deg, var(--nm-accent-a-tint), transparent 60%)",
          borderBottom: "1px solid var(--nm-border)",
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "var(--nm-accent-a)", color: "#fff8ec",
            display: "grid", placeItems: "center",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
          }}>5</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".12em" }}>
              Add to project
            </div>
            <div style={{ fontSize: 12.5, color: "var(--nm-text)" }}>
              <span className="font-mono" style={{ fontWeight: 600 }}>3 datasets</span> + <span className="font-mono" style={{ fontWeight: 600 }}>2 episodes</span>
            </div>
          </div>
          <button style={{
            width: 24, height: 24, borderRadius: 6,
            background: "transparent", border: "1px solid var(--nm-border)",
            color: "var(--nm-text-dim)", cursor: "pointer",
            display: "grid", placeItems: "center",
          }}><Icon.x size={12} /></button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          {/* Project picker */}
          <div style={{ borderRight: "1px dashed var(--nm-border)", padding: "10px 0 8px" }}>
            <div className="font-mono" style={{ padding: "0 14px 8px", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--nm-text-faint)" }}>
              Project
            </div>
            <div className="nm-input" style={{ margin: "0 12px 8px", padding: "5px 10px", borderRadius: 8 }}>
              <Icon.search size={12} />
              <input placeholder="Filter projects" defaultValue="" />
            </div>
            <div style={{ maxHeight: 220, overflowY: "auto", padding: "0 8px" }}>
              {projects.map((p, i) => <ProjectRow key={i} {...p} />)}
              <div style={{ borderTop: "1px dashed var(--nm-border)", margin: "6px 4px" }} />
              <div className="nm-nav-row" style={{ padding: "7px 8px", color: "var(--nm-text-dim)" }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: "1.5px dashed var(--nm-accent-a)",
                  color: "var(--nm-accent-a)",
                  display: "grid", placeItems: "center", flex: "none",
                }}><Icon.plus size={12} /></span>
                <span className="nm-nav-row__label">Create new project…</span>
              </div>
            </div>
          </div>

          {/* Folder picker */}
          <div style={{ padding: "10px 0 8px" }}>
            <div className="font-mono" style={{
              padding: "0 14px 8px",
              fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em",
              color: "var(--nm-text-faint)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span>Folder in</span>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: "var(--nm-accent-a)", letterSpacing: ".02em",
              }}>WBCD 2026</span>
            </div>
            <div className="nm-input" style={{ margin: "0 12px 8px", padding: "5px 10px", borderRadius: 8 }}>
              <Icon.search size={12} />
              <input placeholder="Find or create folder" defaultValue="trial" />
            </div>
            <div style={{ maxHeight: 220, overflowY: "auto", padding: "0 8px" }}>
              {folders.map((f, i) => <FolderRow key={i} {...f} />)}
              <div style={{ borderTop: "1px dashed var(--nm-border)", margin: "6px 4px" }} />
              <div className="nm-nav-row" style={{ padding: "7px 8px", color: "var(--nm-text-dim)" }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: "1.5px dashed var(--nm-accent-a)",
                  color: "var(--nm-accent-a)",
                  display: "grid", placeItems: "center", flex: "none",
                }}><Icon.folder size={11} /></span>
                <span className="nm-nav-row__label">New folder “trial”…</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px",
          background: "var(--nm-panel-subtle)",
          borderTop: "1px solid var(--nm-border)",
        }}>
          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, color: "var(--nm-text-dim)" }}>
            <span className="nm-check nm-check--on" style={{ width: 14, height: 14 }}>
              <Icon.check size={9} />
            </span>
            Keep selection after adding
          </label>
          <span style={{ flex: 1 }} />
          <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>
            <Kbd>↵</Kbd> to confirm
          </span>
          <Btn size="sm" variant="solid">Cancel</Btn>
          <Btn size="sm" variant="primary" icon={<Icon.arrowRight size={12} />}>
            Add to Trial episodes
          </Btn>
        </div>
      </div>
    </div>
  );
}

function ProjectRow({ name, role, accent, current, episodes, archived }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "7px 8px",
      borderRadius: 8,
      cursor: "pointer",
      background: current ? "var(--nm-accent-a-tint)" : "transparent",
      border: current ? "1px solid color-mix(in srgb, var(--nm-accent-a) 35%, transparent)" : "1px solid transparent",
      opacity: archived ? 0.65 : 1,
      marginBottom: 2,
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6,
        background: accent === "b" ? "var(--nm-accent-b-tint)" : "var(--nm-accent-a-tint)",
        color: accent === "b" ? "var(--nm-accent-b)" : "var(--nm-accent-a)",
        display: "grid", placeItems: "center", flex: "none",
      }}><Icon.trophy size={13} /></div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: current ? 700 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
        <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", letterSpacing: ".04em" }}>
          {role} · {episodes} eps{archived ? " · archived" : ""}
        </div>
      </div>
      {current && (
        <span className="font-mono" style={{
          fontSize: 9, padding: "2px 6px", borderRadius: 999,
          background: "var(--nm-accent-a)", color: "#fff8ec",
          textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 600,
        }}>current</span>
      )}
    </div>
  );
}

function FolderRow({ label, count, level, open, active }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 8px",
      borderRadius: 7,
      marginLeft: level * 12,
      background: active ? "var(--nm-accent-a-tint)" : "transparent",
      color: active ? "var(--nm-accent-a)" : "var(--nm-text-dim)",
      cursor: "pointer",
      fontSize: 12.5,
      fontWeight: active ? 700 : 500,
      border: active ? "1px solid color-mix(in srgb, var(--nm-accent-a) 35%, transparent)" : "1px solid transparent",
      marginBottom: 2,
    }}>
      {open
        ? <Icon.folderOpen size={13} style={{ color: "var(--nm-accent-a)" }} />
        : <Icon.folder size={13} style={{ color: active ? "var(--nm-accent-a)" : "var(--nm-text-faint)" }} />
      }
      <span style={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      {count != null && <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>{count}</span>}
    </div>
  );
}

window.AddToProjectArtboard = AddToProjectArtboard;
