'use client'

import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export type User = {
  id: string
  email: string
  name: string
  role: string
  status: string
  createdAt: Date
  updatedAt: Date
}

interface ColumnActionsProps {
  onEdit?: (user: User) => void
  onDelete?: () => Promise<void>
}

export const createColumns = ({ onEdit, onDelete }: ColumnActionsProps): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string
      return (
        <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
          {role}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge variant={status === 'active' ? 'success' : 'destructive'}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return format(date, 'MMM d, yyyy')
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original

      const handleDelete = async () => {
        try {
          const response = await fetch(`/api/users/${user.id}`, {
            method: 'DELETE',
          })

          if (!response.ok) {
            throw new Error('Failed to delete user')
          }

          toast.success('User deleted successfully')
          // 刷新数据
          if (onDelete) {
            await onDelete()
          }
        } catch (error) {
          toast.error('Failed to delete user')
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(user)}>
              Edit user
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={handleDelete}
            >
              Delete user
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 