'use client'

import { useState } from 'react'
import { useReservation, nextStep, prevStep } from './ReservationContext'
import { validateStep, type ValidationErrors } from '@/lib/reservation'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'

/**
 * Step 4 — guest information.
 *
 * Floating-label fields with on-blur validation. Errors fade in just below
 * each input. Submit-on-enter walks to the next step if everything is valid.
 */
export default function StepInfo() {
  const { draft, dispatch, resumeToRecap } = useReservation()
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  function patch(field: string, value: string | boolean) {
    dispatch({ type: 'patch-guest', patch: { [field]: value } as any })
  }

  function validateNow(): ValidationErrors {
    const e = validateStep('info', draft)
    setErrors(e)
    return e
  }

  function tryNext() {
    setTouched({
      firstName: true, lastName: true, email: true, phone: true, consent: true,
    })
    const e = validateNow()
    if (Object.keys(e).length === 0) {
      dispatch({ type: 'go-to', step: resumeToRecap ? 'recap' : nextStep('info') })
    }
  }

  return (
    <div>
      <header className="mb-10">
        <p className="eyebrow mb-4 text-bone-500">Étape 04 — Vos informations</p>
        <h2 className="font-serif text-display-md leading-[1.02] text-bone-100">
          Pour vous écrire, et vous appeler.
        </h2>
        <p className="mt-3 text-[14.5px] text-bone-400">
          Vos coordonnées servent uniquement à confirmer votre venue. Aucune
          revente, aucun envoi commercial sans votre accord.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Prénom"
          value={draft.guest.firstName}
          onChange={(v) => patch('firstName', v)}
          onBlur={() => { setTouched((t) => ({ ...t, firstName: true })); validateNow() }}
          error={touched.firstName ? errors.firstName : undefined}
          autoComplete="given-name"
        />
        <Field
          label="Nom"
          value={draft.guest.lastName}
          onChange={(v) => patch('lastName', v)}
          onBlur={() => { setTouched((t) => ({ ...t, lastName: true })); validateNow() }}
          error={touched.lastName ? errors.lastName : undefined}
          autoComplete="family-name"
        />
        <Field
          label="Email"
          type="email"
          value={draft.guest.email}
          onChange={(v) => patch('email', v)}
          onBlur={() => { setTouched((t) => ({ ...t, email: true })); validateNow() }}
          error={touched.email ? errors.email : undefined}
          autoComplete="email"
        />
        <Field
          label="Téléphone"
          type="tel"
          value={draft.guest.phone}
          onChange={(v) => patch('phone', v)}
          onBlur={() => { setTouched((t) => ({ ...t, phone: true })); validateNow() }}
          error={touched.phone ? errors.phone : undefined}
          autoComplete="tel"
        />
      </div>

      <div className="mt-5">
        <TextareaField
          label="Préférences ou demandes spéciales (optionnel)"
          value={draft.guest.notes ?? ''}
          onChange={(v) => patch('notes', v)}
          placeholder="Allergies, préférences de pression du massage, mobilité réduite, occasion particulière…"
        />
      </div>

      {/* Checkboxes */}
      <div className="mt-8 space-y-4">
        <Checkbox
          checked={draft.guest.newsletter}
          onChange={(v) => patch('newsletter', v)}
          label="Je souhaite recevoir le journal de la maison, deux fois par an. Pas de pub, pas de relance."
        />
        <Checkbox
          checked={draft.guest.consent}
          onChange={(v) => {
            patch('consent', v)
            if (v) {
              setErrors((current) => {
                const next = { ...current }
                delete next.consent
                return next
              })
            }
          }}
          label="J'accepte que la maison conserve mes coordonnées pour traiter ma réservation, conformément au RGPD."
          required
          error={touched.consent ? errors.consent : undefined}
        />
      </div>

      <footer className="mt-12 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: 'go-to', step: resumeToRecap ? 'recap' : prevStep('info') })}
        >
          ← Retour
        </Button>
        <Button variant="primary" onClick={tryNext} dot>
          Continuer
        </Button>
      </footer>
    </div>
  )
}

/* ------------------------------- Inputs --------------------------------- */

function Field({
  label,
  value,
  onChange,
  onBlur,
  type = 'text',
  error,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  type?: string
  error?: string
  autoComplete?: string
}) {
  const filled = value.length > 0
  return (
    <label className="group relative block">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        className={cn(
          'peer w-full rounded-sm border px-4 pt-6 pb-2 text-bone-100 outline-none transition-all duration-500 ease-soma',
          'placeholder-transparent',
          error
            ? 'border-red-400/60'
            : 'border-[var(--line)] focus:border-ember-500/70',
        )}
        placeholder={label}
      />
      <span
        className={cn(
          'pointer-events-none absolute left-4 top-4 text-[14px] text-bone-500 transition-all duration-500 ease-soma',
          (filled || value) && 'top-1.5 text-[10.5px] uppercase tracking-wide-1 text-bone-400',
          'peer-focus:top-1.5 peer-focus:text-[10.5px] peer-focus:uppercase peer-focus:tracking-wide-1 peer-focus:text-ember-400',
        )}
      >
        {label}
      </span>
      {error && (
        <span className="mt-1.5 block text-[11.5px] text-amber-200/90">{error}</span>
      )}
    </label>
  )
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-3 block text-bone-500">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full resize-none rounded-sm border border-[var(--line)] bg-transparent px-4 py-3 text-[14.5px] text-bone-100 placeholder:text-bone-500/60 outline-none transition-all duration-500 ease-soma focus:border-ember-500/60"
      />
    </label>
  )
}

function Checkbox({
  checked,
  onChange,
  label,
  required,
  error,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  required?: boolean
  error?: string
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-4">
      <span
        className={cn(
          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-all duration-500 ease-soma',
          checked
            ? 'border-ember-500 bg-ember-500/20 text-ember-500'
            : error
            ? 'border-red-400/60'
            : 'border-[var(--line-strong)] group-hover:border-bone-400/40',
        )}
      >
        {checked && (
          <svg viewBox="0 0 16 16" width={11} height={11} fill="none" className="text-ember-500">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span className="text-[13.5px] leading-relaxed text-bone-300">
        {label}
        {required && <span className="ml-1 text-ember-500">*</span>}
        {error && (
          <span className="mt-1 block text-[11.5px] text-amber-200/90">{error}</span>
        )}
      </span>
    </label>
  )
}
