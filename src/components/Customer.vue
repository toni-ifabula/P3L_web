<!-- @format -->

<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5"> Data Customer </h3>

    <v-card>
      <v-card-title>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="success" dark @click="dialog = true">
          Tambah
        </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="customer" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mr-2" @click="editHandler(item)" color="blue">
            edit
          </v-btn>
          <v-btn small @click="deleteHandler(item.ID_CUSTOMER)" color="red">
            delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Data Customer</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field v-model="form.nama" label="Nama customer" required></v-text-field>

            <v-text-field v-model="form.email" label="Email customer" :rules="[rules.required]"></v-text-field>

            <v-text-field v-model="form.telepon" label="Telepon customer"></v-text-field>

            <!-- FOR UPDATE MUST BE REQUIRED -->

            <!-- V-TEXT-FIELD -->

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
          Anda yakin ingin menghapus customer ini?
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
            text: "Nama Customer",
            align: "start",
            sortable: true,
            value: "NAMA_CUSTOMER"
          },
          {
            text: "Email",
            value: "EMAIL_CUSTOMER"
          },
          {
            text: "Telepon",
            value: "TELEPON_CUSTOMER"
          },
          {
            text: "Actions",
            value: "actions"
          },
        ],
        customerFormData: new FormData,
        customer: [],
        form: {
          nama: null,
          email: null,
          telepon: null,
        },
        editId: '',
        deleteId: '',
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
        var url = this.$api + '/customer'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.customer = response.data.data
        })
      },
      //simpan data
      save() {
        this.customerFormData.append('NAMA_CUSTOMER', this.form.nama);
        if(this.form.email != null)
            this.customerFormData.append('EMAIL_CUSTOMER', this.form.email);
        if(this.form.telepon != null)
            this.customerFormData.append('TELEPON_CUSTOMER', this.form.telepon);

        var url = this.$api + '/customer'
        this.load = true
        this.$http.post(url, this.customerFormData, {
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
          NAMA_CUSTOMER: this.form.nama,
          EMAIL_CUSTOMER: this.form.email,
          TELEPON_CUSTOMER: this.form.telepon,
        }
        var url = this.$api + '/customer/' + this.editId;
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
        this.editId = item.ID_CUSTOMER;
        this.form.nama = item.NAMA_CUSTOMER;
        this.form.email = item.EMAIL_CUSTOMER;
        this.form.telepon = item.TELEPON_CUSTOMER;
        this.dialog = true;
      },
      //hapus data 
      deleteData() {
        //mengahapus data 
        var url = this.$api + '/customer/' + this.deleteId;
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
          nama: null,
          email: null,
          telepon: null,
        };
      },
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