import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  orange: '#E8622A',
  orangeSoft: '#F8E2D2',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
  amber: '#F5A623',
  card: '#fff',
}

const STATUS_CONFIG = {
  'done':        { bg: 'rgba(100,200,120,0.15)', color: '#4caf78', label: '✅ ทำแล้วครับ' },
  'in-progress': { bg: 'rgba(245,166,35,0.15)', color: '#C9933A', label: '⏳ กำลังทำอยู่' },
  'response':    { bg: 'rgba(100,150,200,0.15)', color: '#6496aa', label: '💭 รับทราบแล้ว' },
} as const

type JoeStatus = 'done' | 'in-progress' | 'response'

interface TimelineItem {
  date: string
  note: string
  type: 'note' | 'done'
}

interface JoeEntry {
  id: string
  title: string
  icon: string
  summary: string
  story_text: string
  status: JoeStatus
  status_note: string | null
  inspired_by_nickname: string
  timeline: TimelineItem[]
  display_order: number
}

const BLANK_ENTRY: Omit<JoeEntry, 'id'> = {
  title: '',
  icon: '⭐',
  summary: '',
  story_text: '',
  status: 'in-progress',
  status_note: null,
  inspired_by_nickname: '',
  timeline: [],
  display_order: 0,
}

function Input({ label, value, onChange, placeholder }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, fontWeight: 600 }}>{label}</label>}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '9px 12px', borderRadius: 9, border: '1.5px solid rgba(44,26,14,0.15)',
          fontFamily: '"Sarabun", system-ui', fontSize: 13, outline: 'none', color: C.brown,
          background: '#FAFAFA', boxSizing: 'border-box', width: '100%',
        }}
      />
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, fontWeight: 600 }}>{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          padding: '9px 12px', borderRadius: 9, border: '1.5px solid rgba(44,26,14,0.15)',
          fontFamily: '"Sarabun", system-ui', fontSize: 13, outline: 'none', color: C.brown,
          background: '#FAFAFA', resize: 'vertical', boxSizing: 'border-box', width: '100%',
        }}
      />
    </div>
  )
}

function StatusBadge({ status }: { status: JoeStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 99,
      background: cfg.bg, fontFamily: '"Sarabun", system-ui', fontSize: 11, fontWeight: 700, color: cfg.color,
    }}>
      {cfg.label}
    </span>
  )
}

interface EditFormProps {
  initial: Partial<JoeEntry> & { timeline: TimelineItem[] }
  onSave: (data: Omit<JoeEntry, 'id'>) => Promise<void>
  onCancel: () => void
  saving: boolean
}

