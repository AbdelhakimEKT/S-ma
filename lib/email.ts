/**
 * Transactional emails — server only.
 *
 * Envoi via Gmail SMTP ou Resend pour les mails de réservation.
 * Les envois restent best-effort: on log l'erreur sans bloquer le flux
 * de réservation si le provider email a un incident temporaire.
 */

import nodemailer from 'nodemailer'
import { site } from '@/data/site'

export type ReservationEmailKind = 'received' | 'confirmed' | 'failed'

export interface ReservationEmailData {
  id: string
  ritual_name: string
  date: string
  start_time: string
  guests: number
  total_eur: number
  deposit_eur: number
  guest_first_name: string
  guest_last_name: string
  guest_email: string
  guest_phone: string
  guest_notes: string | null
  stripe_payment_status?: string | null
}

type EmailPayload = {
  to: string
  subject: string
  html: string
  text: string
}

const RESEND_API_URL = 'https://api.resend.com/emails'
let gmailTransporter: nodemailer.Transporter | null = null

function formatDateLabel(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00`)
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatTimeLabel(time: string) {
  return time.slice(0, 5)
}

function formatMoney(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(value)
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function commonText(data: ReservationEmailData) {
  const lines = [
    `Réservation Söma`,
    `Référence : ${data.id}`,
    `Rituel : ${data.ritual_name}`,
    `Date : ${formatDateLabel(data.date)}`,
    `Heure : ${formatTimeLabel(data.start_time)}`,
    `Personnes : ${data.guests}`,
    `Total : ${formatMoney(data.total_eur)}`,
    `Acompte : ${formatMoney(data.deposit_eur)}`,
    `Nom : ${data.guest_first_name} ${data.guest_last_name}`,
    `Email : ${data.guest_email}`,
    `Téléphone : ${data.guest_phone}`,
  ]

  if (data.guest_notes) {
    lines.push(`Notes : ${data.guest_notes}`)
  }

  if (data.stripe_payment_status) {
    lines.push(`Statut paiement : ${data.stripe_payment_status}`)
  }

  return lines.join('\n')
}

function renderEmail({
  title,
  intro,
  data,
  accent,
  badge = 'Söma · Maison de rituels',
  summaryHeading = 'Votre réservation',
  summaryNote,
  footerNote = 'Si vous avez la moindre question, répondez simplement à ce message.',
  signature,
}: {
  title: string
  intro: string
  data: ReservationEmailData
  accent: string
  badge?: string
  summaryHeading?: string
  summaryNote?: string
  footerNote?: string
  signature?: string
}) {
  const dateLabel = formatDateLabel(data.date)
  const timeLabel = formatTimeLabel(data.start_time)
  const guestName = `${escapeHtml(data.guest_first_name)} ${escapeHtml(data.guest_last_name)}`
  const notes = data.guest_notes ? escapeHtml(data.guest_notes) : null

  return `
    <div style="margin:0;background:#12100e;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#f5ede3">
      <div style="max-width:680px;margin:0 auto;overflow:hidden;border:1px solid rgba(184,156,127,.22);border-radius:24px;background:#2a211c;box-shadow:0 28px 60px rgba(12,10,8,.45)">
        <div style="height:8px;background:linear-gradient(90deg,#8e5a33 0%,${accent} 50%,#e0c3a0 100%)"></div>
        <div style="padding:28px 32px 26px;background:linear-gradient(180deg,#2f241f 0%,#251c18 100%);border-bottom:1px solid rgba(184,156,127,.16)">
          <div style="display:inline-block;padding:8px 12px;border-radius:999px;background:rgba(224,195,160,.12);color:#e9ccb0;font-size:11px;letter-spacing:.14em;text-transform:uppercase">${escapeHtml(badge)}</div>
          <h1 style="margin:18px 0 0;font-size:34px;line-height:1.08;letter-spacing:-0.02em;color:#fff7ef">${escapeHtml(title)}</h1>
          <p style="margin:14px 0 0;max-width:54ch;font-size:16px;line-height:1.75;color:#e4cdb9">${escapeHtml(intro)}</p>
        </div>

        <div style="padding:32px;background:#efe6da;color:#241812">
          <div style="margin-bottom:18px;font-size:13px;letter-spacing:.11em;text-transform:uppercase;color:#7c5c42">${escapeHtml(summaryHeading)}</div>

          <div style="border:1px solid rgba(111,83,58,.18);border-radius:18px;background:#fffaf4;overflow:hidden">
            <div style="padding:18px 20px;background:rgba(174,115,66,.10);border-bottom:1px solid rgba(111,83,58,.12)">
              <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8b6f55">Rituel</div>
              <div style="margin-top:6px;font-size:22px;line-height:1.2;color:#1d140e">${escapeHtml(data.ritual_name)}</div>
            </div>

            <div style="padding:20px">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                <tr>
                  <td style="width:50%;padding:0 16px 16px 0;vertical-align:top">
                    <div style="font-size:12px;color:#8b6f55;text-transform:uppercase;letter-spacing:.08em">Référence</div>
                    <div style="margin-top:4px;font-size:16px;color:#1d140e">${escapeHtml(data.id)}</div>
                  </td>
                  <td style="width:50%;padding:0 0 16px 16px;vertical-align:top">
                    <div style="font-size:12px;color:#8b6f55;text-transform:uppercase;letter-spacing:.08em">Date</div>
                    <div style="margin-top:4px;font-size:16px;color:#1d140e">${escapeHtml(dateLabel)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="width:50%;padding:0 16px 16px 0;vertical-align:top">
                    <div style="font-size:12px;color:#8b6f55;text-transform:uppercase;letter-spacing:.08em">Heure</div>
                    <div style="margin-top:4px;font-size:16px;color:#1d140e">${escapeHtml(timeLabel)}</div>
                  </td>
                  <td style="width:50%;padding:0 0 16px 16px;vertical-align:top">
                    <div style="font-size:12px;color:#8b6f55;text-transform:uppercase;letter-spacing:.08em">Personnes</div>
                    <div style="margin-top:4px;font-size:16px;color:#1d140e">${data.guests}</div>
                  </td>
                </tr>
              </table>

              <div style="margin-top:2px;padding:18px;border-radius:16px;background:#f8efe4;border:1px solid rgba(111,83,58,.14)">
                <div style="font-size:12px;color:#8b6f55;text-transform:uppercase;letter-spacing:.08em">Acompte</div>
                <div style="margin-top:4px;font-size:26px;line-height:1.1;color:#1d140e">${escapeHtml(formatMoney(data.deposit_eur))}</div>
                <div style="margin-top:6px;font-size:13px;line-height:1.7;color:#5f4636">Le solde sera réglé sur place, le jour de votre venue.</div>
              </div>

              ${summaryNote ? `
                <div style="margin-top:16px;padding:14px 16px;border-radius:14px;background:rgba(111,83,58,.06);border:1px solid rgba(111,83,58,.12);font-size:13px;line-height:1.75;color:#5f4636">${escapeHtml(summaryNote)}</div>
              ` : ''}
            </div>
          </div>

          <div style="margin-top:18px;padding:18px 20px;border-radius:18px;background:linear-gradient(135deg,rgba(174,115,66,.12),rgba(204,157,112,.08));border:1px solid rgba(174,115,66,.18)">
            <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8b6f55">A garder sous la main</div>
            <div style="margin-top:8px;font-size:15px;line-height:1.8;color:#4b382b">
              <strong style="color:#1d140e">Reference :</strong> ${escapeHtml(data.id)} ·
              <strong style="color:#1d140e">Date :</strong> ${escapeHtml(dateLabel)} ·
              <strong style="color:#1d140e">Heure :</strong> ${escapeHtml(timeLabel)}
            </div>
          </div>

          <div style="margin-top:20px;padding:20px;border-radius:18px;background:rgba(174,115,66,.08);border:1px solid rgba(174,115,66,.18)">
            <div style="font-size:13px;letter-spacing:.11em;text-transform:uppercase;color:#6f533a;margin-bottom:10px">Coordonnees</div>
            <div style="font-size:16px;line-height:1.8;color:#1d140e">${guestName}</div>
            <div style="font-size:16px;line-height:1.8;color:#4b382b">${escapeHtml(data.guest_email)}</div>
            <div style="font-size:16px;line-height:1.8;color:#4b382b">${escapeHtml(data.guest_phone)}</div>
            ${notes ? `<div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(111,83,58,.14);font-size:15px;line-height:1.7;color:#5f4636"><strong>Notes :</strong> ${notes}</div>` : ''}
          </div>

          <div style="margin-top:24px;padding-top:18px;border-top:1px solid rgba(111,83,58,.14)">
            <p style="margin:0;font-size:14px;line-height:1.7;color:#6f533a">
              Maison Söma · ${escapeHtml(site.address.street)} · ${escapeHtml(site.address.postalCode)} ${escapeHtml(site.address.city)}
            </p>
            <p style="margin:10px 0 0;font-size:13px;line-height:1.7;color:#8b6f55">
              ${escapeHtml(footerNote)}
            </p>
            ${signature ? `
              <div style="margin-top:18px;padding-top:18px;border-top:1px solid rgba(111,83,58,.10)">
                <div style="font-size:12px;letter-spacing:.11em;text-transform:uppercase;color:#8b6f55;margin-bottom:8px">Signature</div>
                <div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:22px;line-height:1.2;color:#1d140e">${escapeHtml(signature)}</div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `
}

function getGmailUser() {
  return process.env.GMAIL_USER
}

function getAdminRecipient() {
  return process.env.BOOKING_NOTIFICATION_EMAIL || getGmailUser() || site.contact.bookingEmail
}

function getFromAddress() {
  const gmailUser = getGmailUser()
  if (gmailUser) {
    return process.env.EMAIL_FROM_ADDRESS || `Söma <${gmailUser}>`
  }

  return process.env.RESEND_FROM_EMAIL || 'Söma <onboarding@resend.dev>'
}

function resolveResendRecipient(email: EmailPayload) {
  const from = getFromAddress()
  const fallbackInbox = process.env.RESEND_TEST_TO_EMAIL
  const usingResendDev = from.toLowerCase().includes('@resend.dev')

  if (usingResendDev && fallbackInbox) {
    return {
      to: fallbackInbox,
      subject: `[test:${email.to}] ${email.subject}`,
      html: `
        <div style="margin:0 0 18px;padding:14px 16px;border-radius:14px;background:#fff3cd;border:1px solid #f1d58a;color:#6a4d00;font:14px/1.6 Arial,Helvetica,sans-serif">
          Mode test Resend sans domaine verifie.
          Destinataire initial: <strong>${escapeHtml(email.to)}</strong>
        </div>
        ${email.html}
      `,
      text: [
        `Mode test Resend sans domaine verifie.`,
        `Destinataire initial: ${email.to}`,
        '',
        email.text,
      ].join('\n'),
    }
  }

  return email
}

function getGmailTransporter() {
  if (gmailTransporter) return gmailTransporter

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    return null
  }

  gmailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  })

  return gmailTransporter
}

