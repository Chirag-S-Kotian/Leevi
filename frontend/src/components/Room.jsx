import React, { useState, useEffect } from "react";
import client, {
  databases,
  DATABASE_ID,
  COL_ID_MSGS,
} from "../appwrite/AppWriteConfig";
import { ID, Query, Permission, Role } from "appwrite";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";
import { Trash2 } from "react-feather";

const Room = () => {
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COL_ID_MSGS}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A MESSAGE WAS CREATED");
          setMessages((prevState) => [...prevState, response.payload]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE WAS DELETED!!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    console.log("unsubscribe:", unsubscribe);

    return () => {
      unsubscribe();
    };
  }, []);

  const getMessages = async () => {
    const response = await databases.listDocuments(DATABASE_ID, COL_ID_MSGS, [
      Query.orderAsc("$createdAt"),
      Query.limit(100),
    ]);
    console.log(response.documents);
    setMessages(response.documents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("MESSAGE:", messageBody);

    const permissions = [Permission.write(Role.user(user.$id))];

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COL_ID_MSGS,
      ID.unique(),
      payload,
      permissions
    );

    console.log("RESPONSE:", response);

    // setMessages(prevState => [response, ...prevState])

    setMessageBody("");
  };

  const deleteMessage = async (id) => {
    await databases.deleteDocument(DATABASE_ID, COL_ID_MSGS, id);
    //setMessages(prevState => prevState.filter(message => message.$id !== message_id))
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <div>
          {messages.map((message) => (
            <div key={message.$id} className={"message--wrapper"}>
              <div className="message--header">
                <p>
                  {message?.username ? (
                    <span> {message?.username}</span>
                  ) : (
                    "Anonymous user"
                  )}

                  <small className="message-timestamp">
                    {" "}
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>

                {message.$permissions.includes(
                  `delete(\"user:${user.$id}\")`
                ) && (
                  <Trash2
                    className="delete--btn"
                    onClick={() => {
                      deleteMessage(message.$id);
                    }}
                  />
                )}
              </div>

              <div
                className={
                  "message--body" +
                  (message.user_id === user.$id ? " message--body--owner" : "")
                }
              >
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength="250"
              placeholder="Say something..."
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            ></textarea>
          </div>

          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="send" />
          </div>
        </form>
      </div>
    </main>
  );
};

export default Room;
