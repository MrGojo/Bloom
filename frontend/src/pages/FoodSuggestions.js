import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Zap, ChefHat, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { getRecipes } from '../utils/api';

export default function FoodSuggestions() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lazyModeOnly, setLazyModeOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
  
  useEffect(() => {
    fetchRecipes();
  }, []);
  
  useEffect(() => {
    filterRecipes();
  }, [recipes, activeCategory, lazyModeOnly, searchQuery]);
  
  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data || []);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filterRecipes = () => {
    let filtered = recipes;
    
    if (activeCategory !== 'All') {
      filtered = filtered.filter(r => r.category === activeCategory);
    }
    
    if (lazyModeOnly) {
      filtered = filtered.filter(r => r.is_lazy_mode);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredRecipes(filtered);
  };
  
  const RecipeCard = ({ recipe }) => (
    <motion.div
      data-testid={`recipe-${recipe.name.toLowerCase().replace(/\s+/g, '-')}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-pcos-xl overflow-hidden shadow-pcos-card"
    >
      {recipe.image_url && (
        <div className="h-40 bg-gradient-to-br from-pcos-secondary to-pcos-primary overflow-hidden">
          <img 
            src={recipe.image_url} 
            alt={recipe.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-heading font-bold text-pcos-text flex-1">
            {recipe.name}
          </h3>
          {recipe.is_lazy_mode && (
            <span className="flex-shrink-0 px-2 py-1 bg-pcos-success/20 rounded-full text-xs font-body font-medium text-green-700 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Quick
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-pcos-text-muted font-body">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prep_time}</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{recipe.category}</span>
          </div>
        </div>
        
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <h4 className="text-xs font-body font-medium text-pcos-text-muted mb-2">Ingredients:</h4>
            <div className="flex flex-wrap gap-1">
              {recipe.ingredients.slice(0, 4).map((ingredient, i) => (
                <span key={i} className="px-2 py-1 bg-pcos-secondary/20 rounded-full text-xs font-body text-pcos-text">
                  {ingredient}
                </span>
              ))}
              {recipe.ingredients.length > 4 && (
                <span className="px-2 py-1 text-xs font-body text-pcos-text-muted">
                  +{recipe.ingredients.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {recipe.steps && recipe.steps.length > 0 && (
          <details className="group">
            <summary className="cursor-pointer text-sm font-body font-medium text-pcos-primary hover:text-pcos-secondary list-none">
              View Recipe Steps
            </summary>
            <ol className="mt-3 space-y-2 pl-4">
              {recipe.steps.map((step, i) => (
                <li key={i} className="text-sm font-body text-pcos-text-muted">
                  {i + 1}. {step}
                </li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </motion.div>
  );
  
  if (loading) {
    return (
      <div className="min-h-screen bg-pcos-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pcos-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pcos-text font-body">Loading recipes...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div data-testid="food-suggestions-page" className="min-h-screen bg-pcos-background pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-pcos-background/95 backdrop-blur-lg border-b border-pcos-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <button
              data-testid="back-button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-pcos-card"
            >
              <ArrowLeft className="w-5 h-5 text-pcos-text" />
            </button>
            <h1 className="text-2xl font-heading font-bold text-pcos-text">PCOS-Friendly Food</h1>
            <div className="w-10"></div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pcos-text-muted" />
            <input
              data-testid="search-recipes-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-pcos-border bg-white focus:border-pcos-primary outline-none font-body"
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                data-testid={`category-${category.toLowerCase()}`}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full font-body font-medium whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-pcos-primary to-pcos-secondary text-white shadow-pcos-button'
                    : 'bg-white text-pcos-text border border-pcos-border hover:border-pcos-primary'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Lazy Mode Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              data-testid="lazy-mode-toggle"
              type="checkbox"
              checked={lazyModeOnly}
              onChange={(e) => setLazyModeOnly(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-12 h-6 rounded-full transition-colors relative ${
              lazyModeOnly ? 'bg-gradient-to-r from-pcos-primary to-pcos-secondary' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                lazyModeOnly ? 'transform translate-x-6' : ''
              }`}></div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-pcos-primary" />
              <span className="font-body text-sm text-pcos-text">Lazy Mode (Under 10 mins)</span>
            </div>
          </label>
        </div>
        
        {/* Recipes Grid */}
        <div className="p-6 space-y-4">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🍽️</div>
              <p className="text-pcos-text-muted font-body">
                No recipes found. Try adjusting your filters!
              </p>
            </div>
          ) : (
            filteredRecipes.map(recipe => (
              <RecipeCard key={recipe.recipe_id} recipe={recipe} />
            ))
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}