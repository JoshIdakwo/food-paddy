/* eslint-disable @next/next/no-img-element */
export default function SearchProduct({search}: any) {
    return (
      <>
        <main className="pb-8 text-center">
          <div className="search overflow-hidden pr-4 border border-slate-400 w-80 h-12 rounded-lg mx-auto flex items-center justify-center">
            {/* <input type="text" placeholder="Search" className="pl-4 outline-none bg-white/10 text-slate-800 border-none h-full w-full" /> */}
            <select
              className="pl-4 outline-none bg-white/10 text-slate-500 border-none h-full w-full"
              onChange={(e) => search({option: e.target.value})}
            >
              <option value="all">All</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            {/* <img width="25" height="25" className="ml-4 cursor-pointer" src="https://img.icons8.com/ios/50/search--v1.png" alt="search--v1"/> */}
          </div>
        </main>
      </>
    )
  }