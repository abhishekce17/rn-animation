import { BackdropBlur, Group, Path, rect, RoundedRect, rrect, Skia } from "@shopify/react-native-skia"
import { useMemo } from "react"
import { Dimensions } from "react-native"

export const BlurCard = ({ CARD_WIDTH, CARD_HEIGHT } : { CARD_WIDTH: number, CARD_HEIGHT: number }) => {
    const clipPath = useMemo(()=>{
        const skPath = Skia.Path.Make();
        skPath.addRRect(rrect(rect(0, 0, CARD_WIDTH, CARD_HEIGHT), 20, 20));
        return skPath;
    },[]);
    return(
        <Group>
        <Path path={clipPath} color="rgba(255,255,255,0.1)" />
        <Path path={clipPath} style={"stroke"} color="rgba(255,255,255,0.7)" />
        <BackdropBlur blur={5} clip={clipPath} />
        </Group>
    )
}

