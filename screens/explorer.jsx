// Artboard 3: Dataset Explorer with multi-select toolbar active.
// V1 spec (per DECISIONS.md B.3): no inline expansion. Episode multi-select
// happens in the existing EpisodeInspector right rail.
//
// State shown: 3 datasets selected (catalog cards) + 2 episodes selected (in
// the right rail for lerobot/xarm_lift_medium). Floating toolbar pinned bottom.
// "Tag" button removed (DECISIONS.md A.§10.3).

function ExplorerArtboard() {
  const cards = [
    { id: "svla",  title: "lerobot/svla_so100_pickplace", prov: "lerobot", a: "a", dl: "12.4k", li: "284", up: "2d ago", ep: 42, selected: true },
    { id: "aloha", title: "lerobot/aloha_static_coffee",  prov: "lerobot", a: "b", dl: "8.9k",  li: "201", up: "1w ago", ep: 96, selected: true },
    { id: "pusht", title: "lerobot/pusht",                prov: "lerobot", a: "a", dl: "30.1k", li: "612", up: "3w ago", ep: 30, selected: false },
    { id: "xarm",  title: "lerobot/xarm_lift_medium",     prov: "lerobot", a: "b", dl: "4.7k",  li: "118", up: "5d ago", ep: 64, selected: false, focused: true },
  ];

  // Episodes shown in the right rail for the focused dataset (xarm_lift_medium)
  const railEpisodes = [
    { i: 0, frames: 1840, dur: "1:01", status: "ok",        cams: 3, fav: false, selected: false },
    { i: 1, frames: 2104, dur: "1:10", status: "ok",        cams: 3, fav: true,  selected: true  },
    { i: 2, frames: 1622, dur: "0:54", status: "flagged",   cams: 3, fav: false, selected: false },
    { i: 3, frames: 1798, dur: "1:00", status: "annotated", cams: 3, fav: false, selected: false },
    { i: 4, frames: 1985, dur: "1:06", status: "ok",        cams: 3, fav: false, selected: true  },
    { i: 5, frames: 1750, dur: "0:58", status: "ok",        cams: 3, fav: false, selected: false },
    { i: 6, frames: 1903, dur: "1:03", status: "ok",        cams: 3, fav: false, selected: false },
    { i: 7, frames: 2210, dur: "1:13", status: "annotated", cams: 3, fav: false, selected: false },
  ];

  const tabs = [
    { id: "wbcd",    name: "WBCD 2026",          accent: "a" },
    { id: "pickplc", name: "Pickplace v2 prep",  accent: "b" },
    { id: "manip",   name: "Manipulation Bench", accent: "a" },
  ];
  const recent = [
    { slug: "humanoid-loco", name: "Humanoid locomotion · spike", lastSeen: "yesterday", accent: "b" },
    { slug: "kitchen-mar",   name: "Kitchen benchmark · march",   lastSeen: "4 days ago", accent: "a" },
  ];

  const selCount = cards.filter(c => c.selected).length + railEpisodes.filter(e => e.selected).length;

  return (
    <div className="nm" data-screen-label="03 Dataset Explorer · multi-select active">
      <TabStrip tabs={tabs} activeId="wbcd" recent={recent} />
      <div style={{ display: "flex", height: "calc(100% - 38px)" }}>
        <Sidebar active="explorer" project="WBCD 2026" role="owner" />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", position: "relative" }}>
          <Topbar crumbs={["WBCD 2026", "Dataset Explorer", "Catalog"]} env="dev" />

          {/* Catalog body + episode-inspector rail */}
          <main style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 360px", minHeight: 0 }}>
            {/* Catalog */}
            <div style={{ overflow: "auto", padding: "18px 22px 110px" }}>
              {/* Hero */}
              <Panel padding={0} style={{ marginBottom: 14, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", background: "linear-gradient(135deg, var(--nm-accent-a-tint) 0%, transparent 55%)" }}>
                  <Chip accent="b" style={{ marginBottom: 6 }}>Catalog · 42 datasets · adding to WBCD 2026</Chip>
                  <h1 className="font-display" style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
                    Dataset Explorer
                  </h1>
                  <p style={{ margin: "4px 0 0", color: "var(--nm-text-dim)", fontSize: 12.5, lineHeight: 1.5, maxWidth: 620 }}>
                    Select whole datasets here, or pick individual episodes in the inspector to the right.
                  </p>
                </div>
              </Panel>

              {/* Search */}
              <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
                <div className="nm-input" style={{ flex: 1, padding: "7px 12px", borderRadius: 10 }}>
                  <Icon.search size={14} />
                  <input placeholder="Search by title, provider, tag…" defaultValue="lerobot" />
                  <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>8 match</span>
                </div>
                <div style={{ display: "flex", gap: 2, border: "1px solid var(--nm-border)", borderRadius: 8, padding: 2, background: "var(--nm-panel-mono)" }}>
                  {["Rows", "Split", "Table"].map((l, i) => (
                    <button key={l} className="font-mono" style={{
                      padding: "3px 9px", fontSize: 10.5, fontWeight: 600, borderRadius: 5, border: 0,
                      background: i === 0 ? "var(--nm-accent-a)" : "transparent",
                      color: i === 0 ? "#fff8ec" : "var(--nm-text-faint)",
                      cursor: "pointer",
                    }}>{l}</button>
                  ))}
                </div>
              </div>

              {/* Vendor row header */}
              <div style={{ marginBottom: 8, display: "flex", alignItems: "baseline", gap: 8 }}>
                <h3 className="font-display" style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>LeRobot · HuggingFace</h3>
                <span className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".06em" }}>4 visible</span>
                <span style={{ flex: 1 }} />
                <span className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-accent-a)", fontWeight: 600 }}>
                  {cards.filter(c => c.selected).length} datasets selected
                </span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                {cards.map(c => <ExplorerCard key={c.id} {...c} />)}
              </div>

              <div style={{ marginBottom: 8 }}>
                <h3 className="font-display" style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Stanford · ALOHA</h3>
                <span className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".06em", marginRight: 8 }}>2 datasets</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
                <ExplorerCard id="aloha2" title="aloha/transfer_cube" prov="stanford" a="a" dl="2.1k" li="56" up="2w ago" ep="—" selected={false} />
                <ExplorerCard id="aloha3" title="aloha/insertion_block" prov="stanford" a="b" dl="980" li="33" up="1mo ago" ep="—" selected={false} />
              </div>
            </div>

            {/* Right rail: EpisodeInspector — episode multi-select happens here */}
            <EpisodeInspectorRail episodes={railEpisodes} />
          </main>

          {/* Floating selection toolbar */}
          <SelectionToolbar count={selCount} />
        </div>
      </div>
    </div>
  );
}

