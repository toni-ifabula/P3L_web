<template>
    <v-main class="list">
        <h3 class="text-h3 font-weight-medium mb-5"> Profile </h3>

        <v-card>
            <v-container>
                <v-text-field label="ID Karyawan" v-model="id" outlined readonly></v-text-field>
                <v-text-field label="Role" v-model="role" outlined readonly></v-text-field>
                <v-text-field label="Nama" v-model="nama" outlined readonly></v-text-field>
                <v-text-field label="Jenis Kelamin" v-model="jenisKelamin" outlined readonly></v-text-field>
                <v-text-field label="Nomor Telepon" v-model="telepon" outlined readonly></v-text-field>
                <v-text-field label="Email" v-model="email" outlined readonly></v-text-field>
                <v-text-field label="Tanggal Gabung" v-model="tanggal" outlined readonly></v-text-field>
                <v-text-field label="Status" v-model="status" outlined readonly></v-text-field>

            </v-container>
        </v-card>

    </v-main>
</template>

<script>
export default {
    name: "Profile",
    data() {
        return {
            id: null,
            role: null,
            nama: null,
            jenisKelamin: null,
            telepon: null,
            email: null,
            tanggal: null,
            status: null,
        };
    },

    methods: {
        readData() {
            var url = this.$api + '/user'
            this.$http.get(url, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('current_token')
                }
            }).then(response => {
                this.id = response.data.ID_KARYAWAN
                this.role = response.data.ID_ROLE
                if(response.data.ID_ROLE == 1)
                    this.role = 'Owner'
                else if(response.data.ID_ROLE == 2)
                    this.role = 'Ops Manager'
                else if(response.data.ID_ROLE == 3)
                    this.role = 'Waiter'
                else if(response.data.ID_ROLE == 4)
                    this.role = 'Cashier'
                else if(response.data.ID_ROLE == 5)
                    this.role = 'Chef'
                this.nama = response.data.NAMA_KARYAWAN
                this.jenisKelamin = response.data.JENIS_KELAMIN_KARYAWAN
                this.telepon = response.data.TELEPON_KARYAWAN
                this.email = response.data.email
                this.tanggal = response.data.TANGGAL_GABUNG_KARYAWAN
                this.status = response.data.STATUS_KARYAWAN
            })
        }        
    },

    mounted() {
        this.readData();
    },
}
</script>