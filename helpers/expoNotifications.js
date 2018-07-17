const Expo = require('expo-server-sdk');
const _ = require('lodash');
const redis = require('./redis');
const notificationTypes = require('./constants').notificationTypes;

const expo = new Expo();

const sendAllNotifications = notifications => {
  // Collect notifications by user
  const userNotifications = {};
  notifications.forEach(notification => {
    const user = notification[0];
    if (!userNotifications[user]) {
      userNotifications[user] = [];
    }
    userNotifications[user].push(notification);
  });

  Object.keys(userNotifications).forEach(user => {
    const currentUserNotifications = userNotifications[user];
    redis.smembersAsync(`tokens:${user}`).then(async tokens => {
      if (tokens.length === 0) return;

      const messages = [];
      currentUserNotifications.forEach(currentUserNotification => {
        tokens.forEach(token =>
          messages.push(getNotificationMessage(currentUserNotification, token)),
        );
      });
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          const resp = await expo.sendPushNotificationsAsync(chunk);
          console.log('Expo chunk set', resp);
        } catch (error) {
          console.log('Error sending expo chunk', error);
        }
      }
    });
  });
};

const getNotificationMessage = (notification, token) => {
  const data = notification[1];
  const template = { to: token, data };

  let message = {};
  switch (notification[1].type) {
    case notificationTypes.ORDER:
      message = {
        body: `${data.from} sent you an order for ${data.amount}.`,
      };
      break;

    case notificationTypes.TRANSFER:
      message = {
        body: `${data.from} sent you ${data.amount} in escrow with.`,
      };
      break;

    case notificationTypes.APPROVE:
      message = {
        body: `${data.from} approved your escrow transfer.`,
      };
      break;

    case notificationTypes.RELEASE:
      message = {
        body: `${data.from} approved the escrow transfer.`,
      };
      break;

    case notificationTypes.DISPUTE:
      message = {
        body: `${data.from} raised a dispute for escrow transfer.`,
      };
      break;

    case notificationTypes.FEEDBACK:
      message = {
        body: `${data.from} left a feedback for you ` ,
      };
      break;

    default:
      message = {
        body: 'Something happened in the app.',
      };
  }

  return { ...template, ...message };
};

module.exports = {
  expo,
  sendAllNotifications,
  getNotificationMessage,
};
