/* eslint-disable no-console */
/* eslint-disable complexity */
/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
import axios, {Method} from 'axios'
import cli from 'cli-ux'
import chalk from 'chalk'
import util from 'util'

let prevLine: string
let prevLineCounter = 1
const log = require('ololog').configure({
  locate: false,
  '+render'(text: any) {
    if (text && prevLine && (prevLine === text) && (text.split('\n').length === 1)) {
      prevLineCounter++
      return '\u001B[1A' + text + ' ' + chalk.black.bgWhite(` ×${prevLineCounter} `) + '\u001B[K'
    }

    prevLineCounter = 1
    prevLine = text
    return text
  },
})

const BASE_URL = 'https://api.pagerduty.com'
const globalAny: any = global

export class PD {
  private token: string

  private debug: boolean

  private _me: any

  private _domain: string | null = null

  private progressState = {
    started: false,
    waiting: false,
    succeeded: 0,
    failed: 0,
    total: 0,
    format: '',
    stopSpinnerWhenDone: true,
  }

  public static isBearerToken(token: string): boolean {
    if (token && token.match(/^[0-9a-fA-F]{64}$/)) {
      return true
    }
    return false
  }

  public static isLegacyToken(token: string): boolean {
    // eslint-disable-next-line no-useless-escape
    if (token && token.match(/^[0-9a-zA-Z_\-\+\/=]{20}$/)) {
      return true
    }
    return false
  }

  public static isValidToken(token: string): boolean {
    if (this.isBearerToken(token) || this.isLegacyToken(token)) {
      return true
    }
    return false
  }

  public static authHeaderForToken(token: string): string {
    if (this.isBearerToken(token)) {
      return `Bearer ${token}`
    }

    if (this.isLegacyToken(token)) {
      return `Token token=${token}`
    }

    throw new Error(`Invalid token ${token}`)
  }

  constructor(token: string, debug = false) {
    if (PD.isValidToken(token)) {
      this.token = token
      this.debug = debug
    } else {
      throw new Error(`${token} is not a valid PD token`)
    }

    if (debug) {
      axios.interceptors.request.use(config => {
        // perform a task before the request is sent
        console.error(chalk.bold.blue('[DEBUG] Request:'), util.inspect(config, false, null, true))
        return config
      }, error => {
        // handle the error
        console.error(chalk.bold.red('[DEBUG] Request error:'), util.inspect(error, false, null, true))
        return Promise.reject(error)
      })

      axios.interceptors.response.use(response => {
        // do something with the response data
        console.error(chalk.bold.green('[DEBUG] OK Response:'))
        console.error(chalk.bold.green('[DEBUG] Response Status:'), response.status)
        console.error(chalk.bold.green('[DEBUG] Response Data:'), util.inspect(response.data, false, null, true))
        return response
      }, error => {
        // handle the response error
        if (error.response) {
          console.error(chalk.bold.red('[DEBUG] Error in response:'))
          console.error(chalk.bold.red('[DEBUG] Response Status:'), error.response.status)
          console.error(chalk.bold.red('[DEBUG] Response Data:'), util.inspect(error.response.data, false, null, true))
          console.error(chalk.bold.red('[DEBUG] Response Headers:'), error.response.headers)
        } else {
          console.log('[DEBUG] Unknown response error:', error.message)
        }
        return Promise.reject(error)
      })
    }
  }

  private async _request(
    {
      endpoint,
      method = 'get',
      params = {},
      data = {},
      headers = {},
    }: PD.Request
  ): Promise<PD.Result<any>> {
    let h = {
      Accept: 'application/vnd.pagerduty+json;version=2',
      Authorization: PD.authHeaderForToken(this.token),
      'Content-Type': 'application/json',
      'User-Agent': `pagerduty-cli/${globalAny.config.version}`,
      'X-PagerDuty-Client': `pagerduty-cli ${globalAny.config.version}`,
    }
    if (headers) {
      h = {...h, ...headers}
    }
    const config = {
      method: method,
      baseURL: BASE_URL,
      url: endpoint,
      params: params,
      headers: h,
      data: data,
    }
    const r = await axios.request(config)
    return PD.Result.ok(r)
  }

