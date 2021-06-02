<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Laporan </h3>

        <v-tabs
            v-model="tab"
            background-color="#D34841"
            dark
            centered
        >
            <v-tab
                v-for="item in itemTabs"
                :key="item"
            >
                {{ item }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <!-- LAPORAN STOK -->
            <v-tab-item>
                <p>asd</p>
            </v-tab-item>

            <!-- LAPORAN PENJUALAN -->
            <v-tab-item>
                <v-text-field
                    v-model="tahun" 
                    label="Tahun"
                ></v-text-field>

                <v-text-field
                    v-model="bulan" 
                    label="Bulan"
                ></v-text-field>

                <v-btn color="success" dark @click="showLaporanPenjualan()">
                    Submit
                </v-btn>
            </v-tab-item>

            <!-- LAPORAN PENDAPATAN -->
            <v-tab-item>
                <v-select
                    v-model="tipePendapatan"
                    :items="tipePendapatanItems"
                    label="Tipe"
                ></v-select>
                
                <v-text-field
                    v-if="tipePendapatan == 'Bulanan'"
                    v-model="tahunPendapatan" 
                    label="Tahun"
                ></v-text-field>

                <v-text-field
                    v-if="tipePendapatan == 'Tahunan'"
                    v-model="tahunAwalPendapatan" 
                    label="Tahun Awal"
                ></v-text-field>

                <v-text-field
                    v-if="tipePendapatan == 'Tahunan'"
                    v-model="tahunAkhirPendapatan" 
                    label="Tahun Akhir"
                ></v-text-field>

                <v-btn color="success" dark @click="showLaporanPendapatan()">
                    Submit
                </v-btn>
                
                <table class="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Bulan</th>
                        <th>Makanan</th>
                        <th>Side Dish</th>
                        <th>Minuman</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in pendapatan" :key="item">
                        <td>{{item.month}}</td>
                        <td>{{item.email}}</td>
                        <td>{{user.role}}</td>
                    </tr>
                </tbody>
            </table>
            </v-tab-item>

            <!-- LAPORAN PENGELUARAN -->
            <v-tab-item>
                <p>asd</p>
            </v-tab-item>
        </v-tabs-items>

        <v-dialog v-model="dialogLaporanPenjualan" max-width="650px">
            <v-card>
                <v-card-text>
                    <div style="float: right; width: 400px">
                            <h1 style="text-align: center; font-weight: bold">ATMA KOREAN BBQ</h1>
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
                            -------------------------------------------------------------------------------
                        </p>
                        <p class="font1">
                            Tahun : {{ tahun }}
                        </p>
                        <p class="font1">
                            Bulan : {{ bulan }}
                        </p>
                        <p class="fontBottom mt-1 mb-1">
                            -------------------------------------------------------------------------------
                        </p>
                        <p class="font1">
                            Makanan
                        </p>
                        <v-data-table
                            :hide-default-footer="true"
                            :headers="headers"
                            :items="itemMakanan"
                        >
                        </v-data-table>
                        <p class="fontBottom mt-1 mb-1">
                            -------------------------------------------------------------------------------
                        </p>
                        <p class="font1">
                            Side Dish
                        </p>
                        <v-data-table
                            :hide-default-footer="true"
                            :headers="headers"
                            :items="itemSideDish"
                        >
                        </v-data-table>
                        <p class="fontBottom mt-1 mb-1">
                            -------------------------------------------------------------------------------
                        </p>
                        <p class="font1">
                            Minuman
                        </p>
                        <v-data-table
                            :hide-default-footer="true"
                            :headers="headers"
                            :items="itemMinuman"
                        >
                        </v-data-table>
                        <p class="fontBottom mt-1 mb-1">
                            -------------------------------------------------------------------------------
                        </p>

                        <p class="fontBottom">
                            Printed {{ dateTime }}
                        </p>
                        <p class="fontBottom">
                            Printed By {{ printer }}
                        </p>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" dark @click="dialogLaporanPenjualan = false">
                        Close
                    </v-btn>
                    <v-btn color="green darken-1" dark @click="printStruk('printableArea')">
                        Print
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogLaporanPendapatan" max-width="650px">
            <v-data-table
                :hide-default-footer="true"
                :headers="headersTest"
                :items="pendapatan"
            >
            </v-data-table>
        </v-dialog>

    </v-main>
</template>

<script>
export default {
    data() {
        return {
            tab: null,
            itemTabs: [
                'Laporan Stok',
                'Laporan Penjualan',
                'Laporan Pendapatan',
                'Laporan Pengeluaran',
            ],
            dateTime: '',
            printer: '',
            dialogLaporanPenjualan: false,
            tipe: '',
            tahun: '',
            bulan: '',

            tipePendapatan: '',
            tipePendapatanItems: ['Bulanan', 'Tahunan'],
            tahunPendapatan: '',
            tahunAwalPendapatan: '',
            tahunAkhirPendapatan: '',
            itemMakanan: [],
            itemSideDish: [],
            itemMinuman: [],
            headers: [
                {
                    text: "Item Menu",
                    value: "NAMA_MENU",
                },
                {
                    text: "Unit",
                    value: "UNIT_MENU",
                },
                {
                    text: "Penjualan Harian Tertinggi",
                    value: "NAMA_MENU",
                },
                {
                    text: "Total Penjualan",
                    value: "NAMA_MENU",
                },
            ],
            pendapatan: [],
            headersTest: [
                {
                    text: "Bulan",
                    value: "month"
                },
                {
                    text: "Subtotal",
                    value: "subtotal"
                },
            ]
        }
    },

    methods: {
        showLaporanPenjualan() {
            this.getCurrentTime()
            this.getPrinter()
            this.dialogLaporanPenjualan = true;
        },
        getCurrentTime() {
            var currentdate = new Date(); 
            this.dateTime = currentdate.getDate() + "/"
                            + (currentdate.getMonth()+1)  + "/" 
                            + currentdate.getFullYear() + " @ "
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds();
        },
        getPrinter() {
            this.printer = localStorage.getItem("current_nama")
        },
        getLaporanPendapatanBulanan(tahun) {
            var url = this.$api + '/laporanPendapatanBulanan/' + tahun
            this.$http.get(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('current_token')
            }
            }).then(response => {
                this.pendapatan = response.data.data
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
            })
        }
    },

    mounted() {
        this.getLaporanPendapatanBulanan('2021')
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