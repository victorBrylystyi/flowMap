import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { Experience } from './components/Experience';

export const App = () => {

  return (
    <Canvas camera={{position:[0,0,10]}}>
      <OrbitControls makeDefault />
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
  );
}

