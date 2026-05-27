// Artboard 04 · v4 — Unified My Data with 4-tab strip.
// Imports + Exports + History fold into My Data as tabs (BRIEF §2).
// Right-rail History drawer is gone — History is its own full-width tab.
// Folder tree on the left stays across all 4 tabs as a soft scope filter.
//
// Exports five mountable presets (Files/Imports/Exports/History/HistoryFiltered)
// plus the master MyDataV4 component that's also tab-clickable when shown alone.

const { useState: useStateV4 } = React;

function MyDataV4({ initialTab = "files", filterEntity = null, activeFolder = "trial" }) {
  const [tab, setTab] = useStateV4(initialTab);
  const [entityFilter, setEntityFilter] = useStateV4(filterEntity);

  // Counts driving tab in-flight badges.
  const importCounts = { running: 1, queued: 1, failed: 1, done: 2 };
  const exportCounts = { running: 1, ready: 2, failed: 0 };
  const inflightImports = importCounts.running + importCounts.queued;
  const inflightExports = exportCounts.running;

  const tree = [
    { id: "_root", label: "WBCD 2026", count: 142, level: 0, open: true, kind: "root", active: activeFolder === "_root" },
    { id: "raw",   label: "Raw imports", count: 62, level: 1, open: true,  active: activeFolder === "raw" },
    { id: "raw-2025-11", label: "2025-11 · pilot", count: 18, level: 2, active: activeFolder === "raw-2025-11" },
    { id: "raw-2025-12", label: "2025-12 · gen-2", count: 44, level: 2, active: activeFolder === "raw-2025-12" },
    { id: "ref",   label: "Reference (LeRobot)", count: 30, level: 1, open: false, active: activeFolder === "ref" },
    { id: "trial", label: "Trial episodes", count: 24, level: 1, open: true, active: activeFolder === "trial" },
    { id: "trial-pp",   label: "pick-and-place", count: 16, level: 2, active: activeFolder === "trial-pp" },
    { id: "trial-pour", label: "pouring",        count: 8,  level: 2, active: activeFolder === "trial-pour" },
    { id: "out",   label: "For submission", count: 26, level: 1, accent: "a", active: activeFolder === "out" },
  ];
  const activeNode = tree.find(t => t.active) || tree.find(t => t.id === activeFolder) || tree[5];
  const folderLabel = activeNode?.label || "Trial episodes";
  const folderEyebrow = activeNode?.kind === "root"
    ? "Project · all entries"
    : `Folder · 2 sub-folders · ${activeNode?.count ?? 24} entries`;

  const tabs = [
    { id: "wbcd",    name: "WBCD 2026",          accent: "a" },
    { id: "pickplc", name: "Pickplace v2 prep",  accent: "b" },
    { id: "manip",   name: "Manipulation Bench", accent: "a" },
  ];
  const recent = [{ slug: "kitchen-mar", name: "Kitchen benchmark · march", lastSeen: "4d ago", accent: "a" }];

  const label = `04 My Data v4 · ${tab}${entityFilter ? " · filtered" : ""}`;

  return (
    <div className="nm" data-screen-label={label}>
      <TabStrip tabs={tabs} activeId="wbcd" recent={recent} />
      <div style={{ display: "flex", height: "calc(100% - 38px)" }}>
        <Sidebar active="mydata" project="WBCD 2026" role="owner" />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Topbar
            crumbs={[
              "WBCD 2026",
              "My Data",
              tab === "files" ? folderLabel : tab.charAt(0).toUpperCase() + tab.slice(1),
            ]}
            env="dev"
          />

          <main style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "240px 1fr" }}>
            <FolderTreeColumn tree={tree} />

            <section style={{ minWidth: 0, display: "flex", flexDirection: "column" }}>
              <MyDataTabs
                tab={tab}
                onChange={setTab}
                badges={{
                  imports: inflightImports || null,
                  exports: inflightExports || null,
                }}
              />

              <FolderHeader
                tab={tab}
                eyebrow={folderEyebrow}
                title={tab === "files" ? folderLabel : tabTitle(tab)}
                activeFolder={activeFolder}
              />

              <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "8px 20px 20px" }}>
                {tab === "files"   && <FilesTabBody />}
                {tab === "imports" && <ImportsTabBody folder={folderLabel} />}
                {tab === "exports" && <ExportsTabBody folder={folderLabel} />}
                {tab === "history" && (
                  <HistoryTabBody
                    folder={folderLabel}
                    entityFilter={entityFilter}
                    onClearFilter={() => setEntityFilter(null)}
                  />
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function tabTitle(tab) {
  return { imports: "Imports", exports: "Exports", history: "History" }[tab];
}

// ── Tab strip ──────────────────────────────────────────────────────────
function MyDataTabs({ tab, onChange, badges = {} }) {
  const items = [
    { id: "files",   label: "Files" },
    { id: "imports", label: "Imports" },
    { id: "exports", label: "Exports" },
    { id: "history", label: "History" },
  ];
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 2,
      height: 38, padding: "0 16px",
      borderBottom: "1px solid var(--nm-border)",
      background: "var(--nm-panel-subtle)",
    }}>
      {items.map(it => {
        const active = tab === it.id;
        const badge = badges[it.id];
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onChange?.(it.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              height: active ? 34 : 30,
              marginBottom: active ? -1 : 0,
              padding: "0 14px",
              borderRadius: "8px 8px 0 0",
              border: active ? "1px solid var(--nm-border)" : "1px solid transparent",
              borderBottomColor: active ? "transparent" : undefined,
              background: active ? "var(--nm-panel-strong)" : "transparent",
              color: active ? "var(--nm-text)" : "var(--nm-text-dim)",
              fontWeight: active ? 600 : 500,
              fontSize: 12.5,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: active ? "inset 0 -2px 0 var(--nm-accent-a)" : "none",
              transition: "color .1s, background .1s",
            }}
          >
            <span>{it.label}</span>
            {badge ? (
              <span style={{
                display: "inline-grid", placeItems: "center",
                minWidth: 18, height: 18, padding: "0 5px",
                borderRadius: 999,
                background: "var(--nm-accent-a)", color: "#fff8ec",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, fontWeight: 600,
                lineHeight: 1,
              }}>{badge}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

// ── Folder tree column ─────────────────────────────────────────────────
function FolderTreeColumn({ tree }) {
  return (
    <aside style={{
      borderRight: "1px solid var(--nm-border)",
      background: "var(--nm-panel)",
      display: "flex", flexDirection: "column",
      minHeight: 0,
    }}>
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid var(--nm-border)" }}>
        <SectionHead eyebrow="Project file manager" title="My Data" />
      </div>
      <div style={{ padding: "10px 10px 8px", display: "flex", gap: 6 }}>
        <Btn size="sm" variant="primary" accent="a" icon={<Icon.plus size={12} />}>New folder</Btn>
        <Btn size="sm" variant="solid" icon={<Icon.upload size={12} />}>Import…</Btn>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px 12px" }}>
        {tree.map(node => <TreeRowV4 key={node.id} {...node} />)}
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
  );
}

function TreeRowV4({ label, count, level, open, active, kind, accent }) {
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

// ── Per-tab header row ─────────────────────────────────────────────────
function FolderHeader({ tab, eyebrow, title, activeFolder }) {
  const showSoftFilter = activeFolder !== "_root";

  const actions = {
    files: (
      <>
        <div className="nm-input" style={{ padding: "5px 10px", borderRadius: 999, minWidth: 200, color: "var(--nm-text-faint)" }}>
          <Icon.search size={12} />
          <input placeholder="Search in folder" />
        </div>
        <Btn size="sm" variant="solid" icon={<Icon.filter size={12} />}>Filter</Btn>
        <Btn size="sm" variant="solid" icon={<Icon.move size={12} />}>Move</Btn>
        <Btn size="sm" variant="primary" icon={<Icon.plus size={12} />}>Add from explorer</Btn>
      </>
    ),
    imports: (
      <>
        <div className="nm-input" style={{ padding: "5px 10px", borderRadius: 999, minWidth: 200, color: "var(--nm-text-faint)" }}>
          <Icon.search size={12} />
          <input placeholder="Search imports" />
        </div>
      </>
    ),
    exports: (
      <>
        <div className="nm-input" style={{ padding: "5px 10px", borderRadius: 999, minWidth: 200, color: "var(--nm-text-faint)" }}>
          <Icon.search size={12} />
          <input placeholder="Search exports" />
        </div>
      </>
    ),
    history: (
      <>
        <div className="nm-input" style={{ padding: "5px 10px", borderRadius: 999, minWidth: 200, color: "var(--nm-text-faint)" }}>
          <Icon.search size={12} />
          <input placeholder="Search events" />
        </div>
        <Btn size="sm" variant="solid" icon={<Icon.filter size={12} />}>Date range</Btn>
      </>
    ),
  };

  return (
    <div style={{
      padding: "14px 20px 10px",
      display: "flex", alignItems: "center", gap: 10,
      borderBottom: "1px solid var(--nm-border)",
      background: "var(--nm-panel-strong)",
    }}>
      <div style={{ minWidth: 0 }}>
        <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".12em" }}>
          {eyebrow}
        </div>
        <h2 className="font-display" style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {title}
        </h2>
      </div>
      {showSoftFilter && (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "3px 8px 3px 6px",
          borderRadius: 999,
          background: "var(--nm-accent-b-tint)",
          border: "1px solid color-mix(in srgb, var(--nm-accent-b) 35%, transparent)",
          color: "var(--nm-accent-b)",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: ".06em",
        }}>
          <Icon.folder size={11} /> filtered to {title}
        </span>
      )}
      <span style={{ flex: 1 }} />
      {actions[tab]}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FILES TAB · same as v3 minus the right rail
// ═══════════════════════════════════════════════════════════════════════
function FilesTabBody() {
  const datasets = [
    { id: "svla",  title: "lerobot/svla_so100_pickplace", prov: "lerobot", a: "a", ep: 42, addedBy: "maria", on: "May 24" },
    { id: "aloha", title: "lerobot/aloha_static_coffee",  prov: "lerobot", a: "b", ep: 96, addedBy: "ben",   on: "May 22" },
    { id: "myset", title: "wbcd · trial-set-a · workspace", prov: "workspace", a: "a", ep: 14, addedBy: "you", on: "today", workspace: true },
  ];
  const episodes = [
    { dataset: "lerobot/xarm_lift_medium", i: 1,  frames: 2104, dur: "1:10", status: "annotated", addedBy: "ben", on: "May 26" },
    { dataset: "lerobot/xarm_lift_medium", i: 4,  frames: 1985, dur: "1:06", status: "ok",        addedBy: "ben", on: "May 26" },
    { dataset: "wbcd · trial-set-a",        i: 12, frames: 2210, dur: "1:13", status: "flagged",   addedBy: "you", on: "today" },
  ];

  return (
    <>
      {/* Sub-folders */}
      <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".12em", margin: "12px 0 6px" }}>
        Sub-folders
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8, marginBottom: 18 }}>
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

      {/* Datasets */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <h3 className="font-display" style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>Datasets in this folder</h3>
        <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>{datasets.length}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 10, marginBottom: 18 }}>
        {datasets.map(d => <FilesDatasetCard key={d.id} {...d} />)}
      </div>

      {/* Episodes */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <h3 className="font-display" style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>Individual episodes</h3>
        <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>{episodes.length} · double-click to edit</span>
      </div>
      <Panel padding={0} style={{ overflow: "hidden" }}>
        {episodes.map((e, i) => <FilesEpisodeRow key={i} {...e} last={i === episodes.length - 1} />)}
      </Panel>
    </>
  );
}

