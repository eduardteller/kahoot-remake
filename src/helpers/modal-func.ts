export const showPlayersModal = () => {
  (document.getElementById("session-modal") as HTMLFormElement).showModal();
};

export const closePlayersModal = () => {
  (document.getElementById("session-modal") as HTMLFormElement).close();
};
