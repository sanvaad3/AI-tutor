# Custom Hooks Usage Guide

## Overview
These custom hooks provide a simple, frontend-developer-friendly way to handle chat functionality without dealing with complex API routes.

## Available Hooks

### 1. `useChat(sessionId?: string)`

**Perfect for:** Chat interface, message handling

```tsx
import { useChat } from '@/hooks/use-chat'

function ChatComponent() {
  const { 
    messages,        // Array of chat messages
    sendMessage,     // Function to send a message
    isLoading,       // Boolean: is AI responding?
    error,           // Error object if something went wrong
    hasMessages,     // Boolean: are there any messages?
    retryLastMessage, // Function to retry failed message
    clearMessages    // Function to clear all messages
  } = useChat('session-id-123') // Optional: pass session ID

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
      
      <button onClick={() => sendMessage('Hello!')}>
        Send Message
      </button>
      
      {error && (
        <div>
          Error: {error.message}
          <button onClick={retryLastMessage}>Retry</button>
        </div>
      )}
    </div>
  )
}
```

### 2. `useSessions()`

**Perfect for:** Session/chat list management

```tsx
import { useSessions } from '@/hooks/use-chat'

function SessionsList() {
  const { 
    sessions,        // Array of chat sessions
    isLoading,       // Boolean: loading sessions?
    error,           // Error object if something went wrong
    createSession,   // Function to create new session
    deleteSession,   // Function to delete session
    refresh,         // Function to refresh sessions list
    isEmpty          // Boolean: no sessions exist?
  } = useSessions()

  const handleCreate = async () => {
    try {
      const newSession = await createSession('My New Chat')
      console.log('Created:', newSession)
    } catch (err) {
      console.error('Failed to create:', err)
    }
  }

  return (
    <div>
      <button onClick={handleCreate}>Create New Chat</button>
      
      {sessions.map(session => (
        <div key={session.id}>
          {session.title}
          <button onClick={() => deleteSession(session.id)}>
            Delete
          </button>
        </div>
      ))}
      
      {isEmpty && <p>No chats yet!</p>}
    </div>
  )
}
```

## Real Examples

### Simple Chat (No Sessions)
```tsx
// components/simple-chat.tsx
import { useChat } from '@/hooks/use-chat'

export default function SimpleChat() {
  const { messages, sendMessage, isLoading } = useChat()
  
  return (
    <div>
      {messages.map((msg, i) => <div key={i}>{msg.content}</div>)}
      <button onClick={() => sendMessage('Hi!')}>
        {isLoading ? 'Sending...' : 'Send Hi'}
      </button>
    </div>
  )
}
```

### Chat with Sessions
```tsx
// components/chat-with-sessions.tsx
import { useState } from 'react'
import { useChat, useSessions } from '@/hooks/use-chat'

export default function ChatWithSessions() {
  const [currentSession, setCurrentSession] = useState('')
  const { sessions, createSession } = useSessions()
  const { messages, sendMessage } = useChat(currentSession)
  
  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div>
        <button onClick={() => createSession('New Chat')}>
          New Chat
        </button>
        {sessions.map(s => (
          <button key={s.id} onClick={() => setCurrentSession(s.id)}>
            {s.title}
          </button>
        ))}
      </div>
      
      {/* Chat */}
      <div>
        {messages.map((msg, i) => <div key={i}>{msg.content}</div>)}
        <button onClick={() => sendMessage('Hello!')}>
          Send Message
        </button>
      </div>
    </div>
  )
}
```

## Key Features

### ✅ Optimistic Updates
Messages appear instantly, then sync with server

### ✅ Error Handling
Built-in error states with retry functionality

### ✅ Loading States
Know when AI is responding or sessions are loading

### ✅ Auto-refresh
Sessions list updates automatically

### ✅ TypeScript Support
Full type safety out of the box

## Quick Start

1. **Import the hook:**
   \`\`\`tsx
   import { useChat } from '@/hooks/use-chat'
   \`\`\`

2. **Use in component:**
   \`\`\`tsx
   const { messages, sendMessage, isLoading } = useChat()
   \`\`\`

3. **Handle user input:**
   \`\`\`tsx
   <button onClick={() => sendMessage(userInput)}>
     {isLoading ? 'Sending...' : 'Send'}
   </button>
   \`\`\`

That's it! No API routes, no complex state management, just simple React hooks! 🎉