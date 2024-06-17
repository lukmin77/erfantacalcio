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

export function stringToArrayBuffer(str: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(str).buffer;
}
