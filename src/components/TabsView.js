import * as React from "react";
import { View, useWindowDimensions, Text } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import FlatButton from "../components/FlatButton";

const FirstRoute = () => (
   <View style={{ backgroundColor: "#ff4081", marginTop: 40, height: 300 }}>
      <Text>First</Text>
      <FlatButton></FlatButton>
   </View>
);

const SecondRoute = () => (
   <View style={{ flex: 1, backgroundColor: "#673ab7" }} />
);

const renderScene = SceneMap({
   first: FirstRoute,
   second: SecondRoute,
});

export default function TabsView() {
   const layout = useWindowDimensions();

   const [index, setIndex] = React.useState(0);
   const [routes] = React.useState([
      { key: "first", title: "First" },
      { key: "second", title: "Second" },
   ]);

   return (
      <TabView
         navigationState={{ index, routes }}
         renderScene={renderScene}
         onIndexChange={setIndex}
         initialLayout={{ width: layout.width }}
         style={{ borderWidth: 1, height: 500, width: 200 }}
      />
   );
}
