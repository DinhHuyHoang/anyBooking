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
              <v-toolbar-title>Đăng ký xe</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialogCreateOrUpdate"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="primary"
                    small
                    dark
                    class="mb-2"
                    v-on="on"
                    @click="createOrEditItem({ type: 'create' })"
                  >
                    <v-icon small class="mr-2">
                      mdi-plus
                    </v-icon>
                    <span>Thêm</span>
                  </v-btn>
                </template>
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
                            <v-row>
                              <v-col>
                                <v-select
                                  v-model="soCho"
                                  :items="listSoChoNgoi"
                                  item-text="LoaiXe"
                                  item-value="SoCho"
                                  label="Số chổ"
                                  :rules="[rules.required]"
                                  @input="dangKy['SoCho'] = soCho"
                                ></v-select>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  v-model="soNguoiDi"
                                  label="Số người đi"
                                  :rules="[rules.required]"
                                  :hint="
                                    soNguoiDi > soCho
                                      ? 'Số người đi lớn hơn số chổ!'
                                      : ''
                                  "
                                  @input="dangKy['SoNguoiDi'] = soNguoiDi"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col>
                                <v-datetime-picker
                                  v-model="dateTimeDepart"
                                  clear-text="Hủy"
                                  label="Thời gian Đi"
                                  :text-field-props="{
                                    rules: [rules.required, ruleDate],
                                    'persistent-hint': true,
                                    hint: 'yyyy-MM-dd HH:mm',
                                  }"
                                  @input="
                                    dangKy['ThoiGianDi'] = $moment(
                                      dateTimeDepart
                                    ).format('YYYY-MM-DD HH:mm')
                                  "
                                >
                                </v-datetime-picker>
                              </v-col>
                              <v-col>
                                <v-datetime-picker
                                  v-model="dateTimeArrive"
                                  clear-text="Hủy"
                                  label="Thời gian về"
                                  :text-field-props="{
                                    rules: [rules.required, ruleDate],
                                    'persistent-hint': true,
                                    hint: 'yyyy-MM-dd HH:mm',
                                  }"
                                  @input="
                                    dangKy['ThoiGianVe'] = $moment(
                                      dateTimeArrive
                                    ).format('YYYY-MM-DD HH:mm')
                                  "
                                >
                                </v-datetime-picker>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col>
                                <v-textarea
                                  v-model="placeDepart"
                                  label="Địa điểm khởi hành"
                                  :rules="[
                                    rules.required,
                                    rules.maxLength.bind(null, 300),
                                  ]"
                                  @input="dangKy['DiemKhoiHanh'] = placeDepart"
                                ></v-textarea>
                              </v-col>
                              <v-col>
                                <v-textarea
                                  v-model="placeArrive"
                                  label="Địa điểm đến"
                                  :rules="[
                                    rules.required,
                                    rules.maxLength.bind(null, 300),
                                  ]"
                                  @input="dangKy['NoiDen'] = placeArrive"
                                ></v-textarea>
                              </v-col>
                            </v-row>
                            <v-textarea
                              v-model="reason"
                              label="Lý do"
                              :rules="[
                                rules.required,
                                rules.maxLength.bind(null, 300),
                              ]"
                              @input="dangKy['LyDoDi'] = reason"
                            ></v-textarea>
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
            <v-icon
              v-if="item.TinhTrang === 1"
              small
              class="mr-2"
              @click="createOrEditItem({ type: 'edit', data: item })"
            >
              mdi-pencil
            </v-icon>
            <v-icon v-if="item.TinhTrang === 1" small @click="removeItem(item)">
              mdi-delete
            </v-icon>
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
      { text: 'Số chổ', value: 'SoCho' },
      { text: 'Lý do', value: 'LyDoDi' },
      { text: 'Tình trạng', value: 'GhiChuTinhTrang' },
      { text: 'Ghi chú', value: 'GhiChu' },
      { text: '', value: 'actions', sortable: false },
    ],
    listDangKy: [],
    dateTimeDepart: null,
    placeDepart: null,
    dateTimeArrive: null,
    placeArrive: null,
    reason: null,
    soCho: null,
    soNguoiDi: null,
    dangKy: {},
    listSoChoNgoi: [],
  }),
  computed: {
    ruleDate() {
      const today = new Date();
      const ngayDi = new Date(this.dateTimeDepart);
      const ngayDen = new Date(this.dateTimeArrive);

      if (ngayDi.getTime() < today.getTime()) return 'Ngày không hợp lệ';
      if (ngayDi.getDay() === 0) return 'Không thể đặt xe vào chủ nhật';

      return ngayDi.getTime() < ngayDen.getTime() || 'Thời gian không hợp lệ';
    },
  },
  created() {
    this.getListDangKy();
    this.getListSoChoNgoi();
  },

  methods: {
    async getListSoChoNgoi() {
      const { data } = await this.$axios(API.getSoChoNgoiTrenXe());
      this.listSoChoNgoi = data;
    },

    async getListDangKy() {
      const { data } = await this.$axios(API.getListDangKyXe());
      this.listDangKy = data;
    },

    createOrEditItem({ type, data = {} }) {
      const dangKy = {
        formTitle: type === 'create' ? 'Thêm xe' : 'Sửa xe',
        MaDK: type === 'create' ? 0 : undefined,
        ...data,
      };

      this.dangKy = dangKy;
      this.dialogCreateOrUpdate = true;
    },

    removeItem(data) {
      const dangKy = {
        formTitle: 'Xóa đăng ký xe',
        message: `Bạn có chắc chắn muốn xóa đăng ký này`,
        ...data,
      };

      this.dangKy = dangKy;
      this.dialogRemove = true;
    },

    async createOrUpdate(dangKy) {
      const { formCreateOrUpdate, SnackBar } = this.$refs;
      if (!formCreateOrUpdate.validate()) return;

      const { data } = await this.$axios(
        API.createOrUpdateDangKyXe({ dangKy })
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
        this.getListDangKy();
      }
    },

    async remove(dangKy) {
      const { data } = await this.$axios(API.deleteDangKyXe({ dangKy }));

      if (data?.error && data?.error) {
        const { message } = data;
        this.$refs.SnackBar.notify({
          type: 'error',
          message,
        });
      } else {
        const { message } = data;
        this.$refs.SnackBar.notify({
          type: 'success',
          timeout: 1000,
          message,
        });
        this.getListDangKy();
        this.dialogRemove = false;
      }
    },
  },
};
</script>
