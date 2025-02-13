import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Zap, Settings, BarChart3, Shield, Cpu, Battery,
  Users, Bell, Calendar, Camera, Check, ChevronRight,
  Clock, Cloud, Code, Cog, Copy, CreditCard, Download,
  Edit, Eye, File, FileText, Filter, Flag, Folder,
  Globe, Heart, Home, Image, Info, Key, Link, List,
  Lock, Mail, Map, Menu, MessageCircle,
  Monitor, Moon, MoreHorizontal, MoreVertical, Package,
  Phone, Plus, Power, Printer, Radio, RefreshCw,
  Save, Search, Send, Server, Share, ShoppingCart,
  Slash, Smartphone, Star, Sun, Table, Tag, Terminal,
  Trash, Trash2, TrendingUp, User,
  Video, Volume2, Wifi, X, type LucideIcon
} from "lucide-react"

const icons: Record<string, LucideIcon> = {
  Zap,
  Settings,
  BarChart3,
  Shield,
  Cpu,
  Battery,
  Users,
  Bell,
  Calendar,
  Camera,
  Check,
  ChevronRight,
  Clock,
  Cloud,
  Code,
  Cog,
  Copy,
  CreditCard,
  Download,
  Edit,
  Eye,
  File,
  FileText,
  Filter,
  Flag,
  Folder,
  Globe,
  Heart,
  Home,
  Image,
  Info,
  Key,
  Link,
  List,
  Lock,
  Mail,
  Map,
  Menu,
  MessageCircle,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Package,
  Phone,
  Plus,
  Power,
  Printer,
  Radio,
  RefreshCw,
  Save,
  Search,
  Send,
  Server,
  Share,
  ShoppingCart,
  Slash,
  Smartphone,
  Star,
  Sun,
  Table,
  Tag,
  Terminal,
  Trash,
  Trash2,
  TrendingUp,
  User,
  Video,
  Volume2,
  Wifi,
  X,
}

// 创建小写键的图标映射
const lowercaseIcons: Record<string, LucideIcon> = Object.entries(icons).reduce(
  (acc, [name, icon]) => ({
    ...acc,
    [name.toLowerCase()]: icon
  }),
  {}
)

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // 根据搜索词过滤图标
  const filteredIcons = React.useMemo(() => {
    const entries = Object.entries(icons)
    if (!searchQuery) return entries
    const query = searchQuery.toLowerCase()
    return entries.filter(([name]) => name.toLowerCase().includes(query))
  }, [searchQuery])

  const handleSelect = React.useCallback((name: string) => {
    onChange(name)
    setOpen(false)
  }, [onChange])

  // 获取当前选中的图标，不区分大小写
  const SelectedIcon = React.useMemo(() => {
    if (!value) return Zap
    return lowercaseIcons[value.toLowerCase()] || Zap
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4" />
            <span>{value || "Select icon..."}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search icons..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandEmpty>No icons found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-4 gap-2 p-2">
                {filteredIcons.map(([name, Icon]) => (
                  <div
                    key={name}
                    role="button"
                    onClick={() => handleSelect(name)}
                    className="flex flex-col items-center justify-center gap-1 p-2 rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-xs text-muted-foreground truncate w-full text-center">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 