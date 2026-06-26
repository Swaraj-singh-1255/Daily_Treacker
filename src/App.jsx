import { useState, useEffect, useRef } from "react";

const DEFAULT_TASKS = [
  { id: "wake", time: "5:30 AM", label: "Wake Up + Freshen Up", category: "life", icon: "☀️" },
  { id: "exercise", time: "6:00 AM", label: "Morning Exercise / Walk", category: "life", icon: "🏃" },
  { id: "breakfast", time: "6:30 AM", label: "Breakfast + News", category: "life", icon: "🍳" },
  { id: "aptitude", time: "7:00 AM", label: "Aptitude Practice (IndiaBix)", category: "aptitude", icon: "🧮" },
  { id: "dsa", time: "8:00 AM", label: "DSA — LeetCode 2 Problems", category: "dsa", icon: "💡" },
  { id: "break1", time: "9:00 AM", label: "Break + Light Snack", category: "life", icon: "☕" },
  { id: "fullstack", time: "9:30 AM", label: "Full Stack Development", category: "fullstack", icon: "💻" },
  { id: "ai", time: "11:00 AM", label: "AI/ML — LangChain / RAG / LLM", category: "ai", icon: "🤖" },
  { id: "lunch", time: "12:00 PM", label: "Lunch + Rest", category: "life", icon: "🍱" },
  { id: "communication1", time: "1:00 PM", label: "Communication — TED Talks", category: "comm", icon: "🗣️" },
  { id: "project", time: "2:00 PM", label: "Project Building + GitHub Push", category: "fullstack", icon: "🛠️" },
  { id: "break2", time: "3:00 PM", label: "Break + Walk", category: "life", icon: "🌿" },
  { id: "interview", time: "3:30 PM", label: "Interview Prep — HR + Technical", category: "interview", icon: "🎯" },
  { id: "communication2", time: "4:30 PM", label: "English Speaking App (ELSA)", category: "comm", icon: "🎙️" },
  { id: "jobs", time: "5:00 PM", label: "Apply 10 Jobs — LinkedIn / Naukri", category: "interview", icon: "📨" },
  { id: "sport", time: "6:00 PM", label: "Evening Exercise / Sport", category: "life", icon: "⚽" },
  { id: "dinner", time: "7:00 PM", label: "Dinner + Family Time", category: "life", icon: "🍽️" },
  { id: "aws", time: "7:30 PM", label: "AWS Skill Builder — Cloud Quest", category: "ai", icon: "☁️" },
  { id: "english", time: "8:30 PM", label: "English Movie / Show (Subtitles)", category: "comm", icon: "🎬" },
  { id: "revision", time: "9:00 PM", label: "Daily Revision + Notes", category: "dsa", icon: "📝" },
  { id: "linkedin", time: "9:30 PM", label: "LinkedIn Post + GitHub Activity", category: "interview", icon: "🔗" },
  { id: "plan", time: "10:00 PM", label: "Plan Tomorrow + Wind Down", category: "life", icon: "🌙" },
];

const CATEGORIES = {
  aptitude: { label: "Aptitude", color: "#f59e0b", glow: "#f59e0b40" },
  dsa: { label: "DSA", color: "#8b5cf6", glow: "#8b5cf640" },
  fullstack: { label: "Full Stack", color: "#3b82f6", glow: "#3b82f640" },
  ai: { label: "AI / Cloud", color: "#10b981", glow: "#10b98140" },
  comm: { label: "Communication", color: "#ec4899", glow: "#ec489940" },
  interview: { label: "Interview", color: "#ef4444", glow: "#ef444440" },
  life: { label: "Life", color: "#64748b", glow: "#64748b40" },
};

const QUOTES = [
  "Consistency is the key to success. Show up every day! 💪",
  "Every expert was once a beginner. Keep going Swaraj! 🚀",
  "Your future self will thank you for what you do today! 🌟",
  "Small daily improvements lead to stunning results! ✨",
  "The best time to start was yesterday. The second best time is NOW! 🌱",
  "Dream big, work hard, stay focused! 🎯",
  "Success is the sum of small efforts repeated every day! 🔥",
  "You are 90 days away from a completely different life! 💫",
];

const MOODS = ["😞", "😕", "😐", "🙂", "😊", "🔥"];
const MOOD_LABELS = ["Rough day", "Not great", "Okay", "Good", "Great", "ON FIRE!"];
const ICONS = ["☀️", "🏃", "🍳", "🧮", "💡", "☕", "💻", "🤖", "🍱", "🗣️", "🛠️", "🌿", "🎯", "🎙️", "📨", "⚽", "🍽️", "☁️", "🎬", "📝", "🔗", "🌙", "📚", "🎵", "🏋️", "🧘", "🎮", "📖", "✍️", "🔬", "🎨", "🏆"];

const todayKey = () => new Date().toISOString().split("T")[0];
const getLS = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const setLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } };

