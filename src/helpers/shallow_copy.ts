
export function shallowCopy(source: any, target: any) {
   Object.keys(target).forEach((key) => {
      if (source[key] !== undefined) {
         target[key] = source[key]
      }
   })

   return target
}
