import React from 'react'

export default function Header() {
  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <h1 className="text-xl font-bold">Trading</h1>
      <ul className="flex items-center gap-4">
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Stocks</a>
        </li>
        <li>
          <a href="#">Settings</a>
        </li>
      </ul>
    </nav>
  )
}
