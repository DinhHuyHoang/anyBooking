const protocol = 'https';
const host = 'tapi.lhu.edu.vn';
const port = '';
const prefix = 'booking';
const baseURL = `${protocol}://${host}${port}/${prefix}`;

function getCookie(cname) {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

const Authorization = {
  headers: {
    Authorization: getCookie('awt') || undefined,
  },
};

export default {
  getPermisstions() {
    return {
      ...Authorization,
      method: 'GET',
      url: baseURL + `/obj/getpermision`,
    };
  },

  getSoChoNgoiTrenXe() {
    return {
      ...Authorization,
      method: 'GET',
      url: baseURL + `/User_SelectSoCho`,
    };
  },

  /**
   *  API tai xe
   */

  getListTaiXe() {
    return {
      ...Authorization,
      method: 'GET',
      url: baseURL + `/TaiXe_Select`,
    };
  },

  createOrUpdateTaiXe({ taiXe }) {
    return {
      ...Authorization,
      method: 'POST',
      url: baseURL + `/obj/TaiXe_Update`,
      data: { ...taiXe },
    };
  },

  deleteTaiXe({ taiXe }) {
    return {
      ...Authorization,
      method: 'POST',
      url: baseURL + `/obj/TaiXe_Delete`,
      data: { ...taiXe },
    };
  },

  /**
   *  API xe
   */

  getListXe() {
    return {
      ...Authorization,
      method: 'GET',
      url: baseURL + `/Xe_Select`,
    };
  },

  createOrUpdateXe({ xe }) {
    return {
      ...Authorization,
      method: 'POST',
      url: baseURL + `/obj/Xe_Update`,
      data: { ...xe },
    };
  },

  deleteXe({ xe }) {
    return {
      ...Authorization,
      method: 'POST',
      url: baseURL + `/obj/Xe_Delete`,
      data: { ...xe },
    };
  },

  /**
   *  API Dang ky xe
   */

  getListDangKyXe() {
    return {
      ...Authorization,
      method: 'GET',
      url: baseURL + `/User_SelectDangKiXe`,
    };
  },

  createOrUpdateDangKyXe({ dangKy }) {
    return {
      ...Authorization,
      method: 'POST',
      url: baseURL + `/obj/User_DangKiXe`,
      data: { ...dangKy },
    };
  },

  deleteDangKyXe({ dangKy }) {
    return {
      ...Authorization,
      method: 'POST',
      url: baseURL + `/obj/User_DeleteDangKiXe`,
      data: { ...dangKy },
    };
  },

  /**
   *  API user quan ly dang ky xe
   */

  getListTinhTrangDangKy({ typeUser = 'admin' }) {
    return {
      ...Authorization,
      method: 'GET',
      url:
        baseURL +
        (typeUser === 'admin'
          ? '/Admin_SelectTinhTrangDangKi'
          : '/USerQL_SelectTinhTrangDangKi'),
    };
  },

  getListDangKyXeByTinhTrang({ dangKy, typeUser = 'admin' }) {
    return {
      ...Authorization,
      method: 'POST',
      url:
        baseURL +
        (typeUser === 'admin'
          ? '/Admin_SelectDangKi'
          : '/UserQL_SelectDangKiXe'),
      data: { ...dangKy },
    };
  },

  setTinhTrangDangKy({ dangKy }) {
    return {
      ...Authorization,
      method: 'POST',
      url: baseURL + `/obj/UserQL_DuyetDangKiXe`,
      data: { ...dangKy },
    };
  },

  setTinhTrangDangKyHanhChanh({ dangKy }) {
    return {
      ...Authorization,
      method: 'POST',
      url: baseURL + `/obj/Admin_DuyetDangKi`,
      data: { ...dangKy },
    };
  },

  /**
   *  API Bao cao
   */
  getListDonVi() {
    return {
      ...Authorization,
      method: 'GET',
      url: baseURL + `/DonViSelect/`,
    };
  },

  getReportByDonVi({ donVi }) {
    return {
      ...Authorization,
      method: 'GET',
      url: baseURL + `/BaoCaoTinhHinhXeDiCongTacTheoDonVi/${donVi}`,
    };
  },

  getReportThang({ month, year }) {
    return {
      ...Authorization,
      method: 'GET',
      url: baseURL + `/BaoCaoTinhHinhXeDiCongTacTheoThang/${month}/${year}`,
    };
  },
};
