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
          Authorization: 'Bearer t-g104bbknYG23BZW75B5QIJIP2U52LBCTDUHSVBE4',
          'Content-Type': 'multipart/form-data; boundary=---7MA4YWxkTrZu0gW',
        },
      },
    )
    .then((data) => {
      return data.data;
    })
    .catch((e) => {
      console.error(e);
    });
};

export { images };
