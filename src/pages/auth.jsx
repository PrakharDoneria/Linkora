import { ArrowLeft, ArrowRight, Link2, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveLink } from "@/lib/utils";
import supabase from "@/db/supabase";

const Auth = () => {
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const createNew = params.get("createNew");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    const authResult = error
      ? await supabase.auth.signUp({ email, password })
      : { data, error: null };
    if (authResult.error) {
      setErrorMessage(authResult.error.message);
      setSubmitting(false);
      return;
    }
    if (createNew && authResult.data.user) {
      try {
        await saveLink(createNew, authResult.data.user.id);
      } catch (linkError) {
        setErrorMessage(linkError.message);
        setSubmitting(false);
        return;
      }
    }
    navigate("/dashboard");
  };
  return <div className="mx-auto grid max-w-4xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
    <div className="hidden lg:block"><Link2 className="mb-6 text-cyan-300" size={38} /><h1 className="font-display text-5xl font-bold leading-tight">Make every link count.</h1><p className="mt-5 leading-7 text-slate-400">Sign in to your Linkora workspace and keep your best links within reach.</p></div>
    <div className="glass animate-rise rounded-3xl p-7 sm:p-10"><Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} /> Back home</Link><h1 className="font-display text-3xl font-bold">{createNew ? "One step from your link" : "Welcome to Linkora"}</h1><p className="mt-2 text-slate-400">{createNew ? "Create a free workspace to save your short link." : "Your link dashboard is waiting."}</p><form onSubmit={submit} className="mt-8 space-y-4"><label className="block text-sm font-medium text-slate-300">Email address<div className="relative mt-2"><Mail className="absolute left-3 top-3 text-slate-500" size={17} /><Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-11 pl-10" /></div></label><label className="block text-sm font-medium text-slate-300">Password<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 text-slate-500" size={17} /><Input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="h-11 pl-10" /></div></label>{errorMessage && <p role="alert" className="text-sm text-red-300">{errorMessage}</p>}<Button disabled={submitting} className="h-11 w-full bg-violet-500 hover:bg-violet-400" type="submit">{submitting ? "Connecting..." : "Continue"} <ArrowRight size={17} /></Button></form><p className="mt-5 text-center text-xs text-slate-500">Existing users sign in automatically. New users are registered securely with Supabase Auth.</p></div>
  </div>;
};

export default Auth;
