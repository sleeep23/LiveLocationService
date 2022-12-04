import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Locations from "./routes/Locations";
import Introduction from "./routes/Introduction";
import ChattingRoom from "./routes/ChattingRoom";
import { Theme } from "@twilio-paste/core/dist/theme";

function App() {
  const [login, setLogin] = useState<boolean>(false);
  return (
    <Theme.Provider theme="sendgrid">
      <Routes>
        <Route
          path="/"
          element={<Introduction login={login} setLogin={setLogin} />}
        />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="locations" element={<Locations />} />
        <Route path="chat" element={<ChattingRoom />} />
      </Routes>
    </Theme.Provider>
  );
}

export default App;
