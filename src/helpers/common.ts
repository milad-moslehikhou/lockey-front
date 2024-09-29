import { OrderType } from '../types/component'
import moment, { Moment } from 'moment'
import { ColorResult } from 'react-color'

export const stringToColor = (string: string) => {
  let hash = 0
  let i

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  return color
}

export const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export const getComparator = <Key extends keyof any>(
  order: OrderType,
  orderBy: Key
): ((a: { [key in Key]: any }, b: { [key in Key]: any }) => number) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

export const humanizeDate = (date: Date): string => {
  const now = moment(new Date())
  const pass = moment(date)
  const diff = pass.diff(now)
  return moment.duration(diff).humanize(true)
}

export const formatDate = (date: Date): string => {
  const d = moment(date)
  return d.format('YYYY-MM-DD hh:mm:ss')
}

export const colorConverters = {
  rgba: (color: ColorResult) => `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
  rgb: (color: ColorResult) => `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
  hex: (color: ColorResult) => color.hex,
  rgbaToRgb: (color: ColorResult) => (color.rgb.a === 1 ? colorConverters.rgb(color) : colorConverters.rgba(color)),
  rgbaToHex: (color: ColorResult) => (color.rgb.a === 1 ? colorConverters.hex(color) : colorConverters.rgba(color)),
}
