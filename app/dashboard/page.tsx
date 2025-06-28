'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

interface Detection {
  id: string
  type: string
  content: string
  result: string
  confidence: number
  created_at: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [detections, setDetections] = useState<Detection[]>([])
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data.user) {
        router.push('/login')
        return
      }
      setUser(data.user)
      fetchDetections(data.user.id)
    }

    getUser()
  }, [router])

  const fetchDetections = async (userId: string) => {
    const { data, error } = await supabase
      .from('detections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setDetections(data as Detection[])
    }
  }

  const sendMessage = async () => {
    if (!message.trim() || !user) return
    const { error } = await supabase.from('messages').insert({ user_id: user.id, message })
    if (!error) {
      alert("Message sent!")
      setMessage("")
    } else {
      alert("Failed to send message.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Send a Message</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 rounded bg-gray-900"
          rows={3}
          placeholder="Your message here..."
        />
        <button
          onClick={sendMessage}
          className="mt-2 bg-cyan-500 hover:bg-cyan-600 px-4 py-2 rounded"
        >
          Send
        </button>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Your Detection History</h2>
        <div className="space-y-3">
          {detections.length === 0 && <p>No results yet.</p>}
          {detections.map((d) => (
            <div key={d.id} className="border border-cyan-400 p-4 rounded">
              <p><strong>Type:</strong> {d.type}</p>
              <p><strong>Content:</strong> {d.content?.slice(0, 60)}...</p>
              <p><strong>Result:</strong> {d.result}</p>
              <p><strong>Confidence:</strong> {d.confidence.toFixed(2)}%</p>
              <p className="text-xs text-gray-400">{new Date(d.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
