import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const BackgroundParticles = () => {
    const { viewport, size } = useThree();
    const pointsCount = 400;
    const maxLines = 400;
    const maxTriangles = 100;
    const maxDist = 180;

    const pointsRef = useRef();
    const linesRef = useRef();
    const trianglesRef = useRef();

    const mouse = useRef({ x: 0, y: 0 });
    const scrollPos = useRef(0);

    // Initialize particles
    const particles = useMemo(() => {
        const data = [];
        for (let i = 0; i < pointsCount; i++) {
            data.push({
                x: (Math.random() - 0.5) * 1200,
                y: (Math.random() - 0.5) * 1200,
                z: (Math.random() - 0.5) * 1000,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                vz: (Math.random() - 0.5) * 0.5,
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
            mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 1000;
            mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 1000;
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

    useFrame(() => {
        let lineIndex = 0;
        let triIndex = 0;
        const scrollOffset = scrollPos.current * 0.15;

        for (let i = 0; i < pointsCount; i++) {
            const p = particles[i];

            // Physical movement
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;

            // Boundaries
            if (p.x < -600 || p.x > 600) p.vx *= -1;
            if (p.y < -600 || p.y > 600) p.vy *= -1;
            if (p.z < -600 || p.z > 600) p.vz *= -1;

            // Mouse attraction
            const dx = mouse.current.x - p.x;
            const dy = mouse.current.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 300) {
                p.x += dx * 0.002;
                p.y += dy * 0.002;
            }

            pointsPos[i * 3] = p.x;
            pointsPos[i * 3 + 1] = p.y - scrollOffset;
            pointsPos[i * 3 + 2] = p.z;

            // Connections
            for (let j = i + 1; j < pointsCount; j++) {
                const p2 = particles[j];
                const dist2 = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));

                if (dist2 < maxDist) {
                    if (lineIndex / 6 < maxLines) {
                        linePos[lineIndex++] = p.x;
                        linePos[lineIndex++] = p.y - scrollOffset;
                        linePos[lineIndex++] = p.z;
                        linePos[lineIndex++] = p2.x;
                        linePos[lineIndex++] = p2.y - scrollOffset;
                        linePos[lineIndex++] = p2.z;
                    }

                    for (let k = j + 1; k < pointsCount; k++) {
                        const p3 = particles[k];
                        const dist3 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
                        if (dist3 < maxDist * 0.8 && triIndex / 9 < maxTriangles) {
                            triPos[triIndex++] = p.x;
                            triPos[triIndex++] = p.y - scrollOffset;
                            triPos[triIndex++] = p.z;
                            triPos[triIndex++] = p2.x;
                            triPos[triIndex++] = p2.y - scrollOffset;
                            triPos[triIndex++] = p2.z;
                            triPos[triIndex++] = p3.x;
                            triPos[triIndex++] = p3.y - scrollOffset;
                            triPos[triIndex++] = p3.z;
                        }
                    }
                }
            }
        }

        // Zero out unused
        while (lineIndex < linePos.length) linePos[lineIndex++] = 0;
        while (triIndex < triPos.length) triPos[triIndex++] = 0;

        if (pointsRef.current) pointsRef.current.attributes.position.needsUpdate = true;
        if (linesRef.current) linesRef.current.attributes.position.needsUpdate = true;
        if (trianglesRef.current) trianglesRef.current.attributes.position.needsUpdate = true;
    });

    return (
        <>
            <points>
                <bufferGeometry ref={pointsRef}>
                    <bufferAttribute attach="attributes-position" count={pointsCount} array={pointsPos} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial size={2.5} color={0xffffff} transparent opacity={0.35} blending={THREE.AdditiveBlending} />
            </points>
            <lineSegments>
                <bufferGeometry ref={linesRef}>
                    <bufferAttribute attach="attributes-position" count={maxLines * 2} array={linePos} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial color={0xffffff} transparent opacity={0.06} blending={THREE.AdditiveBlending} />
            </lineSegments>
            <mesh>
                <bufferGeometry ref={trianglesRef}>
                    <bufferAttribute attach="attributes-position" count={maxTriangles * 3} array={triPos} itemSize={3} />
                </bufferGeometry>
                <meshBasicMaterial color={0xffffff} transparent opacity={0.02} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
            </mesh>
        </>
    );
};

export default BackgroundParticles;
