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
                // Profile
                {
                    path: "/profile",
                    name: "Profile",
                    meta: {title: 'Profile'},
                    component: importComponent('Profile'),
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
                // Reservasi
                {
                    path: "/reservasi",
                    name: "Reservasi",
                    meta: {title: 'Reservasi'},
                    component: importComponent('Reservasi'),
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
                // Pesanan
                {
                    path: "/pesanan",
                    name: "Pesanan",
                    meta: {title: 'Pesanan'},
                    component: importComponent('Pesanan'),
                },
                // PEMBAYARAN
                {
                    path: "/pembayaran",
                    name: "Pembayaran",
                    meta: {title: 'Pembayaran'},
                    component: importComponent('Pembayaran'),
                },
                // Transaksi
                {
                    path: "/transaksi",
                    name: "Transaksi",
                    meta: {title: 'Transaksi'},
                    component: importComponent('Transaksi'),
                },
                // Laporan
                {
                    path: "/laporan",
                    name: "Laporan",
                    meta: {title: 'Laporan'},
                    component: importComponent('Laporan'),
                },
                // Laporan Stok
                {
                    path: "/laporanStok",
                    name: "LaporanStok",
                    meta: {title: 'LaporanStok'},
                    component: importComponent('LaporanStok'),
                },
                // Laporan Penjualan
                {
                    path: "/laporanPenjualan",
                    name: "LaporanPenjualan",
                    meta: {title: 'LaporanPenjualan'},
                    component: importComponent('LaporanPenjualan'),
                },
                // Laporan Pendapatan
                {
                    path: "/laporanPendapatan",
                    name: "LaporanPendapatan",
                    meta: {title: 'LaporanPendapatan'},
                    component: importComponent('LaporanPendapatan'),
                },
                // Laporan Pengeluaran
                {
                    path: "/laporanPengeluaran",
                    name: "LaporanPengeluaran",
                    meta: {title: 'LaporanPengeluaran'},
                    component: importComponent('LaporanPengeluaran'),
                },
            ],
            beforeEnter: (to, from, next) => {
                if(localStorage.getItem("current_token") == null) {
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