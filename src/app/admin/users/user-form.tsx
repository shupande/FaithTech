'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, X } from 'lucide-react'
import { User } from './columns'

const createFormSchema = (isEditing: boolean) =>
  z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: isEditing
      ? z.string().min(6, 'Password must be at least 6 characters').optional()
      : z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['admin', 'user']),
    status: z.enum(['active', 'inactive']),
  })

// 定义基础的表单值类型
type BaseFormValues = {
  name: string
  email: string
  password?: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
}

type FormValues = BaseFormValues

interface UserFormProps {
  user?: User
  open: boolean
  onClose: () => void
  onSubmit: (data: Partial<FormValues>) => Promise<void>
}

export function UserForm({ user, open, onClose, onSubmit }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(createFormSchema(!!user)),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: (user?.role as 'admin' | 'user') || 'user',
      status: (user?.status as 'active' | 'inactive') || 'active',
    },
  })

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role as 'admin' | 'user',
        status: user.status as 'active' | 'inactive',
      })
    } else {
      form.reset({
        name: '',
        email: '',
        role: 'user',
        status: 'active',
      })
    }
  }, [user, form])

  const handleClose = () => {
    setIsSubmitting(false)
    onClose()
  }

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)
      
      if (user && !values.password) {
        delete values.password
      }
      
      await onSubmit(values)
      handleClose()
    } catch (error) {
      console.error('Form submission error:', error)
      toast.error('Failed to save user')
      setIsSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-[500px] border-l bg-background p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {user ? 'Edit User' : 'Create User'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          {user 
            ? 'Make changes to the user account here. Click update when you\'re done.'
            : 'Fill in the information to create a new user account.'}
        </p>
        <Form {...form}>
          <form 
            ref={formRef} 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{user ? 'New Password (optional)' : 'Password'}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {user ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  user ? 'Update' : 'Create'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
} 