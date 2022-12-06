import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Locations from "./routes/Locations";
import Introduction from "./routes/Introduction";
import ChattingRoom from "./routes/ChattingRoom";
import { Theme } from "@twilio-paste/core/dist/theme";
import { UserLocationType } from "./types/userInfos";

function App() {
  const [login, setLogin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [isNew, setIsNew] = useState(false);
  console.log(username);
  return (
    <Theme.Provider theme="sendgrid">
      <Routes>
        <Route
          path="/"
          element={<Introduction login={login} setLogin={setLogin} />}
        />
        {/*<Route path="register" element={<Register />} />*/}
        <Route
          path="login"
          element={<Login setUsername={setUsername} setIsNew={setIsNew} />}
        />
        <Route
          path="locations"
          element={<Locations isNew={isNew} username={username} />}
        />
        <Route path="chat" element={<ChattingRoom />} />
      </Routes>
    </Theme.Provider>
  );
}

export default App;
