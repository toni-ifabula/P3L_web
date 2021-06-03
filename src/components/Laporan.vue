<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Laporan </h3>

        <v-btn class="success" to="/laporanStok">Laporan Stok</v-btn>
        <v-btn class="success" to="/laporanPenjualan">Laporan Penjualan</v-btn>
        <v-btn class="success" to="/laporanPendapatan">Laporan Pendapatan</v-btn>
        <v-btn class="success" to="/laporanPengeluaran">Laporan Pengeluaran</v-btn>

    </v-main>
</template>

<script>
export default {

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