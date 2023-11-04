import { useState } from "react";
import { useChat } from "../context/chat/ChatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import ChatBox from "../Components/ChatBox";
import MyChats from "../Components/MyChats";
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = useChat();
  const { user: userValue } = user;

  return (
    <div style={{ width: "100%" }}>
      {userValue && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {userValue && <MyChats fetchAgain={fetchAgain} />}
        {userValue && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
