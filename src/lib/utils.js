import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import supabase from "@/db/supabase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function getLinks(userId) {
  const { data, error } = await supabase
    .from("links")
    .select("id, original_url, short_code, clicks, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function saveLink(originalUrl, userId, customCode = "") {
  const shortCode = customCode.trim() || Math.random().toString(36).slice(2, 8);
  const { data, error } = await supabase
    .from("links")
    .insert({ original_url: originalUrl, short_code: shortCode, user_id: userId })
    .select("id, original_url, short_code, clicks, created_at")
    .single();
  if (error) throw error;
  return data;
}

export async function getLinkByCode(shortCode) {
  const { data, error } = await supabase.rpc("resolve_link", { code: shortCode });
  if (error) throw error;
  return data?.[0] ?? null;
}

export async function incrementLinkClick(shortCode) {
  const { error } = await supabase.rpc("increment_link_click", { code: shortCode });
  if (error) throw error;
}
