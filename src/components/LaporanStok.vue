<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Laporan Stok</h3>

        <v-select 
            v-model="namaStok" 
            :items="stokItems" 
            label="Nama Item">
        </v-select>

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
            v-if="namaStok != null && tahun != null && bulan != null"
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
                    <h6 style="text-align: center; color: black">Laporan Penjualan Stok Bahan</h6>
                    <p class="font1">ITEM MENU : {{ namaStok }}</p>
                    <p class="font1">PERIODE : {{ bulan }} {{ tahun }}</p>
                    <p class="fontBottom mt-1 mb-1">
                        -------------------------------------------------------------------------------
                    </p>
                    <v-data-table
                        :hide-default-footer="true"
                        :headers="headers"
                        :items="stokBahan"
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
            namaStok: null,
            stokItems: [],
            tahun: null,
            bulan: null,
            bulanItems: ["1", "2", "3", "4", "5", "6",
                "7", "8", "9", "10", "11", "12"
            ],
            stokBahan: [],
            headers: [
                {
                    text: "Tanggal Masuk",
                    value: "TANGGAL_MASUK_STOK"
                },
                {
                    text: "Unit",
                    value: "UNIT_STOK"
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
            ]
        }
    },

    methods: {
        showLaporan() {
            this.getDateTimePrinter()
            this.getLaporanStokPerBulan(this.namaStok, this.tahun, this.bulan)
            this.dialog = true
        },
        getNamaStok() {
            var url = this.$api + '/stokBahan'
            this.$http.get(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('current_token')
            }
            }).then(response => {
                for(var i=0; i<response.data.data.length; i++)
                    this.stokItems.push(response.data.data[i].NAMA_STOK)
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
            })
        },
        getLaporanStokPerBulan(namaStok, tahun, bulan) {
            var url = this.$api + "/laporanStokPerBulan/" + namaStok + "/" + tahun + "/" + bulan;
            this.$http
                .get(url, {
                    headers: {
                        Authorization:
                            "Bearer " + localStorage.getItem("current_token"),
                    },
                })
                .then((response) => {
                    this.stokBahan = response.data.data;
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
                filename: "Laporan Stok Bahan.pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { dpi: 192, letterRendering: true },
                jsPDF: { unit: "in", format: "a4", orientation: "p" },
            });
        },
    },

    mounted() {
        this.getNamaStok()
    }
}
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