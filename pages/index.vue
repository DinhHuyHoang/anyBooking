<template>
  <v-container>
    <v-row v-if="rights.length === 0">
      <v-col>
        <div class="text-center">
          <h1>Bạn chưa được cấp quyền!</h1>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="checkRight(userRight.phongHanhChanh)" cols="12" sm="6">
        <TaiXeComp />
      </v-col>
      <v-col v-if="checkRight(userRight.phongHanhChanh)" cols="12" sm="6">
        <XeComp />
      </v-col>
      <v-col v-if="checkRight(userRight.nhanVien)" cols="12">
        <DangKyXeComp />
      </v-col>
      <v-col v-if="checkRight(userRight.truongPhong)" cols="12">
        <QLDonViComp />
      </v-col>
      <v-col v-if="checkRight(userRight.phongHanhChanh)" cols="12">
        <HanhChanhComp />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TaiXeComp from '~/components/TaiXe';
import XeComp from '~/components/Xe';
import DangKyXeComp from '~/components/DangKyXe';
import QLDonViComp from '~/components/QLDonVi';
import HanhChanhComp from '~/components/HanhChanh';
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
  },

  async asyncData({ $axios }) {
    const { data } = await $axios(API.getPermisstions());
    const rights = getFunctionRight({ rights: data.FunctionRight });
    return { rights };
  },

  data: () => ({
    userRight: {
      nhanVien: '1',
      truongPhong: '2',
      phongHanhChanh: '3',
    },
  }),

  methods: {
    checkRight(expectRight = 0) {
      return this.rights.includes(expectRight);
    },
  },
};
</script>
