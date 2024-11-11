import axios from 'axios';

const images = async (image: any) => {
  return axios
    .post<{
      code: number;
      data: {
        image_key: string;
      };
      msg: string;
    }>(
      'https://open.feishu.cn/open-apis/im/v1/images',
      {
        image_type: 'message',
        image,
      },
      {
        headers: {
          Authorization: 't-g104bbiGUM2Z2ONWDP2IZP3ZIC2F2WJ2CX3RDRJP',
          'Content-Type': 'multipart/form-data; boundary=---7MA4YWxkTrZu0gW',
        },
      },
    )
    .then((data) => {
      return data.data;
    });
};

export { images };
