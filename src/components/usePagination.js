/* usePagination.js — shared pagination state hook */
import { useState } from 'react'

export default function usePagination(data, defaultPerPage = 10) {
  const [page, setPage]       = useState(1)
  const [perPage, setPerPage] = useState(defaultPerPage)

  // Reset to page 1 whenever the filtered data changes length
  const totalPages = Math.ceil(data.length / perPage)
  const safePage   = Math.min(page, Math.max(1, totalPages))

  const from  = (safePage - 1) * perPage
  const slice = data.slice(from, from + perPage)

  function onPage(p) {
    setPage(Math.max(1, Math.min(p, totalPages)))
  }

  function onPerPage(n) {
    setPerPage(n)
    setPage(1)
  }

  return {
    slice,           // the current page's rows — use this in the table
    page: safePage,
    perPage,
    total: data.length,
    offset: from,    // 0-based index of the first row on this page
    onPage,
    onPerPage,
    reset: () => setPage(1),  // call this whenever filters change
  }
}
