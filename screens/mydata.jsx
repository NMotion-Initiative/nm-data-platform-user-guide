// Artboard 4: My Data panel — per-project file manager.
// Folder tree on the left, folder contents in the middle (mix of datasets and
// episode rows), History drawer on the right scoped to project.

function MyDataArtboard() {
  // Folder tree state
  const tree = [
    { id: "_root", label: "WBCD 2026", count: 142, level: 0, open: true, kind: "root" },
    { id: "raw",   label: "Raw imports",         count: 62, level: 1, open: true,  active: false },
    { id: "raw-2025-11", label: "2025-11 · pilot", count: 18, level: 2 },
    { id: "raw-2025-12", label: "2025-12 · gen-2", count: 44, level: 2 },
    { id: "ref",   label: "Reference (LeRobot)", count: 30, level: 1, open: false },
    { id: "trial", label: "Trial episodes",      count: 24, level: 1, open: true, active: true },
    { id: "trial-pp", label: "pick-and-place",     count: 16, level: 2 },
    { id: "trial-pour", label: "pouring",          count: 8,  level: 2 },
    { id: "out",   label: "For submission",      count: 26, level: 1, accent: "a" },
  ];

  const folderTitle = "Trial episodes";

  // Contents — datasets + individual episodes mixed
  const datasets = [
    { id: "svla",  title: "lerobot/svla_so100_pickplace", prov: "lerobot",  a: "a", ep: 42, addedBy: "maria", on: "May 24" },
    { id: "aloha", title: "lerobot/aloha_static_coffee",  prov: "lerobot",  a: "b", ep: 96, addedBy: "ben",   on: "May 22" },
    { id: "myset", title: "wbcd · trial-set-a · workspace", prov: "workspace", a: "a", ep: 14, addedBy: "you",   on: "today", workspace: true },
  ];

  const episodes = [
    { dataset: "lerobot/xarm_lift_medium", i: 1,  frames: 2104, dur: "1:10", status: "annotated", addedBy: "ben",   on: "May 26" },
    { dataset: "lerobot/xarm_lift_medium", i: 4,  frames: 1985, dur: "1:06", status: "ok",        addedBy: "ben",   on: "May 26" },
    { dataset: "wbcd · trial-set-a",        i: 12, frames: 2210, dur: "1:13", status: "flagged",   addedBy: "you",   on: "today" },
  ];

  // History events
  const history = [
    { when: "12 min ago",  who: "you",   what: "Imported 14 episodes from", target: "trial-set-a.hdf5", kind: "upload" },
    { when: "32 min ago",  who: "ben",   what: "Added", target: "lerobot/xarm_lift_medium #1, #4", kind: "add", here: true },
    { when: "2 hours ago", who: "maria", what: "Created folder", target: "pick-and-place", kind: "folder" },
    { when: "yesterday",   who: "ben",   what: "Flagged episode", target: "trial-set-a #12", kind: "flag" },
    { when: "yesterday",   who: "maria", what: "Exported v0.3 of", target: "submission/derived-A", kind: "export" },
    { when: "May 22",      who: "ben",   what: "Added dataset", target: "lerobot/aloha_static_coffee", kind: "add" },
    { when: "May 22",      who: "maria", what: "Created project", target: "WBCD 2026", kind: "create" },
  ];

  const tabs = [
    { id: "wbcd",    name: "WBCD 2026",          accent: "a" },
    { id: "pickplc", name: "Pickplace v2 prep",  accent: "b" },
    { id: "manip",   name: "Manipulation Bench", accent: "a" },
  ];
  const recent = [{ slug: "kitchen-mar", name: "Kitchen benchmark · march", lastSeen: "4d ago", accent: "a" }];

  return (
    <div className="nm" data-screen-label="04 My Data · folder tree + history drawer">
      <TabStrip tabs={tabs} activeId="wbcd" recent={recent} />
      <div style={{ display: "flex", height: "calc(100% - 38px)" }}>
        <Sidebar active="mydata" project="WBCD 2026" role="owner" />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Topbar crumbs={["WBCD 2026", "My Data", "Trial episodes"]} env="dev" />

          <main style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "240px 1fr 320px" }}>
            {/* Folder tree */}
            <aside style={{
              borderRight: "1px solid var(--nm-border)",
              background: "var(--nm-panel)",
              display: "flex", flexDirection: "column",
              minHeight: 0,
            }}>
              <div style={{
                padding: "14px 14px 10px",
                display: "flex", alignItems: "center", gap: 8,
                borderBottom: "1px solid var(--nm-border)",
              }}>
                <SectionHead eyebrow="Project file manager" title="My Data" />
              </div>
              <div style={{ padding: "10px 10px 8px", display: "flex", gap: 6 }}>
                <Btn size="sm" variant="primary" accent="a" icon={<Icon.plus size={12} />}>New folder</Btn>
                <Btn size="sm" variant="solid" icon={<Icon.upload size={12} />}>Import…</Btn>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px 12px" }}>
                {tree.map(node => <TreeRow key={node.id} {...node} />)}
                <div style={{ borderTop: "1px dashed var(--nm-border)", margin: "10px 4px" }} />
                <div className="font-mono" style={{ padding: "4px 10px", fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".12em" }}>
                  Quick filters
                </div>
                {[
                  { label: "Flagged",   count: 7,  dot: "danger" },
                  { label: "Favorited", count: 14, dot: "warn" },
                  { label: "Recently added", count: 9, dot: "b" },
                ].map(f => (
                  <div key={f.label} className="nm-nav-row" style={{ padding: "6px 10px", marginLeft: 4 }}>
                    <span className={`nm-dot nm-dot--${f.dot}`} />
                    <span className="nm-nav-row__label">{f.label}</span>
                    <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>{f.count}</span>
                  </div>
                ))}
              </div>
            </aside>

            {/* Folder contents */}
            <section style={{ minWidth: 0, overflow: "auto", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".12em" }}>
                    Folder · 2 sub-folders · 24 entries
                  </div>
                  <h2 className="font-display" style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
                    {folderTitle}
                  </h2>
                </div>
                <span style={{ flex: 1 }} />
                <div className="nm-input" style={{ padding: "5px 10px", borderRadius: 999, minWidth: 200, color: "var(--nm-text-faint)" }}>
                  <Icon.search size={12} />
                  <input placeholder="Search in folder" />
                </div>
                <Btn size="sm" variant="solid" icon={<Icon.filter size={12} />}>Filter</Btn>
                <Btn size="sm" variant="solid" icon={<Icon.move size={12} />}>Move</Btn>
                <Btn size="sm" variant="primary" icon={<Icon.plus size={12} />}>Add from explorer</Btn>
              </div>

              {/* Subfolders strip */}
              <div style={{ marginBottom: 14 }}>
                <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".12em", marginBottom: 6 }}>
                  Sub-folders
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
                  {[{ name: "pick-and-place", count: 16 }, { name: "pouring", count: 8 }].map(f => (
                    <div key={f.name} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px",
                      border: "1px solid var(--nm-border)", borderRadius: 10,
                      background: "var(--nm-panel)",
                      cursor: "pointer",
                    }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 7,
                        background: "var(--nm-accent-b-tint)", color: "var(--nm-accent-b)",
                        display: "grid", placeItems: "center",
                      }}><Icon.folder size={14} /></div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                        <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>{f.count} episodes</div>
                      </div>
                      <Icon.chevRight size={12} style={{ color: "var(--nm-text-faint)" }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Datasets */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <h3 className="font-display" style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>Datasets in this folder</h3>
                  <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>3</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                  {datasets.map(d => <FolderDatasetCard key={d.id} {...d} />)}
                </div>
              </div>

              {/* Episodes */}
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
                  <h3 className="font-display" style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>Individual episodes</h3>
                  <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>3 · double-click to edit</span>
                </div>
                <Panel padding={0} style={{ overflow: "hidden" }}>
                  {episodes.map((e, i) => <FolderEpisodeRow key={i} {...e} last={i === episodes.length - 1} />)}
                </Panel>
              </div>
            </section>

            {/* History drawer */}
            <aside style={{
              borderLeft: "1px solid var(--nm-border)",
              background: "var(--nm-panel-subtle)",
              display: "flex", flexDirection: "column",
              minHeight: 0,
            }}>
              <div style={{
                padding: "14px 14px 10px",
                borderBottom: "1px solid var(--nm-border)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <Icon.history size={14} style={{ color: "var(--nm-accent-b)" }} />
                <SectionHead eyebrow="Project · last 30 days" title="History" />
                <span style={{ flex: 1 }} />
                <button className="nm-btn nm-btn--sm" style={{ width: 24, height: 24, padding: 0, borderRadius: 6 }} title="Pin"><Icon.chevRight size={12} /></button>
              </div>
              <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--nm-border)", display: "flex", gap: 4, flexWrap: "wrap" }}>
                <Chip accent="a">All</Chip>
                <Chip>Imports</Chip>
                <Chip>Exports</Chip>
                <Chip>Flags</Chip>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "8px 4px" }}>
                {history.map((h, i) => <HistoryEntry key={i} {...h} />)}
              </div>
              <div style={{
                padding: 10, borderTop: "1px solid var(--nm-border)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>238 events</span>
                <span style={{ flex: 1 }} />
                <Btn size="sm" variant="solid">Open full Activity</Btn>
              </div>
            </aside>
          </main>
        </div>
      </div>
    </div>
  );
}

