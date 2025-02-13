import { sql } from "drizzle-orm"
import { 
  text, 
  integer, 
  sqliteTable, 
  primaryKey 
} from "drizzle-orm/sqlite-core"

export const socialMedia = sqliteTable('social_media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  platform: text('platform').notNull(),  // e.g., 'twitter', 'facebook'
  url: text('url').notNull(),
  icon: text('icon').notNull(),  // icon name from our Icons component
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  qrCode: text('qr_code'),  // URL or path to the QR code image
  hasQrCode: integer('has_qr_code', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
}) 