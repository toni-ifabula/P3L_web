<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Laporan Pendapatan </h3>

        <v-select 
            v-model="tipe" 
            :items="tipeItems" 
            label="Tipe">
        </v-select>

        <v-text-field
            v-if="tipe == 'Bulanan'"
            v-model="tahun"
            label="Tahun"
        ></v-text-field>

        <v-text-field
            v-if="tipe == 'Tahunan'"
            v-model="tahunAwal"
            label="Tahun Awal"
        ></v-text-field>

        <v-text-field
            v-if="tipe == 'Tahunan'"
            v-model="tahunAkhir"
            label="Tahun Akhir"
        ></v-text-field>

        <v-btn 
            v-if="tahun != null || (tahunAwal != null && tahunAkhir != null)"
            color="success"
            @click="showLaporan()"
        >Submit 
        </v-btn>

        <v-dialog v-model="dialog" max-width="650px">
            <v-card>
                <v-card-text ref="document">
                    <div style="float: right; width: 400px">
                        <h1 style="text-align: center; font-weight: bold; color: black;">
                            ATMA KOREAN BBQ
                        </h1>
                        <h6 style="text-align: center; color: red">
                            FUN PLACE TO GRILL!
                        </h6>
                        <h6 style="text-align: center">
                            Jl. Babarsari No. 43 Yogyakarta
                        </h6>
                        <h6 style="text-align: center">552181</h6>
                        <h6 style="text-align: center">Telp. (0274) 487711</h6>
                    </div>
                    <v-img
                        :src="require('@/assets/logo_toko2.png')"
                        max-width="200"
                        style="display: block"
                    />
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <h6 v-if="currentTipe == 'Bulanan'" style="text-align: center; color: black">Laporan Pendapatan Bulanan</h6>
                    <h6 v-if="currentTipe == 'Tahunan'" style="text-align: center; color: black">Laporan Pendapatan Tahunan</h6>
                    <p v-if="currentTipe == 'Bulanan'" class="font1">Tahun : {{ tahun }}</p>
                    <p v-if="currentTipe == 'Tahunan'" class="font1">Tahun : {{ tahunAwal }} s/d {{ tahunAkhir }}</p>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <h5 style="color: black">Makanan</h5>
                    <v-data-table
                        v-if="currentTipe == 'Bulanan'"
                        :hide-default-footer="true"
                        :headers="headersBulanan"
                        :items="utama"
                    >
                    </v-data-table>
                    <v-data-table
                        v-if="currentTipe == 'Tahunan'"
                        :hide-default-footer="true"
                        :headers="headersTahunan"
                        :items="utama"
                    >
                    </v-data-table>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <br>
                    <h5 style="color: black">Side Dish</h5>
                    <v-data-table
                        v-if="currentTipe == 'Bulanan'"
                        :hide-default-footer="true"
                        :headers="headersBulanan"
                        :items="sideDish"
                    >
                    </v-data-table>
                    <v-data-table
                        v-if="currentTipe == 'Tahunan'"
                        :hide-default-footer="true"
                        :headers="headersTahunan"
                        :items="sideDish"
                    >
                    </v-data-table>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <br>
                    <h5 style="color: black">Minuman</h5>
                    <v-data-table
                        v-if="currentTipe == 'Bulanan'"
                        :hide-default-footer="true"
                        :headers="headersBulanan"
                        :items="minuman"
                    >
                    </v-data-table>
                    <v-data-table
                        v-if="currentTipe == 'Tahunan'"
                        :hide-default-footer="true"
                        :headers="headersTahunan"
                        :items="minuman"
                    >
                    </v-data-table>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <br>
                    <h5 style="color: black">Total Pendapatan Tahun {{ tahun }}</h5>
                    <v-data-table
                        v-if="currentTipe == 'Bulanan'"
                        :hide-default-footer="true"
                        :headers="headersBulanan"
                        :items="totalPendapatanBulanan"
                    >
                    </v-data-table>
                    <v-data-table
                        v-if="currentTipe == 'Tahunan'"
                        :hide-default-footer="true"
                        :headers="headersTahunan"
                        :items="totalPendapatanTahunan"
                    >
                    </v-data-table>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <br>
                    <p class="fontBottom">Printed {{ dateTime }}</p>
                    <p class="fontBottom">Printed By {{ namaPrinter }}</p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="red darken-1"
                        dark
                        @click="dialog = false"
                    >
                        Close
                    </v-btn>
                    <v-btn
                        color="green darken-1"
                        dark
                        @click="print()"
                    >
                        Print
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>
            {{ error_message }}
        </v-snackbar>
    </v-main>
</template>

<script>
import html2pdf from 'html2pdf.js'

export default {
    data() {
        return {
            load: false,
            snackbar: false,
            error_message: "",
            color: "",
            dialog: false,
            tipe: null,
            tipeItems: ["Bulanan", "Tahunan"],
            currentTipe: '',
            tahun: null,
            tahunAwal: null,
            tahunAkhir: null,
            utama: [],
            sideDish: [],
            minuman: [],
            totalPendapatanBulanan: [],
            headersBulanan: [
                {
                    text: "Bulan",
                    value: "month",
                },
                {
                    text: "Subtotal (Rp)",
                    value: "subtotal",
                },
            ],
            totalPendapatanTahunan: [],
            headersTahunan: [
                {
                    text: "Tahun",
                    value: "year",
                },
                {
                    text: "Subtotal",
                    value: "subtotal",
                },
            ],
            dateTime: '',
            namaPrinter: '',
        };
    },

    methods: {
        showLaporan() {
            this.getDateTimePrinter()
            if (this.tipe == "Bulanan") {
                this.currentTipe = "Bulanan"
                this.getPendapatanBulanan(this.tahun);
                this.dialog = true;
            } else if(this.tipe == "Tahunan") {
                this.currentTipe = "Tahunan"
                this.getPendapatanTahunan(this.tahunAwal, this.tahunAkhir)
                this.dialog = true;
            }
        },
        getPendapatanBulanan(tahun) {
            var url = this.$api + "/laporanPendapatanBulanan/" + tahun;
            this.$http
                .get(url, {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("current_token"),
                    },
                })
                .then((response) => {
                    this.utama = response.data.utama;
                    this.sideDish = response.data.sideDish;
                    this.minuman = response.data.minuman;
                    this.totalPendapatanBulanan = response.data.total;
                })
                .catch((error) => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        getPendapatanTahunan(tahunAwal, tahunAkhir) {
            var url = this.$api + "/laporanPendapatanTahunan/" + tahunAwal + "/" + tahunAkhir;
            this.$http
                .get(url, {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("current_token"),
                    },
                })
                .then((response) => {
                    this.utama = response.data.utama;
                    this.sideDish = response.data.sideDish;
                    this.minuman = response.data.minuman;
                    this.totalPendapatanTahunan = response.data.total;
                })
                .catch((error) => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        getDateTimePrinter() {
            var currentdate = new Date(); 
            this.dateTime = currentdate.getDate() + "/"
                            + (currentdate.getMonth()+1)  + "/" 
                            + currentdate.getFullYear() + " @ "
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds();

            this.namaPrinter = localStorage.getItem("current_nama");
        },
        print() {
            html2pdf(this.$refs.document, {
                margin: [0,0,0,0],
                filename: "Laporan Pendapatan.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { dpi: 192, letterRendering: true },
                jsPDF: { unit: "in", format: "a4", orientation: "p" },
            });
        },
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
    font-size: 15px;
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
    font-size: 15px;
    color: black;
    text-align: center;
}
</style>