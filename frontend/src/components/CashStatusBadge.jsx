import Badge from './Badge'
import { STATUS_LABELS } from '../lib/format'

export default function CashStatusBadge({ status }) {
  const labels = {
    SAFE: 'Safe',
    WARNING: 'Warning',
    SHORTAGE: 'Shortage',
  }
  return <Badge value={status} label={labels[status] ?? STATUS_LABELS[status]} />
}
