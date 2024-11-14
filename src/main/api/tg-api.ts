import axios from 'axios';
import ElectronLog from 'electron-log';

type SendMessageData = {
  bot_name: string;
  topic_name: string;
  message_text: string;
};

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000',
});

const sendMessage = (data: SendMessageData) => {
  return axiosInstance
    .post<void>('/send_message', data)
    .then((res) => res.data)
    .catch((e) => {
      ElectronLog.log(e);
      console.error(e);
    });
};

export { sendMessage };
