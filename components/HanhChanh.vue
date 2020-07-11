<template>
  <v-container fluid class="pa-0 mt-3" style="overflow: hidden;">
    <v-row no-gutters="">
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
              v-if="item.TinhTrang === 2"
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
              <span>Duyệt</span>
            </v-btn>
            <v-btn
              v-if="item.DuocSua"
              text
              outlined
              small
              @click="
                createOrEditItem({
                  type: 'edit',
                  data: item,
                  isInitWithData: true,
                })
              "
            >
              <v-icon small class="mr-2">
                mdi-pencil
              </v-icon>
              <span>Sửa</span>
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
                      <v-select
                        v-if="state === '3'"
                        v-model="xe"
                        :items="listXe"
                        item-text="text"
                        return-object
                        label="Xe"
                        :rules="[rules.required]"
                        @change="
                          () => {
                            dangKy['XeID'] = xe.XeID;
                          }
                        "
                      ></v-select>
                      <v-select
                        v-if="state === '3'"
                        v-model="taiXe"
                        :items="listTaiXe"
                        item-text="HoTenTX"
                        return-object
                        label="Tài xế"
                        :rules="[rules.required]"
                        @change="
                          () => {
                            dangKy['TaiXeID'] = taiXe.TaiXeID;
                          }
                        "
                      ></v-select>
                      <v-textarea
                        v-model="ghiChu"
                        label="Ghi chú"
                        :rules="[state == 3 ? true : rules.required]"
                        @input="dangKy['GhiChu'] = ghiChu"
                      ></v-textarea>
                      <v-radio-group
                        v-model="state"
                        :rules="[rules.required]"
                        @change="
                          () => {
                            dangKy['TinhTrang'] = Number(state);
                            dangKy['TaiXeID'] = 0;
                            dangKy['XeID'] = 0;
                          }
                        "
                      >
                        <v-radio label="Không cấp xe" value="4"></v-radio>
                        <v-radio label="Cấp xe" value="3"></v-radio>
                      </v-radio-group>
                    </v-form>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" dark @click="createOrUpdate(dangKy)"
                >Đồng ý</v-btn
              >
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
import getPdfConfig from '~/config/pdfmake';

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
      { text: 'Phòng ban', value: 'PhongBanDK' },
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
    tinhTrang: 2,
    ghiChu: null,
    state: '3',
    listXe: [],
    listTaiXe: [],
    taiXe: null,
    xe: null,
    dangKy: {
      TinhTrang: 3,
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
      this.getListDangKyByTinhTrang({ TinhTrang: this.tinhTrang });
    },
    xe(newVal) {
      if (!newVal) return;
      if (newVal?.isSyncWithTaiXe === false) return;

      this.taiXe = this.listTaiXe.find(
        taiXe => taiXe.TaiXeID === newVal?.TaiXeID
      );
      this.dangKy.TaiXeID = this.taiXe.TaiXeID;
    },
  },

  created() {
    this.getListTinhTrang();
    this.getListDangKyByTinhTrang({ TinhTrang: this.tinhTrang });
    this.getListXe();
    this.getListTaiXe();
  },

  methods: {
    initialize(isInitWithData, data = {}) {
      this.state = '3';
      if (!isInitWithData) {
        this.ghiChu = null;
        this.taiXe = null;
        this.xe = null;
      } else {
        this.taiXe = this.listTaiXe.find(
          taiXe => data.TaiXeID === taiXe.TaiXeID
        );

        this.xe = {
          ...this.listXe.find(xe => data.XeID === xe.XeID),
          isSyncWithTaiXe: false,
        };
        this.ghiChu = data.GhiChu;
      }
    },

    async getListXe() {
      const { data } = await this.$axios(API.getListXe(1));
      data.map(item => {
        item.text = `Biển số: ${item.BienSo} - số chổ: ${item.SoCho}`;
      });
      this.listXe = data;
    },

    async getListTaiXe() {
      const { data } = await this.$axios(API.getListTaiXe());
      this.listTaiXe = data;
    },

    async getListTinhTrang() {
      const { data } = await this.$axios(
        API.getListTinhTrangDangKy({ typeUser: 'admin' })
      );
      this.listTinhTrang = data;
    },

    async getListDangKyByTinhTrang(dangKy) {
      const { data } = await this.$axios(
        API.getListDangKyXeByTinhTrang({ dangKy, typeUser: 'admin' })
      );
      this.listDangKy = data;
    },

    createOrEditItem({ type, data = {}, isInitWithData = false }) {
      const dangKy = {
        formTitle: type === 'create' ? 'Duyệt đăng ký' : 'Duyệt đăng ký',
        MaDK: type === 'create' ? 0 : undefined,
        ...data,
        TinhTrang: 3,
      };

      this.initialize(isInitWithData, data);
      this.dangKy = dangKy;
      this.dialogCreateOrUpdate = true;
    },

    async createOrUpdate(dangKy) {
      const { formCreateOrUpdate, SnackBar } = this.$refs;
      if (!formCreateOrUpdate.validate()) return;

      const { data } = await this.$axios(
        API.setTinhTrangDangKyHanhChanh({ dangKy })
      );

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
        formCreateOrUpdate.reset();
        this.getListDangKyByTinhTrang({ TinhTrang: this.tinhTrang });
      }
    },

    async openReport() {
      const { data } = await this.$axios(
        API.getReportByDonVi({ donVi: 'irc' })
      );

      // eslint-disable-next-line prefer-const
      let dataTables = [];
      let i = 0;
      for (const row of data) {
        const { NgayDi, NgayVe, NoiDen, LyDoDi, TenNV } = row;
        dataTables.push([i, 'irc', NgayDi, NgayVe, NoiDen, LyDoDi, TenNV]);
        i++;
      }

      this.$pdfMake
        .createPdf(getPdfConfig({ donVi: 'Đơn vị test chơi', dataTables }))
        .open();
    },
  },
};
</script>

<style>
#listInfo .v-list-item__subtitle {
  white-space: normal;
}
</style>
