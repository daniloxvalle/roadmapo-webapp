
export function removeJSONTraillingComma(text: string) {
    const regex = /\,(?=\s*?[\}\]])/g;
    return text.replace(regex, '');
}