  public async request(req: PD.Request): Promise<PD.Result<any>> {
    return this._request(req).catch(error => PD.Result.fail(error))
  }

  private async requestWithIndex(p: {req: PD.Request; index: number}) {
    const r = await this._request(p.req).catch(error => PD.Result.fail(error))
    return {res: r, index: p.index}
  }

  public async me(): Promise<any> {
    if (this._me) return this._me
    if (!PD.isBearerToken(this.token)) {
      return null
    }
    const r = await this.request({
      endpoint: 'users/me',
      method: 'GET',
    })
    this._me = r.getData()
    return this._me
  }

  public async domain(): Promise<string> {
    if (this._domain) {
      return this._domain
    }
    const me = await this.me()
    if (me) {
      this._domain = me.user.html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
    } else {
      const users = await this.fetch('users', {params: {limit: 1}})
      this._domain = users[0].html_url.match(/https:\/\/(.*)\.pagerduty.com\/.*/)[1]
    }
    return this._domain as string
  }

  public async batchedRequest(requests: PD.Request[],
    p?: {
      batchSize?: number;
      callback?: PD.Callback;
      reportTotal?: boolean;
    }): Promise<PD.BatchResult> {
    const batchSize = p?.batchSize || 10
    const callback = p?.callback || undefined
    const reportTotal = p?.reportTotal || false

    if (callback) {
      callback({start: true})
      if (reportTotal) {
        callback({total: requests.length})
      }
    }

    const collectedResults: PD.Result<any>[] = []

    for (let j = 0; j < requests.length; j += batchSize) {
      let retries = []
      let promises: Promise<{res: PD.Result<any>; index: number}>[] = []
      for (let i = 0; i < batchSize && i + j < requests.length; i++) {
        promises.push(this.requestWithIndex({req: requests[i + j], index: i + j}))
      }
      const rs = await Promise.all(promises)
      for (const r of rs) {
        if (!r.res.isSuccess && r.res.statusCode() === 429) {
          retries.push({req: requests[r.index], index: r.index})
        } else {
          if (callback) {
            if (r.res.isSuccess) {
              callback({success: true})
            } else {
              callback({failure: true, failureMessage: r.res.getFormattedError()})
            }
          }
          collectedResults[r.index] = r.res
        }
      }
      while (retries.length > 0) {
        if (callback) {
          callback({waiting: true})
        }
        await cli.wait(10000)
        if (callback) {
          callback({waiting: false})
        }
        promises = retries.map(retry => this.requestWithIndex(retry))
        const rs = await Promise.all(promises)
        retries = []
        for (const r of rs) {
          if (!r.res.isSuccess && r.res.statusCode() === 429) {
            retries.push({req: requests[r.index], index: r.index})
          } else {
            collectedResults[r.index] = r.res
            if (callback) {
              if (r.res.isSuccess) {
                callback({success: true})
              } else {
                callback({failure: true, failureMessage: r.res.getFormattedError()})
              }
            }
          }
        }
      }
    }
    if (callback) {
      callback({done: true})
    }
    return new PD.BatchResult(requests, collectedResults)
  }