function FilesDatasetCard({ title, prov, a, ep, addedBy, on, workspace }) {
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

function FilesEpisodeRow({ dataset, i, frames, dur, status, addedBy, on, last }) {
  const statusChip = status === "flagged" ? <Chip accent="a">flagged</Chip>
    : status === "annotated" ? <Chip accent="b">annotated</Chip> : <Chip>ok</Chip>;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "44px 80px 1fr 110px 90px 110px 30px",
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
      <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>{addedBy} · {on}</div>
      <button title="Show history for this episode" style={{
        background: "transparent", border: "1px solid var(--nm-border)", borderRadius: 5,
        padding: "2px 4px", cursor: "pointer", color: "var(--nm-text-faint)",
        justifySelf: "end",
      }}><Icon.history size={11} /></button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// IMPORTS TAB
// ═══════════════════════════════════════════════════════════════════════
function ImportsTabBody({ folder }) {
  const [activeSource, setActiveSource] = useStateV4("local");
  const sources = [
    { id: "local", icon: Icon.upload,   label: "Upload file",     desc: "Drop or browse an HDF5 / tar / parquet file from disk" },
    { id: "s3",    icon: Icon.box,      label: "S3 prefix",       desc: "Point to s3://bucket/prefix — bucket must have read perms" },
    { id: "hf",    icon: Icon.database, label: "Hugging Face",    desc: "Pull a public LeRobot dataset by repo id" },
    { id: "sftp",  icon: Icon.workflow, label: "SFTP server",     desc: "Bulk ingest from a contestant SFTP endpoint with key auth" },
  ];
  const jobs = [
    { source: "Local upload",      kind: "local", target: "trial-set-a.hdf5",          status: "running", progress: "12 / 50 ep", actor: "you",   when: "12 min ago" },
    { source: "Hugging Face",      kind: "hf",    target: "lerobot/xarm_lift_medium",  status: "queued",  progress: "—",          actor: "ben",   when: "18 min ago" },
    { source: "S3 prefix",         kind: "s3",    target: "s3://wbcd/run-2025-12/",    status: "failed",  progress: "0 / 32 ep",  actor: "maria", when: "1 h ago"    },
    { source: "Hugging Face",      kind: "hf",    target: "lerobot/svla_so100_pickplace", status: "done", progress: "42 / 42 ep", actor: "ben",   when: "yesterday"  },
    { source: "SFTP server",       kind: "sftp",  target: "contestant-data-2026.tar",  status: "done",    progress: "120 / 120 ep", actor: "maria", when: "May 22" },
  ];
  return (
    <>
      <PickerPanel
        eyebrow="Add"
        title="Pick an ingestion source"
        active={activeSource}
        items={sources}
        onPick={setActiveSource}
        badge={0}
        dropzone={<ImportDropzone source={activeSource} folder={folder} />}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, marginBottom: 4 }}>
        <SectionHead eyebrow="Recent imports" title="Job queue" />
        <span style={{ flex: 1 }} />
      </div>
      <FilterChips
        items={[
          ["All",    11, true],
          ["Running", 1],
          ["Queued",  1],
          ["Failed",  1],
          ["Done (30d)", 8],
        ]}
        meta={`destination ${folder}`}
      />
      <Panel padding={0} style={{ overflow: "hidden", marginTop: 8 }}>
        <ImportsHeaderRow />
        {jobs.map((j, i) => <ImportRow key={i} {...j} last={i === jobs.length - 1} hovered={i === 0} />)}
      </Panel>
    </>
  );
}