function TreeRow({ label, count, level, open, active, kind, accent }) {
  const isRoot = kind === "root";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "5px 10px",
      borderRadius: 7,
      marginLeft: level * 14,
      background: active ? "var(--nm-accent-a-tint)" : "transparent",
      color: active ? "var(--nm-accent-a)" : "var(--nm-text-dim)",
      cursor: "pointer",
      fontSize: 12.5,
      fontWeight: active || isRoot ? 600 : 500,
    }}>
      {!isRoot && (
        <Icon.chevRight size={11} style={{
          transform: open ? "rotate(90deg)" : "none",
          transition: "transform .1s",
          color: "var(--nm-text-faint)",
          flex: "none",
        }} />
      )}
      {isRoot ? <Icon.trophy size={13} style={{ color: "var(--nm-accent-a)" }} /> :
        open
          ? <Icon.folderOpen size={13} style={{ color: accent === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)" }} />
          : <Icon.folder size={13} style={{ color: "var(--nm-text-faint)" }} />
      }
      <span style={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>
      <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>{count}</span>
    </div>
  );
}

function FolderDatasetCard({ id, title, prov, a, ep, addedBy, on, workspace }) {
  const accent = a === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)";
  return (
    <div style={{
      display: "flex", gap: 10,
      padding: 10,
      border: "1px solid var(--nm-border)", borderRadius: 10,
      background: "var(--nm-panel)",
      cursor: "pointer",
    }}>
      <div className="nm-thumb" style={{ width: 56, height: 56, borderRadius: 7, flex: "none", "--accent": accent }}>
        <div className="nm-thumb__glow" />
        <div className="nm-thumb__icon"><Icon.box size={18} /></div>
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span className="font-mono" style={{
            fontSize: 9, padding: "1px 5px", borderRadius: 4,
            border: "1px solid var(--nm-border)",
            color: workspace ? "var(--nm-accent-b)" : "var(--nm-text-faint)",
            background: workspace ? "var(--nm-accent-b-tint)" : "var(--nm-panel-mono)",
          }}>{workspace ? "workspace" : prov}</span>
          <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>{ep} episodes</span>
        </div>
        <div className="font-display" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </div>
        <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
          added by {addedBy} · {on}
          <span style={{ flex: 1 }} />
          <button title="Show history for this dataset" style={{
            background: "transparent", border: "1px solid var(--nm-border)", borderRadius: 5,
            padding: "2px 4px", cursor: "pointer", color: "var(--nm-text-faint)",
          }}><Icon.history size={11} /></button>
        </div>
      </div>
    </div>
  );
}

