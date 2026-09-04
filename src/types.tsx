
export interface Thumbnail {
    dtag: string;
    event_idx: number;
    build_score: number;
    site_idx: number; 
    z_peak: number; 
    r_free: number; 
    r_work: number; 
    analysed_resolution: number;
    event_thumbnail: string;
    event_gif: string | null;
    fofc_thumbnail: string;
    fofc_gif: string | null;
    mtz_thumbnail: string;
    mtz_gif: string | null;
    overlay_thumbnail: string;
    overlay_gif: string | null;
    clash_thumbnail: string | null;
    clash_gif: string | null;
    id: string;
}