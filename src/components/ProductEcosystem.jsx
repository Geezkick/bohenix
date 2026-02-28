import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useLenis } from '@studio-freight/react-lenis';

const ProductEcosystem = () => {
    const groupRef = useRef();
    const productRef = useRef();

    useLenis(({ progress }) => {
        if (groupRef.current) {
            // Visibility: 0.35 to 0.47
            const sectionProgress = (progress - 0.35) * (1 / 0.12);
            const opacity = Math.max(0, Math.min(1, sectionProgress > 0 && sectionProgress < 1 ? 1 : 0));

            groupRef.current.position.y = -500 + sectionProgress * 500;
            groupRef.current.scale.setScalar(opacity);
        }
    });

    useFrame((state) => {
        if (productRef.current) {
            productRef.current.rotation.y += 0.01;
            productRef.current.rotation.z += 0.005;
        }
    });

    return (
        <group ref={groupRef} position={[0, -1000, 0]}>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                {/* Stylized Product: Precision Module */}
                <mesh ref={productRef}>
                    <boxGeometry args={[120, 120, 40]} />
                    <meshStandardMaterial
                        color="#ffffff"
                        metalness={0.9}
                        roughness={0.1}
                        emissive="#00c3ff"
                        emissiveIntensity={0.2}
                    />

                    {/* Interior Details */}
                    <mesh position={[0, 0, 21]}>
                        <planeGeometry args={[100, 100]} />
                        <meshBasicMaterial color="#00ff9f" transparent opacity={0.1} wireframe />
                    </mesh>
                </mesh>

                {/* Ambient Glow */}
                <pointLight position={[200, 200, 200]} intensity={2} color="#00c3ff" />
            </Float>

            <Html position={[0, 250, 0]} center>
                <div className="product-label">
                    <h2 className="glow-text">PRODUCT ECOSYSTEM</h2>
                    <p className="sub-label">Next-Gen Industrial Automation & Electronics</p>
                </div>
            </Html>
        </group>
    );
};

export default ProductEcosystem;
