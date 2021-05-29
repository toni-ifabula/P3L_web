<template>
    <v-main class="list">
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
                <div id="printableArea">
                    <v-card-text>
                        <div style="float: right; width: 400px">
                            <h1 style="text-align: center">ATMA KOREAN BBQ</h1>
                            <h6 style="text-align: center">FUN PLACE TO GRILL!</h6>
                            <h6 style="text-align: center">Jl. Babarsari No. 43 Yogyakarta</h6>
                            <h6 style="text-align: center">552181</h6>
                            <h6 style="text-align: center">Telp. (0274) 487711</h6>
                        </div>
                        <v-img
                            :src="require('@/assets/logo_toko2.png')"
                            max-width="200"
                        />
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mt-0 font1 teksPosition">
                            Receipt # {{ struk.receipt }} <br>Waiter {{ struk.waiter }}
                        </p>
                        <p class="mt-0 font1 teksPositionKanan1">
                            Date {{ struk.date }} <br>Time {{ struk.time }}
                        </p>
                        <br><br><br>
                        <p class="fontBottom">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mt-0 font1 teksPosition">Table # {{ struk.table }}</p>
                        <p class="mt-0 font1 teksPositionKanan1">
                            Customer {{ struk.customer }}
                        </p>
                        <br><br>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <v-data-table
                            :hide-default-footer="true"
                            :headers="headersStruk"
                            :items="detailPesanan"
                            :search="search"
                        >
                            <template v-slot:[`item.harga_menu`]="{ item }">
                                Rp. {{ item.harga_menu }}
                            </template>
                            <template v-slot:[`item.harga`]="{ item }">
                                Rp. {{ item.harga }}
                            </template>
                        </v-data-table>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mb-0 font2 teksHarga">
                            Sub Total Rp.{{ subtotal_pesanan }}
                        </p>
                        <p class="mb-1 font2 teksHarga">
                            Service 5% Rp.{{ service }}
                        </p>
                        <p class="mb-1 font2 teksHarga">Tax 10% Rp.{{ tax }}</p>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mb-0 font2 teksHarga">
                            Total Rp.{{ total_pesanan }}
                        </p>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="mb-1 font3 teksHarga">Total Qty: {{ qty }}</p>
                        <p class="mb-1 font3 teksHarga">
                            Total Item: {{ total_item }}
                        </p>
                        <p class="mt-1 font3 teksHarga">Printed {{ hari_ini }}</p>
                        <p class="fontBottom mt-1 mb-1"></p>
                        <p class="mt-1 font3 teksHarga">Cashier: {{ nama }}</p>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                        <p class="fontBottom mt-0 mb-0">THANK YOU FOR YOUR VISIT</p>
                        <p class="fontBottom mt-1 mb-1">
                            -----------------------------------------------------------------------------------------
                        </p>
                    </v-card-text>
                </div>

                <v-btn color="success" @click="printStruk('printableArea')">Print</v-btn>
            </v-card>
        </v-dialog>
    </v-main>
</template>

<script>
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
            struk: {
                receipt: "",
                date: "",
                waiter: "",
                time: "",
                table: "",
                customer: "",
            },
            transaksi: [],
            headers: [
                {
                    text: "ID Transaksi",
                    value: "ID_TRANSAKSI",
                },
                {
                    text: "ID Pesanan",
                    value: "ID_PESANAN",
                },
                {
                    text: "ID Karyawan",
                    value: "ID_KARYAWAN",
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
            detailPesanan: [],
            headersDetailPesanan: [
                {
                    text: "ID Pesanan",
                    value: "ID_PESANAN",
                },
                {
                    text: "ID Menu",
                    value: "ID_MENU",
                },
                {
                    text: "Jumlah Item",
                    value: "JUMLAH_ITEM_PESANAN",
                },
                {
                    text: "Subtotal Item",
                    value: "SUBTOTAL_ITEM_PESANAN",
                },
            ],
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
                    this.transaksi = response.data.data;
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
            this.dialogStruk = true;
        },
        printStruk(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;

            document.body.innerHTML = printContents;

            window.print();

            document.body.innerHTML = originalContents;
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
    font-family: "Fredoka One", cursive;
    font-size: 18px;
    color: black;
}
.font2 {
    font-family: "Fredoka One", cursive;
    font-size: 15px;
    color: rgb(53, 52, 52);
}
.font3 {
    font-family: "Fredoka One", cursive;
    font-size: 12px;
    color: rgb(53, 52, 52);
}

.fontBottom {
    font-family: serif;
    font-size: 18px;
    text-align: center;
}
</style>