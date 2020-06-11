<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="listDangKy"
          :items-per-page="5"
          class="elevation-0"
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
                                <v-text-field
                                  v-model="soNguoiDi"
                                  label="Số người đi"
                                  :rules="[rules.required, rules.number]"
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
                                  date-format="dd/MM/yyyy"
                                  :text-field-props="{
                                    rules: [rules.required, ruleDate],
                                    'persistent-hint': true,
                                    hint: 'dd/MM/yyyy HH:mm',
                                  }"
                                  @input="dangKy['NgayDi'] = dateTimeDepart"
                                >
                                </v-datetime-picker>
                              </v-col>
                              <v-col>
                                <v-datetime-picker
                                  v-model="dateTimeArrive"
                                  clear-text="Hủy"
                                  label="Thời gian về"
                                  date-format="dd/MM/yyyy"
                                  :text-field-props="{
                                    rules: [rules.required, ruleDate],
                                    'persistent-hint': true,
                                    hint: 'dd/MM/yyyy HH:mm',
                                  }"
                                  @input="dangKy['NgayVe'] = dateTimeArrive"
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
                                        ((placeDepart && placeDepart.length) ||
                                          '0') + '/300'
                                      "
                                      @input="
                                        dangKy['DiemKhoiHanh'] = placeDepart
                                      "
                                    ></v-textarea>
                                  </v-col>
                                  <v-col cols="12">
                                    <v-radio-group
                                      v-model="radioCampus"
                                      row
                                      @change="
                                        campus => {
                                          placeDepart = `${campus} Đại học Lạc Hồng`;
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
                                    ((placeArrive && placeArrive.length) ||
                                      '0') + '/300'
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
                              :hint="
                                ((reason && reason.length) || '0') + '/300'
                              "
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
  data(vm) {
    return {
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
        { text: 'Lý do', value: 'LyDoDi' },
        { text: 'Tình trạng', value: 'GhiChuTinhTrang' },
        { text: 'Ghi chú', value: 'GhiChu' },
        { text: '', value: 'actions', sortable: false },
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
      dangKy: {},
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
  },

  created() {
    this.getListDangKy();
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
      this.dangKy.DiemKhoiHanh = this.placeDepart;
    },

    pasreDate(dateString) {
      const { $moment } = this;
      const date = $moment(dateString, 'DD/MM/YYYY HH:mm').format(
        'YYYY/MM/DD HH:mm'
      );
      return new Date(date);
    },

    async getListDangKy() {
      const { data } = await this.$axios(API.getListDangKyXe());
      this.listDangKy = data;
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
        } = data;
        this.soNguoiDi = SoNguoiDi;
        this.dateTimeDepart = this.pasreDate(NgayDi);
        this.placeDepart = DiemKhoiHanh;
        this.dateTimeArrive = this.pasreDate(NgayVe);
        this.placeArrive = NoiDen;
        this.reason = LyDoDi;
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