// ── Reusable picker panel (4 tile grid + active dropzone below) ────────
function PickerPanel({ eyebrow, title, items, active, onPick, dropzone, badge }) {
  return (
    <div style={{
      marginTop: 14,
      border: "1px solid var(--nm-border)",
      borderRadius: 14,
      background: "var(--nm-panel)",
      boxShadow: "var(--nm-shadow-soft)",
      overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "flex-end", gap: 10,
        padding: "14px 18px 12px",
        background: "linear-gradient(135deg, var(--nm-accent-a-tint) 0%, transparent 55%)",
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".16em" }}>
            {eyebrow}
          </div>
          <div className="font-display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", marginTop: 2 }}>
            {title}
          </div>
        </div>
        <Chip>{badge ?? 0} active</Chip>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
        padding: "6px 18px 12px",
      }}>
        {items.map(it => {
          const isActive = it.id === active;
          const I = it.icon;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onPick?.(it.id)}
              style={{
                textAlign: "left",
                cursor: "pointer",
                padding: "12px 14px",
                border: isActive
                  ? "1.5px solid var(--nm-accent-a)"
                  : "1px solid var(--nm-border)",
                borderRadius: 10,
                background: isActive ? "var(--nm-accent-a-tint)" : "var(--nm-panel-strong)",
                position: "relative",
                fontFamily: "inherit",
                color: "inherit",
                display: "flex", flexDirection: "column", gap: 6,
                transition: "border-color .12s, background .12s",
              }}
            >
              {isActive && (
                <span style={{
                  position: "absolute", top: 10, right: 10,
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--nm-accent-a)",
                }} />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <I size={15} style={{ color: isActive ? "var(--nm-accent-a)" : "var(--nm-text-dim)" }} />
                <span className="font-display" style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: "-0.005em" }}>
                  {it.label}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--nm-text-dim)", lineHeight: 1.45 }}>
                {it.desc}
              </div>
            </button>
          );
        })}
      </div>

      {dropzone && (
        <div style={{ padding: "0 18px 16px" }}>{dropzone}</div>
      )}
    </div>
  );
}