function EditForm({ initial, onSave, onCancel, saving }: EditFormProps) {
  const [form, setForm] = useState<Omit<JoeEntry, 'id'>>({
    ...BLANK_ENTRY,
    ...initial,
    status_note: initial.status_note ?? null,
  })
  const [newDate, setNewDate] = useState('')
  const [newNote, setNewNote] = useState('')
  const [newType, setNewType] = useState<'note' | 'done'>('note')
  const [addingTimeline, setAddingTimeline] = useState(false)

  function upd<K extends keyof typeof form>(key: K, val: typeof form[K]) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  function addTimeline() {
    if (!newDate || !newNote) return
    upd('timeline', [...form.timeline, { date: newDate, note: newNote, type: newType }])
    setNewDate('')
    setNewNote('')
    setAddingTimeline(false)
  }

  function removeTimeline(i: number) {
    upd('timeline', form.timeline.filter((_, idx) => idx !== i))
  }

  return (
    <div style={{
      marginTop: 12, padding: '18px', borderRadius: 14,
      background: '#F9F5EF', border: '1.5px solid rgba(44,26,14,0.1)',
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 10 }}>
        <Input label="Icon (emoji)" value={form.icon} onChange={v => upd('icon', v)} placeholder="⭐" />
        <Input label="Title" value={form.title} onChange={v => upd('title', v)} placeholder="ชื่อ feature..." />
      </div>
      <Input label="Summary (สั้นๆ)" value={form.summary} onChange={v => upd('summary', v)} placeholder="สรุปสั้นๆ..." />
      <Textarea label="Story Text (เนื้อหา)" value={form.story_text} onChange={v => upd('story_text', v)} placeholder="เนื้อหาละเอียด..." rows={4} />
      <Input label="Inspired By (ชื่อลูกค้า)" value={form.inspired_by_nickname} onChange={v => upd('inspired_by_nickname', v)} placeholder="เช่น นิด" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, fontWeight: 600 }}>Status</label>
        <select
          value={form.status}
          onChange={e => upd('status', e.target.value as JoeStatus)}
          style={{
            padding: '9px 12px', borderRadius: 9, border: '1.5px solid rgba(44,26,14,0.15)',
            fontFamily: '"Sarabun", system-ui', fontSize: 13, outline: 'none', color: C.brown,
            background: '#FAFAFA', width: '100%', cursor: 'pointer',
          }}
        >
          <option value="in-progress">⏳ กำลังทำอยู่</option>
          <option value="done">✅ ทำแล้ว</option>
          <option value="response">💭 รับทราบแล้ว</option>
        </select>
      </div>

      {form.status === 'response' && (
        <Textarea
          label="Status Note (ข้อความ response)"
          value={form.status_note || ''}
          onChange={v => upd('status_note', v || null)}
          placeholder="ข้อความที่จะแสดงให้ลูกค้าเห็น..."
          rows={2}
        />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, fontWeight: 600 }}>Display Order</label>
        <input
          type="number"
          value={form.display_order}
          onChange={e => upd('display_order', Number(e.target.value))}
          style={{
            padding: '9px 12px', borderRadius: 9, border: '1.5px solid rgba(44,26,14,0.15)',
            fontFamily: '"Sarabun", system-ui', fontSize: 13, outline: 'none', color: C.brown,
            background: '#FAFAFA', width: 80,
          }}
        />
      </div>

      {/* Timeline */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, fontWeight: 600 }}>📅 Timeline</label>
          <button
            onClick={() => setAddingTimeline(x => !x)}
            style={{
              padding: '4px 12px', borderRadius: 8, border: `1.5px solid ${C.orange}`,
              background: 'transparent', color: C.orange,
              fontFamily: '"Sarabun", system-ui', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}
          >
            + เพิ่ม update
          </button>
        </div>

        {addingTimeline && (
          <div style={{
            padding: 12, borderRadius: 10, background: 'rgba(232,98,42,0.06)',
            border: '1px dashed rgba(232,98,42,0.3)', marginBottom: 10,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, display: 'block', marginBottom: 4 }}>วันที่</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 8, boxSizing: 'border-box',
                    border: '1.5px solid rgba(44,26,14,0.15)', fontFamily: '"Sarabun", system-ui',
                    fontSize: 13, outline: 'none', color: C.brown, background: '#fff',
                  }}
                />
              </div>
              <div>
                <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, display: 'block', marginBottom: 4 }}>Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as 'note' | 'done')}
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: 8, boxSizing: 'border-box',
                    border: '1.5px solid rgba(44,26,14,0.15)', fontFamily: '"Sarabun", system-ui',
                    fontSize: 13, outline: 'none', color: C.brown, background: '#fff', cursor: 'pointer',
                  }}
                >
                  <option value="note">📝 Note</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
            </div>
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="รายละเอียด update..."
              rows={2}
              style={{
                width: '100%', padding: '8px 10px', borderRadius: 8, boxSizing: 'border-box',
                border: '1.5px solid rgba(44,26,14,0.15)', fontFamily: '"Sarabun", system-ui',
                fontSize: 13, outline: 'none', color: C.brown, background: '#fff', resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={addTimeline}
                disabled={!newDate || !newNote}
                style={{
                  padding: '7px 16px', borderRadius: 8, border: 'none',
                  background: C.orange, color: '#fff',
                  fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13,
                  cursor: (!newDate || !newNote) ? 'not-allowed' : 'pointer',
                  opacity: (!newDate || !newNote) ? 0.5 : 1,
                }}
              >
                เพิ่ม
              </button>
              <button
                onClick={() => setAddingTimeline(false)}
                style={{
                  padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(44,26,14,0.2)',
                  background: 'transparent', color: C.brownSoft,
                  fontFamily: '"Sarabun", system-ui', fontSize: 13, cursor: 'pointer',
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        )}

        {form.timeline.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {form.timeline.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 10px',
                borderRadius: 8, background: 'rgba(44,26,14,0.04)',
                border: '1px solid rgba(44,26,14,0.08)',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: 4, flexShrink: 0, marginTop: 5,
                  background: item.type === 'done' ? '#4caf78' : C.amber,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: '"DM Sans", system-ui', fontSize: 10, color: C.brownSoft }}>{item.date}</div>
                  <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brown, marginTop: 2 }}>{item.note}</div>
                </div>
                <button
                  onClick={() => removeTimeline(i)}
                  style={{ background: 'transparent', border: 'none', color: 'rgba(44,26,14,0.3)', cursor: 'pointer', fontSize: 16, padding: '0 2px', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: 'rgba(44,26,14,0.4)', fontStyle: 'italic' }}>
            ยังไม่มี timeline ครับ
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <button
          onClick={() => onSave(form)}
          disabled={saving}
          style={{
            padding: '10px 24px', borderRadius: 12, border: 'none',
            background: C.orange, color: '#fff',
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 20px', borderRadius: 12, border: '1.5px solid rgba(44,26,14,0.2)',
            background: 'transparent', color: C.brownSoft,
            fontFamily: '"Sarabun", system-ui', fontSize: 14, cursor: 'pointer',
          }}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  )
}

