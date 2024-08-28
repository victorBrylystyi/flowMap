import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { FrontSide, RepeatWrapping, ShaderMaterial, Texture } from "three";

type MaterialProps = {
    map: Texture
    flowMap: Texture
    color?: string
}

const vs = `

    varying vec2 vUv;

    void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;

        gl_Position = projectedPosition;
        vUv = uv;
    }
`;
const fs = `
    varying vec2 vUv;

    uniform sampler2D map;
    uniform sampler2D flowMap;
    uniform float u_time;
    uniform vec2 resolution;

    void main() {

        vec2 flowDirection = (texture2D( flowMap, vUv ).rg - 0.5) * 2.0;

        float cycleTime = 50.0;
        float speed = 0.5; 
        
        float t1 = u_time / cycleTime;
        float t2 = t1 + 0.1;

        float cycleTime1 = t1 - floor(t1);
        float cycleTime2 = t2 - floor(t2);

        vec2 flowDirection1 = flowDirection * cycleTime1 * speed;
        vec2 flowDirection2 = flowDirection * cycleTime2 * speed;

        vec2 uv1 = vUv + flowDirection1;
        vec2 uv2 = vUv + flowDirection2;

        vec4 color1 = texture2D( map, uv1 );
        vec4 color2 = texture2D( map, uv2 );
        
        gl_FragColor = mix( color1, color2, abs(cycleTime1 - 0.5) * 2.0 );

    }
`;

export const CustomMaterial = (props: MaterialProps) => {

    const { map, flowMap } = props; 

    const mRef = useRef<ShaderMaterial>(null);

    const uniforms = useMemo(() => {

        return {
            u_time: { value: 0 },
            map: { value: map },
            flowMap: { value: flowMap }
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {

        flowMap.wrapS = RepeatWrapping;
        flowMap.wrapT = RepeatWrapping;

        map.wrapS = RepeatWrapping;
        map.wrapT = RepeatWrapping;

        flowMap.needsUpdate = true;
        map.needsUpdate = true;

        uniforms.map.value = map;
        uniforms.flowMap.value = flowMap;

    }, [map , flowMap, uniforms])

    useFrame(({clock}) => {

        if (mRef.current) {
            const t = clock.getElapsedTime();
            mRef.current.uniforms.u_time.value = t;
        }

    })

    return (
        <shaderMaterial 
            ref={mRef}
            side={FrontSide}
            vertexShader={vs}
            fragmentShader={fs}
            needsUpdate
            uniforms={uniforms}
        />
    );
};