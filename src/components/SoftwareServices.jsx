import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useLenis } from '@studio-freight/react-lenis';

const SoftwareServices = () => {
    const groupRef = useRef();
    const systemRef = useRef();

    useLenis(({ progress }) => {
        if (groupRef.current) {
            // Visibility: 0.47 to 0.59
            const sectionProgress = (progress - 0.47) * (1 / 0.12);
            const opacity = Math.max(0, Math.min(1, sectionProgress > 0 && sectionProgress < 1 ? 1 : 0));

            groupRef.current.position.y = -500 + sectionProgress * 500;
            groupRef.current.scale.setScalar(opacity);
        }
    });

    const particles = useMemo(() => {
        const data = [];
        for (let i = 0; i < 50; i++) {
            data.push({
                pos: new THREE.Vector3((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400),
                speed: Math.random() * 0.02 + 0.01,
            });
        }
        return data;
    }, []);

    useFrame((state, delta) => {
        if (systemRef.current) {
            systemRef.current.rotation.z += delta * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[0, -1000, 0]}>
            <Float speed={3} rotationIntensity={1} floatIntensity={2}>
                <group ref={systemRef}>
                    {/* Central Flow Node */}
                    <mesh>
                        <torusGeometry args={[80, 2, 16, 100]} />
                        <meshBasicMaterial color="#00ff9f" transparent opacity={0.3} wireframe />
                    </mesh>

                    {/* AI Data Streams */}
                    {particles.map((p, i) => (
                        <mesh key={i} position={p.pos}>
                            <sphereGeometry args={[2, 8, 8]} />
                            <meshBasicMaterial color="#00ff9f" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
                        </mesh>
                    ))}
                </group>

                <pointLight intensity={3} color="#00ff9f" />
            </Float>

            <Html position={[0, 250, 0]} center>
                <div className="software-label text-center">
                    <h2 className="glow-text text-white">SOFTWARE SERVICES</h2>
                    <p className="sub-label opacity-70">Intelligent Systems & Neural Infrastructure</p>
                </div>
            </Html>
        </group>
    );
};

export default SoftwareServices;
