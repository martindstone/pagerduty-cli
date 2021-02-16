import cli from 'cli-ux'

/* eslint-disable no-process-exit */
/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-console */
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

export async function printJsonAndExit(data: any) {
  process.stdout.on('drain', () => {
    process.exit(0)
  })
  if (process.stdout.write(JSON.stringify(data, null, 2))) {
    process.exit(0)
  }
  await cli.wait(10000)
  console.error('Timed out waiting for pipe', {exit: 1})
}
