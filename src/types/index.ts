export type Mood = 'love' | 'ok' | 'problem'
export type Source = 'grab' | 'lineman' | 'shopee' | 'kiosk' | 'unknown'
export type ProblemCategory = 'wrong_order' | 'missing_item' | 'taste' | 'quality' | 'foreign_object' | 'contact'
export type NeutralCategory = 'taste' | 'portion' | 'delivery' | 'packaging' | 'other'

export interface FeedbackSubmission {
  source: Source
  mood: Mood
  category?: string
  menu_ids?: string[]
  text?: string
  nickname?: string
  qa_answer?: string
  vote_choice?: string
}
