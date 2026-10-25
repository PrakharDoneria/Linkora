import { ArrowRight, BarChart3, Check, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();
  const submit = (event) => {
    event.preventDefault();
    if (longUrl.trim()) navigate(`/auth?createNew=${encodeURIComponent(longUrl.trim())}`);
  };

  return (
    <div className="pb-20">
      <section className="grid items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:pt-24">
        <div className="animate-rise">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-semibold text-violet-200"><Sparkles size={14} /> The smarter way to share</div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl">Links that work <span className="bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">harder.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">Turn long, messy URLs into short links that are easy to remember, share, and understand.</p>
          <form onSubmit={submit} className="glass mt-9 flex flex-col gap-2 rounded-2xl p-2 sm:flex-row">
            <Input required type="url" value={longUrl} onChange={(event) => setLongUrl(event.target.value)} placeholder="Paste a long URL to get started..." className="h-12 border-0 bg-transparent px-4 text-white shadow-none focus-visible:ring-0" />
            <Button type="submit" size="lg" className="h-12 shrink-0 rounded-xl bg-violet-500 px-6 hover:bg-violet-400">Shorten link <ArrowRight size={17} /></Button>
          </form>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500"><span><Check className="mr-1 inline text-cyan-300" size={15} />Free to try</span><span><Check className="mr-1 inline text-cyan-300" size={15} />No credit card</span><span><Check className="mr-1 inline text-cyan-300" size={15} />Private by default</span></div>
        </div>
        <div className="animate-rise delay-2 relative">
          <div className="absolute -inset-8 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="glass relative rounded-3xl p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between"><div><p className="text-sm text-slate-400">Link performance</p><p className="mt-1 font-display text-2xl font-bold">This week</p></div><div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300"><BarChart3 /></div></div>
            <div className="flex h-40 items-end gap-2 sm:gap-3">{[35, 50, 42, 72, 58, 85, 68, 96, 78, 100, 88, 94].map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-violet-600 to-cyan-300 opacity-80 transition-all hover:opacity-100" style={{ height: `${height}%` }} />)}</div>
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5"><div><p className="text-3xl font-bold">2,481</p><p className="text-sm text-slate-500">total clicks</p></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">+24.8%</span></div>
          </div>
        </div>
      </section>
      <section className="grid gap-4 px-6 sm:grid-cols-3">
        {[{ icon: Zap, title: "Instantly short", text: "A clean, memorable link in one click." }, { icon: BarChart3, title: "See what works", text: "Simple analytics that help you learn." }, { icon: ShieldCheck, title: "Built for trust", text: "Reliable redirects and privacy first." }].map((feature, index) => { const FeatureIcon = feature.icon; return <div className={`glass animate-rise delay-${index + 1} rounded-2xl p-6`} key={feature.title}><FeatureIcon className="mb-5 text-cyan-300" size={23} /><h2 className="font-display text-lg font-semibold">{feature.title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{feature.text}</p></div>; })}
      </section>
      <section className="px-6 pt-24 text-center"><p className="text-sm font-semibold uppercase tracking-[.2em] text-violet-300">Everything in one place</p><h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold sm:text-4xl">Your links deserve a better home.</h2><p className="mx-auto mt-4 max-w-xl text-slate-400">Create, organize, and share your links without the clutter. Linkora keeps the important stuff close.</p></section>
    </div>
  );
};

export default LandingPage;
