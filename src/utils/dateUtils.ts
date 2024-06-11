import { format, parseISO } from 'date-fns';

export function toLocaleDateTime(date: Date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
}

export function getTimestamp(): string {
    const now = toLocaleDateTime(new Date());
    return format(now, 'yyyyMMdd_HHmmss');
}

export function convertFromIsoToDatetimeMUI(dataISO: string | undefined | null) {
    if (dataISO) {
        const data = new Date(dataISO);
        const year = data.getFullYear();
        const month = (data.getMonth() + 1).toString().padStart(2, "0");
        const day = data.getDate().toString().padStart(2, "0");
        const hours = data.getHours().toString().padStart(2, "0");
        const minutes = data.getMinutes().toString().padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    else
        return ''

}

export function convertFromIsoToDatetime(dataISO: string | undefined | null) {
    if (dataISO) {
        return new Date(dataISO);
    }
    else
        return null;

}

export function convertFromDatetimeMUIToIso(materialUIDate: string | undefined): string | null {
    if (!materialUIDate) {
        return null;
    }

    const [datePart, timePart] = materialUIDate.split('T');
    if (!datePart || !timePart) {
        return null;
    }

    const [year, month, day] = datePart.split('-').map(part => parseInt(part, 10));
    const [hours, minutes] = timePart.split(':').map(part => parseInt(part, 10));

    return new Date(year ?? 1900, month ?? 1 - 1, day, hours, minutes).toISOString();
}

export function formatDateFromIso(dataISO: string | undefined | null, stringFormat: string) {
        return dataISO ? format(parseISO(dataISO), stringFormat) : '';
}