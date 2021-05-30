<!-- @format -->

<template>
  <v-main class="list">
    <div v-if="haveAccess() == 0">
      <v-row justify="center">
        <h1>Tidak bisa diakses</h1>
        <h2>Data karyawan hanya dapat diakses oleh owner dan manager</h2>
      </v-row>
    </div>

    <div v-if="haveAccess() == 1">
      <h3 class="text-h3 font-weight-medium mb-5"> Data Karyawan </h3>

      <v-card>
        <v-card-title>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="success" dark @click="dialog = true">
            Tambah
          </v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="karyawan" :search="search" :loading="loading" loading-text="Loading... Please wait">
          <template v-slot:[`item.STATUS_KARYAWAN`]="{ item }">
            <v-chip
              :color="getStatusColor(item.STATUS_KARYAWAN)"
              dark
            >
              {{ item.STATUS_KARYAWAN }}
            </v-chip>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mt-2 mb-2" @click="editHandler(item)" color="blue" block>
              edit
            </v-btn>
            <v-btn small class="mb-2" @click="resignHandler(item)" color="orange" block>
              Nonaktifkan
            </v-btn>
          </template>

        </v-data-table>
      </v-card>

      <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }} Data Karyawan</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-form ref="form">
                <v-text-field v-model="form.nama_karyawan" label="Nama Karyawan" :rules="requiredRules" required></v-text-field>

                <v-select
                  v-model="form.role"
                  :items="roleItems"
                  label="Role"
                  v-on:change="getIDRolebyNama(form.role)"
                  :rules="requiredRules"
                ></v-select>

                <v-select
                  v-model="form.jenis_kelamin"
                  :items="jenisKelaminItems"
                  label="Jenis Kelamin"
                  :rules="requiredRules"
                ></v-select>

                <v-text-field v-model="form.telepon" label="Telepon" type="number" :rules="teleponRules" required></v-text-field>

                <v-text-field v-model="form.email" label="Email" type="email" :rules="requiredRules" required></v-text-field>

                <v-text-field v-if="inputType === 'Tambah'" v-model="form.password" label="Password" type="password" :rules="passwordRules" required></v-text-field>

                <v-menu
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.tanggal_gabung"
                      label="Tanggal Gabung"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="requiredRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.tanggal_gabung"
                  ></v-date-picker>
                </v-menu>

                <v-select
                  v-model="form.status"
                  :items="statusItems"
                  label="Status"
                  :rules="requiredRules"
                ></v-select>
              </v-form>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click="cancel">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="setForm">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text>
          Anda yakin ingin menonaktifkan karyawan ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="resignStatus()">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
        {{error_message}}
      </v-snackbar>
    </div>
    
  </v-main>
