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
                                <v-text-field
                                  v-model="dangKy.SoCho"
                                  label="Số chổ"
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                              <v-col>
                                <v-text-field
                                  v-model="dangKy.SoNguoiDi"
                                  label="Số người đi"
                                  :rules="[rules.required]"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col>
                                <v-datetime-picker
                                  v-model="dangKy.dateTimeDepart"
                                  clear-text="Hủy"
                                  label="Ngày Đi"
                                >
                                </v-datetime-picker>
                              </v-col>
                              <v-col>
                                <v-datetime-picker
                                  v-model="dangKy.dateTimeArrive"
                                  clear-text="Hủy"
                                  label="Ngày đến"
                                >
                                </v-datetime-picker>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col>
                                <v-textarea
                                  v-model="dangKy.placeDepart"
                                  label="Địa điểm khởi hành"
                                  :rules="[rules.required]"
                                ></v-textarea>
                              </v-col>
                              <v-col>
                                <v-textarea
                                  v-model="placeArrive"
                                  label="Địa điểm đến"
                                  :rules="[rules.required]"
                                ></v-textarea>
                              </v-col>
                            </v-row>
                            <v-textarea
                              v-model="dangKy.reason"
                              label="Lý do"
                              :rules="[rules.required]"
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
                      text
                      @click="createOrUpdate(dangKy)"
                    >
                      Đồng ý
                    </v-btn>
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
              small
              class="mr-2"
              @click="createOrEditItem({ type: 'edit', data: item })"
            >
              mdi-pencil
            </v-icon>
            <v-icon small @click="removeItem(item)">
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
    },
    headers: [
      { text: 'Biển số xe', value: 'BienSo' },
      { text: 'Số chổ', value: 'SoCho' },
      { text: 'Tài xế', value: 'HoTenTX' },
      { text: '', value: 'actions', sortable: false },
    ],

    listDangKy: [],
    dangKy: {
      dateTimeDepart: null,
      placeDepart: null,
      dateTimeArrive: null,
      placeArrive: null,
      reason: null,
    },
  }),
  created() {
    this.getListDangKy();
  },
  methods: {
    async getListDangKy() {
      const { data } = await this.$axios(API.getListDangKyXe());
      this.listDangKy = data;
      console.log(data);
    },

    createOrEditItem({ type, data = {} }) {
      const dangKy = {
        formTitle: type === 'create' ? 'Thêm xe' : 'Sửa xe',
        XeID: type === 'create' ? 0 : undefined,
        ...data,
      };

      this.dangKy = dangKy;
      this.dialogCreateOrUpdate = true;
    },

    removeItem(data) {
      const dangKy = {
        formTitle: 'Xóa xe',
        message: `Bạn có chắc chắn muốn xóa xe "${data.BienSo}"`,
        ...data,
      };

      this.dangKy = dangKy;
      this.dialogRemove = true;
    },

    async createOrUpdate(xe) {
      const { formCreateOrUpdate, SnackBar } = this.$refs;
      if (!formCreateOrUpdate.validate()) return;

      xe = {
        ...xe,
        TaiXeID: this.taiXeId,
      };

      const { data } = await this.$axios(API.createOrUpdateXe({ xe }));

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
        this.getListDangKy();
      }
    },

    async remove(xe) {
      const { data } = await this.$axios(API.deleteXe({ xe }));

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
