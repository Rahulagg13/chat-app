import React from "react";
import { useChat } from "../context/chat/ChatProvider";
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogic";
import { Tooltip, Avatar } from "@chakra-ui/react";
const ScrollableChat = ({ messages }) => {
  const { user } = useChat();
  const { user: userValue } = user;
  console.log(messages);
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => (
          <div style={{ display: "flex" }} key={index}>
            {isSameSender(messages, message, index, userValue._id) ||
              (isLastMessage(messages, index, userValue._id) && (
                <Tooltip
                  label={message.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={message.sender.name}
                    src={message.sender.photo}
                  />
                </Tooltip>
              ))}
            <span
              style={{
                backgroundColor: `${
                  message.sender._id === userValue._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(
                  messages,
                  message,
                  index,
                  userValue._id
                ),
                marginTop: isSameUser(messages, message, index, userValue._id)
                  ? 3
                  : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {message.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
