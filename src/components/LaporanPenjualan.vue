<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Laporan Penjualan</h3>

        <v-text-field
            v-model="tahun"
            label="Tahun"
        ></v-text-field>

        <v-select 
            v-model="bulan" 
            :items="bulanItems" 
            label="Bulan">
        </v-select>

        <v-btn 
            v-if="tahun != null && bulan != null"
            color="success"
            @click="showLaporan()"
        >Submit 
        </v-btn>

        <v-dialog v-model="dialog" max-width="650px">
            <v-card>
                <v-card-text ref="document">
                    <div style="float: right; width: 400px">
                        <h1 style="text-align: center; font-weight: bold">
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
                    <h6 style="text-align: center; color: black">Laporan Penjualan Item Menu</h6>
                    <p class="font1">Tahun : {{ tahun }}</p>
                    <p class="font1">Bulan : {{ bulan }}</p>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <h5 style="color: black">Makanan</h5>
                    <v-data-table
                        :hide-default-footer="true"
                        :headers="headers"
                        :items="utama"
                    >
                    </v-data-table>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <h5 style="color: black">Side Dish</h5>
                    <v-data-table
                        :hide-default-footer="true"
                        :headers="headers"
                        :items="sideDish"
                    >
                    </v-data-table>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <h5 style="color: black">Minuman</h5>
                    <v-data-table
                        :hide-default-footer="true"
                        :headers="headers"
                        :items="minuman"
                    >
                    </v-data-table>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>

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
            tahun: null,
            bulan: null,
            bulanItems: ["All", "1", "2", "3", "4", "5", "6",
                "7", "8", "9", "10", "11", "12"
            ],
            utama: [],
            sideDish: [],
            minuman: [],
            headers: [
                {
                    text: "Item Menu",
                    value: "NAMA_MENU"
                },
                {
                    text: "Unit",
                    value: "UNIT_MENU"
                },
                {
                    text: "Penjualan Harian Tertinggi",
                    value: "max"
                },
                {
                    text: "Total Penjualan",
                    value: "total"
                },
            ],
            dateTime: '',
            namaPrinter: '',
        }
    },

    methods: {
        showLaporan() {
            this.getDateTimePrinter()
            if(this.bulan == 'All') {
                this.getPenjualanSetahun(this.tahun)
                this.dialog = true;
            } else {
                this.getPenjualanPerBulan(this.tahun, this.bulan)
                this.dialog = true;
            }
        },
        getPenjualanPerBulan(tahun, bulan) {
            var url = this.$api + "/laporanPenjualanPerBulan/" + tahun + "/" + bulan;
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
                })
                .catch((error) => {
                    this.error_message = error.response.data.message;
                    this.color = "red";
                    this.snackbar = true;
                    this.load = false;
                });
        },
        getPenjualanSetahun(tahun) {
            var url = this.$api + "/laporanPenjualanSetahun/" + tahun;
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
                filename: "Laporan Penjualan.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { dpi: 192, letterRendering: true },
                jsPDF: { unit: "in", format: "a4", orientation: "p" },
            });
        },
    }
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