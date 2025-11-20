// Adobe Analytics API Types

export interface AdobeAuthConfig {
  client_id: string
  client_secret: string
  org_id: string
  company_id: string
  report_suite_id: string
}

export interface AdobeAccessToken {
  access_token: string
  token_type: string
  expires_in: number
}

export interface AdobeCompany {
  globalCompanyId: string
  companyName: string
  apiRateLimitPolicy: string
}

export interface AdobeReportSuite {
  rsid: string
  name: string
  currency: string
  calendarType: {
    type: string
    anchorDate: string
  }
  timezoneZoneinfo: string
}

export interface AdobeDimension {
  id: string
  title: string
  name: string
  type: string
  category: string
  support: string[]
  pathable: boolean
  extraTitleInfo?: string
}

export interface AdobeMetric {
  id: string
  title: string
  name: string
  type: string
  category: string
  support: string[]
  allocation: boolean
  precision: number
  calculated: boolean
  segmentable: boolean
  extraTitleInfo?: string
}

export interface AdobeReportRequest {
  rsid: string
  globalFilters: Array<{
    type: 'dateRange'
    dateRange: string
  }>
  metricContainer: {
    metrics: Array<{
      columnId: string
      id: string
      sort?: 'asc' | 'desc'
      filters?: string[]
    }>
  }
  dimension?: string
  settings: {
    countRepeatInstances: boolean
    limit: number
    page?: number
    dimensionSort?: 'asc' | 'desc'
  }
  statistics?: {
    functions: string[]
  }
}

export interface AdobeReportResponse {
  totalPages: number
  firstPage: boolean
  lastPage: boolean
  numberOfElements: number
  number: number
  totalElements: number
  columns: {
    columnId: string
    columnType: string
    columnErrors?: any[]
  }
  rows: Array<{
    itemId: string
    value: string
    data: number[]
  }>
  summaryData?: {
    totals: number[]
  }
}

export interface AdobeErrorResponse {
  error_code: string
  message: string
}
