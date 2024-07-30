import {
	BoxGeometry,
	CanvasTexture,
	Float32BufferAttribute,
	Mesh,
	MeshStandardMaterial
} from 'three';

class StockGeometry extends Mesh {
	constructor(
		width: number,
		height: number,
		depth: number,
		segW: number,
		segD: number,
		heightMap: CanvasTexture,
		displacementScale: number
	) {
		super();

		// pretend that Y is Z and Z is Y
		this.geometry = new BoxGeometry(width, height, depth, segW, 1, segD);
		this.rotateZ(Math.PI);
		const pos = this.geometry.attributes.position;
		const nor = this.geometry.attributes.normal;
		const enableDisplacement = [];
		for (let i = 0; i < pos.count; i++) {
			enableDisplacement.push(
				Math.sign(pos.getY(i)), // point can be displaced
				Math.sign(nor.getY(i)) // normal needs to be re-computed
			);
			//re-compute UV (for displacement)
			const u = (pos.getX(i) + width * 0.5) / width;
			const v = 1 - (pos.getZ(i) + depth * 0.5) / depth;
			this.geometry.attributes.uv.setXY(i, u, v);
		}
		this.geometry.setAttribute('enableDisp', new Float32BufferAttribute(enableDisplacement, 2));
		this.material = new MeshStandardMaterial({
			// wireframe: true,
			color: 'white',
			displacementMap: heightMap,
			displacementScale: displacementScale,
			// @ts-expect-error - false positive, onBeforeCompile does exist
			onBeforeCompile: (shader) => {
				shader.vertexShader = `
          attribute vec2 enableDisp;
          
          ${shader.vertexShader}
          `.replace(
					`#include <displacementmap_vertex>`,
					`
          #ifdef USE_DISPLACEMENTMAP
            if (enableDisp.x > 0.) {
              
              vec3 vUp = vec3(0, 1, 0);

              vec3 v0 = normalize( vUp ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
              transformed += v0;
              
              if(enableDisp.y > 0.) {
                float txl = 1. / 256.;

                vec3 v1 = normalize( vUp ) * ( texture2D( displacementMap, vDisplacementMapUv + vec2(txl, 0.) ).x * displacementScale + displacementBias );
                v1.xz = vec2(txl, 0.) * 20.;
                vec3 v2 = normalize( vUp ) * ( texture2D( displacementMap, vDisplacementMapUv + vec2(0., txl) ).x * displacementScale + displacementBias );
                v2.xz = -vec2(0., txl) * 20.;

                vec3 n = normalize(cross(v1 - v0, v2 - v0));
                vNormal = normalMatrix * n;
              }              
            }
          #endif
          `
				);
			}
		});
	}
}

export { StockGeometry };