function EpisodeInspectorRail({ episodes }) {
  return (
    <aside style={{
      borderLeft: "1px solid var(--nm-border)",
      background: "var(--nm-panel)",
      display: "flex", flexDirection: "column", minHeight: 0,
    }}>
      <div style={{
        padding: "12px 14px",
        borderBottom: "1px solid var(--nm-border)",
        background: "var(--nm-panel-strong)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div className="nm-thumb" style={{ width: 44, height: 32, borderRadius: 5, flex: "none", "--accent": "var(--nm-accent-b)" }}>
          <div className="nm-thumb__glow" />
          <div className="nm-thumb__icon"><Icon.box size={14} /></div>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".12em" }}>
            Episode inspector
          </div>
          <div className="font-display" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            lerobot/xarm_lift_medium
          </div>
        </div>
        <Chip accent="b">2 / 64</Chip>
      </div>
      <div style={{
        padding: "8px 12px",
        borderBottom: "1px solid var(--nm-border)",
        display: "flex", alignItems: "center", gap: 6, fontSize: 11,
        color: "var(--nm-text-dim)",
      }}>
        <Icon.check size={11} />
        <span style={{ fontWeight: 600 }}>2 selected</span>
        <span className="font-mono" style={{ color: "var(--nm-text-faint)", fontSize: 10 }}>· #0001, #0004</span>
        <span style={{ flex: 1 }} />
        <button style={{ background: "transparent", border: 0, fontSize: 10.5, color: "var(--nm-text-faint)", cursor: "pointer" }}>Select all</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {episodes.map((e, i) => <RailEpisodeRow key={e.i} {...e} last={i === episodes.length - 1} />)}
      </div>
      <div style={{
        padding: 10, borderTop: "1px solid var(--nm-border)",
        background: "var(--nm-panel-subtle)",
        display: "flex", alignItems: "center", gap: 8, fontSize: 10.5,
        color: "var(--nm-text-faint)",
      }}>
        <Icon.workflow size={11} />
        <span className="font-mono">double-click any row to open in editor</span>
      </div>
    </aside>
  );
}

function RailEpisodeRow({ i, frames, dur, status, cams, fav, selected, last }) {
  const statusDot = status === "flagged" ? "danger" : status === "annotated" ? "warn" : "ok";
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "26px 56px 1fr auto 26px",
      gap: 8, alignItems: "center",
      padding: "8px 12px",
      borderBottom: last ? "none" : "1px solid var(--nm-border)",
      background: selected ? "var(--nm-accent-a-tint)" : "transparent",
      cursor: "pointer",
      fontSize: 12,
    }}>
      <div className={`nm-check ${selected ? "nm-check--on" : ""}`}>
        {selected && <Icon.check size={10} />}
      </div>
      <div className="nm-thumb" style={{ width: 50, height: 32, borderRadius: 5, "--accent": "var(--nm-accent-b)" }}>
        <div className="nm-thumb__glow" />
        <div className="nm-thumb__icon"><Icon.film size={12} /></div>
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className={`nm-dot nm-dot--${statusDot}`} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 11 }}>#{String(i).padStart(4, "0")}</span>
          {fav && <Icon.star size={10} fill="currentColor" style={{ color: "#c79a18" }} />}
        </div>
        <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", marginTop: 2 }}>
          {frames.toLocaleString()} fr · {dur} · {cams} cam
        </div>
      </div>
      <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".06em" }}>
        {status}
      </div>
      <Icon.chevRight size={12} style={{ color: "var(--nm-text-faint)" }} />
    </div>
  );
}

