import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } 
from "@/components/ui/avatar";
import { Link2Icon, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import supabase from "@/db/supabase";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/");
  };

  return (
    <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo.png" className="h-10 w-auto object-contain" alt="Linkora logo" />
        <span className="font-display text-lg font-semibold tracking-tight">Linkora</span>
      </Link>
      <div className="hidden items-center gap-2 sm:flex">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className={location.pathname === "/dashboard" ? "bg-white/10" : ""}>My links</Button>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full" aria-label="Open profile menu">
              <Avatar><AvatarImage src={user.avatar} /><AvatarFallback>{user.email?.slice(0, 2).toUpperCase() || "LU"}</AvatarFallback></Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/dashboard")}><Link2Icon className="mr-2 h-4 w-4" />My links</DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-red-400"><LogOut className="mr-2 h-4 w-4" />Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : <Button onClick={() => navigate("/auth")}>Get started</Button>}
      </div>
      <button className="rounded-lg p-2 text-slate-300 sm:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        {menuOpen ? <X /> : <Menu />}
      </button>
      {menuOpen && <div className="glass absolute left-6 right-6 top-16 rounded-2xl p-3 sm:hidden">
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>My links</Button>
        {user ? <Button variant="ghost" className="w-full justify-start text-red-300" onClick={logout}>Log out</Button> : <Button className="mt-1 w-full" onClick={() => navigate("/auth")}>Get started</Button>}
      </div>}

    </nav>
  );
};

export default Header;
