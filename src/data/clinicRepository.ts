import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'

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

export type ClinicRepository = {
  listAgents: () => AgentSummary[]
  findAgentById: (agentId: number) => AgentDetail | null
  listAilments: () => AilmentSummary[]
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

  const insertLink = db.prepare(`
    INSERT OR IGNORE INTO agent_ailments (agent_id, ailment_id)
    SELECT agents.id, ailments.id
    FROM agents, ailments
    WHERE agents.name = ? AND ailments.name = ?
  `)

  for (const relation of AGENT_AILMENT_SEED_DATA) {
    insertLink.run(relation.agentName, relation.ailmentName)
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

  return {
    listAgents() {
      return listAgentsStatement.all() as AgentSummary[]
    },
    findAgentById(agentId: number) {
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
  }
}
