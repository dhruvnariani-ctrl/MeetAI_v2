
import {
  dateKey,
  pad,
} from '../../utils/calenderDates'

export const toDateInput = (date) =>
  dateKey(date)

export const toTimeInput = (date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`

export function defaultTimes() {
  const start = new Date()

  start.setSeconds(0, 0)
  start.setMinutes(
    start.getMinutes() < 30 ? 30 : 60,
  )

  return {
    start: toTimeInput(start),
    end: toTimeInput(
      new Date(start.getTime() + 30 * 60000),
    ),
  }
}
