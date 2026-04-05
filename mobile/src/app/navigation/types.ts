export type AuthParamList = {
  Login: undefined;
  Register: undefined;
}

export type BottomTabParamList = {
  Home: undefined;
  Location: undefined;
  Applications: undefined;
  Activity: undefined;
  Rule: undefined;
};

export type AppParamList = {
  MainTabs: undefined;
  // Settings: undefined;
}

export type RootParamList = AuthParamList & BottomTabParamList & AppParamList