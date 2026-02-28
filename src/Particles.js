import * as THREE from 'three';

export class ParticleBackground {
    constructor() {
        this.container = document.body;
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0'; // Behind UI but above sequence if needed
        this.canvas.style.pointerEvents = 'none';
        this.container.appendChild(this.canvas);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 500;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.particles = [];
        this.pointsCount = 100;
        this.mouse = new THREE.Vector2(0, 0);
        this.targetMouse = new THREE.Vector2(0, 0);
        this.scrollPos = 0;

        this.init();
        this.events();
        this.animate();
    }

    init() {
        // Create Geometry
        this.geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.pointsCount * 3);

        for (let i = 0; i < this.pointsCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 1000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

            this.particles.push({
                x: positions[i * 3],
                y: positions[i * 3 + 1],
                z: positions[i * 3 + 2],
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                vz: (Math.random() - 0.5) * 0.3
            });
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Points Material
        this.pointsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.5,
            transparent: true,
            opacity: 0.4,
            sizeAttenuation: true
        });

        this.points = new THREE.Points(this.geometry, this.pointsMaterial);
        this.scene.add(this.points);

        // Lines and Triangles
        // Max possible lines = pointsCount * (pointsCount - 1) / 2
        // We'll cap it at something reasonable like 500 lines for performance
        this.maxLines = 400;
        this.lineGeometry = new THREE.BufferGeometry();
        this.linePositions = new Float32Array(this.maxLines * 2 * 3); // 2 points per line, 3 coords per point
        this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));

        this.lineMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending
        });

        this.lineSegments = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
        this.scene.add(this.lineSegments);

        // Triangles (Mesh)
        this.maxTriangles = 100;
        this.triGeometry = new THREE.BufferGeometry();
        this.triPositions = new Float32Array(this.maxTriangles * 3 * 3); // 3 points per triangle
        this.triGeometry.setAttribute('position', new THREE.BufferAttribute(this.triPositions, 3));
        this.triMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.02,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        this.triangleMesh = new THREE.Mesh(this.triGeometry, this.triMaterial);
        this.scene.add(this.triangleMesh);
    }

    events() {
        window.addEventListener('mousemove', (e) => {
            this.targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 1000;
            this.targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 1000;
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.targetMouse.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 1000;
                this.targetMouse.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 1000;
            }
        });

        window.addEventListener('scroll', () => {
            this.scrollPos = window.scrollY;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.04;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.04;

        const positions = this.geometry.attributes.position.array;
        const lp = this.linePositions;
        const tp = this.triPositions;
        let lineIndex = 0;
        let triIndex = 0;
        const maxDist = 180;
        const scrollOffset = this.scrollPos * 0.15;

        for (let i = 0; i < this.pointsCount; i++) {
            const p = this.particles[i];

            // Natural movement
            p.x += p.vx;
            p.y += p.vy;
            p.z += p.vz;

            // Boundaries (cubical)
            if (p.x < -600 || p.x > 600) p.vx *= -1;
            if (p.y < -600 || p.y > 600) p.vy *= -1;
            if (p.z < -600 || p.z > 600) p.vz *= -1;

            // Mouse interaction (soft attraction)
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 300) {
                p.x += dx * 0.002;
                p.y += dy * 0.002;
            }

            // Sync buffer positions with parallax
            positions[i * 3] = p.x;
            positions[i * 3 + 1] = p.y - scrollOffset;
            positions[i * 3 + 2] = p.z;

            // Connect lines & Triangles
            for (let j = i + 1; j < this.pointsCount; j++) {
                const p2 = this.particles[j];
                const dist2 = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));

                if (dist2 < maxDist) {
                    if (lineIndex / 6 < this.maxLines) {
                        lp[lineIndex++] = p.x;
                        lp[lineIndex++] = p.y - scrollOffset;
                        lp[lineIndex++] = p.z;
                        lp[lineIndex++] = p2.x;
                        lp[lineIndex++] = p2.y - scrollOffset;
                        lp[lineIndex++] = p2.z;
                    }

                    // Look for 3rd point for triangle
                    for (let k = j + 1; k < this.pointsCount; k++) {
                        const p3 = this.particles[k];
                        const dist3 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));

                        if (dist3 < maxDist * 0.8 && triIndex / 9 < this.maxTriangles) {
                            tp[triIndex++] = p.x;
                            tp[triIndex++] = p.y - scrollOffset;
                            tp[triIndex++] = p.z;
                            tp[triIndex++] = p2.x;
                            tp[triIndex++] = p2.y - scrollOffset;
                            tp[triIndex++] = p2.z;
                            tp[triIndex++] = p3.x;
                            tp[triIndex++] = p3.y - scrollOffset;
                            tp[triIndex++] = p3.z;
                        }
                    }
                }
            }
        }

        // Zero out remaining positions
        while (lineIndex < lp.length) lp[lineIndex++] = 0;
        while (triIndex < tp.length) tp[triIndex++] = 0;

        this.geometry.attributes.position.needsUpdate = true;
        this.lineGeometry.attributes.position.needsUpdate = true;
        this.triGeometry.attributes.position.needsUpdate = true;

        this.renderer.render(this.scene, this.camera);
    }
}
