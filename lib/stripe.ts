/**
 * Instance Stripe — serveur uniquement.
 * À n'importer que depuis des API routes.
 */

import Stripe from 'stripe'

let _stripe: Stripe | null = null

/**
 * Lazy-initialized pour éviter l'erreur au build time quand
 * STRIPE_SECRET_KEY n'est pas encore configurée.
 */
export function getStripe(): Stripe {
  if (_stripe) return _stripe

  const key = process.env.STRIPE_SECRET_KEY

  if (!key) {
    throw new Error('STRIPE_SECRET_KEY manquant. Configurez .env.local.')
  }

  _stripe = new Stripe(key, {
    apiVersion: '2024-06-20',
    typescript: true,
  })

  return _stripe
}
