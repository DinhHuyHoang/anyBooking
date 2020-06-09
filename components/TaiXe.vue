<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="listTaiXe"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Tài xế</v-toolbar-title>
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
                <v-card v-if="Object.keys(taiXe).length">
                  <v-toolbar dark color="primary">
                    <v-btn icon dark @click="dialogCreateOrUpdate = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ taiXe.formTitle }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-form ref="formCreateOrUpdate">
                            <v-text-field
                              v-model="taiXe.HoTenTX"
                              label="Tên tài xế"
                              :rules="[rules.required]"
                            ></v-text-field>
                            <v-text-field
                              v-model="taiXe.SoDT"
                              label="Số điện thoại"
                              :rules="[rules.required]"
                            ></v-text-field>
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
                      @click="createOrUpdate(taiXe)"
                    >
                      Đồng ý
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <v-dialog v-model="dialogRemove" max-width="500px">
                <v-card v-if="Object.keys(taiXe).length">
                  <v-toolbar dark color="error">
                    <v-btn icon dark @click="dialogRemove = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ taiXe.formTitle }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col>
                          <div>{{ taiXe.message }}</div>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="remove(taiXe)">
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
      { text: 'Tên tài xế', value: 'HoTenTX' },
      { text: 'Số điện thoại', value: 'SoDT' },
      { text: '', value: 'actions', sortable: false },
    ],
    listTaiXe: [],
    taiXe: {},
  }),
  created() {
    this.getListTaiXe();
  },
  methods: {
    async getListTaiXe() {
      const { data } = await this.$axios(API.getListTaiXe());
      this.listTaiXe = data;
    },

    createOrEditItem({ type, data = {} }) {
      const taiXe = {
        formTitle: type === 'create' ? 'Thêm tài xế' : 'Sửa tài xế',
        TaiXeID: type === 'create' ? 0 : undefined,
        ...data,
      };

      this.taiXe = taiXe;
      this.dialogCreateOrUpdate = true;
    },

    removeItem(data) {
      const taiXe = {
        formTitle: 'Xóa tài xế',
        message: `Bạn có chắc chắn muốn xóa tài xế "${data.HoTenTX}"`,
        ...data,
      };

      this.taiXe = taiXe;
      this.dialogRemove = true;
    },

    async createOrUpdate(taiXe) {
      const { formCreateOrUpdate, SnackBar } = this.$refs;
      if (!formCreateOrUpdate.validate()) return;

      const { data } = await this.$axios(API.createOrUpdateTaiXe({ taiXe }));

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
        this.getListTaiXe();
      }
    },

    async remove(taiXe) {
      const { data } = await this.$axios(API.deleteTaiXe({ taiXe }));

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
        this.getListTaiXe();
        this.dialogRemove = false;
      }
    },
  },
};
</script>
