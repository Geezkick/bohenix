import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLenis } from '@studio-freight/react-lenis';

const SustainabilitySection = () => {
    const groupRef = useRef();
    const sunRef = useRef();

    useLenis(({ progress }) => {
        if (groupRef.current) {
            // Visibility: 0.59 to 0.71
            const sectionProgress = (progress - 0.59) * (1 / 0.12);
            const opacity = Math.max(0, Math.min(1, sectionProgress > 0 && sectionProgress < 1 ? 1 : 0));

            groupRef.current.position.y = -500 + sectionProgress * 500;
            groupRef.current.scale.setScalar(opacity);
        }
    });

    useFrame((state, delta) => {
        if (sunRef.current) {
            sunRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={[0, -1000, 0]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* Stylized Solar Core */}
                <mesh ref={sunRef}>
                    <icosahedronGeometry args={[100, 2]} />
                    <meshStandardMaterial
                        color="#ffcc00"
                        emissive="#ff8800"
                        emissiveIntensity={2}
                        wireframe
                    />
                </mesh>

                {/* Energy Rays */}
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[120, 1, 16, 100]} />
                    <meshBasicMaterial color="#ffcc00" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
                </mesh>

                <pointLight intensity={5} color="#ffcc00" />
            </Float>

            <Html position={[0, 250, 0]} center>
                <div className="sustainability-label text-center">
                    <h2 className="glow-text text-white">SUSTAINABLE TECHNOLOGY</h2>
                    <p className="sub-label opacity-70">Powering Innovation with Green Energy</p>
                </div>
            </Html>
        </group>
    );
};

export default SustainabilitySection;