export default function JoeModeManager() {
  const [entries, setEntries] = useState<JoeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    setLoading(true)
    const { data } = await supabase
      .from('cupid_joe_mode')
      .select('id, title, icon, summary, story_text, status, status_note, inspired_by_nickname, timeline, display_order')
      .order('display_order', { ascending: true })
    if (data) setEntries(data as JoeEntry[])
    setLoading(false)
  }

  async function handleSave(id: string | 'new', form: Omit<JoeEntry, 'id'>) {
    setSaving(true)
    if (id === 'new') {
      await supabase.from('cupid_joe_mode').insert(form)
    } else {
      await supabase.from('cupid_joe_mode').update(form).eq('id', id)
    }
    await loadEntries()
    setEditingId(null)
    setSaving(false)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: C.brownSoft, fontFamily: '"Sarabun", system-ui' }}>
        กำลังโหลด...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Add New */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setEditingId(editingId === 'new' ? null : 'new')}
          style={{
            padding: '10px 22px', borderRadius: 12, border: 'none',
            background: editingId === 'new' ? C.brownSoft : C.orange, color: '#fff',
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          {editingId === 'new' ? '✕ ยกเลิก' : '+ เพิ่ม Entry ใหม่'}
        </button>
      </div>

      {/* New entry form */}
      {editingId === 'new' && (
        <div style={{ background: C.card, borderRadius: 20, padding: '20px', border: `2px solid ${C.orange}` }}>
          <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown, marginBottom: 2 }}>
            ✨ Entry ใหม่
          </div>
          <EditForm
            initial={{ ...BLANK_ENTRY }}
            onSave={(form) => handleSave('new', form)}
            onCancel={() => setEditingId(null)}
            saving={saving}
          />
        </div>
      )}

      {/* Entry list */}
      {entries.map(entry => (
        <div key={entry.id} style={{
          background: C.card, borderRadius: 20, padding: '18px 20px',
          border: '1px solid rgba(44,26,14,0.08)',
          boxShadow: '0 2px 10px rgba(44,26,14,0.04)',
        }}>
          {/* Entry header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, background: C.orangeSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>
              {entry.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <StatusBadge status={entry.status} />
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 15, color: C.brown, marginTop: 4 }}>
                {entry.title || '—'}
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 2, lineHeight: 1.4 }}>
                {entry.summary}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: 7, background: C.orange,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 8, fontWeight: 700, flexShrink: 0,
                }}>
                  {entry.inspired_by_nickname?.charAt(0) || '?'}
                </div>
                <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 10, color: C.brownSoft }}>
                  Inspired by คุณ{entry.inspired_by_nickname}
                </div>
                <div style={{ marginLeft: 8, fontFamily: '"DM Sans", system-ui', fontSize: 10, color: 'rgba(44,26,14,0.3)' }}>
                  #{entry.display_order}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditingId(editingId === entry.id ? null : entry.id)}
              style={{
                padding: '7px 16px', borderRadius: 10,
                border: `1.5px solid ${editingId === entry.id ? 'rgba(44,26,14,0.2)' : C.orange}`,
                background: editingId === entry.id ? 'rgba(44,26,14,0.04)' : '#FFF0E6',
                color: editingId === entry.id ? C.brownSoft : C.orange,
                fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              {editingId === entry.id ? 'ปิด' : 'แก้ไข'}
            </button>
          </div>

          {/* Timeline preview */}
          {entry.timeline?.length > 0 && editingId !== entry.id && (
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(44,26,14,0.07)' }}>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, marginBottom: 4 }}>
                📅 {entry.timeline.length} timeline update{entry.timeline.length > 1 ? 's' : ''}
              </div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft }}>
                ล่าสุด: {entry.timeline[entry.timeline.length - 1]?.date} — {entry.timeline[entry.timeline.length - 1]?.note?.slice(0, 60)}
                {(entry.timeline[entry.timeline.length - 1]?.note?.length || 0) > 60 ? '...' : ''}
              </div>
            </div>
          )}

          {/* Inline edit form */}
          {editingId === entry.id && (
            <EditForm
              initial={entry}
              onSave={(form) => handleSave(entry.id, form)}
              onCancel={() => setEditingId(null)}
              saving={saving}
            />
          )}
        </div>
      ))}

      {entries.length === 0 && (
        <div style={{
          background: C.card, borderRadius: 20, padding: '40px', textAlign: 'center',
          fontFamily: '"Sarabun", system-ui', color: C.brownSoft,
        }}>
          ยังไม่มี entries ครับ<br />กด "+ เพิ่ม Entry ใหม่" เพื่อเริ่มได้เลย
        </div>
      )}
    </div>
  )
}
