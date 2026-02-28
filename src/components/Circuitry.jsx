import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Circuitry = () => {
    const linesRef = useRef();

    const lineData = useMemo(() => {
        const lines = [];
        const numLines = 15;

        for (let i = 0; i < numLines; i++) {
            const points = [];
            let current = new THREE.Vector3(
                (Math.random() - 0.5) * 800,
                (Math.random() - 0.5) * 800,
                (Math.random() - 0.5) * 400
            );

            points.push(current.clone());

            // Generate a random path with 90 degree turns
            for (let j = 0; j < 5; j++) {
                const axis = ['x', 'y', 'z'][Math.floor(Math.random() * 3)];
                const dir = Math.random() > 0.5 ? 1 : -1;
                const len = Math.random() * 200 + 50;

                current[axis] += dir * len;
                points.push(current.clone());
            }

            lines.push(points);
        }
        return lines;
    }, []);

    useFrame((state) => {
        if (linesRef.current) {
            linesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <group ref={linesRef}>
            {lineData.map((points, i) => (
                <Line path={points} key={i} />
            ))}
        </group>
    );
};

const Line = ({ path }) => {
    const geometry = useMemo(() => {
        const curve = new THREE.CatmullRomCurve3(path);
        return new THREE.TubeGeometry(curve, 64, 1.5, 8, false);
    }, [path]);

    return (
        <mesh geometry={geometry}>
            <meshBasicMaterial
                color="#00c3ff"
                transparent
                opacity={0.15}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
};

export default Circuitry;
