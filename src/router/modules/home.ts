const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  component: Layout,
  redirect: "/index",
  meta: {
    icon: "ep:home-filled",
    title: "首页",
    rank: 0
  },
  children: [
    {
      path: "/index",
      name: "Welcome",
      component: () => import("@/views/index/index.vue"),
      meta: {
        title: "首页",
        showLink: VITE_HIDE_HOME !== "true"
      }
    }
  ]
} satisfies RouteConfigsTable;
