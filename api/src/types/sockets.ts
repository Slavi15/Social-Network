export enum SocketEvent {
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
    
    SEND_MESSAGE = "sendMessage",
    NEW_MESSAGE = "newMessage",
    MESSAGE_SENT = "messageSent",
    MESSAGE_ERROR = "messageError",
    TYPING = "typing",
    TYPING_INDICATOR = "typingIndicator",
    UPDATE_UNREAD_COUNT = "updateUnreadCount",
    
    NOTIFICATION = "notification",
    USER_ONLINE = "userOnline",
    USER_OFFLINE = "userOffline"
  }