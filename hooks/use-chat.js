'use client'

import { useState, useTransition, useEffect, useCallback } from 'react'
import { 
  sendChatMessage, 
  createChatSession, 
  getChatSessions, 
  getSessionMessages, 
  deleteChatSession 
} from '@/lib/actions'

export function useChat(sessionId) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (sessionId) {
      loadMessages(sessionId)
    } else {
      setMessages([])
    }
  }, [sessionId])

  const loadMessages = async (id) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await getSessionMessages(id)
      if (result.success && result.data) {
        const formattedMessages = result.data.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.created_at
        }))
        setMessages(formattedMessages)
      } else {
        setError({ message: result.error || 'Failed to load messages' })
      }
    } catch (err) {
      setError({ message: 'Failed to load messages' })
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = useCallback(async (content) => {
    if (!content.trim()) return
    
    const userMessage = { 
      role: 'user', 
      content: content.trim(),
      timestamp: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setError(null)
    setIsLoading(true)

    startTransition(async () => {
      try {
        const allMessages = [...messages, userMessage]
        const result = await sendChatMessage(allMessages, sessionId)
        
        if (result.success && result.data?.response) {
          const assistantMessage = {
            role: 'assistant',
            content: result.data.response,
            timestamp: new Date().toISOString()
          }
          setMessages(prev => [...prev, assistantMessage])
        } else {
          setMessages(messages)
          setError({ message: result.error || 'Failed to send message' })
        }
      } catch (err) {
        setMessages(messages)
        setError({ message: 'Network error. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    })
  }, [messages, sessionId])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const retryLastMessage = useCallback(() => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')
      if (lastUserMessage) {
        const filteredMessages = messages.filter(m => 
          !(m.role === 'assistant' && !m.id) 
        )
        setMessages(filteredMessages)
        sendMessage(lastUserMessage.content)
      }
    }
  }, [messages, sendMessage])

  return {
    messages,
    sendMessage,
    clearMessages,
    retryLastMessage,
    isLoading: isLoading || isPending,
    error,
    hasMessages: messages.length > 0
  }
}

export function useSessions() {
  const [sessions, setSessions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await getChatSessions()
      if (result.success && result.data) {
        setSessions(result.data)
      } else {
        setError({ message: result.error || 'Failed to fetch sessions' })
      }
    } catch (err) {
      setError({ message: 'Network error while fetching sessions' })
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createSession = useCallback(async (title) => {
    if (!title.trim()) {
      throw new Error('Session title cannot be empty')
    }

    return new Promise((resolve, reject) => {
      startTransition(async () => {
        try {
          const result = await createChatSession(title.trim())
          if (result.success && result.data) {
            setSessions(prev => [result.data, ...prev])
            setError(null)
            resolve(result.data)
          } else {
            setError({ message: result.error || 'Failed to create session' })
            reject(new Error(result.error))
          }
        } catch (err) {
          const errorMsg = 'Failed to create session'
          setError({ message: errorMsg })
          reject(new Error(errorMsg))
        }
      })
    })
  }, [])

  const deleteSession = useCallback(async (sessionId) => {
    if (!sessionId) return

    const originalSessions = sessions
    setSessions(prev => prev.filter(s => s.id !== sessionId))

    startTransition(async () => {
      try {
        const result = await deleteChatSession(sessionId)
        if (!result.success) {
          setSessions(originalSessions)
          setError({ message: result.error || 'Failed to delete session' })
        } else {
          setError(null)
        }
      } catch (err) {
        setSessions(originalSessions)
        setError({ message: 'Failed to delete session' })
      }
    })
  }, [sessions])

  const updateSessionTitle = useCallback(async (sessionId, newTitle) => {
    if (!newTitle.trim()) return

    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, title: newTitle.trim() } : s
    ))

  }, [sessions])

  return {
    sessions,
    isLoading: isLoading || isPending,
    error,
    fetchSessions,
    createSession,
    deleteSession,
    updateSessionTitle,
    refresh: fetchSessions,
    hasError: !!error,
    isEmpty: sessions.length === 0 && !isLoading
  }
}
