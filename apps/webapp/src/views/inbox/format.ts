export const humanizeValue = (value?: string | null) => {
  if (!value) {
    return 'Unclassified'
  }

  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

export const isClassifiedValue = (value?: string | null) => {
  return Boolean(value && value.trim().toLowerCase() !== 'unclassified')
}

export const formatShortTime = (value: string) => {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export const formatDate = (value: string) => {
  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
  }).format(new Date(value))
}

export const formatFullDateTime = (value: string) => {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export const getNights = (startDate: string, endDate: string) => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const day = 24 * 60 * 60 * 1000

  return Math.max(1, Math.round((end - start) / day))
}
