import axios from 'axios';

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
    .then((res) => res.data);
};

export { sendMessage };
