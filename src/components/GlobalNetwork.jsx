import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useLenis } from '@studio-freight/react-lenis';

const GlobalNetwork = () => {
    const groupRef = useRef();
    const globeRef = useRef();
    const linesRef = useRef();

    const connections = useMemo(() => {
        const data = [];
        const numArcs = 20;
        for (let i = 0; i < numArcs; i++) {
            const start = new THREE.Vector3(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            ).normalize().multiplyScalar(150);

            const end = new THREE.Vector3(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            ).normalize().multiplyScalar(150);

            const points = [];
            for (let j = 0; j <= 20; j++) {
                const p = new THREE.Vector3().lerpVectors(start, end, j / 20);
                p.normalize().multiplyScalar(150 + Math.sin(Math.PI * (j / 20)) * 50);
                points.push(p);
            }

            data.push(new THREE.CatmullRomCurve3(points));
        }
        return data;
    }, []);

    useLenis(({ progress }) => {
        if (groupRef.current) {
            // Visibility: 0.23 to 0.35
            const sectionProgress = (progress - 0.23) * (1 / 0.12);
            const opacity = Math.max(0, Math.min(1, sectionProgress > 0 && sectionProgress < 1 ? 1 : 0));

            groupRef.current.position.y = -500 + sectionProgress * 500;
            groupRef.current.scale.setScalar(opacity);
        }
    });

    useFrame((state) => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.005;
        }
        if (linesRef.current) {
            linesRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={groupRef} position={[0, -1000, 0]}>
            <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
                {/* Stylized Globe */}
                <mesh ref={globeRef}>
                    <sphereGeometry args={[150, 64, 64]} />
                    <meshPhongMaterial
                        color="#050505"
                        emissive="#00c3ff"
                        emissiveIntensity={0.1}
                        wireframe
                        transparent
                        opacity={0.3}
                    />
                </mesh>

                {/* Data Connections */}
                <group ref={linesRef}>
                    {connections.map((curve, i) => (
                        <ArcLine curve={curve} key={i} />
                    ))}
                </group>

                {/* Earth Glow */}
                <Sphere args={[155, 32, 32]}>
                    <meshBasicMaterial
                        color="#00c3ff"
                        transparent
                        opacity={0.05}
                        blending={THREE.AdditiveBlending}
                        side={THREE.BackSide}
                    />
                </Sphere>
            </Float>

            {/* Content Labels */}
            <Html position={[0, 200, 0]} center translateZ={100}>
                <div className="network-label">
                    <h2 className="glow-text">GLOBAL CONNECTIVITY</h2>
                    <p className="sub-label">Powering 2,500+ Network Hubs Worldwide</p>
                </div>
            </Html>
        </group>
    );
};

const ArcLine = ({ curve }) => {
    const lineRef = useRef();

    useFrame((state) => {
        if (lineRef.current) {
            lineRef.current.material.dashOffset -= 0.01;
        }
    });

    return (
        <mesh>
            <tubeGeometry args={[curve, 64, 0.5, 8, false]} />
            <meshBasicMaterial
                color="#00ff9f"
                transparent
                opacity={0.4}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
};

export default GlobalNetwork;
