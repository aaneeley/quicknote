import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';

export const notes = pgTable('notes', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    encrypted: boolean('encrypted').notNull().default(false),
    salt: text('salt'), // base64 encoded salt
    iv: text('iv'), // base64 encoded IV
    language: text('language').notNull().default('plaintext'),
});