</template>
<script>
  export default {
    name: "List",
    data() {
      return {
        inputType: 'Tambah',
        load: false,
        snackbar: false,
        error_message: '',
        color: '',
        search: null,
        dialog: false,
        dialogConfirm: false,
        headers: [{
            text: "Nama Karyawan",
            align: "start",
            sortable: true,
            value: "NAMA_KARYAWAN"
          },
          {
            text: "Role",
            value: "NAMA_ROLE"
          },
          {
            text: "Jenis Kelamin",
            value: "JENIS_KELAMIN_KARYAWAN"
          },
          {
            text: "Telepon",
            value: "TELEPON_KARYAWAN"
          },
          {
            text: "Email",
            value: "email"
          },
          {
            text: "Tanggal Gabung",
            value: "TANGGAL_GABUNG_KARYAWAN"
          },
          {
            text: "Status",
            value: "STATUS_KARYAWAN"
          },
          {
            text: "Actions",
            value: "actions"
          },
        ],
        karyawanFormData: new FormData,
        karyawan: [],
        form: {
          nama_karyawan: null,
          role: null,
          jenis_kelamin: null,
          telepon: null,
          email: null,
          password: null,
          tanggal_gabung: null,
          status: null,
        },
        editId: '',
        roleItems: [],
        selectedRoleID: null,
        jenisKelaminItems: ["Laki-laki", "Perempuan"],
        statusItems: ["Aktif", "Resign"],
        requiredRules: [
          v => !!v || 'This field is required'
        ],
        passwordRules: [
          v => !!v || 'This field is required',
          v => (v && v.length >= 6) || 'Password minimal 6 karakter'
        ],
        teleponRules: [
          v => !!v || 'This field is required',
          v => (v && v.length >= 10 && v.length <= 12) || 'Nomor telepon harus 10-12 angka'
        ],
        resignID: '',
        loading: true,
      };
    },
    methods: {
      setForm() {
        if(this.$refs.form.validate()) {
          if (this.inputType === 'Tambah') {
            this.save()
          } else {
            this.update()
          }
        }
      },
      //read data
      readData() {
        var url = this.$api + '/karyawan'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.karyawan = response.data.data
          this.loading = false;
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = "red"
          this.snackbar = true;
          this.load = false;
          this.loading = false
        })
      },
      //simpan data
      save() {
        this.karyawanFormData.append('NAMA_KARYAWAN', this.form.nama_karyawan);
        this.karyawanFormData.append('ID_ROLE', this.selectedRoleID);
        this.karyawanFormData.append('JENIS_KELAMIN_KARYAWAN', this.form.jenis_kelamin);
        this.karyawanFormData.append('TELEPON_KARYAWAN', this.form.telepon);
        this.karyawanFormData.append('email', this.form.email);
        this.karyawanFormData.append('password', this.form.password);
        this.karyawanFormData.append('TANGGAL_GABUNG_KARYAWAN', this.form.tanggal_gabung);
        this.karyawanFormData.append('STATUS_KARYAWAN', this.form.status);

        var url = this.$api + '/karyawan'
        this.load = true
        this.$http.post(url, this.karyawanFormData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.error_message = response.data.message;
          this.color = "green"
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = "red"
          this.snackbar = true;
          this.load = false;
        })
      },
      //ubah data
      update() {
        let newData = {
          NAMA_KARYAWAN: this.form.nama_karyawan,
          ID_ROLE: this.selectedRoleID,
          JENIS_KELAMIN_KARYAWAN: this.form.jenis_kelamin,
          TELEPON_KARYAWAN: this.form.telepon,
          email: this.form.email,
          password: this.form.password,
          TANGGAL_GABUNG_KARYAWAN: this.form.tanggal_gabung,
          STATUS_KARYAWAN: this.form.status
        }
        var url = this.$api + '/karyawan/' + this.editId;
        this.load = true
        this.$http.put(url, newData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.error_message = response.data.message;
          this.color = "green"
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = 'Tambah';
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = "red"
          this.snackbar = true;
          this.load = false;
        })
      },
      editHandler(item) {
        this.inputType = 'Ubah';
        this.editId = item.ID_KARYAWAN;
        this.form.nama_karyawan = item.NAMA_KARYAWAN;
        this.form.role = item.ID_ROLE;
        this.form.telepon = item.TELEPON_KARYAWAN;
        this.form.jenis_kelamin = item.JENIS_KELAMIN_KARYAWAN;
        this.form.email = item.email;
        this.form.password = item.password;
        this.form.tanggal_gabung = item.TANGGAL_GABUNG_KARYAWAN;
        this.form.status = item.STATUS_KARYAWAN;
        this.dialog = true;
      },
      resignStatus() {
        var url = this.$api + '/resignKaryawan/'+ this.resignID;
        this.load = true
        this.$http.put(url, null, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.error_message = response.data.message;
          this.color = "green"
          this.snackbar = true;
          this.load = false;
          this.readData(); //mengambil data
          this.dialogConfirm = false;
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = "red"
          this.snackbar = true;
          this.load = false;
          this.dialogConfirm = false;
        })
      },
      resignHandler(item) {
        this.resignID = item.ID_KARYAWAN;
        this.dialogConfirm = true;
      },
      close() {
        this.dialog = false
        this.inputType = 'Tambah';
        this.selectedRoleID = null;    // clear variable value
      },
      cancel() {
        this.resetForm();
        this.readData();
        this.dialog = false;
        this.inputType = 'Tambah';
        this.selectedRoleID = null;    // clear variable value
      },
      resetForm() {
        this.form = {
          nama_karyawan: null,
          role: null,
          jenis_kelamin: null,
          telepon: null,
        };
      },
      getStatusColor (status) {
        if (status === 'Resign') return 'red'
        else if (status === 'Aktif') return 'green'
        else return 'orange'
      },
      haveAccess(){
        if(localStorage.getItem("current_role") === '1' || localStorage.getItem("current_role") === '2')
          return 1
        else
          return 0
      },
      getNamaRole() {
        var url = this.$api + '/role'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          for(var i = 0; i < response.data.data.length; i++) {
            this.roleItems.push(response.data.data[i].NAMA_ROLE);
          }
        })
      },
      getIDRolebyNama(nama) {
        var url = this.$api + '/IDRole/' + nama;
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.selectedRoleID = response.data.data[0].ID_ROLE;
        })
      },
    },
    computed: {
      formTitle() {
        return this.inputType
      },
    },
    mounted() {
      this.readData();
      this.getNamaRole();
    },
  };
</script>