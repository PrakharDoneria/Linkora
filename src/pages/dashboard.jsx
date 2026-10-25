import { BarChart3, Copy, ExternalLink, Link2, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLinks, saveLink } from "@/lib/utils";
import supabase from "@/db/supabase";

const Dashboard = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState("");
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      setUser(data.user);
      if (data.user) {
        try {
          setLinks(await getLinks(data.user.id));
        } catch (error) {
          setErrorMessage(error.message);
        }
      }
    });
    return () => { active = false; };
  }, []);
  const visibleLinks = useMemo(() => links.filter((link) => link.originalUrl.toLowerCase().includes(query.toLowerCase()) || link.code.includes(query.toLowerCase())), [links, query]);
  const addLink = async (event) => { event.preventDefault(); if (!url.trim() || !user) return; try { const link = await saveLink(url.trim(), user.id); setLinks((current) => [link, ...current]); setUrl(""); navigator.clipboard?.writeText(`${window.location.origin}/${link.short_code}`); } catch (error) { setErrorMessage(error.message); } };
  const remove = async (id) => { const { error } = await supabase.from("links").delete().eq("id", id); if (error) { setErrorMessage(error.message); return; } setLinks((current) => current.filter((link) => link.id !== id)); };
  const copy = (code) => navigator.clipboard?.writeText(`${window.location.origin}/${code}`);
  if (user === undefined) return <div className="px-6 py-24 text-center text-slate-400">Loading your workspace...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  const clicks = links.reduce((total, link) => total + link.clicks, 0);
  return <div className="px-6 py-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm text-cyan-300">Your workspace</p><h1 className="mt-2 font-display text-4xl font-bold">Good to see you.</h1><p className="mt-2 text-slate-400">Manage your links and watch them travel.</p></div><Button onClick={() => document.getElementById("new-link")?.focus()} className="bg-violet-500 hover:bg-violet-400"><Plus size={17} /> New link</Button></div>
    <form onSubmit={addLink} className="glass mt-9 flex flex-col gap-2 rounded-2xl p-2 sm:flex-row"><Input id="new-link" required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Paste another long URL..." className="h-12 border-0 bg-transparent px-4 shadow-none focus-visible:ring-0" /><Button type="submit" className="h-12 bg-cyan-500 text-slate-950 hover:bg-cyan-300">Create short link</Button></form>{errorMessage && <p role="alert" className="mt-3 text-sm text-red-300">{errorMessage}</p>}
    <div className="mt-8 grid gap-4 sm:grid-cols-3">{[{ label: "Total links", value: links.length, icon: Link2 }, { label: "Total clicks", value: clicks, icon: BarChart3 }, { label: "Avg. engagement", value: links.length ? `${Math.round(clicks / links.length)} clicks` : "—", icon: ExternalLink }].map((stat) => { const StatIcon = stat.icon; return <div className="glass rounded-2xl p-5" key={stat.label}><StatIcon size={19} className="text-violet-300" /><p className="mt-5 text-2xl font-bold">{stat.value}</p><p className="mt-1 text-sm text-slate-500">{stat.label}</p></div>; })}</div>
    <div className="mt-12"><div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><h2 className="font-display text-xl font-semibold">Your links</h2><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-2.5 text-slate-500" size={16} /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search links" className="h-9 pl-9" /></div></div>{visibleLinks.length ? <div className="space-y-3">{visibleLinks.map((link) => <div className="glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between" key={link.id}><div className="min-w-0"><div className="flex items-center gap-2 text-sm font-semibold text-cyan-300"><Link2 size={15} />{window.location.host}/{link.short_code}</div><p className="mt-2 truncate text-sm text-slate-400">{link.original_url}</p></div><div className="flex shrink-0 gap-1"><Button variant="ghost" size="icon" onClick={() => copy(link.short_code)} aria-label="Copy link"><Copy size={16} /></Button><Button variant="ghost" size="icon" onClick={() => navigate(`/link/${link.short_code}`)} aria-label="View link details"><BarChart3 size={16} /></Button><Button variant="ghost" size="icon" className="text-red-300" onClick={() => remove(link.id)} aria-label="Delete link"><Trash2 size={16} /></Button></div></div>)}</div> : <div className="glass rounded-2xl p-10 text-center"><Link2 className="mx-auto text-slate-600" size={30} /><p className="mt-4 font-semibold">No links yet</p><p className="mt-1 text-sm text-slate-500">Paste a URL above to create your first short link.</p></div>}</div>
  </div>;
};

export default Dashboard;
