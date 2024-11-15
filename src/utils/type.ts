type FormValue = {
  id: string;
  feedId: string;
  tagFeedId: string;
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
    isSendImg: boolean;
  }[];
};

export type { FormValue };
