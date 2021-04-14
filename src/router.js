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
                //PROFILE
                {
                    path: "/profile",
                    name: "Profile",
                    meta: {title: 'Profile'},
                    component: importComponent('DataMaster/Profile'),
                },
                // PROFILE IMAGE
                {
                    path: "/profileImage",
                    name: "ProfileImage",
                    meta: {title: 'ProfileImage'},
                    component: importComponent('DataMaster/ProfileImage'),
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