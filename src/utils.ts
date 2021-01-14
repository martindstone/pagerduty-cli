import dotProp from 'dot-prop'

export function formatField(field: any): string {
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
      return JSON.stringify(field)
    }
    return ''
  }
  return ''
}

export function formatRow(pdObject: object, pathPrefix: string, fields: string[], delimiter = '|') {
  return fields.map(e => formatField(dotProp.get(pdObject, `${pathPrefix}.${e}`))).join(delimiter)
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
