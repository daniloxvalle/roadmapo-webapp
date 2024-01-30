import { defineCustomElement as VueDefineCustomElement, h, createApp, getCurrentInstance } from 'vue'

export const defineCustomElementWrapped = (component, { plugins = [] } = {}) =>
   VueDefineCustomElement({
      // styles: component.styles, // <- this
      styles: component.styles.map((style) => {
         return style
            .replaceAll("html{", ".roadmapo-root{")
            .replaceAll(":root", ":host") // <- rename :root values to :host
      }),

      render: () => h(component),
      setup() {
         const app = createApp()

         // install plugins
         plugins.forEach(app.use)

         const inst = getCurrentInstance()
         Object.assign(inst.appContext, app._context)
         Object.assign(inst.provides, app._context.provides)
      },
   })