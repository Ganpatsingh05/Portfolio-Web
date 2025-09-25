/// <reference types="react" />
/// <reference types="react-dom" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js components
      group: any;
      mesh: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      meshStandardMaterial: any;
      boxGeometry: any;
      sphereGeometry: any;
      cylinderGeometry: any;
      torusGeometry: any;
      icosahedronGeometry: any;
      dodecahedronGeometry: any;
      octahedronGeometry: any;
      coneGeometry: any;
      tetrahedronGeometry: any;
      planeGeometry: any;
      circleGeometry: any;
      ringGeometry: any;
      tubeGeometry: any;
      latheGeometry: any;
      extrudeGeometry: any;
      shapeGeometry: any;
      parametricGeometry: any;
      polyhedronGeometry: any;
      bufferGeometry: any;
      points: any;
      line: any;
      lineSegments: any;
      meshBasicMaterial: any;
      meshLambertMaterial: any;
      meshPhongMaterial: any;
      meshToonMaterial: any;
      meshNormalMaterial: any;
      meshMatcapMaterial: any;
      meshDepthMaterial: any;
      meshDistanceMaterial: any;
      pointsMaterial: any;
      lineBasicMaterial: any;
      lineDashedMaterial: any;
      shaderMaterial: any;
      rawShaderMaterial: any;
      spriteMaterial: any;
      shadowMaterial: any;
    }
  }
}

export {};
