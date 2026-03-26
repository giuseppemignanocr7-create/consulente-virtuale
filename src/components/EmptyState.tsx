import { FileX, Search, Inbox, FolderOpen } from 'lucide-react';
import type { ReactNode } from 'react';

const icons: Record<string, ReactNode> = {
  search: <Search size={48} strokeWidth={1.5} />,
  file: <FileX size={48} strokeWidth={1.5} />,
  inbox: <Inbox size={48} strokeWidth={1.5} />,
  folder: <FolderOpen size={48} strokeWidth={1.5} />,
};

interface EmptyStateProps {
  icon?: 'search' | 'file' | 'inbox' | 'folder';
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
        {icons[icon]}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="btn btn-primary px-6 py-2.5">
          {action.label}
        </button>
      )}
    </div>
  );
}
