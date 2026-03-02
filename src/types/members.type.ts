export interface Member {
  id?: number
  activated: number
  billing_end_date: string
  billing_plan_id: number
  billing_start_date: string
  billing_type: string
  country_code: string
  description: string
  organisation_id: number
  organisation_name: string
  repo_id: number[]
}

export type MemberType = 'starting' | 'sustaining' | 'supporting';

