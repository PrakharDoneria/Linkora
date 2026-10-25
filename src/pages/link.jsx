import { ArrowLeft, Check, Copy, ExternalLink, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getLinkByCode } from "@/lib/utils";

const LinkPage = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState(undefined);
  useEffect(() => {
    getLinkByCode(id).then(setLink).catch(() => setLink(null));
  }, [id]);
  if (link === undefined) return <div className="px-6 py-24 text-center text-slate-400">Loading link details...</div>;
  if (!link) return <div className="px-6 py-24 text-center"><h1 className="font-display text-3xl font-bold">Link not found</h1><Link className="mt-4 inline-block text-cyan-300" to="/dashboard">Back to dashboard</Link></div>;
  const shortUrl = `${window.location.origin}/${link.short_code}`;
  const copy = () => { navigator.clipboard?.writeText(shortUrl); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  return <div className="mx-auto max-w-3xl px-6 py-16"><Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-400"><ArrowLeft size={16} /> Back to links</Link><div className="glass mt-8 rounded-3xl p-7 sm:p-10"><Link2 className="text-cyan-300" size={30} /><h1 className="mt-5 font-display text-3xl font-bold">Your short link is ready.</h1><p className="mt-2 text-slate-400">Share it anywhere. We’ll handle the redirect.</p><div className="mt-8 flex flex-col gap-3 rounded-2xl bg-slate-950/60 p-4 sm:flex-row sm:items-center sm:justify-between"><span className="truncate font-semibold text-cyan-300">{shortUrl}</span><Button onClick={copy} variant="secondary">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : "Copy"}</Button></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-white/10 p-5"><p className="text-sm text-slate-500">Destination</p><p className="mt-2 truncate text-sm">{link.original_url}</p></div><div className="rounded-2xl border border-white/10 p-5"><p className="text-sm text-slate-500">Clicks</p><p className="mt-2 text-2xl font-bold">{link.clicks}</p></div></div><a href={link.original_url} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">Open destination <ExternalLink size={15} /></a></div></div>;
};

export default LinkPage;