function ImportDropzone({ source, folder }) {
  if (source === "local") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "18px 22px",
        borderRadius: 10,
        border: "1.5px dashed var(--nm-border-strong)",
        background: "var(--nm-panel-mono)",
      }}>
        <Icon.upload size={20} style={{ color: "var(--nm-text-faint)" }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Drop an HDF5 / tar / parquet file here</div>
          <div className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-faint)", marginTop: 2 }}>
            destination: {folder} · max 12 GB · multi-file supported
          </div>
        </div>
        <Btn variant="primary" icon={<Icon.plus size={12} />}>Browse files</Btn>
      </div>
    );
  }
  if (source === "s3") {
    return (
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 200px 120px", gap: 8,
        padding: 14, borderRadius: 10, background: "var(--nm-panel-mono)",
        border: "1px solid var(--nm-border)", alignItems: "center",
      }}>
        <div className="nm-input" style={{ padding: "6px 10px", borderRadius: 8 }}>
          <Icon.box size={12} />
          <input placeholder="s3://bucket/prefix/" />
        </div>
        <div className="nm-input" style={{ padding: "6px 10px", borderRadius: 8 }}>
          <input placeholder="region (us-east-1)" />
        </div>
        <Btn variant="primary" icon={<Icon.arrowRight size={12} />}>Validate</Btn>
      </div>
    );
  }
  if (source === "hf") {
    return (
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 120px", gap: 8,
        padding: 14, borderRadius: 10, background: "var(--nm-panel-mono)",
        border: "1px solid var(--nm-border)", alignItems: "center",
      }}>
        <div className="nm-input" style={{ padding: "6px 10px", borderRadius: 8 }}>
          <Icon.database size={12} />
          <input placeholder="lerobot/svla_so100_pickplace" />
        </div>
        <Btn variant="primary" icon={<Icon.arrowRight size={12} />}>Pull</Btn>
      </div>
    );
  }
  // sftp
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr 140px 120px", gap: 8,
      padding: 14, borderRadius: 10, background: "var(--nm-panel-mono)",
      border: "1px solid var(--nm-border)", alignItems: "center",
    }}>
      <div className="nm-input" style={{ padding: "6px 10px", borderRadius: 8 }}>
        <Icon.workflow size={12} />
        <input placeholder="sftp://host/path" />
      </div>
      <div className="nm-input" style={{ padding: "6px 10px", borderRadius: 8 }}>
        <input placeholder="username" />
      </div>
      <Btn variant="solid" icon={<Icon.upload size={12} />}>Upload key</Btn>
      <Btn variant="primary" icon={<Icon.arrowRight size={12} />}>Connect</Btn>
    </div>
  );
}

