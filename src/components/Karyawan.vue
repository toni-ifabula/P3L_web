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
        <v-data-table :headers="headers" :items="karyawan" :search="search">
          <template v-slot:[`item.STATUS_KARYAWAN`]="{ item }">
            <v-chip
              :color="getStatusColor(item.STATUS_KARYAWAN)"
              dark
            >
              {{ item.STATUS_KARYAWAN }}
            </v-chip>
          </template>

          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mr-2" @click="editHandler(item)" color="blue">
              edit
            </v-btn>
            <v-btn small @click="resignStatus(item.ID_KARYAWAN)" color="orange">
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
              // TODO FORM VALIDATION
              <v-text-field v-model="form.nama_karyawan" label="Nama Karyawan" required></v-text-field>

              <v-select
                v-model="form.role"
                :items="roleItems"
                label="Role"
                v-on:change="getIDRolebyNama(form.role)"
              ></v-select>

              <v-select
                v-model="form.jenis_kelamin"
                :items="jenisKelaminItems"
                label="Jenis Kelamin"
              ></v-select>

              <v-text-field v-model="form.telepon" label="Telepon" required></v-text-field>

              <v-text-field v-model="form.email" label="Email" required></v-text-field>

              <v-text-field v-model="form.password" label="Password" type="password" required></v-text-field>

              <v-text-field v-model="form.tanggal_gabung" label="Tanggal Gabung" required></v-text-field>
              
              <v-date-picker
                v-model="form.tanggal_gabung"
                color="green lighten-1"
              ></v-date-picker>

              <v-select
                v-model="form.status"
                :items="statusItems"
                label="Status"
              ></v-select>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancel">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="setForm">
              Save
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
            value: "ID_ROLE"
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

      };
    },
    methods: {
      setForm() {
        if (this.inputType === 'Tambah') {
          this.save()
        } else {
          this.update()
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
      resignStatus(resignID) {
        var url = this.$api + '/resignKaryawan/'+ resignID;
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
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = "red"
          this.snackbar = true;
          this.load = false;
        })
      },
      close() {
        this.dialog = false
        this.inputType = 'Tambah';
      },
      cancel() {
        this.resetForm();
        this.readData();
        this.dialog = false;
        this.inputType = 'Tambah';
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
        //FIXME auth role
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