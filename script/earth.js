(function () {
    const container = document.getElementById('globe-container');
    if (!container) return;

    // --- Configuration ---
    const config = {
        globeSize: 390,
        pointCount: 15000,
        arcCount: 0,
        colors: {
            seaBlue: 0xffffff,
            purple: 0x7a00ff,
            blue: 0x2d00ff,
            point: 0x6e4cd6,
            reddish: 0xff1e1e,
            white: 0xffffff
        }
    };

    let width = container.offsetWidth;
    let height = container.offsetHeight;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    // Initial camera zoom in for entrance
    camera.position.z = 2000;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const tiltGroup = new THREE.Group();
    scene.add(tiltGroup);

    const globeGroup = new THREE.Group();
    // Initial center position for entrance
    globeGroup.position.y = 0;
    tiltGroup.add(globeGroup);

    // --- Inner Core to Block Background ---
    const innerGeo = new THREE.SphereGeometry(config.globeSize - 2, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerSphere);

    // --- Create Dotted Globe ---
    const pointsGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.pointCount * 3);
    const colors = new Float32Array(config.pointCount * 3);

    // --- Create Outer Atmosphere (Scan shell) ---
    const atmosphereCount = 3000;
    const atmosphereGeometry = new THREE.BufferGeometry();
    const atmosPositions = new Float32Array(atmosphereCount * 3);

    const mainColor = new THREE.Color(config.colors.point);
    const seaBlue = new THREE.Color(config.colors.seaBlue);
    const purple = new THREE.Color(config.colors.purple);
    const reddish = new THREE.Color(config.colors.reddish);
    const blue = new THREE.Color(config.colors.blue);

    for (let i = 0; i < config.pointCount; i++) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const x = config.globeSize * Math.sin(phi) * Math.cos(theta);
        const y = config.globeSize * Math.sin(phi) * Math.sin(theta);
        const z = config.globeSize * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Gradient color based on position
        let mixedColor;
        const normY = (y / config.globeSize + 1) / 2; // 0 to 1
        if (normY < 0.33) {
            mixedColor = blue.clone().lerp(purple, normY * 3);
        } else if (normY < 0.66) {
            mixedColor = purple.clone().lerp(reddish, (normY - 0.33) * 3);
        } else {
            mixedColor = reddish.clone().lerp(seaBlue, (normY - 0.66) * 3);
        }

        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;

        if (i < atmosphereCount) {
            const atmosDist = config.globeSize + 15 + Math.random() * 20;
            atmosPositions[i * 3] = atmosDist * Math.sin(phi) * Math.cos(theta);
            atmosPositions[i * 3 + 1] = atmosDist * Math.sin(phi) * Math.sin(theta);
            atmosPositions[i * 3 + 2] = atmosDist * Math.cos(phi);
        }
    }

    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    function updateGlobeTheme(isLight) {
        if (innerSphere) {
            innerSphere.visible = !isLight;
        }
        const colorsAttr = pointsGeometry.getAttribute('color');
        const posAttr = pointsGeometry.getAttribute('position');
        
        for (let i = 0; i < config.pointCount; i++) {
            const y = posAttr.getY(i);
            const normY = (y / config.globeSize + 1) / 2;
            let mixedColor;

            if (isLight) {
                if (normY < 0.5) {
                    mixedColor = seaBlue.clone().lerp(purple, normY * 2);
                } else {
                    mixedColor = purple.clone().lerp(reddish, (normY - 0.5) * 2);
                }
            } else {
                if (normY < 0.33) {
                    mixedColor = blue.clone().lerp(purple, normY * 3);
                } else if (normY < 0.66) {
                    mixedColor = purple.clone().lerp(reddish, (normY - 0.33) * 3);
                } else {
                    mixedColor = reddish.clone().lerp(seaBlue, (normY - 0.66) * 3);
                }
            }
            colorsAttr.setXYZ(i, mixedColor.r, mixedColor.g, mixedColor.b);
        }
        colorsAttr.needsUpdate = true;
    }

    const pointsMaterial = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const globePoints = new THREE.Points(pointsGeometry, pointsMaterial);
    globeGroup.add(globePoints);

    // --- Atmosphere Material ---
    atmosphereGeometry.setAttribute('position', new THREE.BufferAttribute(atmosPositions, 3));
    const atmosMaterial = new THREE.PointsMaterial({
        size: 1.2,
        color: config.colors.seaBlue,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });
    const globeAtmosphere = new THREE.Points(atmosphereGeometry, atmosMaterial);
    globeGroup.add(globeAtmosphere);

    // --- Create Network Layers (Arcs) ---
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);

    function createArc() {
        const startPhi = Math.random() * Math.PI;
        const startTheta = Math.random() * 2 * Math.PI;
        const endPhi = Math.random() * Math.PI;
        const endTheta = Math.random() * 2 * Math.PI;

        const start = new THREE.Vector3().setFromSphericalCoords(config.globeSize, startPhi, startTheta);
        const end = new THREE.Vector3().setFromSphericalCoords(config.globeSize, endPhi, endTheta);

        const mid = start.clone().lerp(end, 0.5);
        const midLen = mid.length();
        mid.normalize().multiplyScalar(midLen * 1.5 + 50);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const arcColors = [config.colors.white];
        const randomColor = arcColors[Math.floor(Math.random() * arcColors.length)];

        const material = new THREE.LineBasicMaterial({
            color: randomColor,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const line = new THREE.Line(geometry, material);
        const pSize = 4;
        const pGeo = new THREE.SphereGeometry(pSize, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: randomColor, transparent: true, opacity: 0.9 });
        const particle = new THREE.Mesh(pGeo, pMat);

        return { line, curve, particle, t: Math.random() };
    }

    const arcs = [];
    for (let i = 0; i < config.arcCount; i++) {
        const arcData = createArc();
        arcsGroup.add(arcData.line);
        // arcsGroup.add(arcData.particle);
        arcs.push(arcData);
    }

    // --- Interaction ---
    let mouseX = 0, mouseY = 0;
    let targetRotationX = 0, targetRotationY = 0;
    let isRevealed = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2);
        mouseY = (e.clientY - window.innerHeight / 2);
    });

    // --- Entrance Animation Trigger ---
    function checkReveal() {
        if (!isRevealed && document.body.classList.contains('reveal-site')) {
            isRevealed = true;

            // Zoom out from center to position
            gsap.to(camera.position, {
                z: 800,
                duration: 2.2,
                ease: "power2.inOut",
                delay: 0.5
            });

            gsap.to(globeGroup.position, {
                y: -100, // Move to settled bottom position
                duration: 2.5,
                ease: "power2.inOut",
                delay: 0.5
            });

            gsap.from(globeGroup.rotation, {
                y: Math.PI * 2,
                duration: 3,
                ease: "power1.inOut",
                delay: 0.5
            });
        }
        if (!isRevealed) requestAnimationFrame(checkReveal);
    }
    checkReveal();

    // --- Animation Loop ---
    function animate() {
        requestAnimationFrame(animate);

        const currentThemeIsLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (window.lastThemeState !== currentThemeIsLight) {
            window.lastThemeState = currentThemeIsLight;
            if (typeof updateGlobeTheme === 'function') {
                updateGlobeTheme(currentThemeIsLight);
            }
        }

        // Continuous smooth auto-rotation
        globeGroup.rotation.y += 0.0015;
        globeAtmosphere.rotation.y -= 0.0005;

        // Mouse reaction applied as tilt to parent group
        targetRotationY = mouseX * 0.0003;
        targetRotationX = mouseY * 0.0003;

        tiltGroup.rotation.y += (targetRotationY - tiltGroup.rotation.y) * 0.05;
        tiltGroup.rotation.x += (targetRotationX - tiltGroup.rotation.x) * 0.05;

        arcs.forEach(arc => {
            arc.t += 0.005;
            if (arc.t > 1) {
                arc.t = 0;
            }
            const pos = arc.curve.getPointAt(arc.t);
            arc.particle.position.copy(pos);
            arc.particle.material.opacity = Math.sin(arc.t * Math.PI) * 0.8;
        });

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        width = container.offsetWidth;
        height = container.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
})();
