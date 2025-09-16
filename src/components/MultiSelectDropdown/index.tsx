import { useEffect, useRef, useState } from "react";
import type { OptionType } from "../../mocks/types";
import { ChevronDown, Search, X } from "lucide-react";

interface MultiSelectDropdownProps {
  options?: OptionType[];
  loadOptions?: () => Promise<OptionType[]>;
  value?: OptionType[];
  onChange?: (selected: OptionType[]) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options: propOptions = [],
  loadOptions,
  value = [],
  onChange,
  placeholder = "Select options...",
  searchable = true,
  clearable = true,
  disabled = false,
  className = "",
  maxHeight = 200,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [options, setOptions] = useState<OptionType[]>(propOptions);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (propOptions.length > 0) {
      setOptions(propOptions);
    }
  }, [propOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchOptions = async (): Promise<void> => {
      if (!loadOptions || options.length > 0) return;

      setIsLoading(true);
      try {
        const data = await loadOptions();
        setOptions(data);
      } catch (error) {
        console.error("Error loading options:", error);
      }
      setIsLoading(false);
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen, loadOptions, options.length]);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.find((selected) => selected.value === option.value)
  );

  const handleSelect = (option: OptionType): void => {
    const newValue = [...value, option];
    onChange?.(newValue);
    setSearchTerm("");
  };

  const handleRemove = (valueToRemove: string): void => {
    const newValue = value.filter((item) => item.value !== valueToRemove);
    onChange?.(newValue);
  };

  const handleClearAll = (): void => {
    onChange?.([]);
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer min-h-[42px] flex items-center justify-between ${
          disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400"
        }`}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {value.length === 0 ? (
            <span className="text-gray-500">{placeholder}</span>
          ) : (
            value.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm"
              >
                {item.label}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.value);
                  }}
                  className="hover:text-teal-600"
                  disabled={disabled}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <div className="flex items-center gap-2">
          {clearable && value.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="text-gray-400 hover:text-gray-600"
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div style={{ maxHeight }} className="overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 mx-auto"></div>
                <p className="mt-2">Loading options...</p>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No options available
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <span>{option.label}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
