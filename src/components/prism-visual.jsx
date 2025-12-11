// src/components/prism-visual.jsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';

const PrismVisual = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Fixed dimensions for the corner visual
        const width = 500; 
        const height = 300; 

        const scene = new THREE.Scene();
        scene.background = null;

        scene.fog = new THREE.Fog(0xe0e0e0, 10, 50);

        // CAMERA
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 1, 12); // Position from original code

        // RENDERER
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        
        const container = mountRef.current;
        container.appendChild(renderer.domElement);

        // LIGHTING
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        
        const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
        backLight.position.set(-5, 3, -5);
        scene.add(backLight);

        // THE CRYSTAL
        const geometry = new THREE.OctahedronGeometry(1.5, 0); 

        const crystalMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd2d2d2ff, //'#d2d2d2ff',//0xccccccff,
            metalness: 0.1,
            roughness: 0.0,        // Restored: Slight roughness
            transmission: 1.0,      
            thickness: 2.5,         // Restored: Thicker glass
            ior: 1.6,               
            dispersion: 1.0,        // Restored: Stronger dispersion
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            envMapIntensity: 3.0,
            iridescence: 1.0, 
            iridescenceIOR: 1.3,
            iridescenceThicknessRange: [100,400]    
        });

        const crystal = new THREE.Mesh(geometry, crystalMaterial);
        scene.add(crystal);

        const flashLight = new THREE.PointLight(0xffffff, 10.0, 15)
        flashLight.position.set(2, 2, 8)
        scene.add(flashLight)

        // POST-PROCESSING
        const composer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);
        composer.addPass(renderPass);

        // GLOW?
        const textureLoader = new THREE.TextureLoader();
        const glowTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/glow.png');

        const glowMaterial = new THREE.SpriteMaterial({ 
            map: glowTexture, 
            color: 0xbcbcbcff, // White glow (or match your crystal color)
            transparent: true, 
            opacity: 0.7,    // Adjust brightness
            blending: THREE.AdditiveBlending // CRITICAL: Makes it look like light
        });
        const glowSprite = new THREE.Sprite(glowMaterial);

        // Position and Scale it
        // Scale should be slightly larger than your crystal (e.g., 3x3 if crystal is 1.5)
        glowSprite.scale.set(4, 4, 1); 
        glowSprite.position.copy(crystal.position); // Put it exactly where the crystal is
        scene.add(glowSprite);

        // Film Grain
        const filmPass = new FilmPass(0.5, 0.0, 0, false);
        composer.addPass(filmPass);

        // Gamma Correction
        const gammaCorrectionPass = new ShaderPass( GammaCorrectionShader );
        composer.addPass( gammaCorrectionPass );

        // ANIMATION LOOP
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.minPolarAngle = Math.PI / 3;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.enableZoom = false;

        let animationId;
        const animate = () => {
            animationId = requestAnimationFrame(animate);
            const time = performance.now() / 3000;
            
            // Restored original animation logic
            crystal.position.y = Math.sin(time) * 0.2;
            crystal.rotation.y += 0.002;
            crystal.rotation.z -= 0.001;

            controls.update();
            composer.render();
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            if (container && renderer.domElement) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            scene.clear();
        };
    }, []);

    return <div ref={mountRef} className="prism-container" />;
};

export default PrismVisual;

        