<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Data Transaksi </h3>

        <v-card-title>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-switch
                v-model="singleExpand"
                label="Single expand"
                class="mt-2"
            ></v-switch>
            <v-spacer></v-spacer>
            <v-btn color="success" dark to="/pembayaran"> Pembayaran </v-btn>
        </v-card-title>

        <v-data-table
            :headers="headers"
            :items="transaksi"
            :search="search"
            :loading="loading"
            loading-text="Loading... Please wait"
            :single-expand="singleExpand"
            :expanded.sync="expanded"
            item-key="ID_TRANSAKSI"
            show-expand
        >
            <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                    small
                    class="mr-2"
                    @click="showStrukHandler(item)"
                    color="blue"
                >
                    Print Struk
                </v-btn>
            </template>

            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <table style="width: 30%">
                        <tr>
                            <td>Jenis Pembayaran</td>
                            <td>: {{ item.JENIS_PEMBAYARAN_TRANSAKSI }}</td>
                        </tr>
                        <tr>
                            <td>Nomor Kartu</td>
                            <td>: {{ item.NOMOR_KARTU_TRANSAKSI }}</td>
                        </tr>
                        <tr>
                            <td>Nama Pemilik Kredit</td>
                            <td>: {{ item.NAMA_CREDIT_TRANSAKSI }}</td>
                        </tr>
                        <tr>
                            <td>Kode Verifikasi</td>
                            <td>: {{ item.KODE_VERIFIKASI_TRANSAKSI }}</td>
                        </tr>
                    </table>
                </td>
            </template>
        </v-data-table>

        <v-dialog v-model="dialogStruk" max-width="650px">
            <v-card>
                <!-- <div ref="document"> -->
                    <v-card-text ref="document">
                        <div style="float: right; width: 400px">
                            <h1 style="text-align: center; font-weight: bold">
                                ATMA KOREAN BBQ
                            </h1>
                            <h6 style="text-align: center; color: red;">FUN PLACE TO GRILL!</h6>
                            <h6 style="text-align: center">Jl. Babarsari No. 43 Yogyakarta</h6>
                            <h6 style="text-align: center">552181</h6>
                            <h6 style="text-align: center">Telp. (0274) 487711</h6>
                        </div>
                        <v-img
                            :src="require('@/assets/logo_toko2.png')"
                            max-width="200"
                            style="display:block;"
                        />
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mt-0 font1 teksPosition">
                            Receipt # {{ struk.NOMOR_TRANSAKSI }} <br>Waiter {{ struk.NAMA_KARYAWAN }}
                        </p>
                        <p class="mt-0 font1 teksPositionKanan1">
                            Date {{ struk.TANGGAL_TRANSAKSI }} <br>Time {{ struk.WAKTU_TRANSAKSI }}
                        </p>
                        <br><br><br>
                        <p class="fontBottom">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mt-0 font1 teksPosition">Table # {{ struk.NOMOR_MEJA }}</p>
                        <p class="mt-0 font1 teksPositionKanan1">
                            Customer {{ struk.NAMA_CUSTOMER }}
                        </p>
                        <br><br>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <v-data-table
                            :hide-default-footer="true"
                            :headers="headersDetailPesanan"
                            :items="detailPesanan"
                        >
                            <template v-slot:[`item.HARGA_MENU`]="{ item }">
                                Rp {{ item.HARGA_MENU }}
                            </template>
                            <template v-slot:[`item.SUBTOTAL_ITEM_PESANAN`]="{ item }">
                                Rp {{ item.SUBTOTAL_ITEM_PESANAN }}
                            </template>
                        </v-data-table>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mb-0 font2 teksHarga">
                            Sub Total Rp {{ struk.SUBTOTAL_PESANAN }}
                        </p>
                        <p class="mb-1 font2 teksHarga">
                            Service 5% Rp {{ struk.SERVICE_PESANAN }}
                        </p>
                        <p class="mb-1 font2 teksHarga">Tax 10% Rp {{ struk.TAX_PESANAN }}</p>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mb-0 font2 teksHarga">
                            Total Rp {{ struk.TOTAL_PESANAN }}
                        </p>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mb-1 font3 teksHarga">Total Qty: {{ struk.TOTAL_JUMLAH_PESANAN }}</p>
                        <p class="mb-1 font3 teksHarga">
                            Total Item: {{ struk.TOTAL_ITEM_PESANAN }}
                        </p>
                        <p class="mt-1 font3 teksHarga">Printed {{ dateTime }}</p>
                        <p class="fontBottom mt-1 mb-1"></p>
                        <p class="mt-1 font3 teksHarga">Cashier: {{ printedCashier }}</p>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="fontBottom mt-0 mb-0">THANK YOU FOR YOUR VISIT</p>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red darken-1" dark @click="dialogStruk = false">
                            Close
                        </v-btn>
                        <v-btn color="green darken-1" dark @click="printStruk()">
                            Print
                        </v-btn>
                    </v-card-actions>
                <!-- </div> -->
                
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script>
import html2pdf from 'html2pdf.js'

