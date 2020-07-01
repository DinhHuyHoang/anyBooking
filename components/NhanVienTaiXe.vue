<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters="">
      <v-col>
        <v-data-table
          :headers="headers"
          :items="listLichTrinhTaiXe"
          :items-per-page="5"
          class="elevation-0"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Lịch trình tài xế</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-select
                v-model="taiXe"
                item-value="TaiXeID"
                item-text="HoTenTX"
                :items="listTaiXe"
                placeholder="Tài xế"
                class="mx-2"
              ></v-select>
              <v-select
                v-model="tinhTrang"
                class="mx-2"
                :items="listTinhTrang"
                placeholder="Tình trạng"
                item-text="GhiChu"
                item-value="TinhTrang"
              ></v-select>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              v-if="item.XacNhan === false"
              text
              outlined
              small
              @click="
                createOrEditItem({
                  type: 'edit',
                  data: item,
                  isInitWithData: false,
                })
              "
            >
              <v-icon small class="mr-2">
                mdi-pencil
              </v-icon>
              <span>Xác nhận</span>
            </v-btn>
          </template>
        </v-data-table>

        <!-- ************************************ Dialog ************************************ -->

        <v-dialog v-model="dialogCreateOrUpdate" max-width="500px">
          <v-card v-if="Object.keys(dangKy).length">
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialogCreateOrUpdate = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ dangKy.formTitle }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <p v-html="dangKy.messageConfirm"></p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="createOrUpdate(dangKy)">
                Đồng ý
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <SnackBar ref="SnackBar" />
  </v-container>
</template>
<script>
import API from '~/config/api';
import SnackBar from '~/components/SnackBar';

export default {
  components: {
    SnackBar,
  },
  data: () => ({
    dialogCreateOrUpdate: false,
    dialogRemove: false,
    rules: {
      required: value => !!value || 'Không được bỏ trống trường này',
    },
    headers: [
      { text: 'Đơn vị', value: 'TenPhongBan' },
      { text: 'Ngày đi', value: 'NgayDi' },
      { text: 'Ngày về', value: 'NgayVe' },
      { text: 'Khởi hành', value: 'DiemKhoiHanh', width: '20%' },
      { text: 'Nơi đến', value: 'NoiDen', width: '20%' },
      { text: 'Lý do', value: 'LyDoDi', width: '20%' },
      { text: 'Tình trạng', value: 'GhiChuXacNhan' },
      { text: '', value: 'actions', sortable: false },
    ],
    listLichTrinhTaiXe: [],
    listTaiXe: [],
    taiXe: null,
    listTinhTrang: [],
    tinhTrang: null,
    dangKy: {},
  }),

  watch: {
    tinhTrang() {
      if (this.tinhTrang !== null && this.taiXe !== null) {
        this.getListLichTrinh({
          id: this.taiXe,
          tinhTrang: this.tinhTrang,
        });
      }
    },

    taiXe() {
      if (this.tinhTrang !== null && this.taiXe !== null) {
        this.getListLichTrinh({
          id: this.taiXe,
          tinhTrang: this.tinhTrang,
        });
      }
    },
  },

  created() {
    this.getListNhanVienTaiXe();
    this.getListTinhTrangNhanVienTaiXe();
  },
  methods: {
    async getListNhanVienTaiXe() {
      const { data } = await this.$axios(API.getListNhanVienTaiXe());
      this.listTaiXe = data;
    },

    async getListTinhTrangNhanVienTaiXe() {
      const { data } = await this.$axios(API.getListTinhTrangNhanVienTaiXe());
      this.listTinhTrang = data;
    },

    async getListLichTrinh({ id, tinhTrang }) {
      const { data } = await this.$axios(
        API.getLichTrinhTaiXe({ id, tinhTrang })
      );
      this.listLichTrinhTaiXe = data;
    },

    createOrEditItem({ type, data = {} }) {
      const dangKy = {
        formTitle:
          type === 'create' ? 'Xác nhận lịch trình' : 'Xác nhận lịch trình',
        messageConfirm: `Bạn chắc chắn xác nhận chuyến đi ngày "${data.NgayDi}" <br /><br /> <strong>Khởi hành từ:</strong> "${data.DiemKhoiHanh}" <br />  <strong>Đi đến: </strong> "${data.NoiDen}"`,
        ...data,
      };

      this.dangKy = dangKy;
      this.dialogCreateOrUpdate = true;
    },

    async createOrUpdate(dangKy) {
      const { SnackBar } = this.$refs;
      const { data } = await this.$axios(API.confirmLichTrinh({ dangKy }));

      if (data?.error && data?.error) {
        const { message } = data;
        SnackBar.notify({
          type: 'error',
          message,
        });
      } else {
        const { message } = data;
        SnackBar.notify({
          type: 'success',
          timeout: 1000,
          message,
        });
        this.dialogCreateOrUpdate = false;
        this.getListLichTrinh();
      }
    },
  },
};
</script>
