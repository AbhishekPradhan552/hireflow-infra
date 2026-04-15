export default function ScoreBadge({ score, status }) {
  if (status === "PROCESSING")
    return <span className="text-xs text-gray-500 italic">Processing…</span>;

  if (status === "FAILED")
    return <span className="text-xs text-red-600">Parse failed</span>;

  if (score == null)
    return <span className="text-xs text-gray-400">—</span>;

  let color = "bg-red-100 text-red-700";
  if (score >= 70) color = "bg-green-100 text-green-700";
  else if (score >= 40) color = "bg-yellow-100 text-yellow-700";

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
      {score}
    </span>
  );
}
