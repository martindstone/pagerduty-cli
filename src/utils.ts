import dotProp from 'dot-prop'

export function formatField(field: any): string {
  switch (typeof field) {
  case 'undefined':
    return '(undefined)'
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
    return '(null)'
  }
  return '(undefined)'
}

export function formatRow(pdObject: object, pathPrefix: string, fields: string[], delimiter = '|') {
  return fields.map(e => formatField(dotProp.get(pdObject, `${pathPrefix}.${e}`))).join(delimiter)
}

export function splitStringArrayOnWhitespace(arr: string[]) {
  let retval: string[] = []
  for (const e of arr) {
    retval = [...retval, ...(e.split(/[\s]+/).filter(s => s))]
  }
  return retval
}
