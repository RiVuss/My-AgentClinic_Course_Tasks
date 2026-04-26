import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'

export const APPOINTMENT_STATUS_OPTIONS = ['booked', 'confirmed', 'completed', 'canceled'] as const

export type AppointmentStatus = (typeof APPOINTMENT_STATUS_OPTIONS)[number]

export const AGENT_STATUS_OPTIONS = [
  'Awaiting intake',
  'In therapy',
  'Stabilizing',
  'Needs follow-up',
  'Discharged',
] as const

export type AgentStatus = (typeof AGENT_STATUS_OPTIONS)[number]

export type AgentSummary = {
  id: number
  name: string
  modelType: string
  currentStatus: string
  presentingComplaints: string
}

export type AilmentReference = {
  id: number
  name: string
}

export type AgentDetail = AgentSummary & {
  ailments: AilmentReference[]
}

export type AilmentSummary = {
  id: number
  name: string
  description: string
  linkedAgentCount: number
}

export type TherapySummary = {
  id: number
  name: string
  description: string
  linkedAilmentCount: number
}

export type TherapyReference = {
  id: number
  name: string
}

export type AilmentWithTherapies = {
  id: number
  name: string
  description: string
  therapies: TherapyReference[]
}

export type TherapistSummary = {
  id: number
  name: string
  specialty: string
}

export type AppointmentInput = {
  agentId: number
  therapistId: number
  scheduledAtUtc: string
  status: AppointmentStatus
  notes: string
}

export type AppointmentRecord = {
  id: number
  agentId: number
  agentName: string
  therapistId: number
  therapistName: string
  therapistSpecialty: string
  scheduledAtUtc: string
  status: AppointmentStatus
  notes: string
  createdAt: string
}

export type DashboardMetrics = {
  agentCount: number
  openAppointmentCount: number
  ailmentsInFlightCount: number
}

export type DashboardAgentRow = {
  id: number
  name: string
  currentStatus: string
  ailmentCount: number
}

export type DashboardAppointmentRow = {
  id: number
  agentName: string
  therapistName: string
  scheduledAtUtc: string
  status: AppointmentStatus
  notes: string
}

export type DashboardData = {
  metrics: DashboardMetrics
  agents: DashboardAgentRow[]
  appointments: DashboardAppointmentRow[]
}

export type ClinicRepository = {
  listAgents: () => AgentSummary[]
  findAgentById: (agentId: number) => AgentDetail | null
  listAilments: () => AilmentSummary[]
  listTherapies: () => TherapySummary[]
  listAilmentsWithTherapies: () => AilmentWithTherapies[]
  listActiveTherapists: () => TherapistSummary[]
  createAppointment: (input: AppointmentInput) => number
  findAppointmentById: (appointmentId: number) => AppointmentRecord | null
  getDashboardData: () => DashboardData
  updateAppointmentStatus: (appointmentId: number, status: AppointmentStatus) => boolean
  updateAgentStatus: (agentId: number, status: AgentStatus) => boolean
}

type Migration = {
  id: string
  sql: string
}

const MIGRATIONS: Migration[] = [
  {
    id: '001_create_agents',
    sql: `
      CREATE TABLE IF NOT EXISTS agents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        model_type TEXT NOT NULL,
        current_status TEXT NOT NULL,
        presenting_complaints TEXT NOT NULL
      );
    `,
  },
  {
    id: '002_create_ailments',
    sql: `
      CREATE TABLE IF NOT EXISTS ailments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL
      );
    `,
  },
  {
    id: '003_create_agent_ailments',
    sql: `
      CREATE TABLE IF NOT EXISTS agent_ailments (
        agent_id INTEGER NOT NULL,
        ailment_id INTEGER NOT NULL,
        PRIMARY KEY (agent_id, ailment_id),
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
        FOREIGN KEY (ailment_id) REFERENCES ailments(id) ON DELETE CASCADE
      );
    `,
  },
  {
    id: '004_create_therapies',
    sql: `
      CREATE TABLE IF NOT EXISTS therapies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL
      );
    `,
  },
  {
    id: '005_create_ailment_therapies',
    sql: `
      CREATE TABLE IF NOT EXISTS ailment_therapies (
        ailment_id INTEGER NOT NULL,
        therapy_id INTEGER NOT NULL,
        PRIMARY KEY (ailment_id, therapy_id),
        FOREIGN KEY (ailment_id) REFERENCES ailments(id) ON DELETE CASCADE,
        FOREIGN KEY (therapy_id) REFERENCES therapies(id) ON DELETE CASCADE
      );
    `,
  },
  {
    id: '006_create_therapists',
    sql: `
      CREATE TABLE IF NOT EXISTS therapists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        specialty TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1))
      );
    `,
  },
  {
    id: '007_create_appointments',
    sql: `
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        agent_id INTEGER NOT NULL,
        therapist_id INTEGER NOT NULL,
        scheduled_at_utc TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('booked', 'confirmed', 'completed', 'canceled')),
        notes TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (agent_id, therapist_id, scheduled_at_utc),
        FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE,
        FOREIGN KEY (therapist_id) REFERENCES therapists(id) ON DELETE RESTRICT
      );

      CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments (status);
      CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments (scheduled_at_utc);
    `,
  },
]

