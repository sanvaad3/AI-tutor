'use server'

import { supabase } from '@/lib/supabase'
import { TutorAgent } from '@/lib/agents/tutor-agent'
import { revalidatePath } from 'next/cache'

export async function sendChatMessage(messages, sessionId) {
  try {
    if (!messages || messages.length === 0) {
      throw new Error('Messages are required')
    }

    const tutorAgent = new TutorAgent()
    const response = await tutorAgent.route(messages)

    // Store in database if sessionId provided
    if (sessionId) {
      const lastUserMessage = messages.filter(m => m.role === 'user').pop()
      
      if (lastUserMessage && response.response) {
        await Promise.all([
          supabase.from('messages').insert({
            chat_id: sessionId,
            role: 'user',
            content: lastUserMessage.content
          }),
          supabase.from('messages').insert({
            chat_id: sessionId,
            role: 'assistant',
            content: response.response
          })
        ])

        await supabase
          .from('chats')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', sessionId)
      }
    }

    return { success: true, data: response }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send message' 
    }
  }
}

export async function createChatSession(title) {
  try {
    if (!title?.trim()) {
      throw new Error('Title is required')
    }

    const { data: session, error } = await supabase
      .from('chats')
      .insert({ title: title.trim() })
      .select('id, title, created_at, updated_at')
      .single()

    if (error) throw error

    revalidatePath('/') // Update any cached data
    return { success: true, data: session }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create session' 
    }
  }
}

export async function getChatSessions() {
  try {
    const { data: sessions, error } = await supabase
      .from('chats')
      .select('id, title, created_at, updated_at')
      .order('updated_at', { ascending: false })

    if (error) throw error

    return { success: true, data: sessions || [] }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch sessions' 
    }
  }
}

export async function getSessionMessages(sessionId) {
  try {
    if (!sessionId?.trim()) {
      throw new Error('Session ID is required')
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, chat_id, role, content, created_at')
      .eq('chat_id', sessionId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return { success: true, data: messages || [] }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch messages' 
    }
  }
}

export async function deleteChatSession(sessionId) {
  try {
    if (!sessionId?.trim()) {
      throw new Error('Session ID is required')
    }

    // Delete messages first
    await supabase.from('messages').delete().eq('chat_id', sessionId)
    
    // Delete session
    const { error } = await supabase.from('chats').delete().eq('id', sessionId)
    
    if (error) throw error

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete session' 
    }
  }
}