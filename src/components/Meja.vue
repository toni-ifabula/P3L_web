<!-- @format -->

<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5"> Data Meja </h3>

    <v-card>
      <v-card-title>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="success" dark @click="dialog = true" v-if="haveAccess()">
          Tambah
        </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="meja" :search="search" :loading="loading" loading-text="Loading... Please wait">
        <template v-slot:[`item.STATUS_MEJA`]="{ item }">
          <v-chip
            :color="getStatusColor(item.STATUS_MEJA)"
            dark
          >
            {{ item.STATUS_MEJA }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }" v-if="haveAccess()">
          <v-btn small class="mr-2" @click="editHandler(item)" color="blue">
            edit
          </v-btn>
          <v-btn small @click="deleteHandler(item.ID_MEJA)" color="red">
            delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Data Meja</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-text-field v-model="form.nomor" label="Nomor Meja" type="number" :rules="requiredRules" required></v-text-field>

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
          Anda yakin ingin menghapus meja ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="dialogConfirm = false">
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
        inputType: 'Tambah',
        load: false,
        snackbar: false,
        error_message: '',
        color: '',
        search: null,
        dialog: false,
        dialogConfirm: false,
        headers: [
          {
            text: "Nomor Meja",
            align: "start",
            sortable: true,
            value: "NOMOR_MEJA"
          },
          {
            text: "Status",
            value: "STATUS_MEJA"
          },
          {
            text: "Actions",
            value: "actions"
          },
        ],
        mejaFormData: new FormData,
        meja: [],
        form: {
          nomor: null,
          status: null,
        },
        editId: '',
        deleteId: '',
        statusItems: ["Kosong", "Isi"],
        requiredRules: [
          v => !!v || 'This field is required'
        ],
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
        var url = this.$api + '/meja'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.meja = response.data.data
          this.loading = false
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
        this.mejaFormData.append('NOMOR_MEJA', this.form.nomor);
        this.mejaFormData.append('STATUS_MEJA', this.form.status);

        var url = this.$api + '/meja'
        this.load = true
        this.$http.post(url, this.mejaFormData, {
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
          NOMOR_MEJA: this.form.nomor,
          STATUS_MEJA: this.form.status,
        }
        var url = this.$api + '/meja/' + this.editId;
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
        this.editId = item.ID_MEJA;
        this.form.nomor = item.NOMOR_MEJA;
        this.form.status = item.STATUS_MEJA;
        this.dialog = true;
      },
      //hapus data 
      deleteData() {
        //mengahapus data 
        var url = this.$api + '/meja/' + this.deleteId;
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
          nomor: null,
          status: null,
        };
      },
      getStatusColor (status) {
        if (status === 'Isi') return 'red'
        else if (status === 'Kosong') return 'green'
        else return 'orange'
      },
      haveAccess() {
        if(localStorage.getItem("current_role") === '1' || localStorage.getItem("current_role") === '2')
          return 1
        else
          return 0
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