function ImportsHeaderRow() {
  const cell = {
    padding: "8px 12px",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5, color: "var(--nm-text-faint)",
    textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600,
    borderBottom: "1px solid var(--nm-border)",
    background: "var(--nm-panel-strong)",
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 130px 140px 130px 40px" }}>
      <div style={cell} />
      <div style={cell}>Source · destination</div>
      <div style={cell}>Status</div>
      <div style={cell}>Progress</div>
      <div style={cell}>Actor · when</div>
      <div style={cell} />
    </div>
  );
}

function ImportRow({ source, kind, target, status, progress, actor, when, last, hovered }) {
  const kindIcons = { local: Icon.upload, hf: Icon.box, s3: Icon.box, sftp: Icon.workflow, gdrive: Icon.box };
  const KI = kindIcons[kind] || Icon.upload;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "44px 1fr 130px 140px 130px 40px",
      alignItems: "center",
      borderBottom: last ? "none" : "1px solid var(--nm-border)",
      padding: "10px 8px",
      background: hovered ? "var(--nm-accent-a-tint)" : "transparent",
      position: "relative",
    }}>
      <div style={{ display: "grid", placeItems: "center" }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: "var(--nm-accent-b-tint)", color: "var(--nm-accent-b)",
          display: "grid", placeItems: "center",
        }}><KI size={14} /></div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{source}</div>
        <div className="font-mono" style={{ fontSize: 11, color: "var(--nm-text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          → {target}
        </div>
      </div>
      <div><StatusPill status={status} /></div>
      <div className="font-mono" style={{ fontSize: 11, color: "var(--nm-text-dim)" }}>
        {status === "running" ? <ProgressBar label={progress} /> : progress}
      </div>
      <div className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-faint)" }}>
        {actor} · {when}
      </div>
      <div style={{ position: "relative" }}>
        <button title="More" style={{
          background: "transparent", border: "1px solid var(--nm-border)", borderRadius: 6,
          width: 26, height: 26, cursor: "pointer", color: "var(--nm-text-faint)",
          display: "grid", placeItems: "center",
        }}><Icon.more size={12} /></button>
        {hovered && <RowMenu options={["Retry", "Cancel", "View payload", "Open destination folder"]} />}
      </div>
    </div>
  );
}

function ProgressBar({ label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ height: 4, borderRadius: 2, background: "var(--nm-border)", overflow: "hidden" }}>
        <div style={{ width: "24%", height: "100%", background: "var(--nm-accent-b)" }} />
      </div>
      <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-dim)" }}>{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// EXPORTS TAB
// ═══════════════════════════════════════════════════════════════════════
function ExportsTabBody({ folder }) {
  const [activeFmt, setActiveFmt] = useStateV4("lerobot");
  const formats = [
    { id: "lerobot",    icon: Icon.database, label: "LeRobot",          desc: "Full re-export in the lerobot dataset format — ready for HF Hub" },
    { id: "annotation", icon: Icon.tag,      label: "Annotation JSONL", desc: "Annotations only — small, fast, ideal for label review" },
    { id: "snapshot",   icon: Icon.download, label: "Snapshot",         desc: "Verbatim copy of the current folder, no transforms applied" },
    { id: "recipe",     icon: Icon.workflow, label: "Recipe",           desc: "Apply a saved transform pipeline, then export the result" },
  ];
  const versions = [
    { name: "derived-A · resample-30fps",         slug: "derived-a/v0.3.0",  status: "ready",    size: "412 MB", actor: "maria", when: "2 h ago",  hovered: true },
    { name: "submission-final · trim-edges",      slug: "submission/v0.1.0", status: "running",  size: "—",      actor: "you",   when: "12 min ago" },
    { name: "annotation-pass · annotation_jsonl", slug: "annotation/v1.2.0", status: "ready",    size: "8.4 MB", actor: "ben",   when: "yesterday" },
    { name: "baseline · lerobot",                 slug: "baseline/v0.1.0",   status: "released", size: "1.2 GB", actor: "maria", when: "May 22" },
  ];
  return (
    <>
      <PickerPanel
        eyebrow="New export"
        title="Pick an output format"
        active={activeFmt}
        items={formats}
        onPick={setActiveFmt}
        badge={1}
        dropzone={<ExportRecipeBar format={activeFmt} folder={folder} />}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, marginBottom: 4 }}>
        <SectionHead eyebrow="Recent exports" title="Derived versions" />
        <span style={{ flex: 1 }} />
      </div>
      <FilterChips
        items={[
          ["All",      11, true],
          ["Recent",   4],
          ["Released", 6],
        ]}
        meta={`source ${folder}`}
      />
      <Panel padding={0} style={{ overflow: "hidden", marginTop: 8 }}>
        <ExportsHeaderRow />
        {versions.map((v, i) => <ExportRow key={i} {...v} last={i === versions.length - 1} />)}
      </Panel>
    </>
  );
}

