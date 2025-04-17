import { pgTable, serial, text, boolean } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    markdown: boolean('markdown').notNull().default(false),
    encrypted: boolean('encrypted').notNull().default(false),
});
