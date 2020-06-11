<template>
  <v-row justify="center">
    <v-dialog
      v-model="isOpen"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="toggleDialog()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Tạo báo cáo</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <v-radio-group v-model="typeReport" row>
            <v-radio label="Báo cáo theo đơn vị" value="0"></v-radio>
            <v-radio label="Báo cáo theo tháng" value="1"></v-radio>
          </v-radio-group>
          <div v-if="typeReport == 0">
            <v-form ref="formBaoCaoTheoDonVi">
              <v-row>
                <v-col cols="4">
                  <v-combobox
                    v-model="donVi"
                    :items="listDonVi"
                    label="Đơn vị"
                    item-text="TenPhongBan"
                    item-value="PhongBanID"
                    :rules="[rules.required]"
                  ></v-combobox>
                </v-col>
                <v-col cols="12"></v-col>
                <v-col>
                  <v-btn @click="generateReport()">
                    Tạo báo cáo
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>
          <div v-if="typeReport == 1">
            <v-form ref="formBaoCaoTheoThang">
              <v-row>
                <v-col cols="4">
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date"
                        label="Chọn tháng"
                        prepend-icon="event"
                        readonly
                        v-bind="attrs"
                        :rules="[rules.required]"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="date"
                      type="month"
                      @input="menu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12"></v-col>
                <v-col>
                  <v-btn @click="generateReport()">
                    Tạo báo cáo
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import API from '~/config/api';
import getConfigReportDonVi from '~/config/report/reportDonVi';
import getConfigReportThang from '~/config/report/reportThang';

export default {
  props: {
    isOpen: {
      required: true,
      type: Boolean,
    },
    toggleDialog: {
      required: true,
      type: Function,
    },
  },

  data: () => ({
    date: null,
    menu: false,
    typeReport: '0',
    listDonVi: [],
    donVi: null,
    rules: {
      required: value => !!value || 'Không được bỏ trống trường này',
      maxLength: (max, value = '') =>
        (value && value.length <= max) || `Không được quá ${max} ký tự`,
    },
  }),

  created() {
    this.getListDonVi();
  },

  methods: {
    async getListDonVi() {
      const { data } = await this.$axios(API.getListDonVi());
      this.listDonVi = data;
    },

    generateReport() {
      if (this.typeReport === '0') this.createReportDonVi();
      if (this.typeReport === '1') this.createReportThang();
    },

    async createReportThang() {
      const { formBaoCaoTheoThang } = this.$refs;
      if (!formBaoCaoTheoThang.validate()) return;

      const date = this.$moment(this.date, 'YYYY-MM');
      const month = (date.month() + 1).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      const year = date.year();

      const { data } = await this.$axios(API.getReportThang({ month, year }));

      const dataTables = [];
      let Stt = 1;
      for (const row of data) {
        const {
          NgayDi,
          NgayVe,
          NoiDen,
          LyDoDi,
          HoNV,
          TenNV,
          TenPhongBan,
        } = row;
        dataTables.push([
          Stt,
          TenPhongBan,
          NgayDi,
          NgayVe,
          NoiDen,
          LyDoDi,
          `${HoNV} ${TenNV}`,
        ]);
        Stt++;
      }

      this.$pdfMake
        .createPdf(getConfigReportThang({ month, year, dataTables }))
        .open();
    },

    async createReportDonVi() {
      const { formBaoCaoTheoDonVi } = this.$refs;
      if (!formBaoCaoTheoDonVi.validate()) return;

      const {
        donVi: { PhongBanID, TenPhongBan },
      } = this.$data;

      const { data } = await this.$axios(
        API.getReportByDonVi({ donVi: PhongBanID })
      );

      // eslint-disable-next-line prefer-const
      let dataTables = [];
      let Stt = 1;
      for (const row of data) {
        const { NgayDi, NgayVe, NoiDen, LyDoDi, HoNV, TenNV } = row;
        dataTables.push([
          Stt,
          TenPhongBan,
          NgayDi,
          NgayVe,
          NoiDen,
          LyDoDi,
          `${HoNV} ${TenNV}`,
        ]);
        Stt++;
      }

      this.$pdfMake
        .createPdf(getConfigReportDonVi({ donVi: TenPhongBan, dataTables }))
        .open();
    },
  },
};
</script>
