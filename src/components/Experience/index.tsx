import { useTexture } from "@react-three/drei";
import { CustomMaterial } from "../CustomMaterial";
import { useControls } from "leva";

const path = ['water4.png', 'flowMap3.png', 'magma.png', 'flowMap3.png'];

export const Experience = () => {

    const [ water, flowMapWater, magma, flowMapMagma ] = useTexture(path);

    const {presets} = useControls({
        presets: {
            value: 'water',
            options: ["water", "magma"],
        }
    });

    return (
        <mesh>
            <planeGeometry args={[10, 10]} />
            <CustomMaterial map={presets === 'water' ? water : magma} flowMap={presets === 'water' ? flowMapWater : flowMapMagma} />
        </mesh>
    );

};

useTexture.preload(path);