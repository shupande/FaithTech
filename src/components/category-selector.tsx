'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import React from 'react'

interface Category {
  id: string
  name: string
  level: number
  children?: Category[]
}

interface CategorySelectorProps {
  name: string
  control: any
  label?: string
  placeholder?: string
}

export function CategorySelector({
  name,
  control,
  label = 'Category',
  placeholder = 'Select a category'
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  const renderOptions = (categories: Category[], level = 0): JSX.Element[] => {
    return categories.map(category => (
      <React.Fragment key={category.id}>
        <SelectItem
          value={category.id}
          className="flex items-center pl-6"
          style={{
            paddingLeft: level === 0 ? '24px' : `${(level + 2) * 16}px`
          }}
        >
          {category.name}
        </SelectItem>
        {category.children?.map(child =>
          renderOptions([child], level + 1)
        ).flat()}
      </React.Fragment>
    ))
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {renderOptions(categories)}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
} 