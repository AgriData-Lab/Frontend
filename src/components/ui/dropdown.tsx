// src/components/ui/dropdown.tsx
import React from "react";

interface DropdownProps {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ items, selected, onSelect }) => {
  return (
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
      className="border px-3 py-2 rounded"
    >
      {items.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};
