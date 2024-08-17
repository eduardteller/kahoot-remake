import { Link } from "react-router-dom";
import Header from "./components/Header";
import { Dispatch, useEffect, useState } from "react";
import { AccountData, DbUser, UserResponse } from "./helpers/types";
import { useFetchUserAccount } from "./hooks/queryHooks";
import ErrorPage from "./components/ErrorPage";
import { jwtDecode } from "jwt-decode";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingPage from "./components/LoadingPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const handleAuthCheck = (
  receivedData: UserResponse | undefined,
  setAccountData: Dispatch<React.SetStateAction<AccountData>>,
) => {
  if (receivedData) {
    if (receivedData.message !== "error") {
      setAccountData(receivedData.userData);
    }
  }
};

function AppBase() {
  const [accountData, setAccountData] = useState<AccountData>(null);
  const fetchedUserData = useFetchUserAccount(true);
  const { data, isLoading, error } = fetchedUserData;

  useEffect(() => {
    if (data) {
      handleAuthCheck(data, setAccountData);
    }
  }, [data]);

  const params = new URLSearchParams(window.location.search);
  const userParam = params.get("token");
  if (userParam && !accountData) {
    const user = jwtDecode(userParam) as DbUser;
    setAccountData({
      _id: user._id,
      nickname: user.nickname,
      avatar: user.avatar,
      discordID: user.discordID,
      refreshTokenVersion: user.refreshTokenVersion,
    });
  }

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <Header account={accountData}>
      <div className="card mx-auto my-12 w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Start Kahoot! 👇</h2>
          <p>Choose host or client mode</p>
          <div className="card-actions flex flex-col items-center">
            <Link to={"/host"} className="btn btn-primary btn-wide mt-4">
              Host
            </Link>
            <Link to={"/client"} className="btn btn-secondary btn-wide mt-2">
              Client
            </Link>
          </div>
        </div>
      </div>
    </Header>
  );
}

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppBase />
    </QueryClientProvider>
  );
};

export default App;
