import { ArrowLeft, ExternalLink, Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getLinkByCode, incrementLinkClick } from "@/lib/utils";

const RedirectLink = () => {
  const { id } = useParams();
  const [link, setLink] = useState(undefined);
  useEffect(() => {
    getLinkByCode(id).then(setLink).catch(() => setLink(null));
  }, [id]);
  useEffect(() => {
    if (!link) return;
    incrementLinkClick(id).catch((error) => console.error("Unable to record link click:", error));
    const timer = setTimeout(() => window.location.assign(link.original_url), 1200);
    return () => clearTimeout(timer);
  }, [id, link]);
  if (link === undefined) return <div className="flex min-h-[70vh] items-center justify-center px-6 text-slate-400">Finding your link...</div>;
  if (!link) return <div className="px-6 py-24 text-center"><Link2 className="mx-auto text-violet-300" size={32} /><h1 className="mt-5 font-display text-3xl font-bold">That link doesn’t exist.</h1><p className="mt-2 text-slate-400">It may have been deleted or typed incorrectly.</p><Link to="/" className="mt-6 inline-flex items-center gap-2 text-cyan-300"><ArrowLeft size={16} /> Go home</Link></div>;
  return <div className="flex min-h-[70vh] items-center justify-center px-6"><div className="glass max-w-md rounded-3xl p-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300"><ExternalLink /></div><h1 className="mt-6 font-display text-2xl font-bold">Taking you there...</h1><p className="mt-2 text-sm text-slate-400">Redirecting to <span className="text-slate-200">{new URL(link.original_url).hostname}</span></p><div className="mt-7 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-cyan-300 to-violet-400" /></div></div></div>;
};

export default RedirectLink;
