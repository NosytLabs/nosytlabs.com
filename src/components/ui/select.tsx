import * as React from 'react';
import { forwardRef, useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Loader2, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  variant?: 'default' | 'error' | 'success';
  errorMessage?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  loading?: boolean;
  containerClassName?: string;
  searchable?: boolean;
  animated?: boolean;
  maxHeight?: string;
  emptyMessage?: string;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ 
    options,
    value,
    defaultValue,
    placeholder = 'Select an option',
    variant = 'default',
    errorMessage,
    helperText,
    disabled = false,
    required = false,
    className,
    onChange,
    onBlur,
    name,
    loading = false,
    containerClassName,
    searchable = false,
    animated = true,
    maxHeight = '200px',
    emptyMessage = 'No options found',
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const selectRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
    const hasError = variant === 'error' || !!errorMessage;
    const hasSuccess = variant === 'success';
    
    const selectedOption = options.find(option => option.value === selectedValue);
    
    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);
    
    // Filter options based on search term
    useEffect(() => {
      if (!searchable) {
        setFilteredOptions(options);
        return;
      }

      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
      setFocusedIndex(-1);
    }, [searchTerm, options, searchable]);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setFocusedIndex(-1);
          setSearchTerm('');
        }
      };
      
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
      return undefined;
    }, [isOpen]);
    
    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        setFocusedIndex(-1);
      }
    };
    
    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      setIsOpen(false);
      setFocusedIndex(-1);
      setSearchTerm('');
      onChange?.(optionValue);
    };
    
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;
      
      switch (event.key) {
        case 'Enter':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
          } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            const option = filteredOptions[focusedIndex];
            if (option && !option.disabled) {
              handleSelect(option.value);
            }
          }
          break;
          
        case ' ':
          if (!searchable || !isOpen) {
            event.preventDefault();
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }
          }
          break;
          
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          setSearchTerm('');
          break;
          
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
          } else {
            const nextIndex = focusedIndex < filteredOptions.length - 1 ? focusedIndex + 1 : 0;
            setFocusedIndex(nextIndex);
          }
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 100);
          } else {
            const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : filteredOptions.length - 1;
            setFocusedIndex(prevIndex);
          }
          break;
          
        case 'Tab':
          setIsOpen(false);
          setFocusedIndex(-1);
          setSearchTerm('');
          onBlur?.();
          break;
      }
    };
    
    return (
      <div className="w-full">
        <div className="relative" ref={selectRef}>
          {/* Hidden input for form submission */}
          <input
            type="hidden"
            name={name}
            value={selectedValue}
            required={required}
          />
          
          {/* Select trigger */}
          <button
            ref={ref}
            type="button"
            className={cn(
              // Base styles
              'flex h-12 w-full items-center justify-between rounded-lg border bg-background px-3 py-2 text-base text-left',
              'focus-visible:outline-none transition-all duration-200 ease-in-out',
              'disabled:cursor-not-allowed disabled:opacity-50',
              
              // Variant styles
              {
                // Default state
                'border-border-muted text-text-primary': !hasError && !hasSuccess,
                'focus:border-primary focus:ring-2 focus:ring-primary/20': !hasError && !hasSuccess,
                'hover:border-border-hover': !hasError && !hasSuccess && !disabled,
                
                // Error state
                'border-error text-text-primary bg-error/5': hasError,
                'focus:border-error focus:ring-2 focus:ring-error/20': hasError,
                
                // Success state
                'border-success text-text-primary bg-success/5': hasSuccess,
                'focus:border-success focus:ring-2 focus:ring-success/20': hasSuccess,
              },
              
              className
            )}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-required={required}
            {...props}
          >
            <span className={cn(
              selectedOption ? 'text-text-primary' : 'text-text-muted'
            )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <ChevronDown 
                className={cn(
                  'h-4 w-4 text-text-secondary transition-all duration-300 ease-out',
                  isOpen && 'rotate-180 text-primary'
                )}
              />
            )}
          </button>
          
          {/* Dropdown */}
          {isOpen && (
            <div 
              className={cn(
                "absolute z-50 w-full mt-1 bg-background border border-border-muted rounded-lg shadow-lg backdrop-blur-sm overflow-hidden",
                animated && 'animate-slideDown origin-top'
              )}
              style={{ maxHeight }}
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-border-muted">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search options..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-sm bg-transparent border-0 focus:outline-none placeholder:text-text-muted"
                      autoFocus
                    />
                  </div>
                </div>
              )}
              
              {/* Options List */}
              <div className="overflow-auto" style={{ maxHeight: searchable ? 'calc(100% - 60px)' : '100%' }}>
                <ul
                  ref={listRef}
                  role="listbox"
                  className="py-1"
                >
                  {filteredOptions.length === 0 ? (
                    <li className="px-3 py-4 text-sm text-text-muted text-center">
                      {emptyMessage}
                    </li>
                  ) : (
                    filteredOptions.map((option, index) => (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={selectedValue === option.value}
                        className={cn(
                          'flex items-center justify-between px-3 py-2.5 text-base cursor-pointer transition-all duration-200 ease-out',
                          {
                            'bg-primary/10 text-primary': focusedIndex === index,
                            'text-text-primary hover:bg-surface-secondary hover:translate-x-1': focusedIndex !== index && !option.disabled,
                            'text-text-muted cursor-not-allowed': option.disabled,
                            'bg-primary/5 border-r-2 border-primary': selectedValue === option.value && focusedIndex !== index,
                          },
                          animated && 'animate-fadeIn'
                        )}
                        onClick={() => {
                          if (!option.disabled) {
                            handleSelect(option.value);
                          }
                        }}
                        onMouseEnter={() => setFocusedIndex(index)}
                      >
                        <span className="truncate">{option.label}</span>
                        {selectedValue === option.value && (
                          <Check className="h-4 w-4 text-primary animate-scaleIn" />
                        )}
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <p className="mt-1 text-sm text-error flex items-center gap-1">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errorMessage}
          </p>
        )}
        
        {/* Helper text */}
        {helperText && !errorMessage && (
          <p className="mt-1 text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
export default Select;