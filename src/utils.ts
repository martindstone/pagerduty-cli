import {CliUx} from '@oclif/core'

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

export function scheduleRotationSecondsToHuman(given_seconds: number) {
  const days = Math.floor(given_seconds / (3600 * 24))
  const weeks = Math.floor(days / 7)
  const hours = Math.floor((given_seconds - (days * 3600 * 24)) / 3600)
  const minutes = Math.floor((given_seconds - (days * 3600 * 24) - (hours * 3600)) / 60)
  const seconds = given_seconds - (days * 3600 * 24) - (hours * 3600) - (minutes * 60)

  if (weeks && !days && !hours) return `${weeks} week${weeks > 1 ? 's' : ''}`
  if (!weeks && days && !hours) return `${days} day${days > 1 ? 's' : ''}`
  if (!weeks && !days && hours) return `${hours} hour${hours > 1 ? 's' : ''}`
  return `${days ? days + 'd' : ''} ${hours ? hours + 'h' : ''} ${minutes ? minutes + 'm' : ''} ${seconds ? seconds + 's' : ''}`
}

export function scheduleRotationTypeString(given_seconds: number) {
  if (given_seconds === (7 * 24 * 60 * 60)) {
    return 'weekly'
  }
  if (given_seconds === (24 * 60 * 60)) {
    return 'daily'
  }
  return `custom: ${scheduleRotationSecondsToHuman(given_seconds)}`
}

export function scheduleRestrictionDayNumberToString(dayNumber: number) {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return dayNames[dayNumber % 7]
}

export function addSecondsToLocalTimeString(localTime: string, seconds_to_add: number): string {
  const [hours, minutes, seconds] = localTime.split(':').map(x => parseInt(x, 10))
  const startSeconds = (hours * 3600) + (minutes * 60) + seconds
  const endSeconds = startSeconds + seconds_to_add
  const endH = Math.floor(endSeconds / 3600)
  const endM = Math.floor((endSeconds - (endH * 3600)) / 60)
  const endS = endSeconds - (endH * 3600) - (endM * 60)
  return `${(endH % 24).toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}:${endS.toString().padStart(2, '0')}`
}

export function scheduleRestrictionString(restriction: any): string {
  if (restriction.type === 'daily_restriction') {
    return `Daily ${restriction.start_time_of_day} - ${addSecondsToLocalTimeString(restriction.start_time_of_day, restriction.duration_seconds)}`
  }
  if (restriction.type === 'weekly_restriction') {
    const startDay = scheduleRestrictionDayNumberToString(restriction.start_day_of_week)
    const startTime = restriction.start_time_of_day
    const endDay = scheduleRestrictionDayNumberToString(restriction.start_day_of_week + Math.floor(restriction.duration_seconds / (24 * 60 * 60)))
    const endTime = addSecondsToLocalTimeString(restriction.start_time_of_day, restriction.duration_seconds)
    return `${startDay} ${startTime} - ${endDay} ${endTime}`
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
  return arr.filter(e => !e.match(/^[P|Q][\w]{6,13}$/))
}

export async function printJsonAndExit(data: any) {
  if (!data) {
    process.exit(0)
  }
  process.stdout.on('drain', () => {
    process.exit(0)
  })
  if (process.stdout.write(JSON.stringify(data, null, 2) + '\n')) {
    process.exit(0)
  }
  await CliUx.ux.wait(10000)
  console.error('Timed out waiting for pipe', {exit: 1})
}

export function putBodyForSetAttributes(
  pdObjectType: string,
  pdObjectId: string,
  attributes: { key: string; value: string | null }[],
) {
  const body: Record<string, any> = {
    [pdObjectType]: {
      id: pdObjectId,
      type: `${pdObjectType}_reference`,
    },
  }
  for (const attribute of attributes) {
    body[pdObjectType][attribute.key] = (attribute.value && attribute.value.trim().length > 0) ? attribute.value : null
  }
  return body
}

export function putBodyForSetAttribute(
  pdObjectType: string,
  pdObjectId: string,
  pdAttributeName: string,
  pdAttributeValue: string | null
) {
  return putBodyForSetAttributes(pdObjectType, pdObjectId, [{key: pdAttributeName, value: pdAttributeValue}])
}
