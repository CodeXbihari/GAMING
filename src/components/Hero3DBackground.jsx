import React, { useEffect, useRef } from 'react';

/**
 * Hero3DBackground
 * An interactive, 60fps 3D canvas background rendering:
 * 1. An undulating 3D perspective cyber grid receding into the horizon with neon pulses.
 * 2. Floating 3D geometric glass polyhedra (cyber shards/crystals) that rotate in 3D space.
 * 3. Volumetric glowing nebula blooms and mouse-following ambient light.
 * 4. Ambient 3D cyber dust particles that react to cursor movement.
 */
export const Hero3DBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let isVisible = true;

    // Mouse coordinates & smoothed camera tilt
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / width - 0.5) * 2; // -1 to 1
      mouse.targetY = (clientY / height - 0.5) * 2; // -1 to 1
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Resize
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Visibility observer to save battery/GPU when scrolled away
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    // -------------------------------------------------------------
    // 3D FLOATING POLYHEDRA DEFINITIONS (Real 3D Vertices & Edges)
    // -------------------------------------------------------------
    // Octahedron template
    const octahedronVerts = [
      { x: 0, y: -1, z: 0 },
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 1, z: 0 }
    ];
    const octahedronEdges = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [5, 1], [5, 2], [5, 3], [5, 4],
      [1, 2], [2, 3], [3, 4], [4, 1]
    ];

    // Hexahedron (Cube) template
    const cubeVerts = [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 }
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    // Instantiate floating 3D objects
    const objects = [
      {
        verts: octahedronVerts,
        edges: octahedronEdges,
        pos: { x: -0.38, y: -0.22, z: 2.2 },
        scale: 44,
        rot: { x: 0.2, y: 0.5, z: 0.1 },
        rotSpeed: { x: 0.006, y: 0.009, z: 0.004 },
        floatPhase: 0,
        color: 'rgba(198, 255, 0, 0.45)',
        fillColor: 'rgba(198, 255, 0, 0.04)'
      },
      {
        verts: cubeVerts,
        edges: cubeEdges,
        pos: { x: 0.42, y: -0.28, z: 2.6 },
        scale: 32,
        rot: { x: 0.6, y: 0.2, z: 0.8 },
        rotSpeed: { x: -0.005, y: 0.007, z: -0.003 },
        floatPhase: 2.1,
        color: 'rgba(198, 255, 0, 0.35)',
        fillColor: 'rgba(198, 255, 0, 0.03)'
      },
      {
        verts: octahedronVerts,
        edges: octahedronEdges,
        pos: { x: 0.35, y: 0.32, z: 2.4 },
        scale: 28,
        rot: { x: 0.9, y: 0.4, z: 0.3 },
        rotSpeed: { x: 0.008, y: -0.005, z: 0.006 },
        floatPhase: 4.2,
        color: 'rgba(212, 255, 51, 0.35)',
        fillColor: 'rgba(212, 255, 51, 0.03)'
      },
      {
        verts: cubeVerts,
        edges: cubeEdges,
        pos: { x: -0.42, y: 0.26, z: 2.8 },
        scale: 24,
        rot: { x: 0.3, y: 0.8, z: 0.5 },
        rotSpeed: { x: 0.004, y: 0.006, z: 0.005 },
        floatPhase: 1.4,
        color: 'rgba(198, 255, 0, 0.28)',
        fillColor: 'rgba(198, 255, 0, 0.02)'
      }
    ];

    // -------------------------------------------------------------
    // AMBIENT 3D CYBER DUST PARTICLES
    // -------------------------------------------------------------
    const particleCount = 48;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: 1 + Math.random() * 2.5,
      speedY: 0.0008 + Math.random() * 0.0012,
      size: 1 + Math.random() * 2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      alpha: 0.15 + Math.random() * 0.35
    }));

    // Time counter
    let time = 0;

    // -------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------
    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      time += 0.016;

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.48; // vanishing horizon center
      const fov = Math.min(width, height) * 0.95;

      // 1. Draw Volumetric Dynamic Cursor Spotlight
      const mousePixelX = (mouse.x * 0.5 + 0.5) * width;
      const mousePixelY = (mouse.y * 0.5 + 0.5) * height;
      const cursorGlow = ctx.createRadialGradient(mousePixelX, mousePixelY, 0, mousePixelX, mousePixelY, Math.min(width, height) * 0.45);
      cursorGlow.addColorStop(0, 'rgba(198, 255, 0, 0.07)');
      cursorGlow.addColorStop(0.5, 'rgba(198, 255, 0, 0.02)');
      cursorGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Top & Center Atmospheric Acid-Lime Halos
      const centerHalo = ctx.createRadialGradient(cx + mouse.x * 50, cy * 0.7 + mouse.y * 30, 0, cx, cy, Math.min(width, height) * 0.65);
      centerHalo.addColorStop(0, 'rgba(198, 255, 0, 0.11)');
      centerHalo.addColorStop(0.4, 'rgba(14, 25, 12, 0.25)');
      centerHalo.addColorStop(1, 'transparent');
      ctx.fillStyle = centerHalo;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw 3D Perspective Ground Cyber Grid
      const horizonY = cy + mouse.y * 20;
      const gridDepthLines = 22;
      const gridScroll = (time * 0.6) % 1;

      ctx.save();
      ctx.lineWidth = 1;

      // Receding horizontal lines in 3D perspective
      for (let i = 0; i < gridDepthLines; i++) {
        const depthFactor = (i + gridScroll) / gridDepthLines;
        // Exponential spacing for natural 3D depth
        const screenY = horizonY + Math.pow(depthFactor, 2.4) * (height - horizonY);

        if (screenY <= horizonY || screenY > height) continue;

        const lineAlpha = Math.pow(depthFactor, 1.8) * 0.35;
        const pulse = Math.sin(time * 2 - i * 0.4) * 0.15;
        const finalAlpha = Math.max(0.02, Math.min(0.5, lineAlpha + pulse));

        ctx.strokeStyle = `rgba(198, 255, 0, ${finalAlpha})`;
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.stroke();
      }

      // Vanishing longitudinal lines radiating from horizon
      const longitudinalCount = 28;
      for (let j = -longitudinalCount / 2; j <= longitudinalCount / 2; j++) {
        const xOffset = (j / (longitudinalCount / 2)) * (width * 1.6);
        const bottomX = cx + xOffset + mouse.x * 60;
        const topX = cx + (j / (longitudinalCount / 2)) * 30;

        const distFromCenter = Math.abs(j) / (longitudinalCount / 2);
        const alpha = Math.max(0.02, (1 - distFromCenter * 0.7) * 0.2);

        ctx.strokeStyle = `rgba(198, 255, 0, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizon atmospheric beam
      const horizonBeam = ctx.createLinearGradient(0, horizonY - 2, 0, horizonY + 3);
      horizonBeam.addColorStop(0, 'transparent');
      horizonBeam.addColorStop(0.5, 'rgba(198, 255, 0, 0.4)');
      horizonBeam.addColorStop(1, 'transparent');
      ctx.fillStyle = horizonBeam;
      ctx.fillRect(0, horizonY - 2, width, 5);

      ctx.restore();

      // 4. Draw Floating 3D Polyhedra (Glass Crystals)
      objects.forEach((obj) => {
        // Update rotation
        obj.rot.x += obj.rotSpeed.x;
        obj.rot.y += obj.rotSpeed.y;
        obj.rot.z += obj.rotSpeed.z;

        // Floating vertical bobbing
        const floatY = Math.sin(time * 1.2 + obj.floatPhase) * 0.04;
        
        // 3D position with camera tilt parallax
        const worldX = obj.pos.x * width + mouse.x * 40;
        const worldY = (obj.pos.y + floatY) * height + mouse.y * 30;
        const worldZ = obj.pos.z;

        // Rotation matrix calculations
        const cosX = Math.cos(obj.rot.x);
        const sinX = Math.sin(obj.rot.x);
        const cosY = Math.cos(obj.rot.y);
        const sinY = Math.sin(obj.rot.y);
        const cosZ = Math.cos(obj.rot.z);
        const sinZ = Math.sin(obj.rot.z);

        // Project vertices into 2D screen space
        const projected = obj.verts.map((v) => {
          // Local scale
          let x = v.x * obj.scale;
          let y = v.y * obj.scale;
          let z = v.z * obj.scale;

          // Yaw (around Y)
          const x1 = x * cosY + z * sinY;
          const z1 = -x * sinY + z * cosY;

          // Pitch (around X)
          const y2 = y * cosX - z1 * sinX;
          const z2 = y * sinX + z1 * cosX;

          // Roll (around Z)
          const x3 = x1 * cosZ - y2 * sinZ;
          const y3 = x1 * sinZ + y2 * cosZ;

          // Position in camera 3D space
          const finalX = worldX + x3;
          const finalY = worldY + y3;
          const finalZ = worldZ + z2 / 200;

          // Perspective division
          const projScale = fov / (finalZ * 500);
          return {
            x: cx + finalX * projScale,
            y: cy + finalY * projScale,
            z: finalZ
          };
        });

        // Draw translucent glass crystal faces
        ctx.save();
        ctx.fillStyle = obj.fillColor;
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = 1.2;

        // Render wireframe edges
        obj.edges.forEach(([i1, i2]) => {
          const p1 = projected[i1];
          const p2 = projected[i2];
          if (!p1 || !p2) return;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });

        // Draw glowing vertex points
        projected.forEach((p) => {
          ctx.fillStyle = '#C6FF00';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      });

      // 5. Draw 3D Floating Cyber Dust Particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        if (p.y < -1) p.y = 1;

        p.pulse += p.pulseSpeed;
        const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.15;

        // 3D projection
        const projScale = fov / (p.z * 500);
        const px = cx + (p.x * width * 0.5 + mouse.x * 25) * projScale;
        const py = cy + (p.y * height * 0.5 + mouse.y * 25) * projScale;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          ctx.fillStyle = `rgba(198, 255, 0, ${Math.max(0.05, currentAlpha)})`;
          ctx.beginPath();
          ctx.arc(px, py, p.size * projScale * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none -z-10"
      style={{ opacity: 0.92 }}
    />
  );
};
