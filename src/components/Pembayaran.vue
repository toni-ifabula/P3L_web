<template>
  <v-main class="list">
      <h3 class="text-h3 font-weight-medium mb-5"> Pembayaran </h3>

        <v-select
            v-model="nomorMeja"
            :items="mejaItems"
            label="Nomor Meja (Belum bayar)"
            v-on:change="getPesananByMeja(nomorMeja)"
        ></v-select>

        <v-row justify="center">
            <v-card class="justify-center" width="300px" v-if="nomorMeja != null">
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
                                <td><h5>Total</h5></td>
                                <td><h5>: {{ pesanan.TOTAL_PESANAN }}</h5></td>
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

        <v-dialog v-model="dialog">
            <v-card>
                <v-card-title>
                    <span class="headline">Data Transaksi</span>
                </v-card-title>
                <v-card-text>
                    <v-select
                        v-model="form.JENIS_PEMBAYARAN_TRANSAKSI"
                        :items="jenisItems"
                        label="Jenis Pembayaran"
                    ></v-select>

                    <v-select
                        v-model="form.JENIS_PEMBAYARAN_TRANSAKSI"
                        :items="jenisItems"
                        label="Jenis Pembayaran"
                    ></v-select>
                </v-card-text>
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
        };
    },

    methods: {
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
        getPesananByMeja(nomorMeja) {
            var url = this.$api + '/pesananByMeja/' + nomorMeja;
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('current_token')
                }
            }).then(response => {
                this.pesanan = response.data.data
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
                this.loading = false
            })
        }
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
