import React, { useState } from 'react';
import { deleteReminder, completeReminder } from '../api/sync.js';

const COLORS = ["#00d1ff", "#feb127", "#a78bfa", "#34d399", "#f472b6"];

function timeRemaining(deadline) {
  if (!deadline) return null;
  const diff = new Date(deadline) - new Date();

  if (diff < 0) return { 
    label: "Overdue", color: "#f87171" 
};
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return { 
    label: "Due today", color: "#feb127" 
};
  if (days === 1) return { 
    label: "1 day left", color: "#feb127" 
};
  return { 
    label: `${days} days left`, color: "#34d399" 
};
}

function formatDate(deadline) {
  if (!deadline) return "No deadline";
  return new Date(deadline).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// variant="pending" → ✓ active + ✕ active
// variant="completed" → ✓ disabled + ✕ active
function TaskCard({ task, index, onDelete, onComplete, variant = "pending" }) {
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);

  const isCompleted = (variant === "completed");
  const accent = COLORS[index % COLORS.length];
  const remaining = timeRemaining(task.deadline);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteReminder(task._id);
      onDelete(task._id);
    } catch (err) {
      console.error("Delete failed:", err);
      setDeleting(false);
    }
  };

  const handleComplete = async () => {
    if (isCompleted) return;
    setCompleting(true);
    try {
      await completeReminder(task._id);
      onComplete?.(task._id);
    } catch (err) {
      console.error("Complete failed:", err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div
      className="p-4 rounded-xl flex items-start gap-4 transition-all duration-300"
      style={{
        background: "rgba(21,27,45,0.4)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${isCompleted ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.1)"}`,
        opacity: isCompleted ? 0.6 : 1,
      }}
    >
      {/* Accent bar */}
      <div
        className="w-1.5 rounded-full mt-1 shrink-0"
        style={{ backgroundColor: accent, minHeight: "40px" }}
      />

      {/* Content */}
      <div className="flex-grow flex flex-col gap-2 min-w-0">
        <span
          className="text-base leading-snug"
          style={{
            color: "#dce1fb",
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {task.task}
        </span>

        <div className="flex items-center gap-3 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#859399",
            }}
          >
            📅 {formatDate(task.deadline)}
          </span>

          {remaining && !isCompleted && (
            <span className="text-xs font-medium" style={{ color: remaining.color }}>
              ⏱ {remaining.label}
            </span>
          )}

          {isCompleted && (
            <span className="text-xs font-medium" style={{ color: "#34d399" }}>
              ✓ Completed
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        {/* Complete button — disabled if completed */}
        <button
          onClick={handleComplete}
          disabled={isCompleted || completing}
          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
          style={{
            background: "rgba(52,211,153,0.1)",
            border: "1px solid rgba(52,211,153,0.3)",
            color: isCompleted ? "rgba(52,211,153,0.3)" : "#34d399",
            cursor: isCompleted ? "not-allowed" : "pointer",
          }}
        >
          {completing ? "..." : "✓"}
        </button>

        {/* Delete button — always active */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.3)",
            color: "#f87171",
            cursor: deleting ? "not-allowed" : "pointer",
          }}
        >
          {deleting ? "..." : "✕"}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;