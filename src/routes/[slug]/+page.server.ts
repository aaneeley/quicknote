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
        iv: notes.iv
    }).from(notes).where(eq(notes.id, noteIndex))

    if (result.length > 0) {
        return result[0]
    }

    throw error(404, 'Note not found');
};

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const password = data.get("password")

        if (!password || password === "") {
            return fail(400, { password, password_missing: true })
        }

        // Do decryption

    }
} satisfies Actions;
