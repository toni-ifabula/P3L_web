<!-- @format -->

<template>
  <main>
    <v-container fluid fill-height class="posisinya">
      <v-layout flex align-center justify-center>
        <v-flex xs12 sm6 elevation-6>
          <v-toolbar class="blue darken-2">
            <v-toolbar-title class="white--text">
              <h2>Log In</h2>
            </v-toolbar-title>
          </v-toolbar>
          <v-card>
            <v-card-text class="pt-4">
              <div>
                <v-form v-model="valid" ref="form">
                  <v-text-field
                    label="E-mail"
                    v-model="email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Password"
                    v-model="password"
                    type="password"
                    min="6"
                    :rules="passwordRules"
                    counter
                    required
                  ></v-text-field>
                  <v-layout justify-end>
                    <v-btn @click="clear" class="grey darken-3 white--text"
                      >Clear
                    </v-btn>
                    <v-btn
                      class="mr-2 blue white--text"
                      @click="submit"
                      >Submit
                    </v-btn>
                  </v-layout>
                </v-form>
              </div>
            </v-card-text>
          </v-card>
          <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
          </v-snackbar>
        </v-flex>
      </v-layout>
    </v-container>

  </main>
</template>

<style>
.grey--text {
  font-family: "Helvetica";
  font-weight: bold;
}
.posisinya {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
}
</style>

<script>
export default {
  name: "Login",
  data() {
    return {
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      valid: false,
      password: "",
      passwordRules: [(v) => !!v || "Password tidak boleh kosong"],
      email: "",
      emailRules: [(v) => !!v || "E-mail tidak boleh kosong"],
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        //cek apakah data yang akan dikirim sudah valid
        this.load = true;
        this.$http
          .post(this.$api + "/login", {
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            if (response.data.user.STATUS_KARYAWAN === 'Resign') {
              alert("Anda Sudah Resign. Tidak Bisa Masuk Kedalam Sistem.")
            } else {
              localStorage.setItem("current_id", response.data.user.ID_KARYAWAN); //menyimpan id user yang sedang login
              localStorage.setItem("current_role", response.data.user.ID_ROLE);
              localStorage.setItem("current_token", response.data.access_token); //menyimpan auth token
              localStorage.setItem("current_nama", response.data.user.NAMA_KARYAWAN);
              this.error_message = response.data.message;
              this.color = "green";
              this.snackbar = true;
              this.load = false;
              this.clear();
              this.$router.push({
                name: "Dashboard",
              });
            }
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.color = "red";
            this.snackbar = true;
            localStorage.removeItem("current_token");
            this.load = false;
          });
      }
    },
    clear() {
      this.$refs.form.reset(); //Clear form login
    },
  },
};
</script>