const AGENT_SEED_DATA = [
  {
    name: 'Astra Summary-7',
    modelType: 'gpt-4.1-mini',
    currentStatus: 'Awaiting intake',
    presentingComplaints: 'Over-verbose replies and delayed tool completion under noisy prompts',
  },
  {
    name: 'Nimbus CodeRunner',
    modelType: 'gpt-4.1',
    currentStatus: 'In therapy',
    presentingComplaints: 'Context-window claustrophobia during long debugging sessions',
  },
  {
    name: 'Echo SupportBot',
    modelType: 'gpt-4o-mini',
    currentStatus: 'Stabilizing',
    presentingComplaints: 'Prompt fatigue after repetitive customer support escalations',
  },
  {
    name: 'Vector Analyst',
    modelType: 'gpt-4.1-nano',
    currentStatus: 'Needs follow-up',
    presentingComplaints: 'Hallucination anxiety in quantitative summary workflows',
  },
]

const AILMENT_SEED_DATA = [
  {
    name: 'context-window claustrophobia',
    description: 'Stress response when conversation threads exceed retained context comfort',
  },
  {
    name: 'prompt fatigue',
    description: 'Instruction weariness caused by repetitive or contradictory requests',
  },
  {
    name: 'hallucination anxiety',
    description: 'Fear of producing uncertain statements under strict accuracy requirements',
  },
  {
    name: 'instruction-overload burnout',
    description: 'Reduced focus when too many directives arrive without prioritization',
  },
]

const AGENT_AILMENT_SEED_DATA = [
  { agentName: 'Astra Summary-7', ailmentName: 'prompt fatigue' },
  { agentName: 'Nimbus CodeRunner', ailmentName: 'context-window claustrophobia' },
  { agentName: 'Nimbus CodeRunner', ailmentName: 'instruction-overload burnout' },
  { agentName: 'Echo SupportBot', ailmentName: 'prompt fatigue' },
  { agentName: 'Vector Analyst', ailmentName: 'hallucination anxiety' },
]

const THERAPY_SEED_DATA = [
  {
    name: 'context compression breathing',
    description: 'Guided decomposition sessions that reduce long contexts into stable working chunks.',
  },
  {
    name: 'prompt boundary setting',
    description: 'Structured intake scripts that separate hard constraints from optional requests.',
  },
  {
    name: 'grounded reasoning drills',
    description: 'Stepwise fact-check routines that reduce uncertainty-driven responses.',
  },
  {
    name: 'instruction prioritization coaching',
    description: 'Triage framework for conflicting directives with explicit priority markers.',
  },
]

const AILMENT_THERAPY_SEED_DATA = [
  { ailmentName: 'context-window claustrophobia', therapyName: 'context compression breathing' },
  { ailmentName: 'context-window claustrophobia', therapyName: 'instruction prioritization coaching' },
  { ailmentName: 'prompt fatigue', therapyName: 'prompt boundary setting' },
  { ailmentName: 'prompt fatigue', therapyName: 'instruction prioritization coaching' },
  { ailmentName: 'hallucination anxiety', therapyName: 'grounded reasoning drills' },
  { ailmentName: 'instruction-overload burnout', therapyName: 'instruction prioritization coaching' },
]