function ExportRecipeBar({ format, folder }) {
  const recipeHints = {
    lerobot:    "Resample · trim · mask cameras · strip uncalibrated",
    annotation: "Pick annotation set(s) · jsonl per episode",
    snapshot:   "No transforms · mirrors folder structure 1:1",
    recipe:     "Apply saved recipe · chain of transforms",
  };
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 240px 130px 140px", gap: 8,
      padding: 14, borderRadius: 10, background: "var(--nm-panel-mono)",
      border: "1px solid var(--nm-border)", alignItems: "center",
    }}>
      <div className="nm-input" style={{ padding: "6px 10px", borderRadius: 8 }}>
        <Icon.pencil size={12} />
        <input placeholder="version name" defaultValue={`${format}-from-${folder.toLowerCase().replace(/\s+/g, "-")}`} />
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 10px", borderRadius: 8,
        border: "1px solid var(--nm-border)",
        background: "var(--nm-panel)",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
        color: "var(--nm-text-dim)",
        overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
      }} title={recipeHints[format]}>
        <Icon.workflow size={12} /> {recipeHints[format]}
      </div>
      <Btn variant="solid" icon={<Icon.filter size={12} />}>Configure</Btn>
      <Btn variant="primary" icon={<Icon.arrowRight size={12} />}>Queue export</Btn>
    </div>
  );
}

function ExportsHeaderRow() {
  const cell = {
    padding: "8px 12px",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5, color: "var(--nm-text-faint)",
    textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600,
    borderBottom: "1px solid var(--nm-border)",
    background: "var(--nm-panel-strong)",
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 130px 100px 130px 40px" }}>
      <div style={cell} />
      <div style={cell}>Version</div>
      <div style={cell}>Status</div>
      <div style={cell}>Size</div>
      <div style={cell}>Actor · when</div>
      <div style={cell} />
    </div>
  );
}

