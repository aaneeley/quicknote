import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { db } from "$lib/server/db";
import { notes } from "$lib/server/db/schema";
import { encryptAesGcm } from "$lib/utils";

type NewNote = typeof notes.$inferInsert;

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const content = data.get("content")
        const encrypted = data.get("encrypted")
        const password = data.get("password")
        const language = data.get("language")
        const title = data.get("title")

        if (encrypted && (!password || password === "")) {
            return fail(400, { password, password_missing: true })
        }
        if (!content || content === "") {
            return fail(400, { content, missing: true })
        } else if (content.toString().length > 500_000 || (title && title.toString().length > 50)) { // 0.5MB max note size
            return fail(400, { content, invalid: true })
        }

        var newNote: NewNote;
        // Do encryption
        if (encrypted) {
            const { ciphertextB64, ivB64, saltB64 } = await encryptAesGcm(content.toString(), password!.toString())
            newNote = {
                content: ciphertextB64,
                iv: ivB64,
                salt: saltB64,
                encrypted: true,
                language: language?.toString(),
                title: title?.toString()
            }
        } else {
            newNote = {
                content: content.toString(),
                language: language?.toString(),
                title: title?.toString()
            }
        }

        const newNotes = await db.insert(notes).values(newNote).returning({ id: notes.id })
        const pageSlug = (newNotes[0].id + 10000).toString(36)

        throw redirect(303, `/${pageSlug}`)
    }
} satisfies Actions;
