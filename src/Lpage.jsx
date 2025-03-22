import React from 'react'
import './Lpage.css'
import { useNavigate } from 'react-router-dom'
export default function Lpage() {
  const navigate=useNavigate()
  return (
    <>
    <header class="bg-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <a href="#" class="-m-1.5 p-1.5">
            <div class="flex flex-row">
          
          <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=blue&shade=500" alt=""/>
          <span class="not-sr-only mt-1 font-bold text-gray-900 ml-1">Fin</span>
          <span class="not-sr-only mt-1 font-bold text-blue-700 ">Track</span>
            </div>
        </a>
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <a href="#" class="text-sm/6 font-semibold text-gray-900">Sign in <span aria-hidden="true">&rarr;</span></a>
      </div>
    </nav>
</header>
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-18 pb-16 text-center ">
  <h1 class="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">Track,
  <span class="relative whitespace-nowrap text-blue-600">
    <svg aria-hidden="true" viewBox="0 0 418 42" class="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
    
    <span class="relative"> manage, save </span>
    
  </span>
  <div></div>
  — take control of your finances!
</h1>
<p class="mx-auto px-4 max-w-2xl mt-5 text-lg tracking-tight text-slate-700">Track your spending effortlessly! We analyze your expenses so you save smarter and budget better.</p>
<a class="mt-4 group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 bg-slate-900 text-white hover:bg-slate-700 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900" onClick={()=>{navigate('/signup')} }> Get Started</a>
</div>
    </>
  )
}
