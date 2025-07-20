import { useMemo } from 'react'

interface StatusBarProps {
  selectedRange: string[]
  getCellValue: (cellId: string) => string
}

export function StatusBar({ selectedRange, getCellValue }: StatusBarProps) {
  const stats = useMemo(() => {
    const values = selectedRange
      .map(cellId => getCellValue(cellId))
      .filter(value => value.trim() !== '')
      .map(value => parseFloat(value))
      .filter(value => !isNaN(value))

    if (values.length === 0) {
      return { count: 0, sum: 0, average: 0 }
    }

    const sum = values.reduce((acc, val) => acc + val, 0)
    const average = sum / values.length

    return {
      count: values.length,
      sum,
      average
    }
  }, [selectedRange, getCellValue])

  return (
    <div className="h-5 bg-[#f3f2f1] border-t border-[#d1d1d1] flex items-center justify-between px-2 text-xs">
      <div className="flex items-center gap-4">
        <span>Ready</span>
      </div>
      
      <div className="flex items-center gap-4">
        {stats.count > 0 && (
          <>
            <span>Count: {stats.count}</span>
            <span>Sum: {stats.sum.toFixed(2)}</span>
            <span>Average: {stats.average.toFixed(2)}</span>
          </>
        )}
        <span>Sheet 1 of 1</span>
      </div>
    </div>
  )
}