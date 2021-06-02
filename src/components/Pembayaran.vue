<template>
  <v-main class="list">
      <h3 class="text-h3 font-weight-medium mb-5"> Pembayaran </h3>

        <v-select
            v-model="nomorMeja"
            :items="mejaItems"
            label="Nomor Meja (Belum bayar)"
            v-on:change="getInfoByMeja(nomorMeja)"
        ></v-select>

        <v-row justify="center">
            <v-card class="justify-center" width="600px" v-if="nomorMeja != null">
                <v-card-title>
                    <span class="headline">Data Pesanan</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <table style="width:100%">
                            <tr>
                                <td><h5>ID Pesanan</h5></td>
                                <td><h5>: {{ pesanan.ID_PESANAN }}</h5></td>
                            </tr>
                            <tr>
                                <td><h5>Nama Customer</h5></td>
                                <td><h5>: {{ pesanan.NAMA_CUSTOMER }}</h5></td>
                            </tr>
                            <tr>
                                <td><h5>Nomor Meja</h5></td>
                                <td><h5>: {{ pesanan.NOMOR_MEJA }}</h5></td>
                            </tr>
                            <tr>
                                <td style="align: center" colspan="2">
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
                                </td>
                            </tr>
                            <tr>
                                <td><h5>Subtotal</h5></td>
                                <td><h5>: Rp {{ pesanan.SUBTOTAL_PESANAN }}</h5></td>
                            </tr>
                            <tr>
                                <td><h5>Service</h5></td>
                                <td><h5>: Rp {{ pesanan.SERVICE_PESANAN }}</h5></td>
                            </tr>
                            <tr>
                                <td><h5>Tax</h5></td>
                                <td><h5>: Rp {{ pesanan.TAX_PESANAN }}</h5></td>
                            </tr>
                            <tr>
                                <td><h5>Total</h5></td>
                                <td><h5>: Rp {{ pesanan.TOTAL_PESANAN }}</h5></td>
                            </tr>
                        </table>
                        <br>

                        <v-btn style="margin: 0 auto" color="success" dark block @click="dialog = true">
                            Bayar
                        </v-btn>
                    </v-container>
                </v-card-text>
            </v-card>            
        </v-row>

        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Informasi Pembayaran</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form">
                        <v-select
                            v-model="form.JENIS_PEMBAYARAN_TRANSAKSI"
                            :items="jenisItems"
                            label="Jenis Pembayaran"
                            :rules="requiredRules"
                        ></v-select>

                        <v-text-field v-model="form.NOMOR_KARTU_TRANSAKSI" label="Nomor Kartu" required></v-text-field>

                        <v-text-field v-model="form.NAMA_CREDIT_TRANSAKSI" label="Nama Pemilik Kredit" required></v-text-field>

                        <v-text-field v-model="form.KODE_VERIFIKASI_TRANSAKSI" label="Kode Verifikasi" required></v-text-field>
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="dialog = false">
                        Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="checkForm()">
                        Save
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
            dialog: false,
            error_message: '',
            color: '',
            snackbar: false,
            load: false,
            nomorMeja: null,
            mejaItems: [],
            selectedMejaID: '',
            jenisItems: ['Cash', 'Debit', 'Credit'],
            transaksiFormData: new FormData,
            form: {
                ID_PESANAN: null,
                ID_KARYAWAN: null,
                NOMOR_TRANSAKSI: null,
                TANGGAL_TRANSAKSI: null,
                WAKTU_TRANSAKSI: null,
                JENIS_PEMBAYARAN_TRANSAKSI: null,
                NOMOR_KARTU_TRANSAKSI: null,
                NAMA_CREDIT_TRANSAKSI: null,
                KODE_VERIFIKASI_TRANSAKSI: null,
            },
            pesanan: [],
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
            requiredRules: [
                v => !!v || 'This field is required'
            ],
        };
    },

    methods: {
        checkForm() {
            if(this.$refs.form.validate()) {
                this.bayar()
            }
        },
        getNomorMeja() {
            var url = this.$api + '/mejaBelumBayar'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('current_token')
                }
            }).then(response => {
                for(var i = 0; i < response.data.data.length; i++) {
                        this.mejaItems.push(response.data.data[i]);
                }
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
            })
        },
        getInfoByMeja(nomorMeja) {
            var url = this.$api + '/pembayaranInfo/' + nomorMeja;
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('current_token')
                }
            }).then(response => {
                this.pesanan = response.data.data
                this.readDataDetailPesanan(this.pesanan.ID_PESANAN);
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
                this.loading = false
            })
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
                })
                .catch((error) => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        bayar() {
            this.transaksiFormData.append('ID_PESANAN', this.pesanan.ID_PESANAN);
            this.transaksiFormData.append('ID_KARYAWAN', this.pesanan.ID_KARYAWAN);
            this.setTime()
            this.transaksiFormData.append('WAKTU_TRANSAKSI', this.form.WAKTU_TRANSAKSI);
            this.transaksiFormData.append('JENIS_PEMBAYARAN_TRANSAKSI', this.form.JENIS_PEMBAYARAN_TRANSAKSI);
            if(this.form.NOMOR_KARTU_TRANSAKSI != null)
                this.transaksiFormData.append('NOMOR_KARTU_TRANSAKSI', this.form.NOMOR_KARTU_TRANSAKSI);
            if(this.form.NAMA_CREDIT_TRANSAKSI != null)
                this.transaksiFormData.append('NAMA_CREDIT_TRANSAKSI', this.form.NAMA_CREDIT_TRANSAKSI);
            if(this.form.KODE_VERIFIKASI_TRANSAKSI != null)
                this.transaksiFormData.append('KODE_VERIFIKASI_TRANSAKSI', this.form.KODE_VERIFIKASI_TRANSAKSI);

            var url = this.$api + '/transaksi'
            this.load = true
            this.$http.post(url, this.transaksiFormData, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('current_token')
            }
            }).then(response => {
                this.setPesananLunas(this.pesanan.ID_PESANAN)
                this.setMejaKosong(this.pesanan.ID_MEJA)
                this.$router.push('/transaksi')
                this.error_message = response.data.message;
                this.color = "green"
                this.snackbar = true;
                this.load = false;
                this.dialog = false;
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
            })
        },
        setPesananLunas(idPesanan) {
            var url = this.$api + '/statusLunasPesanan/' + idPesanan
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
                this.dialog = false;
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
            })
        },
        setMejaKosong(idMeja) {
            var url = this.$api + '/mejaKosong/' + idMeja;
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('current_token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green"
                this.snackbar = true;
                this.load = false;
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
                this.loading = false
            })
        },
        setTime() {
            var currentdate = new Date(); 
            this.form.WAKTU_TRANSAKSI = currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds()
        },
    },

    mounted() {
        this.getNomorMeja();
    },
}
</script>

<style scoped>
ul {
    list-style-type: none; 
    text-align: center;
}
</style>