export default {
    data() {
        return {
            dialogStruk: false,
            expanded: [],
            singleExpand: true,
            load: false,
            snackbar: false,
            error_message: "",
            color: "",
            search: null,
            loading: true,
            struk: {},
            transaksi: [],
            headers: [
                {
                    text: "ID Pesanan",
                    value: "ID_PESANAN",
                },
                {
                    text: "Cashier",
                    value: "NAMA_KARYAWAN",
                },
                {
                    text: "Nomor Transaksi",
                    value: "NOMOR_TRANSAKSI",
                },
                {
                    text: "Tanggal",
                    value: "TANGGAL_TRANSAKSI",
                },
                {
                    text: "Waktu",
                    value: "WAKTU_TRANSAKSI",
                },
                {
                    text: "Actions",
                    value: "actions",
                },
            ],
            cashierColumn: [],
            detailPesanan: [],
            headersDetailPesanan: [
                {
                    text: "Qty",
                    value: "JUMLAH_ITEM_PESANAN",
                },
                {
                    text: "Item Menu",
                    value: "NAMA_MENU"
                },
                {
                    text: "Harga",
                    value: "HARGA_MENU"
                },
                {
                    text: "Subtotal",
                    value: "SUBTOTAL_ITEM_PESANAN",
                },
            ],
            printedCashier: '',
            dateTime: '',
        };
    },

    methods: {
        //read data
        readData() {
            var url = this.$api + "/transaksi";
            this.$http
                .get(url, {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("current_token"),
                    },
                })
                .then((response) => {
                    this.transaksi = response.data.dataTransaksi;

                    // OVERRIDE CASHIER COLUMN
                    for(var i=0; i<this.transaksi.length; i++) {
                        this.transaksi[i].NAMA_KARYAWAN = response.data.namaCashier[i].NAMA_KARYAWAN
                    }

                    this.loading = false;
                })
                .catch((error) => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                    this.loading = false;
                });
        },
        readDataDetailPesanan(idPesanan) {
            var url = this.$api + "/detailPesanan/" + idPesanan;
            this.$http
                .get(url, {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("current_token"),
                    },
                })
                .then((response) => {
                    this.detailPesanan = response.data.data;
                    this.dialogDetail = true;
                })
                .catch((error) => {
                    this.dialogDetail = true;
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        showStrukHandler(item) {
            this.readDataDetailPesanan(item.ID_PESANAN)
            this.getStrukInfo(item.ID_TRANSAKSI)
            this.getCurrentDateTime();
            this.printedCashier = item.NAMA_KARYAWAN
            this.dialogStruk = true;
        },
        getStrukInfo(idTransaksi) {
            var url = this.$api + '/transaksiStruk/' + idTransaksi;
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('current_token')
                }
            }).then(response => {
                this.struk = response.data.data
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
                this.loading = false
            })
        },
        printStruk() {
            html2pdf(this.$refs.document, {
                margin: [0,2,0,0],
                filename: "Transaksi.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { dpi: 192, letterRendering: true },
                jsPDF: { unit: "in", format: "a4", orientation: "p" },
            });
        },
        getCurrentDateTime() {
            var currentdate = new Date(); 
            this.dateTime = currentdate.getDate() + "/"
                            + (currentdate.getMonth()+1)  + "/" 
                            + currentdate.getFullYear() + " @ "
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds();
        }
    },

    mounted() {
        this.readData();
    },
};
</script>

<style scoped>
ul {
    list-style-type: none;
    text-align: center;
}

.teksPosition {
    text-align: left;
    float: left;
}
.teksPosition2 {
    text-align: end;
}
.teksPositionKanan1 {
    text-align: right;
    float: right;
}

.teksHarga {
    text-align: right;
}

.font1 {
    font-size: 18px;
    color: black;
}
.font2 {
    font-size: 15px;
    color: rgb(53, 52, 52);
}
.font3 {
    font-size: 12px;
    color: rgb(53, 52, 52);
}

.fontBottom {
    font-size: 18px;
    text-align: center;
}
</style>