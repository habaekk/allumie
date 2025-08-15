'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Label } from './label';
import { searchFoods, FoodNutrition } from '@/lib/foodSearch';
import { ChevronDown, Search } from 'lucide-react';

interface FoodAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onFoodSelect: (food: FoodNutrition) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function FoodAutocomplete({
  value,
  onChange,
  onFoodSelect,
  placeholder = "음식명을 입력하세요",
  label = "음식명",
  className = "",
}: FoodAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<FoodNutrition[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 검색어 변경시 자동완성 목록 업데이트
  useEffect(() => {
    if (value.trim().length >= 1) {
      const results = searchFoods(value, 8);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value]);

  // 외부 클릭시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (food: FoodNutrition) => {
    onChange(food.name);
    onFoodSelect(food);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Label className="text-xs text-gray-600 mb-1 block">
        {label} *
      </Label>
      
      <div className="relative">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="text-sm pr-8"
          autoComplete="off"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {value && suggestions.length === 0 ? (
            <Search className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown 
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          )}
        </div>
      </div>

      {/* 자동완성 드롭다운 */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((food, index) => (
            <div
              key={food.코드}
              className={`px-3 py-2 cursor-pointer transition-colors text-sm ${
                index === selectedIndex
                  ? 'bg-orange-50 text-orange-700'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSuggestionClick(food)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="font-medium text-gray-900">{food.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                칼로리: {food.calories}kcal | 
                단백질: {food.protein}g | 
                탄수화물: {food.carbohydrates}g | 
                지방: {food.fat}g
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
