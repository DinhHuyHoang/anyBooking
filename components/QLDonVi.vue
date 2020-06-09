<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="listDangKy"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Danh sách đăng ký</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-select
                v-model="tinhTrang"
                :items="listTinhTrang"
                item-text="GhiChu"
                item-value="TinhTrang"
                label="Tình trạng"
                @input="dangKy['TinhTrang'] = tinhTrang"
              ></v-select>
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
                          <v-form ref="formCreateOrUpdate">
                            <v-textarea
                              v-if="Number(state) === 0"
                              v-model="ghiChu"
                              label="Ghi chú"
                              :rules="[rules.required]"
                              @input="dangKy['GhiChu'] = ghiChu"
                            ></v-textarea>
                            <v-radio-group
                              v-model="state"
                              :rules="[rules.required]"
                              @change="dangKy['TinhTrang'] = Number(state)"
                            >
                              <v-radio label="Không duyệt" value="0"></v-radio>
                              <v-radio label="Duyệt" value="2"></v-radio>
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
                      @click="createOrUpdate(dangKy)"
                    >
                      Đồng ý
                    </v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogRemove" max-width="500px">
                <v-card v-if="Object.keys(dangKy).length">
                  <v-card-title class="pa-0">
                    <v-alert width="100%" type="error">
                      <span class="headline">{{ dangKy.formTitle }}</span>
                    </v-alert>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col>
                          <div>{{ dangKy.message }}</div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="remove(dangKy)">
                      Đồng ý
                    </v-btn>
                    <v-btn
                      dark=""
                      color="red darken-1"
                      text
                      @click="dialogRemove = false"
                    >
                      Đóng
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <span @click="createOrEditItem({ type: 'edit', data: item })">
              <v-icon v-if="item.TinhTrang === 1" small class="mr-2">
                mdi-pencil
              </v-icon>
              <span> Duyệt</span>
            </span>
          </template>
        </v-data-table>
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
      maxLength: (max, value = '') =>
        (value && value.length <= max) || `Không được quá ${max} ký tự`,
    },
    headers: [
      { text: 'Thời gian đi', value: 'NgayDi' },
      { text: 'Thời gian về', value: 'NgayVe' },
      { text: 'Thời gian ĐK', value: 'NgayDK' },
      { text: 'Người ĐK', value: 'NhanVienDK' },
      { text: 'Số chổ', value: 'SoCho' },
      { text: 'Lý do', value: 'LyDoDi' },
      { text: 'Tình trạng', value: 'GhiChuTinhTrang' },
      { text: '', value: 'actions', sortable: false },
    ],
    listDangKy: [],
    listTinhTrang: [],
    tinhTrang: null,
    ghiChu: null,
    state: null,
    dangKy: {},
  }),

  watch: {
    tinhTrang(newVal) {
      this.getListDangKyByTinhTrang(this.dangKy);
    },
  },

  created() {
    this.getListTinhTrang();
  },

  methods: {
    async getListTinhTrang() {
      const { data } = await this.$axios(API.getListTinhTrangDangKy());
      this.listTinhTrang = data;
    },

    async getListDangKyByTinhTrang(dangKy) {
      const { data } = await this.$axios(
        API.getListDangKyXeByTinhTrang({ dangKy })
      );
      this.listDangKy = data;
    },

    createOrEditItem({ type, data = {} }) {
      const dangKy = {
        formTitle: type === 'create' ? 'Duyệt đăng ký' : 'Duyệt đăng ký',
        MaDK: type === 'create' ? 0 : undefined,
        ...data,
      };

      this.dangKy = dangKy;
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
        this.dialogCreateOrUpdate = false;
        formCreateOrUpdate.reset();
        this.getListDangKyByTinhTrang({ TinhTrang: this.tinhTrang });
      }
    },
  },
};
</script>
