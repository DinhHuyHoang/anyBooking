<template>
  <v-container fluid class="pa-0 mt-3" style="overflow: hidden;">
    <v-row no-gutters="">
      <v-col class="pl-4" cols="12">
        <div class="headline text-uppercase">Đăng ký xe</div>
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
                placeholder="Tình trạng"
                class="mx-2"
              ></v-select>

              <v-btn
                color="primary"
                small
                dark
                class="mx-2"
                @click="createOrEditItem({ type: 'create' })"
              >
                <v-icon small class="mr-2">
                  mdi-plus
                </v-icon>
                <span>Thêm</span>
              </v-btn>
            </v-row>
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

          <template v-slot:item.SoDT="{ item }">
            <a :href="`tel:${item.SoDT}`">{{ item.SoDT }}</a>
          </template>
        </v-data-table>

        <!-- ************************************ Dialog ************************************ -->
        <v-dialog
          v-model="dialogCreateOrUpdate"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
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
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="soNguoiDi"
                            label="Số người đi"
                            :rules="[rules.required, rules.number]"
                            @input="dangKy['SoNguoiDi'] = soNguoiDi"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="SDTLienHe"
                            label="SDT liên hệ"
                            :rules="[rules.required, rules.number]"
                            @input="dangKy['SoDTUserDK'] = SDTLienHe"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-datetime-picker
                            :datetime="dateTimeDepart"
                            clear-text="Hủy"
                            label="Thời gian đi"
                            date-format="dd/MM/yyyy"
                            :text-field-props="{
                              rules: [rules.required, ruleDate],
                              'persistent-hint': true,
                              hint: 'dd/MM/yyyy HH:mm',
                            }"
                            @input="
                              value => {
                                dangKy['NgayDi'] = !!value
                                  ? pasreDate(value.toString(), [
                                      'MM/DD/YYYY HH:mm',
                                      'YYYY/MM/DD HH:mm',
                                    ])
                                  : value;
                                dateTimeDepart = value;
                              }
                            "
                          >
                          </v-datetime-picker>
                        </v-col>
                        <v-col>
                          <v-datetime-picker
                            :datetime="dateTimeArrive"
                            clear-text="Hủy"
                            label="Thời gian về"
                            date-format="dd/MM/yyyy"
                            :text-field-props="{
                              rules: [rules.required, ruleDate],
                              'persistent-hint': true,
                              hint: 'dd/MM/yyyy HH:mm',
                            }"
                            @input="
                              value => {
                                dangKy['NgayVe'] = !!value
                                  ? pasreDate(value.toString(), [
                                      'MMMM DD YYYY HH:mm',
                                      'YYYY/MM/DD HH:mm',
                                    ])
                                  : value;
                                dateTimeArrive = value;
                              }
                            "
                          >
                          </v-datetime-picker>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-row no-gutters="">
                            <v-col cols="12">
                              <v-textarea
                                v-model="placeDepart"
                                label="Địa điểm khởi hành"
                                :rules="[
                                  rules.required,
                                  rules.maxLength.bind(null, 300),
                                ]"
                                persistent-hint
                                :hint="
                                  ((placeDepart && placeDepart.length) || '0') +
                                    '/300'
                                "
                                @input="dangKy['DiemKhoiHanh'] = placeDepart"
                              ></v-textarea>
                            </v-col>
                            <v-col cols="12">
                              <v-radio-group
                                v-model="radioCampus"
                                row
                                @change="
                                  campus => {
                                    placeDepart = `${campus} Đại học Lạc Hồng`;
                                    dangKy['DiemKhoiHanh'] = placeDepart;
                                  }
                                "
                              >
                                <v-radio
                                  v-for="(campus, index) in listCampuses"
                                  :key="index"
                                  :label="campus"
                                  :value="campus"
                                ></v-radio>
                              </v-radio-group>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col>
                          <v-textarea
                            v-model="placeArrive"
                            label="Địa điểm đến"
                            :rules="[
                              rules.required,
                              rules.maxLength.bind(null, 300),
                            ]"
                            persistent-hint
                            :hint="
                              ((placeArrive && placeArrive.length) || '0') +
                                '/300'
                            "
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
                        persistent-hint
                        :hint="((reason && reason.length) || '0') + '/300'"
                        @input="dangKy['LyDoDi'] = reason"
                      ></v-textarea>
                    </v-form>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" dark @click="createOrUpdate(dangKy)">
                Đồng ý
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogRemove" max-width="500px">
          <v-card v-if="Object.keys(dangKy).length">
            <v-toolbar dark color="error">
              <v-btn icon dark @click="dialogRemove = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>{{ dangKy.formTitle }}</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

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
              <v-btn color="red darken-1" text @click="remove(dangKy)">
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
  data(vm) {
    return {
      search: '',
      dialogCreateOrUpdate: false,
      dialogRemove: false,
      rules: {
        required: value => !!value || 'Không được bỏ trống trường này',
        number: value => /\D/gi.test(value) === false || 'Phải nhập ký tự số',
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
        { text: 'Tình trạng', value: 'GhiChuTinhTrang' },
        { text: 'Ghi chú', value: 'GhiChu' },
      ],
      listDangKy: [],
      radioCampus: 'Cở sở 1',
      listCampuses: [
        'Cở sở 1',
        'Cở sở 2',
        'Cở sở 3',
        'Cở sở 4',
        'Cở sở 5',
        'Cở sở 6',
        'Cở sở Dược',
      ],
      dateTimeDepart: undefined,
      placeDepart: null,
      dateTimeArrive: undefined,
      placeArrive: null,
      reason: null,
      soNguoiDi: null,
      SDTLienHe: null,
      dangKy: {},
      listTinhTrang: [],
      tinhTrang: 1,
    };
  },
  computed: {
    ruleDate() {
      const today = new Date();
      const ngayDi = new Date(this.dateTimeDepart);
      const ngayDen = new Date(this.dateTimeArrive);

      if (Boolean(ngayDi.getTime()) === false) return 'Chưa chọn ngày đi';
      if (Boolean(ngayDen.getTime()) === false) return 'Chưa chọn ngày về';
      if (ngayDi.getTime() < today.getTime()) return 'Ngày đi không hợp lệ';

      return ngayDi.getTime() < ngayDen.getTime() || 'Thời gian không hợp lệ';
    },

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
    tinhTrang() {
      this.getListDangKy({ TinhTrang: this.tinhTrang });
    },
  },

  created() {
    this.getListDangKy();
    this.getListTrangThai();
    this.initialize();
  },

  methods: {
    initialize() {
      this.radioCampus = 'Cở sở 1';
      this.placeDepart = `${this.radioCampus} Đại học Lạc Hồng`;
      this.dateTimeDepart = undefined;
      this.dateTimeArrive = undefined;
      this.placeArrive = null;
      this.reason = null;
      this.soNguoiDi = null;
      this.SDTLienHe = null;
      this.dangKy.DiemKhoiHanh = this.placeDepart;
    },

    pasreDate(dateString, format = null) {
      if (!dateString) {
        return null;
      }
      const { $moment } = this;
      if (format) {
        const date = $moment(dateString).format(format[1]);
        return date;
      }

      const date = $moment(dateString, 'DD/MM/YYYY HH:mm').format(
        'YYYY/MM/DD HH:mm'
      );
      return date;
    },

    async getListDangKy(dangKy = { TinhTrang: 1 }) {
      const { data } = await this.$axios(API.getListDangKyXe({ dangKy }));
      this.listDangKy = data;
    },

    async getListTrangThai() {
      const { data } = await this.$axios(
        API.getListTinhTrangDangKy({ typeUser: 'somethingUser' })
      );
      this.listTinhTrang = data;
    },

    createOrEditItem({ type, data = {} }) {
      this.initialize();

      const dangKy = {
        formTitle: type === 'create' ? 'Đăng ký xe' : 'Sửa đăng ký xe',
        MaDK: type === 'create' ? 0 : undefined,
        ...data,
        ...this.dangKy,
      };

      if (type === 'edit') {
        const {
          SoNguoiDi,
          NgayDi,
          DiemKhoiHanh,
          NgayVe,
          NoiDen,
          LyDoDi,
          SoDTUserDK,
        } = data;
        this.soNguoiDi = SoNguoiDi;
        this.dateTimeDepart = new Date(this.pasreDate(NgayDi));
        this.placeDepart = DiemKhoiHanh;
        this.dateTimeArrive = new Date(this.pasreDate(NgayVe));
        this.placeArrive = NoiDen;
        this.reason = LyDoDi;
        this.SDTLienHe = SoDTUserDK;
      }

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
        // formCreateOrUpdate.reset();
        this.dialogCreateOrUpdate = false;
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
