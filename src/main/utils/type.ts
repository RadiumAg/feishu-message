type ImageMessage = { tag: 'img'; image_key: string };
type TextMessage = { tag: 'text'; text: string; style: string[] };
type RichDocMessage = {
  title: string;
  content: (TextMessage | ImageMessage)[][];
};

type FeiShuResponse<T> = {
  data: T;
  msg: string;
  code: number;
};

export type { ImageMessage, TextMessage, RichDocMessage, FeiShuResponse };