async function sendViaGmail(payload: EmailPayload) {
  const transporter = getGmailTransporter()

  if (!transporter) {
    return false
  }

  try {
    await transporter.sendMail({
      from: getFromAddress(),
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    })

    return true
  } catch (error) {
    console.error('[email] Gmail SMTP error:', error)
    return false
  }
}

async function sendViaResend(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY manquant, envoi ignoré.')
    return false
  }

  const resolvedPayload = resolveResendRecipient(payload)
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to: resolvedPayload.to,
      subject: resolvedPayload.subject,
      html: resolvedPayload.html,
      text: resolvedPayload.text,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => '')
    const usingResendDev = getFromAddress().toLowerCase().includes('@resend.dev')
    if (usingResendDev) {
      console.error(
        '[email] Resend refused the send. Without a verified domain, Resend test mode only delivers to an allowed inbox. Add RESEND_TEST_TO_EMAIL or verify a domain.',
        response.status,
        body,
      )
    } else {
      console.error('[email] Resend error:', response.status, body)
    }
    return false
  }

  return true
}

async function sendEmail(payload: EmailPayload) {
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return sendViaGmail(payload)
  }

  return sendViaResend(payload)
}

function customerReceivedEmail(data: ReservationEmailData): EmailPayload {
  return {
    to: data.guest_email,
    subject: `Söma · bienvenue, votre réservation est lancée`,
    html: renderEmail({
      title: 'Bienvenue chez Söma',
      intro:
        'Votre réservation est bien enregistrée. Il ne vous reste plus qu’à régler l’acompte pour que le rituel soit officiellement réservé.',
      data,
      accent: '#a46a3f',
      summaryHeading: 'Votre point de départ',
      summaryNote:
        'Nous gardons ce créneau en attente pendant la phase de paiement. Dès que l’acompte est validé, vous recevez la confirmation finale.',
      footerNote:
        'Si vous avez une question d’ici là, répondez simplement à ce message. On vous lit.',
      signature: "Inès & l'équipe Söma",
    }),
    text: [
      'Bienvenue chez Söma.',
      commonText(data),
      'Votre réservation est enregistrée, en attente du paiement de l’acompte.',
    ].join('\n\n'),
  }
}

