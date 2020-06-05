<template>
  <v-container>
    <v-row>
      <v-col>
        <TaiXeComp />
      </v-col>
      <v-col>
        <XeComp />
      </v-col>
      <v-col cols="12">
        <DangKyXeComp />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TaiXeComp from '~/components/TaiXe';
import XeComp from '~/components/Xe';
import DangKyXeComp from '~/components/DangKyXe';

export default {
  components: {
    TaiXeComp,
    XeComp,
    DangKyXeComp,
  },
};
</script>