function FolderEpisodeRow({ dataset, i, frames, dur, status, addedBy, on, last }) {
  const statusChip = status === "flagged" ? <Chip accent="a">flagged</Chip>
    : status === "annotated" ? <Chip accent="b">annotated</Chip> : <Chip>ok</Chip>;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "44px 80px 1fr 90px 80px 100px 30px",
      alignItems: "center",
      borderBottom: last ? "none" : "1px solid var(--nm-border)",
      padding: "8px 12px",
      fontSize: 12,
      cursor: "pointer",
    }}>
      <div className="nm-thumb" style={{ width: 36, height: 28, borderRadius: 5, "--accent": "var(--nm-accent-b)" }}>
        <div className="nm-thumb__glow" />
        <div className="nm-thumb__icon"><Icon.film size={12} /></div>
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11 }}>#{String(i).padStart(4, "0")}</div>
      <div style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        <span style={{ color: "var(--nm-text-dim)" }}>from </span>
        <span className="font-mono" style={{ fontSize: 11, color: "var(--nm-text)" }}>{dataset}</span>
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
        {frames.toLocaleString()} <span style={{ color: "var(--nm-text-faint)" }}>· {dur}</span>
      </div>
      <div>{statusChip}</div>
      <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>
        {addedBy} · {on}
      </div>
      <button title="Show history for this episode" style={{
        background: "transparent", border: "1px solid var(--nm-border)", borderRadius: 5,
        padding: "2px 4px", cursor: "pointer", color: "var(--nm-text-faint)",
        justifySelf: "end",
      }}><Icon.history size={11} /></button>
    </div>
  );
}

