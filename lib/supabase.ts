/**
 * Client Supabase — serveur uniquement.
 *
 * N'importez ce fichier que depuis des API routes ou des Server Components.
 * La clé service role ne doit JAMAIS être exposée au navigateur.
 */

import { createClient } from '@supabase/supabase-js'

// deno-lint-ignore no-explicit-any — postgrest-js generics incompatibility
let _clientInstance: any = null

function buildClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase env vars missing. Copy .env.local.example → .env.local and fill in the values.',
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/**
 * Client admin (service role). Bypass RLS — à utiliser uniquement
 * côté serveur, jamais dans du code client ou des composants client.
 *
 * Lazy-initialized pour éviter l'erreur au build time.
 * L'API Supabase est typée via des casts explicites DbReservation
 * aux call sites, car les génériques postgrest-js ≥ 1.18 sont
 * incompatibles avec les types Database artisanaux sans génération CLI.
 */
export function getSupabaseAdmin() {
  if (!_clientInstance) {
    _clientInstance = buildClient()
  }
  // Return as unknown then any to fully erase the SupabaseClient generics.
  // Type safety is enforced via explicit DbReservation casts at call sites.
  return _clientInstance as unknown as {
    from(table: string): {
      select(cols?: string): any
      insert(data: Record<string, unknown>): any
      update(data: Record<string, unknown>): any
      delete(): any
      upsert(data: Record<string, unknown>): any
    }
  }
}
