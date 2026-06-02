// ─── Guest mode (localStorage-only parcels) ─────────────────────────────────
import { GUEST_STORAGE_KEY } from './state';
export function getGuestParcels() {
    const stored = localStorage.getItem(GUEST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}
export function saveGuestParcels(parcels) {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(parcels));
}
