import { createContext, useContext, useEffect, useRef, useState } from "react";
const Context = createContext(null);
export const useAccount = () => useContext(Context);

async function api(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { "Content-Type": "application/json", ...options.headers } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(body.error || "Your account could not be updated. Please try again."); error.status = response.status; throw error; }
  return body;
}
export function AccountProvider({ children }) {
  const [user, setUser] = useState(null), [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true), [pending, setPending] = useState([]);
  const [notice, setNotice] = useState("");
  const inFlight = useRef(new Set());
  useEffect(() => {
    const controller = new AbortController();
    api("/api/account", { signal: controller.signal }).then(data => { setUser(data.user); setSaved(data.saved); }).catch(error => {
      if (error.name !== "AbortError" && error.status !== 401) setNotice("Account storage is temporarily unavailable. Please try again shortly.");
    }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(""), 6000); return () => clearTimeout(timer); }, [notice]);
  const toggle = async id => {
    if (loading || inFlight.current.has(id)) return;
    if (!user) { window.location.assign("/signin-with-chatgpt?return_to=%2F%23trending"); return; }
    inFlight.current.add(id); setPending([...inFlight.current]);
    const wasSaved = saved.includes(id);
    setSaved(list => wasSaved ? list.filter(item => item !== id) : [...new Set([...list, id])]);
    try {
      await api(`/api/saved/${encodeURIComponent(id)}`, { method: wasSaved ? "DELETE" : "PUT" });
      setNotice(wasSaved ? "Property removed from your saved homes." : "Property saved to your account.");
    } catch (error) {
      setSaved(list => wasSaved ? [...new Set([...list, id])] : list.filter(item => item !== id));
      setNotice(error.message);
    } finally { inFlight.current.delete(id); setPending([...inFlight.current]); }
  };
  const update = async fields => {
    const data = await api("/api/account", { method: "PATCH", body: JSON.stringify(fields) });
    setUser(data.user); setNotice("Your account has been updated.");
  };
  return <Context.Provider value={{ user, saved, loading, pending, toggle, update, notice }}>
    {children}
    {notice && <div className="account-toast" role="status">{notice}</div>}
  </Context.Provider>;
}
