<!-- @format -->

<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer" class="fullheight" width="256" app>
      <!-- <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Antonius Wicaksana Nugraha </v-list-item-title>
          <v-list-item-subtitle> 180709861 </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item> -->
      <v-row justify="center">
        <img :src="require('@/assets/logo_toko.png')">
      </v-row>

      <v-divider></v-divider>

      <v-list rounded nav>
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
            tag="router-link"
            :to="item.to"
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
    <v-app-bar app fixed height="75px">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <VSpacer />
      <v-toolbar-items>
        <v-btn text router @click="logout()"><v-icon large color="red">mdi-power</v-icon></v-btn>
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
      items: [
        { title: "Dashboard", icon: "space_dashboard", to: "/dashboard" },
        { title: "Karyawan", icon: "badge", to: "/karyawan" },
        { title: "Meja", icon: "deck", to: "/meja" },
        { title: "Customer", icon: "people", to: "/customer" },
        { title: "Menu", icon: "restaurant_menu", to: "/menu" },
        { title: "Stok Bahan", icon: "inventory", to: "/stokBahan" },
      ],
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
    readUserData() {
      var url = this.$api + '/user'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.products = response.data.data
        })
    }
  },

  mounted() {
      this.readUserData();
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