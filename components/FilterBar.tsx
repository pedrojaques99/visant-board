interface FilterBarProps {
  tipos: string[];
  selectedTipo: string | null;
  onTipoChange: (tipo: string | null) => void;
}

export function FilterBar({ tipos, selectedTipo, onTipoChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
      <button
        onClick={() => onTipoChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedTipo === null
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'border border-border hover:border-foreground text-muted-foreground hover:text-foreground'
        }`}
      >
        All
      </button>
      {tipos.map((tipo) => (
        <button
          key={tipo}
          onClick={() => onTipoChange(tipo)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedTipo === tipo
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'border border-border hover:border-foreground text-muted-foreground hover:text-foreground'
          }`}
        >
          {tipo}
        </button>
      ))}
    </div>
  );
} 