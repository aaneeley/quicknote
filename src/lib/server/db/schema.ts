import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    markdown: boolean('markdown').notNull().default(false),
    encrypted: boolean('encrypted').notNull().default(false),
    salt: text('salt'), // base64 encoded salt
    iv: text('iv') // base64 encoded IV
});