function HistoryEntry({ when, who, what, target, kind, here }) {
  const kindMap = {
    upload: { icon: Icon.upload,  color: "var(--nm-accent-b)" },
    add:    { icon: Icon.plus,    color: "var(--nm-accent-b)" },
    folder: { icon: Icon.folder,  color: "var(--nm-text-dim)" },
    flag:   { icon: Icon.flag,    color: "var(--nm-warn)" },
    export: { icon: Icon.download,color: "var(--nm-accent-a)" },
    create: { icon: Icon.trophy,  color: "var(--nm-accent-a)" },
  };
  const I = (kindMap[kind] || kindMap.add).icon;
  const color = (kindMap[kind] || kindMap.add).color;
  return (
    <div style={{
      display: "flex", gap: 10, padding: "8px 12px",
      borderRadius: 8,
      background: here ? "var(--nm-accent-b-tint)" : "transparent",
      margin: "0 4px 2px",
      position: "relative",
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: "50%",
        background: `color-mix(in srgb, ${color} 16%, transparent)`,
        color, display: "grid", placeItems: "center",
        flex: "none",
      }}>
        <I size={12} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 12, color: "var(--nm-text)", lineHeight: 1.3 }}>
          <span style={{ fontWeight: 600 }}>{who}</span>{" "}
          <span style={{ color: "var(--nm-text-dim)" }}>{what}</span>{" "}
          <span className="font-mono" style={{ fontSize: 11 }}>{target}</span>
        </div>
        <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)", marginTop: 2, letterSpacing: ".04em" }}>
          {when}
          {here && <span style={{ color: "var(--nm-accent-b)", marginLeft: 6 }}>· filtered to this folder</span>}
        </div>
      </div>
    </div>
  );
}

window.MyDataArtboard = MyDataArtboard;
