<!-- @format -->

<template>
  <v-main class="list">
    <div v-if="haveAccess() == 0">
      <v-row justify="center">
        <h1>Tidak bisa diakses</h1>
        <h2>Data reservasi hanya dapat diakses oleh waiter dan manager</h2>
      </v-row>
    </div>

    <div v-if="haveAccess() == 1">
      <h3 class="text-h3 font-weight-medium mb-5"> Data Reservasi </h3>

      <v-card>
        <v-card-title>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="success" dark @click="dialog = true">
            Tambah
          </v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="reservasi" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mr-2" @click="editHandler(item)" color="blue">
              edit
            </v-btn>
            <v-btn small @click="deleteHandler(item.ID_RESERVASI)" color="red">
              delete
            </v-btn>
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }} Data Reservasi</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-text-field v-model="form.meja" label="ID Meja" required></v-text-field>

              <v-text-field v-model="form.customer" label="ID Customer" :rules="[rules.required]"></v-text-field>

              <v-select
                v-model="form.sesi"
                :items="sesiItems"
                label="Sesi"
              ></v-select>

              <v-text-field v-model="form.tanggal" label="Tanggal" required></v-text-field>
              
              <v-date-picker
                v-model="form.tanggal"
                color="green lighten-1"
              ></v-date-picker>

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

      <v-dialog v-model="dialogConfirm" persistent max-width="400px">
        <v-card>
          <v-card-title>
            <span class="headline">warning!</span>
          </v-card-title>
          <v-card-text>
            Anda yakin ingin menghapus reservasi ini?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogConfirm = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="deleteData">
              Delete
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
        rules: {required: value => !!value || 'Required.',},
        inputType: 'Tambah',
        load: false,
        snackbar: false,
        error_message: '',
        color: '',
        search: null,
        dialog: false,
        dialogConfirm: false,
        headers: [{
            text: "ID Meja",
            align: "start",
            sortable: true,
            value: "ID_MEJA"
          },
          {
            text: "ID Customer",
            value: "ID_CUSTOMER"
          },
          {
            text: "Sesi",
            value: "SESI_RESERVASI"
          },
          {
            text: "Tanggal",
            value: "TANGGAL_RESERVASI"
          },
          {
            text: "Actions",
            value: "actions"
          },
        ],
        reservasiFormData: new FormData,
        reservasi: [],
        form: {
          meja: null,
          customer: null,
          sesi: null,
          tanggal: null,
        },
        editId: '',
        deleteId: '',
        sesiItems: ["Lunch", "Dinner"],
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
        var url = this.$api + '/reservasi'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.reservasi = response.data.data
        })
      },
      //simpan data
      save() {
        this.reservasiFormData.append('ID_MEJA', this.form.meja);
        this.reservasiFormData.append('ID_CUSTOMER', this.form.customer);
        this.reservasiFormData.append('SESI_RESERVASI', this.form.sesi);
        this.reservasiFormData.append('TANGGAL_RESERVASI', this.form.tanggal);

        var url = this.$api + '/reservasi'
        this.load = true
        this.$http.post(url, this.reservasiFormData, {
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
          ID_MEJA: this.form.meja,
          ID_CUSTOMER: this.form.customer,
          SESI_RESERVASI: this.form.sesi,
          TANGGAL_RESERVASI: this.form.tanggal,
        }
        var url = this.$api + '/reservasi/' + this.editId;
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
        this.editId = item.ID_RESERVASI;
        this.form.meja = item.ID_MEJA;
        this.form.customer = item.ID_CUSTOMER;
        this.form.sesi = item.SESI_RESERVASI;
        this.form.tanggal = item.TANGGAL_RESERVASI;
        this.dialog = true;
      },
      //hapus data 
      deleteData() {
        //mengahapus data 
        var url = this.$api + '/reservasi/' + this.deleteId;
        //data dihapus berdasarkan id 
        this.$http.delete(url, {
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
          this.dialogConfirm = false;
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = "red"
          this.snackbar = true;
          this.load = false;
        })
      },
      deleteHandler(id) {
        this.deleteId = id;
        this.dialogConfirm = true;
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
          meja: null,
          customer: null,
          sesi: null,
          tanggal: null,
        };
      },
      haveAccess(){
        if(localStorage.getItem("current_role") === '2' || localStorage.getItem("current_role") === '3')
          return 1
        else
          return 0
      }
    },
    computed: {
      formTitle() {
        return this.inputType
      },
    },
    mounted() {
      this.readData();
    },
  };
</script>