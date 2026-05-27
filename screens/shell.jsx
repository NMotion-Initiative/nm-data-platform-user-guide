// Artboard 1: Workspace Shell with top tab strip (3 open projects, 1 active),
// Recent Projects dropdown, per-project sidebar. Shows the Dataset Explorer
// view inside the active tab as the canonical "you are inside a project" state.

function ShellArtboard() {
  const tabs = [
    { id: "wbcd",     name: "WBCD 2026",            accent: "a" },
    { id: "pickplc",  name: "Pickplace v2 prep",    accent: "b", dirty: true },
    { id: "manip",    name: "Manipulation Benchmark", accent: "a" },
  ];
  const [active, setActive] = useState("wbcd");
  const recent = [
    { slug: "humanoid-loco", name: "Humanoid locomotion · spike", lastSeen: "yesterday", accent: "b" },
    { slug: "kitchen-mar",   name: "Kitchen benchmark · march",   lastSeen: "4 days ago", accent: "a" },
    { slug: "so100-baseline",name: "SO-100 baseline (archived)",  lastSeen: "2 weeks ago", accent: "a" },
  ];

  return (
    <div className="nm" data-screen-label="01 Workspace Shell">
      {/* Top tab strip — browser-style */}
      <TabStrip
        tabs={tabs}
        activeId={active}
        onSelect={setActive}
        onClose={() => {}}
        onNew={() => {}}
        recent={recent}
      />

      <div style={{ display: "flex", height: "calc(100% - 38px)" }}>
        <Sidebar active="explorer" project="WBCD 2026" role="owner" />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Topbar crumbs={["WBCD 2026", "Dataset Explorer"]} env="dev" />

          {/* Mini explorer body just as wallpaper inside the shell */}
          <main style={{ flex: 1, overflow: "auto", padding: 18 }}>
            <Panel padding={0} style={{ marginBottom: 14, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px 14px", background: "linear-gradient(135deg, var(--nm-accent-a-tint) 0%, transparent 55%)" }}>
                <Chip accent="b" style={{ marginBottom: 8 }}>Catalog · 42 datasets · WBCD 2026</Chip>
                <h1 className="font-display" style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>
                  Dataset Explorer
                </h1>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--nm-text-dim)", maxWidth: 580, lineHeight: 1.5 }}>
                  Pick a dataset to open its episodes and signals — or multi-select to add to a folder in this project's <strong>My Data</strong>.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--nm-border)" }}>
                {[["Datasets", 42, "a"], ["Vendors", 11, "b"], ["Episodes", "—", "a"], ["Pinned", 4, "b"]].map(([k, v, a], i) => (
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

            <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
              <div className="nm-input" style={{ flex: 1, padding: "7px 12px", borderRadius: 10 }}>
                <Icon.search size={14} />
                <input placeholder="Search by title, provider, tag…" defaultValue="" />
                <span className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-faint)" }}>42 match</span>
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

            {/* One vendor row (Netflix shelf) */}
            <div style={{ marginBottom: 6, display: "flex", alignItems: "baseline", gap: 8 }}>
              <h3 className="font-display" style={{ margin: 0, fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>LeRobot · HuggingFace</h3>
              <span className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".06em" }}>8 datasets</span>
            </div>
            <div style={{ display: "flex", gap: 12, overflow: "hidden" }}>
              {[
                { title: "lerobot/svla_so100_pickplace", prov: "lerobot", a: "a", dl: "12.4k", li: "284", up: "2d ago" },
                { title: "lerobot/aloha_static_coffee",  prov: "lerobot", a: "b", dl: "8.9k",  li: "201", up: "1w ago" },
                { title: "lerobot/pusht",                prov: "lerobot", a: "a", dl: "30.1k", li: "612", up: "3w ago" },
                { title: "lerobot/xarm_lift_medium",     prov: "lerobot", a: "b", dl: "4.7k",  li: "118", up: "5d ago" },
              ].map((d, i) => <CatalogCard key={i} {...d} />)}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function CatalogCard({ title, prov, a, dl, li, up }) {
  return (
    <div style={{
      flex: "0 0 240px",
      border: "1px solid var(--nm-border)",
      borderRadius: 12,
      background: "var(--nm-panel)",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      <div className="nm-thumb" style={{ height: 84, position: "relative", "--accent": a === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)" }}>
        <div className="nm-thumb__glow" />
        <div className="nm-thumb__icon"><Icon.box size={26} /></div>
        <span className="font-mono" style={{
          position: "absolute", top: 6, left: 8,
          borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)",
          background: "rgba(10,15,14,0.55)", color: "#fff8ec",
          padding: "1px 7px", fontSize: 9.5,
        }}>{prov}</span>
        <span className="font-mono" style={{ position: "absolute", bottom: 6, right: 8, color: "rgba(255,255,255,0.7)", fontSize: 9.5 }}>HF</span>
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <div className="font-display" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.25 }}>
          {title}
        </div>
        <div className="font-mono" style={{ fontSize: 10, color: "var(--nm-text-dim)" }}>
          {prov}
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6,
          borderRadius: 6, border: "1px solid var(--nm-border)",
          background: "var(--nm-panel-mono)", padding: "5px 8px",
        }}>
          {[["dl", dl], ["likes", li], ["tags", "5"]].map(([k, v]) => (
            <div key={k}>
              <div className="font-mono" style={{ fontSize: 8.5, color: "var(--nm-text-faint)", textTransform: "uppercase" }}>{k}</div>
              <div className="font-mono" style={{ fontSize: 11, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "auto", borderTop: "1px dashed var(--nm-border)", paddingTop: 6, display: "flex", alignItems: "center" }}>
          <span className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)" }}>updated {up}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: a === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)", display: "inline-flex", gap: 2, alignItems: "center" }}>
            Open <Icon.chevRight size={12} />
          </span>
        </div>
      </div>
    </div>
  );
}

window.ShellArtboard = ShellArtboard;
window.CatalogCard = CatalogCard;
