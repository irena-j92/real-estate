import { useEffect, useRef, useState } from "react";
import { FiUser, FiHeart, FiSettings, FiLogOut, FiX } from "react-icons/fi";
import { useAccount } from "../state/AccountContext";
import { properties } from "../data/properties";
import HoverControl from "./ui/HoverControl";

export default function AccountMenu({ onOpen }) {
  const { user, saved, loading, pending, toggle, update } = useAccount();
  const [opened, setOpened] = useState(false), [panel, setPanel] = useState(null);
  const [name, setName] = useState(""), [area, setArea] = useState(""), [alerts, setAlerts] = useState(false);
  const [submitting, setSubmitting] = useState(false), [error, setError] = useState("");
  const root = useRef(null), trigger = useRef(null), dialog = useRef(null);
  useEffect(() => { setName(user?.name || ""); setArea(user?.area || ""); setAlerts(user?.alerts || false); }, [user]);
  useEffect(() => {
    if (!opened) return;
    const outside = event => { if (!root.current?.contains(event.target)) setOpened(false); };
    const key = event => {
      if (event.key === "Escape") { setOpened(false); trigger.current?.focus(); }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const items = [...root.current.querySelectorAll('.account-dropdown button, .account-dropdown a')];
        const index = items.indexOf(document.activeElement);
        const next = event.key === "ArrowDown" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
        event.preventDefault(); items[next]?.focus();
      }
    };
    document.addEventListener("pointerdown", outside); root.current.addEventListener("keydown", key);
    const element = root.current;
    return () => { document.removeEventListener("pointerdown", outside); element.removeEventListener("keydown", key); };
  }, [opened]);
  useEffect(() => {
    if (!panel) return;
    const element = dialog.current, old = document.body.style.overflow;
    document.body.style.overflow = "hidden"; element.showModal();
    return () => { element.close(); document.body.style.overflow = old; trigger.current?.focus(); };
  }, [panel]);
  const openPanel = value => { setOpened(false); setError(""); setPanel(value); };
  const submit = async event => {
    event.preventDefault(); setSubmitting(true); setError("");
    try { await update(panel === "profile" ? { name } : { area, alerts }); }
    catch (failure) { setError(failure.message); }
    finally { setSubmitting(false); }
  };
  const chooseHome = id => {
    setPanel(null);
    if (!document.getElementById("trending")) { window.location.assign(`/?property=${encodeURIComponent(id)}#trending`); return; }
    window.dispatchEvent(new CustomEvent("realty-select-property", { detail: id }));
    requestAnimationFrame(() => document.getElementById("trending")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }));
  };
  return <div className="account-control" ref={root}>
    <HoverControl as="button" ref={trigger} type="button" className="header-account-button" aria-label="Your account" aria-haspopup="menu" aria-expanded={opened} aria-controls="account-dropdown"
      onClick={() => { onOpen?.(); setOpened(value => !value); }}><FiUser size={22} strokeWidth={1.25} aria-hidden="true" /></HoverControl>
    {opened && <nav className="account-dropdown" id="account-dropdown" aria-label="Your account" role="menu">
      <button role="menuitem" type="button" onClick={() => openPanel("profile")}><FiUser />My Profile</button>
      <button role="menuitem" type="button" onClick={() => openPanel("saved")}><FiHeart />Saved<small>{saved.length}</small></button>
      <button role="menuitem" type="button" onClick={() => openPanel("settings")}><FiSettings />Settings</button>
      <a role="menuitem" href="/signout-with-chatgpt?return_to=%2F" target="_top"><FiLogOut />Log out</a>
    </nav>}
    {panel && <dialog ref={dialog} className="account-panel" aria-labelledby="account-heading" onCancel={event => { event.preventDefault(); setPanel(null); }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const box = event.currentTarget.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) setPanel(null);
    }}>
      <header><h2 id="account-heading">{panel === "profile" ? "My Profile" : panel === "saved" ? "Saved Homes" : "Settings"}</h2>
        <button data-no-hover className="panel-close" type="button" aria-label="Close account" onClick={() => setPanel(null)}><FiX strokeWidth={0.8} size={28} /></button></header>
      {loading ? <p role="status">Loading your account…</p> : !user ? <p><a href="/signin-with-chatgpt?return_to=%2F" target="_top">Sign in to save homes and manage your profile.</a></p> : panel === "saved" ? <>
        {saved.length === 0 ? <p>Your collection starts here. Tap the heart on a property to save it.</p> : properties.filter(property => saved.includes(property.id)).map(property => <article className="saved-home" key={property.id}>
          <img src={property.image} alt={property.title} loading="lazy" />
          <div><button className="saved-title" type="button" onClick={() => chooseHome(property.id)}>{property.title}</button><p>{property.price}</p></div>
          <button className="remove-saved" type="button" disabled={pending.includes(property.id)} aria-label={`Unsave ${property.title}`} onClick={() => toggle(property.id)}><FiHeart fill="currentColor" /></button>
        </article>)}
      </> : <form onSubmit={submit}>
        {panel === "profile" ? <><p className="account-email">{user.email}</p><label>Display name<input value={name} onChange={event => setName(event.target.value)} maxLength={100} autoComplete="name" required /></label></> : <>
          <label>Preferred area<input value={area} onChange={event => setArea(event.target.value)} maxLength={120} placeholder="e.g. a city or neighborhood" /></label>
          <label className="check-label"><input type="checkbox" checked={alerts} onChange={event => setAlerts(event.target.checked)} />Remember my interest in new property alerts</label>
          <p className="account-email">Your preferences are saved with your account.</p>
        </>}
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting} className="account-submit">{submitting ? "Saving…" : "Save changes"}</button>
      </form>}
    </dialog>}
  </div>;
}
