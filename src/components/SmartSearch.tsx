import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '../stores/authStore'

interface SearchResult {
  id: string
  title: string
  description: string
  category: 'people' | 'documents' | 'tasks' | 'meetings' | 'apps'
  url?: string
  icon: string
  relevance: number
}

interface SearchSuggestion {
  id: string
  text: string
  category: string
  icon: string
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Sarah Johnson',
    description: 'Senior Developer • Engineering Team',
    category: 'people',
    icon: '👤',
    relevance: 0.9
  },
  {
    id: '2',
    title: 'Q3 Planning Document',
    description: 'Strategic planning for Q3 2024 goals and objectives',
    category: 'documents',
    icon: '📄',
    relevance: 0.8
  },
  {
    id: '3',
    title: 'Team Standup',
    description: 'Daily standup meeting at 9:00 AM',
    category: 'meetings',
    icon: '📅',
    relevance: 0.7
  },
  {
    id: '4',
    title: 'Fix login authentication bug',
    description: 'Priority: High • Due: Tomorrow',
    category: 'tasks',
    icon: '✅',
    relevance: 0.6
  },
  {
    id: '5',
    title: 'Slack Integration',
    description: 'Connect your Slack workspace',
    category: 'apps',
    icon: '🔗',
    relevance: 0.5
  }
]

const mockSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'team members', category: 'people', icon: '👥' },
  { id: '2', text: 'my tasks', category: 'tasks', icon: '✅' },
  { id: '3', text: 'recent documents', category: 'documents', icon: '📄' },
  { id: '4', text: 'today\'s meetings', category: 'meetings', icon: '📅' },
  { id: '5', text: 'project updates', category: 'documents', icon: '📊' },
  { id: '6', text: 'vacation requests', category: 'documents', icon: '🏖️' }
]

export function SmartSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    if (query.length > 0) {
      setIsSearching(true)
      console.log('Searching for:', query)
      
      const timeoutId = setTimeout(() => {
        const filtered = mockResults.filter(result => {
          const match = result.title.toLowerCase().includes(query.toLowerCase()) ||
                       result.description.toLowerCase().includes(query.toLowerCase())
          console.log(`Checking "${result.title}" against "${query}":`, match)
          return match
        }).sort((a, b) => b.relevance - a.relevance)
        
        console.log('Search results:', filtered)
        setResults(filtered)
        setIsSearching(false)
        setShowResults(true)
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
      setShowResults(false)
      setSuggestions(mockSuggestions)
    }
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return

    const items = query.length > 0 ? results : suggestions
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev <= 0 ? items.length - 1 : prev - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < items.length) {
        const item = items[selectedIndex]
        if ('relevance' in item) {
          handleResultClick(item)
        } else {
          handleSuggestionClick(item)
        }
      }
    } else if (e.key === 'Escape') {
      setShowResults(false)
      inputRef.current?.blur()
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setQuery('')
    setShowResults(false)
    setSelectedIndex(-1)
    
    if (result.url) {
      window.open(result.url, '_blank')
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    inputRef.current?.focus()
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'people': return 'text-blue-600 dark:text-blue-400'
      case 'documents': return 'text-green-600 dark:text-green-400'
      case 'tasks': return 'text-orange-600 dark:text-orange-400'
      case 'meetings': return 'text-purple-600 dark:text-purple-400'
      case 'apps': return 'text-indigo-600 dark:text-indigo-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          placeholder="Search people, documents, tasks... (try 'sarah' or 'planning')"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showResults && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {query.length === 0 ? (
            <div className="p-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Popular searches for {user?.role === 'manager' ? 'managers' : 'team members'}
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedIndex === index
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{suggestion.icon}</span>
                    <span className="text-sm text-gray-900 dark:text-white">{suggestion.text}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedIndex === index
                      ? 'bg-blue-50 dark:bg-blue-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{result.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.description}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(result.category)}`}>
                      {result.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">🔍</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Try different keywords or check spelling
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}