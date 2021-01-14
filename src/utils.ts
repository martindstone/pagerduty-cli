export function formatField(field: any, delimiter = '\n'): string {
  switch (typeof field) {
  case 'undefined':
    return ''
  case 'number':
  case 'bigint':
  case 'boolean':
  case 'string':
  case 'symbol':
    return field.toString()
  case 'object':
    if (field) {
      if (Array.isArray(field)) {
        return field.join(delimiter)
      }
      return JSON.stringify(field)
    }
    return ''
  }
  return ''
}

export function splitDedupAndFlatten(arr: any[]): string[] {
  if (!arr) {
    return []
  }
  return [...new Set(arr.flat().map(e => e.split(/[\s,]+/)).flat().filter(e => e))]
}

export function invalidPagerDutyIDs(arr: string[]) {
  return arr.filter(e => !e.match(/^P[\w]{6}/))
}
