import { error, fail } from '@sveltejs/kit';
import type { Actions } from "./$types";
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { notes } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
    let noteIndex = parseInt(params.slug, 36) - 10000
    const result = await db.select({
        content: notes.content,
        encrypted: notes.encrypted,
        language: notes.language,
        salt: notes.salt,
        iv: notes.iv,
        title: notes.title
    }).from(notes).where(eq(notes.id, noteIndex))

    if (result.length > 0) {
        return result[0]
    }

    throw error(404, 'Note not found');
};
