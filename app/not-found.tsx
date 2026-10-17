"use client"

import Link from "next/link"
import { Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-8">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-6 text-xl text-gray-600">Sorry, the page you’re looking for doesn’t exist.</p>
      <Link
        href="/"
        className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-white hover:bg-primary-700"
      >
        <Search size={20} className="mr-2" aria-hidden="true" />
        Go Home
      </Link>
    </div>
  )
}
