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
        <v-data-table :headers="headers" :items="stokBahan" :search="search" :loading="loading" loading-text="Loading... Please wait">
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mr-2" @click="editHandler(item)" color="blue">
              edit
            </v-btn>
            <v-btn small class="mr-2" @click="detailHandler(item)" color="orange">
              Detail
            </v-btn>
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
            <v-form ref="form">
              <v-text-field v-model="form.nama" label="Nama Stok Bahan" :rules="requiredRules" required></v-text-field>

              <v-text-field v-model="form.serving" label="Serving Stok Bahan" type="number" :rules="requiredRules" required></v-text-field>

              <v-select
                v-model="form.unit"
                :items="unitItems"
                label="Unit"
                :rules="requiredRules"
              ></v-select>

              <v-text-field prefix="Rp" type="number" v-model="form.harga" label="Harga" :rules="requiredRules" required></v-text-field>

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

    <v-dialog v-model="dialogDetail">
      <v-card>
        <h3 class="text-h3 font-weight-medium mb-5"> Data Detail {{ selectedNamaStok }} </h3>
        <v-card-title>
          <v-text-field v-model="searchDetail" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
          <v-spacer></v-spacer>
          <v-btn color="success" dark @click="dialogTambahDetail = true">
            Tambah
          </v-btn>
        </v-card-title>
        <v-data-table :headers="headersDetail" :items="detailStokBahan" :search="searchDetail">
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mr-2" @click="editHandlerDetail(item)" color="blue">
              edit
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogTambahDetail" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Data Detail {{ selectedNamaStok }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form">

              <v-menu
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="formDetail.tanggal"
                      label="Tanggal Masuk"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="requiredRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="formDetail.tanggal"
                  ></v-date-picker>
                </v-menu>

              <v-text-field v-model="formDetail.incoming" label="Incoming Stok" type="number" :rules="requiredRules" required></v-text-field>

            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" text @click="cancelDetail">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="setFormDetail">
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
        searchDetail: null,
        dialog: false,
        dialogConfirm: false,
        headers: [
          {
            text: "Nama Stok",
            align: "start",
            sortable: true,
            value: "NAMA_STOK"
          },
          {
            text: "Serving",
            value: "SERVING_STOK"
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
          serving: null,
          unit: null,
          harga: null,
        },
        editId: '',
        deleteId: '',
        unitItems: ["gram", "ml"],
        requiredRules: [
          v => !!v || 'This field is required'
        ],
        dialogDetail: false,
        dialogTambahDetail: false,
        headersDetail: [{
            text: "Tanggal Masuk",
            align: "start",
            sortable: true,
            value: "TANGGAL_MASUK_STOK"
          },
          {
            text: "Incoming Stok",
            value: "INCOMING_STOK"
          },
          {
            text: "Remaining Stok",
            value: "REMAINING_STOK"
          },
          {
            text: "Waste Stok",
            value: "WASTE_STOK"
          },
          {
            text: "Actions",
            value: "actions"
          },
        ],
        detailStokBahan: [],
        selectedStokID: '',
        selectedNamaStok: '',
        detailFormData: new FormData,
        formDetail: {
          tanggal: null,
          incoming: null
        },
        DetailEditID: '',
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
        var url = this.$api + '/stokBahan'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.stokBahan = response.data.data
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
        this.stokFormData.append('NAMA_STOK', this.form.nama);
        this.stokFormData.append('SERVING_STOK', this.form.serving);
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
          SERVING_STOK: this.form.serving,
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
        this.form.serving = item.SERVING_STOK;
        this.form.unit = item.UNIT_STOK;
        this.form.harga = item.HARGA_STOK;
        this.dialog = true;
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
          serving: null,
          unit: null,
          harga: null,
        };
      },
      haveAccess() {
        if(localStorage.getItem("current_role") === '2' || localStorage.getItem("current_role") === '5')
          return 1
        else
          return 0
      },

      // DETAIL METHOD

      setFormDetail() {
        if(this.$refs.form.validate()) {
          if (this.inputType === 'Tambah') {
            this.saveDetail()
          } else {
            this.updateDetail()
          }
        }
      },
      readDataDetail(idStok) {
        var url = this.$api + '/detailStok/' + idStok
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.detailStokBahan = response.data.data
          this.dialogDetail = true
        }).catch(error => {
          this.dialogDetail = true
          this.error_message = error.response.data.message;
          this.color = "red"
          this.snackbar = true;
          this.load = false;
        })
      },
      detailHandler(item) {
        this.selectedStokID = item.ID_STOK
        this.selectedNamaStok = item.NAMA_STOK
        this.detailStokBahan = []   // clean data detail
        this.readDataDetail(this.selectedStokID)
      },
      saveDetail() {
        this.detailFormData.append('ID_STOK', this.selectedStokID);
        this.detailFormData.append('TANGGAL_MASUK_STOK', this.formDetail.tanggal);
        this.detailFormData.append('INCOMING_STOK', this.formDetail.incoming);
        this.detailFormData.append('REMAINING_STOK', this.formDetail.incoming);
        this.detailFormData.append('WASTE_STOK', this.formDetail.incoming);

        var url = this.$api + '/detailStok'
        this.load = true
        this.$http.post(url, this.detailFormData, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.error_message = response.data.message;
          this.color = "green"
          this.snackbar = true;
          this.load = false;
          this.closeDetail();
          this.readDataDetail(this.selectedStokID); //mengambil data
          this.resetFormDetail();
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = "red"
          this.snackbar = true;
          this.load = false;
        })
      },
      //ubah data
      updateDetail() {
        let newData = {
          ID_STOK: this.selectedStokID,
          TANGGAL_MASUK_STOK: this.formDetail.tanggal,
          INCOMING_STOK: this.formDetail.incoming,
          REMAINING_STOK: this.formDetail.remaining,
          WASTE_STOK: this.formDetail.waste,
        }
        var url = this.$api + '/detailStok/' + this.DetailEditID;
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
          this.closeDetail();
          this.readDataDetail(this.selectedStokID); //mengambil data
          this.resetFormDetail();
          this.inputType = 'Tambah';
        }).catch(error => {
          this.error_message = error.response.data.message;
          this.color = "red"
          this.snackbar = true;
          this.load = false;
        })
      },
      editHandlerDetail(item) {
        this.inputType = 'Ubah';
        this.DetailEditID = item.ID_DETAIL_STOK;
        this.formDetail.tanggal = item.TANGGAL_MASUK_STOK;
        this.formDetail.incoming = item.INCOMING_STOK;
        this.formDetail.remaining = item.REMAINING_STOK;
        this.formDetail.waste = item.WASTE_STOK;
        this.dialogTambahDetail = true;
      },
      closeDetail() {
        this.dialogTambahDetail = false
        this.inputType = 'Tambah';
      },
      cancelDetail() {
        this.resetFormDetail();
        this.readDataDetail(this.selectedStokID);
        this.dialogTambahDetail = false;
        this.inputType = 'Tambah';
      },
      resetFormDetail() {
        this.formDetail = {
          tanggal: null,
          incoming: null,
          remaining: null,
          waste: null,
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