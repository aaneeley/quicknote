import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db } from "$lib/server/db";
import { notes } from "$lib/server/db/schema";

type NewNote = typeof notes.$inferInsert;

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const content = data.get("content")
        if (!content || content === "") {
            return fail(400, { content, missing: true })
        } else if (content.toString().length > 500_000) { // 0.5MB max note size
            return fail(400, { content, invalid: true })
        }
        const newNote: NewNote = {
            content: content.toString()
        }
        const newNotes = await db.insert(notes).values(newNote).returning({ id: notes.id })
        const pageSlug = (newNotes[0].id + 10000).toString(36)

        throw redirect(303, `/${pageSlug}`)
    }
} satisfies Actions;
