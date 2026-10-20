export function Table({ children, className = "" }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#FFFDF8] dark:bg-[#111C38] shadow-[0_1px_3px_0_rgba(16,42,42,0.04)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.4)]">
      <table className={`w-full text-left text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = "" }) {
  return (
    <thead className={`border-b border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }) {
  return <tbody className={`divide-y divide-[#E8E7DE] dark:divide-[#1E2D4A] ${className}`}>{children}</tbody>;
}

export function TableRow({ children, className = "", hover = true, ...props }) {
  return (
    <tr
      className={`transition-colors duration-150 ${
        hover ? "hover:bg-[#F8F7F0]/80 dark:hover:bg-[#162447]/60" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableHead({ children, className = "", ...props }) {
  return (
    <th
      className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8] ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className = "", ...props }) {
  return (
    <td className={`px-6 py-4 text-[#102A2A] dark:text-[#F8FAFC] font-normal ${className}`} {...props}>
      {children}
    </td>
  );
}

export function TableEmptyState({ title = "No data found", description = "", children }) {
  return (
    <div className="py-12 px-6 text-center">
      <p className="text-base font-bold text-[#102A2A] dark:text-[#F8FAFC]">{title}</p>
      {description && <p className="mt-1 text-sm text-[#66736E] dark:text-[#94A3B8]">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default Table;