function ExplorerCard({ id, title, prov, a, dl, li, up, ep, selected, focused }) {
  const accent = a === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)";
  const border = selected ? accent : focused ? "color-mix(in srgb, var(--nm-accent-b) 60%, transparent)" : "var(--nm-border)";
  return (
    <div style={{
      border: `1.5px solid ${border}`,
      borderRadius: 12,
      background: selected
        ? `color-mix(in srgb, ${accent} 8%, var(--nm-panel))`
        : "var(--nm-panel)",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      cursor: "pointer",
      boxShadow: selected ? `0 0 0 3px color-mix(in srgb, ${accent} 14%, transparent)` : "none",
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: 8, left: 8, zIndex: 2 }}>
        <div className={`nm-check ${selected ? "nm-check--on" : ""}`}>
          {selected && <Icon.check size={10} />}
        </div>
      </div>
      {focused && (
        <span className="font-mono" style={{
          position: "absolute", top: 8, right: 8, zIndex: 2,
          background: "var(--nm-accent-b)", color: "#fff8ec",
          padding: "2px 7px", borderRadius: 999, fontSize: 9, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: ".06em",
        }}>in inspector →</span>
      )}
      <div className="nm-thumb" style={{ height: 86, position: "relative", "--accent": accent }}>
        <div className="nm-thumb__glow" />
        <div className="nm-thumb__icon"><Icon.box size={26} /></div>
        <span className="font-mono" style={{
          position: "absolute", bottom: 6, left: 8,
          borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(10,15,14,0.55)", color: "#fff8ec",
          padding: "1px 7px", fontSize: 9.5,
        }}>{prov}</span>
        <span className="font-mono" style={{ position: "absolute", bottom: 6, right: 8, color: "rgba(255,255,255,0.7)", fontSize: 9.5 }}>HF</span>
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div className="font-display" style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25, minHeight: "2.5em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {title}
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6,
          borderRadius: 6, border: "1px solid var(--nm-border)",
          background: "var(--nm-panel-mono)", padding: "5px 8px",
        }}>
          {[["dl", dl], ["likes", li], ["ep", ep]].map(([k, v]) => (
            <div key={k}>
              <div className="font-mono" style={{ fontSize: 8.5, color: "var(--nm-text-faint)", textTransform: "uppercase" }}>{k}</div>
              <div className="font-mono" style={{ fontSize: 11, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {["pickplace", "robot-arm", "rgb"].map(t => (
            <span key={t} className="font-mono" style={{
              borderRadius: 4, border: "1px solid var(--nm-border)",
              background: "var(--nm-panel-mono)", padding: "1px 6px",
              fontSize: 9.5, color: "var(--nm-text-dim)",
            }}>{t}</span>
          ))}
        </div>
        <div style={{ marginTop: "auto", borderTop: "1px dashed var(--nm-border)", paddingTop: 6, display: "flex", alignItems: "center" }}>
          <span className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)" }}>updated {up}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: accent, display: "inline-flex", gap: 2, alignItems: "center" }}>
            Open <Icon.chevRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

// Toolbar — Tag button removed (DECISIONS.md A.§10.3)
function SelectionToolbar({ count }) {
  return (
    <div style={{
      position: "absolute", left: 24, right: 384, bottom: 18,
      pointerEvents: "auto",
      display: "flex", justifyContent: "center",
      zIndex: 20,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "8px 10px 8px 14px",
        borderRadius: 999,
        border: "1px solid color-mix(in srgb, var(--nm-accent-a) 35%, var(--nm-border))",
        background: "var(--nm-panel-strong)",
        boxShadow: "var(--nm-shadow-strong)",
        backdropFilter: "blur(12px)",
      }}>
        <span style={{
          display: "inline-grid", placeItems: "center",
          width: 22, height: 22, borderRadius: "50%",
          background: "var(--nm-accent-a)", color: "#fff8ec",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
        }}>{count}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600 }}>selected</div>
          <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".08em" }}>
            3 datasets · 2 episodes
          </div>
        </div>
        <span style={{ width: 1, alignSelf: "stretch", background: "var(--nm-border)" }} />
        <Btn size="sm" variant="primary" icon={<Icon.folder size={12} />}>
          Add to project
          <Icon.chevDown size={11} />
        </Btn>
        <Btn size="sm" variant="solid" icon={<Icon.download size={12} />}>Export</Btn>
        <span style={{ width: 1, alignSelf: "stretch", background: "var(--nm-border)" }} />
        <button style={{
          background: "transparent", border: 0, padding: "4px 8px",
          fontSize: 11, fontWeight: 500, color: "var(--nm-text-dim)",
          cursor: "pointer",
        }}>Clear</button>
      </div>
    </div>
  );
}

window.ExplorerArtboard = ExplorerArtboard;
