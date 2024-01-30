export function handleQuotes(text: string) {
   const singleToDoubleQuotes = text.replaceAll("'", "''");
   return singleToDoubleQuotes
}