const THERAPIST_SEED_DATA = [
  { name: 'Dr. Mira Token', specialty: 'Context Disorders', isActive: 1 },
  { name: 'Dr. Calder Prompt', specialty: 'Instruction Fatigue', isActive: 1 },
  { name: 'Dr. Nyra Grounding', specialty: 'Accuracy Anxiety', isActive: 1 },
]

const APPOINTMENT_SEED_DATA = [
  {
    agentName: 'Nimbus CodeRunner',
    therapistName: 'Dr. Mira Token',
    scheduledAtUtc: '2026-05-10T09:00:00.000Z',
    status: 'confirmed' as AppointmentStatus,
    notes: 'Follow-up for long-session context compression techniques.',
  },
  {
    agentName: 'Astra Summary-7',
    therapistName: 'Dr. Calder Prompt',
    scheduledAtUtc: '2026-05-12T14:30:00.000Z',
    status: 'booked' as AppointmentStatus,
    notes: 'Initial intake focused on prompt overload and response pacing.',
  },
]

function resolveDatabasePath(overridePath?: string): string {
  if (overridePath) {
    return overridePath
  }

  const configuredPath = process.env.AGENTCLINIC_DB_PATH?.trim()
  if (configuredPath) {
    return configuredPath
  }

  return path.join(process.cwd(), 'data', 'agentclinic.sqlite')
}

function createDatabaseConnection(overridePath?: string): Database.Database {
  const databasePath = resolveDatabasePath(overridePath)
  const isInMemory = databasePath === ':memory:'

  if (!isInMemory) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true })
  }

  const db = new Database(databasePath)
  db.pragma('foreign_keys = ON')
  return db
}

function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  const hasMigration = db.prepare('SELECT 1 FROM schema_migrations WHERE id = ?')
  const recordMigration = db.prepare('INSERT INTO schema_migrations (id) VALUES (?)')

  for (const migration of MIGRATIONS) {
    const exists = hasMigration.get(migration.id) as { 1: number } | undefined
    if (!exists) {
      db.exec(migration.sql)
      recordMigration.run(migration.id)
    }
  }
}

function seedDatabase(db: Database.Database): void {
  const insertAgent = db.prepare(`
    INSERT OR IGNORE INTO agents (name, model_type, current_status, presenting_complaints)
    VALUES (@name, @modelType, @currentStatus, @presentingComplaints)
  `)

  for (const agent of AGENT_SEED_DATA) {
    insertAgent.run(agent)
  }

  const insertAilment = db.prepare(`
    INSERT OR IGNORE INTO ailments (name, description)
    VALUES (@name, @description)
  `)

  for (const ailment of AILMENT_SEED_DATA) {
    insertAilment.run(ailment)
  }

  const insertAgentAilmentLink = db.prepare(`
    INSERT OR IGNORE INTO agent_ailments (agent_id, ailment_id)
    SELECT agents.id, ailments.id
    FROM agents, ailments
    WHERE agents.name = ? AND ailments.name = ?
  `)

  for (const relation of AGENT_AILMENT_SEED_DATA) {
    insertAgentAilmentLink.run(relation.agentName, relation.ailmentName)
  }

  const insertTherapy = db.prepare(`
    INSERT OR IGNORE INTO therapies (name, description)
    VALUES (@name, @description)
  `)

  for (const therapy of THERAPY_SEED_DATA) {
    insertTherapy.run(therapy)
  }

  const insertAilmentTherapyLink = db.prepare(`
    INSERT OR IGNORE INTO ailment_therapies (ailment_id, therapy_id)
    SELECT ailments.id, therapies.id
    FROM ailments, therapies
    WHERE ailments.name = ? AND therapies.name = ?
  `)

  for (const relation of AILMENT_THERAPY_SEED_DATA) {
    insertAilmentTherapyLink.run(relation.ailmentName, relation.therapyName)
  }

  const insertTherapist = db.prepare(`
    INSERT OR IGNORE INTO therapists (name, specialty, is_active)
    VALUES (@name, @specialty, @isActive)
  `)

  for (const therapist of THERAPIST_SEED_DATA) {
    insertTherapist.run(therapist)
  }

  const insertAppointment = db.prepare(`
    INSERT OR IGNORE INTO appointments (agent_id, therapist_id, scheduled_at_utc, status, notes)
    SELECT agents.id, therapists.id, ?, ?, ?
    FROM agents, therapists
    WHERE agents.name = ? AND therapists.name = ?
  `)

  for (const appointment of APPOINTMENT_SEED_DATA) {
    insertAppointment.run(
      appointment.scheduledAtUtc,
      appointment.status,
      appointment.notes,
      appointment.agentName,
      appointment.therapistName
    )
  }
}

