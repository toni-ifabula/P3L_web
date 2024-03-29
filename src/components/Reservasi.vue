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
        <v-data-table :headers="headers" :items="reservasi" :search="search" :loading="loading" loading-text="Loading... Please wait">
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn small class="mr-2" @click="editHandler(item)" color="blue">
              edit
            </v-btn>
            <v-btn small class="mr-2" @click="deleteHandler(item.ID_RESERVASI)" color="red">
              delete
            </v-btn>
            <v-btn small class="mr-2" @click="showQR(item.ID_RESERVASI)" color="orange">
              QR Code
            </v-btn>
          </template>
        </v-data-table>
      </v-card>

      <v-dialog v-model="dialog" max-width="600px" persistent>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }} Data Reservasi</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-form ref="form">
                <v-select
                  v-model="form.meja"
                  :items="mejaItems"
                  label="Nomor Meja"
                  v-on:change="getIDMejabyNomor(form.meja)"
                  :rules="requiredRules"
                ></v-select>

                <v-select
                  v-model="form.customer"
                  :items="customerItems"
                  label="Nama Customer"
                  v-on:change="getIDCustomerbyNama(form.customer)"
                  :rules="requiredRules"
                ></v-select>

                <v-select
                  v-model="form.sesi"
                  :items="sesiItems"
                  label="Sesi"
                  :rules="requiredRules"
                ></v-select>

                <v-menu
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="form.tanggal"
                      label="Tanggal"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :rules="requiredRules"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="form.tanggal"
                  ></v-date-picker>
                </v-menu>
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
            Anda yakin ingin menghapus reservasi ini?
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

      <v-dialog v-model="dialogQR" max-width="400px">
        <v-card>
          <div ref="document" style="width: 400px">
            <ul>
              <li>
                <img class="mt-5" :src="require('@/assets/logo_toko2.png')" height="200px">
              </li>

              <li>
                <img :src="qrURL" height="200px">
              </li>
              
              <li>
                  <p style="font-weight: bold;">Printed {{ dateTime }}</p><br>
              </li>

              <li>
                <p>Printed by {{ namaPrinter }}</p>
              </li>

              <hr>
              <li>
                <h4 style="font-weight: bold;">FUN PLACE TO GRILL</h4>
              </li>
              <hr>
            </ul>
          </div>

          <div>
            <v-row justify="center">
              <v-btn small class="mr-2" @click="printQR()" color="green">
                Print
              </v-btn>
            </v-row>
          </div>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
        {{error_message}}
      </v-snackbar>
    </div>

  </v-main>
</template>
<script>
  import QRCode from 'qrcode'
  import html2pdf from 'html2pdf.js'

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
            text: "Nomor Meja",
            value: "NOMOR_MEJA"
          },
          {
            text: "Nama Customer",
            value: "NAMA_CUSTOMER"
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
        mejaItems: [],
        selectedMejaID: null,
        customerItems: [],
        selectedCustomerID: null,
        requiredRules: [
          v => !!v || 'This field is required'
        ],
        loading: true,
        dialogQR: false,
        qrURL: '',
        dateTime: '',
        namaPrinter: '',
        idReservasi: '',
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
        var url = this.$api + '/reservasi'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.reservasi = response.data.data
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
        this.reservasiFormData.append('ID_MEJA', this.selectedMejaID);
        this.reservasiFormData.append('ID_CUSTOMER', this.selectedCustomerID);
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
          ID_MEJA: this.selectedMejaID,
          ID_CUSTOMER: this.selectedCustomerID,
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
        this.selectedMejaID = null;   //clear value
        this.selectedCustomerID = null;   //clear value
      },
      cancel() {
        this.resetForm();
        this.readData();
        this.dialog = false;
        this.inputType = 'Tambah';
        this.selectedMejaID = null;   //clear value
        this.selectedCustomerID = null;   //clear value
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
      },
      getNomorMeja() {
        var url = this.$api + '/meja'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          for(var i = 0; i < response.data.data.length; i++) {
            if(response.data.data[i].STATUS_MEJA === 'Kosong')
              this.mejaItems.push(response.data.data[i].NOMOR_MEJA);
          }
        })
      },
      getIDMejabyNomor(nomorMeja) {
        var url = this.$api + '/IDMeja/' + nomorMeja;
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.selectedMejaID = response.data.data[0].ID_MEJA;
        })
      },
      getNamaCustomer() {
        var url = this.$api + '/customer'
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          for(var i = 0; i < response.data.data.length; i++) {
            this.customerItems.push(response.data.data[i].NAMA_CUSTOMER);
          }
        })
      },
      getIDCustomerbyNama(nama) {
        var url = this.$api + '/IDCustomer/' + nama;
        this.$http.get(url, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('current_token')
          }
        }).then(response => {
          this.selectedCustomerID = response.data.data[0].ID_CUSTOMER;
        })
      },
      showQR(item) {
        this.idReservasi = item.toString();
        QRCode.toDataURL(this.idReservasi + ";" + localStorage.getItem("current_id"))
          .then(url => {
            this.qrURL = url;
          })
          .catch(err => {
            console.error(err)
          })
        
        var currentdate = new Date(); 
        this.dateTime = currentdate.getDate() + "/"
                        + (currentdate.getMonth()+1)  + "/" 
                        + currentdate.getFullYear() + " @ "
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();

        this.namaPrinter = localStorage.getItem("current_nama");

        this.dialogQR = true;
      },
      printQR() {
        html2pdf(this.$refs.document, {
        margin: [0,2,0,0],
        filename: "QR Code.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { dpi: 192, letterRendering: true },
        jsPDF: { unit: "in", format: "a4", orientation: "p" },
      });
      },
      
    },

    computed: {
      formTitle() {
        return this.inputType
      },
    },

    mounted() {
      this.readData();
      this.getNomorMeja();
      this.getNamaCustomer();
    },
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h1, h2 {
		font-weight: normal;
	}

	ul {
		list-style-type: none;
		text-align: center;
	}

	a {
		color: #42b983;
	}
</style>