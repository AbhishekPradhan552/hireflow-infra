
"use client"

export default function UsageBar({ used, limit }) {
  const percent = Math.min((used / limit) * 100, 100)

  const isNearLimit = percent >= 80
  const isFull = percent >= 100

  return (
    <div className="space-y-3">

      {/* Top Row */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-800">
          Resume usage
        </p>

        <span
          className={`text-xs font-medium ${
            isFull
              ? "text-red-600"
              : isNearLimit
              ? "text-yellow-600"
              : "text-gray-500"
          }`}
        >
          {used} / {limit}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isFull
              ? "bg-red-500"
              : isNearLimit
              ? "bg-yellow-500"
              : "bg-blue-600"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Bottom Info */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          {percent.toFixed(0)}% used
        </span>

        {isNearLimit && !isFull && (
          <span className="text-yellow-600">
            Approaching limit
          </span>
        )}

        {isFull && (
          <span className="text-red-600">
            Limit reached
          </span>
        )}
      </div>

    </div>
  )
}

