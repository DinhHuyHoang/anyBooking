<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="listXe"
          :items-per-page="5"
          class="elevation-0"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Xe</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialogCreateOrUpdate" max-width="500px">
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
                <v-card v-if="Object.keys(xe).length">
                  <v-toolbar dark color="primary">
                    <v-btn icon dark @click="dialogCreateOrUpdate = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ xe.formTitle }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-form ref="formCreateOrUpdate">
                            <v-text-field
                              v-model="xe.BienSo"
                              label="Biển số xe"
                              :rules="[rules.required]"
                            ></v-text-field>
                            <v-select
                              v-model="xe.SoCho"
                              :items="listSoChoNgoi"
                              item-text="LoaiXe"
                              item-value="SoCho"
                              label="Số chổ"
                              :rules="[rules.required]"
                            ></v-select>
                            <v-select
                              v-model="taiXeId"
                              :items="listTaiXe"
                              item-text="HoTenTX"
                              item-value="TaiXeID"
                              label="Tài xế"
                              :rules="[rules.required]"
                            ></v-select>
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
                      @click="createOrUpdate(xe)"
                    >
                      Đồng ý
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogRemove" max-width="500px">
                <v-card v-if="Object.keys(xe).length">
                  <v-toolbar dark color="error">
                    <v-btn icon dark @click="dialogRemove = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ xe.formTitle }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col>
                          <div>{{ xe.message }}</div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="remove(xe)">
                      Đồng ý
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
    listXe: [],
    listTaiXe: [],
    taiXeId: null,
    xe: {},
    listSoChoNgoi: [],
  }),
  created() {
    this.getListXe();
    this.getListSoChoNgoi();
  },
  methods: {
    async getListSoChoNgoi() {
      const { data } = await this.$axios(API.getSoChoNgoiTrenXe());
      this.listSoChoNgoi = data;
    },

    async getListXe() {
      const { data } = await this.$axios(API.getListXe());
      this.listXe = data;
    },

    async getListTaiXe() {
      const { data } = await this.$axios(API.getListTaiXe());
      this.listTaiXe = data;
    },

    createOrEditItem({ type, data = {} }) {
      const xe = {
        formTitle: type === 'create' ? 'Thêm xe' : 'Sửa xe',
        XeID: type === 'create' ? 0 : undefined,
        ...data,
      };

      this.getListTaiXe();
      this.taiXeId = data.TaiXeID ?? null;
      this.xe = xe;
      this.dialogCreateOrUpdate = true;
    },

    removeItem(data) {
      const xe = {
        formTitle: 'Xóa xe',
        message: `Bạn có chắc chắn muốn xóa xe "${data.BienSo}"`,
        ...data,
      };

      this.xe = xe;
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
        this.getListXe();
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
        this.getListXe();
        this.dialogRemove = false;
      }
    },
  },
};
</script>
