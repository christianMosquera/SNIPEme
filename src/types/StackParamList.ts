import { ITSnipe } from "../components/Post";

export type StackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Password: {name: string; username: string; email: string};
  Reset: undefined;
  Main: undefined;
  Detail: ITSnipe;
};
