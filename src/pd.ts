import axios, {Method} from 'axios'

const BASE_URL = 'https://api.pagerduty.com'

export function isBearerToken(token: string): boolean {
  if (token && token.match(/^[0-9a-fA-F]{64}$/)) {
    return true
  }
  return false
}

export function isLegacyToken(token: string): boolean {
  // eslint-disable-next-line no-useless-escape
  if (token && token.match(/^[0-9a-zA-Z_\-]{20}$/)) {
    return true
  }
  return false
}

export function isValidToken(token: string): boolean {
  if (isBearerToken(token) || isLegacyToken(token)) {
    return true
  }
  return false
}

export function authHeaderForToken(token: string): string {
  if (isBearerToken(token)) {
    return `Bearer ${token}`
  // eslint-disable-next-line no-else-return
  } else if (isLegacyToken(token)) {
    return `Token token=${token}`
  }
  throw new Error(`Invalid token ${token}`)
}

// eslint-disable-next-line max-params
export async function request(
  token: string,
  endpoint: string,
  method: Method = 'GET',
  params: object | null = {},
  data?: object
) {
  const h = {
    Accept: 'application/vnd.pagerduty+json;version=2',
    Authorization: authHeaderForToken(token),
    'Content-Type': 'application/json',
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
  return r.data
}

export async function fetch(
  token: string,
  endpoint: string,
  params: object | null = {}
) {
  const endpoint_identifier = endpoint.split('/').pop() as string
  const limit = 100
  const commonParams = {
    total: true,
    limit: limit,
  }
  let getParams = Object.assign({}, commonParams, params)
  const firstPage = await request(token, endpoint, 'get', getParams)
  let fetchedData = firstPage[endpoint_identifier]

  if (firstPage.more) {
    const promises: any[] = []
    for (let offset = limit; offset < firstPage.total; offset += limit) {
      getParams = Object.assign({}, getParams, {offset: offset})
      promises.push(request(token, endpoint, 'get', getParams))
    }
    const pages = await Promise.all(promises)
    pages.forEach(page => {
      fetchedData = [...fetchedData, ...page[endpoint_identifier]]
    })
  }
  return fetchedData
}

export async function me(token: string) {
  if (!isBearerToken(token)) {
    return null
  }
  const r = await request(token, '/users/me')
  return r
}
