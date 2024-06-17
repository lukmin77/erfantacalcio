export function countOccurrences(text: string, character: string): number {
    return text.split(character).length - 1;
}

export function getFileExtension(fileName: string | undefined): string {
    if (fileName) {
        const parts = fileName.split('.');
        if (parts.length > 1) {
            return `.${parts[parts.length - 1]}`;
        } else {
            return ''; // Nessuna estensione trovata
        }
    }
    else
        return '';
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64); // Decodifica base64 in una stringa binaria
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

