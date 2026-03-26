import { Building2 } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Building2 size={28} className="text-white" />
        </div>
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0ms]"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]"></div>
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:300ms]"></div>
        </div>
      </div>
    </div>
  );
}
