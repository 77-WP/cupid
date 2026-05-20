import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  orange: '#E8622A',
  brown: '#2C1A0E',
  brownSoft: '#6B4A33',
  amber: '#F5A623',
  card: '#fff',
}

interface SettingsData {
  announcement_is_active: boolean
  announcement_title: string
  announcement_text: string
  announcement_mode: 'info' | 'vote'
  announcement_vote_options: string[]
  announcement_priority: 'primary' | 'secondary'
  qa_is_active: boolean
  weekly_question: string
  weekly_question_options: string[]
  qa_priority: 'primary' | 'secondary'
}

const DEFAULT: SettingsData = {
  announcement_is_active: false,
  announcement_title: '',
  announcement_text: '',
  announcement_mode: 'info',
  announcement_vote_options: ['', '', '', ''],
  announcement_priority: 'primary',
  qa_is_active: false,
  weekly_question: '',
  weekly_question_options: ['', '', ''],
  qa_priority: 'secondary',
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 48, height: 26, borderRadius: 13, border: 'none',
        background: on ? C.orange : 'rgba(44,26,14,0.2)',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
        transition: 'background .2s ease',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: on ? 24 : 3, width: 20, height: 20,
        borderRadius: 10, background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
        transition: 'left .2s ease',
      }} />
    </button>
  )
}

function Input({ label, value, onChange, placeholder }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, fontWeight: 600 }}>{label}</label>}
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(44,26,14,0.15)',
          fontFamily: '"Sarabun", system-ui', fontSize: 14, outline: 'none', color: C.brown,
          background: '#FAFAFA', boxSizing: 'border-box', width: '100%',
        }}
      />
    </div>
  )
}

function Textarea({ label, value, onChange, placeholder, rows = 3 }: { label?: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, fontWeight: 600 }}>{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(44,26,14,0.15)',
          fontFamily: '"Sarabun", system-ui', fontSize: 14, outline: 'none', color: C.brown,
          background: '#FAFAFA', resize: 'vertical', boxSizing: 'border-box', width: '100%',
        }}
      />
    </div>
  )
}

function Select({ label, value, onChange, options }: { label?: string; value: string; onChange: (v: string) => void; options: { val: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, fontWeight: 600 }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: '10px 14px', borderRadius: 10, border: '1.5px solid rgba(44,26,14,0.15)',
          fontFamily: '"Sarabun", system-ui', fontSize: 14, outline: 'none', color: C.brown,
          background: '#FAFAFA', boxSizing: 'border-box', width: '100%', cursor: 'pointer',
        }}
      >
        {options.map(o => <option key={o.val} value={o.val}>{o.label}</option>)}
      </select>
    </div>
  )
}

