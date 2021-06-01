<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Laporan </h3>

        <v-select
            v-model="tipe"
            :items="tipeItems"
            label="Tipe"
        ></v-select>

        <v-text-field
            v-if = "tipe == 'Tahunan'"
            v-model="tahunAwal" 
            label="Tahun Awal"
        ></v-text-field>

        <v-text-field
            v-if = "tipe == 'Tahunan'"
            v-model="tahunAkhir" 
            label="Tahun Akhir"
        ></v-text-field>

        <v-text-field
            v-if = "tipe == 'Bulanan'"
            v-model="tahun" 
            label="Tahun"
        ></v-text-field>

        <v-btn color="success" dark @click="showLaporan()">
            Sumbit
          </v-btn>
    </v-main>
</template>

<script>
export default {
    data() {
        return {
            tipe: '',
            tahun: '',
            tipeItems: ['Bulanan', 'Tahunan'],

        }
    },

    methods: {
        showLaporan() {

        }
    }

}
</script>