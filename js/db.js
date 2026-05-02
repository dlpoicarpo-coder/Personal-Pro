// ========================================
// PERSONAL PRO — Supabase Wrapper
// ========================================

const supabaseUrl = 'https://vbxedlloesvjpqzunqyv.supabase.co'; 
const supabaseKey = 'sb_publishable_d4P6mzDj_sSUpFibSGUcdg_2GOsD35E';

// Initialize Supabase client (requires script tag in index.html)
const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

class Database {
  constructor() {
    this.supabase = supabase;
    if (!this.supabase) {
      console.error("Supabase client não encontrado. Verifique se o script está no index.html");
    }
  }

  // Define keys for specific stores if needed (default is 'id')
  _getKeyPath(storeName) {
    return 'id';
  }

  async get(storeName, id) {
    if (!this.supabase) return null;
    const key = this._getKeyPath(storeName);
    const { data, error } = await this.supabase
      .from(storeName)
      .select('*')
      .eq(key, id)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned", which is fine for get
      console.error(`Supabase error getting ${id} from ${storeName}:`, error.message);
      return null;
    }
    return data || null;
  }

  async getAll(storeName) {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from(storeName)
      .select('*');
      
    if (error) {
      console.error(`Supabase error getAll ${storeName}:`, error.message);
      return [];
    }
    return data || [];
  }

  async getByIndex(storeName, indexName, value) {
    if (!this.supabase) return [];
    const { data, error } = await this.supabase
      .from(storeName)
      .select('*')
      .eq(indexName, value);
      
    if (error) {
      console.error(`Supabase error getByIndex ${storeName}:`, error.message);
      return [];
    }
    return data || [];
  }

  async put(storeName, data) {
    if (!this.supabase) return data;
    if (!data.id) data.id = crypto.randomUUID();
    data.updatedAt = new Date().toISOString();
    if (!data.createdAt) data.createdAt = new Date().toISOString();

    const { data: result, error } = await this.supabase
      .from(storeName)
      .upsert(data)
      .select()
      .single();
      
    if (error) {
      console.error(`Supabase error putting into ${storeName}:`, error.message);
      throw error;
    }
    return result;
  }

  async add(storeName, data) {
    return this.put(storeName, data); // Upsert handles adding
  }

  async delete(storeName, id) {
    if (!this.supabase) return;
    const key = this._getKeyPath(storeName);
    const { error } = await this.supabase
      .from(storeName)
      .delete()
      .eq(key, id);
      
    if (error) {
      console.error(`Supabase error deleting ${id} from ${storeName}:`, error.message);
      throw error;
    }
  }

  async clear(storeName) {
    if (!this.supabase) return;
    // Deleção de tudo requer uma condição no Supabase, então deletamos onde ID não é nulo.
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
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error(`Supabase error counting ${storeName}:`, error.message);
      return 0;
    }
    return count || 0;
  }
}

export const db = new Database();
export default db;
