import { useEffect } from "react";
import {
  databases,
  DATABASE_ID,
  COL_ID_MSGS,
} from "../appwrite/AppWriteConfig";

const Room = () => {
  useEffect(() => {
    getMessages();
  }, []);
  const getMessages = async () => {
    const response = await databases.listDocuments(DATABASE_ID, COL_ID_MSGS);
    console.log("RESPONSE:", response);
  };

  return <div>Room</div>;
};

export default Room;
