import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import sha256 from "crypto-js/sha256";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateClientToken() {
  const secret = import.meta.env.HEADER_SECRET_TOKEN || ""; // défini dans .env
  const now = new Date();
  const rounded = Math.floor(now.getTime() / (1000 * 60 * 20)); // arrondi à 20 minutes -> Risque si la personne fait son appel à 13h39:59
  return sha256(`${secret}:${rounded}`).toString();
};