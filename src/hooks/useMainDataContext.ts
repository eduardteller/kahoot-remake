import { useContext } from "react";
import { MainDataContext } from "../Host";

export const useMainDataContext = () => {
  const context = useContext(MainDataContext);
  if (!context) {
    throw new Error("useMainData must be used within a MainDataProvider");
  }
  const { mainData, setMainData } = context;
  return { mainData, setMainData };
};
