<!-- @format -->

<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer" class="fullheight" width="256" app>
      <v-row justify="center">
        <img :src="require('@/assets/logo_toko.png')">
      </v-row>

      <v-divider></v-divider>

      <v-list rounded nav>
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="item in dashboardFilter"
            :key="item.title"
            link
            tag="router-link"
            :to="item.to"
            color="#D34841"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app fixed height="75px" color="#D34841">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <VSpacer />
      <v-toolbar-items>
        <v-btn text router :to="'profile'"><v-icon large>person</v-icon></v-btn>
        <v-btn text router @click="logout()"><v-icon large>mdi-power</v-icon></v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <div class="fullheight pa-5">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  name: "Dashboard",

  data() {
    return {
      drawer: true,
      itemsOwner: [
        { title: "Dashboard", icon: "space_dashboard", to: "/dashboard" },
        { title: "Karyawan", icon: "badge", to: "/karyawan" },
        { title: "Meja", icon: "deck", to: "/meja" },
        { title: "Laporan", icon: "summarize", to: "/laporan"},
      ],
      itemsManager: [
        { title: "Dashboard", icon: "space_dashboard", to: "/dashboard" },
        { title: "Karyawan", icon: "badge", to: "/karyawan" },
        { title: "Meja", icon: "deck", to: "/meja" },
        { title: "Customer", icon: "people", to: "/customer" },
        { title: "Reservasi", icon: "menu_book", to: "/reservasi" },
        { title: "Menu", icon: "restaurant_menu", to: "/menu" },
        { title: "Stok Bahan", icon: "inventory", to: "/stokBahan" },
        { title: "Pesanan", icon: "shopping_cart", to: "/pesanan"},
        { title: "Transaksi", icon: "paid", to: "/transaksi"},
        { title: "Laporan", icon: "summarize", to: "/laporan"},
      ],
      itemsWaiter: [
        { title: "Dashboard", icon: "space_dashboard", to: "/dashboard" },
        { title: "Meja", icon: "deck", to: "/meja" },
        { title: "Customer", icon: "people", to: "/customer" },
        { title: "Reservasi", icon: "menu_book", to: "/reservasi" },
        { title: "Menu", icon: "restaurant_menu", to: "/menu" },
        { title: "Pesanan", icon: "shopping_cart", to: "/pesanan"},
      ],
      itemsCashier: [
        { title: "Dashboard", icon: "space_dashboard", to: "/dashboard" },
        { title: "Meja", icon: "deck", to: "/meja" },
        { title: "Menu", icon: "restaurant_menu", to: "/menu" },
        { title: "Pesanan", icon: "shopping_cart", to: "/pesanan"},
        { title: "Transaksi", icon: "paid", to: "/transaksi"},
      ],
      itemsChef: [
        { title: "Dashboard", icon: "space_dashboard", to: "/dashboard" },
        { title: "Meja", icon: "deck", to: "/meja" },
        { title: "Stok Bahan", icon: "inventory", to: "/stokBahan" },
        { title: "Pesanan", icon: "shopping_cart", to: "/pesanan"},
      ]
    };
  },

  methods: {
    logout() {
      localStorage.removeItem("current_id");
      localStorage.removeItem("current_role");
      localStorage.removeItem("current_token");
      this.$router.push({
        name: "login",
      });
    },
  },

  computed: {
    dashboardFilter: function() {
      if(localStorage.getItem("current_role") === '1') {
        return this.itemsOwner
      } else if(localStorage.getItem("current_role") === '2') {
        return this.itemsManager
      } else if(localStorage.getItem("current_role") === '3') {
        return this.itemsWaiter
      } else if(localStorage.getItem("current_role") === '4') {
        return this.itemsCashier
      } else if(localStorage.getItem("current_role") === '5') {
        return this.itemsChef
      }

      return null;
    }
  },

};
</script>

<style scoped>
.fullheight {
  min-height: 100vh !important;
}
.router {
  text-decoration: none;
  color: black;
}
</style>