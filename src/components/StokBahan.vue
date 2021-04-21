<!-- @format -->

<template>
  <v-main class="list">
    <div v-if="haveAccess() == 0">
      <v-row justify="center">
        <h1>Tidak bisa diakses</h1>
        <h2>Data stok bahan hanya dapat diakses oleh chef dan manager</h2>
      </v-row>
    </div>

    <div v-if="haveAccess() == 1">
      <h3 class="text-h3 font-weight-medium mb-5"> Data Stok Bahan </h3>

      <v-card>
        <v-card-title>
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="success" dark @click="dialog = true">
            Tambah
          </v-btn>
        </v-card-title>
        <v-data-table :headers="headers" :items="stokBahan" :search="search">
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mr-2" @click="editHandler(item)" color="blue">
              edit
            </v-btn>
            <!-- <v-btn small @click="deleteHandler(item.ID_STOK)" color="red">
              delete
            </v-btn> -->
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }} Data Stok Bahan</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              //TODO FORM VALIDATION
              <v-text-field v-model="form.nama" label="Nama Stok Bahan" required></v-text-field>

              <v-select
                v-model="form.unit"
                :items="unitItems"
                label="Unit"
              ></v-select>

              <v-text-field v-model="form.harga" label="Harga" required></v-text-field>

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
            text: "Nama Stok",
            align: "start",
            sortable: true,
            value: "NAMA_STOK"
          },
          {
            text: "Unit",
            value: "UNIT_STOK"
          },
          {
            text: "Harga",
            value: "HARGA_STOK"
          },
          {
            text: "Actions",
            value: "actions"
          },
        ],
        stokFormData: new FormData,
        stokBahan: [],
        form: {
          nama: null,
          unit: null,
          harga: null,
        },
        editId: '',
        deleteId: '',
        unitItems: ["gram", "ml"],
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
        var url = this.$api + '/stokBahan'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.stokBahan = response.data.data
        })
      },
      //simpan data
      save() {
        this.stokFormData.append('NAMA_STOK', this.form.nama);
        this.stokFormData.append('UNIT_STOK', this.form.unit);
        this.stokFormData.append('HARGA_STOK', this.form.harga);

        var url = this.$api + '/stokBahan'
        this.load = true
        this.$http.post(url, this.stokFormData, {
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
          NAMA_STOK: this.form.nama,
          UNIT_STOK: this.form.unit,
          HARGA_STOK: this.form.harga,
        }
        var url = this.$api + '/stokBahan/' + this.editId;
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
        this.editId = item.ID_STOK;
        this.form.nama = item.NAMA_STOK;
        this.form.unit = item.UNIT_STOK;
        this.form.harga = item.HARGA_STOK;
        this.dialog = true;
      },
      //hapus data
      deleteData() {
        //mengahapus data 
        var url = this.$api + '/stokBahan/' + this.deleteId;
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
          unit: null,
          harga: null,
        };
      },
      haveAccess() {
        if(localStorage.getItem("current_role") === '1' || localStorage.getItem("current_role") === '5')
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