  private spinnerCallback = (p: PD.CallbackParams) => {
    let updateStatusText = false
    if (p.start && !this.progressState.started) {
      this.progressState.failed = 0
      this.progressState.succeeded = 0
      this.progressState.total = 0
      cli.action.start(this.progressState.format)
      this.progressState.started = true
    }
    if (p.waiting !== undefined) {
      this.progressState.waiting = p.waiting
      updateStatusText = true
    }
    if (p.total) {
      this.progressState.total = p.total
      updateStatusText = true
    }
    if (p.success) {
      this.progressState.succeeded++
      updateStatusText = true
    }
    if (p.failure) {
      this.progressState.failed++
      updateStatusText = true
    }
    if (p.failureMessage) {
      log.error.bright.red(p.failureMessage)
    }
    if (updateStatusText) {
      const totalText = this.progressState.total < 0 ? '?' : this.progressState.total
      const successText = chalk.bold.green(`${this.progressState.succeeded}/${totalText} 👍`)
      const failureText = chalk.bold.red(`${this.progressState.failed}/${totalText} 👎`)
      let statusText = `${successText}, ${failureText}`
      if (this.progressState.waiting) statusText += chalk.bold.red(' Rate limited! Waiting')
      cli.action.start(this.progressState.format + ' ' + statusText)
    }
    if (p.done) {
      if (this.progressState.stopSpinnerWhenDone) cli.action.stop(chalk.bold.green('done'))
      this.progressState.started = false
    }
  }

  public async batchedRequestWithSpinner(requests: PD.Request[],
    p?: {
      batchSize?: number;
      activityDescription?: string;
      stopSpinnerWhenDone?: boolean;
    }): Promise<PD.BatchResult> {
    const batchSize = p?.batchSize || 10
    const activityDescription = p?.activityDescription || 'Talking to PD'
    const stopSpinnerWhenDone = !(p?.stopSpinnerWhenDone === false)

    this.progressState.stopSpinnerWhenDone = stopSpinnerWhenDone
    this.progressState.format = activityDescription
    const res = this.batchedRequest(requests,
      {
        batchSize: batchSize,
        callback: this.spinnerCallback,
        reportTotal: true,
      }
    )
    return res
  }

  private static endpointIdentifier(endpoint: string): string {
    if (endpoint.match(/users\/P.*\/sessions/)) {
      return 'user_sessions'
    }
    return endpoint.split('/').pop() as string
  }

  public async fetch(endpoint: string, p: {
    params?: object;
    headers?: object;
    method?: Method;
    data?: object;
    callback?: PD.Callback;
  } = {
    method: 'get',
  }) {
    if (p.callback) p.callback({start: true, total: 1})

    const endpoint_identifier = PD.endpointIdentifier(endpoint)
    const limit = 25
    const commonParams = {
      total: true,
      limit: limit,
    }

    let getParams
    if (!p.method || p.method?.toLowerCase() === 'get') {
      getParams = Object.assign({}, commonParams, p.params)
    } else {
      getParams = Object.assign({}, p.params)
    }

    let r = await this.request({
      endpoint: endpoint,
      method: p.method,
      params: getParams,
      headers: p.headers,
      data: p.data,
    })
    if (r.isFailure) {
      if (p.callback) {
        p.callback({
          failure: true,
          failureMessage: r.getFormattedError(),
          done: true,
        })
      }
      return []
    }
    if (p.callback) {
      p.callback({
        success: true,
      })
    }
    const firstPage = r.getData()
    let fetchedData
    if (endpoint_identifier in firstPage) {
      fetchedData = firstPage[endpoint_identifier]
    } else if ('data' in firstPage) {
      fetchedData = firstPage.data
    }

    if (firstPage.more && firstPage.total && !(firstPage.last)) {
      // classic pagination in parallel
      if (p.callback) {
        p.callback({
          total: Math.ceil(firstPage.total / limit),
        })
      }
      const requests: PD.Request[] = []
      for (let offset = limit; offset < firstPage.total; offset += limit) {
        getParams = Object.assign({}, getParams, {offset: offset})
        requests.push({
          endpoint: endpoint,
          method: p.method,
          params: getParams,
          headers: p.headers,
          data: p.data,
        })
      }
      const br = await this.batchedRequest(requests,
        {
          batchSize: limit,
          callback: p.callback,
        }
      )
      for (const v of br.getDatas()) {
        fetchedData = [...fetchedData, ...v[endpoint_identifier]]
      }
    } else if (firstPage.next_cursor) {
      // cursor-based pagination
      if (p.callback) p.callback({total: -1})
      let next_cursor = firstPage.next_cursor
      while (next_cursor) {
        getParams = Object.assign({}, getParams, {cursor: next_cursor})
        // eslint-disable-next-line no-await-in-loop
        r = await this.request({
          endpoint: endpoint,
          method: p.method,
          params: getParams,
          headers: p.headers,
          data: p.data,
        })
        if (p.callback) p.callback({success: true})
        const page = r.getData()
        fetchedData = [...fetchedData, ...page[endpoint_identifier]]
        next_cursor = page.next_cursor
      }
      if (p.callback) p.callback({done: true})
    } else if (firstPage.last && firstPage.more) {
      // cursor-based pagination with different cursor fields, as used by /analytics endpoints
      if (p.callback) p.callback({total: -1})
      let last = firstPage.last
      let more = true
      while (last && more) {
        const data = Object.assign({}, p.data, {starting_after: last})
        // getParams = Object.assign({}, getParams, {cursor: next_cursor})
        // eslint-disable-next-line no-await-in-loop
        r = await this.request({
          endpoint: endpoint,
          method: p.method,
          params: getParams,
          headers: p.headers,
          data: data,
        })
        if (p.callback) p.callback({success: true})
        const page = r.getData()
        fetchedData = [...fetchedData, ...page.data]
        last = page.last
        more = Boolean(page.more)
      }
      if (p.callback) p.callback({done: true})
    } else if (firstPage.more) {
      // classic pagination with missing 'total'
      if (p.callback) p.callback({total: -1})
      let more = firstPage.more
      let offset = 0
      while (more) {
        offset += limit
        getParams = Object.assign({}, getParams, {offset: offset})
        // eslint-disable-next-line no-await-in-loop
        r = await this.request({
          endpoint: endpoint,
          method: p.method,
          params: getParams,
          headers: p.headers,
          data: p.data,
        })
        if (p.callback) p.callback({success: true})
        const page = r.getData()
        fetchedData = [...fetchedData, ...page[endpoint_identifier]]
        more = page.more
      }
      if (p.callback) p.callback({done: true})
    } else if (p.callback) {
      p.callback({done: true})
    }
    return fetchedData
  }

