import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import Vue from 'vue';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

Vue.prototype.$pdfMake = pdfMake;
