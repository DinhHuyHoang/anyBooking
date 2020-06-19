<template>
  <v-container fluid class="pa-0 mt-3" style="overflow: hidden;">
    <v-row no-gutters>
      <v-col class="pl-4" cols="12">
        <div class="headline text-uppercase">Danh sách đăng ký</div>
      </v-col>
      <v-col>
        <v-data-table
          :headers="computedHeaders"
          :items="listDangKy"
          :items-per-page="5"
          class="elevation-0"
          :search="search"
        >
          <template v-slot:top>
            <v-row
              class="justify-end justify-md-center align-center text-center px-5"
            >
              <v-text-field
                v-model="search"
                class="mx-2"
                placeholder="Tìm kiếm"
              ></v-text-field>

              <v-select
                v-model="tinhTrang"
                :items="listTinhTrang"
                item-text="GhiChu"
                item-value="TinhTrang"
                label="Tình trạng"
                class="mx-2"
              ></v-select>
            </v-row>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              v-if="item.TinhTrang === 1"
              text
              outlined
              @click="createOrEditItem({ type: 'edit', data: item })"
            >
              <v-icon small class="mr-2">
                mdi-pencil
              </v-icon>
              <span> Duyệt</span>
            </v-btn>

            <v-btn
              v-if="item.DuocSua"
              text
              outlined
              @click="createOrEditItem({ type: 'edit', data: item })"
            >
              <v-icon small class="mr-2">
                mdi-pencil
              </v-icon>
              <span> Sửa</span>
            </v-btn>
          </template>
          <template v-slot:item.SoDT="{ item }">
            <a :href="`tel:${item.SoDT}`">{{ item.SoDT }}</a>
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
                  <v-col cols="12">
                    <v-list id="listInfo">
                      <v-list-item class="pa-0">
                        <v-list-item-content>
                          <v-list-item-title
                            class="text-uppercase font-weight-bold"
                          >
                            {{ dangKy.PhongBanDK }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            <div class="block-info">
                              <div>
                                <strong>Số người:</strong>
                              </div>
                              <div>
                                {{ dangKy.SoNguoiDi }}
                              </div>
                            </div>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            <div class="block-info">
                              <div>
                                <strong>Ngày đi:</strong>
                              </div>
                              <div>
                                {{ dangKy.NgayDi }}
                              </div>
                            </div>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            <div class="block-info">
                              <div>
                                <strong>Ngày về:</strong>
                              </div>
                              <div>
                                {{ dangKy.NgayVe }}
                              </div>
                            </div>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            <div class="block-info">
                              <div>
                                <strong>Nơi đi:</strong>
                              </div>
                              <div>
                                {{ dangKy.DiemKhoiHanh }}
                              </div>
                            </div>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            <div class="block-info">
                              <div>
                                <strong>Nơi đến:</strong>
                              </div>
                              <div>
                                {{ dangKy.NoiDen }}
                              </div>
                            </div>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            <div class="block-info">
                              <div>
                                <strong>Lý do:</strong>
                              </div>
                              <div>
                                {{ dangKy.LyDoDi }}
                              </div>
                            </div>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-col>
                  <v-col>
                    <v-form ref="formCreateOrUpdate">
                      <v-textarea
                        v-if="state == 0"
                        v-model="ghiChu"
                        label="Ghi chú"
                        :rules="[rules.required]"
                        @input="dangKy['GhiChu'] = ghiChu"
                      ></v-textarea>
                      <v-radio-group
                        v-model="state"
                        :rules="[rules.required]"
                        @change="
                          value => {
                            dangKy['TinhTrang'] = Number(value);
                          }
                        "
                      >
                        <v-radio label="Không duyệt" value="0"></v-radio>
                        <v-radio label="Duyệt" value="2"></v-radio>
                        <v-radio label="Huỷ duyệt" value="1"></v-radio>
                      </v-radio-group>
                    </v-form>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                dark
                small
                @click="createOrUpdate(dangKy)"
              >
                Đồng ý
              </v-btn>
              <v-spacer></v-spacer>
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
    search: '',
    dialogCreateOrUpdate: false,
    dialogRemove: false,
    rules: {
      required: value => !!value || 'Không được bỏ trống trường này',
      maxLength: (max, value = '') =>
        (value && value.length <= max) || `Không được quá ${max} ký tự`,
    },
    headers: [
      { text: 'Thời gian đi', value: 'NgayDi' },
      { text: 'Thời gian về', value: 'NgayVe' },
      { text: 'Thời gian ĐK', value: 'NgayDK' },
      { text: 'Khởi hành', value: 'DiemKhoiHanh', width: '10%' },
      { text: 'Nơi đến', value: 'NoiDen', width: '15%' },
      { text: 'Lý do', value: 'LyDoDi', width: '15%' },
      { text: 'Người ĐK', value: 'NhanVienDK' },
      { text: 'Tình trạng', value: 'GhiChuTinhTrang' },
    ],
    listDangKy: [],
    listTinhTrang: [],
    tinhTrang: -1,
    ghiChu: null,
    state: '2',
    dangKy: {
      TinhTrang: 2,
    },
  }),

  computed: {
    computedHeaders() {
      if (this.tinhTrang === 3) {
        return [
          ...this.headers,
          { text: 'Xe', value: 'BienSo' },
          { text: 'Tài xế', value: 'HoTenTX' },
          { text: 'SĐT', value: 'SoDT' },
          { text: '', value: 'actions', sortable: false },
        ];
      }

      return [...this.headers, { text: '', value: 'actions', sortable: false }];
    },
  },

  watch: {
    tinhTrang(newVal) {
      this.getListDangKyByTinhTrang({ TinhTrang: newVal });
    },
  },

  created() {
    this.getListTinhTrang();
    this.getListDangKyByTinhTrang({ TinhTrang: this.tinhTrang });
  },

  methods: {
    async getListTinhTrang() {
      const { data } = await this.$axios(
        API.getListTinhTrangDangKy({ typeUser: 'quanLyDonVi' })
      );
      this.listTinhTrang = data;
    },

    async getListDangKyByTinhTrang(dangKy) {
      const { data } = await this.$axios(
        API.getListDangKyXeByTinhTrang({ dangKy, typeUser: 'quanLyDonVi' })
      );
      this.listDangKy = data;
    },

    createOrEditItem({ type, data = {} }) {
      const dangKy = {
        formTitle: type === 'create' ? 'Duyệt đăng ký' : 'Duyệt đăng ký',
        MaDK: type === 'create' ? 0 : undefined,
        ...data,
        TinhTrang: 2,
      };

      this.dangKy = dangKy;
      this.state = '2';
      this.dialogCreateOrUpdate = true;
    },

    async createOrUpdate(dangKy) {
      const { formCreateOrUpdate, SnackBar } = this.$refs;
      if (!formCreateOrUpdate.validate()) return;

      const { data } = await this.$axios(API.setTinhTrangDangKy({ dangKy }));

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
        formCreateOrUpdate.reset();
        this.dialogCreateOrUpdate = false;
        this.getListDangKyByTinhTrang({ TinhTrang: this.tinhTrang });
      }
    },
  },
};
</script>

<style>
#listInfo .v-list-item__subtitle {
  white-space: normal;
}
</style>
