export const fmtTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const fmtDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const groupByDate = (msgs) => {
  const groups = [];
  let lastDate = null;
  for (const m of msgs) {
    const date = fmtDate(m.createdAt || m.time);
    if (date !== lastDate) {
      groups.push({ type: "date", label: date });
      lastDate = date;
    }
    groups.push({ type: "msg", ...m });
  }
  return groups;
};
