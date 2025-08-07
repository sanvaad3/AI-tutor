/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {"user" | "assistant"} role
 * @property {string} content
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} Chat
 * @property {string} id
 * @property {string} title
 * @property {Message[]} messages
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} ChatResponse
 * @property {string} [message]
 * @property {string} [response]
 * @property {string} [error]
 */

/**
 * @typedef {Object} ApiError
 * @property {string} error
 * @property {string} [message]
 * @property {string} [code]
 */

/**
 * @typedef {Object} CreateSessionRequest
 * @property {string} title
 */

/**
 * @typedef {Object} CreateSessionResponse
 * @property {Object} session
 * @property {string} session.id
 * @property {string} session.title
 * @property {string} session.created_at
 * @property {string} session.updated_at
 */

/**
 * @typedef {Object} GetSessionsResponse
 * @property {Array} sessions
 * @property {string} sessions[].id
 * @property {string} sessions[].title
 * @property {string} sessions[].created_at
 * @property {string} sessions[].updated_at
 */

/**
 * @typedef {Object} GetMessagesResponse
 * @property {Array} messages
 * @property {string} messages[].id
 * @property {string} messages[].chat_id
 * @property {"user" | "assistant"} messages[].role
 * @property {string} messages[].content
 * @property {string} messages[].created_at
 */

// Export empty object to make this a module
export {};