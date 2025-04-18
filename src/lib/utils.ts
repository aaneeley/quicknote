import * as languages from 'svelte-highlight/languages';
import type { LanguageType } from 'svelte-highlight/languages';

export async function decryptAesGcm(ciphertextB64: string, ivB64: string, saltB64: string, password: string): Promise<string> {
    const b64ToBytes = (b64: string) =>
        Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

    // Decode inputs
    const ciphertext = b64ToBytes(ciphertextB64);
    const iv = b64ToBytes(ivB64);
    const salt = b64ToBytes(saltB64);

    // Step 1: Derive key from password using PBKDF2
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 250_000,
            hash: 'SHA-256',
        },
        keyMaterial,
        {
            name: 'AES-GCM',
            length: 256,
        },
        false,
        ['decrypt']
    );

    // Step 2: Decrypt
    try {
        const decrypted = await window.crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: iv,
            },
            key,
            ciphertext
        );

        // Decode decrypted ArrayBuffer to string
        const dec = new TextDecoder();
        return dec.decode(decrypted);
    } catch (err) {
        console.error('Decryption failed:', err);
        throw new Error('Failed to decrypt. Incorrect password.');
    }
}

export async function encryptAesGcm(plaintext: string, password: string): Promise<{
    ciphertextB64: string;
    ivB64: string;
    saltB64: string;
}> {
    const getRandomBytes = (length: number) => {
        const bytes = new Uint8Array(length);
        crypto.getRandomValues(bytes);
        return bytes;
    };

    const bytesToB64 = (bytes: Uint8Array): string =>
        btoa(String.fromCharCode(...bytes));

    // Generate random salt and IV
    const salt = getRandomBytes(16); // 128-bit salt
    const iv = getRandomBytes(12);   // 96-bit IV (recommended for AES-GCM)

    // Derive key from password using PBKDF2
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 250_000,
            hash: 'SHA-256',
        },
        keyMaterial,
        {
            name: 'AES-GCM',
            length: 256,
        },
        false,
        ['encrypt']
    );

    // Encrypt the plaintext
    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        enc.encode(plaintext)
    );

    // Convert ciphertext to Uint8Array
    const ciphertext = new Uint8Array(encrypted);

    // Return all Base64-encoded parts
    return {
        ciphertextB64: bytesToB64(ciphertext),
        ivB64: bytesToB64(iv),
        saltB64: bytesToB64(salt),
    };
}


const languageMap: Record<string, LanguageType<string>> = Object.entries(languages).reduce(
    (acc, [key, value]) => ({
        ...acc,
        [value.name]: value
    }),
    {}
);

// Usage
export function getLanguageByString(lang: string): LanguageType<string> {
    return languageMap[lang] || languages.plaintext;
}
