import { useState, useCallback } from 'react'
import { useApi } from './context'
import { handleApiError } from './error'

interface UseApiCallOptions<TData> {
  onSuccess?: (data: TData) => void
  onError?: (error: unknown) => void
  errorMessage?: string
  showLoading?: boolean
}

export function useApiCall<TData>() {
  const { setIsLoading } = useApi()
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [isLoading, setIsLocalLoading] = useState(false)

  const execute = useCallback(
    async <TArgs extends any[]>(
      apiCall: (...args: TArgs) => Promise<{ data: TData }>,
      args: TArgs,
      options: UseApiCallOptions<TData> = {}
    ) => {
      const {
        onSuccess,
        onError,
        errorMessage = 'An error occurred',
        showLoading = true,
      } = options

      try {
        setError(null)
        setIsLocalLoading(true)
        if (showLoading) {
          setIsLoading(true)
        }

        const response = await apiCall(...args)
        setData(response.data)
        onSuccess?.(response.data)
        return response.data
      } catch (err) {
        setError(err)
        handleApiError(err, errorMessage)
        onError?.(err)
        throw err
      } finally {
        setIsLocalLoading(false)
        if (showLoading) {
          setIsLoading(false)
        }
      }
    },
    [setIsLoading]
  )

  return {
    execute,
    data,
    error,
    isLoading,
    reset: useCallback(() => {
      setData(null)
      setError(null)
      setIsLocalLoading(false)
    }, []),
  }
}

export function useApiMutation<TData, TVariables = void>() {
  const { execute, ...rest } = useApiCall<TData>()

  const mutate = useCallback(
    (
      apiCall: (variables: TVariables) => Promise<{ data: TData }>,
      options?: UseApiCallOptions<TData>
    ) => {
      return (variables: TVariables) => execute(apiCall, [variables], options)
    },
    [execute]
  )

  return {
    mutate,
    ...rest,
  }
}

export function useApiQuery<TData, TVariables = void>(
  apiCall: (variables: TVariables) => Promise<{ data: TData }>,
  variables: TVariables,
  options: UseApiCallOptions<TData> & { enabled?: boolean } = {}
) {
  const { execute, ...rest } = useApiCall<TData>()
  const { enabled = true, ...apiOptions } = options

  const refetch = useCallback(() => {
    if (enabled) {
      return execute(apiCall, [variables], apiOptions)
    }
    return Promise.resolve(null)
  }, [enabled, execute, apiCall, variables, apiOptions])

  return {
    refetch,
    ...rest,
  }
} 