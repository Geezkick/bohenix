import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLenis } from '@studio-freight/react-lenis';

const EnergyCore = () => {
    const groupRef = useRef();
    const coreRef = useRef();
    const outerRef = useRef();
    const glowRef = useRef();

    useLenis(({ scroll, limit, progress }) => {
        if (groupRef.current) {
            // Move from right to center/out as user scrolls
            const progressHero = Math.min(1, progress * 4); // Fast transition
            const yOffset = -scroll * 0.1;
            const xOffset = 300 - progressHero * 1000;
            const scale = 1.2 - progressHero * 0.5;
            const opacity = 1 - progressHero * 1.5;

            groupRef.current.position.y = yOffset;
            groupRef.current.position.x = xOffset;
            groupRef.current.scale.setScalar(Math.max(0, scale));

            if (coreRef.current) coreRef.current.material.opacity = Math.max(0, opacity);
            if (outerRef.current) outerRef.current.material.opacity = Math.max(0, opacity * 0.15);
            if (glowRef.current) glowRef.current.material.opacity = Math.max(0, opacity * 0.2);
        }
    });

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        // Rotating the core
        if (coreRef.current) {
            coreRef.current.rotation.y = time * 0.2;
            coreRef.current.rotation.z = time * 0.1;
        }

        // Pulsing the glow
        if (glowRef.current) {
            glowRef.current.scale.setScalar(1.2 + Math.sin(time * 2) * 0.05);
        }

        // Rotating the outer shell
        if (outerRef.current) {
            outerRef.current.rotation.y = -time * 0.1;
            outerRef.current.rotation.x = time * 0.05;
        }
    });

    return (
        <group ref={groupRef} position={[300, 0, 0]} scale={[1.2, 1.2, 1.2]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Inner Core */}
                <mesh ref={coreRef}>
                    <sphereGeometry args={[100, 64, 64]} />
                    <MeshDistortMaterial
                        color="#00c3ff"
                        emissive="#004e66"
                        emissiveIntensity={2}
                        speed={2}
                        distort={0.3}
                        radius={1}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Outer Shell - Circuitry Pattern */}
                <mesh ref={outerRef}>
                    <sphereGeometry args={[120, 64, 64]} />
                    <meshPhongMaterial
                        color="#00ff9f"
                        emissive="#00ff9f"
                        emissiveIntensity={0.5}
                        wireframe
                        transparent
                        opacity={0.15}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>

                {/* Glow Sphere */}
                <mesh ref={glowRef}>
                    <sphereGeometry args={[140, 32, 32]} />
                    <meshBasicMaterial
                        color="#00c3ff"
                        transparent
                        opacity={0.2}
                        blending={THREE.AdditiveBlending}
                        side={THREE.BackSide}
                    />
                </mesh>

                {/* Light Source from within */}
                <pointLight intensity={5} distance={1000} color="#00c3ff" />
            </Float>
        </group>
    );
};

export default EnergyCore;
