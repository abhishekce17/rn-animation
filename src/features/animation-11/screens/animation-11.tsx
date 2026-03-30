import { FlatList, StyleSheet, View, ViewToken } from "react-native";
import { EachItem } from "../components/Item";
import { useSharedValue } from "react-native-reanimated";

const DATA = [...Array(50).keys()];

const Animation11 = () =>{
    const viewItemsSharedValues = useSharedValue<ViewToken[]>([]);
    return <View style={style.container}>
        <FlatList 
            contentContainerStyle={{paddingHorizontal: 10}}
            data={DATA}
            onViewableItemsChanged={({viewableItems}) => {viewItemsSharedValues.value = viewableItems}}
            renderItem={({ item }) => <EachItem id={item} viewableItems={viewItemsSharedValues} />}
            keyExtractor={(item) => item.toString()}
        />
    </View>
}

const style = StyleSheet.create({
    container : {
        flex: 1,
    }
})

export default Animation11;