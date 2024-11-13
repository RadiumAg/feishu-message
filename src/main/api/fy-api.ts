import axios from 'axios';
import { FeiShuResponse } from '../utils/type';

const images = async (image: File) => {
  const formData = new FormData();

  formData.append('image', image);
  formData.append('image_type', 'message');

  return axios
    .post<FeiShuResponse<{ image_key: string }>>(
      'https://open.feishu.cn/open-apis/im/v1/images',
      formData,
      {
        headers: {
          Authorization: 'Bearer t-g104bdcN4FXNWJFIXSHVHMIJVK2ZTG5HN5TVMPGP',
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
