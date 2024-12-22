import { create } from 'zustand'
import * as THREE from 'three'

interface TerrainGeometryProps {
  data: any | undefined
  setData: (v: any) => void
}

export const useTerrainGeometry = create<TerrainGeometryProps>((set) => ({
  data: undefined,
  setData: (v) =>
    set({
      data: v,
    }),
}))
