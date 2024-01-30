export const validation = {
   required: (value: string) => !!value || 'Required',
   min: (value: string) => value.length >= 8 || 'Min 8 characters',
   email: (value: string) => /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'E-mail must be valid',
}