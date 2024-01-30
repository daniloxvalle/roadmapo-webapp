// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
   {
      path: '/ce',
      component: () => import('@/layouts/empty/Empty.vue'),
      children: [
         {
            path: '/ce/roadmap-kanban',
            name: 'RoadmapKanban',
            component: () => import(/* webpackChunkName: "RoadmapKanban" */ '@/components/web-components/RoadmapKanban.ce.vue'),
         },
      ],
   },
   {
      path: '/login',
      component: () => import('@/layouts/login/Login.vue'),
      children: [
         {
            path: '/login',
            name: 'Login',
            component: () => import(/* webpackChunkName: "Login" */ '@/views/Login.vue'),
         },
      ],
   },
   {
      path: '/',
      redirect: { path: "/login" }, // Default path
      component: () => import('@/layouts/default/Default.vue'),
      children: [
         {
            path: '/product',
            name: 'Product',
            component: () => import(/* webpackChunkName: "product" */ '@/views/Product.vue'),
         }, {
            path: '/roadmap',
            name: 'Roadmap',
            component: () => import(/* webpackChunkName: "roadmap" */ '@/views/Roadmap.vue'),
         }, {
            path: '/publish',
            name: 'Publish',
            component: () => import(/* webpackChunkName: "publish" */ '@/views/Publish.vue'),
         },
      ],
   },
]

const router = createRouter({
   // history: createWebHistory(),
   history: createWebHistory(process.env.BASE_URL),
   linkExactActiveClass: "false",
   linkActiveClass: "false",
   routes,
})

/*
Workaround for the bug: TypeError: Failed to fetch dynamically imported module
https://github.com/vitejs/vite/issues/11804
https://stackoverflow.com/questions/69300341/typeerror-failed-to-fetch-dynamically-imported-module-on-vue-vite-vanilla-set
 */
// router.onError((error, to) => {
//    console.log("ROUTER ERROR: " + error.message)
//    if (error.message.includes('Failed to fetch dynamically imported module')) { //|| error.message.includes("Importing a module script failed")) {
//       window.location.reload()
//    }
// })

export default router