function customerConfirmedEmail(data: ReservationEmailData): EmailPayload {
  return {
    to: data.guest_email,
    subject: `Söma · votre rituel est confirmé`,
    html: renderEmail({
      title: 'Votre place est confirmée',
      intro:
        'L’acompte a bien été reçu. Votre rituel est désormais confirmé, et nous avons hâte de vous accueillir.',
      data,
      accent: '#7f4f2d',
      summaryHeading: 'Récapitulatif confirmé',
      summaryNote:
        'Le solde sera réglé sur place le jour de votre venue. Conservez simplement ce mail comme référence.',
      footerNote:
        'Merci pour votre confiance. À très bientôt chez Söma.',
      signature: "Inès & l'équipe Söma",
    }),
    text: [
      'Votre réservation est confirmée.',
      commonText(data),
      'Le paiement d’acompte a bien été reçu.',
    ].join('\n\n'),
  }
}

function customerFailedEmail(data: ReservationEmailData) {
  return {
    to: data.guest_email,
    subject: `Söma · paiement non finalisé pour ${data.ritual_name}`,
    html: renderEmail({
      title: 'Votre paiement n’a pas abouti',
      intro:
        'Votre réservation n’est pas confirmée pour le moment. Vous pouvez reprendre le parcours et choisir un nouveau paiement.',
      data,
      accent: '#b8563c',
    }),
    text: [
      'Votre paiement n’a pas abouti.',
      commonText(data),
      'Votre réservation n’est pas confirmée pour le moment.',
    ].join('\n\n'),
  }
}