function ExportRow({ name, slug, status, size, actor, when, last, hovered }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "44px 1fr 130px 100px 130px 40px",
      alignItems: "center",
      borderBottom: last ? "none" : "1px solid var(--nm-border)",
      padding: "10px 8px",
      background: hovered ? "var(--nm-accent-a-tint)" : "transparent",
      position: "relative",
    }}>
      <div style={{ display: "grid", placeItems: "center" }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: "var(--nm-accent-a-tint)", color: "var(--nm-accent-a)",
          display: "grid", placeItems: "center",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700,
        }}>v</div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{name}</div>
        <div className="font-mono" style={{ fontSize: 11, color: "var(--nm-text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {slug}
        </div>
      </div>
      <div><StatusPill status={status} /></div>
      <div className="font-mono" style={{ fontSize: 11, color: "var(--nm-text)" }}>{size}</div>
      <div className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-faint)" }}>
        {actor} · {when}
      </div>
      <div style={{ position: "relative" }}>
        <button title="More" style={{
          background: "transparent", border: "1px solid var(--nm-border)", borderRadius: 6,
          width: 26, height: 26, cursor: "pointer", color: "var(--nm-text-faint)",
          display: "grid", placeItems: "center",
        }}><Icon.more size={12} /></button>
        {hovered && <RowMenu options={["Download artifacts", "Copy share link", "Rebuild", "Archive"]} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HISTORY TAB
// ═══════════════════════════════════════════════════════════════════════
function HistoryTabBody({ folder, entityFilter, onClearFilter }) {
  let events = [
    { who: "you",   verb: "imported",       obj: "trial-set-a.hdf5",           when: "12 min ago",  src: "external",  kind: "upload",        entityRef: null },
    { who: "ben",   verb: "added",          obj: "lerobot/xarm_lift_medium #1, #4", when: "32 min ago", src: "explorer",  kind: "entry_add",  entityRef: "lerobot/xarm_lift_medium #4" },
    { who: "maria", verb: "exported v0.3 of", obj: "submission/derived-A",      when: "2 h ago",     src: "exports",   kind: "export",        entityRef: null },
    { who: "maria", verb: "created folder", obj: "pick-and-place",              when: "2 h ago",     src: "trial",     kind: "folder_create", entityRef: null },
    { who: "ben",   verb: "flagged episode", obj: "trial-set-a #12",            when: "yesterday",   src: "trial",     kind: "flag",          entityRef: "trial-set-a #12" },
    { who: "ben",   verb: "added dataset",  obj: "lerobot/aloha_static_coffee", when: "May 22",      src: "trial",     kind: "entry_add",     entityRef: null },
    { who: "maria", verb: "ran transform",  obj: "resample-30fps on 8 ep",      when: "May 22",      src: "trial",     kind: "transform",     entityRef: null },
    { who: "lin",   verb: "removed",        obj: "aloha #07 from Trial",        when: "May 21",      src: "trial",     kind: "entry_remove",  entityRef: null },
    { who: "ben",   verb: "joined as",      obj: "editor",                      when: "May 18",      src: "members",   kind: "team",          entityRef: null },
    { who: "maria", verb: "released",       obj: "derived-A v0.2.0",            when: "May 17",      src: "exports",   kind: "release",       entityRef: null },
    { who: "maria", verb: "deleted folder", obj: "scratch",                     when: "May 15",      src: "_root",     kind: "folder_delete", entityRef: null },
    { who: "maria", verb: "created project", obj: "WBCD 2026",                  when: "May 12",      src: "_root",     kind: "create",        entityRef: null },
  ];

  if (entityFilter) {
    events = events.filter(e => (e.entityRef || e.obj).includes(entityFilter));
  }

  return (
    <>
      <FilterChips
        items={[
          ["All",     events.length, true],
          ["Imports", 1],
          ["Exports", 2],
          ["Flags",   1],
          ["Folder",  2],
        ]}
        meta={folder !== "WBCD 2026" ? `folder ${folder}` : null}
      />

      {entityFilter && (
        <div style={{
          marginTop: 10,
          padding: "10px 14px",
          borderRadius: 10,
          background: "var(--nm-accent-b-tint)",
          border: "1px solid color-mix(in srgb, var(--nm-accent-b) 35%, transparent)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Icon.history size={14} style={{ color: "var(--nm-accent-b)" }} />
          <div style={{ flex: 1 }}>
            <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-accent-b)", textTransform: "uppercase", letterSpacing: ".12em" }}>
              Filtered to entity
            </div>
            <div className="font-mono" style={{ fontSize: 12, color: "var(--nm-text)" }}>
              {entityFilter}
            </div>
          </div>
          <Btn size="sm" variant="solid" icon={<Icon.x size={11} />} onClick={onClearFilter}>Clear filter</Btn>
        </div>
      )}

      <Panel padding={0} style={{ overflow: "hidden", marginTop: 10 }}>
        <HistoryHeaderRow />
        {events.map((e, i) => <HistoryEventRow key={i} {...e} last={i === events.length - 1} hovered={i === 1 && !entityFilter} />)}
      </Panel>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 14 }}>
        <Btn size="sm" variant="solid">Load 50 more</Btn>
      </div>
    </>
  );
}

function HistoryHeaderRow() {
  const cell = {
    padding: "8px 12px",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9.5, color: "var(--nm-text-faint)",
    textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600,
    borderBottom: "1px solid var(--nm-border)",
    background: "var(--nm-panel-strong)",
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "44px 220px 1fr 130px 100px 40px" }}>
      <div style={cell} />
      <div style={cell}>Actor · verb</div>
      <div style={cell}>Object</div>
      <div style={cell}>When</div>
      <div style={cell}>Source</div>
      <div style={cell} />
    </div>
  );
}

const HISTORY_KIND_COLORS = {
  upload:        "var(--nm-accent-b)",
  entry_add:     "var(--nm-accent-b)",
  entry_remove:  "var(--nm-text-dim)",
  folder_create: "var(--nm-text-dim)",
  folder_delete: "var(--nm-warn)",
  flag:          "var(--nm-warn)",
  transform:     "var(--nm-accent-a)",
  export:        "var(--nm-accent-a)",
  release:       "var(--nm-accent-a)",
  team:          "var(--nm-text-dim)",
  create:        "var(--nm-accent-a)",
};

const HISTORY_KIND_ICONS = {
  upload:        "upload",
  entry_add:     "plus",
  entry_remove:  "trash",
  folder_create: "folder",
  folder_delete: "trash",
  flag:          "flag",
  transform:     "workflow",
  export:        "download",
  release:       "arrowRight",
  team:          "users",
  create:        "trophy",
};

