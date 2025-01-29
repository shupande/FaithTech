import { AxiosError } from 'axios'
import { toast } from 'sonner'

interface ApiErrorResponse {
  message: string
  errors?: Record<string, string[]>
}

export function handleApiError(error: unknown, fallbackMessage = 'An error occurred') {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined
    
    if (data?.message) {
      toast.error(data.message)
      return
    }
    
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0]
      if (firstError) {
        toast.error(firstError)
        return
      }
    }
  }
  
  toast.error(fallbackMessage)
} 