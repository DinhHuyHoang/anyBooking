<template>
  <v-container>
    <v-row>
      <v-col v-if="false">
        <TaiXeComp />
      </v-col>
      <v-col v-if="false">
        <XeComp />
      </v-col>
      <v-col cols="12">
        <DangKyXeComp />
      </v-col>
      <v-col cols="12">
        <QLDonViComp />
      </v-col>
      <v-col cols="12">
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

export default {
  components: {
    TaiXeComp,
    XeComp,
    DangKyXeComp,
    QLDonViComp,
    HanhChanhComp,
  },
};
</script>
