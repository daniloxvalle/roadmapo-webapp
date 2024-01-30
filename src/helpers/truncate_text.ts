export function truncateText(text: string, maxLength: number) {
   return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '')
}
