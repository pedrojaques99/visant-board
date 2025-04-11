interface FilterBarProps {
  tipos: string[];
  selectedTipo: string | null;
  onTipoChange: (tipo: string | null) => void;
}

export function FilterBar({ tipos, selectedTipo, onTipoChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <button
        onClick={() => onTipoChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedTipo === null
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {tipos.map((tipo) => (
        <button
          key={tipo}
          onClick={() => onTipoChange(tipo)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTipo === tipo
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {tipo}
        </button>
      ))}
    </div>
  );
} 