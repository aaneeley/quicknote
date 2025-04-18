# Quicknote

A cryptographically secure pastebin-like app to demonstrate full-stack competency

## Technologies Utilized

The frontend and server functions are written with SvelteKit. The UI is reactive and mobile friendly.

The notes are stored in a Postgres database using Drizzle ORM.

## Application Security

Secure notes are encrypted using AES-GCM. Passphrases are derived using PBKDF2 SHA-256 over 250,000 iterations. All encryption and decryption is done on the client making the app very secure and transparent.

All note content is sanitized on the server before writing to the database, in addition to sanitizing before sending to a client. This eliminates any risk of XSS attacks when rendering markdown.
