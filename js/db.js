// ========================================
// PERSONAL PRO — Supabase Wrapper (NoSQL Mode)
// ========================================

const supabaseUrl = 'https://vbxedlloesvjpqzunqyv.supabase.co'; 
const supabaseKey = 'sb_publishable_d4P6mzDj_sSUpFibSGUcdg_2GOsD35E';

// Initialize Supabase client
const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

class Database {
  constructor() {
    this.supabase = supabase;
    if (!this.supabase) {
      console.error("Supabase client não encontrado no window.");
    }
  }

  async get(storeName, id) {
    if (!this.supabase) return null;
    const { data, error } = await this.supabase
      .from(storeName)
      .select('data')
      .eq('id', id)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error(`Supabase error getting ${id} from ${storeName}:`, error.message);
      return null;
    }
    return data ? data.data : null;
  }

  async getAll(storeName) {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from(storeName)
      .select('data');
      
    if (error) {
      console.error(`Supabase error getAll ${storeName}:`, error.message);
      return [];
    }
    return data ? data.map(row => row.data) : [];
  }

  async getByIndex(storeName, indexName, value) {
    // NoSQL mode: we fetch all and filter in memory, OR we can use JSONB querying.
    // For simplicity and compatibility with IndexedDB limits, we fetch and filter.
    if (!this.supabase) return [];
    const all = await this.getAll(storeName);
    return all.filter(item => item && item[indexName] === value);
  }

  async put(storeName, item) {
    if (!this.supabase) return item;
    if (!item.id) item.id = crypto.randomUUID();
    item.updatedAt = new Date().toISOString();
    if (!item.createdAt) item.createdAt = new Date().toISOString();

    const payload = {
      id: item.id,
      data: item
    };

    const { error } = await this.supabase
      .from(storeName)
      .upsert(payload);
      
    if (error) {
      console.error(`Supabase error putting into ${storeName}:`, error.message);
      throw error;
    }
    return item;
  }

  async add(storeName, item) {
    return this.put(storeName, item);
  }

  async delete(storeName, id) {
    if (!this.supabase) return;
    const { error } = await this.supabase
      .from(storeName)
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error(`Supabase error deleting ${id} from ${storeName}:`, error.message);
      throw error;
    }
  }

  async clear(storeName) {
    if (!this.supabase) return;
    const { error } = await this.supabase
      .from(storeName)
      .delete()
      .not('id', 'is', null);
      
    if (error) console.error(`Erro ao limpar ${storeName}:`, error.message);
  }

  async count(storeName) {
    if (!this.supabase) return 0;
    const { count, error } = await this.supabase
      .from(storeName)
      .select('id', { count: 'exact', head: true });
      
    if (error) {
      console.error(`Supabase error counting ${storeName}:`, error.message);
      return 0;
    }
    return count || 0;
  }
}

export const db = new Database();
export default db;
