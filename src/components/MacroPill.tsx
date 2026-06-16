type MacroPillProps = {
  label: string;
  value: string;
};

export function MacroPill({ label, value }: MacroPillProps) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2">
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1 text-lg font-semibold text-foreground">{value}</div>
    </div>
  );
}
