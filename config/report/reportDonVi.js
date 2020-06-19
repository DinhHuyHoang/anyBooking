export default ({
  donVi = '',
  dataTables = [
    ['1', '2', '3', '4', '5', '6', '7'],
    ['1', '2', '3', '4', '5', '6', '7'],
  ],
}) => ({
  pageSize: 'A4',
  pageOrientation: 'potrial',
  pageMargins: [40, 40, 40, 40],
  content: [
    {
      alignment: 'center',
      columns: [
        {
          text: [
            'TRƯỜNG ĐẠI HỌC LẠC HỒNG \n',
            {
              text: 'PHÒNG HÀNH CHÍNH - TỔ CHỨC',
              bold: true,
            },
          ],
        },
        {
          text:
            'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM \n Độc lập - Tự do - Hạnh phúc',
          bold: true,
        },
      ],
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 85,
          y1: 5,
          x2: 175,
          y2: 5,
          lineWidth: 1,
        },
        {
          type: 'line',
          x1: 312,
          y1: 5,
          x2: 462,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    {
      alignment: 'center',
      margin: [0, 4, 0, 0],
      columns: [
        {
          text: ['Số: \u200B\t\u200B\t\u200B\t\u200B\t /BC-HCTC \n'],
        },
        {
          text: 'Đồng Nai, ngày ..... tháng ..... năm .....',
        },
      ],
    },
    {
      alignment: 'center',
      margin: [0, 32, 0, 0],
      bold: true,
      fontSize: 16,
      text: `BÁO CÁO \n Tình hình ${donVi} đăng ký xe đi công tác trong thời gian qua.`,
    },
    {
      canvas: [
        {
          type: 'line',
          x1: 200,
          y1: 5,
          x2: 320,
          y2: 5,
          lineWidth: 1,
        },
      ],
    },
    {
      alignment: 'center',
      margin: [0, 32, 0, 16],
      text: `Trong thời gian qua, ${donVi} đã đăng ký xe đi công tác như sau:`,
    },
    {
      table: {
        headerRows: 1,
        widths: [20, 100, 'auto', 'auto', 'auto', 80, 70],
        body: [
          [
            { text: 'TT', alignment: 'center', bold: true },
            { text: 'Đơn vị đề xuất', alignment: 'center', bold: true },
            { text: 'Ngày giờ đi', alignment: 'center', bold: true },
            { text: 'Ngày giờ về', alignment: 'center', bold: true },
            { text: 'Nơi đến', alignment: 'center', bold: true },
            { text: 'Lý do đi', alignment: 'center', bold: true },
            {
              text: 'Người đề xuất \n điều xe',
              alignment: 'center',
              bold: true,
            },
          ],
          ...dataTables,
        ],
      },
    },
    {
      margin: [32, 16, 0, 0],
      text: `\u200B\t\u200B\tTrên đây là báo cáo tình hình ${donVi} đã đăng ký xe đi công tác trong thời gian qua./.`,
    },
    {
      margin: [32, 32, 0, 0],
      columns: [
        {
          text: [
            {
              text: 'Nơi nhận:',
              bold: true,
              italics: true,
            },
            '\n - Thầy Hiệu trưởng;',
            '\n - Lưu: P.HC-TC, (433).',
          ],
        },
        {
          text: [
            {
              alignment: 'center',
              text: 'TRƯỞNG PHÒNG',
              bold: true,
            },
            {
              alignment: 'center',
              text: '\n\n\n\n\n\n\u200B\tLê Văn Hùng',
              bold: true,
            },
          ],
        },
      ],
    },
  ],
  defaultStyle: {
    fontSize: 13,
  },
});