function CardPreview({ ann, qa }: { ann: SettingsData; qa: SettingsData }) {
  const annOn = ann.announcement_is_active
  const qaOn = qa.qa_is_active

  if (!annOn && !qaOn) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: C.brownSoft, fontFamily: '"Sarabun", system-ui', fontSize: 14 }}>
        ไม่มีการ์ดที่เปิดอยู่ครับ
      </div>
    )
  }

  const items = []
  if (annOn) items.push({ key: 'ann', priority: ann.announcement_priority, icon: '📣', title: ann.announcement_title || 'หัวข้อ Announcement', type: ann.announcement_mode })
  if (qaOn) items.push({ key: 'qa', priority: qa.qa_priority, icon: '💬', title: qa.weekly_question || 'คำถามสัปดาห์นี้', type: 'qa' })
  items.sort((a, _b) => (a.priority === 'primary' ? -1 : 1))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((item, i) => (
        <div key={item.key} style={{
          padding: '14px 16px', borderRadius: 16,
          background: item.priority === 'primary' ? 'linear-gradient(135deg, #FFF1E2, #FAE0CB)' : 'rgba(44,26,14,0.05)',
          border: `1.5px ${item.priority === 'primary' ? 'solid rgba(232,98,42,0.25)' : 'dashed rgba(44,26,14,0.15)'}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 22 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: '"DM Sans", system-ui', fontSize: 9, fontWeight: 700,
              letterSpacing: 1.2, textTransform: 'uppercase', color: C.brownSoft,
              marginBottom: 3,
            }}>
              {item.priority === 'primary' ? 'PRIMARY' : 'SECONDARY'} · {i === 0 ? 'แสดงก่อน' : 'แสดงหลัง'}
            </div>
            <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 14, color: C.brown }}>
              {item.title}
            </div>
            {item.type === 'vote' && (
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 11, color: C.brownSoft, marginTop: 2 }}>🗳️ มีตัวเลือกโหวต A/B/C/D</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Settings() {
  const [data, setData] = useState<SettingsData>(DEFAULT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('cupid_settings').select('*').eq('id', 1).single().then(({ data: row }) => {
      if (row) {
        setData({
          announcement_is_active: row.announcement_is_active ?? false,
          announcement_title: row.announcement_title ?? '',
          announcement_text: row.announcement_text ?? '',
          announcement_mode: row.announcement_mode ?? 'info',
          announcement_vote_options: row.announcement_vote_options ?? ['', '', '', ''],
          announcement_priority: row.announcement_priority ?? 'primary',
          qa_is_active: row.qa_is_active ?? false,
          weekly_question: row.weekly_question ?? '',
          weekly_question_options: row.weekly_question_options ?? ['', '', ''],
          qa_priority: row.qa_priority ?? 'secondary',
        })
      }
      setLoading(false)
    })
  }, [])

  function update<K extends keyof SettingsData>(key: K, val: SettingsData[K]) {
    setData(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  function updateVoteOption(i: number, val: string) {
    const opts = [...data.announcement_vote_options]
    opts[i] = val
    update('announcement_vote_options', opts)
  }

  function updateQAOption(i: number, val: string) {
    const opts = [...data.weekly_question_options]
    opts[i] = val
    update('weekly_question_options', opts)
  }

  async function handleSave() {
    setSaving(true)
    await supabase.from('cupid_settings').upsert({
      id: 1,
      announcement_is_active: data.announcement_is_active,
      announcement_title: data.announcement_title,
      announcement_text: data.announcement_text,
      announcement_mode: data.announcement_mode,
      announcement_vote_options: data.announcement_vote_options,
      announcement_priority: data.announcement_priority,
      qa_is_active: data.qa_is_active,
      weekly_question: data.weekly_question,
      weekly_question_options: data.weekly_question_options,
      qa_priority: data.qa_priority,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: C.brownSoft, fontFamily: '"Sarabun", system-ui' }}>
        กำลังโหลด...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Announcement Card */}
      <div style={{ background: C.card, borderRadius: 20, padding: '22px', border: '1px solid rgba(44,26,14,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.announcement_is_active ? 20 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>📣</span>
            <div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown }}>Announcement</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 2 }}>ข้อความแจ้งลูกค้า</div>
            </div>
          </div>
          <Toggle on={data.announcement_is_active} onChange={v => update('announcement_is_active', v)} />
        </div>

        {data.announcement_is_active && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="หัวข้อ" value={data.announcement_title} onChange={v => update('announcement_title', v)} placeholder="เช่น เปิดสาขาใหม่!" />
            <Textarea label="รายละเอียด" value={data.announcement_text} onChange={v => update('announcement_text', v)} placeholder="รายละเอียด..." />
            <Select
              label="โหมด"
              value={data.announcement_mode}
              onChange={v => update('announcement_mode', v as 'info' | 'vote')}
              options={[{ val: 'info', label: 'แค่บอก' }, { val: 'vote', label: 'เปิด Vote' }]}
            />
            {data.announcement_mode === 'vote' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, fontWeight: 600 }}>ตัวเลือก</label>
                {['A', 'B', 'C', 'D'].map((letter, i) => (
                  <div key={letter} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: 8, background: C.orange, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: '"DM Sans", system-ui', fontWeight: 700, fontSize: 12, flexShrink: 0,
                    }}>{letter}</div>
                    <input
                      value={data.announcement_vote_options[i] || ''}
                      onChange={e => updateVoteOption(i, e.target.value)}
                      placeholder={`ตัวเลือก ${letter}`}
                      style={{
                        flex: 1, padding: '8px 12px', borderRadius: 10,
                        border: '1.5px solid rgba(44,26,14,0.15)',
                        fontFamily: '"Sarabun", system-ui', fontSize: 13, outline: 'none', color: C.brown,
                        background: '#FAFAFA',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <Select
              label="Priority"
              value={data.announcement_priority}
              onChange={v => update('announcement_priority', v as 'primary' | 'secondary')}
              options={[{ val: 'primary', label: 'Primary (ใหญ่)' }, { val: 'secondary', label: 'Secondary (เล็ก)' }]}
            />
          </div>
        )}
      </div>

      {/* Q&A Card */}
      <div style={{ background: C.card, borderRadius: 20, padding: '22px', border: '1px solid rgba(44,26,14,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: data.qa_is_active ? 20 : 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>💬</span>
            <div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown }}>Q&A</div>
              <div style={{ fontFamily: '"Sarabun", system-ui', fontSize: 12, color: C.brownSoft, marginTop: 2 }}>คำถามประจำสัปดาห์</div>
            </div>
          </div>
          <Toggle on={data.qa_is_active} onChange={v => update('qa_is_active', v)} />
        </div>

        {data.qa_is_active && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="คำถาม" value={data.weekly_question} onChange={v => update('weekly_question', v)} placeholder="เช่น อยากให้เพิ่มเมนูอะไร?" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: C.brownSoft, fontWeight: 600 }}>ตัวเลือก (3 ข้อ)</label>
              {[1, 2, 3].map((n, i) => (
                <input
                  key={n}
                  value={data.weekly_question_options[i] || ''}
                  onChange={e => updateQAOption(i, e.target.value)}
                  placeholder={`ตัวเลือก ${n}`}
                  style={{
                    padding: '8px 12px', borderRadius: 10, border: '1.5px solid rgba(44,26,14,0.15)',
                    fontFamily: '"Sarabun", system-ui', fontSize: 13, outline: 'none', color: C.brown,
                    background: '#FAFAFA',
                  }}
                />
              ))}
            </div>
            <Select
              label="Priority"
              value={data.qa_priority}
              onChange={v => update('qa_priority', v as 'primary' | 'secondary')}
              options={[{ val: 'primary', label: 'Primary (ใหญ่)' }, { val: 'secondary', label: 'Secondary (เล็ก)' }]}
            />
          </div>
        )}
      </div>

      {/* Preview */}
      <div style={{ background: C.card, borderRadius: 20, padding: '22px', border: '1px solid rgba(44,26,14,0.08)' }}>
        <h3 style={{ fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16, color: C.brown, margin: '0 0 16px 0' }}>
          👁️ ตัวอย่าง Thank You Screen
        </h3>
        <CardPreview ann={data} qa={data} />
      </div>

      {/* Save Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '13px 32px', borderRadius: 14, border: 'none',
            background: saved ? '#3F8E5C' : C.orange, color: '#fff',
            fontFamily: '"Sarabun", system-ui', fontWeight: 700, fontSize: 16,
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1, transition: 'all .2s',
          }}
        >
          {saving ? 'กำลังบันทึก...' : saved ? '✅ บันทึกแล้ว' : 'บันทึก'}
        </button>
        {saved && (
          <span style={{ fontFamily: '"Sarabun", system-ui', fontSize: 13, color: '#3F8E5C' }}>
            อัปเดต settings เรียบร้อยครับ
          </span>
        )}
      </div>
    </div>
  )
}