  public async fetchWithSpinner(endpoint: string, p: {
    params?: object;
    headers?: object;
    method?: Method;
    data?: object;
    activityDescription?: string;
    stopSpinnerWhenDone?: boolean;
  } = {
    method: 'get',
    activityDescription: 'Fetching',
    stopSpinnerWhenDone: true,
  }): Promise<any[]> {
    this.progressState.stopSpinnerWhenDone = !(p?.stopSpinnerWhenDone === false)
    this.progressState.format = p.activityDescription ? p.activityDescription : 'Fetching'
    return this.fetch(endpoint, {params: p.params, headers: p.headers, method: p.method, data: p.data, callback: this.spinnerCallback})
  }

  private async objectIDForName(endpoint: string, name: string, attrToCompare = 'summary'): Promise<string | null> {
    const r = await this.request({
      endpoint: endpoint,
      method: 'GET',
      params: {query: name},
    })
    if (r.isFailure) {
      return null
    }
    try {
      const objs = r.getData()[endpoint].filter((x: any) => x[attrToCompare] === name)
      if (objs.length === 1) {
        return objs[0].id
      }
      return null
    } catch (error) {
      return null
    }
  }

  private async objectIDsForNames(endpoint: string, names: string[]): Promise<string[]> {
    let fetchedData: any[] = []
    for (const name of names) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const r = await this.fetch(endpoint, {params: {query: name}})
        fetchedData = [...fetchedData, ...r]
      } catch (error) {
      }
    }
    const fetchedIDs = fetchedData.map(x => x.id)
    return [...new Set(fetchedIDs)]
  }

  public async serviceIDForName(name: string): Promise<string | null> {
    return this.objectIDForName('services', name)
  }

  public async serviceIDsForNames(names: string[]): Promise<string[]> {
    return this.objectIDsForNames('services', names)
  }

  public async scheduleIDForName(name: string): Promise<string | null> {
    return this.objectIDForName('schedules', name)
  }

  public async scheduleIDsForNames(names: string[]): Promise<string[]> {
    return this.objectIDsForNames('schedules', names)
  }

  public async epIDForName(name: string): Promise<string | null> {
    return this.objectIDForName('escalation_policies', name)
  }

  public async epIDsForNames(names: string[]): Promise<string[]> {
    return this.objectIDsForNames('escalation_policies', names)
  }

  public async userIDForEmail(email: string): Promise<string | null> {
    return this.objectIDForName('users', email, 'email')
  }

  public async userIDsForEmails(emails: string[]): Promise<string[]> {
    return this.objectIDsForNames('users', emails)
  }

  public async teamIDForName(name: string): Promise<string | null> {
    return this.objectIDForName('teams', name)
  }

  public async teamIDsForNames(names: string[]): Promise<string[]> {
    return this.objectIDsForNames('teams', names)
  }

  private async getPrioritiesMapBy(attr: string): Promise<any> {
    const priorities = await this.fetch('priorities')
    const priorities_map: Record<string, any> = {}
    for (const priority of priorities) {
      priorities_map[priority[attr]] = priority
    }
    return priorities_map
  }

  public async getPrioritiesMapByName(): Promise<any> {
    return this.getPrioritiesMapBy('name')
  }

  public async getPrioritiesMapByID(): Promise<any> {
    return this.getPrioritiesMapBy('id')
  }
}

