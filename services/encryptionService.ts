
// This is a simple simulation of an encryption service using Base64.
// In a real-world application, this would use robust, end-to-end encryption libraries like libsodium or the Web Crypto API.
// This approach demonstrates the architectural separation of encryption logic.

/**
 * "Encrypts" a string using Base64 encoding, with UTF-8 support.
 * @param text The plaintext string.
 * @returns The Base64 encoded string.
 */
export const encrypt = (text: string): string => {
    try {
        // btoa doesn't handle UTF-8 characters well, so we need to encode them first.
        return btoa(unescape(encodeURIComponent(text)));
    } catch (e) {
        console.error("Encryption failed:", e);
        return text; // Fallback to plaintext if encoding fails
    }
};

/**
 * "Decrypts" a Base64 encoded string, with UTF-8 support.
 * @param encryptedText The Base64 encoded string.
 * @returns The decoded plaintext string.
 */
export const decrypt = (encryptedText: string): string => {
    try {
        // Decode the Base64 and then decode the URI component to get original UTF-8 string.
        return decodeURIComponent(escape(atob(encryptedText)));
    } catch (e) {
        // This can fail if the text is not valid Base64 (e.g., an unencrypted old message or AI message).
        return encryptedText; // Fallback to returning the text as is.
    }
};
