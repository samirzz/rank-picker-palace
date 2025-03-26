import { useState, useEffect } from "react";
import { Rank } from "@/data/ranks/types";

interface UseRankSelectorProps {
  label: string;
  selectedRank: Rank | null;
  onRankSelect: (rank: Rank, subdivisionIndex?: number) => void;
  animationDelay?: number;
}

export const useRankSelector = ({
  label,
  selectedRank,
  onRankSelect,
  animationDelay = 0
}: UseRankSelectorProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubdivision, setSelectedSubdivision] = useState(0);
  const [showSubdivisions, setShowSubdivisions] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);
    
    return () => clearTimeout(timer);
  }, [animationDelay]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const dropdownContainer = document.getElementById('rank-selector-dropdown-' + label.replace(/\s+/g, '-').toLowerCase());
      
      if (dropdownContainer && !dropdownContainer.contains(target) && isExpanded) {
        setIsExpanded(false);
        setShowSubdivisions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, label]);

  const handleRankClick = (rank: Rank, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (selectedRank?.id === rank.id) {
      // If same rank is clicked, just toggle subdivisions if available
      if (rank.subdivisions && rank.subdivisions.length > 0) {
        setShowSubdivisions(true);
      } else {
        setIsExpanded(false);
      }
      return;
    }
    
    setSelectedSubdivision(0);
    onRankSelect(rank, 0);
    
    if (rank.subdivisions && rank.subdivisions.length > 0) {
      setShowSubdivisions(true);
    } else {
      setIsExpanded(false);
    }
  };
  
  const handleSubdivisionClick = (rank: Rank, subdivisionIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSubdivision(subdivisionIndex);
    onRankSelect(rank, subdivisionIndex);
    setShowSubdivisions(false);
    setIsExpanded(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setShowSubdivisions(false);
    }
  };

  const handleBackToRanks = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSubdivisions(false);
  };

  return {
    isVisible,
    isExpanded,
    selectedSubdivision,
    showSubdivisions,
    toggleDropdown,
    handleRankClick,
    handleSubdivisionClick,
    handleBackToRanks,
    dropdownId: `rank-selector-dropdown-${label.replace(/\s+/g, '-').toLowerCase()}`
  };
};