export namespace PD {
  export interface Request {
    endpoint: string;
    method?: Method;
    params?: object;
    data?: object;
    headers?: object;
  }

  export type Callback = (p: CallbackParams) => void

  export interface CallbackParams {
    start?: boolean;
    waiting?: boolean;
    success?: boolean;
    failure?: boolean;
    failureMessage?: string;
    total?: number;
    done?: boolean;
  }

  export class BatchResult {
    public requests: PD.Request[]

    public results: PD.Result<any>[]

    public isSuccess: boolean

    public constructor(requests: PD.Request[], results: PD.Result<any>[]) {
      this.requests = requests
      this.results = results
      this.isSuccess = this.results.every(x => x.isSuccess)
    }

    public getValues(): any[] {
      return this.results.filter(x => x.isSuccess).map(x => x.getValue())
    }

    public getDatas(): any[] {
      return this.results.filter(x => x.isSuccess).map(x => x.getData())
    }

    public getFailedIndices(): number[] {
      return this.results.map((x, i) => x.isSuccess ? null : i).filter(x => x !== null) as number[]
    }

    public getSucceededIndices(): number[] {
      return this.results.map((x, i) => x.isSuccess ? i : null).filter(x => x !== null) as number[]
    }
  }

  export interface Error {
    statusCode: number;
    errorObject: object;
  }

  export class Result<T> {
    public isSuccess: boolean

    public isFailure: boolean

    private value: T

    private constructor(isSuccess: boolean, value: any) {
      this.isSuccess = isSuccess
      this.isFailure = !isSuccess
      this.value = value
    }

    public static ok<U>(value: U): PD.Result<U> {
      return new PD.Result<U>(true, value)
    }

    public static fail<U>(error: U): PD.Result<U> {
      return new PD.Result<any>(false, error)
    }

    public getData(): T|null {
      const v = this.value as any
      return (this.isSuccess && v.data) ? v.data : null
    }

    public getValue(): T|null {
      return this.isSuccess ? this.value : null
    }

    public getError(): T|null {
      return this.isSuccess ? null : this.value
    }

    public getFormattedError(): string {
      if (this.isSuccess) return ''
      const v = this.value as any
      return `${v.response.status} ${v.response.statusText}` + (v.response?.data?.error?.message ? `: ${v.response.data.error.message}` : '')
    }

    public statusCode(): number {
      const v = this.value as any
      if (v.status) {
        return v.status
      }
      if (v.response?.status) {
        return v.response.status
      }
      return -1
    }
  }
}
