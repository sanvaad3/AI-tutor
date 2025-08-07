/**
 * @typedef {string | number | boolean | null | {[key: string]: Json | undefined} | Json[]} Json
 */

/**
 * @typedef {Object} ChatSessionRow
 * @property {string} id
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string} title
 * @property {string} [user_id]
 */

/**
 * @typedef {Object} ChatSessionInsert
 * @property {string} [id]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 * @property {string} title
 * @property {string} [user_id]
 */

/**
 * @typedef {Object} ChatSessionUpdate
 * @property {string} [id]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 * @property {string} [title]
 * @property {string} [user_id]
 */

/**
 * @typedef {Object} MessageRow
 * @property {string} id
 * @property {string} chat_session_id
 * @property {'user' | 'assistant'} role
 * @property {string} content
 * @property {string} created_at
 * @property {string} [agent_type]
 */

/**
 * @typedef {Object} MessageInsert
 * @property {string} [id]
 * @property {string} chat_session_id
 * @property {'user' | 'assistant'} role
 * @property {string} content
 * @property {string} [created_at]
 * @property {string} [agent_type]
 */

/**
 * @typedef {Object} MessageUpdate
 * @property {string} [id]
 * @property {string} [chat_session_id]
 * @property {'user' | 'assistant'} [role]
 * @property {string} [content]
 * @property {string} [created_at]
 * @property {string} [agent_type]
 */

/**
 * @typedef {Object} Database
 * @property {Object} public
 * @property {Object} public.Tables
 * @property {Object} public.Tables.chat_sessions
 * @property {ChatSessionRow} public.Tables.chat_sessions.Row
 * @property {ChatSessionInsert} public.Tables.chat_sessions.Insert
 * @property {ChatSessionUpdate} public.Tables.chat_sessions.Update
 * @property {Object} public.Tables.messages
 * @property {MessageRow} public.Tables.messages.Row
 * @property {MessageInsert} public.Tables.messages.Insert
 * @property {MessageUpdate} public.Tables.messages.Update
 */

// Export empty object to make this a module
export {};