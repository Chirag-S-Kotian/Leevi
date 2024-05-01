import { useEffect, useState } from "react";
import {
  databases,
  DATABASE_ID,
  COL_ID_MSGS,
} from "../appwrite/AppWriteConfig";
import { ID, Query } from "appwrite";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    getMessages();
  }, []);

  //for sending the messages to the database
  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      body: messageBody,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COL_ID_MSGS,
      ID.unique(),
      payload
    );

    // Prepend the new message to the existing messages array
    setMessages((prevMessages) => [...prevMessages, response]);
    setMessageBody("");
  };

  //for arranging the messages by deliveried time
  const getMessages = async () => {
    const response = await databases.listDocuments(DATABASE_ID, COL_ID_MSGS, [
      Query.orderAsc("$createdAt"),
      Query.limit(20)
    ]);
    setMessages(response.documents);
  };

  //for deleting the messages
  const deleteMessage = async (message_id) => {
    await databases.deleteDocument(DATABASE_ID, COL_ID_MSGS, message_id);
    setMessages(p => messages.filter(msg => msg.$id !== message_id));
  };

  return (
    <div className="container">
      <div className="room--container">
        <div>
          {messages.map((message) => (
            <div key={message.$id} className="message--wrapper">
              <div className="message--header">
                <small className="message-timestamp">
                  {message.$createdAt}
                </small>
                <button onClick={() => {deleteMessage(message.$id)}}>X</button>
              </div>
              <div className="message--body">
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} id="message--form">
          <div>
            <textarea
              required
              maxLength="1000"
              placeholder="Say Something.."
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <button
              className="btn btn--secondary"
              type="submit"
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Room;