/* ─── useWindowSize ─── */
function useWindowSize() {
  const [size, setSize] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 1280 });
  useEffect(() => {
    const fn = () => setSize({ w: window.innerWidth });
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return size;
}

/* ─── Ring ─── */
function Ring({ pct, size, stroke, color, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(pct / 100) * c} ${c}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray .7s cubic-bezier(.4,0,.2,1)", filter: `drop-shadow(0 0 8px ${color})` }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Pomodoro ─── */
function Pomodoro() {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [mins, setMins] = useState(25);
  const [secs, setSecs] = useState(0);
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState("focus");
  const [cycles, setCycles] = useState(0);
  const ref = useRef();

  useEffect(() => {
    if (on) ref.current = setInterval(() => {
      setSecs(s => {
        if (s > 0) return s - 1;
        setMins(m => {
          if (m > 0) return m - 1;
          clearInterval(ref.current); setOn(false);
          if (mode === "focus") {
            setCycles(c => c + 1); setMode("break"); setMins(breakDuration);
          } else {
            setMode("focus"); setMins(focusDuration);
          }
          return 0;
        });
        return 59;
      });
    }, 1000);
    else clearInterval(ref.current);
    return () => clearInterval(ref.current);
  }, [on, mode, focusDuration, breakDuration]);

  const totalSecs = mode === "focus" ? focusDuration * 60 : breakDuration * 60;
  const elapsed = totalSecs - (mins * 60 + secs);
  const pct = Math.round((elapsed / totalSecs) * 100);
  const col = mode === "focus" ? "#a78bfa" : "#10b981";

  const switchMode = (m) => {
    setMode(m); setSecs(0); setOn(false);
    setMins(m === "focus" ? focusDuration : breakDuration);
  };

  const adjustDuration = (type, delta) => {
    if (on) return; // don't adjust while running
    if (type === "focus") {
      const next = Math.min(90, Math.max(5, focusDuration + delta));
      setFocusDuration(next);
      if (mode === "focus") { setMins(next); setSecs(0); }
    } else {
      const next = Math.min(30, Math.max(1, breakDuration + delta));
      setBreakDuration(next);
      if (mode === "break") { setMins(next); setSecs(0); }
    }
  };

  const StepBtn = ({ onClick, children }) => (
    <button onClick={onClick} disabled={on}
      style={{ width: 26, height: 26, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: on ? "#64748B" : "#94a3b8", cursor: on ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 700, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}>
      {children}
    </button>
  );

  return (
    <div style={fCard}>
      {/* Header */}
      <div style={fHead}>
        <span>🍅 Pomodoro Timer</span>
        <div style={{ display: "flex", gap: 5 }}>
          {["focus", "break"].map(m => (
            <button key={m} onClick={() => switchMode(m)}
              style={{ padding: "3px 10px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: mode === m ? col : "rgba(255,255,255,0.08)", color: mode === m ? "#fff" : "#64748b", transition: "all .2s" }}>
              {m === "focus" ? "Focus" : "Break"}
            </button>
          ))}
        </div>
      </div>

      {/* Duration adjusters */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { type: "focus", label: "Focus Time", val: focusDuration, color: "#a78bfa", step: 5 },
          { type: "break", label: "Break Time", val: breakDuration, color: "#10b981", step: 1 },
        ].map(({ type, label, val, color, step }) => (
          <div key={type} style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 12, padding: "10px 12px" }}>
            <div style={{ fontSize: 10, color, fontWeight: 700, letterSpacing: 1, marginBottom: 6 }}>{label.toUpperCase()}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
              <StepBtn onClick={() => adjustDuration(type, -step)}>−</StepBtn>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>{val}</span>
                <span style={{ fontSize: 10, color: "#475569", marginLeft: 3 }}>min</span>
              </div>
              <StepBtn onClick={() => adjustDuration(type, +step)}>+</StepBtn>
            </div>
            {on && <div style={{ fontSize: 9, color: "#334155", textAlign: "center", marginTop: 4 }}>stop timer to edit</div>}
          </div>
        ))}
      </div>

      {/* Timer ring + controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Ring pct={pct} size={88} stroke={8} color={col}>
          <span style={{ fontSize: 17, fontWeight: 900, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
          <span style={{ fontSize: 9, color: "#475569" }}>{mode}</span>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
            Cycles: <span style={{ color: "#f59e0b", fontWeight: 700 }}>{cycles}</span>
            <span style={{ marginLeft: 10, color: "#334155" }}>· {focusDuration}m / {breakDuration}m</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setOn(v => !v)}
              style={{ flex: 1, padding: "9px", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, background: on ? "#ef4444" : col, color: "#fff", transition: "background .2s" }}>
              {on ? "⏸ Pause" : "▶ Start"}
            </button>
            <button onClick={() => { setOn(false); setMins(mode === "focus" ? focusDuration : breakDuration); setSecs(0); }}
              style={{ padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#64748b", cursor: "pointer", fontSize: 14 }}>↺</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── LeetCode ─── */
function LeetCode({ allData, today, onSave }) {
  const lc = allData[today]?.leetcode || { easy: 0, medium: 0, hard: 0 };
  const todayTotal = lc.easy + lc.medium + lc.hard;
  const grandTotal = Object.values(allData).reduce((s, d) => s + (d.leetcode ? d.leetcode.easy + d.leetcode.medium + d.leetcode.hard : 0), 0);
  const upd = (type, delta) => onSave({ ...allData, [today]: { ...allData[today], leetcode: { ...lc, [type]: Math.max(0, (lc[type] || 0) + delta) } } });
  return (
    <div style={fCard}>
      <div style={fHead}><span>💡 LeetCode Tracker</span><span style={{ fontSize: 12, color: "#a78bfa", fontWeight: 700 }}>Total: {grandTotal}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
        {[{ type: "easy", label: "Easy", color: "#10b981" }, { type: "medium", label: "Medium", color: "#f59e0b" }, { type: "hard", label: "Hard", color: "#ef4444" }].map(({ type, label, color }) => (
          <div key={type} style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 10, color, fontWeight: 700, marginBottom: 4, letterSpacing: 1 }}>{label.toUpperCase()}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9", lineHeight: 1 }}>{lc[type] || 0}</div>
            <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 8 }}>
              <button onClick={() => upd(type, -1)} style={{ width: 28, height: 28, borderRadius: 8, border: `1px solid ${color}44`, background: "transparent", color, cursor: "pointer", fontSize: 16, fontWeight: 700 }}>−</button>
              <button onClick={() => upd(type, 1)} style={{ width: 28, height: 28, borderRadius: 8, border: "none", background: color, color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700 }}>+</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontSize: 12, color: "#64748b" }}>Today: <span style={{ color: "#a78bfa", fontWeight: 700 }}>{todayTotal} solved</span></div>
    </div>
  );
}

/* ─── JobLog ─── */
function JobLog({ allData, today, onSave }) {
  const jobs = allData[today]?.jobs || [];
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const total = Object.values(allData).reduce((s, d) => s + (d.jobs?.length || 0), 0);
  const add = () => {
    if (!company.trim()) return;
    onSave({ ...allData, [today]: { ...allData[today], jobs: [...jobs, { id: Date.now(), company, role, status: "applied", time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }) }] } });
    setCompany(""); setRole("");
  };
  const upd = (id, status) => onSave({ ...allData, [today]: { ...allData[today], jobs: jobs.map(j => j.id === id ? { ...j, status } : j) } });
  const del = (id) => onSave({ ...allData, [today]: { ...allData[today], jobs: jobs.filter(j => j.id !== id) } });
  const sc = { applied: "#3b82f6", interview: "#f59e0b", rejected: "#ef4444", offer: "#10b981" };
  return (
    <div style={fCard}>
      <div style={fHead}><span>📨 Job Applications</span><span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>{total} total</span></div>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <input value={company} onChange={e => setCompany(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Company"
          style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#f1f5f9", fontSize: 12, outline: "none", minWidth: 0 }} />
        <input value={role} onChange={e => setRole(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder="Role"
          style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#f1f5f9", fontSize: 12, outline: "none", minWidth: 0 }} />
        <button onClick={add} style={{ padding: "8px 14px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>+</button>
      </div>
      {jobs.length === 0
        ? <div style={{ textAlign: "center", fontSize: 12, color: "#334155", padding: "12px 0" }}>No applications today. Start applying! 💪</div>
        : <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 200, overflowY: "auto" }}>
          {jobs.map(j => (
            <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.company}</div>
                <div style={{ fontSize: 10, color: "#334155" }}>{j.role} · {j.time}</div>
              </div>
              <select value={j.status} onChange={e => upd(j.id, e.target.value)}
                style={{ padding: "3px 6px", borderRadius: 6, border: `1px solid ${sc[j.status]}44`, background: `${sc[j.status]}18`, color: sc[j.status], fontSize: 10, fontWeight: 700, cursor: "pointer", outline: "none" }}>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="rejected">Rejected</option>
                <option value="offer">🎉 Offer!</option>
              </select>
              <button onClick={() => del(j.id)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>×</button>
            </div>
          ))}
        </div>
      }
    </div>
  );
}

/* ─── Notes ─── */
function Notes({ allData, today, onSave }) {
  const [val, setVal] = useState(allData[today]?.note || "");
  const [saved, setSaved] = useState(true);
  useEffect(() => { setVal(allData[today]?.note || ""); }, [today, allData]);
  const save = () => { onSave({ ...allData, [today]: { ...allData[today], note: val } }); setSaved(true); };
  return (
    <div style={fCard}>
      <div style={fHead}><span>📓 Daily Notes</span>
        {saved ? <span style={{ fontSize: 10, color: "#334155" }}>✓ saved</span>
          : <button onClick={save} style={{ padding: "3px 10px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>Save</button>}
      </div>
      <textarea value={val} onChange={e => { setVal(e.target.value); setSaved(false); }} onBlur={save}
        placeholder="What did you learn today? Any blockers? Goals for tomorrow..."
        style={{ width: "100%", minHeight: 100, padding: "10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#e2e8f0", fontSize: 13, lineHeight: 1.6, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
    </div>
  );
}

/* ─── SkillBars ─── */
function SkillBars({ allData, tasks }) {
  const month30 = Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (29 - i)); return allData[d.toISOString().split("T")[0]] || {}; });
  const skills = Object.entries(CATEGORIES).filter(([k]) => k !== "life").map(([key, cat]) => {
    const t = tasks.filter(t => t.category === key);
    const avg = t.length ? month30.reduce((s, d) => s + t.filter(tk => d[tk.id]).length / t.length, 0) / 30 * 100 : 0;
    return { ...cat, key, avg: Math.round(avg) };
  });
  return (
    <div style={fCard}>
      <div style={fHead}><span>📈 30-Day Skill Progress</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {skills.map(s => (
          <div key={s.key}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 13, color: s.color, fontWeight: 700 }}>{s.avg}%</span>
            </div>
            <div style={{ height: 7, background: "rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${s.avg}%`, background: s.color, borderRadius: 20, transition: "width .9s cubic-bezier(.4,0,.2,1)", boxShadow: `0 0 8px ${s.color}80` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── TaskModal ─── */
function TaskModal({ task, onSave, onClose }) {
  const isNew = !task.id;
  const [label, setLabel] = useState(task.label || "");
  const [time, setTime] = useState(task.time || "");
  const [category, setCategory] = useState(task.category || "dsa");
  const [icon, setIcon] = useState(task.icon || "📚");
  const inp = { width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box" };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16, backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 24, width: "100%", maxWidth: 380, boxShadow: "0 25px 60px rgba(0,0,0,0.7)" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", marginBottom: 18 }}>{isNew ? "➕ Add Task" : "✏️ Edit Task"}</div>
        <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>Task name</label>
        <input value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Read DSA book" style={{ ...inp, marginBottom: 12 }} />
        <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>Time</label>
        <input value={time} onChange={e => setTime(e.target.value)} placeholder="e.g. 8:00 AM" style={{ ...inp, marginBottom: 12 }} />
        <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inp, marginBottom: 12, background: "#0f172a", cursor: "pointer" }}>
          {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>Icon</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 20, maxHeight: 110, overflowY: "auto" }}>
          {ICONS.map(ic => (
            <button key={ic} onClick={() => setIcon(ic)}
              style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${icon === ic ? "#a78bfa" : "rgba(255,255,255,0.06)"}`, background: icon === ic ? "rgba(167,139,250,0.2)" : "transparent", cursor: "pointer", fontSize: 18 }}>
              {ic}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", cursor: "pointer", fontWeight: 700 }}>Cancel</button>
          <button onClick={() => { if (!label.trim()) return; onSave({ ...task, id: task.id || `custom_${Date.now()}`, label, time, category, icon }); }}
            style={{ flex: 2, padding: "11px", borderRadius: 12, border: "none", background: isNew ? "#10b981" : "#a78bfa", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
            {isNew ? "Add Task" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared styles ─── */
const fCard = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: 18, marginBottom: 14 };
const fHead = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, fontSize: 13, fontWeight: 700, color: "#94a3b8" };

/* ══════════════════════
   MAIN APP
══════════════════════ */
export default function App() {
  const { w } = useWindowSize();
  // Breakpoints
  const isMobile = w < 640;
  const isTablet = w >= 640 && w < 1024;
  const isDesktop = w >= 1024;

  const [view, setView] = useState("today");
  const [allData, setAllData] = useState(() => getLS("swaraj_progress", {}));
  const [tasks, setTasks] = useState(() => getLS("swaraj_tasks", DEFAULT_TASKS));
  const [today] = useState(todayKey());
  const [toast, setToast] = useState(null);
  const [showBackup, setShowBackup] = useState(false);
  const [modal, setModal] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);

  const toast$ = (msg, color = "#10b981") => { setToast({ msg, color }); setTimeout(() => setToast(null), 3000); };

  const saveData = (nd) => { setAllData(nd); setLS("swaraj_progress", nd); };

  const todayData = allData[today] || {};
  const toggle = id => saveData({
    ...allData,
    [today]: {
      ...todayData,
      [id]: !todayData[id],
      __total: tasks.length
    }
  });
  const todayDone = tasks.filter(t => todayData[t.id]).length;
  const todayPct = Math.round((todayDone / tasks.length) * 100);

  const todayQuote = QUOTES[new Date().getDay() % QUOTES.length];

  const catStats = Object.entries(CATEGORIES).map(([key, cat]) => {
    const t = tasks.filter(t => t.category === key);
    const done = t.filter(t => todayData[t.id]).length;
    return { ...cat, key, total: t.length, done, pct: t.length ? Math.round((done / t.length) * 100) : 0 };
  }).filter(c => c.total > 0);

  const getLast7 = () => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0]; const data = allData[key] || {};
    const hasData = Object.keys(data).some(k => !k.startsWith("__"));
    const total = hasData ? (data.__total !== undefined ? data.__total : tasks.length) : 0;
    const done = hasData ? tasks.filter(t => data[t.id]).length : 0;
    return { key, label: d.toLocaleDateString("en", { weekday: "short" }), date: d.getDate(), done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0, isToday: key === today };
  });

  const getLast30 = () => Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().split("T")[0]; const data = allData[key] || {};
    const hasData = Object.keys(data).some(k => !k.startsWith("__"));
    const total = hasData ? (data.__total !== undefined ? data.__total : tasks.length) : 0;
    const done = hasData ? tasks.filter(t => data[t.id]).length : 0;
    return { key, done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0, isToday: key === today };
  });

  const week7 = getLast7();
  const month30 = getLast30();
  const weekAvg = Math.round(week7.reduce((a, d) => a + d.pct, 0) / 7);
  const monthAvg = Math.round(month30.reduce((a, d) => a + d.pct, 0) / 30);
  const streak = (() => { let s = 0; for (let i = 29; i >= 0; i--) { if (month30[i].pct >= 50) s++; else break; } return s; })();

  const motivation = () => {
    if (todayPct === 100) return "🏆 PERFECT DAY!";
    if (todayPct >= 80) return "🔥 Almost there!";
    if (todayPct >= 60) return "💪 Great work!";
    if (todayPct >= 40) return "👍 Good start!";
    if (todayPct >= 20) return "⚡ Keep going!";
    return "🌅 Start your day!";
  };

  const saveTask = t => {
    const parseTime = (timeStr) => {
      if (!timeStr) return 9999;
      const [time, period] = timeStr.split(" ");
      let [hours, mins] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return hours * 60 + (mins || 0);
    };
    const nt = tasks.map(x => x.id === t.id ? t : x)
      .sort((a, b) => parseTime(a.time) - parseTime(b.time));
    setTasks(nt);
    setLS("swaraj_tasks", nt);
    setModal(null);
    toast$("✅ Task updated & sorted!");
  };
  const addTask = t => {
    const parseTime = (timeStr) => {
      if (!timeStr) return 9999;
      const [time, period] = timeStr.split(" ");
      let [hours, mins] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      return hours * 60 + (mins || 0);
    };
    const nt = [...tasks, t].sort((a, b) => parseTime(a.time) - parseTime(b.time));
    setTasks(nt);
    setLS("swaraj_tasks", nt);
    setModal(null);
    toast$("✅ Task added & sorted by time!");
  };
  const delTask = id => { if (!window.confirm("Delete this task?")) return; const nt = tasks.filter(t => t.id !== id); setTasks(nt); setLS("swaraj_tasks", nt); toast$("🗑️ Deleted", "#f59e0b"); };

  const exportData = () => {
    const b = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
    const u = URL.createObjectURL(b); const a = document.createElement("a");
    a.href = u; a.download = `swaraj_backup_${today}.json`; a.click(); URL.revokeObjectURL(u);
    toast$("✅ Backup downloaded!");
  };

  const importData = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = ev => { try { const p = JSON.parse(ev.target.result); saveData(p); toast$("✅ Restored!"); } catch { toast$("❌ Invalid file!", "#ef4444"); } };
    r.readAsText(f); e.target.value = "";
  };

  /* ── Responsive values ── */
  const maxW = isDesktop ? 1300 : "100%";
  const outerPad = isDesktop ? "28px 40px" : isTablet ? "20px 24px" : "14px 12px";
  const cPad = isDesktop ? 22 : isTablet ? 18 : 14;
  const card = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: isDesktop ? 20 : 14, padding: cPad, marginBottom: isDesktop ? 18 : 12 };
  const ringSize = isDesktop ? 112 : isTablet ? 96 : 80;
  const headSize = isDesktop ? 30 : isTablet ? 26 : 20;
  const statSize = isDesktop ? 26 : 20;

  const FEATURES = [
    { id: "pomodoro", icon: "🍅", label: "Pomodoro" },
    { id: "leetcode", icon: "💡", label: "LeetCode" },
    { id: "jobs", icon: "📨", label: "Jobs" },
    { id: "notes", icon: "📓", label: "Notes" },
    { id: "skills", icon: "📈", label: "Skills" },
  ];

  /* Feature panels — 2 col desktop, 1 col mobile */
  const renderFeaturePanel = () => {
    const panels = {
      pomodoro: <Pomodoro />,
      leetcode: <LeetCode allData={allData} today={today} onSave={saveData} />,
      jobs: <JobLog allData={allData} today={today} onSave={saveData} />,
      notes: <Notes allData={allData} today={today} onSave={saveData} />,
      skills: <SkillBars allData={allData} tasks={tasks} />,
    };
    if (!activeFeature) return null;
    return <div style={{ marginBottom: 14 }}>{panels[activeFeature]}</div>;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: "#f1f5f9", overflowX: "hidden" }}>
      {/* BG gradient */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(ellipse at 15% 20%, rgba(139,92,246,0.09) 0%,transparent 55%), radial-gradient(ellipse at 85% 80%, rgba(59,130,246,0.07) 0%,transparent 55%)", pointerEvents: "none", zIndex: 0 }} />

      {/* CSS for responsive fine-tuning */}
      <style>{`
        * { box-sizing: border-box; }
        input, select, textarea { font-family: inherit; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius:2px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .task-row:hover { background: rgba(255,255,255,0.05) !important; }
        .feat-btn:hover { transform:translateY(-2px) !important; }
        .tab-btn:hover { color: #a78bfa !important; }
      `}</style>

      <div style={{ maxWidth: maxW, margin: "0 auto", padding: outerPad, position: "relative", zIndex: 1 }}>

        {/* ── HEADER ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: isDesktop ? 26 : 16, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#a78bfa", textTransform: "uppercase", marginBottom: 4, fontWeight: 600 }}>120-Day Job Ready Challenge</div>
            <h1 style={{ margin: 0, fontSize: headSize, fontWeight: 900, background: "linear-gradient(100deg,#a78bfa 0%,#60a5fa 50%,#34d399 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -0.5, lineHeight: 1.1 }}>
              Swaraj's Tracker
            </h1>
            <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "rgba(255,255,255,0.04)", borderRadius: 20, border: "1px solid rgba(16,185,129,0.25)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#10b981" }}>localStorage</span>
            </div>
          </div>
        </div>

        {/* ── QUOTE ── */}
        <div style={{ ...card, padding: "11px 16px", marginBottom: isDesktop ? 16 : 10, borderLeft: "3px solid #a78bfa", borderRadius: "0 14px 14px 0", background: "rgba(167,139,250,0.05)" }}>
          <div style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic", lineHeight: 1.6 }}>"{todayQuote}"</div>
        </div>

        {/* ── STATS BAR ── */}
        <div style={{ ...card, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", textAlign: "center", padding: `${cPad * 0.7}px ${cPad}px` }}>
          {[
            { val: streak, label: "Streak 🔥", color: "#f59e0b" },
            { val: `${weekAvg}%`, label: "Week Avg", color: "#10b981" },
            { val: `${monthAvg}%`, label: "Month Avg", color: "#a78bfa" },
            { val: `${todayDone}/${tasks.length}`, label: "Today", color: "#3b82f6" },
          ].map(s => (
            <div key={s.label} style={{ padding: "4px 0" }}>
              <div style={{ fontSize: statSize, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: isMobile ? 9 : 11, color: "#334155", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display: "flex", gap: 6, marginBottom: isDesktop ? 18 : 12, background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 5 }}>
          {["today", "week", "month"].map(v => (
            <button key={v} className="tab-btn" onClick={() => setView(v)}
              style={{
                flex: 1, padding: isMobile ? "9px 0" : "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700, fontSize: isMobile ? 12 : 13,
                background: view === v ? "rgba(167,139,250,0.25)" : "transparent",
                color: view === v ? "#a78bfa" : "#475569",
                borderBottom: view === v ? "2px solid #a78bfa" : "2px solid transparent",
                transition: "all .2s"
              }}>
              {v === "today" ? "📋 Today" : v === "week" ? "📅 Week" : "📆 Month"}
            </button>
          ))}
        </div>

        {/* ════ TODAY VIEW ════ */}
        {view === "today" && (
          <>
            {/* Desktop: 2-col layout for hero+mood */}
            <div style={{ display: isDesktop ? "grid" : "block", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {/* Progress hero */}
              <div style={{ ...card, display: "flex", alignItems: "center", gap: isDesktop ? 24 : 16, marginBottom: isDesktop ? 18 : 12 }}>
                <Ring pct={todayPct} size={ringSize} stroke={isDesktop ? 10 : 8} color="#a78bfa">
                  <span style={{ fontSize: isDesktop ? 20 : 16, fontWeight: 900, color: "#f1f5f9" }}>{todayPct}%</span>
                  <span style={{ fontSize: 9, color: "#475569", marginTop: 2 }}>{todayDone}/{tasks.length}</span>
                </Ring>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: isDesktop ? 17 : 14, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>{motivation()}</div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ height: "100%", width: `${todayPct}%`, background: "linear-gradient(90deg,#a78bfa,#60a5fa)", borderRadius: 20, transition: "width .6s ease", boxShadow: "0 0 12px rgba(167,139,250,.5)" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "#334155" }}>{tasks.length - todayDone} tasks remaining · Day {Math.min(120, streak + 1)}/120</div>
                </div>
              </div>

              {/* Mood */}
              <div style={{ ...card, marginBottom: isDesktop ? 18 : 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>😊 How's your mood today?</div>
                <div style={{ display: "flex", gap: isMobile ? 4 : 8, justifyContent: "space-between" }}>
                  {MOODS.map((m, i) => {
                    const mood = todayData.__mood ?? null;
                    return (
                      <button key={i} onClick={() => saveData({ ...allData, [today]: { ...todayData, __mood: i } })}
                        style={{ flex: 1, padding: isMobile ? "8px 2px" : "10px 4px", borderRadius: 12, border: `2px solid ${mood === i ? "#a78bfa" : "rgba(255,255,255,0.07)"}`, background: mood === i ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.03)", cursor: "pointer", fontSize: isMobile ? 18 : 22, transition: "all .2s", transform: mood === i ? "scale(1.12)" : "scale(1)" }}>
                        {m}
                      </button>
                    );
                  })}
                </div>
                {todayData.__mood != null && <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "#64748b" }}>{MOOD_LABELS[todayData.__mood]}</div>}
              </div>
            </div>

            {/* Category progress */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>Category Progress</div>
              <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "repeat(3,1fr)" : isTablet ? "repeat(3,1fr)" : "repeat(2,1fr)", gap: 10 }}>
                {catStats.filter(c => c.key !== "life").map(c => (
                  <div key={c.key} style={{ background: `${c.color}08`, border: `1px solid ${c.color}25`, borderRadius: 12, padding: "11px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{c.label}</span>
                      <span style={{ fontSize: 12, color: c.color, fontWeight: 700 }}>{c.done}/{c.total}</span>
                    </div>
                    <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 20, transition: "width .7s ease", boxShadow: `0 0 6px ${c.glow}` }} />
                    </div>
                    <div style={{ fontSize: 10, color: c.color, fontWeight: 700, marginTop: 4, textAlign: "right" }}>{c.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>⚡ Features</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: isMobile ? 6 : 10 }}>
                {FEATURES.map(f => (
                  <button key={f.id} className="feat-btn" onClick={() => setActiveFeature(activeFeature === f.id ? null : f.id)}
                    style={{ padding: isMobile ? "10px 4px" : "13px 8px", borderRadius: 14, border: `1px solid ${activeFeature === f.id ? "#a78bfa" : "rgba(255,255,255,0.07)"}`, background: activeFeature === f.id ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.03)", cursor: "pointer", textAlign: "center", transition: "all .2s" }}>
                    <div style={{ fontSize: isMobile ? 20 : 24 }}>{f.icon}</div>
                    <div style={{ fontSize: isMobile ? 9 : 11, color: activeFeature === f.id ? "#a78bfa" : "#475569", fontWeight: 600, marginTop: 4 }}>{f.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active feature panel */}
            {renderFeaturePanel()}

            {/* Task list */}
            <div style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>Today's Tasks ({todayDone}/{tasks.length})</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setModal({ id: "", label: "", time: "", category: "dsa", icon: "📚" })}
                    style={{ padding: "5px 12px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>+ Add</button>
                  <button onClick={() => { if (!window.confirm("Reset to default tasks?")) return; setTasks(DEFAULT_TASKS); setLS("swaraj_tasks", DEFAULT_TASKS); toast$("🔄 Reset!"); }}
                    style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#475569", cursor: "pointer", fontSize: 12 }}>Reset</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr", gap: isMobile ? 5 : 7 }}>
                {tasks.map(task => {
                  const done = !!todayData[task.id];
                  const cat = CATEGORIES[task.category] || CATEGORIES.life;
                  return (
                    <div key={task.id} className="task-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: isMobile ? "10px 10px" : "11px 12px", borderRadius: 12, background: done ? `${cat.color}12` : "rgba(255,255,255,0.025)", border: `1px solid ${done ? cat.color + "44" : "rgba(255,255,255,0.05)"}`, transition: "all .2s" }}>
                      <div onClick={() => toggle(task.id)} style={{ width: 22, height: 22, borderRadius: 7, border: `2px solid ${done ? cat.color : "#64748B"}`, background: done ? cat.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all .2s", boxShadow: done ? `0 0 8px ${cat.glow}` : "none" }}>
                        {done && <span style={{ fontSize: 12, color: "#fff", fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: isMobile ? 15 : 17, flexShrink: 0 }}>{task.icon}</span>
                      <div onClick={() => toggle(task.id)} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}>
                        <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 600, color: done ? "#334155" : "#e2e8f0", textDecoration: done ? "line-through" : "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.label}</div>
                        <div style={{ fontSize: 10, color: "#64748B", marginTop: 1 }}>{task.time} · <span style={{ color: cat.color }}>{cat.label}</span></div>
                      </div>
                      <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                        <button onClick={() => setModal(task)} style={{ width: 26, height: 26, borderRadius: 7, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#475569", cursor: "pointer", fontSize: 11 }}>✏️</button>
                        <button onClick={() => delTask(task.id)} style={{ width: 26, height: 26, borderRadius: 7, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#475569", cursor: "pointer", fontSize: 11 }}>🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ════ WEEK VIEW ════ */}
        {view === "week" && (
          <>
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 16 }}>Last 7 Days Performance</div>
              <div style={{ display: "flex", gap: isMobile ? 6 : 12, justifyContent: "space-between", alignItems: "flex-end", height: isDesktop ? 160 : 120 }}>
                {week7.map(d => (
                  <div key={d.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <div style={{ fontSize: isMobile ? 9 : 11, color: d.pct >= 70 ? "#10b981" : d.pct >= 40 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{d.pct}%</div>
                    <div style={{ width: "100%", borderRadius: "5px 5px 0 0", height: `${Math.max(4, d.pct * (isDesktop ? 1.4 : 0.9))}px`, background: d.isToday ? "linear-gradient(180deg,#a78bfa,#60a5fa)" : d.pct >= 70 ? "#10b981" : d.pct >= 40 ? "#f59e0b55" : "rgba(255,255,255,0.07)", transition: "height .5s ease", boxShadow: d.isToday ? "0 0 12px rgba(167,139,250,.5)" : "none" }} />
                    <div style={{ fontSize: isMobile ? 9 : 11, color: d.isToday ? "#a78bfa" : "#334155", fontWeight: d.isToday ? 700 : 400 }}>{d.label}</div>
                    <div style={{ fontSize: 9, color: "#64748B" }}>{d.date}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={card}>
              {week7.map(d => (
                <div key={d.key} style={{ marginBottom: 11 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, color: d.isToday ? "#a78bfa" : "#64748b", fontWeight: d.isToday ? 700 : 400 }}>{d.isToday ? "Today" : d.label} {d.date}</span>
                    <span style={{ fontSize: 13, color: d.pct >= 70 ? "#10b981" : d.pct >= 40 ? "#f59e0b" : "#ef4444", fontWeight: 700 }}>{d.done}/{d.total} ({d.pct}%)</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 20, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${d.pct}%`, background: d.isToday ? "linear-gradient(90deg,#a78bfa,#60a5fa)" : d.pct >= 70 ? "#10b981" : "#f59e0b", borderRadius: 20, transition: "width .6s" }} />
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 14, padding: 14, background: "rgba(167,139,250,0.08)", borderRadius: 14, textAlign: "center", border: "1px solid rgba(167,139,250,0.15)" }}>
                <div style={{ fontSize: 16, color: "#a78bfa", fontWeight: 800 }}>Week Average: {weekAvg}%</div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{weekAvg >= 70 ? "🔥 Excellent week!" : weekAvg >= 50 ? "👍 Good progress!" : "💪 Push harder!"}</div>
              </div>
            </div>
            <SkillBars allData={allData} tasks={tasks} />
          </>
        )}

        {/* ════ MONTH VIEW ════ */}
        {view === "month" && (
          <>
            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 14 }}>30-Day Heatmap</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(10,1fr)", gap: isMobile ? 4 : 6 }}>
                {month30.map((d, i) => (
                  <div key={i} title={`${d.key}: ${d.pct}%`}
                    style={{ aspectRatio: "1", borderRadius: isMobile ? 4 : 6, background: d.pct === 0 ? "rgba(255,255,255,0.04)" : d.pct < 30 ? "#1e1b4b" : d.pct < 50 ? "#4c1d95" : d.pct < 70 ? "#7c3aed" : d.pct < 90 ? "#a78bfa" : "#c4b5fd", border: d.isToday ? "2px solid #60a5fa" : "none", boxShadow: d.pct >= 90 ? "0 0 6px #a78bfa80" : d.isToday ? "0 0 6px #60a5fa80" : "none" }} />
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#334155" }}>Less</span>
                {["rgba(255,255,255,0.04)", "#1e1b4b", "#4c1d95", "#7c3aed", "#a78bfa", "#c4b5fd"].map((c, i) => (
                  <div key={i} style={{ width: 14, height: 14, borderRadius: 4, background: c }} />
                ))}
                <span style={{ fontSize: 10, color: "#334155" }}>More</span>
              </div>
            </div>

            <div style={{ ...card, display: "grid", gridTemplateColumns: isDesktop ? "repeat(4,1fr)" : isTablet ? "repeat(4,1fr)" : "repeat(2,1fr)", gap: isDesktop ? 14 : 10 }}>
              {[
                { label: "Month Avg", value: `${monthAvg}%`, color: "#a78bfa", icon: "📊" },
                { label: "Current Streak", value: `${streak} days`, color: "#f59e0b", icon: "🔥" },
                { label: "Days Tracked", value: `${month30.filter(d => d.done > 0).length}`, color: "#10b981", icon: "📅" },
                { label: "Perfect Days", value: `${month30.filter(d => d.pct === 100).length}`, color: "#60a5fa", icon: "🏆" },
              ].map(s => (
                <div key={s.label} style={{ background: `${s.color}10`, border: `1px solid ${s.color}25`, borderRadius: 14, padding: isDesktop ? "18px 14px" : "12px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: isDesktop ? 26 : 20, marginBottom: 5 }}>{s.icon}</div>
                  <div style={{ fontSize: isDesktop ? 24 : 18, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 12 }}>Monthly Trend</div>
              <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: isDesktop ? 120 : 80 }}>
                {month30.map((d, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", height: `${Math.max(2, d.pct * (isDesktop ? 1.1 : 0.75))}px`, background: d.isToday ? "#60a5fa" : d.pct >= 70 ? "#10b981" : d.pct >= 40 ? "#f59e0b" : d.pct > 0 ? "#ef444466" : "rgba(255,255,255,0.04)", transition: "height .3s" }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 10, color: "#64748B" }}>30 days ago</span>
                <span style={{ fontSize: 10, color: "#64748B" }}>Today</span>
              </div>
            </div>
          </>
        )}

        {/* ── BACKUP ── */}
        <div style={{ marginBottom: 6 }}>
          <button onClick={() => setShowBackup(v => !v)}
            style={{ width: "100%", padding: "11px", borderRadius: 14, border: "1px solid rgba(167,139,250,0.2)", background: showBackup ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.02)", color: "#a78bfa", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            🔒 Backup & Restore {showBackup ? "▲" : "▼"}
          </button>
        </div>
        {showBackup && (
          <div style={{ background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 14, padding: 14, marginBottom: 14, display: "flex", flexDirection: isMobile ? "column" : "row", gap: 8 }}>
            <button onClick={exportData} style={{ flex: 1, padding: "11px", borderRadius: 10, border: "none", background: "linear-gradient(90deg,#10b981,#059669)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              📥 Export Backup
            </button>
            <label style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "11px", borderRadius: 10, background: "linear-gradient(90deg,#3b82f6,#2563eb)", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              📤 Import Backup <input type="file" accept=".json" onChange={importData} style={{ display: "none" }} />
            </label>
            <button onClick={() => { if (!window.confirm("Reset today's progress?")) return; saveData({ ...allData, [today]: {} }); toast$("🔄 Reset!", "#f59e0b"); }}
              style={{ flex: 1, padding: "11px", borderRadius: 10, border: "1px solid #ef444430", background: "rgba(239,68,68,0.06)", color: "#ef4444", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              🔄 Reset Today
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", fontSize: 11, color: "#CBD5E1", paddingBottom: 32, marginTop: 4 }}>
          Made with 💜 for Swaraj · 120-Day Challenge 🚀
        </div>
      </div>

      {/* ── MODAL ── */}
      {modal && <TaskModal task={modal} onSave={modal.id ? saveTask : addTask} onClose={() => setModal(null)} />}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: toast.color, color: "#fff", padding: "12px 22px", borderRadius: 14, fontWeight: 700, fontSize: 13, zIndex: 2000, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", whiteSpace: "nowrap", animation: "fadeUp .2s ease" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}