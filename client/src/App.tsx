import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Login from "./routes/Login";
import Locations from "./routes/Locations";
import Introduction from "./routes/Introduction";
import ChattingRoom from "./routes/ChattingRoom";
import { Theme } from "@twilio-paste/core/dist/theme";

function App() {
  const [login, setLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [isNew, setIsNew] = useState(false);
  console.log(isNew);
  return (
    <Theme.Provider theme="sendgrid">
      <Routes>
        <Route path="/" element={<Introduction login={login} />} />
        {/*<Route path="register" element={<Register />} />*/}
        <Route
          path="login"
          element={
            <Login
              setUsername={setUsername}
              setIsNew={setIsNew}
              setLogin={setLogin}
              isNew={isNew}
            />
          }
        />
        <Route
          path="locations"
          element={<Locations isNew={isNew} username={username} />}
        />
        <Route path="chat" element={<ChattingRoom username={username} />} />
      </Routes>
    </Theme.Provider>
  );
}

export default App;
