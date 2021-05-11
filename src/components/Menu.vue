<!-- @format -->

<template>
  <v-main class="list">
    <h3 class="text-h3 font-weight-medium mb-5"> Data Menu </h3>

    <v-card>
      <v-card-title>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
        <v-spacer></v-spacer>
        <v-btn color="success" dark @click="dialog = true" v-if="haveAccess() == 1">
          Tambah
        </v-btn>
      </v-card-title>
      <v-data-table 
        :headers="headers" 
        :items="menu" 
        :search="search" 
        :loading="loading" loading-text="Loading... Please wait">
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small class="mt-2 mb-2" @click="editHandler(item)" color="blue" block v-if="haveAccess() == 1">
            edit
          </v-btn>
          <v-btn small class="mb-2" @click="deleteHandler(item.ID_MENU)" color="red" block v-if="haveAccess() == 1">
            delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Data Menu</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-form ref="form">
              <v-text-field v-model="form.nama" label="Nama Menu" :rules="requiredRules" required></v-text-field>

              <v-select
                v-model="form.bahan"
                :items="bahanItems"
                label="Bahan"
                v-on:change="getIDBahanbyNama(form.bahan)"
                :rules="requiredRules"
              ></v-select>

              <v-select
                v-model="form.kategori"
                :items="kategoriItems"
                label="Kategori"
                :rules="requiredRules"
              ></v-select>

              <v-text-field v-model="form.deskripsi" label="Deskripsi" :rules="requiredRules" required></v-text-field>

              <v-select
                v-model="form.unit"
                :items="unitItems"
                label="Unit"
                :rules="requiredRules"
              ></v-select>

              <v-text-field prefix="Rp" v-model="form.harga" label="Harga" type="number" :rules="requiredRules" required></v-text-field>

              <v-text-field v-model="form.image" label="URL Gambar" :rules="requiredRules" required></v-text-field>
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
          Anda yakin ingin menghapus menu ini?
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
        headers: [{
            text: "Nama Menu",
            align: "start",
            sortable: true,
            value: "NAMA_MENU"
          },
          {
            text: "ID Bahan",
            value: "ID_STOK"
          },
          {
            text: "Kategori",
            value: "KATEGORI_MENU"
          },
          {
            text: "Deskripsi",
            value: "DESKRIPSI_MENU",
            Class: "text-wrap"
          },
          {
            text: "Unit",
            value: "UNIT_MENU"
          },
          {
            text: "Harga",
            value: "HARGA_MENU"
          },
          {
            text: "Actions",
            value: "actions"
          },
        ],
        menuFormData: new FormData,
        menu: [],
        form: {
          nama: null,
          bahan: null,
          kategori: null,
          deskripsi: null,
          unit: null,
          harga: null,
          image: null,
        },
        editId: '',
        deleteId: '',
        kategoriItems: ["Makanan Utama", "Makanan Side Dish", "Minuman"],
        unitItems: ["Plate", "Bowl", "Mini Bowl", "Glass", "Bottle"],
        bahanItems: [],
        selectedBahanID: null,
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
        var url = this.$api + '/menu'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.menu = response.data.data
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
        this.menuFormData.append('NAMA_MENU', this.form.nama);
        this.menuFormData.append('ID_STOK', this.selectedBahanID);
        this.menuFormData.append('KATEGORI_MENU', this.form.kategori);
        this.menuFormData.append('DESKRIPSI_MENU', this.form.deskripsi);
        this.menuFormData.append('UNIT_MENU', this.form.unit);
        this.menuFormData.append('HARGA_MENU', this.form.harga);
        this.menuFormData.append('IMAGE', this.form.image);

        var url = this.$api + '/menu'
        this.load = true
        this.$http.post(url, this.menuFormData, {
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
          NAMA_MENU: this.form.nama,
          ID_STOK: this.selectedBahanID,
          KATEGORI_MENU: this.form.kategori,
          DESKRIPSI_MENU: this.form.deskripsi,
          UNIT_MENU: this.form.unit,
          HARGA_MENU: this.form.harga,
          IMAGE: this.form.image,
        }
        var url = this.$api + '/menu/' + this.editId;
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
        this.editId = item.ID_MENU;
        this.form.nama = item.NAMA_MENU;
        this.form.bahan = item.ID_STOK;
        this.form.kategori = item.KATEGORI_MENU;
        this.form.deskripsi = item.DESKRIPSI_MENU;
        this.form.unit = item.UNIT_MENU;
        this.form.harga = item.HARGA_MENU;
        this.form.image = item.IMAGE;
        this.dialog = true;
      },
      //hapus data
      deleteData() {
        //mengahapus data 
        var url = this.$api + '/menu/' + this.deleteId;
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
        this.selectedBahanID = null;    //clear value
      },
      cancel() {
        this.resetForm();
        this.readData();
        this.dialog = false;
        this.inputType = 'Tambah';
        this.selectedBahanID = null;    //clear value
      },
      resetForm() {
        this.form = {
          nama: null,
          bahan: null,
          kategori: null,
          deskripsi: null,
          unit: null,
          harga: null,
          image: null,
        };
      },
      haveAccess() {
        if(localStorage.getItem("current_role") === '2')
          return 1
        else
          return 0
      },
      getNamaBahan() {
        var url = this.$api + '/stokBahan'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          for(var i = 0; i < response.data.data.length; i++) {
            this.bahanItems.push(response.data.data[i].NAMA_STOK);
          }
        })
      },
      getIDBahanbyNama(nama) {
        var url = this.$api + '/IDStokBahan/' + nama;
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.selectedBahanID = response.data.data[0].ID_STOK;
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
      this.getNamaBahan();
    },
  };
</script>