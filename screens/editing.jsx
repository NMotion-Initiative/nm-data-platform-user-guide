// Artboard 07 · Editing workspace — rewrite to match the actual source at
// apps/web/src/workspace/editing/* in NMotion-Initiative/nm-data-platform@main.
//
// Real layout (from EditingView.tsx):
//   gridTemplateRows: minmax(0,1fr) 320px
//     ─ Top row: 200px EntityTree  |  1fr  (ViewportToolbar + ViewportGrid)
//                                  |  300px EditingRightPanel (collapsible→28px)
//     ─ Bottom row: <Timeline /> with a 120px Gutter + tracks
//                   (ruler · regions · keyframes · sparkline channels)
//
// Right panel has TWO tabs: "Sub-goal segments" and "Selection".
// Tools live in the ViewportToolbar (NOT a left palette): Select V · Keyframe K
// · Tag R · Trim T · Locate L.

const { useState: useStateEd } = React;

function EditingArtboard() {
  const tabs = [
    { id: "wbcd",    name: "WBCD 2026",          accent: "a" },
    { id: "pickplc", name: "Pickplace v2 prep",  accent: "b" },
    { id: "manip",   name: "Manipulation Bench", accent: "a" },
  ];
  const recent = [{ slug: "kitchen-mar", name: "Kitchen benchmark · march", lastSeen: "4d ago", accent: "a" }];
  const [tool, setTool] = useStateEd("select");
  const [rightTab, setRightTab] = useStateEd("segments");
  const [activeSeg, setActiveSeg] = useStateEd("seg-grasp");

  return (
    <div className="nm" data-screen-label="07 Editing workspace">
      <TabStrip tabs={tabs} activeId="wbcd" recent={recent} />
      <div style={{ display: "flex", height: "calc(100% - 38px)" }}>
        <Sidebar active="editing" project="WBCD 2026" role="owner" />

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Topbar
            crumbs={["WBCD 2026", "Editing", "lerobot/xarm_lift_medium", "#0004"]}
            env="dev"
          />

          {/* Editor body: rows = (1fr, 320px); top row cols = (200, 1fr, 300) */}
          <main style={{ flex: 1, minHeight: 0, padding: 8, display: "grid", gridTemplateRows: "minmax(0,1fr) 320px", gap: 8 }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "200px minmax(0,1fr) 300px",
              gap: 8,
              minHeight: 0,
            }}>
              <EntityTreePanel />
              <ViewportColumn tool={tool} onTool={setTool} />
              <RightPanel tab={rightTab} onTab={setRightTab} activeSeg={activeSeg} setActiveSeg={setActiveSeg} />
            </div>
            <TimelinePanel tool={tool} />
          </main>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// EntityTree (left, 200px)
// ═══════════════════════════════════════════════════════════════════════
function EntityTreePanel() {
  // Rerun-style entity tree. Kinds: group/mesh/frame/transform/image/tensor/scalar/text.
  const nodes = [
    { id: "robot",                label: "robot",                kind: "group", depth: 0, open: true, active: true },
    { id: "robot:aloha",          label: "aloha",                kind: "mesh",  depth: 1 },
    { id: "robot:aloha/frame",    label: "frame",                kind: "frame", depth: 1 },
    { id: "robot:aloha/joint_state", label: "joint_state",       kind: "group", depth: 1, open: true },
    { id: "joint_state/left_waist",     label: "left_waist",     kind: "scalar", depth: 2 },
    { id: "joint_state/left_shoulder",  label: "left_shoulder",  kind: "scalar", depth: 2 },
    { id: "joint_state/right_waist",    label: "right_waist",    kind: "scalar", depth: 2 },
    { id: "robot:aloha/action",   label: "action",               kind: "group", depth: 1, open: false },
    { id: "cam",                  label: "cam",                  kind: "group", depth: 0, open: true },
    { id: "cam:cam_overhead",     label: "cam_overhead",         kind: "image", depth: 1, isCam: true, onTile: true },
    { id: "cam:cam_wrist_l",      label: "cam_wrist_l",          kind: "image", depth: 1, isCam: true, onTile: true },
    { id: "cam:cam_wrist_r",      label: "cam_wrist_r",          kind: "image", depth: 1, isCam: true },
    { id: "cam:cam_side",         label: "cam_side",             kind: "image", depth: 1, isCam: true },
    { id: "world",                label: "world",                kind: "group", depth: 0, open: false },
  ];
  const KIND_ICON = {
    group: Icon.folder, mesh: Icon.box, frame: Icon.workflow, transform: Icon.arrowRight,
    image: Icon.film,   tensor: Icon.activity, scalar: Icon.activity, text: Icon.tag,
  };
  return (
    <div style={{
      border: "1px solid var(--nm-border)", borderRadius: 14,
      background: "var(--nm-panel)",
      boxShadow: "var(--nm-shadow-soft)",
      display: "flex", flexDirection: "column",
      minHeight: 0, overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 12px",
        borderBottom: "1px solid var(--nm-border)",
      }}>
        <SectionHead eyebrow="Recording" title="Entities" />
        <span style={{ flex: 1 }} />
        <Chip>{nodes.length}</Chip>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 10px",
        borderBottom: "1px solid var(--nm-border)",
        background: "var(--nm-panel-subtle)",
      }}>
        <Icon.search size={11} style={{ color: "var(--nm-text-dim)" }} />
        <input
          placeholder="Filter entities…"
          style={{
            flex: 1, border: 0, background: "transparent",
            font: "inherit", fontSize: 11.5, outline: 0,
            color: "var(--nm-text)",
          }}
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 4px 8px" }}>
        {nodes.map(n => {
          const I = KIND_ICON[n.kind] || Icon.folder;
          const isGroup = n.kind === "group";
          const iconColor =
            n.kind === "mesh" ? "var(--nm-accent-a)" :
            n.kind === "image" ? (n.onTile ? "var(--nm-accent-a)" : "var(--nm-accent-b)") :
            "var(--nm-text-dim)";
          return (
            <div key={n.id} style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 6px",
              paddingLeft: 6 + n.depth * 12,
              borderRadius: 6,
              background: n.active ? "var(--nm-accent-a-tint)" : "transparent",
              boxShadow: n.onTile ? "inset 3px 0 0 0 var(--nm-accent-a)" : undefined,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              cursor: "pointer",
              color: (n.active || n.onTile) ? "var(--nm-text)" : "var(--nm-text-dim)",
              fontWeight: (n.active || n.onTile) ? 600 : 400,
            }}>
              {isGroup ? (
                <Icon.chevDown size={10} style={{
                  color: "var(--nm-text-faint)",
                  transform: n.open ? "none" : "rotate(-90deg)",
                  flex: "none",
                }} />
              ) : (
                <span style={{ width: 10, flex: "none" }} />
              )}
              <I size={11} style={{ color: iconColor, flex: "none" }} />
              <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {n.label}
              </span>
              {n.active && (
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--nm-accent-a)", flex: "none" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Center column: ViewportToolbar + adaptive ViewportGrid
// ═══════════════════════════════════════════════════════════════════════
function ViewportColumn({ tool, onTool }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 0, minWidth: 0 }}>
      <ViewportToolbar tool={tool} onTool={onTool} />
      <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
        <ViewportGrid />
      </div>
    </div>
  );
}

const TOOL_META = [
  { id: "select",   label: "Select",   shortcut: "V", Icon: Icon.move },
  { id: "keyframe", label: "Keyframe", shortcut: "K", Icon: Icon.star },
  { id: "tag",      label: "Tag",      shortcut: "R", Icon: Icon.tag },
  { id: "trim",     label: "Trim",     shortcut: "T", Icon: Icon.filter },
  { id: "locate",   label: "Locate",   shortcut: "L", Icon: Icon.search },
];

function ViewportToolbar({ tool, onTool }) {
  return (
    <div style={{
      flex: "none",
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px",
      border: "1px solid var(--nm-border)", borderRadius: 14,
      background: "var(--nm-panel)",
      boxShadow: "var(--nm-shadow-soft)",
      overflow: "hidden",
    }}>
      {/* Tools cluster */}
      <div style={{
        display: "inline-flex", gap: 2,
        padding: 2,
        border: "1px solid var(--nm-border)", borderRadius: 7,
        background: "var(--nm-panel-subtle)",
      }}>
        {TOOL_META.map(t => {
          const I = t.Icon;
          const active = tool === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onTool?.(t.id)}
              title={`${t.label} — ${t.shortcut}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 8px", borderRadius: 5,
                border: 0,
                background: active ? "var(--nm-panel-strong)" : "transparent",
                color: active ? "var(--nm-text)" : "var(--nm-text-dim)",
                fontWeight: active ? 600 : 500,
                fontSize: 11,
                fontFamily: "inherit",
                cursor: "pointer",
                boxShadow: active ? "var(--nm-shadow-soft)" : "none",
                whiteSpace: "nowrap",
              }}
            >
              <I size={12} />
              {t.label}
              <span style={{
                marginLeft: 2,
                padding: "1px 4px",
                borderRadius: 3,
                border: "1px solid var(--nm-border)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 8.5,
                color: "var(--nm-text-faint)",
                opacity: active ? 0.85 : 0.55,
              }}>{t.shortcut}</span>
            </button>
          );
        })}
      </div>

      <span style={{ width: 1, height: 18, background: "var(--nm-border)", flex: "none" }} />

      {/* HUD: scrub time + frame */}
      <span className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-dim)", whiteSpace: "nowrap" }}>
        t = <span style={{ color: "var(--nm-text)", fontWeight: 600 }}>4.620s</span>
        <span style={{ color: "var(--nm-text-faint)", margin: "0 6px" }}>·</span>
        f <span style={{ color: "var(--nm-text)", fontWeight: 600 }}>0346</span>
      </span>

      <span style={{ width: 1, height: 18, background: "var(--nm-border)", flex: "none" }} />

      {/* Session summary chips */}
      <Chip accent="b">aloha/joint_state · 14 ch</Chip>
      <Chip>annotation v1.4 · loaded</Chip>

      <span style={{ flex: 1 }} />

      {/* Version dropdown */}
      <button style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 8px 5px 10px",
        border: "1px solid var(--nm-border)", borderRadius: 7,
        background: "var(--nm-panel)",
        color: "var(--nm-text)",
        font: "inherit", fontSize: 11, fontWeight: 600,
        cursor: "pointer",
      }}>
        <span className="font-mono" style={{ fontSize: 10.5 }}>v3.7</span>
        <span className="font-mono" style={{
          padding: "1px 5px", borderRadius: 3,
          background: "var(--nm-accent-a-tint)", color: "var(--nm-accent-a)",
          fontSize: 8.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em",
        }}>draft</span>
        <Icon.chevDown size={11} style={{ color: "var(--nm-text-faint)" }} />
      </button>

      {/* Save edit · v3.7 */}
      <Btn size="sm" variant="primary" icon={<Icon.check size={12} />}>
        Save edit · v3.7
        <span style={{ width: 6, height: 6, borderRadius: 999, background: "#fff8ec", marginLeft: 4 }} />
      </Btn>
    </div>
  );
}

function ViewportGrid() {
  // Adaptive grid: show3d=true + 2 active cams → 3 tiles → cols=2
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gridAutoRows: "1fr",
      gap: 8,
      height: "100%",
      minHeight: 0,
    }}>
      <Viewport3D large={false} />
      <CamViewport label="cam_overhead" frame="0346" bboxLabel="cube" />
      <CamViewport label="cam_wrist_l"  frame="0346" />
    </div>
  );
}

function Viewport3D() {
  return (
    <div style={{
      position: "relative", borderRadius: 14, overflow: "hidden",
      border: "1px solid var(--nm-border)",
      background: "#0a0e0d",
    }}>
      {/* Grid floor + horizon */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(255,251,236,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,251,236,0.06) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
        backgroundPosition: "center bottom",
        maskImage: "linear-gradient(to top, black 0%, black 55%, transparent 100%)",
        opacity: 0.7,
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: "40%", height: "20%",
        background: "radial-gradient(ellipse at center, rgba(28,103,116,0.22), transparent 70%)",
      }} />

      {/* Robot SVG (stylised arm — matches the SVG-fallback style used in source) */}
      <svg viewBox="0 0 240 200" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <ellipse cx="120" cy="156" rx="80" ry="6" fill="rgba(28,103,116,0.22)" />
        <rect x="100" y="120" width="40" height="40" rx="3" fill="#2a2e2c" stroke="#454b48" />
        {/* base */}
        <rect x="112" y="80" width="16" height="48" rx="2" fill="#3a4441" />
        <rect x="112" y="80" width="60" height="14" rx="2" fill="#3a4441" />
        <rect x="172" y="80" width="14" height="48" rx="2" fill="#3a4441" />
        <circle cx="120" cy="80" r="6" fill="#1c6774" stroke="#fff8ec" strokeWidth="0.5" />
        <circle cx="120" cy="128" r="5" fill="#1c6774" stroke="#fff8ec" strokeWidth="0.5" />
        {/* gripper */}
        <rect x="172" y="128" width="14" height="8" rx="1" fill="#c95b34" />
        {/* cube */}
        <rect x="176" y="138" width="6" height="6" fill="#c95b34" stroke="#fff8ec" strokeWidth="0.3" />
      </svg>

      {/* Top-left HUD: 3D label */}
      <div style={{
        position: "absolute", top: 8, left: 8,
        padding: "3px 8px", borderRadius: 999,
        border: "1px solid rgba(255,251,236,0.2)",
        background: "rgba(10,14,13,0.7)",
        color: "#fff8ec",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
      }}>
        3D · aloha
      </div>

      {/* Top-right preset buttons */}
      <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
        {["Top", "Front", "Side", "Iso"].map(p => (
          <button key={p} style={{
            padding: "2px 7px", borderRadius: 5,
            border: "1px solid rgba(255,251,236,0.18)",
            background: p === "Iso" ? "rgba(201,91,52,0.85)" : "rgba(10,14,13,0.55)",
            color: p === "Iso" ? "#fff8ec" : "rgba(255,251,236,0.75)",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, fontWeight: 600,
            cursor: "pointer",
          }}>{p}</button>
        ))}
      </div>

      {/* Bottom-left: frame info */}
      <div style={{
        position: "absolute", bottom: 10, left: 10,
        padding: "3px 8px", borderRadius: 5,
        border: "1px solid rgba(255,251,236,0.15)",
        background: "rgba(10,14,13,0.7)",
        color: "rgba(255,251,236,0.85)",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
      }}>
        frame 0346 / 0824 · 4.620s
      </div>

      {/* Bottom-right: axis gizmo */}
      <div style={{
        position: "absolute", bottom: 10, right: 10,
        width: 52, height: 52, borderRadius: 8,
        border: "1px solid rgba(255,251,236,0.15)",
        background: "rgba(10,14,13,0.55)",
        padding: 6,
      }}>
        <svg viewBox="0 0 40 40" width="40" height="40">
          <line x1="20" y1="20" x2="20" y2="4" stroke="#5ba4ff" strokeWidth="1.5" />
          <line x1="20" y1="20" x2="36" y2="20" stroke="#e36e6e" strokeWidth="1.5" />
          <line x1="20" y1="20" x2="9" y2="33" stroke="#5fc28f" strokeWidth="1.5" />
          <text x="20" y="3" fontFamily="'IBM Plex Mono', monospace" fontSize="6" fill="#5ba4ff" textAnchor="middle">Z</text>
          <text x="38" y="22" fontFamily="'IBM Plex Mono', monospace" fontSize="6" fill="#e36e6e">X</text>
          <text x="5"  y="36" fontFamily="'IBM Plex Mono', monospace" fontSize="6" fill="#5fc28f">Y</text>
        </svg>
      </div>
    </div>
  );
}

function CamViewport({ label, frame, bboxLabel }) {
  return (
    <div style={{
      position: "relative", borderRadius: 14, overflow: "hidden",
      border: "1px solid var(--nm-border)",
      background: "#0a0e0d",
    }}>
      {/* Faux camera scene — different gradient for each cam */}
      <div style={{
        position: "absolute", inset: 0,
        background:
          label === "cam_overhead"
            ? "radial-gradient(circle at 55% 40%, rgba(255,255,255,0.15), transparent 50%)"
            : "radial-gradient(circle at 50% 60%, rgba(255,255,255,0.10), transparent 55%)",
      }} />
      <div style={{
        position: "absolute", left: "22%", right: "24%", top: "30%", bottom: "26%",
        border: "1px solid rgba(255,255,255,0.10)",
        borderRadius: 6,
        background: "rgba(255,255,255,0.04)",
      }} />
      {/* bbox overlay */}
      {bboxLabel && (
        <>
          <div style={{
            position: "absolute", left: "45%", top: "52%", width: "12%", height: "14%",
            border: "1.5px solid var(--nm-accent-a)",
            background: "color-mix(in srgb, var(--nm-accent-a) 14%, transparent)",
          }} />
          <div style={{
            position: "absolute", left: "45%", top: "calc(52% - 14px)",
            padding: "1px 4px",
            background: "var(--nm-accent-a)", color: "#fff8ec",
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, fontWeight: 600,
          }}>
            {bboxLabel}
          </div>
        </>
      )}

      {/* Top-left label */}
      <span className="font-mono" style={{
        position: "absolute", top: 6, left: 8,
        fontSize: 10, color: "rgba(255,251,236,0.75)",
        textShadow: "0 1px 2px rgba(0,0,0,0.5)",
      }}>{label}</span>

      {/* Top-right close */}
      <button title="Close camera" style={{
        position: "absolute", top: 6, right: 6,
        width: 20, height: 20, borderRadius: 5,
        border: 0,
        background: "rgba(10,14,13,0.6)",
        color: "rgba(255,251,236,0.7)",
        display: "grid", placeItems: "center",
        cursor: "pointer",
      }}>
        <Icon.x size={11} />
      </button>

      {/* Bottom-left bbox count */}
      {bboxLabel && (
        <span className="font-mono" style={{
          position: "absolute", bottom: 6, left: 8,
          padding: "1px 5px", borderRadius: 3,
          border: "1px solid rgba(255,251,236,0.16)",
          background: "rgba(10,14,13,0.55)",
          fontSize: 8.5, color: "rgba(255,251,236,0.7)",
          letterSpacing: ".05em",
        }}>1 bbox</span>
      )}
      {/* Bottom-right frame */}
      <span className="font-mono" style={{
        position: "absolute", bottom: 6, right: 8,
        fontSize: 9.5, color: "rgba(255,251,236,0.55)",
      }}>f{frame}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Right panel: 2-tab "Sub-goal segments" + "Selection"
// ═══════════════════════════════════════════════════════════════════════
function RightPanel({ tab, onTab, activeSeg, setActiveSeg }) {
  return (
    <div style={{
      border: "1px solid var(--nm-border)", borderRadius: 14,
      background: "var(--nm-panel)",
      boxShadow: "var(--nm-shadow-soft)",
      display: "flex", flexDirection: "column",
      minHeight: 0, overflow: "hidden",
    }}>
      <div style={{
        display: "flex", alignItems: "flex-end", gap: 2,
        padding: "6px 6px 0",
        borderBottom: "1px solid var(--nm-border)",
        background: "var(--nm-panel-subtle)",
      }}>
        {[
          ["segments", "Sub-goal segments"],
          ["selection", "Selection"],
        ].map(([id, label]) => {
          const active = tab === id;
          return (
            <div key={id} style={{
              display: "inline-flex", alignItems: "center",
              borderRadius: "6px 6px 0 0",
              border: active ? "1px solid var(--nm-border)" : "1px solid transparent",
              borderBottomColor: active ? "var(--nm-panel)" : undefined,
              background: active ? "var(--nm-panel)" : "transparent",
              marginBottom: -1,
            }}>
              <button
                onClick={() => onTab?.(id)}
                style={{
                  padding: "5px 8px 4px 10px",
                  border: 0, background: "transparent",
                  fontSize: 11, fontWeight: active ? 700 : 500,
                  color: active ? "var(--nm-text)" : "var(--nm-text-dim)",
                  cursor: "pointer", fontFamily: "inherit",
                  lineHeight: 1.2,
                }}
              >{label}</button>
              <button title="Close tab" style={{
                marginRight: 4,
                width: 14, height: 14, borderRadius: 3,
                border: 0, background: "transparent",
                color: "var(--nm-text-faint)",
                display: "grid", placeItems: "center",
                cursor: "pointer",
              }}>
                <Icon.x size={9} />
              </button>
            </div>
          );
        })}
        <span style={{ flex: 1 }} />
        <button title="Collapse panel" style={{
          marginBottom: 4,
          width: 22, height: 22, borderRadius: 5,
          border: 0, background: "transparent",
          color: "var(--nm-text-dim)",
          display: "grid", placeItems: "center",
          cursor: "pointer",
        }}>
          <Icon.chevRight size={11} />
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {tab === "segments"  && <SubGoalSegments activeSeg={activeSeg} setActiveSeg={setActiveSeg} />}
        {tab === "selection" && <SelectionInspector />}
      </div>
    </div>
  );
}

function SubGoalSegments({ activeSeg, setActiveSeg }) {
  const segments = [
    { id: "seg-approach", label: "approach", subGoal: "Approach Cube", accent: "b", start: 0.06, end: 0.21, status: "reviewed" },
    { id: "seg-grasp",    label: "grasp",    subGoal: "Grasp Cube",   accent: "a", start: 0.26, end: 0.43, status: "draft" },
    { id: "seg-move",     label: "move",     subGoal: "Move To Bin",  accent: "b", start: 0.45, end: 0.66, status: "draft" },
    { id: "seg-place",    label: "place",    subGoal: "Place Cube",   accent: "a", start: 0.68, end: 0.81, status: "needs_rework" },
  ];
  const active = segments.find(s => s.id === activeSeg) || segments[0];
  return (
    <>
      <div style={{
        padding: "10px 12px",
        borderBottom: "1px solid var(--nm-border)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".14em" }}>
            Episode 4 · annotation v1.4
          </div>
          <div className="font-display" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", marginTop: 1 }}>
            Sub-goal segments
          </div>
        </div>
        <Chip accent="b">
          <Icon.check size={10} /> {segments.length}
        </Chip>
        <Btn size="sm" icon={<Icon.plus size={11} />}>Segment</Btn>
      </div>

      {/* Segment card strip */}
      <div style={{
        display: "flex", gap: 6, overflowX: "auto",
        padding: 8,
        borderBottom: "1px solid var(--nm-border)",
        height: 98,
      }}>
        {segments.map(seg => {
          const isActive = seg.id === active.id;
          const statusMeta = {
            draft:        { label: "draft",        color: "var(--nm-text-dim)",  bg: "var(--nm-panel-subtle)", border: "var(--nm-border)" },
            reviewed:     { label: "reviewed",     color: "var(--nm-accent-b)",  bg: "var(--nm-accent-b-tint)", border: "color-mix(in srgb, var(--nm-accent-b) 45%, transparent)" },
            needs_rework: { label: "needs rework", color: "var(--nm-danger)",    bg: "color-mix(in srgb, var(--nm-danger) 10%, transparent)", border: "color-mix(in srgb, var(--nm-danger) 45%, transparent)" },
          }[seg.status];
          return (
            <button
              key={seg.id}
              onClick={() => setActiveSeg(seg.id)}
              style={{
                flex: "none", width: 138, height: 80,
                padding: "6px 8px",
                borderRadius: 8,
                border: isActive
                  ? "1px solid var(--nm-accent-b)"
                  : "1px solid var(--nm-border)",
                background: isActive ? "var(--nm-accent-b-tint)" : "var(--nm-panel-subtle)",
                boxShadow: isActive ? "var(--nm-shadow-soft)" : "none",
                textAlign: "left",
                cursor: "pointer",
                fontFamily: "inherit", color: "inherit",
                display: "flex", flexDirection: "column", gap: 2,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: seg.accent === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)",
                  flex: "none",
                }} />
                <span style={{ fontSize: 11, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {seg.label}
                </span>
              </div>
              <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {seg.subGoal}
              </div>
              <div className="font-mono" style={{ fontSize: 9, color: "var(--nm-text-faint)" }}>
                {(seg.start * 11).toFixed(2)}-{(seg.end * 11).toFixed(2)}s · f{Math.round(seg.start * 824)}
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 3,
                padding: "1px 5px", borderRadius: 999,
                border: `1px solid ${statusMeta.border}`,
                background: statusMeta.bg, color: statusMeta.color,
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 8.5, fontWeight: 600,
                width: "fit-content",
                marginTop: "auto",
              }}>{statusMeta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active segment editor */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <SegField label="Segment"  value={active.label} />
          <SegField label="Sub-goal" value={active.subGoal} />
        </div>
        <SegField label="Language instruction" multiline value="Close the gripper around the cube, lift to 12cm before transit." />
        <SegField label="Annotation note" multiline value={active.status === "needs_rework" ? "Reviewer: motion too aggressive in last 5 frames." : ""} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {["draft", "reviewed", "needs rework"].map(s => {
            const isOn = (s === "draft" && active.status === "draft")
              || (s === "reviewed" && active.status === "reviewed")
              || (s === "needs rework" && active.status === "needs_rework");
            const meta = {
              "draft":        { color: "var(--nm-text-dim)", bg: "var(--nm-panel-subtle)", border: "var(--nm-border)", icon: <Icon.history size={10} /> },
              "reviewed":     { color: "var(--nm-accent-b)", bg: "var(--nm-accent-b-tint)", border: "color-mix(in srgb, var(--nm-accent-b) 45%, transparent)", icon: <Icon.check size={10} /> },
              "needs rework": { color: "var(--nm-danger)",   bg: "color-mix(in srgb, var(--nm-danger) 10%, transparent)", border: "color-mix(in srgb, var(--nm-danger) 45%, transparent)", icon: <Icon.flag size={10} /> },
            }[s];
            return (
              <button key={s} style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                padding: "3px 8px", borderRadius: 6,
                border: `1px solid ${isOn ? meta.border : "var(--nm-border)"}`,
                background: isOn ? meta.bg : "var(--nm-panel-subtle)",
                color: isOn ? meta.color : "var(--nm-text-dim)",
                font: "inherit", fontSize: 10.5, fontWeight: 600,
                cursor: "pointer",
              }}>
                {meta.icon}
                {s}
              </button>
            );
          })}
          <span style={{ flex: 1 }} />
          <Btn size="sm" icon={<Icon.trash size={11} />} title="Delete segment" />
        </div>
      </div>

      {/* Footer with dataset/annotation ref */}
      <div style={{
        padding: "6px 12px",
        borderTop: "1px solid var(--nm-border)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9.5, color: "var(--nm-text-faint)",
      }}>
        lerobot/xarm_lift_medium · a87f3e21
      </div>
    </>
  );
}

function SegField({ label, value, multiline }) {
  return (
    <label style={{ display: "block", minWidth: 0 }}>
      <span className="font-mono" style={{ display: "block", marginBottom: 4, fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".08em" }}>
        {label}
      </span>
      {multiline ? (
        <textarea defaultValue={value} rows={2} style={{
          width: "100%", padding: "6px 10px",
          border: "1px solid var(--nm-border)", borderRadius: 6,
          background: "var(--nm-panel-mono)", color: "var(--nm-text)",
          font: "inherit", fontSize: 12,
          lineHeight: 1.35,
          resize: "vertical",
          outline: 0,
        }} />
      ) : (
        <input defaultValue={value} style={{
          width: "100%", padding: "5px 10px",
          border: "1px solid var(--nm-border)", borderRadius: 6,
          background: "var(--nm-panel-mono)", color: "var(--nm-text)",
          font: "inherit", fontSize: 12, fontWeight: 500,
          outline: 0,
        }} />
      )}
    </label>
  );
}

// "Selection" tab — Inspector when nothing focused. Showing keyframe selection.
function SelectionInspector() {
  return (
    <>
      <div style={{
        padding: "10px 12px",
        borderBottom: "1px solid var(--nm-border)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".14em" }}>
            Selection · keyframe
          </div>
          <div className="font-display" style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em", marginTop: 1 }}>
            Keyframe · lift
          </div>
        </div>
        <Chip>v3.7</Chip>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <InspectorRow label="Label" value="lift" />
        <InspectorRow label="t"     value="4.620" mono right />
        <InspectorRow label="Frame" value="0346"  mono right />
        <InspectorRow label="Kind"  value="pose"  right />
        <div style={{ borderTop: "1px dashed var(--nm-border)", margin: "4px 0" }} />
        <div className="font-mono" style={{ fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".1em" }}>
          Pose snapshot
        </div>
        <div style={{
          border: "1px solid var(--nm-border)", borderRadius: 6,
          background: "var(--nm-panel-mono)",
          overflow: "hidden",
        }}>
          {[
            ["gripper",   "0.18"],
            ["ee_x",      "0.412"],
            ["ee_y",      "−0.087"],
            ["ee_z",      "0.214"],
            ["left_waist","1.214"],
            ["left_shoulder","−0.487"],
          ].map(([k, v], i) => (
            <div key={k} style={{
              display: "grid", gridTemplateColumns: "1fr auto",
              padding: "4px 10px",
              borderTop: i ? "1px solid var(--nm-border)" : 0,
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5,
            }}>
              <span style={{ color: "var(--nm-text-faint)" }}>{k}</span>
              <span style={{ color: "var(--nm-text)", fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          <Btn size="sm" icon={<Icon.x size={11} />} style={{ flex: 1 }}>Delete</Btn>
          <Btn size="sm" variant="primary" icon={<Icon.check size={11} />} style={{ flex: 1 }}>Apply</Btn>
        </div>
      </div>
    </>
  );
}

function InspectorRow({ label, value, mono, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "5px 8px",
      border: "1px solid var(--nm-border)", borderRadius: 6,
      background: "var(--nm-panel-subtle)",
    }}>
      <span className="font-mono" style={{ minWidth: 42, fontSize: 9.5, color: "var(--nm-text-faint)", textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</span>
      <span style={{
        flex: 1, textAlign: right ? "right" : "left",
        fontSize: 11.5, fontWeight: 500,
        color: "var(--nm-text)",
        fontFamily: mono ? "'IBM Plex Mono', monospace" : "inherit",
      }}>{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// Timeline panel (bottom row, 320px)
// ═══════════════════════════════════════════════════════════════════════
function TimelinePanel({ tool }) {
  const channels = [
    { key: "left_waist",     label: "left_waist",     accent: "a", group: "state" },
    { key: "left_shoulder",  label: "left_shoulder",  accent: "b", group: "state" },
    { key: "right_waist",    label: "right_waist",    accent: "a", group: "state" },
    { key: "right_shoulder", label: "right_shoulder", accent: "b", group: "state" },
    { key: "act.left_waist", label: "left_waist",     accent: "a", group: "action", focused: true },
    { key: "act.right_waist",label: "right_waist",    accent: "b", group: "action" },
  ];
  const tags = [
    { id: "seg-approach", label: "approach", accent: "b", start: 0.06, end: 0.21 },
    { id: "seg-grasp",    label: "grasp",    accent: "a", start: 0.26, end: 0.43 },
    { id: "seg-move",     label: "move",     accent: "b", start: 0.45, end: 0.66 },
    { id: "seg-place",    label: "place",    accent: "a", start: 0.68, end: 0.81 },
  ];
  const keyframes = [
    { t: 0.08, label: "approach" },
    { t: 0.18, label: "reach" },
    { t: 0.32, label: "grasp" },
    { t: 0.42, label: "lift", selected: true },
    { t: 0.55, label: "move" },
    { t: 0.72, label: "place" },
    { t: 0.92, label: "retract" },
  ];
  return (
    <div style={{
      border: "1px solid var(--nm-border)", borderRadius: 14,
      background: "var(--nm-panel)",
      boxShadow: "var(--nm-shadow-soft)",
      display: "flex", flexDirection: "column",
      minHeight: 0, overflow: "hidden",
    }}>
      <TimelineTransport />
      <TimelineGrid tool={tool} channels={channels} tags={tags} keyframes={keyframes} />
    </div>
  );
}

function TimelineTransport() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 12px",
      borderBottom: "1px solid var(--nm-border)",
      background: "var(--nm-panel-strong)",
      overflowX: "auto",
    }}>
      <button style={transportBtnStyle} title="Skip to in">
        <Icon.chevsLeft size={11} />
      </button>
      <button title="Play / pause" style={{
        ...transportBtnStyle,
        width: 30, height: 26,
        background: "var(--nm-accent-a)", borderColor: "var(--nm-accent-a)", color: "#fff8ec",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </button>
      <button style={transportBtnStyle} title="Frame +1">
        <Icon.chevsLeft size={11} style={{ transform: "scaleX(-1)" }} />
      </button>
      <span style={{ width: 1, height: 18, background: "var(--nm-border)", margin: "0 2px" }} />
      <Chip accent="a"><Icon.plus size={10} /> Keyframe</Chip>
      <Chip accent="a"><Icon.tag size={10} /> Tag</Chip>
      <span style={{ width: 1, height: 18, background: "var(--nm-border)", margin: "0 2px" }} />
      <span className="font-mono" style={{ fontSize: 11, color: "var(--nm-text)", whiteSpace: "nowrap" }}>
        example_time <span style={{ color: "var(--nm-text-faint)" }}>▾</span>
      </span>
      <span className="font-mono" style={{ fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>1.00×</span>
      <span style={{ width: 1, height: 18, background: "var(--nm-border)", margin: "0 2px" }} />
      <span className="font-mono" style={{ fontSize: 11, whiteSpace: "nowrap" }}>+<b>4.620</b>s</span>
      <span style={{ flex: 1 }} />
      <Chip><Icon.tag size={10} /> 4 regions</Chip>
      <Chip accent="a">◆ 7 keyframes</Chip>
      <span style={{ width: 1, height: 18, background: "var(--nm-border)", margin: "0 2px" }} />
      <span className="font-mono" style={{ fontSize: 10.5, color: "var(--nm-text-dim)", whiteSpace: "nowrap" }}>
        in <b style={{ color: "var(--nm-accent-b)" }}>0.88s</b> · out <b style={{ color: "var(--nm-accent-b)" }}>10.12s</b> · <b style={{ color: "var(--nm-text)" }}>9.24s</b>
      </span>
      <Btn size="sm" variant="primary" icon={<Icon.download size={11} />}>Export clip</Btn>
    </div>
  );
}

const transportBtnStyle = {
  display: "grid", placeItems: "center",
  width: 26, height: 24, borderRadius: 6,
  border: "1px solid var(--nm-border)",
  background: "var(--nm-panel-subtle)",
  color: "var(--nm-text)",
  cursor: "pointer",
  flex: "none",
};

function TimelineGrid({ tool, channels, tags, keyframes }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "120px minmax(0, 1fr)",
      flex: 1, minHeight: 0,
    }}>
      <TimelineGutter channels={channels} />
      <TimelineTracks tool={tool} tags={tags} keyframes={keyframes} channels={channels} />
    </div>
  );
}

function TimelineGutter({ channels }) {
  return (
    <div style={{
      borderRight: "1px solid var(--nm-border)",
      background: "var(--nm-panel-subtle)",
      display: "flex", flexDirection: "column",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 10, color: "var(--nm-text-dim)",
    }}>
      <div style={{
        height: 18, padding: "0 10px",
        display: "flex", alignItems: "center",
        borderBottom: "1px solid var(--nm-border)",
        fontSize: 9, textTransform: "uppercase", letterSpacing: ".08em",
        color: "var(--nm-text-faint)",
      }}>
        ruler
      </div>
      <div style={{
        height: 26, padding: "0 10px",
        display: "flex", alignItems: "center", gap: 6,
        borderBottom: "1px solid var(--nm-border)",
      }}>
        <Icon.tag size={10} /> regions
      </div>
      <div style={{
        height: 26, padding: "0 10px",
        display: "flex", alignItems: "center", gap: 6,
        borderBottom: "1px solid var(--nm-border)",
      }}>
        <span style={{ width: 6, height: 6, transform: "rotate(45deg)", background: "var(--nm-accent-a)" }} />
        keyframes
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {channels.map((ch, i) => (
          <div key={ch.key} style={{
            height: 30, padding: "0 10px",
            display: "flex", alignItems: "center", gap: 6,
            borderBottom: i < channels.length - 1 ? "1px solid var(--nm-border)" : 0,
            boxShadow: ch.focused ? "inset 3px 0 0 0 var(--nm-accent-a)" : undefined,
            color: ch.focused ? "var(--nm-text)" : "var(--nm-text-dim)",
            fontWeight: ch.focused ? 600 : 400,
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: ch.accent === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)",
              flex: "none",
            }} />
            <span style={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ch.label}
            </span>
          </div>
        ))}
      </div>
      <button style={{
        height: 22, padding: "0 10px",
        display: "flex", alignItems: "center", gap: 6,
        borderTop: "1px solid var(--nm-border)",
        background: "transparent", border: 0,
        color: "var(--nm-text-faint)",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
        cursor: "pointer",
      }}>
        <Icon.plus size={10} /> Track
      </button>
    </div>
  );
}

function TimelineTracks({ tool, tags, keyframes, channels }) {
  const inOut = { in: 0.08, out: 0.92 };
  const scrub = 0.42;
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Ruler */}
      <div style={{ position: "relative", height: 18, borderBottom: "1px solid var(--nm-border)", background: "var(--nm-panel-subtle)" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", top: 0, bottom: 0,
            left: `${(i / 11) * 100}%`, width: 1,
            background: "var(--nm-border)",
          }}>
            <span className="font-mono" style={{
              position: "absolute", left: 4, top: 3,
              fontSize: 9, color: "var(--nm-text-faint)", whiteSpace: "nowrap",
            }}>{Math.round((i / 11) * 11)}s</span>
          </div>
        ))}
      </div>
      {/* Regions row */}
      <div style={{ position: "relative", height: 26, borderBottom: "1px solid var(--nm-border)" }}>
        {tags.map(t => {
          const c = t.accent === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)";
          return (
            <div key={t.id} style={{
              position: "absolute",
              left: `${t.start * 100}%`, width: `${(t.end - t.start) * 100}%`,
              top: 4, bottom: 4,
              display: "flex", alignItems: "center",
              padding: "0 6px",
              borderRadius: 4,
              border: `1px solid color-mix(in srgb, ${c} 40%, transparent)`,
              background: `color-mix(in srgb, ${c} 22%, transparent)`,
              color: c,
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10.5, fontWeight: 700,
              overflow: "hidden",
            }}>{t.label}</div>
          );
        })}
      </div>
      {/* Keyframes row */}
      <div style={{ position: "relative", height: 26, borderBottom: "1px solid var(--nm-border)" }}>
        <span style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: "var(--nm-border)" }} />
        {keyframes.map((k, i) => (
          <React.Fragment key={i}>
            <span style={{
              position: "absolute", left: `${k.t * 100}%`, top: "50%",
              transform: "translate(-50%, -50%) rotate(45deg)",
              width: 13, height: 13,
              background: k.selected ? "var(--nm-accent-a)" : "var(--nm-panel-strong)",
              border: "1.5px solid var(--nm-accent-a)",
              boxShadow: k.selected ? "0 0 0 4px color-mix(in srgb, var(--nm-accent-a) 30%, transparent)" : "none",
            }} />
            <span className="font-mono" style={{
              position: "absolute", left: `calc(${k.t * 100}% + 10px)`, top: 2,
              fontSize: 9, color: "var(--nm-text-dim)", whiteSpace: "nowrap",
            }}>{k.label}</span>
          </React.Fragment>
        ))}
      </div>
      {/* Channel sparkrows */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {channels.map((ch, i) => (
          <SparkRow key={ch.key} channel={ch} last={i === channels.length - 1} />
        ))}
      </div>
      {/* Trim overlay */}
      <div style={{
        position: "absolute", top: 18, bottom: 22,
        left: 0, width: `${inOut.in * 100}%`,
        background: "rgba(40,32,24,0.18)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: 18, bottom: 22,
        left: `${inOut.out * 100}%`, right: 0,
        background: "rgba(40,32,24,0.18)",
        pointerEvents: "none",
      }} />
      {/* In handle */}
      <TrimHandle leftPct={inOut.in * 100} side="in" />
      <TrimHandle leftPct={inOut.out * 100} side="out" />
      {/* Playhead */}
      <div style={{
        position: "absolute", top: 0, bottom: 22,
        left: `${scrub * 100}%`,
        width: 1, background: "var(--nm-accent-a)",
        boxShadow: "0 0 0 2px color-mix(in srgb, var(--nm-accent-a) 20%, transparent)",
        pointerEvents: "none",
      }}>
        <span style={{
          position: "absolute", top: 0, left: -5,
          width: 11, height: 7,
          background: "var(--nm-accent-a)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }} />
      </div>
      {/* Bottom track scrollbar gutter (matches the Track button row) */}
      <div style={{ height: 22, borderTop: "1px solid var(--nm-border)", background: "var(--nm-panel-subtle)" }} />
    </div>
  );
}

function TrimHandle({ leftPct, side }) {
  return (
    <div style={{
      position: "absolute",
      top: 18, bottom: 22,
      left: `calc(${leftPct}% - 5px)`,
      width: 10,
      pointerEvents: "none",
      zIndex: 3,
    }}>
      <span style={{ position: "absolute", top: 0, bottom: 0, left: 4, width: 2, background: "var(--nm-accent-b)" }} />
      <span style={{
        position: "absolute",
        top: 0,
        left: side === "in" ? 4 : -2,
        width: 8, height: 14,
        background: "var(--nm-accent-b)",
        borderRadius: side === "in" ? "0 3px 3px 0" : "3px 0 0 3px",
        color: "#fff8ec",
        display: "grid", placeItems: "center",
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, fontWeight: 700,
      }}>
        {side === "in" ? "⟨" : "⟩"}
      </span>
    </div>
  );
}

function SparkRow({ channel, last }) {
  // Synthesize a sinusoidal sparkline (state vs action varies amplitude/phase)
  const isState = channel.group === "state";
  const phase = channel.key.includes("right") ? Math.PI / 2 : 0;
  const amp = isState ? 0.6 : 0.5;
  const points = [];
  const N = 80;
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * 100;
    const y = 50 + Math.sin((i / (N - 1)) * Math.PI * 4 + phase) * 30 * amp
                + Math.sin((i / (N - 1)) * Math.PI * 6 + phase * 2) * 8 * amp;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  const color = channel.accent === "a" ? "var(--nm-accent-a)" : "var(--nm-accent-b)";
  return (
    <div style={{
      position: "relative",
      height: 30,
      borderBottom: last ? 0 : "1px solid var(--nm-border)",
      background: channel.focused
        ? "color-mix(in srgb, var(--nm-accent-a) 6%, transparent)"
        : "transparent",
      overflow: "hidden",
    }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={channel.focused ? 1.6 : 0.9}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

window.EditingArtboard = EditingArtboard;

// ── Single-panel exports for the User Guide ───────────────────────────
// Each wrapper renders one piece of the editor inside its own card-like frame,
// at a size that matches its natural editor proportions.

function _EditingSegmentsOnly() {
  const [activeSeg, setActiveSeg] = useStateEd("seg-grasp");
  return (
    <div className="nm" style={{ width: "100vw", height: "100vh", padding: 14, background: "var(--nm-page-glow)", boxSizing: "border-box" }}>
      <div style={{
        width: "100%", height: "100%",
        border: "1px solid var(--nm-border)", borderRadius: 14,
        background: "var(--nm-panel)",
        boxShadow: "var(--nm-shadow-soft)",
        display: "flex", flexDirection: "column",
        overflow: "hidden", minHeight: 0,
      }}>
        <SubGoalSegments activeSeg={activeSeg} setActiveSeg={setActiveSeg} />
      </div>
    </div>
  );
}

function _EditingSelectionOnly() {
  return (
    <div className="nm" style={{ width: "100vw", height: "100vh", padding: 14, background: "var(--nm-page-glow)", boxSizing: "border-box" }}>
      <div style={{
        width: "100%", height: "100%",
        border: "1px solid var(--nm-border)", borderRadius: 14,
        background: "var(--nm-panel)",
        boxShadow: "var(--nm-shadow-soft)",
        display: "flex", flexDirection: "column",
        overflow: "hidden", minHeight: 0,
      }}>
        <SelectionInspector />
      </div>
    </div>
  );
}

function _EditingTreeOnly() {
  return (
    <div className="nm" style={{ width: "100vw", height: "100vh", padding: 14, background: "var(--nm-page-glow)", boxSizing: "border-box" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <EntityTreePanel />
      </div>
    </div>
  );
}

function _EditingViewportsOnly() {
  return (
    <div className="nm" style={{ width: "100vw", height: "100vh", padding: 14, background: "var(--nm-page-glow)", boxSizing: "border-box" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <ViewportGrid />
      </div>
    </div>
  );
}

function _EditingTimelineOnly() {
  return (
    <div className="nm" style={{ width: "100vw", height: "100vh", padding: 14, background: "var(--nm-page-glow)", boxSizing: "border-box" }}>
      <div style={{ width: "100%", height: "100%" }}>
        <TimelinePanel tool="select" />
      </div>
    </div>
  );
}

function _EditingToolbarOnly() {
  const [tool, setTool] = useStateEd("select");
  return (
    <div className="nm" style={{ width: "100vw", padding: 14, background: "var(--nm-page-glow)", boxSizing: "border-box" }}>
      <ViewportToolbar tool={tool} onTool={setTool} />
    </div>
  );
}

window.EditingTreeOnly      = _EditingTreeOnly;
window.EditingToolbarOnly   = _EditingToolbarOnly;
window.EditingViewportsOnly = _EditingViewportsOnly;
window.EditingSegmentsOnly  = _EditingSegmentsOnly;
window.EditingSelectionOnly = _EditingSelectionOnly;
window.EditingTimelineOnly  = _EditingTimelineOnly;
