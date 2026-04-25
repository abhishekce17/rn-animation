import { Group } from "@shopify/react-native-skia"
import { BlurCard } from "./BlurCard"
import { SharedValue, useDerivedValue } from "react-native-reanimated"

type GroupedCardProps = {
    CARD_WIDTH: number
    CARD_HEIGHT: number
    index: number
    progress : SharedValue<number>
}

export const GroupedCard = ({ CARD_WIDTH, CARD_HEIGHT, index, progress }: GroupedCardProps) =>{
    const rStyles = useDerivedValue(()=>{
        return[
                {
                    rotate : -Math.PI / 2 * progress.value
                },
                {
                translateX : index * 20 * progress.value
                },
                {
                    perspective : 1000,
                },
                {
                    rotateY : Math.PI / 3 * progress.value
                },
                {
                    rotate : Math.PI / 4 * progress.value
                }
                
            ]
    })
    return(
        <Group 
            origin={{
                x : CARD_WIDTH /2,
                y : CARD_HEIGHT /2
            }}
            transform={rStyles}
            >
              <BlurCard
                CARD_WIDTH={CARD_WIDTH}
                CARD_HEIGHT={CARD_HEIGHT}
              />
            </Group>
    )
}