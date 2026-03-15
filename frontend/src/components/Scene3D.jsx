import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 200 }) {
    const mesh = useRef();
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) {
            pos[i] = (Math.random() - 0.5) * 20;
        }
        return pos;
    }, [count]);

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
            mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.04} color="#00f0ff" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

function FloatingGeometry() {
    const torusRef = useRef();
    const icosaRef = useRef();
    const octaRef = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (torusRef.current) {
            torusRef.current.rotation.x = t * 0.3;
            torusRef.current.rotation.y = t * 0.2;
            torusRef.current.position.y = Math.sin(t * 0.5) * 0.5;
        }
        if (icosaRef.current) {
            icosaRef.current.rotation.x = t * 0.2;
            icosaRef.current.rotation.z = t * 0.3;
            icosaRef.current.position.y = Math.cos(t * 0.4) * 0.6;
        }
        if (octaRef.current) {
            octaRef.current.rotation.y = t * 0.4;
            octaRef.current.rotation.z = t * 0.2;
            octaRef.current.position.y = Math.sin(t * 0.6) * 0.4;
        }
    });

    return (
        <>
            <mesh ref={torusRef} position={[-3, 0, -3]}>
                <torusGeometry args={[1, 0.3, 16, 50]} />
                <meshStandardMaterial color="#a855f7" wireframe transparent opacity={0.3} />
            </mesh>
            <mesh ref={icosaRef} position={[3, 1, -4]}>
                <icosahedronGeometry args={[0.8, 1]} />
                <meshStandardMaterial color="#00f0ff" wireframe transparent opacity={0.25} />
            </mesh>
            <mesh ref={octaRef} position={[0, -2, -5]}>
                <octahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial color="#ec4899" wireframe transparent opacity={0.2} />
            </mesh>
        </>
    );
}

export default function Scene3D({ className = '' }) {
    return (
        <div className={`absolute inset-0 ${className}`} style={{ pointerEvents: 'none' }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 60 }} style={{ background: 'transparent' }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#00f0ff" />
                <pointLight position={[-10, -10, -10]} intensity={0.3} color="#a855f7" />
                <Particles count={300} />
                <FloatingGeometry />
            </Canvas>
        </div>
    );
}
