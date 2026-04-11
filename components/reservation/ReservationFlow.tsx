'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useReservation } from './ReservationContext'
import StepService from './StepService'
import StepDate from './StepDate'
import StepGuests from './StepGuests'
import StepInfo from './StepInfo'
import StepRecap from './StepRecap'
import StepSuccess from './StepSuccess'
import Stepper from './Stepper'
import { ease } from '@/lib/motion'

/**
 * Orchestration of the multi-step reservation flow.
 *
 * Animations between steps are deliberately gentle (650ms, blur+y), so the
 * focus stays on what's being filled in, not on transitions.
 */
export default function ReservationFlow() {
  const { step } = useReservation()

  return (
    <div className="relative">
      <div className="mb-12">
        <Stepper />
      </div>

      <div className="relative min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.65, ease: ease.out }}
          >
            {step === 'service' && <StepService />}
            {step === 'date' && <StepDate />}
            {step === 'guests' && <StepGuests />}
            {step === 'info' && <StepInfo />}
            {step === 'recap' && <StepRecap />}
            {step === 'success' && <StepSuccess />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
