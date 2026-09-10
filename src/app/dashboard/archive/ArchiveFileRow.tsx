"use client";

import { deleteFile } from "./actions";

export type ArchiveFileRow = {
  id: string;
  file_name: string;
  storage_path: string;
  size_bytes: number | null;
  description: string | null;
  created_at: string;
  downloadUrl: string | null;
};

function formatSize(bytes: number | null) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ArchiveFileRow({ file }: { file: ArchiveFileRow }) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-vita-100 bg-white px-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-vita-900">{file.file_name}</p>
        <p className="truncate text-xs text-vita-500">
          {new Date(file.created_at).toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {formatSize(file.size_bytes) ? ` · ${formatSize(file.size_bytes)}` : ""}
          {file.description ? ` · ${file.description}` : ""}
        </p>
      </div>
      {file.downloadUrl && (
        <a
          href={file.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-sm font-medium text-vita-600 hover:text-vita-800"
        >
          İndir
        </a>
      )}
      <button
        onClick={() => deleteFile(file.id, file.storage_path)}
        className="shrink-0 text-sm text-vita-400 hover:text-red-500"
        aria-label="Sil"
      >
        Sil
      </button>
    </li>
  );
}
