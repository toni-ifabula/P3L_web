<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Pesanan </h3>

        <v-card>
            <v-card-title>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-switch
                    v-model="singleExpand"
                    label="Single expand"
                    class="mt-2"
                ></v-switch>
            </v-card-title>

            <v-data-table 
                :headers="headers" 
                :items="pesanan" 
                :search="search" 
                :loading="loading" 
                loading-text = "Loading... Please wait"
                :single-expand="singleExpand"
                :expanded.sync="expanded"
                item-key="ID_PESANAN"
                show-expand>
                <template v-slot:[`item.STATUS_PESANAN`]="{ item }">
                    <v-chip
                        :color="getStatusColor(item.STATUS_PESANAN)"
                        dark
                    >
                        {{ item.STATUS_PESANAN }}
                    </v-chip>
                </template>

                <template v-slot:[`item.STATUS_LUNAS_PESANAN`]="{ item }">
                    <v-chip
                        :color="getLunasColor(item.STATUS_LUNAS_PESANAN)"
                        dark
                    >
                        {{ item.STATUS_LUNAS_PESANAN }}
                    </v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn small class="mr-2" @click="changeStatusHandler(item)" color="blue" v-if="haveAccess()">
                        Disajikan
                    </v-btn>
                    <v-btn small class="mr-2" @click="detailHandler(item)" color="orange">
                        Menu
                    </v-btn>
                </template>

                <template v-slot:expanded-item="{ headers, item }">
                    <td :colspan="headers.length">
                        <table style="width:20%">
                            <tr>
                                <td>Sub Total</td>
                                <td>: Rp {{ item.SUBTOTAL_PESANAN }}</td>
                            </tr>
                            <tr>
                                <td>Service 5%</td>
                                <td>: Rp {{ item.SERVICE_PESANAN }}</td>
                            </tr>
                            <tr>
                                <td>Tax 10%</td>
                                <td>: Rp {{ item.TAX_PESANAN }}</td>
                            </tr>
                            <tr>
                                <td>Total Qty</td>
                                <td>: {{ item.TOTAL_JUMLAH_PESANAN }}</td>
                            </tr>
                            <tr>
                                <td>Total Item</td>
                                <td>: {{ item.TOTAL_ITEM_PESANAN }}</td>
                            </tr>
                        </table>
                    </td>
                </template>
            </v-data-table>

        </v-card>

        <v-dialog v-model="dialogDetail" max-width="1000px">
            <v-card>
                <h3 class="text-h3 font-weight-medium mb-5"> Data Detail Pesanan {{ selectedIDPesanan }} </h3>
                <v-data-table :headers="headersDetail" :items="detailPesanan"></v-data-table>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogChangeStatus" persistent max-width="400px">
            <v-card>
                <v-card-title>
                    <span class="headline">warning!</span>
                </v-card-title>
                <v-card-text>Anda yakin ingin mengubah status pesanan ini menjadi "Disajikan" ?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="dialogChangeStatus = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="changeStatus">
                        Yes
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
    data() {
        return {
            expanded: [],
            singleExpand: true,
            search: '',
            loading: true,
            load: false,
            snackbar: false,
            error_message: '',
            color: '',
            headers: [
                {
                    text: "ID Reservasi",
                    value: "ID_RESERVASI"
                },
                {
                    text: "Nama Customer",
                    value: "NAMA_CUSTOMER"
                },
                {
                    text: "Nomor Meja",
                    value: "NOMOR_MEJA"
                },
                {
                    text: "Waiter",
                    value: "NAMA_KARYAWAN"
                },
                {
                    text: "Status",
                    value: "STATUS_PESANAN"
                },
                {
                    text: "Total (Rp)",
                    value: "TOTAL_PESANAN"
                },
                {
                    text: "Pembayaran",
                    value: "STATUS_LUNAS_PESANAN"
                },
                {
                    text: "Actions",
                    value: "actions"
                },
            ],
            pesanan: [],
            editID: '',
            dialogChangeStatus: false,
            dialogDetail: false,
            selectedIDPesanan: '',
            idPesanan: '',
            detailPesanan: [],
            headersDetail: [
                {
                    text: "Nama Menu",
                    value: "NAMA_MENU"
                },
                {
                    text: "Harga Menu",
                    value: "HARGA_MENU"
                },
                {
                    text: "Jumlah Item",
                    value: "JUMLAH_ITEM_PESANAN"
                },
                {
                    text: "Subtotal Item",
                    value: "SUBTOTAL_ITEM_PESANAN"
                },
            ],
        }
    },

    methods: {
        //read data
        readData() {
            var url = this.$api + '/pesanan'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('current_token')
                }
            }).then(response => {
                this.pesanan = response.data.data
                this.loading = false
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
                this.loading = false
            })
        },
        changeStatusHandler(item) {
            this.editID = item.ID_PESANAN
            this.dialogChangeStatus = true
        },
        changeStatus() {
            var url = this.$api + '/statusPesanan/' + this.editID
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
                this.dialogChangeStatus = false;
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
                this.dialogChangeStatus = false;
            })
        },
        getStatusColor (status) {
            if (status === 'Dimasak') return 'red'
            else if (status === 'Disajikan') return 'green'
            else return 'orange'
        },
        getLunasColor (lunas) {
            if (lunas === 'Belum') return 'red'
            else if (lunas === 'Lunas') return 'green'
            else return 'orange'
        },

        // DETAIL

        readDataDetail(idPesanan) {
            var url = this.$api + '/detailPesanan/' + idPesanan
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('current_token')
                }
            }).then(response => {
                this.detailPesanan = response.data.data
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
            this.selectedIDPesanan = item.ID_PESANAN
            this.detailPesanan = []   // clean data detail
            this.readDataDetail(this.selectedIDPesanan)
        },

        haveAccess() {
            if(localStorage.getItem("current_role") === '2' || localStorage.getItem("current_role") === '3' || localStorage.getItem("current_role") === '5')
                return 1
            else
                return 0
        },
    },

    mounted() {
      this.readData();
    },
}
</script>