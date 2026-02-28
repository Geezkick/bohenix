import React, { Suspense } from 'react';
import EnergyCore from './EnergyCore';
import Circuitry from './Circuitry';
import { Float } from '@react-three/drei';

const HeroScene = () => {
    return (
        <group>
            {/* Global Lighting for the scene */}
            <ambientLight intensity={0.5} />
            <spotLight position={[500, 500, 500]} intensity={2} penumbra={1} castShadow />
            <pointLight position={[-500, -500, -500]} intensity={1} color="#00c3ff" />

            <Suspense fallback={null}>
                {/* The central energy core */}
                <EnergyCore />

                {/* Background circuitry */}
                <Circuitry />

                {/* Additional floating elements for depth */}
                <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
                    <mesh position={[-400, 200, -200]}>
                        <octahedronGeometry args={[20, 0]} />
                        <meshBasicMaterial color="#00ff9f" transparent opacity={0.2} wireframe />
                    </mesh>
                </Float>

                <Float speed={2} rotationIntensity={0.5} floatIntensity={2}>
                    <mesh position={[400, -300, -100]}>
                        <octahedronGeometry args={[30, 0]} />
                        <meshBasicMaterial color="#00c3ff" transparent opacity={0.1} wireframe />
                    </mesh>
                </Float>
            </Suspense>
        </group>
    );
};

export default HeroScene;
