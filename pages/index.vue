<template>
  <div>
    <div v-if="!rights">
      <div class="text-center">
        <h1>Bạn không có quyền truy cập</h1>
      </div>
    </div>
    <div v-else>
      <v-app-bar
        id="myAppBar"
        style="height: auto;"
        color="primary accent-4"
        dense
        dark
      >
        <v-row class="align-center py-2">
          <v-col cols="12" md="4">
            <div class="font-weight-bold title text-center text-md-left">
              HỆ THỐNG ĐĂNG KÝ XE
            </div>
          </v-col>
          <v-col class="text-center text-md-right pa-0" cols="12" md="8">
            <v-btn
              v-if="
                checkRight(userRight.nhanVienTaiXe) ||
                  checkRight(userRight.phongHanhChanh)
              "
              text
              :outlined="menu.nhanVienTaiXe"
              @click="toggleMenu({ nhanVienTaiXe: true })"
            >
              Tài xế
            </v-btn>
            <v-btn
              v-if="checkRight(userRight.phongHanhChanh)"
              text
              :outlined="menu.taiXe"
              @click="toggleMenu({ taiXe: true })"
            >
              DS Tài xế
            </v-btn>
            <v-btn
              v-if="checkRight(userRight.phongHanhChanh)"
              text
              :outlined="menu.xe"
              @click="toggleMenu({ xe: true })"
            >
              DS Xe
            </v-btn>
            <v-btn
              text
              :outlined="menu.dangKy"
              @click="toggleMenu({ dangKy: true })"
            >
              Đăng ký xe
            </v-btn>
            <v-btn
              v-if="
                checkRight(userRight.truongPhong) ||
                  checkRight(userRight.phongHanhChanh)
              "
              text
              :outlined="menu.donVi"
              @click="toggleMenu({ donVi: true })"
            >
              Đơn vị duyệt xe
            </v-btn>
            <v-btn
              v-if="checkRight(userRight.phongHanhChanh)"
              text
              :outlined="menu.capXe"
              @click="toggleMenu({ capXe: true })"
            >
              Cấp xe
            </v-btn>
            <v-btn
              v-if="
                checkRight(userRight.phongHanhChanh) ||
                  checkRight(userRight.truongPhong)
              "
              text
              :outlined="menu.baoCao"
              @click="toggleMenu({ baoCao: true })"
            >
              Báo cáo
            </v-btn>
          </v-col>
        </v-row>
      </v-app-bar>
      <v-row no-gutters>
        <v-col v-if="menu.taiXe" class="pa-0" cols="12">
          <TaiXeComp />
        </v-col>
        <v-col v-if="menu.xe" class="pa-0" cols="12">
          <XeComp />
        </v-col>
        <v-col v-if="menu.dangKy" class="pa-0" cols="12">
          <DangKyXeComp />
        </v-col>
        <v-col v-if="menu.donVi" class="pa-0" cols="12">
          <QLDonViComp />
        </v-col>
        <v-col v-if="menu.capXe" class="pa-0" cols="12">
          <HanhChanhComp />
        </v-col>
        <v-col v-if="menu.baoCao" class="pa-0" cols="12">
          <BaoCaoComp />
        </v-col>
        <v-col v-if="menu.nhanVienTaiXe" class="pa-0" cols="12">
          <NhanVienTaiXeComp />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import TaiXeComp from '~/components/TaiXe';
import XeComp from '~/components/Xe';
import DangKyXeComp from '~/components/DangKyXe';
import QLDonViComp from '~/components/QLDonVi';
import HanhChanhComp from '~/components/HanhChanh';
import BaoCaoComp from '~/components/BaoCao';
import NhanVienTaiXeComp from '~/components/NhanVienTaiXe';
import API from '~/config/api';

function getFunctionRight({ rights = '[0]' }) {
  try {
    const pattern = /\d/gi;
    return [...rights.match(pattern)];
  } catch (error) {
    return [];
  }
}

export default {
  components: {
    TaiXeComp,
    XeComp,
    DangKyXeComp,
    QLDonViComp,
    HanhChanhComp,
    BaoCaoComp,
    NhanVienTaiXeComp,
  },

  async asyncData({ $axios }) {
    const { data } = await $axios(API.getPermisstions());
    let rights = null;
    if (data) {
      rights = getFunctionRight({ rights: data.Quyen });
    }

    const menu = {
      xe: false,
      taiXe: false,
      dangKy: rights[0] === '3',
      donVi: rights[0] === '2',
      capXe: rights[0] === '1',
      baoCao: false,
      nhanVienTaiXe: rights[0] === '4',
    };

    return { rights, menu };
  },

  data(vm) {
    return {
      userRight: {
        phongHanhChanh: '1',
        truongPhong: '2',
        nhanVien: '3',
        nhanVienTaiXe: '4',
      },
    };
  },

  methods: {
    checkRight(expectRight = 0) {
      return this.rights.includes(expectRight);
    },

    toggleMenu(menu) {
      this.menu = {
        xe: false,
        taiXe: false,
        dangKy: false,
        donVi: false,
        capXe: false,
        baoCao: false,
        nhanVienTaiXe: false,
        ...menu,
      };
    },
  },
};
</script>

<style>
#myAppBar .v-toolbar__content {
  height: auto !important;
  display: block;
}
</style>
