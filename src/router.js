import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function importComponent(path) {
    return () => import(`./components/${path}.vue`)
}

Vue.use(VueRouter);

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: "/",
            component: importComponent('DashboardLayout'),
            children: [
                // Dashboard
                {
                    path: "/dashboard",
                    name: "Dashboard",
                    meta: {title: 'Dashboard'},
                    component: importComponent('Dashboard'),
                },
                //Karyawan
                {
                    path: "/karyawan",
                    name: "Karyawan",
                    meta: {title: 'Karyawan'},
                    component: importComponent('Karyawan'),
                },
                // Customer
                {
                    path: "/customer",
                    name: "Customer",
                    meta: {title: 'Customer'},
                    component: importComponent('Customer'),
                },
                // Meja
                {
                    path: "/meja",
                    name: "Meja",
                    meta: {title: 'Meja'},
                    component: importComponent('Meja'),
                },
                //Menu
                {
                    path: "/menu",
                    name: "Menu",
                    meta: {title: 'Menu'},
                    component: importComponent('Menu'),
                },
                // Stok Bahan
                {
                    path: "/stokBahan",
                    name: "StokBahan",
                    meta: {title: 'Stok Bahan'},
                    component: importComponent('StokBahan'),
                },
            ],
            beforeEnter: (to, from, next) => {
                if(localStorage.getItem("current_token") == 0) {
                    next({name: 'login'});
                } else {
                    next();
                }
            }
        },
        //Login
        {
            path: "/login",
            name: "login",
            meta: {title: 'Login'},
            component: importComponent('Login'),
        },
        {
            path: '*',
            redirect: '/'
        },
    ],
});

//Mengeset judul
router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    next()
});

export default router;