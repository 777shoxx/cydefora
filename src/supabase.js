import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

function createDisabledAuthClient() {
  console.warn(
    'Supabase is not configured (missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY). ' +
    'Auth features are disabled; the rest of the site still works.'
  )

  const configError = () => new Error('Supabase is not configured.')

  function createQuery() {
    const query = {
      select: () => query,
      eq: () => query,
      insert: () => query,
      update: () => query,
      maybeSingle: async () => ({ data: null, error: null }),
      single: async () => ({ data: null, error: null })
    }
    return query
  }

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } }
      }),
      signInWithOAuth: async () => ({ error: configError() }),
      signInWithPassword: async () => ({ error: configError() }),
      signUp: async () => ({ data: { user: null }, error: configError() }),
      signOut: async () => ({ error: null }),
      updateUser: async () => ({ error: configError() })
    },
    from: () => createQuery(),
    rpc: async () => ({ data: null, error: configError() })
  }
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : createDisabledAuthClient()