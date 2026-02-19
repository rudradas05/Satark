export type RootTabParamList = {
  Dashboard: undefined;
  Messages: undefined;
  Rules: undefined;
  Settings: undefined;
};

export type MessagesStackParamList = {
  MessageList: undefined;
  MessageDetail: { messageId: string };
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};