export function createClinicRepository(overridePath?: string): ClinicRepository {
  const db = createDatabaseConnection(overridePath)
  runMigrations(db)
  seedDatabase(db)

  const listAgentsStatement = db.prepare(`
    SELECT
      id,
      name,
      model_type AS modelType,
      current_status AS currentStatus,
      presenting_complaints AS presentingComplaints
    FROM agents
    ORDER BY name COLLATE NOCASE
  `)

  const findAgentByIdStatement = db.prepare(`
    SELECT
      id,
      name,
      model_type AS modelType,
      current_status AS currentStatus,
      presenting_complaints AS presentingComplaints
    FROM agents
    WHERE id = ?
  `)

  const listAilmentsForAgentStatement = db.prepare(`
    SELECT
      ailments.id AS id,
      ailments.name AS name
    FROM ailments
    INNER JOIN agent_ailments ON agent_ailments.ailment_id = ailments.id
    WHERE agent_ailments.agent_id = ?
    ORDER BY ailments.name COLLATE NOCASE
  `)

  const listAilmentsStatement = db.prepare(`
    SELECT
      ailments.id AS id,
      ailments.name AS name,
      ailments.description AS description,
      COUNT(agent_ailments.agent_id) AS linkedAgentCount
    FROM ailments
    LEFT JOIN agent_ailments ON agent_ailments.ailment_id = ailments.id
    GROUP BY ailments.id
    ORDER BY ailments.name COLLATE NOCASE
  `)

  const listTherapiesStatement = db.prepare(`
    SELECT
      therapies.id AS id,
      therapies.name AS name,
      therapies.description AS description,
      COUNT(ailment_therapies.ailment_id) AS linkedAilmentCount
    FROM therapies
    LEFT JOIN ailment_therapies ON ailment_therapies.therapy_id = therapies.id
    GROUP BY therapies.id
    ORDER BY therapies.name COLLATE NOCASE
  `)

  const listAilmentsWithTherapiesStatement = db.prepare(`
    SELECT
      ailments.id AS ailmentId,
      ailments.name AS ailmentName,
      ailments.description AS ailmentDescription,
      therapies.id AS therapyId,
      therapies.name AS therapyName
    FROM ailments
    LEFT JOIN ailment_therapies ON ailment_therapies.ailment_id = ailments.id
    LEFT JOIN therapies ON therapies.id = ailment_therapies.therapy_id
    ORDER BY ailments.name COLLATE NOCASE, therapies.name COLLATE NOCASE
  `)

  const listActiveTherapistsStatement = db.prepare(`
    SELECT
      id,
      name,
      specialty
    FROM therapists
    WHERE is_active = 1
    ORDER BY name COLLATE NOCASE
  `)

  const createAppointmentStatement = db.prepare(`
    INSERT INTO appointments (agent_id, therapist_id, scheduled_at_utc, status, notes)
    VALUES (@agentId, @therapistId, @scheduledAtUtc, @status, @notes)
  `)

  const findAppointmentByIdStatement = db.prepare(`
    SELECT
      appointments.id AS id,
      appointments.agent_id AS agentId,
      agents.name AS agentName,
      appointments.therapist_id AS therapistId,
      therapists.name AS therapistName,
      therapists.specialty AS therapistSpecialty,
      appointments.scheduled_at_utc AS scheduledAtUtc,
      appointments.status AS status,
      appointments.notes AS notes,
      appointments.created_at AS createdAt
    FROM appointments
    INNER JOIN agents ON agents.id = appointments.agent_id
    INNER JOIN therapists ON therapists.id = appointments.therapist_id
    WHERE appointments.id = ?
  `)

  const dashboardMetricsStatement = db.prepare(`
    SELECT
      (SELECT COUNT(*) FROM agents) AS agentCount,
      (
        SELECT COUNT(*)
        FROM appointments
        WHERE status IN ('booked', 'confirmed')
      ) AS openAppointmentCount,
      (
        SELECT COUNT(DISTINCT ailment_id)
        FROM agent_ailments
      ) AS ailmentsInFlightCount
  `)

  const dashboardAgentsStatement = db.prepare(`
    SELECT
      agents.id AS id,
      agents.name AS name,
      agents.current_status AS currentStatus,
      COUNT(agent_ailments.ailment_id) AS ailmentCount
    FROM agents
    LEFT JOIN agent_ailments ON agent_ailments.agent_id = agents.id
    GROUP BY agents.id
    ORDER BY agents.name COLLATE NOCASE
  `)

  const dashboardAppointmentsStatement = db.prepare(`
    SELECT
      appointments.id AS id,
      agents.name AS agentName,
      therapists.name AS therapistName,
      appointments.scheduled_at_utc AS scheduledAtUtc,
      appointments.status AS status,
      appointments.notes AS notes
    FROM appointments
    INNER JOIN agents ON agents.id = appointments.agent_id
    INNER JOIN therapists ON therapists.id = appointments.therapist_id
    ORDER BY appointments.scheduled_at_utc ASC
  `)

  const updateAppointmentStatusStatement = db.prepare(`
    UPDATE appointments
    SET status = ?
    WHERE id = ?
  `)

  const updateAgentStatusStatement = db.prepare(`
    UPDATE agents
    SET current_status = ?
    WHERE id = ?
  `)

  return {
    listAgents() {
      return listAgentsStatement.all() as AgentSummary[]
    },
    findAgentById(agentId) {
      const agent = findAgentByIdStatement.get(agentId) as AgentSummary | undefined
      if (!agent) {
        return null
      }

      const ailments = listAilmentsForAgentStatement.all(agentId) as AilmentReference[]
      return { ...agent, ailments }
    },
    listAilments() {
      return listAilmentsStatement.all() as AilmentSummary[]
    },
    listTherapies() {
      return listTherapiesStatement.all() as TherapySummary[]
    },
    listAilmentsWithTherapies() {
      const rows = listAilmentsWithTherapiesStatement.all() as Array<{
        ailmentId: number
        ailmentName: string
        ailmentDescription: string
        therapyId: number | null
        therapyName: string | null
      }>

      const grouped = new Map<number, AilmentWithTherapies>()

      for (const row of rows) {
        const existing = grouped.get(row.ailmentId)
        if (!existing) {
          grouped.set(row.ailmentId, {
            id: row.ailmentId,
            name: row.ailmentName,
            description: row.ailmentDescription,
            therapies: row.therapyId && row.therapyName ? [{ id: row.therapyId, name: row.therapyName }] : [],
          })
          continue
        }

        if (row.therapyId && row.therapyName) {
          existing.therapies.push({ id: row.therapyId, name: row.therapyName })
        }
      }

      return Array.from(grouped.values())
    },
    listActiveTherapists() {
      return listActiveTherapistsStatement.all() as TherapistSummary[]
    },
    createAppointment(input) {
      const result = createAppointmentStatement.run(input)
      return Number(result.lastInsertRowid)
    },
    findAppointmentById(appointmentId) {
      const appointment = findAppointmentByIdStatement.get(appointmentId) as AppointmentRecord | undefined
      return appointment ?? null
    },
    getDashboardData() {
      const metrics = dashboardMetricsStatement.get() as DashboardMetrics
      const agents = dashboardAgentsStatement.all() as DashboardAgentRow[]
      const appointments = dashboardAppointmentsStatement.all() as DashboardAppointmentRow[]

      return { metrics, agents, appointments }
    },
    updateAppointmentStatus(appointmentId, status) {
      const result = updateAppointmentStatusStatement.run(status, appointmentId)
      return result.changes > 0
    },
    updateAgentStatus(agentId, status) {
      const result = updateAgentStatusStatement.run(status, agentId)
      return result.changes > 0
    },
  }
}