// ─── Parcels data layer ─────────────────────────────────────────────────────
import { supabase } from '../../../lib/supabase';
import { currentUser } from '../state';
export async function fetchParcels(status) {
    if (!currentUser)
        return [];
    const { data, error } = await supabase
        .from('parcels').select('*')
        .eq('user_id', currentUser).eq('status', status)
        .order('position', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });
    if (error) {
        console.error('fetchParcels:', error);
        return [];
    }
    return (data || []);
}
export async function createParcelFromGuest(parcel) {
    const insertData = {
        user_id: currentUser, length: parcel.length, width: parcel.width,
        height: parcel.height, real_weight: parcel.real_weight, status: 'active',
    };
    const { data, error } = await supabase
        .from('parcels').insert(insertData)
        .select().single();
    if (error) {
        console.error('createParcelFromGuest:', error);
        return null;
    }
    return data;
}
export async function updateParcelDb(id, data) {
    const { error } = await supabase
        .from('parcels').update(data).eq('id', id);
    if (error) {
        console.error('updateParcelDb:', error);
        return false;
    }
    return true;
}
export async function emptyTrashDb() {
    if (!currentUser)
        return false;
    const { error } = await supabase
        .from('parcels').delete().eq('user_id', currentUser).eq('status', 'deleted');
    if (error) {
        console.error('emptyTrashDb:', error);
        return false;
    }
    return true;
}
export async function deleteParcelDb(id) {
    const { error } = await supabase.from('parcels').delete().eq('id', id);
    if (error) {
        console.error('deleteParcelDb:', error);
        return false;
    }
    return true;
}
/** Insert a new parcel immediately after `sourceIndex`, respecting position gaps. */
export async function insertParcelAfterIndex(parcels, sourceIndex, extraFields = {}) {
    const source = parcels[sourceIndex];
    const sourcePos = source.position ?? (sourceIndex + 1) * 10;
    const next = parcels[sourceIndex + 1];
    const nextPos = next ? (next.position ?? (sourceIndex + 2) * 10) : sourcePos + 20;
    let newPos = Math.round((sourcePos + nextPos) / 2);
    if (newPos === sourcePos || newPos === nextPos) {
        for (let i = 0; i < parcels.length; i++)
            await supabase.from('parcels').update({ position: (i + 1) * 10 }).eq('id', parcels[i].id);
        newPos = sourcePos + 5;
    }
    const insertData = {
        user_id: currentUser, length: source.length, width: source.width,
        height: source.height, real_weight: source.real_weight, status: 'active',
        ...extraFields,
    };
    const { data, error } = await supabase
        .from('parcels')
        .insert({ ...insertData, position: newPos })
        .select().single();
    if (error || !data)
        return null;
    return data;
}
