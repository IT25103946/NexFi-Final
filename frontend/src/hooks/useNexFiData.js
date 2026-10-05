import { useCallback, useEffect, useState } from 'react'

/**
 * Loads a record list from the API and exposes add/edit/delete helpers.
 * Saving state is tracked so forms can show progress.
 */
export function useCollection({ load, create, update, remove }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    load()
      .then((data) => {
        if (ignore) return
        setItems(data ?? [])
        setError('')
      })
      .catch((loadError) => {
        if (!ignore) setError(loadError.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [load])

  /** Manual reload, used by the refresh buttons. */
  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await load()
      setItems(data ?? [])
      setError('')
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [load])

  const run = useCallback(
    async (action) => {
      setSaving(true)
      try {
        await action()
        const data = await load()
        setItems(data ?? [])
        setError('')
      } catch (saveError) {
        setError(saveError.message)
        throw saveError
      } finally {
        setSaving(false)
      }
    },
    [load],
  )

  return {
    items,
    loading,
    saving,
    error,
    refresh,
    add: (body) => run(() => create(body)),
    edit: (id, body) => run(() => update(id, body)),
    discard: (id) => run(() => remove(id)),
  }
}

/** Loads a single summary object such as the dashboard or forecast snapshot. */
export function useSnapshot(load) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    load()
      .then((result) => {
        if (ignore) return
        setData(result)
        setError('')
      })
      .catch((loadError) => {
        if (!ignore) setError(loadError.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [load])

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setData(await load())
      setError('')
    } catch (loadError) {
      setError(loadError.message)
    } finally {
      setLoading(false)
    }
  }, [load])

  return { data, loading, error, refresh }
}
