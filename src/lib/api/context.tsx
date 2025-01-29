'use client'

import * as React from 'react'

interface ApiContextValue {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const ApiContext = React.createContext<ApiContextValue | undefined>(undefined)

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(false)
  
  return (
    <ApiContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </div>
      )}
    </ApiContext.Provider>
  )
}

export function useApi() {
  const context = React.useContext(ApiContext)
  
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  
  return context
} 