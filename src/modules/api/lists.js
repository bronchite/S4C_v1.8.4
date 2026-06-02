// ─── Lists data layer ───────────────────────────────────────────────────────
import { supabase } from '../../../lib/supabase';
import { currentUser } from '../state';
export async function fetchLists() {
    if (!currentUser)
        return [];
    const { data, error } = await supabase
        .from('lists').select('*').eq('user_id', currentUser)
        .order('created_at', { ascending: true });
    if (error)
        return [];
    return (data || []);
}
export async function createList(name) {
    if (!currentUser)
        return null;
    const { data, error } = await supabase
        .from('lists').insert({ user_id: currentUser, name }).select().single();
    if (error)
        return null;
    return data;
}
export async function addParcelToList(listId, parcelId) {
    const { error } = await supabase
        .from('parcel_list_items').insert({ list_id: listId, parcel_id: parcelId });
    return !error;
}
export async function fetchParcelsInList(listId) {
    if (!currentUser)
        return [];
    const { data, error } = await supabase
        .from('parcel_list_items')
        .select('parcel_id, position, parcels(*)')
        .eq('list_id', listId)
        .order('position', { ascending: true, nullsFirst: false })
        .order('added_at', { ascending: true });
    if (error)
        return [];
    return (data || []).map((item) => item.parcels).filter(Boolean);
}
export async function removeParcelFromList(listId, parcelId) {
    const { error } = await supabase
        .from('parcel_list_items').delete()
        .eq('list_id', listId).eq('parcel_id', parcelId);
    return !error;
}
export async function deleteList(listId) {
    const { error } = await supabase.from('lists').delete().eq('id', listId);
    return !error;
}
