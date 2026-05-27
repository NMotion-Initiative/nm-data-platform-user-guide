// UI primitives + icons — port of src/workspace/ui.tsx using vanilla CSS.
// Loaded as a global script; components attach to window for cross-file access.

const { useState, useRef, useEffect, useMemo } = React;

// ── Icons (Lucide-style; 24x24 viewBox, stroke=currentColor) ─────────────
function ico(d, opts = {}) {
  return ({ size = 14, ...rest }) => (
    <svg
      width={size} height={size} viewBox="0 0 24 24"
      fill={opts.fill || "none"} stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      {...rest}
    >
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

const Icon = {
  database: ico(["M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3-3.6-3-8-3-8 1.3-8 3z","M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6","M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"]),
  film: ico(["M3 4h18v16H3z","M7 4v16","M17 4v16","M3 8h4","M3 12h4","M3 16h4","M17 8h4","M17 12h4","M17 16h4"]),
  folder: ico(["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]),
  folderOpen: ico(["M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v.5","M3 9.5l1.7 8a2 2 0 0 0 2 1.5H19a2 2 0 0 0 2-1.5l1-7.5H6.7a2 2 0 0 0-1.94 1.5L3 19.5"]),
  workflow: ico(["M3 3h6v6H3z","M15 15h6v6h-6z","M9 6h6a3 3 0 0 1 3 3v6"]),
  upload: ico(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M17 8l-5-5-5 5","M12 3v12"]),
  download: ico(["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4","M7 10l5 5 5-5","M12 15V3"]),
  activity: ico(["M22 12h-4l-3 9L9 3l-3 9H2"]),
  settings: ico(["M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z","M19.4 15a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7v0a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"]),
  trophy: ico(["M6 9H4a2 2 0 0 1-2-2V5h4","M18 9h2a2 2 0 0 0 2-2V5h-4","M6 5v6a6 6 0 0 0 12 0V5z","M8 21h8","M12 17v4"]),
  users: ico(["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2","M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z","M22 21v-2a4 4 0 0 0-3-3.87","M16 3.13a4 4 0 0 1 0 7.75"]),
  help: ico(["M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10z","M9.1 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3","M12 17h.01"]),
  search: ico(["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z","M21 21l-4.3-4.3"]),
  bell: ico(["M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9","M13.7 21a2 2 0 0 1-3.4 0"]),
  sun: ico(["M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z","M12 2v2","M12 20v2","M4.93 4.93l1.41 1.41","M17.66 17.66l1.41 1.41","M2 12h2","M20 12h2","M4.93 19.07l1.41-1.41","M17.66 6.34l1.41-1.41"]),
  moon: ico(["M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"]),
  plus: ico(["M12 5v14","M5 12h14"]),
  chevDown: ico(["M6 9l6 6 6-6"]),
  chevRight: ico(["M9 18l6-6-6-6"]),
  chevLeft: ico(["M15 18l-6-6 6-6"]),
  chevsLeft: ico(["M11 17l-5-5 5-5","M18 17l-5-5 5-5"]),
  x: ico(["M18 6L6 18","M6 6l18 12".replace('18 12','12 12')]),
  check: ico(["M20 6L9 17l-5-5"]),
  more: ico(["M5 12h.01","M12 12h.01","M19 12h.01"]),
  tag: ico(["M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z","M7 7h.01"]),
  history: ico(["M3 12a9 9 0 1 0 3-6.7L3 8","M3 3v5h5","M12 7v5l3 2"]),
  clock: ico(["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z","M12 6v6l4 2"]),
  box: ico(["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z","M3.27 6.96L12 12.01l8.73-5.05","M12 22.08V12"]),
  arrowRight: ico(["M5 12h14","M12 5l7 7-7 7"]),
  flag: ico(["M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z","M4 22V15"]),
  star: ico(["M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"]),
  trash: ico(["M3 6h18","M19 6l-1.4 14a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 6","M10 11v6","M14 11v6","M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"]),
  pencil: ico(["M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"]),
  move: ico(["M5 9l-3 3 3 3","M9 5l3-3 3 3","M15 19l-3 3-3-3","M19 9l3 3-3 3","M2 12h20","M12 2v20"]),
  filter: ico(["M3 5h18l-7 8v6l-4-2v-4z"]),
};

// Replacing the broken X path
Icon.x = ico(["M18 6L6 18","M6 6l12 12"]);

// ── Primitives ──────────────────────────────────────────────────────────
function Panel({ children, strong, mono, subtle, padding = 14, className = "", style, ...rest }) {
  const mod = strong ? "nm-panel nm-panel--strong" : mono ? "nm-panel nm-panel--mono" : subtle ? "nm-panel nm-panel--subtle" : "nm-panel";
  return (
    <div className={`${mod} ${className}`} style={{ padding, ...(style || {}) }} {...rest}>
      {children}
    </div>
  );
}

function Chip({ children, accent, className = "", style, onClick, title }) {
  const cls = `nm-chip ${accent === "a" ? "nm-chip--a" : accent === "b" ? "nm-chip--b" : ""} ${className}`;
  if (onClick) return <button type="button" onClick={onClick} title={title} className={cls} style={style}>{children}</button>;
  return <span title={title} className={cls} style={style}>{children}</span>;
}

function Btn({ children, variant = "ghost", size = "md", accent = "a", icon, className = "", style, onClick, title }) {
  const v = variant === "primary" ? (accent === "b" ? "nm-btn--primary-b" : "nm-btn--primary") : variant === "solid" ? "nm-btn--solid" : "";
  const s = size === "sm" ? "nm-btn--sm" : size === "lg" ? "nm-btn--lg" : "";
  return (
    <button type="button" onClick={onClick} title={title}
      className={`nm-btn ${v} ${s} ${className}`} style={style}>
      {icon}
      {children}
    </button>
  );
}

function SectionHead({ eyebrow, title, action, className = "" }) {
  return (
    <div className={`${className}`} style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        {eyebrow ? <div className="nm-sec-eyebrow">{eyebrow}</div> : null}
        <div className="nm-sec-title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
      </div>
      {action ? <div style={{ flex: "0 0 auto" }}>{action}</div> : null}
    </div>
  );
}

// Small horizontal kbd
function Kbd({ children }) {
  return (
    <kbd style={{
      border: "1px solid var(--nm-border)",
      borderRadius: 4,
      padding: "1px 4px",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 10,
      color: "var(--nm-text-dim)",
      background: "transparent",
      lineHeight: 1.4,
    }}>{children}</kbd>
  );
}

// ── Sidebar (per-project) ──────────────────────────────────────────────
function Sidebar({ active = "explorer", collapsed = false, project = "WBCD 2026", role = "owner" }) {
  // v4 · Imports + Exports removed — both fold into My Data as tabs (see
  // BRIEF §2). Nav is now 5 items: Explorer, My Data, Editing, Activity,
  // Project members. Settings + Help still live in the bottom-left utility
  // row.
  const items = [
    { id: "explorer", label: "Dataset Explorer", icon: Icon.database },
    { id: "mydata",   label: "My Data",          icon: Icon.folderOpen },
    { id: "editing",  label: "Editing",          icon: Icon.workflow, badge: "3" },
    { id: "activity", label: "Activity",         icon: Icon.activity },
    { id: "members",  label: "Project members",  icon: Icon.users },
  ];
  return (
    <aside style={{
      flex: "none",
      width: collapsed ? 56 : 220,
      borderRight: "1px solid var(--nm-border)",
      background: "var(--nm-panel)",
      display: "flex", flexDirection: "column",
      transition: "width .2s ease",
    }}>
      {/* logo block */}
      <div style={{ height: 56, padding: "0 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: "var(--nm-accent-a)", color: "#fff8ec",
          display: "grid", placeItems: "center",
          fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 15,
          letterSpacing: "-0.02em",
        }}>N</div>
        {!collapsed && (
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 13, letterSpacing: "-0.01em" }}>
              Neural Motion
            </div>
            <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".12em" }}>
              data platform
            </div>
          </div>
        )}
      </div>

      {/* project scope crumb */}
      {!collapsed && (
        <div style={{
          margin: "2px 10px 8px", padding: "8px 10px",
          border: "1px solid var(--nm-border)", borderRadius: 10,
          background: "var(--nm-panel-subtle)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <Icon.trophy size={14} style={{ color: "var(--nm-accent-a)" }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="font-mono" style={{ fontSize: 9, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".14em" }}>
              project
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {project}
            </div>
          </div>
          <span className="font-mono nm-chip" style={{ padding: "2px 6px", borderRadius: 6, fontSize: 9.5 }}>{role}</span>
        </div>
      )}

      <nav style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        <div style={{ marginBottom: 10 }}>
          {!collapsed && <div style={{ padding: "4px 8px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--nm-text-faint)" }}>In this project</div>}
          {items.map(it => {
            const I = it.icon;
            const isActive = it.id === active;
            return (
              <div key={it.id} className={`nm-nav-row ${isActive ? "nm-nav-row--active" : ""}`} style={collapsed ? { justifyContent: "center" } : null}>
                <I size={15} />
                {!collapsed && <span className="nm-nav-row__label">{it.label}</span>}
                {!collapsed && it.badge && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace",
                    padding: "1px 6px", borderRadius: 999, border: "1px solid var(--nm-border)",
                    color: "var(--nm-accent-a)",
                  }}>{it.badge}</span>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* utility row + user menu */}
      <div style={{ borderTop: "1px solid var(--nm-border)" }}>
        {!collapsed && (
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "8px 10px 0",
          }}>
            <button
              type="button"
              title="Settings"
              className="nm-nav-row"
              style={{
                flex: 1, justifyContent: "flex-start", gap: 8,
                padding: "6px 8px",
                fontSize: 12,
                background: "transparent", border: 0, cursor: "pointer",
              }}
            >
              <Icon.settings size={14} />
              <span className="nm-nav-row__label">Settings</span>
            </button>
            <button
              type="button"
              title="Help"
              className="nm-nav-row"
              style={{
                padding: "6px 8px",
                background: "transparent", border: 0, cursor: "pointer",
              }}
            >
              <Icon.help size={14} />
            </button>
          </div>
        )}
        {collapsed && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 0 0" }}>
            <div className="nm-nav-row" style={{ justifyContent: "center", padding: "6px 0", width: 36 }} title="Settings">
              <Icon.settings size={14} />
            </div>
            <div className="nm-nav-row" style={{ justifyContent: "center", padding: "6px 0", width: 36 }} title="Help">
              <Icon.help size={14} />
            </div>
          </div>
        )}

        <div style={{ padding: 10, display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--nm-accent-b)", color: "#fff8ec", display: "grid", placeItems: "center", fontFamily: "'Space Grotesk'", fontWeight: 700, fontSize: 11, flex: "none" }}>
            MR
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                maria@neural-motion.com
              </div>
              <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".12em" }}>
                neural-motion
              </div>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              title="Account menu"
              style={{
                width: 22, height: 22, borderRadius: 5,
                background: "transparent", border: "1px solid var(--nm-border)",
                color: "var(--nm-text-faint)", cursor: "pointer",
                display: "grid", placeItems: "center", flex: "none",
              }}
            >
              <Icon.chevDown size={11} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

// ── Tab strip ──────────────────────────────────────────────────────────
function TabStrip({ tabs, activeId, onSelect, onClose, onNew, recent = [], onOpenRecent }) {
  const [recentOpen, setRecentOpen] = useState(false);
  return (
    <div className="nm-tabs">
      {tabs.map(t => {
        const isActive = t.id === activeId;
        return (
          <div key={t.id} className={`nm-tab ${isActive ? "nm-tab--active" : ""}`} onClick={() => onSelect?.(t.id)}>
            <Icon.trophy size={13} className="nm-tab__icon" style={{ color: t.accent === "b" ? "var(--nm-accent-b)" : "var(--nm-accent-a)" }} />
            <span className="nm-tab__label">{t.name}</span>
            {t.dirty && <span className="nm-dot nm-dot--a" style={{ width: 5, height: 5 }} />}
            <span className="nm-tab__close" onClick={(e) => { e.stopPropagation(); onClose?.(t.id); }} aria-label="Close tab">
              <Icon.x size={11} />
            </span>
          </div>
        );
      })}
      <button className="nm-btn nm-btn--sm" style={{ height: 26, margin: "0 6px 4px", borderRadius: 8 }} onClick={onNew}>
        <Icon.plus size={12} /> New project
      </button>
      <span style={{ flex: 1 }} />
      {/* Recent dropdown */}
      <div style={{ position: "relative", marginBottom: 4 }}>
        <button className="nm-btn nm-btn--sm" style={{ height: 26 }} onClick={() => setRecentOpen(o => !o)}>
          <Icon.clock size={12} />
          Recent projects
          <Icon.chevDown size={12} />
        </button>
        {recentOpen && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 30,
            minWidth: 280,
            border: "1px solid var(--nm-border)", borderRadius: 12,
            background: "var(--nm-panel-strong)",
            boxShadow: "var(--nm-shadow-strong)",
            padding: 6,
          }}>
            <div className="font-mono" style={{ padding: "6px 10px 4px", fontSize: 9.5, textTransform: "uppercase", letterSpacing: ".12em", color: "var(--nm-text-faint)" }}>
              Recent · not open
            </div>
            {recent.map(r => (
              <div key={r.slug} className="nm-nav-row" style={{ padding: "6px 8px", borderRadius: 8 }} onClick={() => { setRecentOpen(false); onOpenRecent?.(r); }}>
                <Icon.trophy size={13} style={{ color: r.accent === "b" ? "var(--nm-accent-b)" : "var(--nm-accent-a)" }} />
                <div className="nm-nav-row__label">
                  <div style={{ fontSize: 12.5, color: "var(--nm-text)" }}>{r.name}</div>
                  <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>
                    {r.lastSeen}
                  </div>
                </div>
              </div>
            ))}
            <div style={{ borderTop: "1px dashed var(--nm-border)", margin: "4px 0" }} />
            <div className="nm-nav-row" style={{ padding: "6px 8px", color: "var(--nm-text-dim)" }}>
              <Icon.search size={13} />
              <span className="nm-nav-row__label">Browse all projects…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Topbar (breadcrumbs + utilities) ───────────────────────────────────
function Topbar({ crumbs = [], env = "dev" }) {
  return (
    <header style={{
      height: 48, flex: "none",
      borderBottom: "1px solid var(--nm-border)",
      background: "var(--nm-panel-strong)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", gap: 12, padding: "0 14px",
      position: "relative", zIndex: 1,
    }}>
      <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, minWidth: 0 }}>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <React.Fragment key={i}>
              {i > 0 && <span className="font-mono" style={{ color: "var(--nm-text-faint)" }}>/</span>}
              <span style={{
                color: last ? "var(--nm-text)" : "var(--nm-text-dim)",
                fontWeight: last ? 600 : 400,
                fontFamily: last ? "'Space Grotesk'" : "inherit",
                letterSpacing: last ? "-0.01em" : "normal",
              }}>{c}</span>
            </React.Fragment>
          );
        })}
      </nav>
      <span style={{ flex: 1 }} />
      <div className="nm-input" style={{ padding: "5px 10px", minWidth: 220, color: "var(--nm-text-faint)", fontSize: 12, borderRadius: 999 }}>
        <Icon.search size={12} />
        <span style={{ flex: 1, color: "var(--nm-text-faint)" }}>Search</span>
        <Kbd>⌘K</Kbd>
      </div>
      <span className="font-mono" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        border: "1px solid var(--nm-border)", borderRadius: 999,
        padding: "3px 10px", fontSize: 10.5, color: "var(--nm-text-dim)",
        background: "var(--nm-panel)",
      }}>
        <span className="nm-dot nm-dot--ok" />
        api · {env}
      </span>
      <button className="nm-btn nm-btn--sm" style={{ width: 30, height: 30, padding: 0, borderRadius: 8 }} title="Theme">
        <Icon.moon size={14} />
      </button>
      <button className="nm-btn nm-btn--sm" style={{ width: 30, height: 30, padding: 0, borderRadius: 8, position: "relative" }} title="Notifications">
        <Icon.bell size={14} />
        <span className="nm-dot nm-dot--a" style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, border: "1.5px solid var(--nm-panel-strong)" }} />
      </button>
    </header>
  );
}

Object.assign(window, { Icon, Panel, Chip, Btn, SectionHead, Kbd, Sidebar, TabStrip, Topbar });
