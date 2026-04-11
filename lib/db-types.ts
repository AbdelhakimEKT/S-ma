/**
 * Types de base de données — miroir exact du schéma Supabase.
 * Utilisés pour typer le client Supabase et les API routes.
 */

export type ReservationStatus =
  | 'pending_payment'  // Créée, en attente de paiement Stripe
  | 'confirmed'        // Acompte payé — réservation confirmée
  | 'cancelled'        // Annulée (client ou admin)
  | 'failed'           // Paiement échoué

export interface DbReservation {
  id: string
  ritual_slug: string
  ritual_name: string
  date: string                   // "YYYY-MM-DD"
  start_time: string             // "HH:MM:SS"
  end_time: string               // "HH:MM:SS"
  duration_minutes: number
  guests: number
  total_eur: number              // en euros
  deposit_eur: number            // en euros (≈ 30 %)
  status: ReservationStatus
  stripe_session_id: string | null
  stripe_payment_status: string | null
  guest_first_name: string
  guest_last_name: string
  guest_email: string
  guest_phone: string
  guest_notes: string | null
  guest_newsletter: boolean
  created_at: string
  updated_at: string
}

/** Shape générique requis par le client Supabase typé. */
export type Database = {
  public: {
    Tables: {
      reservations: {
        Row: DbReservation
        Insert: Omit<DbReservation, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<DbReservation, 'id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
    PostgrestVersion: '12'
  }
}
