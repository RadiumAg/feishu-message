type FormValue = {
  id: string;
  feedId: string;
  chatName: string;
  fsSendConfigArray: {
    appId: string;
    appSecret: string;
    chatId: string;
    chatName: string;
  }[];
  tgSendConfigArray: {
    botName: string;
    topicName: string;
  }[];
};

export type { FormValue };
