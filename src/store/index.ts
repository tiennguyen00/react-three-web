import { create } from 'zustand'
import * as THREE from 'three'

interface TerrainGeometryProps {
  data: THREE.BufferGeometry | undefined
  setData: (v: THREE.BufferGeometry) => void
}

export const useTerrainGeometry = create<TerrainGeometryProps>((set) => ({
  data: undefined,
  setData: (v) =>
    set({
      data: v,
    }),
}))
