import Header from "./components/Header";
import NavCard from "./components/HostComponents/NavCard";
import PlayBoard from "./components/HostComponents/PlayBoard";
import PlayersList from "./components/HostComponents/PlayersList";
import Scoreboard from "./components/HostComponents/Scoreboard";

const Host = () => {
  return (
    <Header>
      <NavCard></NavCard>
      <PlayBoard></PlayBoard>
      <PlayersList></PlayersList>
      <Scoreboard></Scoreboard>
    </Header>
  );
};

export default Host;
