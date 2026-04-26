import { beforeEach, describe, expect, it } from 'vitest'

import { createClinicRepository } from '../src/data/clinicRepository'

describe('clinicRepository', () => {
  let repository: ReturnType<typeof createClinicRepository>

  beforeEach(() => {
    repository = createClinicRepository(':memory:')
  })

  it('lists therapies and ailment mappings from seeded data', () => {
    const therapies = repository.listTherapies()
    const mappings = repository.listAilmentsWithTherapies()

    expect(therapies.length).toBeGreaterThan(0)
    expect(therapies.some((therapy) => therapy.name === 'context compression breathing')).toBe(true)

    const mappedAilment = mappings.find((ailment) => ailment.name === 'context-window claustrophobia')
    expect(mappedAilment).toBeDefined()
    expect(mappedAilment?.therapies.length).toBeGreaterThan(0)
  })

  it('creates and retrieves appointments', () => {
    const appointmentId = repository.createAppointment({
      agentId: 1,
      therapistId: 1,
      scheduledAtUtc: '2099-02-01T12:00:00.000Z',
      status: 'booked',
      notes: 'Repository appointment test',
    })

    const appointment = repository.findAppointmentById(appointmentId)

    expect(appointment).not.toBeNull()
    expect(appointment?.agentId).toBe(1)
    expect(appointment?.therapistId).toBe(1)
    expect(appointment?.status).toBe('booked')
    expect(appointment?.notes).toBe('Repository appointment test')
  })

  it('returns dashboard data with metrics and management rows', () => {
    const dashboard = repository.getDashboardData()

    expect(dashboard.metrics.agentCount).toBeGreaterThanOrEqual(4)
    expect(dashboard.metrics.openAppointmentCount).toBeGreaterThanOrEqual(1)
    expect(dashboard.metrics.ailmentsInFlightCount).toBeGreaterThanOrEqual(1)
    expect(dashboard.agents.length).toBeGreaterThanOrEqual(4)
    expect(dashboard.appointments.length).toBeGreaterThanOrEqual(1)
  })

  it('updates appointment and agent statuses with constrained values', () => {
    const appointmentUpdated = repository.updateAppointmentStatus(1, 'completed')
    expect(appointmentUpdated).toBe(true)
    expect(repository.findAppointmentById(1)?.status).toBe('completed')

    const agentUpdated = repository.updateAgentStatus(1, 'Discharged')
    expect(agentUpdated).toBe(true)
    expect(repository.findAgentById(1)?.currentStatus).toBe('Discharged')

    expect(repository.updateAppointmentStatus(9999, 'booked')).toBe(false)
    expect(repository.updateAgentStatus(9999, 'In therapy')).toBe(false)
  })
})