function HistoryEventRow({ who, verb, obj, when, src, kind, last, hovered, entityRef }) {
  const color = HISTORY_KIND_COLORS[kind] || "var(--nm-text-dim)";
  const I = Icon[HISTORY_KIND_ICONS[kind] || "plus"];
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "44px 220px 1fr 130px 100px 40px",
      alignItems: "center",
      borderBottom: last ? "none" : "1px solid var(--nm-border)",
      padding: "9px 8px",
      background: hovered ? "var(--nm-accent-a-tint)" : "transparent",
      fontSize: 12,
    }}>
      <div style={{ display: "grid", placeItems: "center" }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: `color-mix(in srgb, ${color} 16%, transparent)`,
          color, display: "grid", placeItems: "center",
        }}>
          <I size={12} />
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5 }}>
          <b>{who}</b> <span style={{ color: "var(--nm-text-dim)" }}>{verb}</span>
        </div>
        <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".06em" }}>
          {kind.replace("_", " ")}
        </div>
      </div>
      <div className="font-mono" style={{ fontSize: 11, color: "var(--nm-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {obj}
      </div>
      <div className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-faint)" }}>{when}</div>
      <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-dim)" }}>{src}</div>
      <div style={{ position: "relative" }}>
        <button title="More" style={{
          background: "transparent", border: "1px solid var(--nm-border)", borderRadius: 6,
          width: 26, height: 26, cursor: "pointer", color: "var(--nm-text-faint)",
          display: "grid", placeItems: "center",
        }}><Icon.more size={12} /></button>
        {hovered && <RowMenu options={["Filter to this entity", "Jump to entry", "Copy link"]} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Shared bits
// ═══════════════════════════════════════════════════════════════════════
function FilterChips({ items, meta }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      paddingTop: 12, paddingBottom: 4,
      flexWrap: "wrap",
    }}>
      {items.map(([label, count, active]) => (
        <Chip key={label} accent={active ? "a" : undefined}>
          {label} <span style={{ opacity: active ? 1 : 0.6 }}>{count}</span>
        </Chip>
      ))}
      <span style={{ flex: 1 }} />
      {meta && (
        <span className="font-mono" style={{
          fontSize: 10, color: "var(--nm-text-faint)",
          textTransform: "uppercase", letterSpacing: ".1em",
        }}>
          {meta}
        </span>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const palette = {
    running:  { bg: "var(--nm-accent-b-tint)", color: "var(--nm-accent-b)", border: "color-mix(in srgb, var(--nm-accent-b) 45%, transparent)" },
    queued:   { bg: "var(--nm-panel-mono)",    color: "var(--nm-text-dim)", border: "var(--nm-border)" },
    done:     { bg: "var(--nm-accent-a-tint)", color: "var(--nm-accent-a)", border: "color-mix(in srgb, var(--nm-accent-a) 45%, transparent)" },
    failed:   { bg: "color-mix(in srgb, var(--nm-warn) 14%, transparent)", color: "var(--nm-warn)", border: "color-mix(in srgb, var(--nm-warn) 45%, transparent)" },
    ready:    { bg: "var(--nm-accent-a-tint)", color: "var(--nm-accent-a)", border: "color-mix(in srgb, var(--nm-accent-a) 45%, transparent)" },
    released: { bg: "var(--nm-accent-b-tint)", color: "var(--nm-accent-b)", border: "color-mix(in srgb, var(--nm-accent-b) 45%, transparent)" },
  }[status] || { bg: "var(--nm-panel-mono)", color: "var(--nm-text-dim)", border: "var(--nm-border)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 8px", borderRadius: 999,
      border: `1px solid ${palette.border}`,
      background: palette.bg, color: palette.color,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 10.5, fontWeight: 600,
      textTransform: "lowercase", letterSpacing: ".02em",
    }}>
      {status === "running" && <span style={{ width: 6, height: 6, borderRadius: "50%", background: palette.color, animation: "pulse 1.4s ease-in-out infinite" }} />}
      {status}
    </span>
  );
}

function RowMenu({ options }) {
  return (
    <div style={{
      position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 5,
      minWidth: 200,
      background: "var(--nm-panel-strong)",
      border: "1px solid var(--nm-border-strong)",
      borderRadius: 10,
      boxShadow: "var(--nm-shadow-strong)",
      padding: 4,
    }}>
      {options.map(opt => (
        <div key={opt} style={{
          padding: "7px 10px", borderRadius: 6,
          fontSize: 12, color: "var(--nm-text)",
          cursor: "pointer",
          fontFamily: "inherit",
        }}>
          {opt}
        </div>
      ))}
    </div>
  );
}

// ── Preset exports for design canvas ──────────────────────────────────
window.MyDataV4              = MyDataV4;
window.MyDataV4Files         = () => <MyDataV4 initialTab="files"   activeFolder="trial" />;
window.MyDataV4Imports       = () => <MyDataV4 initialTab="imports" activeFolder="trial" />;
window.MyDataV4Exports       = () => <MyDataV4 initialTab="exports" activeFolder="trial" />;
window.MyDataV4History       = () => <MyDataV4 initialTab="history" activeFolder="_root" />;
window.MyDataV4HistoryFilter = () => <MyDataV4 initialTab="history" activeFolder="_root" filterEntity="lerobot/xarm_lift_medium #4" />;
