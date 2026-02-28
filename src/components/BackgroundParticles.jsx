import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const BackgroundParticles = () => {
    const { size } = useThree();
    const pointsCount = 400;
    const maxLines = 500;
    const maxTriangles = 150;
    const maxDist = 200;

    const pointsRef = useRef();
    const linesRef = useRef();
    const trianglesRef = useRef();

    const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const scrollPos = useRef(0);

    // Initialize particles with geometric metadata
    const particles = useMemo(() => {
        const data = [];
        for (let i = 0; i < pointsCount; i++) {
            data.push({
                x: (Math.random() - 0.5) * 1500,
                y: (Math.random() - 0.5) * 1500,
                z: (Math.random() - 0.5) * 1200,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                vz: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 1,
            });
        }
        return data;
    }, []);

    const [pointsPos, linePos, triPos] = useMemo(() => [
        new Float32Array(pointsCount * 3),
        new Float32Array(maxLines * 2 * 3),
        new Float32Array(maxTriangles * 3 * 3),
    ], []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 1200;
            mouse.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 1200;
        };
        const handleScroll = () => {
            scrollPos.current = window.scrollY;
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useFrame((state) => {
        let lineIndex = 0;
        let triIndex = 0;
        const scrollOffset = scrollPos.current * 0.1;
        const time = state.clock.getElapsedTime();

        // Smooth mouse following
        mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
        mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

        for (let i = 0; i < pointsCount; i++) {
            const p = particles[i];

            // Kinetic movement
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;

            // Soft boundaries with wrap-around or bounce
            if (p.x < -800) p.x = 800;
            if (p.x > 800) p.x = -800;
            if (p.y < -800) p.y = 800;
            if (p.y > 800) p.y = -800;
            if (p.z < -600) p.z = 600;
            if (p.z > 600) p.z = -600;

            // Cursor interaction (geometric push-pull)
            const dx = mouse.current.x - p.x;
            const dy = (mouse.current.y + scrollOffset) - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 400) {
                const force = (1 - dist / 400) * 0.2;
                p.x -= dx * force;
                p.y -= dy * force;
            }

            // Update vertex positions
            pointsPos[i * 3] = p.x;
            pointsPos[i * 3 + 1] = p.y - scrollOffset;
            pointsPos[i * 3 + 2] = p.z;

            // Geometric Connectivity (Lines)
            for (let j = i + 1; j < pointsCount; j++) {
                const p2 = particles[j];
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const d2 = dx2 * dx2 + dy2 * dy2;

                if (d2 < maxDist * maxDist) {
                    if (lineIndex / 6 < maxLines) {
                        linePos[lineIndex++] = p.x;
                        linePos[lineIndex++] = p.y - scrollOffset;
                        linePos[lineIndex++] = p.z;
                        linePos[lineIndex++] = p2.x;
                        linePos[lineIndex++] = p2.y - scrollOffset;
                        linePos[lineIndex++] = p2.z;
                    }

                    // Triangles for geometric surface feel
                    if (triIndex / 9 < maxTriangles && Math.random() < 0.1) {
                        for (let k = j + 1; k < pointsCount; k++) {
                            const p3 = particles[k];
                            const dx3 = p2.x - p3.x;
                            const dy3 = p2.y - p3.y;
                            const d3 = dx3 * dx3 + dy3 * dy3;

                            if (d3 < maxDist * maxDist * 0.5) {
                                triPos[triIndex++] = p.x;
                                triPos[triIndex++] = p.y - scrollOffset;
                                triPos[triIndex++] = p.z;
                                triPos[triIndex++] = p2.x;
                                triPos[triIndex++] = p2.y - scrollOffset;
                                triPos[triIndex++] = p2.z;
                                triPos[triIndex++] = p3.x;
                                triPos[triIndex++] = p3.y - scrollOffset;
                                triPos[triIndex++] = p3.z;
                                break;
                            }
                        }
                    }
                }
            }
        }

        // Clean up remaining data in buffers
        while (lineIndex < linePos.length) linePos[lineIndex++] = 0;
        while (triIndex < triPos.length) triPos[triIndex++] = 0;

        if (pointsRef.current) pointsRef.current.attributes.position.needsUpdate = true;
        if (linesRef.current) linesRef.current.attributes.position.needsUpdate = true;
        if (trianglesRef.current) trianglesRef.current.attributes.position.needsUpdate = true;
    });

    return (
        <group>
            {/* Geometric points (use tiny icosahedrons or just points) */}
            <points>
                <bufferGeometry ref={pointsRef}>
                    <bufferAttribute attach="attributes-position" count={pointsCount} array={pointsPos} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial
                    size={3}
                    color="#00c3ff"
                    transparent
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Neural Connections */}
            <lineSegments>
                <bufferGeometry ref={linesRef}>
                    <bufferAttribute attach="attributes-position" count={maxLines * 2} array={linePos} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#00ff9f"
                    transparent
                    opacity={0.08}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>

            {/* Digital Surfaces */}
            <mesh>
                <bufferGeometry ref={trianglesRef}>
                    <bufferAttribute attach="attributes-position" count={maxTriangles * 3} array={triPos} itemSize={3} />
                </bufferGeometry>
                <meshBasicMaterial
                    color="#00c3ff"
                    transparent
                    opacity={0.03}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
};

export default BackgroundParticles;