function adminNewReservationEmail(data: ReservationEmailData): EmailPayload {
  return {
    to: getAdminRecipient(),
    subject: `Nouvelle demande · ${data.ritual_name} · ${data.guest_first_name} ${data.guest_last_name}`,
    html: renderEmail({
      title: 'Nouvelle demande de réservation',
      intro:
        'Un client vient de valider son parcours et d’entrer dans la phase de paiement.',
      data,
      accent: '#6f533a',
    }),
    text: [
      'Nouvelle demande de réservation.',
      commonText(data),
      'Le client a été notifié.',
    ].join('\n\n'),
  }
}

function adminConfirmedEmail(data: ReservationEmailData): EmailPayload {
  return {
    to: getAdminRecipient(),
    subject: `Réservation confirmée · ${data.ritual_name} · ${data.guest_first_name} ${data.guest_last_name}`,
    html: renderEmail({
      title: 'Réservation confirmée',
      intro: 'Le paiement Stripe a été confirmé et la réservation est désormais fermée.',
      data,
      accent: '#52705d',
      summaryHeading: 'Réservation validée',
      summaryNote: 'Le client a reçu son mail de confirmation.',
    }),
    text: [
      'Réservation confirmée.',
      commonText(data),
      'Le paiement Stripe a été confirmé.',
    ].join('\n\n'),
  }
}

function adminFailedEmail(data: ReservationEmailData): EmailPayload {
  return {
    to: getAdminRecipient(),
    subject: `Paiement échoué · ${data.ritual_name} · ${data.guest_first_name} ${data.guest_last_name}`,
    html: renderEmail({
      title: 'Paiement non finalisé',
      intro: 'Le paiement Stripe est arrivé à expiration ou a échoué.',
      data,
      accent: '#b8563c',
      summaryHeading: 'Réservation à relancer',
    }),
    text: [
      'Paiement non finalisé.',
      commonText(data),
      'Le paiement Stripe est arrivé à expiration ou a échoué.',
    ].join('\n\n'),
  }
}

export async function sendReservationReceivedEmails(data: ReservationEmailData) {
  const emails = [customerReceivedEmail(data), adminNewReservationEmail(data)]
  return Promise.allSettled(emails.map(sendEmail))
}

export async function sendReservationConfirmedEmails(data: ReservationEmailData) {
  const emails = [customerConfirmedEmail(data), adminConfirmedEmail(data)]
  return Promise.allSettled(emails.map(sendEmail))
}

export async function sendReservationFailedEmails(data: ReservationEmailData) {
  const emails = [customerFailedEmail(data), adminFailedEmail(data)]
  return Promise.allSettled(emails.map(sendEmail))
}
